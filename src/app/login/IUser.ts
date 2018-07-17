export interface IUser {
  username: string;
  password: string;
}

/* export class User {

  constructor(
    public username: string,
    public password: string
  ){}
}
   */

/* 

import {IUser} from './user.model';




products: IProducts[] = [];
   */


/* in same file, could have interface and a class: */  

/* export interface IUser {

  username: string;
  password: string;
}

//good if you need a product method,eg.
export class User implements IUser{

  constructor (
              public username: string,
              public password: string
  ){}
  can do:
  calculateDiscount(percent:number):number{
    return this.price - this.price * percent/100);
  }
} */