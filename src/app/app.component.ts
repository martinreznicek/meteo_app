import {Component, OnInit, Renderer2} from '@angular/core';
import {ApiService} from './meteo/services/api.service';
import {CardLayout, WeatherCard} from './meteo/models/weather-card.model';
import {MatDialog} from '@angular/material/dialog';
import {DialogData} from './meteo/components/dialogs/add-card/add-card.component';
import {ViewStateService} from './meteo/services/view-state.service';
import {BaseModel} from './meteo/models/base.model';
import {Weather} from './meteo/models/weather.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public title = 'Weather Info';
  public weather: WeatherCard[] = [];
  public windDirection: string;
  public lastUpdate: Date;

  public loading = false;
  public cardTemplate = CardLayout;

  constructor(
    private apiService: ApiService,
    public viewState: ViewStateService,
    private renderer: Renderer2,
    public dialog: MatDialog
  ) { }

  async ngOnInit() {
    this.viewState.loadUiFromStorage();
    this.loadFromStorage();
    this.getAllWeather();
    this.viewState.setBodyDark();
    this.listenToRerender();
  }

  private listenToRerender() {
    this.viewState.rerender$.subscribe( () => {
      this.rerenderCards();
    });
  }

  private getAllWeather() {
    try {
      this.weather.forEach(w => {
        this.getWeatherInfo(w.id, w.coordinates).then();
      });
      setTimeout(() => {
        this.getAllWeather();
      }, 600000);
    }
    catch (err) {
      console.error('getAllWeather', err);
    }

  }

  private async getWeatherInfo(id: number, coordinates: {lat: number, long: number}, onInit?: boolean): Promise<void> {
    try {
      const weather = await this.apiService.getWeather(coordinates);
      this.weather[id].weather = weather;
      if (!this.weather[id].name) {
        this.weather[id].name = weather.name;
      }
      if (!onInit) {
        this.renderGraphicalElements(id, weather, 'windmeter' + id);

      }
      this.lastUpdate = new Date(weather.dt * 1000);
      this.weather[id].loading = false;
    } catch (error) {
      console.error('getWeatherInfo', error);
    }
  }

  public removeCard(index: number) {
    if (this.weather.length <= 1) {
      return;
    }
    this.weather.splice(index, 1);
    this.saveToStorage();
  }

  public rerenderCards() {
    this.loading = true;
    this.weather.forEach(w => {
      const id = w.id;
      this.renderGraphicalElements(id, this.weather[id].weather, 'windmeter' + id);
    });
    this.loading = false;
  }

  public async addCard(data: DialogData) {
    const newObject: WeatherCard = { id: this.weather.length, coordinates: {lat: 0, long: 0},
      name: null, weather: null, loading: true, showButtons: false, showDetails: false };

    if (data.coordinates.lat) {
      newObject.coordinates = {lat: data.coordinates.lat, long: data.coordinates.long};
    }
    else if (data.city) {
      newObject.name = data.city.name;
      newObject.coordinates =  {lat: data.city.lat, long: data.city.lon};
    }

    this.weather.push(newObject);
    await this.getWeatherInfo(newObject.id, newObject.coordinates);
    this.saveToStorage();
  }

  public changeName(data: BaseModel) {
    this.weather[data.id].name = data.name;
    this.saveToStorage();
  }

  private setTemperatureAndHumidity(index: number, temp: number, humi: number) {
    this.setStyle('temp', index, (temp + 30) * 1.25);
    this.setStyle('humid', index, humi);
  }

  private setStyle(selector: string, index: number, value: number) {
    const element = document.getElementById(selector + index);
    element.style.height = value.toString() + '%';
    element.style.top = (100 - value).toString() + '%';
  }

  private renderGraphicalElements(index: number, weather: Weather, elementId: string) {
    setTimeout(() => {
      this.setCompassNeedleAngle(weather.wind.deg, elementId);
      if (this.viewState.cardTemplate === CardLayout.Graphical) {
        this.setTemperatureAndHumidity(index, weather.main.temp, weather.main.humidity);
      }
    }, 200);
  }

  private setCompassNeedleAngle(windDirection: number, elementId: string) {
    const image = document.getElementById(elementId);
    this.renderer.setStyle(
      image,
      'transform',
      `rotate(${windDirection + 90}deg)`
    );
  }

  private saveToStorage() {
    const obj = {};
    let i = 0;
    this.weather.forEach(w => {
      obj[i] = { name: w.name, coordinates: w.coordinates };
      i++;
    });
    localStorage.setItem('weatherInfo_storage', JSON.stringify(obj));
  }

  private loadFromStorage() {
    const storedData = localStorage.getItem('weatherInfo_storage');
    if (!storedData) {
      this.weather.push({id: 0, name: 'Prague', coordinates: {lat: 50.0874654, long: 14.4212535},
        weather: null, loading: true, showButtons: false, showDetails: false });
      return;
    }
    const parsedData = JSON.parse(storedData);
    // tslint:disable-next-line:forin
    for (const key in parsedData) {
      const newObject: WeatherCard = {id: Number(key), name: parsedData[key].name, coordinates: parsedData[key].coordinates,
        weather: null, loading: true, showButtons: false, showDetails: false };
      this.weather.push(newObject);
    }
  }

}
