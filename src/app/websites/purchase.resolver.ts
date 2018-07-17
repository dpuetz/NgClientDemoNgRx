import { Injectable } from '@angular/core';

import { Resolve, Router, ActivatedRouteSnapshot, RouteReuseStrategy, RouterStateSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';
import { delay, catchError, tap } from 'rxjs/operators';
import { WebsiteService } from './website.service';
import { IPurchase, Purchase } from './IPurchase';


@Injectable({
  providedIn: 'root'
})
export class PurchaseResolver implements Resolve<IPurchase> {

  constructor( private websiteService: WebsiteService,
               private router: Router ) {

               }

  resolve(  route: ActivatedRouteSnapshot,
            state: RouterStateSnapshot): Observable<IPurchase> {

        let purchaseID = route.params['purchaseId'];
        let websiteID = route.params['websiteId'];

        if (isNaN(purchaseID)) {
            this.handleError('PurchaseResolver, Cannot get purchaseId', null);
        }

        if (isNaN(websiteID)) {
            this.handleError('PurchaseResolver, Cannot get websiteId', null);
        }

        if (parseInt(purchaseID) === 0 || parseInt(websiteID) === 0) {
            return of(new Purchase());
        }

        return this.websiteService.getPurchase(+websiteID, +purchaseID)
            .pipe(
                    // tap(val=>console.log(JSON.stringify(val, null, 4))),
                    catchError(this.handleError('PurchaseResolver', null) ), //return null if error
                    delay(1)
                 );//pipe

  }//resolve


   private handleError<T> (operation = 'operation', result?: T) {  //https://angular.io/tutorial/toh-pt6
        return (error: any): Observable<T> => {

            // TODO: better job of transforming error for user consumption
            console.log(`${error.message}`);

            // Let the app keep running by returning an empty result.
            return of(result as T);
        }
    };  //handleError

}//class