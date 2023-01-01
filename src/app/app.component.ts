import {AfterViewInit, Component, OnInit, Renderer2} from '@angular/core';
import {MeteoService} from './meteo/meteo.service';
import {WeatherCard} from './meteo/models/weather-card.model';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {City} from './meteo/models/city.model';
import {MatDialog} from '@angular/material/dialog';
import {AddCardComponent, DialogData} from './meteo/components/add-card/add-card.component';
import {EditNameComponent} from './meteo/components/edit-name/edit-name/edit-name.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  public title = 'Weather Info';
  public weatherInfo: WeatherCard[] = [];
  public windDirectionCompass: string;
  public lastUpdate: string;
  public math = Math;

  public mouseOverButton = false;

  public city = new FormControl();
  public cities: City[] = [];
  filteredOptions: Observable<string[]>;

  public addDialog = false;
  public typingTimer: any;
  public doneTypingInterval = 1500;
  public selectedCity: string;

  public animal: string;
  public name: string;


  constructor(
    private service: MeteoService,
    private renderer: Renderer2,
    public dialog: MatDialog
  ) { this.weatherInfo.push({id: 0, coordinates: {lat: -50, long: 15}, name: '', weather: null, showButtons: false}); }

  public startTimer() {
    const c = true;
    clearTimeout(this.typingTimer);
    if (c) {
      this.typingTimer = setTimeout(() => {
        this.afterDoneTyping();
      }, this.doneTypingInterval);
    }
  }

  private async afterDoneTyping() {
    this.cities = await this.service.getCoordinates(this.city.value);
  }

  async ngOnInit() {
    await this.getWeatherInfo(true);
  }

  ngAfterViewInit() {
    this.setWindDirection(this.weatherInfo[0].weather.wind.deg, 'windmeter0');
    document.getElementById('windDirection').innerHTML = this.windDirectionCompass;
  }

  /*TODO
    use local storage
    add input validation for min and max number https://www.concretepage.com/angular-2/angular-4-min-max-validation
  */

  public showTemperature(): number {
    const temp = Math.floor(Math.random() * 100);
    console.log(temp);
    return temp;
  }

  private async getWeatherInfo(onInit?: boolean) {
    try {
      this.weatherInfo[0].weather = await this.service.getWeather({lat: 50, long: 15});
      if (!this.weatherInfo[0].name) {
        this.weatherInfo[0].name = this.weatherInfo[0].weather.name;
      }
      this.setTemperatureAndHumidity(this.weatherInfo[0].weather.main.temp, this.weatherInfo[0].weather.main.humidity);
      if (!onInit) {
        this.setWindDirection(this.weatherInfo[0].weather.wind.deg, 'windmeter0');
      }
      this.lastUpdate = this.setLastUpdate(this.weatherInfo[0].weather.dt);
      /* FOR TESTING
      * this.lat++;
      *console.log('weatherInfo', this.weatherInfo);
      */
      setTimeout(() => {
        this.getWeatherInfo();
      }, 600000);
    } catch (error) {
      console.error('getWeatherInfo', error);
    }
  }

  private async getWeatherInfo2() {
    const index = this.weatherInfo.length - 1;
    console.log(this.weatherInfo[index]);
    try {
      this.weatherInfo[index].weather = await this.service.getWeather(this.weatherInfo[index].coordinates);
      if (!this.weatherInfo[index].name) {
        this.weatherInfo[index].name = this.weatherInfo[index].weather.name;
      }
      setTimeout(() => {
        this.setWindDirection(this.weatherInfo[index].weather.wind.deg, 'windmeter' + index);
        }, 0);
      this.lastUpdate = this.setLastUpdate(this.weatherInfo[1].weather.dt);
      this.weatherInfo[index].loading = false;
      console.log(this.weatherInfo);
      /* FOR TESTING
      * this.lat++;
      *console.log('weatherInfo', this.weatherInfo);
      */
      setTimeout(() => {
        this.getWeatherInfo2();
      }, 600000);
    } catch (error) {
      console.error('getWeatherInfo', error);
    }
  }

  public setLastUpdate(timestamp: number): string {
    const dateTime = new Date(timestamp * 1000);

    const date = this.formateDatetimeValue(dateTime.getDate()) +
    '/' + this.formateDatetimeValue(dateTime.getMonth() + 1) +
    '/' + dateTime.getFullYear() +
    ' ' + this.formateDatetimeValue(dateTime.getHours()) +
    ':' + this.formateDatetimeValue(dateTime.getMinutes()) +
    ':' + this.formateDatetimeValue(dateTime.getSeconds());

    return date;
  }

  public async addCard() {
    this.addDialog = true;
    const dialogRef = this.dialog.open(AddCardComponent, {
      width: '20%',
      data: {city: '', coordinates: {}}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.onDataSelected(result);
    });
  }

  public removeCard(index: number) {
    this.weatherInfo.splice(index, 1);
  }

  public openEditDialog(index: number) {
    const dialogRef = this.dialog.open(EditNameComponent, {
      width: '20%',
      data: { name: this.weatherInfo[index].name }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.changeName(index, result.name);
    });
  }

  public toggleButtons(index: number, mouseOver?: boolean) {
    if (this.mouseOverButton) {
      console.log('mouseOverButton');
      return;
    }
    const showButtons = this.weatherInfo[index].showButtons;
    if (mouseOver) {
      if (!showButtons) {
        this.weatherInfo[index].showButtons = true;
      }
    } else {
      this.weatherInfo[index].showButtons = false;
    }
  }

  public onBtnOver(mouseOver?: boolean) {
    this.mouseOverButton = mouseOver;
  }

  public async getCityGPS(city: string) {
    this.cities = await this.service.getCoordinates(city);
    console.log(this.cities);
  }

  public async onOptionSelected(event) {
    const city = event.option.value as City;
    this.selectedCity = event.option.value;
    const newObject: WeatherCard = {id: this.weatherInfo.length, coordinates: {lat: city.lat, long: city.lon}, name: city.name,
      weather: null, loading: true, showButtons: false};
    this.weatherInfo.push(newObject);
    await this.getWeatherInfo2();
    this.addDialog = false;
  }

  public async onCitySelected(city: City) {
    const newObject: WeatherCard = {id: this.weatherInfo.length, coordinates: {lat: city.lat, long: city.lon}, name: city.name,
      weather: null, loading: true, showButtons: false};
    this.weatherInfo.push(newObject);
    await this.getWeatherInfo2();
    this.addDialog = false;
  }

  public async onGpsInput(coord: {lat: number, long: number}) {
    const newObject: WeatherCard = {id: this.weatherInfo.length, coordinates: {lat: coord.lat, long: coord.long}, name: null,
      weather: null, loading: true, showButtons: false};
    this.weatherInfo.push(newObject);
    await this.getWeatherInfo2();
    this.addDialog = false;
  }

  private async onDataSelected(data: DialogData) {
    const newObject: WeatherCard = { id: this.weatherInfo.length, coordinates: {lat: 0, long: 0},
      name: null, weather: null, loading: true, showButtons: false };

    if (data.coordinates.lat) {
      newObject.coordinates = {lat: data.coordinates.lat, long: data.coordinates.long};
    }
    else if (data.city) {
      newObject.name = data.city.name;
      newObject.coordinates =  {lat: data.city.lat, long: data.city.lon};
    }

    this.weatherInfo.push(newObject);
    await this.getWeatherInfo2();
    this.addDialog = false;
  }

  public getSelectedCityName(city) {
    return city.name;
  }

  private changeName(index: number, name: string) {
    this.weatherInfo[index].name = name;
  }

  // if minutes is smaller than 10, add 0 => minutes has always 2 digits
  private formateDatetimeValue(value: number) {
    return (value < 10 ? '0' : '') + value;
  }

  private setTemperatureAndHumidity(temp: number, humi: number) {
    const tempScale = (temp + 30) * 1.25;
    // document.getElementById('barTemp').style.height = 4 * tempScale + 'px';
    // document.getElementById('barHumi').style.height = 4 * humi + 'px';

    const temperature = document.getElementById('barTemp2');
    temperature.style.height = tempScale.toString() + '%';
    temperature.style.top = (100 - tempScale).toString() + '%';

    const humidity = document.getElementById('barHumi2');
    humidity.style.height = humi.toString() + '%';
    humidity.style.top = (100 - humi).toString() + '%';
  }

  private setWindDirection(windDirection: number, elementId: string) {
    this.resolveWindDirection(windDirection);
    this.setCompassNeedleAngle(windDirection, elementId);
  }

  private setCompassNeedleAngle(windDirection: number, elementId: string) {
    const image = document.getElementById(elementId);
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
