import { Component, OnInit, Renderer2 } from '@angular/core';
import { MeteoService } from './meteo/meteo.service';
import { Weather } from './meteo/models/weather.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public title = 'meteo';
  public weatherInfo: Weather;
  public windDirectionCompass: string;
  public lastUpdate: string;
  private lat = 50;
  private long = 15; 

  constructor(private service: MeteoService, private renderer: Renderer2) { };

  async ngOnInit() {
    this.getWeatherInfo();
  }
  
  public showTemperature(): number {
    const temp = Math.floor(Math.random() * 100);
    console.log(temp);
    return temp;
  }

  private async getWeatherInfo() {
    try {
      this.weatherInfo = await this.service.get(this.lat, this.long);
      this.setTemperatureAndHumidity(this.weatherInfo.main.temp, this.weatherInfo.main.humidity)
      this.setWindDirection(this.weatherInfo.wind.deg);   
      this.lastUpdate = this.setLastUpdate(this.weatherInfo.dt)
      /* FOR TESTING
      * this.lat++;
      *console.log('weatherInfo', this.weatherInfo);
      */        
      setTimeout(()=> {
        this.getWeatherInfo();
      }, 600000)
    } catch (error) {
      console.error('getWeatherInfo', error);
    }
  }

  public setLastUpdate(timestamp: number): string {
    const dateTime = new Date(timestamp*1000);

    const date = dateTime.getDate() +
    "/" + (dateTime.getMonth()+1) +
    "/" + dateTime.getFullYear() +
    " " + dateTime.getHours() +
    ":" + dateTime.getMinutes() +
    ":" + dateTime.getSeconds()

    return date
  }

  private setTemperatureAndHumidity(temp: number, humi: number) {
    const temp_scale = (temp + 30)*1.25;
    document.getElementById("barTemp").style.height = 4*temp_scale + "px";
    document.getElementById("barHumi").style.height = 4*humi + "px";
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
      `rotate(${windDirection+90}deg)`
    )
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