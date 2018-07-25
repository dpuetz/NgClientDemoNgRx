import { Injectable } from "@angular/core";
import { WebsiteService } from "../website.service";
import { Actions, Effect, ofType } from "@ngrx/effects";
import * as websiteActions from './website.action';
import { mergeMap, map, catchError, withLatestFrom, tap, switchMap } from "rxjs/operators";
import { Observable, of } from "rxjs";
import { Action, Store } from "@ngrx/store";
import { ISearch } from "../ISearch";
import { IWebsite, setWebsiteId } from "../IWebsite";
import * as fromWebsites from '../state/website.reducer';
import { IPurchase } from "../IPurchase";

@Injectable()
export class WebsiteEffects {
    constructor(private websiteService: WebsiteService,
                private store: Store<fromWebsites.State>,
                private actions$: Actions ){}

    @Effect()
    //1. loadWebsites$ is an observable of type Action
    //2. loadWebsites$ watches for actions of type = Load
    //3. when an action of type Load is received, the map action
    //   is used to pull off the payload, which is searchParams of type ISearch
    //4. then the service is called to get the websites
    //5. the service returns another observable, and we don't want nested observables
    //   so use mergemap to merge and flatten the 2 observables
    //6. the services returns the websites array, so call loadSuccess action
    //7. if error, call LoadFail action.
    loadWebsites$: Observable<Action> = this.actions$
        .pipe(
            // tap(val=>console.log('loadWebsites 1')),
            ofType(websiteActions.WebsiteActionTypes.Load),
            // tap(val=>console.log('loadWebsites 2')),
            map((action: websiteActions.Load) => action.payload),
            mergeMap((searchParams: ISearch) =>
                this.websiteService.getWebsites(searchParams)
                    .pipe(
                        // tap(val =>console.log('effects ',  val.length)),
                        map(
                            websites => (new websiteActions.LoadSuccess(websites))
                         ),//map
                        catchError(err => of(new websiteActions.LoadFail(err)))
                    )//pipe
            )//mergeMap
        )//pipe

    @Effect()
        deleteWebsite$: Observable<Action> = this.actions$
            .pipe(
                ofType(websiteActions.WebsiteActionTypes.DeleteWebsite),
                map((action: websiteActions.DeleteWebsite) => action.payload),
                mergeMap((websiteID: number) =>
                    this.websiteService.deleteWebsite(websiteID)
                        .pipe(
                            map(
                                () => (new websiteActions.DeleteWebsiteSuccess(websiteID))
                            ),//map
                            catchError(err => of(new websiteActions.DeleteWebsiteFail(err)))
                        )//pipe
                )//mergeMap
            )//pipe

    @Effect()
    loadCurrentWebsite$: Observable<Action> = this.actions$
        .pipe(
            ofType(websiteActions.WebsiteActionTypes.LoadCurrentWebsite),
            map((action: websiteActions.LoadCurrentWebsite) => action.payload),
            mergeMap((websiteID: number) =>
                this.websiteService.getWebsiteById(websiteID).pipe(
                    // tap(website => console.log('effects4', website)),
                    map(website => (new websiteActions.LoadCurrentWebsiteSuccess(website))),
                    catchError(err => of(new websiteActions.LoadCurrentWebsiteFail(err))
                )//pipe
        )//pipe
        )//mergemap
    ); //pipe

    @Effect()
    updateWebsite$: Observable<Action> = this.actions$
        .pipe(
            ofType(websiteActions.WebsiteActionTypes.UpdateWebsite),
            map((action: websiteActions.UpdateWebsite) => action.payload),
            mergeMap((website: IWebsite) =>
                this.websiteService.saveWebsite(website).pipe(
                     map(websiteId => (new websiteActions.UpdateWebsiteSuccess(setWebsiteId(website, websiteId)))),
                    catchError(err => of(new websiteActions.UpdateWebsiteFail(err))
                )//pipe
        )//pipe
        )//mergemap
    ); //pipe

    @Effect()
    UpdatePurchase$: Observable<Action> = this.actions$
        .pipe(
            ofType(websiteActions.WebsiteActionTypes.UpdatePurchase),
            map((action: websiteActions.UpdatePurchase) => action.payload),
            mergeMap((purchase: IPurchase) =>
                this.websiteService.savePurchase(purchase).pipe(
                    // tap (purchase=> console.log("effects", purchase)),
                     map(purchase => (new websiteActions.UpdatePurchaseSuccess(purchase))),
                    catchError(err => of(new websiteActions.UpdatePurchaseFail(err))
                )//pipe
        )//pipe
        )//mergemap
    ); //pipe

    @Effect()
    loadCurrentPurchase$: Observable<Action> = this.actions$
        .pipe(
            ofType(websiteActions.WebsiteActionTypes.LoadCurrentPurchase),
            map((action: websiteActions.LoadCurrentPurchase) => action.payload),
            // tap(val => console.log('effect loadCurrentPurchase', val)),
            mergeMap((action) =>
                this.websiteService.getPurchase(action.websiteID, action.purchaseID).pipe(
                    map(purchase => (new websiteActions.LoadCurrentPurchaseSuccess(purchase))),
                    catchError(err => of(new websiteActions.LoadCurrentWebsiteFail(err))
                )//pipe
        )//pipe
        )//mergemap
    ); //pipe

    @Effect()
    deletePurchase$: Observable<Action> = this.actions$
        .pipe(
            ofType(websiteActions.WebsiteActionTypes.DeletePurchase),
            map((action: websiteActions.DeletePurchase) => action.payload),
            mergeMap((action) =>
                this.websiteService.deletePurchase(action.purchaseID, action.websiteID).pipe(
                     map(isDeleted => (new websiteActions.DeletePurchaseSuccess(isDeleted))),
                    catchError(err => of(new websiteActions.DeletePurchaseFail(err))
                )//pipe
        )//pipe
        )//mergemap
    ); //pipe

    //works, but don't need it.
    // @Effect()
    // loadCurrentWebsite$: Observable<Action> = this.actions$

    //     .pipe(
    //         tap(val=>console.log('loadCurrentWebsite 1')),
    //         ofType(websiteActions.WebsiteActionTypes.LoadCurrentWebsite),
    //         tap(val=>console.log('loadCurrentWebsite 2')),
    //         withLatestFrom(this.store, (action, state) => state.websites.currentWebsiteId),
    //         mergeMap((websiteID: number) =>
    //         this.websiteService.getWebsiteById(websiteID).pipe(
    //                 map(website => (new websiteActions.LoadCurrentWebsiteSuccess(website))),
    //                 catchError(err => of(new websiteActions.LoadCurrentWebsiteFail(err))
    //             )//pipe
    //     )//pipe
    //     )//mergemap
    // ); //pipe





}//class
