import { Component, OnInit, Renderer2} from '@angular/core';
import {MeteoService} from './meteo/meteo.service';
import {WeatherCard} from './meteo/models/weather-card.model';
import {FormControl} from '@angular/forms';
import {City} from './meteo/models/city.model';
import {MatDialog} from '@angular/material/dialog';
import {AddCardComponent, DialogData} from './meteo/components/add-card/add-card.component';
import {EditNameComponent} from './meteo/components/edit-name/edit-name/edit-name.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public title = 'Weather Info';
  public weatherInfo: WeatherCard[] = [];
  public windDirectionCompass: string;
  public lastUpdate: string;
  public math = Math;

  public mouseOverButton = false;

  public city = new FormControl();
  public cities: City[] = [];

  constructor(
    private service: MeteoService,
    private renderer: Renderer2,
    public dialog: MatDialog
  ) { }

  async ngOnInit() {
    this.loadFromStorage();
    this.getAllWeather();

  }

  /*TODO
    add input validation for min and max number https://www.concretepage.com/angular-2/angular-4-min-max-validation
  */

  public showTemperature(): number {
    const temp = Math.floor(Math.random() * 100);
    console.log(temp);
    return temp;
  }

  private getAllWeather() {
    try {
      this.weatherInfo.forEach(w => {
        this.getWeatherInfo(w.id, w.coordinates);
      });
      setTimeout(() => {
        this.getAllWeather();
      }, 600000);
    }
    catch (err) {
      console.error('getAllWeather', err);
    }

  }

  private async getWeatherInfo(index: number, coordinates: {lat: number, long: number}, onInit?: boolean) {
    try {
      this.weatherInfo[index].weather = await this.service.getWeather(coordinates);
      if (!this.weatherInfo[index].name) {
        this.weatherInfo[index].name = this.weatherInfo[index].weather.name;
      }
      // this.setTemperatureAndHumidity(this.weatherInfo[index].weather.main.temp, this.weatherInfo[index].weather.main.humidity);
      if (!onInit) {
        setTimeout(() => {
          this.setWindDirection(this.weatherInfo[index].weather.wind.deg, 'windmeter' + index);
        }, 0);
      }
      this.lastUpdate = this.setLastUpdate(this.weatherInfo[index].weather.dt);
      this.weatherInfo[index].loading = false;
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
    const dialogRef = this.dialog.open(AddCardComponent, {
      width: '30%',
      data: {city: '', coordinates: {}}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.onDataSelected(result);
    });
  }

  public removeCard(index: number) {
    this.weatherInfo.splice(index, 1);
    this.saveToStorage();
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

  public showInformation(index: number) {
    console.log(this.weatherInfo[index]);
    window.alert('Information logged to console');
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
    await this.getWeatherInfo(newObject.id, newObject.coordinates);
    this.saveToStorage();
  }

  private changeName(index: number, name: string) {
    this.weatherInfo[index].name = name;
    this.saveToStorage();
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

  private saveToStorage() {
    const obj = {};
    this.weatherInfo.forEach(w => {
      obj[w.id] = { name: w.name, coordinates: w.coordinates };
    });
    localStorage.setItem('weatherInfo_storage', JSON.stringify(obj));
  }

  private loadFromStorage() {
    const storedData = localStorage.getItem('weatherInfo_storage');
    if (!storedData) {
      this.weatherInfo.push({id: 0, name: 'Prague', coordinates: {lat: 50.0874654, long: 14.4212535},
        weather: null, loading: true, showButtons: false});
      return;
    }
    const parsedData = JSON.parse(storedData);
    // tslint:disable-next-line:forin
    for (const key in parsedData) {
      const newObject: WeatherCard = {id: Number(key), name: parsedData[key].name, coordinates: parsedData[key].coordinates,
        weather: null, loading: true, showButtons: false};
      this.weatherInfo.push(newObject);
    }
  }

}
