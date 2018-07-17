import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageComponent } from './message.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    MessageComponent
  ],
  exports: [
    MessageComponent,
    CommonModule,
    FormsModule
  ]
})
export class SharedModule { }
