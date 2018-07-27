import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from './iuser';
import { IMessage, Message } from '../shared/imessage';
import { FormGroup, FormBuilder, AbstractControl, Validators } from '@angular/forms';
import { debounceTime, tap, takeWhile } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import * as fromUser from './state/user.reducer';
import * as userActions from './state/user.actions';

@Component({
  templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit, OnDestroy  {

    @Output() complete: EventEmitter<string> = new EventEmitter<string>();

    model: IUser;
    popup : IMessage;
    private validationMessages: { [key: string]: { [key: string]: string } };
    usernameMsg: string;
    passwordMsg: string;
    loginForm: FormGroup;
    componentActive = true;

    constructor( private router: Router,
                 private fb: FormBuilder,
                 private store: Store<fromUser.State>
                 ) {
        this.validationMessages = {
            username: {
                required: 'Please enter your user name.'
            },
            password: {
                required: 'Please enter your password.'
            }
        }

    };  //constructor

    ngOnInit() {
        this.createLoginForm();
        this.watchForLogin();
        this.watchNameChanges();
        this.watchPasswordChanges();
        this.watchForErrors();
    }

    watchForLogin(): void {
        this.store
            .pipe(
                    select(fromUser.getUserProfile),
                    takeWhile(() => this.componentActive)
                )//pipe
            .subscribe(userProfile => {
                if(userProfile) {
                    console.log('login-component userProfile', JSON.stringify(userProfile));
                    if (userProfile.isLoggedIn) {
                        // this.complete.emit(userProfile.firstName);
                        this.router.navigate(['/websites']);
                    } else {
                        this.badLogin();
                    }
                }
            })//subscribe
    }//watchForLogin()

    createLoginForm (): void {
        this.model = {username:'Guest', password:'Password'};
        this.loginForm = this.fb.group({
            username: ['Guest', [Validators.required]],
            password: ['Password', [Validators.required]]
        });
    }
    watchNameChanges(): void {
        const usernameControl = this.loginForm.get('username');
        usernameControl.valueChanges
                .pipe(
                        debounceTime(100),
                        takeWhile(() => this.componentActive)
                )
                .subscribe(value => {
                            this.setMessage(usernameControl, 'username');
                        }
        );
    }

    watchPasswordChanges():void {
        const passwordControl = this.loginForm.get('password');
        passwordControl.valueChanges
                .pipe(
                        debounceTime(100),
                        takeWhile(() => this.componentActive)
                    )
                .subscribe(value => {
                            this.setMessage(passwordControl, 'password');
                        }
        );
    }

    setMessage(c: AbstractControl, name: string): void {
        switch (name)   {
            case 'username':
                this.usernameMsg = '';
                if ((c.touched || c.dirty) && c.errors) {
                    this.usernameMsg = Object.keys(c.errors).map(key =>
                                this.validationMessages.username[key]).join(' ');
                }
                break;
            case 'password':
                this.passwordMsg = '';
                if ((c.touched || c.dirty) && c.errors) {
                    this.passwordMsg = Object.keys(c.errors).map(key =>
                                this.validationMessages.password[key]).join(' ');
                }
                break;
        } //switch
    } //setMessage

    loginIn(): void {
        let log = Object.assign({}, this.model, this.loginForm.value);
        this.store.dispatch(new userActions.Login( log ));
    }

    badLogin(): void {
        this.popup = new Message('alert', 'Since this is a demo, I\'ll login for you.', "onComplete", 0);
    }

    onComplete(event:any):void{
        this.router.navigate(['/websites']);
    }

    watchForErrors () {
        this.store
            .pipe(
                    select(fromUser.getError),
                    takeWhile(() => this.componentActive)
                )//pipe
            .subscribe(err => {
                if(err) {
                    console.log('login-component err', JSON.stringify(err));
                    this.store.dispatch(new userActions.ClearCurrentError());
                    this.popup = new Message('alert', 'Sorry, an error has occurred', "", 0);
                }
            })//subscribe
    }//watchForErrors

     ngOnDestroy() {
        this.componentActive = false;
     }

}//class



