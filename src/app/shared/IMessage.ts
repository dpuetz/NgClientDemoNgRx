export interface IMessage { 
    type: string;
    message: string;
    callback: string;  
    duration: number;
}

export class Message implements IMessage {
    type: string;  //must be one of these: 'alert', 'confirm' or 'timedalert'
    message: string; //what you want the user to see
    callback: string;  //name of the callback you want run
    duration: number;  //for timedalert only, eg: 1000 = 1 sec
    constructor(alertType: string, inMessage: string, callbackName: string, seconds: number) {        
        this.type = alertType;
        this.message = inMessage;
        this.callback = callbackName;      
        this.duration = seconds;
    }
  }