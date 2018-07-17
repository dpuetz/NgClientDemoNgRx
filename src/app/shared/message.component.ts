import { Component, OnChanges, Input, Output, EventEmitter } from "@angular/core";
import { IMessage, Message } from "./imessage";
declare var bootbox:any;


// place this in the parent html:
// <message [alert]="alert" (complete)="onComplete($event)">
// </message> 

@Component({
    selector: 'message',                             
    templateUrl: './message.component.html'
})

export class MessageComponent implements OnChanges {

    @Input() popup: IMessage;
    @Output() complete: EventEmitter<string> = new EventEmitter<string>();

    constructor(  ) { }    

    ngOnChanges(): void{

        if (this.popup && this.popup.message && this.popup.type)
        { 
                           
            switch (this.popup.type.toLowerCase()) {
                case 'alert': 
                    this.showAlert(this.popup.message);
                    break;
                case 'confirm':
                    this.showConfirm(this.popup.message);
                    break;
                case 'timedalert':
                    this.timedAlert(this.popup.message);
                    break;                

                default: //do nothing
            }//switch
            
        }//if      
    }//ngOnChanges

    runCallback():void{
        if (this.popup.callback.toLowerCase() === "oncomplete")
            this.complete.emit();
    }
    
    showAlert(msg: string): void {
        var self = this;
        bootbox.alert({ 
            message: msg, 
            size: 'small', 
            closeButton: false,
            buttons: { ok: { label: 'Ok', className: 'btn-info' }},
            callback: function() {
                self.runCallback();
            }//alert
         });
    }//showAlert

    showConfirm(msg: string): void {
        var self = this;
        bootbox.confirm({
            message: msg,  
            closeButton: false,
            size: 'small',
            buttons: {
                confirm: {
                    label: 'Yes',
                    className: 'btn-info'
                },
                cancel: {
                    label: 'No',
                    className: 'btn-info'
                }
            }, //buttons
            callback: function (result) {
                if (result == true){
                    self.runCallback();
                }                
            }//callback
        }); //bootbox.confirm 
    }//showAlert    


    //A callback with a timedAlert usually does not work, timed alert and callback seem unreliable together and the callback does not happen. 
    //To run a function after a time out message, try it like this:
        // this.popup = new Message('timedAlert', 'Save was successful!', "");
        // window.scrollTo(0, 0);
        // setTimeout (() => {
        //     this.router.navigate(['/websites/', webserviceWebsiteID, 'detail']); 
        // }, 3000);  

    timedAlert(msg)   
    {  
        //the close box's are hidden. 
        var self = this;
        bootbox.alert({
            message: msg,
            size: 'small',
            closeButton: false
            // , callback: function (result) {
            //     self.runCallback();
            // }   
        })//bootbox.alert
        .find('.modal-footer').css("display", "none");
        self.closeBootbox();     

    }//timedAlert

    closeBootbox():void {
        let iTimeout =  this.popup.duration;
        window.setTimeout(function(){
            bootbox.hideAll();                    
        }, iTimeout);     
    } 
 


}//class