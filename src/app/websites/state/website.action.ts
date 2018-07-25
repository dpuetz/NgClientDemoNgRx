import { Action } from "@ngrx/store";
import { IWebsite } from "../IWebsite";
import { ISearch } from "../ISearch";
import { IPurchase } from "../IPurchase";

export enum WebsiteActionTypes {
    SetSearchParams = '[Website] Get Search Params',
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
    UpdateWebsiteFail = '[Website] Update Website Fail',
	LoadCurrentPurchase = '[Website] Load Current Purchase',
	LoadCurrentPurchaseSuccess = '[Website] Load Current Purchase Success',
	LoadCurrentPurchaseFail = '[Website] Load Current Purchase Fail',
	InitializeCurrentPurchase = '[Website] Initialize Current Purchase',
    UpdatePurchase = '[Website] Update Purchase',
	UpdatePurchaseSuccess = '[Website] Update Purchase Success',
	UpdatePurchaseFail = '[Website] Update Purchase Fail',
    DeletePurchase = '[Website] Delete Purchase',
	DeletePurchaseSuccess = '[Website] Delete Purchase Success',
	DeletePurchaseFail = '[Website] Delete Purchase Fail'
}


export class SetSearchParams implements Action {
    readonly type = WebsiteActionTypes.SetSearchParams
    constructor (public payload: ISearch){}
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
export class UpdateWebsite implements Action {
    readonly type = WebsiteActionTypes.UpdateWebsite
    constructor (public payload: IWebsite){}
}
export class UpdateWebsiteSuccess implements Action {
    readonly type = WebsiteActionTypes.UpdateWebsiteSuccess
    constructor (public payload: IWebsite){}
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
export class InitializeCurrentPurchase implements Action {
    readonly type = WebsiteActionTypes.InitializeCurrentPurchase
    constructor (){}  //no payload
}
export class LoadCurrentPurchase implements Action {
    readonly type = WebsiteActionTypes.LoadCurrentPurchase
    constructor (public payload: { websiteID: number,  purchaseID: number}){}  //websiteID: number, purchaseID: number
}
export class LoadCurrentPurchaseSuccess implements Action {
    readonly type = WebsiteActionTypes.LoadCurrentPurchaseSuccess
    constructor (public payload: IPurchase){}
}
export class LoadCurrentPurchaseFail implements Action {
    readonly type = WebsiteActionTypes.LoadCurrentPurchaseFail
    constructor (public payload: string){}
}
export class UpdatePurchase implements Action {
    readonly type = WebsiteActionTypes.UpdatePurchase
    constructor (public payload: IPurchase){}
}
export class UpdatePurchaseSuccess implements Action {
    readonly type = WebsiteActionTypes.UpdatePurchaseSuccess
    constructor (public payload: IPurchase){}  //savePurchase(purchase: IPurchase): Observable<IPurchase>{
}
export class UpdatePurchaseFail implements Action {
    readonly type = WebsiteActionTypes.UpdatePurchaseFail
    constructor (public payload: string){}
}
export class DeletePurchase implements Action {
    readonly type = WebsiteActionTypes.DeletePurchase //deletePurchase(purchaseID: number, websiteID: number)Observable<boolean>
    constructor (public payload:  { purchaseID: number, websiteID: number}){}
}
export class DeletePurchaseSuccess implements Action {
    readonly type = WebsiteActionTypes.DeletePurchaseSuccess
    constructor (public payload: boolean){}
}
export class DeletePurchaseFail implements Action {
    readonly type = WebsiteActionTypes.DeletePurchaseFail
    constructor (public payload: string){}
}

export type WebsiteActions =
          SetSearchParams
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
	    | LoadCurrentPurchase
	    | LoadCurrentPurchaseSuccess
	    | LoadCurrentPurchaseFail
	    | InitializeCurrentPurchase
        | UpdatePurchase
        | UpdatePurchaseSuccess
        | UpdatePurchaseFail
        | DeletePurchase
        | DeletePurchaseSuccess
        | DeletePurchaseFail

