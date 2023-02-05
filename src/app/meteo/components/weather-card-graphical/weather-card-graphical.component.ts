import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {WeatherCard} from '../../models/weather-card.model';
import {BaseModel} from '../../models/base.model';
import {ViewStateService} from '../../services/view-state.service';
import {MatDialog} from '@angular/material/dialog';
import {EditNameComponent} from '../dialogs/edit-name/edit-name.component';

@Component({
  selector: 'app-weather-card-graphical',
  templateUrl: './weather-card-graphical.component.html',
  styleUrls: ['./weather-card-graphical.component.css']
})
export class WeatherCardGraphicalComponent implements OnInit {
  @Input() weatherInfo: WeatherCard;
  @Output() editId = new EventEmitter<BaseModel>();
  @Output() removeId = new EventEmitter<number>();

  public math = Math;

  public windDirectionCompass: string;
  public showDetails = false;
  public buttonsVisible = false;
  private hideTimeout;

  constructor(
    public viewState: ViewStateService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
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

  private resolveWindDirection(windDirection: number): string {
    if (windDirection <= 22.5) { return 'N'; }
    if (windDirection <= 67.5) { return 'NE'; }
    if (windDirection <= 112.5) { return 'E'; }
    if (windDirection <= 157.5) { return 'SE'; }
    if (windDirection <= 202.5) { return 'S'; }
    if (windDirection <= 247.5) { return 'SW'; }
    if (windDirection <= 292.5) { return 'W'; }
    if (windDirection <= 337.5) { return 'NW'; }
    else { return 'N'; }
  }

}
