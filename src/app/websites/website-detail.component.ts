import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { WebsiteService } from './website.service';
import { IWebsite, Website } from './IWebsite';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';  //NgForm,
import { IMessage, Message } from '../shared/imessage';
import { debounceTime, takeWhile } from 'rxjs/operators';
import { PurchaseParameterService } from './purchase-parameter.service';
import * as fromWebsites from './state/website.reducer';
import * as websiteActions from './state/website.action';
import { Store, select } from '@ngrx/store';
// import { Observable } from 'rxjs';

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
    websiteDeleted = false;
    // error: Observable<string>;

    get websiteNameDisplay (): string {
        return this.purchaseParams.websiteName;
    }
    set websiteNameDisplay(value:string) {
        this.purchaseParams.websiteName = value;
    }

    private validationMessages: { [key: string]: { [key: string]: string } };

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
        this.createWebsiteForm();
        this.addWebsiteToStore();
        this.getWebsiteFromStore();
        this.watchForUrlChanges();
        this.watchForNameChanges();
        // this.watchForErrors();

    }

    addWebsiteToStore(): void {
        //get the id from the route
        let websiteId = 0;
        this.route.params.subscribe( params =>  websiteId = +params['id']);

        if (websiteId === 0) {
            //store an initialized website
            this.store.dispatch(new websiteActions.InitializeCurrentWebsite());
        } else if (websiteId > 0) {
            //call http to store new website
            this.store.dispatch(new websiteActions.LoadCurrentWebsite(websiteId));
        } else {
            this.popup = new Message('alert', 'Sorry, an error has occurred while loading the website.', "", 0);
        }
    }//addWebsiteToStore

    createWebsiteForm():void {
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
    }

    watchForUrlChanges(): void {
        const urlControl = this.websiteForm.get('url');
        urlControl.valueChanges
                .pipe(
                    debounceTime(1000),
                    takeWhile(() => this.componentActive)
                )//pipe
                .subscribe(value =>
                        this.setMessage(urlControl, 'url')
        );
    }

    watchForNameChanges(): void {
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
    }

    // watchForErrors () {
    //     this.error.pipe(
    //         takeWhile(() => this.componentActive)
    //     )
    //     .subscribe(err => {
    //         console.log('err', JSON.stringify(err));
    //     });
    //     // this.store
    //     //     .pipe(
    //     //             select(fromWebsites.getError),
    //     //             takeWhile(() => this.componentActive)
    //     //         )//pipe
    //     //     .subscribe(err => {
    //     //         console.log('err', JSON.stringify(err));
    //     //         if(err) {
    //     //             this.store.dispatch(new websiteActions.ClearCurrentError());
    //     //             this.popup = new Message('alert', 'Sorry.' + this.currentError, "", 0);
    //     //         }
    //     //     })//subscribe
    // }//watchForErrors

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

    getWebsiteFromStore() {
        //get current website when it's ready
        this.store
            .pipe(
                    select(fromWebsites.getCurrentWebsite),
                    takeWhile(() => this.componentActive)
                )//pipe
                .subscribe(website => {
                    if (website ) {
                        this.onLoadWebsiteForm(website);
                    } else {
                        //we may have deleted it.
                        if (this.websiteDeleted) {
                            this.websiteDeleted = false;
                            //show success msg for 1 sec then route back to websites list
                            this.popup = new Message('timedAlert', 'Delete was successful!', "", 1000);
                            setTimeout (() => {
                                this.router.navigate(['/websites']);
                            }, 1000);
                        }
                        //else we didn't delete it, but no website is there to load yet.
                    }
                })//subscribe
    }//getWebsiteFromStore

    onLoadWebsiteForm(website: IWebsite): void {
        if (website && this.websiteForm) {

            this.website = website;
            this.websiteForm.reset();  //resets validation values and empties values

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
            window.scrollTo(0, 0);
        }
    } //onLoadWebsiteForm

    newWebsite(): void {
        this.store.dispatch(new websiteActions.InitializeCurrentWebsite);
        this.router.navigate(['/websites', '0', 'detail']);
    }

    /////////deleting
    deleteIt(): void{
        this.popup = new Message('confirm', 'Are sure you want to delete this website and all it\'s purchases ?', "onComplete", 0);
    }
    onComplete(event:any):void {
        //they have just confirmed the delete
        this.websiteDeleted = true;
        this.store.dispatch(new websiteActions.DeleteWebsite(this.website.websiteID));
    }//onComplete

    //todo
    // deleteError(): void {
    //     this.popup = new Message('alert', 'Sorry, an error occurred while deleting the website.', "", 0);
    // }

    /////////saving
    saveIt(): void{
        // this.website: original data bound to template
        // this.websiteForm.value: new form data on template now
        // let w = Object.assign({}, this.website, this.websiteForm.value);
        let w = {...this.website, ...this.websiteForm.value};
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
        this.componentActive = false;
    }

  }//class


// --------------------
// figure out how to load the websites
// --------------------
// *****
// In the reducer file:
// *****
// State property:
// 	websites: IWebsite[]

// One selector:
// 	export const getWebsites = createSelector (
// 		getWebsiteFeatureState,
// 		state => state.websites
// 	);

// 2 switch statements
// 	case WebsiteActionTypes.LoadSuccess:
// 		return {
// 			...state,
// 			websites:  {...action.payload},
// 			error: ''
// 		}
// 	case WebsiteActionTypes.LoadFail:
// 		return {
// 			...state,
// 			websites: [],
// 			error: action.payload
// 		}

// *****
// In the actions file:
// *****
// 3 actions
//     Load = '[Website] Load',
//     LoadSuccess = '[Website] Load Success',
//     LoadFail = '[Website] Load Fail',

// 	export class Load implements Action {
// 		readonly type = WebsiteActionTypes.Load
// 		constructor (public payload: ISearch){}
// 	}
// 	export class LoadSuccess implements Action {
// 		readonly type = WebsiteActionTypes.LoadSuccess
// 		constructor (public payload: IWebsite[]){}
// 	}
// 	export class LoadFail implements Action {
// 		readonly type = WebsiteActionTypes.LoadFail
// 		constructor (public payload: string){}
// 	}

// *****
// In the effects file:
// *****
//     loadWebsites$: Observable<Action> = this.actions$
//         .pipe(
//             ofType(websiteActions.WebsiteActionTypes.Load),
//             map((action: websiteActions.Load) => action.payload),
//             mergeMap((searchParams: ISearch) =>
//                 this.websiteService.getWebsites(searchParams)
//                     .pipe(
//                         map(
//                             websites => (new websiteActions.LoadSuccess(websites))
//                          ),//map
//                         catchError(err => of(new websiteActions.LoadFail(err)))
//                     )//pipe
//             )//mergeMap
//         )//pipe

// *****
// In the component file:
// *****
// on init (import * as fromWebsites from './state/website.reducer';)
// read this selector in the reducer.
//         this.store
//             .pipe(
//                     select(fromWebsites.getWebsites),
//                     takeWhile(() => this.componentActive)
//                 )//pipe
//             .subscribe(websites => {
//                 this.websites = websites
//             })//subscribe
// On search dispatch an action to go load.
// 	this.store.dispatch(new websiteActions.Load(searchParams));
