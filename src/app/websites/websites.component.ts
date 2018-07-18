import { Component, OnInit, OnDestroy } from '@angular/core';
import { Website } from './IWebsite'
import { WebsiteService } from './website.service';
import { ISearch } from './ISearch';
import { IMessage, Message } from '../shared/imessage';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import * as fromWebsites from './state/website.reducer';
import * as websiteActions from './state/website.action';
import { takeWhile } from 'rxjs/operators';

@Component({
    templateUrl: './websites.component.html'
})

export class WebsitesComponent implements OnInit, OnDestroy {

    websites: Website[];
    search: ISearch;
    recordsReturned: number = 0;
    popup : IMessage;
    searchForm: FormGroup;
    componentActive = true;

    constructor( private websiteService: WebsiteService,
                 private fb: FormBuilder,
                 private store: Store<fromWebsites.State>  ) { }

    ngOnInit() {
        this.store
            .pipe(
                    select(fromWebsites.getSearchParams),
                    takeWhile(() => this.componentActive)
                )//pipe
                .subscribe(searchParams => {
                    this.search = searchParams
                })//subscribe

        this.store
            .pipe(
                    select(fromWebsites.getWebsites),
                    takeWhile(() => this.componentActive)
                )//pipe
                .subscribe(websites => {
                    this.websites = websites
                })//subscribe

        this.searchForm = this.fb.group({
            searchWord: this.search.searchWord,
            isBill: this.search.isBill,
            isPreferred: this.search.isPreferred
        });
        this.getWebsites();
    }

    searchCheckboxChanged() {
        this.doCheckSearch();
    }

    doSearch(): void  {
        this.getWebsites();
    }
    doCheckSearch(): void   {
        //update display on form, set searchword to ''
        this.searchForm.patchValue({
            searchWord: ''
        });
        this.getWebsites();
    }

    getWebsites():void {
        // let searchParams = Object.assign({}, this.search, this.searchForm.value);
        let searchParams = {...this.search, ...this.searchForm.value};
        this.store.dispatch(new websiteActions.SetSearchParams(searchParams));
        this.store.dispatch(new websiteActions.Load(searchParams));
    }//getWebsites

    getError():void {
        console.log("err");
        this.popup = new Message('alert', 'Sorry, an error has occurred while getting the data.', "", 0);
    }

    ngOnDestroy() {
		this.componentActive = false;
	}


} //class
