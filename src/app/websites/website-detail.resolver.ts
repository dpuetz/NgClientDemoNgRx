import { Injectable } from '@angular/core';

import { Resolve, Router, ActivatedRouteSnapshot, RouteReuseStrategy, RouterStateSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';
import { delay, catchError } from 'rxjs/operators';
import { IWebsite, Website } from './IWebsite';
import { WebsiteService } from './website.service';



@Injectable({
  providedIn: 'root'
})
export class WebsiteDetailResolver implements Resolve<IWebsite> {

  constructor( private websiteService: WebsiteService,
               private router: Router ) {}

  resolve(  route: ActivatedRouteSnapshot,
            state: RouterStateSnapshot): Observable<IWebsite> {

        let websiteID = route.params['id'];

        if (isNaN(websiteID)) {
            this.handleError('WebsiteDetailResolver, Cannot get WebisteID', null);
        }

        if (+websiteID === 0) {
            return of(new Website());
        }

        return this.websiteService.getWebsiteById(+websiteID)
            .pipe(
                    // tap(val=>console.log(JSON.stringify(val, null, 4))),
                    catchError(this.handleError('WebsiteDetailResolver', null) ), //return null if error
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