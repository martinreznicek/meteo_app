import {Weather} from './weather.model';
import {BaseModel} from './base.model';

export interface WeatherCard extends BaseModel {
  coordinates: {
    lat: number;
    long: number;
  };
  weather: Weather;
  showButtons: boolean;
  showDetails: boolean;
  loading?: boolean;
}

export enum CardLayout {
  Digital= 'DIGITAL',
  Graphical = 'GRAPHICAL'
}
