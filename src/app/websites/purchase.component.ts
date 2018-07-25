import { Component,  OnDestroy, OnInit } from '@angular/core';
import { IPurchase, Purchase } from './IPurchase'
import { Router } from '@angular/router';
import { WebsiteService } from './website.service';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { IMessage, Message } from '../shared/imessage';
import { debounceTime, takeWhile } from 'rxjs/operators';
import * as fromWebsites from './state/website.reducer';
import { Store, select } from '@ngrx/store';

@Component({
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css']
})

export class PurchaseComponent implements OnInit, OnDestroy {
    purchase: IPurchase = new Purchase();
    websiteName: string;
    websiteId: number;
    productNameMsg:string;
    purchaseForm: FormGroup;
    popup : IMessage;
    a2eOptions: any = {format: 'M/D/YYYY'};
    componentActive = true;
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
        this.watchCurrentProduct();
        this.watchProductName();
        this.getWebsiteInfo();
    }

    watchCurrentProduct(): void {   //re-set values and get the purchase
        this.store.pipe(
                    select(fromWebsites.getCurrentPurchase),
                    takeWhile(() => this.componentActive),
                )
                .subscribe(currentPurchase => {
                    if (currentPurchase && this.purchaseForm) {

                        this.purchaseForm.reset();
                        this.purchase = currentPurchase;

                        this.purchaseForm.patchValue({
                            purchaseID: this.purchase.purchaseID,
                            productName: this.purchase.productName,
                            purchasedOn:  this.purchase.purchasedOn,
                            arrivedOn:  this.purchase.arrivedOn,
                            totalAmount: this.purchase.totalAmount,
                            shippingAmount:this.purchase.shippingAmount,
                            notes: this.purchase.notes,
                        });  //purchaseForm

                        window.scrollTo(0, 0);

                    }

                })//subscribe
//TODO need to subscribe to errors

    }//watchCurrentProduct

    getWebsiteInfo():void {
        this.store.pipe(
                    select(fromWebsites.getCurrentWebsite),
                    takeWhile(() => this.componentActive),
                )
                .subscribe(currentWebsite => {
                    this.websiteName = currentWebsite.websiteName;
                    this.websiteId = currentWebsite.websiteID;
                })//subscribe
    }//getWebsiteInfo


    // getPurchase(websiteId: number, purchaseId: number): void {

    //     if (! websiteId || websiteId == 0) {
    //         this.router.navigate(['/websites']);
    //     }
    //     else if (purchaseId == 0) {
    //         this.purchase = new Purchase();
    //         this.purchase.websiteID = this.websiteId;
    //     }
    //     else {
    //         this.websiteService.getPurchase(websiteId, purchaseId)
    //             .subscribe(purchase =>
    //                 {
    //                     if (!purchase) {
    //                         this.showGetPurchaseErr();
    //                     } else {
    //                         this.purchase = purchase;
    //                         this.purchaseForm.patchValue({
    //                             purchaseID: this.purchase.purchaseID,
    //                             productName: this.purchase.productName,
    //                             purchasedOn:  this.purchase.purchasedOn,
    //                             arrivedOn:  this.purchase.arrivedOn,
    //                             totalAmount: this.purchase.totalAmount,
    //                             shippingAmount:this.purchase.shippingAmount,
    //                             notes: this.purchase.notes,
    //                         });  //purchaseForm
    //                         window.scrollTo(0, 0);
    //                     }

    //                 }); //subscribe
    //     } //if

    // }//getPurchase
    // showGetPurchaseErr(): void {
    //     this.popup = new Message('alert', 'Sorry, an error has occurred', "", 0);
    //     window.scrollTo(0, 0);
    // }

    ///////////deleting
    deleteIt(): void{
        this.popup = new Message('confirm', 'Are sure you want to delete this purchase?', "onComplete", 0);
    }
    onComplete(event:any):void {
        //they have just confirmed the delete
        //if they confirm in the message-component dialog launched by this.deleteIt();
                this.websiteService.deletePurchase(this.purchase.purchaseID, this.websiteId)
                .subscribe(val =>
                            {
                                    //show success msg for 1 sec and route back to the website
                                    this.popup = new Message('timedAlert', 'Delete was successful!', "", 1000);
                                    setTimeout (() => {
                                        this.router.navigate(['/websites', this.websiteId, 'detail' ]);
                                    }, 1000);
                                },
                                error =>
                                {
                                    this.popup = new Message('alert', 'Sorry, an error occurred while deleting the purchase.', "", 0);
                                }
                    );//subscribe
    }//onComplete


    ///////////saving
    saveIt(): void {

        let p = Object.assign({}, this.purchase, this.purchaseForm.value);

        this.websiteService.savePurchase(p)
            .subscribe(savedPurchase =>
                {
                    //now refresh the purchase with data from service. Probably not necessary.
                    this.purchase = savedPurchase;

                    //We now have to update the component with a reroute reroute back to this component or will might have problems: and the url still says id = 0, and more issues as user keeps adding new websites.
                    //Delay the re-route for a bit so user can see the saved message first.
                    this.popup = new Message('timedAlert', 'Save was successful!', "", 1000);

                    setTimeout (() => {
                         this.router.navigate(['/websites/', 'purchase', this.purchase.purchaseID]);
                        // this.router.navigate(['/websites/', this.purchase.websiteID, 'purchase', this.purchase.purchaseID]);
                    }, 1000);

                },
                error =>
                {
                    this.popup = new Message('alert', 'Sorry, an error occurred while saving the purchase.', "", 0);

                }); //subscribe
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
