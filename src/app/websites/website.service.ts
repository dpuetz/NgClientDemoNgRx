
//httpClient reference: https://angular.io/guide/http
//https://stackoverflow.com/questions/45505619/angular-4-3-3-httpclient-how-get-value-from-the-header-of-a-response
//https://stackoverflow.com/questions/48543244/how-to-set-the-observe-response-option-globally-in-angular-4-3
//https://stackoverflow.com/questions/48457312/angular-5-get-method-with-params-and-observe-response


//angular for services
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpResponse, HttpParams, HttpErrorResponse  } from '@angular/common/http';
import { environment } from '../../environments/environment';

//my models
import { IWebsite } from './IWebsite';
import { IPurchase } from './IPurchase';
import { ISearch } from './ISearch';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class WebsiteService {

    private domain = environment.baseUrl;

    private searchUrl: string;
    private websiteUrl: string;
    private purchaseUrl: string;

    constructor(private http: HttpClient) {

        this.searchUrl = this.domain + 'api/websitesearch';
        this.websiteUrl = this.domain + 'api/websites';
        this.purchaseUrl = this.domain + 'api/Purchases';
    }

    getWebsites(search: ISearch): Observable<IWebsite[]> {

        let headers = new HttpHeaders();
        headers = headers.append ('Content-Type', 'application/json');

        let searchWord = (search.searchWord == null || search.searchWord == "") ? "" : encodeURIComponent(search.searchWord);
        let params = new HttpParams().set('searchWord', searchWord);

        const url = `${this.searchUrl}/${search.isPreferred}/${search.isBill}`;

        return this.http
            .get<HttpResponse<IWebsite[]>>(url, {headers, params, observe: 'response' })
            .pipe (
                tap( val => this.log(`getWebsites status: ${val.status}, ok: ${val.ok}, statusText: ${val.statusText}, type: ${val.type}, url: ${val.url} `)),
                map( val=> val.body),
                catchError(this.handleError('getWebsites', null) )
            ); //pipe

    } // getWebsites

    saveWebsite (website: IWebsite): Observable<number> {
        return this.http
            .post<HttpResponse<number>>(this.websiteUrl, website, { observe: 'response' })
            .pipe(
                    tap( val => this.log(`saveWebsite status: ${val.status}, ok: ${val.ok}, statusText: ${val.statusText}, type: ${val.type}, url: ${val.url} `)),
                    // tap(val => this.log('saveWebsite stringified = ' + JSON.stringify(val, null, 4))),
                    map(val => val.body),      //return the websiteID
                    catchError(this.handleError('saveWebsite', null) )  //return null if error
            );//pipe
    } //saveWebsite

    deleteWebsite(websiteID: number) : Observable<boolean> {
        const url = `${this.websiteUrl}/${websiteID}`;
        return this.http
            .delete<HttpResponse<boolean>>(url, { observe: 'response' })
            .pipe(
                tap( val => this.log(`deleteWebsite status: ${val.status}, ok: ${val.ok}, statusText: ${val.statusText}, type: ${val.type}, url: ${val.url} `)),
                // tap(val => this.log('deleteWebsite stringified = ' + JSON.stringify(val, null, 4))),
                map(val => val.body),          //val returns true if no error
                catchError(this.handleError('deleteWebsite', null) ) //return null if error

            ); //pipe
    }//deleteWebsite

    getWebsiteById(id: number): Observable<IWebsite> {
        const url = `${this.websiteUrl}/${id}`;
        return this.http.get<HttpResponse<IWebsite>>(url, { observe: 'response' })
            .pipe(
                    tap( val => this.log(`getWebsiteById status: ${val.status}, ok: ${val.ok}, statusText: ${val.statusText}, type: ${val.type}, url: ${val.url} `)),
                    // tap(val => this.log('getWebsiteById stringified = ' + JSON.stringify(val, null, 4))),
                    map(val => val.body),          //val returns IWebsite if no error
                    catchError(this.handleError('getWebsiteById', null))  //return null if error
            ); //pipe
    }

    getPurchase(websiteID: number, purchaseID: number): Observable<IPurchase>{
        const url = `${this.purchaseUrl}/${purchaseID}/${websiteID}`;
        return this.http
            .get<HttpResponse<IPurchase>>(url, { observe: 'response' })
            .pipe(
                    tap( val => this.log(`getPurchase status: ${val.status}, ok: ${val.ok}, statusText: ${val.statusText}, type: ${val.type}, url: ${val.url} `)),
                    // tap(val => this.log('getPurchase stringified = ' + JSON.stringify(val, null, 4))),
                    map(val => val.body),          //val returns IPurchase if no error
                    catchError(this.handleError('getPurchase', null))  //return null if error
            );//pipe
    }

    savePurchase(purchase: IPurchase): Observable<IPurchase>{
        return this.http
            .post<HttpResponse<IPurchase>>(this.purchaseUrl, purchase,  { observe: 'response' })
            .pipe(
                    // tap(val => this.log('savePurchase stringified = ' + JSON.stringify(val, null, 4))),
                    tap( val => this.log(`savePurchase status: ${val.status}, ok: ${val.ok}, statusText: ${val.statusText}, type: ${val.type}, url: ${val.url} `)),
                    map(val => val.body),          //val returns purchase if no error
                    catchError(this.handleError('savePurchase', null))  //return null if error
        );
    }

    deletePurchase(purchaseID: number, websiteID: number) : Observable<boolean>{
        const url = `${this.purchaseUrl}/${purchaseID}/${websiteID}`;

        return this.http
            .delete<HttpResponse<boolean>>(url, { observe: 'response' })
            .pipe(
                tap( val => this.log(`deletePurchase status: ${val.status}, ok: ${val.ok}, statusText: ${val.statusText}, type: ${val.type}, url: ${val.url} `)),
                // tap(val => this.log('deletePurchase stringified = ' + JSON.stringify(val, null, 4))),
                map(val => true),          //val return true if no error
                catchError(this.handleError('deletePurchase', null) ) //return null if error
        );
    }

    private log(message: string) {
        console.log("WebServLog = ", message);
    }

   private handleError<T> (operation = 'operation', result?: T) {  //https://angular.io/tutorial/toh-pt6
        return (error: any): Observable<T> => {

            // TODO: better job of transforming error for user consumption
            this.log(`${operation} failed: ${error.message}`);

            // TODO: send the error to remote logging infrastructure
            let str = JSON.stringify(error, null, 4);
            this.log('error=' + str); // log to console instead

            // Let the app keep running by returning an empty result.
            return of(result as T);
        }
    };  //handleError



}//class



