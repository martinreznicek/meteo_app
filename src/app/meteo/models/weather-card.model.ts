import {Weather} from './weather.model';

export interface WeatherCard {
  id: number;
  coordinates: {
    lat: number;
    long: number;
  };
  name: string;
  weather: Weather;
  showButtons: boolean;
  showDetails: boolean;
  loading?: boolean;
}
