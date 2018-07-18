import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { WebsiteService } from './website.service';
import { IWebsite, Website } from './IWebsite';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';  //NgForm,
import { IMessage, Message } from '../shared/imessage';
// import { Subscription } from 'rxjs';
import { debounceTime, takeWhile } from 'rxjs/operators';
import { PurchaseParameterService } from './purchase-parameter.service';
import * as fromWebsites from './state/website.reducer';
import * as websiteActions from './state/website.action';
import { Store } from '@ngrx/store';


@Component({
    templateUrl: './website-detail.component.html'
})

export class WebsiteDetailComponent implements OnDestroy, OnInit {

    website: IWebsite = new Website();
    popup : IMessage;
    websiteForm: FormGroup;
    websiteNameMsg:string;
    urlMsg: string;
    componentActive = true;

    get websiteNameDisplay (): string {
        return this.purchaseParams.websiteName;
    }
    set websiteNameDisplay(value:string) {
        this.purchaseParams.websiteName = value;
    }

    private validationMessages: { [key: string]: { [key: string]: string } };
    // private sub: Subscription;
    // private subWebsiteName: Subscription;
    // private subUrl: Subscription;

    constructor(  private route: ActivatedRoute,
                  private router: Router,
                  private websiteService: WebsiteService,
                  private fb: FormBuilder,
                  private purchaseParams: PurchaseParameterService,
                  private store: Store<fromWebsites.State>) {
                    // Define all of the validation messages for the form.
                    this.validationMessages = {
                        url: {
                            pattern: 'Please supply a valid url, or leave it blank.',
                        },
                        websiteName: {
                            required: 'Website name is required.'
                        }
                    };
    }//constructor

    ngOnInit() {

        this.websiteForm = this.fb.group({
            url:        ['', [Validators.pattern('https?://.+')]],
            websiteName:['', [Validators.required]],
            username:   [''],
            email:      '',
            password:   '',
            notes:      '',
            preferred: true,
            isBill: false
        });  //websiteForm

        // const urlControl = this.websiteForm.get('url');
        // this.subUrl = urlControl.valueChanges
        //         .pipe(debounceTime(1000))
        //         .subscribe(value =>
        //                 this.setMessage(urlControl, 'url')
        // );
        const urlControl = this.websiteForm.get('url');
        urlControl.valueChanges
                .pipe(
                    debounceTime(1000),
                    takeWhile(() => this.componentActive)
                )//pipe
                .subscribe(value =>
                        this.setMessage(urlControl, 'url')
        );

        // const websiteNameControl = this.websiteForm.get('websiteName');
        // this.subWebsiteName = websiteNameControl.valueChanges
        //         // .pipe(debounceTime(1000))
        //         .subscribe(value => {
        //                     this.websiteNameDisplay = value;
        //                     this.setMessage(websiteNameControl, 'websiteName');
        //                 }
        // );
        const websiteNameControl = this.websiteForm.get('websiteName');
        websiteNameControl.valueChanges
                // .pipe(debounceTime(1000))
                .pipe(
                    debounceTime(1000),
                    takeWhile(() => this.componentActive)
                )//pipe
                .subscribe(value => {
                    this.websiteNameDisplay = value;
                    this.setMessage(websiteNameControl, 'websiteName');
                }); //subscribe

        // this.sub = this.route.data.subscribe(  //https://angular.io/guide/router says that unsubscribing to activated route in unnecessary
        //     data => this.onResolved(data['website'])
        // );
        this.route.data
            .pipe(
                takeWhile(() => this.componentActive)
            )//pipe
            .subscribe(  //https://angular.io/guide/router says that unsubscribing to activated route is unnecessary
                data => this.onResolved(data['website'])
            ); //subscribe
    }//ngOnInit


   setMessage(c: AbstractControl, name: string): void {
        switch (name)   {
            case 'websiteName':
                this.websiteNameMsg = '';
                if ((c.touched || c.dirty) && c.errors) {
                    this.websiteNameMsg = Object.keys(c.errors).map(key =>
                            this.validationMessages.websiteName[key]).join(' ');
                }
                break;
            case 'url':
                this.urlMsg = '';
              if ((c.touched || c.dirty) && c.errors) {
                    this.urlMsg = Object.keys(c.errors).map(key =>
                            this.validationMessages.url[key]).join(' ');
                }
                break;
        } //switch

    } //setMessage

    /////////getting
    onResolved(website: IWebsite): void {
        if (website) {
            if (this.websiteForm) {
                this.websiteForm.reset();  //resets validation values and empties values
            }
            this.website = website;
            //store this as the selected website
            this.store.dispatch(new websiteActions.SetCurrentWebsite(this.website));

        } else {
            this.website = new Website();
            this.popup = new Message('alert', 'Sorry, an error occurred while getting the website.', "", 0);
        }

        // Update the data on the form
        this.websiteForm.patchValue({  //have to use patchValue not setValue because ? fb.array needs patchValue
            url: this.website.url,
            websiteName: this.website.websiteName,
            username: this.website.username,
            email: this.website.email,
            password: this.website.password,
            notes: this.website.notes,
            preferred: this.website.preferred,
            isBill: this.website.isBill
        });
        this.websiteNameDisplay = this.website.websiteName;

        // window.scrollTo(0, 0);

    } //onResolved

    /////////deleting
    deleteIt(): void{
        this.popup = new Message('confirm', 'Are sure you want to delete this website and all it\'s purchases ?', "onComplete", 0);
    }

    onComplete(event:any):void {
        //if they confirm in the message-component dialog launched by this.deleteIt();
        this.websiteService.deleteWebsite(this.website.websiteID)
                    .subscribe(val =>
                        {
                            if (val)
                            {
                                //show success msg for 1 sec then route back to websites list
                                this.popup = new Message('timedAlert', 'Delete was successful!', "", 1000);
                                setTimeout (() => {
                                    this.router.navigate(['/websites']);
                                }, 1000);
                            } else {
                                this.deleteError();
                            }
                        },
                        error => this.deleteError()

                    );//subscribe
    }//onConfirmDelete

    deleteError(): void {
        this.popup = new Message('alert', 'Sorry, an error occurred while deleting the website.', "", 0);
    }

    /////////saving
    saveIt(): void{
        // this.website: original data bound to template
        // this.websiteForm.value: new form data on template now
        let w = Object.assign({}, this.website, this.websiteForm.value);
        console.log(w);  //w: object with new form data

        this.websiteService.saveWebsite(w)
            .subscribe(webserviceWebsiteID =>
                    {

                        if (webserviceWebsiteID === null) {
                            this.saveError();
                        } else {

                            //We now have to update the component with a reroute back to this component or will have problems: and the url still says id = 0, and more issues as user keeps adding new websites.
                            //Delay the re-route for a bit so user can see the saved message first.
                            this.popup = new Message('timedAlert', 'Save was successful!', "", 1000);

                            // window.scrollTo(0, 0);
                            setTimeout (() => {
                               this.router.navigate(['/websites/', webserviceWebsiteID, 'detail']);
                            }, 1000);
                        }

                    },
                    error => this.saveError()

                ); //subscribe

    }//save it

    saveError() : void {
        this.popup = new Message('alert', 'Sorry, an error occurred while saving the website.', "", 0);
        window.scrollTo(0, 0);
    }

    openWebsite(): void{
        if (this.website.url && this.website.url.length > 0) {
            let win=window.open(this.website.url, '_blank');
        }
    }

    ngOnDestroy(): void {
        // this.sub.unsubscribe();
        // this.subWebsiteName.unsubscribe();
        // this.subUrl.unsubscribe();
        this.componentActive = false;
    }

  }//class


