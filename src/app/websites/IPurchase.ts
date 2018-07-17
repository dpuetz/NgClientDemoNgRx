export interface IPurchase {
    purchaseID: number;
    websiteID: number;
    productName: string;  
    arrivedOn: string;
    purchasedOn: string;  
    totalAmount: number;
    shippingAmount: number;
    notes: string;
  }

  export class Purchase implements IPurchase {
    purchaseID: number = 0;
    websiteID: number = 0;
    productName: string = '';
    arrivedOn: string = '';
    purchasedOn: string = '';
    totalAmount: number = 0;
    shippingAmount: number = 0;
    notes: string = '';
  }