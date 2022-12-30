import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Weather } from './models/weather.model';
import { Config } from 'src/config';

@Injectable({
  providedIn: 'root'
})
export class MeteoService {

  constructor(private http: HttpClient) { }

  public getWeather(coordinates: {lat: number, long: number}): Promise<Weather> {
    const urlWithParams = `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.long}&units=metric&appid=${Config.WEATHER_API_KEY}`;
    return this.http.get<Weather>(urlWithParams).toPromise();
  }

  public getCoordinates(cityName: string): Promise<any> {
    const urlWithParams = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${Config.WEATHER_API_KEY}`;
    return this.http.get<Weather>(urlWithParams).toPromise();
  }

}
