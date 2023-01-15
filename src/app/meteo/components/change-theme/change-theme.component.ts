import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CardLayout } from '../../models/weather-card.model';
import {ViewStateService} from '../../services/view-state.service';

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
    public viewState: ViewStateService
  ) { }

  ngOnInit(): void {
    this.selected = this.viewState.cardTemplate;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSelect(layout: CardLayout) {
    this.selected = layout;
  }

  onConfirm() {
    this.viewState.changeCardTemplate(this.selected);
    this.viewState.rerender$.next();
    this.dialogRef.close();
  }

}
