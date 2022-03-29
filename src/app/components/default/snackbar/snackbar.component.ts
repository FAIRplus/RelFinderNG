import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar, MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.css']
})
export class SnackbarComponent implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any, private matSnackBar: MatSnackBarRef<SnackbarComponent>) { }

  ngOnInit() {
  }

  dismissSnackBar() {
    this.matSnackBar.dismiss();
  }

}
