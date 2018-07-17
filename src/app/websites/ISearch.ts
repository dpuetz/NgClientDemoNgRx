export interface ISearch {
      searchWord: string;
      isBill: boolean;
      isPreferred: boolean;
  }

export class Search implements ISearch {
    searchWord: string = '';
    isBill: boolean = false;
    isPreferred = true;
  }
