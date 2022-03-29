import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/components/default/confirm-dialog/confirm-dialog.component';
import { AutoCompleteService } from 'src/app/services/autocomplete.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Injectable } from '@angular/core';
import { SPARQLConnectionService } from '../sparql/sparqlconnection.service';
import { SnackbarComponent } from 'src/app/components/default/snackbar/snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class ClearConfirmationDialogService {

  constructor(public dialog: MatDialog, private autoCompleteService: AutoCompleteService,private sparqlConnnectionService:SPARQLConnectionService, private snackBar: MatSnackBar) { }

  openDialog() {
    const message = 'Do you want to proceed and delete all graph record?';
    const dialogData = new ConfirmDialogModel('Clear all data?', message, "./assets/icons/trash.svg");
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "373px",
      height: "197px",
      data: dialogData
    });
    dialogRef.updateSize('373px', '197px');
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.sparqlConnnectionService.emptyNodesObjectSubject.next("");
        this.sparqlConnnectionService.setResetTriggered(true);
        this.autoCompleteService.clearAppData();
        this.autoCompleteService.isOkClicked.next(true);
      }
    });
  }

  public openSnackBar(title: string,message:string, action: string, snackType?: string) {
    const _snackType: string =
      snackType !== undefined ? snackType : 'Success';

    this.snackBar.openFromComponent(SnackbarComponent, {
      duration: 7000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      data: { title:title, message: message, snackType: _snackType }
    });
  }
}
