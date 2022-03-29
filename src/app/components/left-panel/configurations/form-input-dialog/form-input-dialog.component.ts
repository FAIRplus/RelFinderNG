import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-form-input-dialog',
  templateUrl: './form-input-dialog.component.html',
  styleUrls: ['./form-input-dialog.component.css']
})
export class FormInputDialogComponent implements OnInit {

    title: string;
    addForm: FormGroup;
    inputValue: string = '';
    submitted = false;
  
    constructor(public dialogRef: MatDialogRef<FormInputDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: FormInputDialogComponent, private formBuilder: FormBuilder) {
      // Update view with given values
      this.title = data.title;
    }
  
    ngOnInit() {
      //const reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*#/?';

      this.addForm = this.formBuilder.group({
        uri: ['' , [Validators.required]] //, Validators.pattern(reg)
      });
    }

    get f() {
      return this.addForm.controls; 
    }
  
    onSubmit(): void {
      this.submitted = true;
      // stop here if form is invalid
      if (this.addForm.invalid) {
        return;
      }
      this.dialogRef.close(this.addForm.controls.uri.value);
    }
  
    onDismiss(): void {
      // Close the dialog, return false
      this.dialogRef.close(false);
    }
  }
  
  export class FormInputDialogModel {
  
    constructor(public title: string) {
    }
  }
