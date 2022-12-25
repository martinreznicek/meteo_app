import {AfterViewInit, Component, OnInit, Renderer2} from '@angular/core';
import { MeteoService } from './meteo/meteo.service';
import { Weather } from './meteo/models/weather.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  public title = 'Weather Info';
  public weatherInfo: Weather[] = [];
  public windDirectionCompass: string;
  public lastUpdate: string;
  private lat = 50;
  private long = 15;

  constructor(private service: MeteoService, private renderer: Renderer2) { }

  async ngOnInit() {
    this.getWeatherInfo(true);
  }

  ngAfterViewInit() {
    this.setWindDirection(this.weatherInfo[0].wind.deg);
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

  private async getWeatherInfo(onInit?: boolean) {
    try {
      this.weatherInfo[0] = await this.service.get(this.lat, this.long);
      this.setTemperatureAndHumidity(this.weatherInfo[0].main.temp, this.weatherInfo[0].main.humidity);
      if (!onInit) {
        this.setWindDirection(this.weatherInfo[0].wind.deg);
      }
      this.lastUpdate = this.setLastUpdate(this.weatherInfo[0].dt);
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

  public addCard() {
    this.weatherInfo.push(this.weatherInfo[0]);
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

  private setWindDirection(windDirection: number) {
    this.resolveWindDirection(windDirection);
    this.setCompassNeedleAngle(windDirection);
  }

  private setCompassNeedleAngle(windDirection: number) {
    const image = document.getElementById('windmeter');
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
