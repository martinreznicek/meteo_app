import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormControl} from '@angular/forms';
import {MeteoService} from '../../meteo.service';
import {City} from '../../models/city.model';

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

  public city = new FormControl();
  public cities: City[] = [];
  public typingTimer: any;
  public doneTypingInterval = 1500;
  public insertGpsManually = false;

  constructor(
    public dialogRef: MatDialogRef<AddCardComponent>,
    private service: MeteoService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
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
    this.cities = await this.service.getCoordinates(this.city.value);
  }

}
