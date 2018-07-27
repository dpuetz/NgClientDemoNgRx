import { Component } from '@angular/core';

@Component({
    template: `
<div style='background-color:red'>
I am the page not found component

</div>
        <div class="container" style='min-height:150px' >
                <h2 class='text-center'>
                Sorry, this page doesn't exist.
                </h2>
                <h2 class='text-center'>
                        <a [routerLink]="['']">
                        <i class="fa fa-angle-double-left"></i>
                        Back</a>
                </h2>
        </div>
    `
})
export class PageNotFoundComponent { }