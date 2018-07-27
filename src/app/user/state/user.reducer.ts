import * as fromRoot from '../../state/app.state';
import { IUserProfile, UserProfile } from '../iuser';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserActions, UserActionTypes } from './user.actions';

//interface for entire application state
export interface State extends fromRoot.State {
    user: UserState
}

// interface for this slice of state
export interface UserState {
    userProfile: IUserProfile,
    error: string
}

//set an initial state so never any undefined
const initialState: UserState = {
    userProfile: null,
    error: ''
}

//Create a const for the entire feature slice
const getUserFeatureState = createFeatureSelector<UserState>('user');

//then use that to create a selector for each in initialState
export const getUserProfile = createSelector (
    getUserFeatureState,
    state => state.userProfile
)
export const getError = createSelector (
    getUserFeatureState,
    state => state.error
);

//use optional parameters to set the state to the initial state
export function userReducer (state = initialState, action: UserActions): UserState {
    switch (action.type) {
        case UserActionTypes.LoginSuccess:
            return {
                ...state,
                userProfile: action.payload // ? {...action.payload}
            }
        case UserActionTypes.LoginFail:
            return {
                ...state,
                error: action.payload
            }
        case UserActionTypes.ClearCurrentError:
            return {
                ...state,
                error: ''
            }
        case UserActionTypes.Logout:
            return {
                ...state,
                userProfile: null,
                error: ''
            }
        default:
            return state;
    }//switch

}//userReducer