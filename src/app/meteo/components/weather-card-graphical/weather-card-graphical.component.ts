import {Component, EventEmitter, Input, OnInit, Output, Renderer2} from '@angular/core';
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
    private renderer: Renderer2,
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.setWindDirection();
    }, 2000);
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
      // console.log({id: index, name: result.name});
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

  private setWindDirection() {
    this.resolveWindDirection(this.weatherInfo.weather.wind.deg);
    this.setCompassNeedleAngle(this.weatherInfo.weather.wind.deg);
  }

  private setCompassNeedleAngle(windDirection: number) {
    const image = document.getElementById('windmeter' + this.weatherInfo.id);
    console.log('image is', document.getElementById('windmeter' + this.weatherInfo.id));
    this.renderer.setStyle(
      image,
      'transform',
      `rotate(${windDirection + 90}deg)`
    );
  }

  private resolveWindDirection(windDirection: number) {
    switch (true) {
      case (windDirection <= 22.5): this.windDirectionCompass = 'N';
                                    break;
      case (windDirection <= 67.5): this.windDirectionCompass = 'NE';
                                    break;
      case (windDirection <= 112.5): this.windDirectionCompass = 'E';
                                     break;
      case (windDirection <= 157.5): this.windDirectionCompass = 'SE';
                                     break;
      case (windDirection <= 202.5): this.windDirectionCompass = 'S';
                                     break;
      case (windDirection <= 247.5): this.windDirectionCompass = 'SW';
                                     break;
      case (windDirection <= 292.5): this.windDirectionCompass = 'W';
                                     break;
      case (windDirection <= 337.5): this.windDirectionCompass = 'NW';
                                     break;
      default: this.windDirectionCompass = 'N';
               break;
    }
  }

}
