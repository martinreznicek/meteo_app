import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Weather } from './models/weather.model';

@Injectable({
  providedIn: 'root'
})
export class MeteoService {

  url: string = "https://api.openweathermap.org/data/2.5/weather?lat=50&lon=15&units=metric&appid=00d9d739498773f73494ec506717581c"

  constructor(private http: HttpClient) { }

  public get(lat: number, long: number): Promise<Weather> {
    const url_par = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&appid=00d9d739498773f73494ec506717581c`
    return this.http.get<Weather>(url_par).toPromise();
  }

}
