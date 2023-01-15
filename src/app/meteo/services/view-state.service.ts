import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ViewStateService {

  private theDarkTheme;
  private theCardTemplate;

  constructor() { }

  get cardTemplate() {
    return this.theCardTemplate;
  }

  get darkTheme() {
    return this.theDarkTheme;
  }

  public changeTheme() {
    this.theDarkTheme = !this.theDarkTheme;
    this.setBodyDark();
    this.saveUiToStorage();
  }

  public setBodyDark() {
    const body = document.getElementsByTagName('body');
    body[0].style.background = this.theDarkTheme ? '#333333' : '';
  }

  public setDialogDark() {
    const body = document.getElementsByTagName('mat-dialog-container');
    // @ts-ignore
    body[0].classList.add(this.theDarkTheme ? 'darkDialog' : '');
  }

  public setMenuTheme() {
    const panel = document.getElementsByClassName('mat-menu-panel');
    if (this.theDarkTheme) {
      panel[0].classList.add('darkMenu');
    }
    const content = document.getElementsByClassName('mat-menu-content');
    for (const childrenKey in content[0].children) {
      if (this.theDarkTheme) {
        content[0].children[childrenKey].classList.add('inverseColor');
        content[0].children[childrenKey].children[0].classList.add('inverseColor');
      } else {
        content[0].children[childrenKey].classList.remove('inverseColor');
        content[0].children[childrenKey].children[0].classList.remove('inverseColor');
      }
    }
  }

  public changeCardTemplate() {
    if (this.theCardTemplate === 0) {
      this.theCardTemplate = 1;
    } else {
      this.theCardTemplate = 0;
    }
    this.saveUiToStorage();
  }

  public loadUiFromStorage() {
    const storedUi = localStorage.getItem('weatherInfo_storage_ui');
    this.theCardTemplate = JSON.parse(storedUi).layout;
    this.theDarkTheme = JSON.parse(storedUi).theme;
  }

  private saveUiToStorage() {
    const ui = {theme: this.theDarkTheme, layout: this.theCardTemplate};
    localStorage.setItem('weatherInfo_storage_ui', JSON.stringify(ui));
  }
}
