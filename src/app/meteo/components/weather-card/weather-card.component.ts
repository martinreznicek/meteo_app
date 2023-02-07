import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ViewStateService} from '../../services/view-state.service';
import {MatDialog} from '@angular/material/dialog';
import {WeatherCard} from '../../models/weather-card.model';
import {EditNameComponent} from '../dialogs/edit-name/edit-name.component';
import {BaseModel} from '../../models/base.model';

@Component({
  selector: 'app-weather-card',
  templateUrl: './weather-card.component.html',
  styleUrls: ['./weather-card.component.css']
})
export class WeatherCardComponent implements OnInit {
  @Input() weatherInfo: WeatherCard;
  @Output() editId = new EventEmitter<BaseModel>();
  @Output() removeId = new EventEmitter<number>();

  public math = Math;

  public showDetails = false;
  public buttonsVisible = false;
  private hideTimeout;

  constructor(
    public viewState: ViewStateService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    console.log(this.weatherInfo);
  }

  public showButtons() {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
    this.buttonsVisible = true;
  }

  public hideButtons() {
    this.hideTimeout = setTimeout(() => {
      this.buttonsVisible = false;
    }, 0);
  }

  goToForecast(locationId: number) {
    window.open('https://openweathermap.org/city/' + locationId.toString());
  }

  public openEditDialog(index: number) {
    const dialogRef = this.dialog.open(EditNameComponent, {
      width: '20%',
      data: { name: this.weatherInfo.name }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.editId.emit({id: index, name: result.name});
    });
  }

  public removeCard(index: number) {
    // TODO: dialog
    this.removeId.emit(index);
  }

  public showMoreInfo() {
    this.showDetails = !this.showDetails;
    if (!this.showDetails) {
      this.buttonsVisible = false;
    }
  }

}
