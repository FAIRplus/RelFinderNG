import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ConfigurationsService } from 'src/app/services/configurations/configurations.service';
import { ConfigModel } from 'src/app/models/config.model';
import { ClearConfirmationDialogService } from 'src/app/services/dialogs/clear-confirmation-dialog.service';

@Component({
  selector: 'app-proxy-dialog',
  templateUrl: './proxy-dialog.component.html',
  styleUrls: ['./proxy-dialog.component.css']
})
export class ProxyDialogComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  reg = /^((http|https?):\/\/)?([w|W]{3}\.)+[a-zA-Z0-9\-\.]{3,}\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/;

  constructor(public dialogRef: MatDialogRef<ProxyDialogComponent>, public fb: FormBuilder, public configService: ConfigurationsService, public dialogService: ClearConfirmationDialogService) {

  }

  ngOnInit() {
    this.setDialogSize();
    let url = this.getProxyUrlFormConfig();
    this.form = this.fb.group({
      url: [url, [Validators.required, Validators.pattern(this.reg)]]
    })
  }

  getProxyUrlFormConfig(): string {
    let data = this.configService.getConfigData().proxy
    if (data && data.url) {
      return this.configService.getConfigData().proxy.url;
    }
    return '';
  }

  setDialogSize() {
    // To set size of the dialog.
    this.dialogRef.updateSize('625px', '180px');
  }

  closeDialog() {
    this.dialogRef.close();
  }

  saveProxyURL() {
    if (this.form.valid && this.form.controls.url.value) {
      this.setProxyUrlFormConfig(this.form.controls.url.value);
    }
  }

  setProxyUrlFormConfig(url: string) {
    let data: ConfigModel = this.configService.getConfigData();
    if (data) {
      data.proxy.url = url;
      this.configService.setUriConfigData(data);
      this.dialogService.openSnackBar('URL Updated ', 'Successfully', 'Close', '');
    }
  }

  get f() {
    return this.form.controls;
  }

}
