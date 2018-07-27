import { Action } from "@ngrx/store";
import { IUser, IUserProfile } from "../iuser";

export enum UserActionTypes {
    Login = '[Users] Login',
	LoginSuccess = '[Users]Login Success',
	LoginFail = '[Users] Login Fail',
    ClearCurrentError = '[Users] Clear Error',
    Logout= '[Users] Logout',
}

export class Login implements Action {
    readonly type = UserActionTypes.Login
    constructor (public payload: IUser){}
}
export class LoginSuccess implements Action {
    readonly type = UserActionTypes.LoginSuccess
    constructor (public payload: IUserProfile){}
}
export class LoginFail implements Action {
    readonly type = UserActionTypes.LoginFail
    constructor (public payload: string){}
}
export class ClearCurrentError implements Action {
    readonly type = UserActionTypes.ClearCurrentError
    constructor (){}
}
export class Logout implements Action {
    readonly type = UserActionTypes.Logout
    constructor (){}
}

export type UserActions =
          Login
        | LoginSuccess
        | LoginFail
        | ClearCurrentError
        | Logout
