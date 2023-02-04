import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ViewStateService} from '../../services/view-state.service';
import {AddCardComponent} from '../dialogs/add-card/add-card.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-new-card',
  templateUrl: './new-card.component.html',
  styleUrls: ['./new-card.component.css']
})
export class NewCardComponent implements OnInit {
  @Input() numberOfCards: number;
  @Output() addLocation = new EventEmitter();

  constructor(
    public viewState: ViewStateService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  public async addCard() {
    const dialogRef = this.dialog.open(AddCardComponent, {
      width: '30%',
      data: {city: '', coordinates: {}}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.addLocation.emit(result);
    });
  }

}
