import { Action } from "@ngrx/store";
import { IWebsite } from "../IWebsite";
import { ISearch } from "../ISearch";

export enum WebsiteActionTypes {
    SetSearchParams = '[Website] Get Search Params',
    SetCurrentWebsite = '[Website] Set Current Website',
    DeleteWebsite = '[Website] Delete Website',
    DeleteWebsiteSuccess = '[Website] Delete Website Success',
    DeleteWebsiteFail = '[Website] Delete Website Fail',
    ClearCurrentWebsite = '[Website] Clear Current Website',
    InitializeCurrentWebsite = '[Website] Initialize Current Website',
    Load = '[Website] Load',
    LoadSuccess = '[Website] Load Success',
    LoadFail = '[Website] Load Fail',
    ClearCurrentError = '[Website Clear Error]'
}

export class SetSearchParams implements Action {
    readonly type = WebsiteActionTypes.SetSearchParams
    constructor (public payload: ISearch){}
}

export class SetCurrentWebsite implements Action {
    readonly type = WebsiteActionTypes.SetCurrentWebsite
    constructor (public payload: IWebsite){}
}

export class DeleteWebsite implements Action {
    readonly type = WebsiteActionTypes.DeleteWebsite
    constructor (public payload: number){}
}

export class DeleteWebsiteSuccess implements Action {
    readonly type = WebsiteActionTypes.DeleteWebsiteSuccess
    constructor (public payload: number){}
}

export class DeleteWebsiteFail implements Action {
    readonly type = WebsiteActionTypes.DeleteWebsiteFail
    constructor (public payload: string){}
}
export class ClearCurrentError implements Action {
    readonly type = WebsiteActionTypes.ClearCurrentError
    constructor (){}
}

export class InitializeCurrentWebsite implements Action {
    readonly type = WebsiteActionTypes.InitializeCurrentWebsite
    constructor (){}  //no payload
}

export class Load implements Action {
    readonly type = WebsiteActionTypes.Load
    constructor (public payload: ISearch){}
}

export class LoadSuccess implements Action {
    readonly type = WebsiteActionTypes.LoadSuccess
    constructor (public payload: IWebsite[]){}
}

export class LoadFail implements Action {
    readonly type = WebsiteActionTypes.LoadFail
    constructor (public payload: string){}
}

export type WebsiteActions =
          ClearCurrentError
        | SetSearchParams
        | SetCurrentWebsite
        | DeleteWebsite
        | DeleteWebsiteSuccess
        | DeleteWebsiteFail
        | InitializeCurrentWebsite
        | Load
        | LoadSuccess
        | LoadFail;