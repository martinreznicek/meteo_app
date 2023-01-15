import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormControl, Validators} from '@angular/forms';
import {ViewStateService} from '../../../services/view-state.service';

@Component({
  selector: 'app-edit-name',
  templateUrl: './edit-name.component.html',
  styleUrls: ['./edit-name.component.css']
})
export class EditNameComponent implements OnInit {

  public name = new FormControl( '', [Validators.required]);

  constructor(
    public viewState: ViewStateService,
    public dialogRef: MatDialogRef<EditNameComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { name: string }
  ) { }

  ngOnInit(): void {
    this.viewState.setDialogDark();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
