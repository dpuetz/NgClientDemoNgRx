import { Component, OnInit, OnDestroy } from '@angular/core';
import { Website, IWebsite } from './IWebsite'
import { ISearch, Search } from './ISearch';
import { IMessage, Message } from '../shared/imessage';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import * as fromWebsites from './state/website.reducer';
import * as websiteActions from './state/website.action';
import { takeWhile, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
    templateUrl: './websites.component.html'
})

export class WebsitesComponent implements OnInit, OnDestroy {

    websites: Website[];
    search: ISearch = new Search();
    recordsReturned: number = 0;
    popup : IMessage;
    searchForm: FormGroup;
    componentActive = true;
    navigateAfter: boolean;

    constructor( private fb: FormBuilder,
                 private store: Store<fromWebsites.State>,
                 private router: Router  ) { }

    ngOnInit() {
        this.store
            .pipe(
                    select(fromWebsites.getSearchParams),
                    takeWhile(() => this.componentActive)
                )//pipe
            .subscribe(searchParams => {
                if (searchParams) {
                    this.search = searchParams
                }
            })//subscribe

        this.store
            .pipe(
                    select(fromWebsites.getWebsites),
                    takeWhile(() => this.componentActive)
                )//pipe
            .subscribe(websites => {
                this.websites = websites
            })//subscribe

        this.store
            .pipe(
                    select(fromWebsites.getError),
                    takeWhile(() => this.componentActive)
                )//pipe
            .subscribe(err => {
                console.log('err', JSON.stringify(err));
                if(err) {
                    this.store.dispatch(new websiteActions.ClearCurrentError());
                    this.showError();
                }
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
        //update display on form, and set searchword to ''
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

    goToSelectedWebsite(website: IWebsite): void {
        //update the store and navigate
        this.navigateAfter = true;
        if (website) {
            this.store.dispatch(new websiteActions.LoadCurrentWebsite(website.websiteID));
        } else {
            this.store.dispatch(new websiteActions.InitializeCurrentWebsite());
        }
        this.router.navigate(['/websites', 'detail']);
    }

    showError(): void{
        this.popup = new Message('alert', 'Sorry, an error has occurred.', "", 0);
    }
    ngOnDestroy() {
		this.componentActive = false;
	}


} //class
