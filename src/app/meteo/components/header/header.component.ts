import { Component, OnInit } from '@angular/core';
import {ViewStateService} from '../../services/view-state.service';
import {ChangeThemeComponent} from '../dialogs/change-theme/change-theme.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    public viewState: ViewStateService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  public openLayoutDialog() {
    this.dialog.open(ChangeThemeComponent);
  }

}
