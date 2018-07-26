import { Injectable } from "@angular/core";
import { UserService } from "../user.service";
import * as fromUsers from './user.reducer';
import { Store, Action } from "@ngrx/store";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Observable, of } from "rxjs";
import * as userActions from './user.actions';
import { map, mergeMap, catchError } from "rxjs/operators";
import { IUser, getUserProfile } from "../iuser";

@Injectable()
export class UserEffects {
    constructor(private userService: UserService,
                private store: Store<fromUsers.State>,
                private actions$: Actions ){}

    @Effect()
    doLogin$: Observable<Action> = this.actions$
        .pipe(
            ofType(userActions.UserActionTypes.Login),
            map((action: userActions.Login) => action.payload), //map
            mergeMap((user: IUser) =>
                        this.userService.doLogin(user).pipe(
                            map(isLoggedIn => (new userActions.LoginSuccess(getUserProfile(isLoggedIn)))),
                            catchError(err => of(new userActions.LoginFail(err)))
                        )//pipe
            )//mergemap
    ); //pipe



 } //class UserEffects