import { ISearch, Search } from "../ISearch";
import { IWebsite, Website } from "../IWebsite";
import * as fromRoot from '../../state/app.state';
import { createFeatureSelector, createSelector } from "@ngrx/store";
import { WebsiteActions, WebsiteActionTypes } from "./website.action";


//interface for entire application state
export interface State extends fromRoot.State {
    websites: WebsiteState
}

//interface for this slice of state
export interface WebsiteState {
    searchParams: ISearch,
    websites: IWebsite[],
    currentWebsite: IWebsite
}

//set an initial state so never any undefined
const initialState: WebsiteState = {
    searchParams: new Search(),  //contains correct defaults
    websites: [],
    currentWebsite: null
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

// export function reducer (state, action) {
//     switch (action.type) {
//         case 'SAVE_SEARCH_CRITERIA':
//             return {
//                 ...state,
//                 website: action.payload
//             }
//         default:
//             return state;
//     }//switch
// }//function

export function reducer (state = initialState, action: WebsiteActions): WebsiteState {
    switch (action.type) {
        case WebsiteActionTypes.SetSearchParams:
            return {
                ...state,
                searchParams: action.payload
            }
        case WebsiteActionTypes.SetCurrentWebsite:
            return {
                ...state,
                currentWebsite: {...action.payload }
                //if you don't use the ..., it will pass by value.
                //need a whole new object to prevent that.
                //else the store will get updated when you change a website
            }
        case WebsiteActionTypes.ClearCurrentWebsite:
            return {
                ...state,
                currentWebsite: null
            }
        case WebsiteActionTypes.InitializeCurrentWebsite:
            return {
                ...state,
                currentWebsite: new Website()
            }
        default:
            return state;
    }//switch
}//function