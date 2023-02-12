import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormControl, Validators} from '@angular/forms';
import {ApiService} from '../../../services/api.service';
import {City} from '../../../models/city.model';
import {ViewStateService} from '../../../services/view-state.service';

export interface DialogData {
  city: City;
  coordinates: {
    lat: number;
    long: number;
  };
}

@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.css']
})
export class AddCardComponent implements OnInit {

  public cities: City[] = [];
  public typingTimer: any;
  public doneTypingInterval = 300;
  public insertGpsManually = false;
  public optionConfirmed = false;
  public locationSelected = false;
  public city = new FormControl( '', [Validators.required]);
  public latitude = new FormControl( '', [Validators.required, Validators.min(-90), Validators.max(90)]);
  public longitude = new FormControl('', [Validators.required, Validators.min(-180), Validators.max(180)]);

  constructor(
    private service: ApiService,
    public viewState: ViewStateService,
    public dialogRef: MatDialogRef<AddCardComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {
    this.latitude.disable();
    this.longitude.disable();
    this.viewState.setDialogDark();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onConfirm() {
    this.optionConfirmed = true;
  }

  hasErrors(): boolean {
    let hasErrors = false;
    if (this.latitude.errors || this.longitude.errors || this.city.errors || !this.locationSelected || this.optionConfirmed) {
      hasErrors = true;
    }
    return hasErrors;
  }

  onChange(event) {
    if (event.checked) {
      this.city.disable();
      this.latitude.enable();
      this.longitude.enable();
    }
    else {
      this.city.enable();
      this.latitude.disable();
      this.longitude.disable();
    }
  }

  public startTimer() {
    const c = true;
    clearTimeout(this.typingTimer);
    if (c) {
      this.typingTimer = setTimeout(() => {
        this.afterDoneTyping();
      }, this.doneTypingInterval);
    }
  }

  public getSelectedCityName(city) {
    return city.name;
  }

  private async afterDoneTyping() {
    if (this.city.value) {
      this.cities = await this.service.getCoordinates(this.city.value);
    } else {
      this.cities = [];
    }
  }

}
