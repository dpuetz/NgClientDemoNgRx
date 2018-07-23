import { Action } from "@ngrx/store";
import { IWebsite } from "../IWebsite";
import { ISearch } from "../ISearch";

export enum WebsiteActionTypes {
    SetSearchParams = '[Website] Get Search Params',
    // SetCurrentWebsiteId = '[Website] Set Current Website ID',
    DeleteWebsite = '[Website] Delete Website',
    DeleteWebsiteSuccess = '[Website] Delete Website Success',
    DeleteWebsiteFail = '[Website] Delete Website Fail',
    InitializeCurrentWebsite = '[Website] Initialize Current Website',
    Load = '[Website] Load',
    LoadSuccess = '[Website] Load Success',
    LoadFail = '[Website] Load Fail',
    ClearCurrentError = '[Website Clear Error]',
	LoadCurrentWebsite = '[Website Load Current Website]',
	LoadCurrentWebsiteSuccess = '[Website Load Current Website Success]',
	LoadCurrentWebsiteFail = '[Website Load Current Website Fail]',
    UpdateWebsite = '[Website] Update Website',
    UpdateWebsiteSuccess = '[Website] Update Website Success',
    UpdateWebsiteFail = '[Website] Update Website Fail'
}


export class SetSearchParams implements Action {
    readonly type = WebsiteActionTypes.SetSearchParams
    constructor (public payload: ISearch){}
}

// export class SetCurrentWebsiteId implements Action {
//     readonly type = WebsiteActionTypes.SetCurrentWebsiteId
//     constructor (public payload: number){}
// }

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

export class UpdateWebsite implements Action {
    readonly type = WebsiteActionTypes.UpdateWebsite
    constructor (public payload: IWebsite){}
}

export class UpdateWebsiteSuccess implements Action {
    readonly type = WebsiteActionTypes.UpdateWebsiteSuccess
    // constructor (public payload: IWebsite){} //??
    constructor (public payload: IWebsite){}  //??
}

export class UpdateWebsiteFail implements Action {
    readonly type = WebsiteActionTypes.UpdateWebsiteFail
    constructor (public payload: string){}
}


export class LoadCurrentWebsite implements Action {
    readonly type = WebsiteActionTypes.LoadCurrentWebsite
    constructor (public payload: number){}
}

export class LoadCurrentWebsiteSuccess implements Action {
    readonly type = WebsiteActionTypes.LoadCurrentWebsiteSuccess
    constructor (public payload: IWebsite){}
}

export class LoadCurrentWebsiteFail implements Action {
    readonly type = WebsiteActionTypes.LoadCurrentWebsiteFail
    constructor (public payload: string){}
}

export type WebsiteActions =
          SetSearchParams
        // | SetCurrentWebsiteId
        | DeleteWebsite
        | DeleteWebsiteSuccess
        | DeleteWebsiteFail
        | InitializeCurrentWebsite
        | Load
        | LoadSuccess
        | LoadFail
        | ClearCurrentError
        | LoadCurrentWebsite
        | LoadCurrentWebsiteSuccess
        | LoadCurrentWebsiteFail
        | UpdateWebsite
        | UpdateWebsiteSuccess
        | UpdateWebsiteFail



