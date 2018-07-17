import { Action } from "@ngrx/store";
import { IWebsite } from "../IWebsite";
import { ISearch } from "../ISearch";

export enum WebsiteActionTypes {
    SetSearchParams = '[Website] Get Search Params',
    SetCurrentWebsite = '[Website] Set Current Website',
    ClearCurrentWebsite = '[Website] Clear Current Website',
    InitializeCurrentWebsite = '[Website] Initialize Current Website'
}

export class SetSearchParams implements Action {
    readonly type = WebsiteActionTypes.SetSearchParams
    constructor (public payload: ISearch){}
}

export class SetCurrentWebsite implements Action {
    readonly type = WebsiteActionTypes.SetCurrentWebsite
    constructor (public payload: IWebsite){}
}

export class ClearCurrentWebsite implements Action {
    readonly type = WebsiteActionTypes.ClearCurrentWebsite
    constructor (){}  //no payload
}

export class InitializeCurrentWebsite implements Action {
    readonly type = WebsiteActionTypes.InitializeCurrentWebsite
    constructor (){}  //no payload
}

export type WebsiteActions = SetSearchParams
        | SetCurrentWebsite
        | ClearCurrentWebsite
        | InitializeCurrentWebsite;