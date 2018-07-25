import { Component,  OnDestroy, OnInit } from '@angular/core';
import { IPurchase, Purchase } from './IPurchase'
import { Router } from '@angular/router';
import { WebsiteService } from './website.service';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { IMessage, Message } from '../shared/imessage';
import { debounceTime, takeWhile } from 'rxjs/operators';
import * as fromWebsites from './state/website.reducer';
import * as websiteActions from './state/website.action';
import { Store, select } from '@ngrx/store';
import { IWebsite, Website } from './IWebsite';

@Component({
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css']
})

export class PurchaseComponent implements OnInit, OnDestroy {
    purchase: IPurchase = new Purchase();
    currentWebsite: IWebsite = new Website();
    productNameMsg:string;
    purchaseForm: FormGroup;
    popup : IMessage;
    a2eOptions: any = {format: 'M/D/YYYY'};
    componentActive = true;
    purchaseSaved = false;
    private validationMessages: { [key: string]: { [key: string]: string } };

    constructor(
        private router: Router,
        private websiteService: WebsiteService,
        private fb: FormBuilder,
        private store: Store<fromWebsites.State>) {

            // Define all of the validation messages for the form.
            this.validationMessages = {
                productName: {
                    required: 'Purchase name is required.'
                }
            };
    }//constructor

    ngOnInit():void {
        this.createPurchaseForm();
        this.watchForErrors();
        this.watchCurrentProduct();
        this.watchProductName();
        this.getWebsiteInfo();
    }

    watchCurrentProduct(): void {
        this.store.pipe(
                    select(fromWebsites.getCurrentPurchase),
                    takeWhile(() => this.componentActive),
                )
                .subscribe(currentPurchase => {
                     if (currentPurchase ) {
                        this.loadPurchaseForm(currentPurchase);
                        //if we just saved this site, then give message
                        if (this.purchaseSaved) {
                            this.purchaseSaved = false;
                            //refresh current website in the store so new purchase/values shows up in list when we navigate back to website-detail
                            this.store.dispatch(new websiteActions.LoadCurrentWebsite(this.currentWebsite.websiteID));
                            this.popup = new Message('timedAlert', 'Save was successful!', "", 1000);
                        }
                    }
                    // else {
                    //     //we don't have a website
                    //     //we may have deleted it.
                    //     if (this.websiteDeleted) {
                    //         this.websiteDeleted = false;
                    //         //show success msg for 1 sec then route back to websites list
                    //         this.popup = new Message('timedAlert', 'Delete was successful!', "", 1000);
                    //         setTimeout (() => {
                    //             this.router.navigate(['/websites']);
                    //         }, 1000);
                    //     } else {
                    //         //else //TODO  this is an unhandled error.
                    //     }
                    // }
                })//subscribe

    }//watchCurrentProduct

    loadPurchaseForm(purchase: IPurchase): void {
        if (purchase && this.purchaseForm) {
            this.purchaseForm.reset();
            this.purchase = purchase;

            this.purchaseForm.patchValue({
                purchaseID: this.purchase.purchaseID,
                productName: this.purchase.productName,
                purchasedOn:  this.purchase.purchasedOn,
                arrivedOn:  this.purchase.arrivedOn,
                totalAmount: this.purchase.totalAmount,
                shippingAmount:this.purchase.shippingAmount,
                notes: this.purchase.notes,
            });  //purchaseForm

            // window.scrollTo(0, 0);

        }
    }//loadPurchaseForm

    watchForErrors () {
            this.store
                .pipe(
                        select(fromWebsites.getError),
                        takeWhile(() => this.componentActive)
                    )//pipe
                .subscribe(err => {
                    console.log('err', JSON.stringify(err));
                    if(err) {
                        this.store.dispatch(new websiteActions.ClearCurrentError());
                        this.popup = new Message('alert', 'Sorry, an error has occurred', "", 0);
                    }
                })//subscribe
    }//watchForErrors

    getWebsiteInfo():void {
        this.store.pipe(
                    select(fromWebsites.getCurrentWebsite),
                    takeWhile(() => this.componentActive),
                )
                .subscribe(currentWebsite => {
                    if (currentWebsite) {
                        this.currentWebsite = currentWebsite;
                    } else {
                        //if we don't have the current website, we shouldn't be here at all.
                        this.router.navigate(['/websites']);

                    }

                })//subscribe
    }//getWebsiteInfo

    ///////////deleting
    deleteIt(): void{
        this.popup = new Message('confirm', 'Are sure you want to delete this purchase?', "onComplete", 0);
    }

    onComplete(event:any):void {
        //they have just confirmed the delete
        //if they confirm in the message-component dialog launched by this.deleteIt();
                this.websiteService.deletePurchase(this.purchase.purchaseID, this.currentWebsite.websiteID)
                .subscribe(val =>
                    {
                            //show success msg for 1 sec and route back to the website
                            this.popup = new Message('timedAlert', 'Delete was successful!', "", 1000);
                            setTimeout (() => {
                                this.router.navigate(['/websites', 'detail' ]);
                            }, 1000);
                        },
                        error =>
                        {
                            this.popup = new Message('alert', 'Sorry, an error occurred while deleting the purchase.', "", 0);
                        }
                );//subscribe
    }//onComplete

    saveIt(): void {
        this.purchase.websiteID = this.currentWebsite.websiteID;
        const p = {...this.purchase, ...this.purchaseForm.value }
        this.purchaseSaved = true;
        this.store.dispatch(new websiteActions.UpdatePurchase(p));
    }  //saveIt

     ngOnDestroy() {
         this.componentActive = false;
     }

    setMessage(c: AbstractControl, name: string): void {
        switch (name)   {
            case 'productName':
                this.productNameMsg = '';
                if ((c.touched || c.dirty) && c.errors) {
                    this.productNameMsg = Object.keys(c.errors).map(key =>
                                this.validationMessages.productName[key]).join(' ');
                }
                break;
        } //switch
    } //setMessage

    createPurchaseForm(): void {
        this.purchaseForm = this.fb.group({
            purchaseID: 0,
            productName: ['', [Validators.required]],
            purchasedOn: '',
            arrivedOn:  '',
            totalAmount:  0,
            shippingAmount: 0,
            notes:      '',
        });  //purchaseForm
    } //createPurchaseForm

    watchProductName(): void {
        const productNameControl = this.purchaseForm.get('productName');
        productNameControl.valueChanges
                .pipe(
                    debounceTime(100),
                    takeWhile(() => this.componentActive)
                )
                .subscribe(value => {
                            this.setMessage(productNameControl, 'productName');
                        }
        );
    } //watchProductName

} //class
