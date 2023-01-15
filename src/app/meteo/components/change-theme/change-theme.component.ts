import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CardLayout } from '../../models/weather-card.model';

@Component({
  selector: 'app-change-theme',
  templateUrl: './change-theme.component.html',
  styleUrls: ['./change-theme.component.css']
})
export class ChangeThemeComponent implements OnInit {

  cardLayout = CardLayout;
  selected;

  constructor(
    public dialogRef: MatDialogRef<ChangeThemeComponent>,
    // public viewState: ViewStateService;
  ) { }

  ngOnInit(): void {
    // this.selected = viewState.cardLayout;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSelect(layout: CardLayout) {
    this.selected = layout;
    // this.viewState.setLayout(layoutId);
  }

}
