//isolated test of component

    // constructor( private router: Router,
    //              private loginService: LoginService,
    //              private fb: FormBuilder ) {

import { LoginComponent } from './login.component';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from './iuser';
import { IMessage, Message } from '../shared/imessage';
import { LoginService } from './login.service';
import { FormGroup, FormBuilder, AbstractControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

describe('LoginComponent', () => {
    let component: LoginComponent;
    let mockRouterService, mockLoginService, mockFormbuilder
    beforeEach(() => {
        component = new LoginComponent(mockRouterService, mockLoginService, mockFormbuilder);
        this.validationMessages = {
            username: {
                required: 'Please enter your user name.'
            },
            password: {
                required: 'Please enter your password.'
            }
        };
        this.model = {username:'GuestTest', password:'PasswordTest'};
    });  ///beforeEach

    describe('Validation Messages', ()=> {
        it('should show usernameMsg required', () => {
            this.usernameMsg = this.validationMessages.username['required']
            expect(this.usernameMsg).toBe('Please enter your user name.');
        });

        it('should show passwordMsg required', () => {
            this.passwordMsg = this.validationMessages.password['required']
            expect(this.passwordMsg).toBe('Please enter your password.');
        })

    });//2 describe

    









});//1 describe

// describe('username validators', () => {
//         it('should have 1', () => {
//             expect(1).toBe(2);
//         })
// })