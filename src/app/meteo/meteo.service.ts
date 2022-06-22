import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Weather } from './models/weather.model';
import { Config } from 'src/config';

@Injectable({
  providedIn: 'root'
})
export class MeteoService {

  constructor(private http: HttpClient) { }

  public get(lat: number, long: number): Promise<Weather> {
    const url_par = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&appid=${Config.WEATHER_API_KEY}`
    return this.http.get<Weather>(url_par).toPromise();
  }

}
