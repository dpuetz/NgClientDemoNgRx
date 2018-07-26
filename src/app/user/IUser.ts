export interface IUser {
    username: string;
    password: string;
}

export interface IUserProfile {
    username: string;
    firstName: string;
    lastName: string;
    isLoggedIn: boolean;
}

export class UserProfile implements IUserProfile {
    //create a fake one for now
    username: string = 'Guest';
    firstName: string = 'Guest';
    lastName: string = 'Smith';
    isLoggedIn: boolean = true;
}

export function getUserProfile (isLoggedIn: boolean): IUserProfile {
    let profile = new UserProfile();
    profile.isLoggedIn = isLoggedIn;
    return profile;
}


export function getUserFullname (userprofile: IUserProfile): string {
    return userprofile.firstName + " " + userprofile.lastName;
}

