import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ViewStateService {

  private theDarkTheme = false;
  // @ts-ignore
  private theCardTemplate = 1;

  constructor() { }

  // @ts-ignore
  get cardTemplate() {
    return this.theCardTemplate;
  }

  get darkTheme() {
    return this.theDarkTheme;
  }

  public changeTheme() {
    this.theDarkTheme = !this.theDarkTheme;
  }

  public changeCardTemplate() {
    if (this.theCardTemplate === 0) {
      this.theCardTemplate = 1;
    } else {
      this.theCardTemplate = 0;
    }
  }
}
