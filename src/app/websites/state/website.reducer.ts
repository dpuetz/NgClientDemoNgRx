import { ISearch, Search } from "../ISearch";
import { IWebsite, Website } from "../IWebsite";
import * as fromRoot from '../../state/app.state';
import { createFeatureSelector, createSelector } from "@ngrx/store";
import { WebsiteActions, WebsiteActionTypes } from "./website.action";
import { IPurchase, Purchase } from "../IPurchase";


//interface for entire application state
export interface State extends fromRoot.State {
    websites: WebsiteState
}

//interface for this slice of state
export interface WebsiteState {
    searchParams: ISearch,
    websites: IWebsite[],
    currentWebsite: IWebsite,
    currentPurchase: IPurchase,
    error: string
}

//set an initial state so never any undefined
const initialState: WebsiteState = {
    searchParams: new Search(),  //contains correct defaults
    websites: [],
    currentWebsite: null,
    currentPurchase: null,
    error: ''
}

//Create a const for the entire feature slice
const getWebsiteFeatureState = createFeatureSelector<WebsiteState>('websites');

//then use that to create a selector for each in initialState
export const getSearchParams = createSelector (
    getWebsiteFeatureState,     //the above const
    state => state.searchParams  //searchParams from initialState const
);
export const getWebsites = createSelector (
    getWebsiteFeatureState,
    state => state.websites
);
export const getCurrentWebsite = createSelector (
    getWebsiteFeatureState,
    state => state.currentWebsite
);
export const getError = createSelector (
    getWebsiteFeatureState,
    state => state.error
);
export const getCurrentPurchase = createSelector (
    getWebsiteFeatureState,
    state => state.currentPurchase
);

//use optional parameters to set the state to the initial state
export function reducer (state = initialState, action: WebsiteActions): WebsiteState {
    switch (action.type) {
        case WebsiteActionTypes.SetSearchParams:
            return {
                ...state,
                searchParams: {...action.payload}
            }
        case WebsiteActionTypes.DeleteWebsiteSuccess:
            return {
                ...state,
                currentWebsite: null,
                // websites: state.websites.filter(website => website.websiteID !== action.payload),
                error: ''
            }
        case WebsiteActionTypes.DeleteWebsiteFail:
            return {
                ...state,
                error: action.payload
            }
        case WebsiteActionTypes.DeletePurchaseSuccess:
            return {
                ...state,
                currentPurchase: null,
                error: ''
            }
        case WebsiteActionTypes.DeletePurchaseFail:
            return {
                ...state,
                error: action.payload
            }
        case WebsiteActionTypes.InitializeCurrentWebsite:
            return {
                ...state,
                currentWebsite: new Website(),
            }
        case WebsiteActionTypes.InitializeCurrentPurchase:
            return {
                ...state,
                currentPurchase: new Purchase(),
            }
        case WebsiteActionTypes.LoadSuccess:
            return {
                ...state,
                websites:  action.payload,  //don't spread
                //websites:  {...action.payload},
                error: ''
            }
        case WebsiteActionTypes.LoadFail:
            return {
                ...state,
                websites: [],
                error: action.payload
            }

        case WebsiteActionTypes.LoadCurrentWebsiteSuccess:
            return {
                ...state,
                currentWebsite:  action.payload,
                error: ''
            }
        case WebsiteActionTypes.LoadCurrentWebsiteFail:
            return {
                ...state,
                currentWebsite: null,
                error: action.payload
            }
        case WebsiteActionTypes.ClearCurrentError:
            return {
                ...state,
                error: ''
            }
        case WebsiteActionTypes.UpdateWebsiteSuccess:
            return {
                ...state,
                currentWebsite:  action.payload,
                error: ''
            }
        case WebsiteActionTypes.UpdateWebsiteFail:
            return {
                ...state,
                currentWebsite: null,
                error: action.payload
            }
        case WebsiteActionTypes.LoadCurrentPurchaseSuccess:
            return {
                ...state,
                currentPurchase:  action.payload,
                // currentWebsite:  {...action.payload}, //returns IWebsite
                error: ''
            }
        case WebsiteActionTypes.LoadCurrentPurchaseFail:
            return {
                ...state,
                currentPurchase: null,
                error: action.payload
            }
        case WebsiteActionTypes.UpdatePurchaseSuccess:
            return {
                ...state,
                currentPurchase:  {...action.payload},
                error: ''
            }
        case WebsiteActionTypes.UpdatePurchaseFail:
            return {
                ...state,
                currentPurchase: null,
                error: action.payload
            }
        default:
            return state;
    }//switch
}//function