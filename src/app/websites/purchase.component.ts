import { Component,  OnDestroy, OnInit } from '@angular/core';
import { IPurchase, Purchase } from './IPurchase'
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { WebsiteService } from './website.service';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { IMessage, Message } from '../shared/imessage';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { PurchaseParameterService } from './purchase-parameter.service';

@Component({
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css']
})

export class PurchaseComponent implements OnInit, OnDestroy {

    purchase: IPurchase;
    websiteName: string;
    websiteId: number;
    productNameMsg:string;
    purchaseForm: FormGroup;
    popup : IMessage;
    navigationSubscription: Subscription;
    subProductName: Subscription;
    a2eOptions: any = {format: 'M/D/YYYY'};
    private validationMessages: { [key: string]: { [key: string]: string } };

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private websiteService: WebsiteService,
        private fb: FormBuilder,
        private purchaseParams: PurchaseParameterService
    ) {
            this.navigationSubscription = this.router.events.subscribe((e: any) => {
                // If it is a NavigationEnd event, then re-initalise the component
                if (e instanceof NavigationEnd) {
                    this.initializePurchaseDetail();
                }
            });

            // Define all of the validation messages for the form.
            this.validationMessages = {
                productName: {
                    required: 'Purchase name is required.'
                }
            };
    }//constructor

    ngOnInit():void {
        this.purchaseForm = this.fb.group({
            purchaseID: 0,
            productName: ['', [Validators.required]],
            purchasedOn: '',
            arrivedOn:  '',
            totalAmount:  0,
            shippingAmount: 0,
            notes:      '',
        });  //purchaseForm

        const productNameControl = this.purchaseForm.get('productName');
        this.subProductName = productNameControl.valueChanges
                .pipe(debounceTime(100))
                .subscribe(value => {
                            this.setMessage(productNameControl, 'productName');
                        }
        );

    }//ngOnInit

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

    initializePurchaseDetail(){    //re-set values
        this.route.paramMap.subscribe(params => {

            if (this.purchaseForm) {
                this.purchaseForm.reset();
            }

            this.websiteName = '';
            this.websiteId = 0;

            let purchaseId = +params.get('purchaseId');
            this.websiteId = +params.get('websiteId');

            this.purchase = new Purchase();
            this.purchase.websiteID = this.websiteId;

            this.websiteName = this.purchaseParams.websiteName;
            this.getPurchase(this.websiteId, purchaseId);
        });

    }//initializePurchaseDetail


    getPurchase(websiteId: number, purchaseId: number): void {

        if (! websiteId || websiteId == 0) {
            this.router.navigate(['/websites']);
        }
        else if (purchaseId == 0) {
            this.purchase = new Purchase();
            this.purchase.websiteID = this.websiteId;
        }
        else {
            this.websiteService.getPurchase(websiteId, purchaseId)
                .subscribe(purchase =>
                    {
                        if (!purchase) {
                            this.showGetPurchaseErr();
                        } else {
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
                            window.scrollTo(0, 0);
                        }

                    }); //subscribe
        } //if

    }//getPurchase
    showGetPurchaseErr(): void {
        this.popup = new Message('alert', 'Sorry, an error has occurred', "", 0);
        window.scrollTo(0, 0);
    }

    onComplete(event:any):void {
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

    deleteIt(): void{
        this.popup = new Message('confirm', 'Are sure you want to delete this purchase?', "onComplete", 0);
    }

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
                        this.router.navigate(['/websites/', this.purchase.websiteID, 'purchase', this.purchase.purchaseID]);
                    }, 1000);

                },
                error =>
                {
                    this.popup = new Message('alert', 'Sorry, an error occurred while saving the purchase.', "", 0);

                }); //subscribe
    }  //saveIt

     ngOnDestroy() {
            // !important - avoid memory leaks caused by navigationSubscription
            if (this.navigationSubscription) {
                this.navigationSubscription.unsubscribe();
            }
            if (this.subProductName) {
                this.subProductName.unsubscribe();
            }
     }

} //class
