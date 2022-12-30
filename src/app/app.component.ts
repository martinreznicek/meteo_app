import {AfterViewInit, Component, OnInit, Renderer2} from '@angular/core';
import {MeteoService} from './meteo/meteo.service';
import {WeatherCard} from './meteo/models/weather-card.model';

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

  constructor(private service: MeteoService, private renderer: Renderer2) {
    this.weatherInfo.push({id: 0, coordinates: {lat: -50, long: 15}, name: '', weather: null});
  }

  async ngOnInit() {
    await this.getWeatherInfo(true);
  }

  ngAfterViewInit() {
    this.setWindDirection(this.weatherInfo[0].weather.wind.deg, 'windmeter0');
    document.getElementById('windDirection').innerHTML = this.windDirectionCompass;
  }

  /*TODO
    dropdown to choose one of Czech regional cities https://material.angular.io/components/select/overview
    input inside form for GPS coordinates https://material.angular.io/components/input/examples
    improve layout https://material.angular.io/components/grid-list/examples
  */

  public showTemperature(): number {
    const temp = Math.floor(Math.random() * 100);
    console.log(temp);
    return temp;
  }

  public changeTitle(index: number) {
    this.weatherInfo[index].name = document.getElementById('name' + index.toString()).innerHTML;
  }

  private async getWeatherInfo(onInit?: boolean) {
    try {
      this.weatherInfo[0].weather = await this.service.get({lat: 50, long: 15});
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
    const index = this.weatherInfo.length;
    const newObject: WeatherCard = {id: index, coordinates: {lat: 52.5, long: 14.2}, name: 'Karel', weather: null, loading: true};
    this.weatherInfo.push(newObject);
    try {
      this.weatherInfo[index].weather = await this.service.get(newObject.coordinates);
      if (!this.weatherInfo[index].name) {
        this.weatherInfo[index].name = this.weatherInfo[index].weather.name;
      }
      setTimeout(() => { this.setWindDirection(this.weatherInfo[0].weather.wind.deg, 'windmeter1'); }, 0);
      this.lastUpdate = this.setLastUpdate(this.weatherInfo[1].weather.dt);
      this.weatherInfo[index].loading = false;
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
    await this.getWeatherInfo2();
    // this.weatherInfo.push(this.weatherInfo[0]);
  }

  public removeCard(index: number) {
    this.weatherInfo.splice(index, 1);
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
