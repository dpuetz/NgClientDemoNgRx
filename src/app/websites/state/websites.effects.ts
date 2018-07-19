import { Injectable } from "@angular/core";
import { WebsiteService } from "../website.service";
import { Actions, Effect, ofType } from "@ngrx/effects";
import * as websiteActions from './website.action';
import { mergeMap, map, catchError } from "rxjs/operators";
import { Observable, of } from "rxjs";
import { Action } from "@ngrx/store";
import { ISearch } from "../ISearch";

@Injectable()
export class WebsiteEffects {
    constructor(private websiteService: WebsiteService,
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
            ofType(websiteActions.WebsiteActionTypes.Load),
            map((action: websiteActions.Load) => action.payload),
            mergeMap((searchParams: ISearch) =>
                this.websiteService.getWebsites(searchParams)
                    .pipe(
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
}//class
