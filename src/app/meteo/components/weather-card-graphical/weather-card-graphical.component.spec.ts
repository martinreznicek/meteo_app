import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherCardGraphicalComponent } from './weather-card-graphical.component';

describe('WeatherCardGraphicalComponent', () => {
  let component: WeatherCardGraphicalComponent;
  let fixture: ComponentFixture<WeatherCardGraphicalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeatherCardGraphicalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeatherCardGraphicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
