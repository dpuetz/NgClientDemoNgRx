import { Component, OnInit, OnDestroy } from '@angular/core';
import { Website } from './IWebsite'
import { WebsiteService } from './website.service';
import { ISearch, Search } from './ISearch';
import { IMessage, Message } from '../shared/imessage';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import * as fromWebsites from './state/website.reducer';
import * as websiteActions from './state/website.action';

@Component({
    templateUrl: './websites.component.html'
})

export class WebsitesComponent implements OnInit, OnDestroy {

    websites: Website[];
    search: ISearch;
    recordsReturned: number = 0;
    popup : IMessage;
    // subIsBill: Subscription;
    // subIsPreferred: Subscription;
    searchForm: FormGroup;
    componentActive = true;

    constructor( private websiteService: WebsiteService,
                 private fb: FormBuilder,
                 private store: Store<fromWebsites.State>  ) { }

    ngOnInit() {

        this.store.pipe(select(fromWebsites.getSearchParams))
                    .subscribe(searchParams => {
                        this.search = searchParams
                    })//subscribe

        // this.store.pipe(select('websites')).subscribe(
        //     search => {
        //             this.search = search.searchParams
        //     }
        // )//subscribe

        this.searchForm = this.fb.group({
            searchWord: this.search.searchWord,
            isBill: this.search.isBill,
            isPreferred: this.search.isPreferred
        });

        // const isBillControl = this.searchForm.get('isBill');
        // this.subIsBill = isBillControl.valueChanges
        //         .pipe(debounceTime(100))
        //         .subscribe(() => {
        //                     this.doCheckSearch();
        //                 }
        // );
        // const isPreferredControl = this.searchForm.get('isPreferred');
        // this.subIsPreferred = isPreferredControl.valueChanges
        //         .pipe(debounceTime(100))
        //         .subscribe(() =>
        //                     this.doCheckSearch()
        //         ); //subscribe

        this.getWebsites();
    }

    onComplete(event:any): void {}

    searchCheckboxChanged() {
        this.doCheckSearch();
    }

    doSearch(): void
    {
        this.getWebsites();
    }
    doCheckSearch(): void
    {
        //update display on form
        this.searchForm.patchValue({
            searchWord: ''
        });
        this.getWebsites();
    }

    getWebsites():void {
        let searchParams = Object.assign({}, this.search, this.searchForm.value);
        this.store.dispatch(new websiteActions.SetSearchParams(searchParams));
        // this.store.dispatch({
        //     type: 'SAVE_SEARCH_CRITERIA',
        //     payload: searchParams
        // });
        this.websiteService.getWebsites(searchParams)
            .subscribe(websites =>
            {
                if (websites) {
                    this.websites = websites;
                    this.recordsReturned = websites.length;
                } else {
                    this.getError();
                }
            }); //subscribe
    }

    getError():void {
        console.log("err");
        this.popup = new Message('alert', 'Sorry, an error has occurred while getting the data.', "", 0);
    }

    ngOnDestroy() {
		this.componentActive = false;
	} //ngOnDestroy

    //  ngOnDestroy() {
    //         if (this.subIsBill) {
    //             this.subIsBill.unsubscribe();
    //         }
    //         if (this.subIsPreferred) {
    //             this.subIsPreferred.unsubscribe();
    //         }
    //  } //ngOnDestroy

} //class
