import { Component, OnInit } from "@angular/core";
import { Store, select } from "@ngrx/store";
// import { UserInfo } from '../state/app.reducer';


@Component({
    selector: 'app-header',
    templateUrl: './app-header.html'
})
export class AppHeaderComponent implements OnInit{
    userName: '';
    constructor(){};

    ngOnInit() {
        // this.store.pipe(select(getUserInfoState)).subscribe(
        //     // if (userName) {
        //         userName => this.userName = userName
        //     // }
        // )//subscribe
    }


}//class