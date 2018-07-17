import { IPurchase } from "./IPurchase"

export interface IWebsite {
    websiteID: number;
    websiteName: string;
    lstPurchases: IPurchase[];
    preferred: boolean;
    isBill: boolean;
    url: string;
    username: string;
    password: string;
    notes: string;
    email: string;
    question: string;
    answer: string;

  }

export class Website implements IWebsite {
  websiteID: number = 0;
  websiteName: string = '';
  lstPurchases: IPurchase[] = [];
  preferred: boolean = true;
  isBill: boolean = false;
  url: string = '';
  username: string = '';
  password: string = '';
  notes: string = '';
  email: string = '';
  question: string = '';
  answer: string = '';
}
