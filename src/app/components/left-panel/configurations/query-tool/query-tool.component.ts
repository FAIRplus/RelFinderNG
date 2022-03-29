import { QueryToolService } from '../../../../services/query-tool/query-tool.service';
import { ConfigurationsService } from './../../../../services/configurations/configurations.service';
import { MatDialogRef } from '@angular/material';
import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { Endpoint } from 'src/app/models/endpoint.model';
import { MAT_DIALOG_DATA } from '@angular/material'
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-query-tool',
  templateUrl: './query-tool.component.html',
  styleUrls: ['./query-tool.component.css']
})
export class QueryToolComponent implements OnInit {

  endpointList: Endpoint[];
  query: string = '';
  response: any = '';
  selectedEndpoint: Endpoint;
  hasError: boolean = false;
  passedEndpt: any = '';

  constructor(public dialogRef: MatDialogRef<QueryToolComponent>, public configService: ConfigurationsService, public queryToolService: QueryToolService, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.passedEndpt = data.endpoint;
  }

  ngOnInit() {
    this.dialogRef.updateSize('736px', '453px');
    this.passedEndpt = this.configService.getActiveEndpoint();
    this.selectedEndpoint = this.passedEndpt
    this.endpointList = this.configService.getAllEndpoints();
  }

  public closeDialog() {
    this.dialogRef.close();
  }

  onExecute() {
    if (this.query && this.query.trim().length > 0 && this.selectedEndpoint) {
      this.query = this.query.replace('<br>', '');
      this.queryToolService.executeQuery(this.query.trim(), this.selectedEndpoint).subscribe(resp => {
        this.hasError = false;
        this.response = '';
        this.response = JSON.stringify(resp.results);
      },
        error => {
          this.response = '';
          this.response = JSON.stringify(this.handleError(error));
          this.hasError = true;
        });
    } else {
      this.hasError = true;
    }
  }

  private handleError(err: HttpErrorResponse) {
    return {
      statusCode: err.status,
      statusText: err.statusText,
      message: err.error
    };
  }

  onInput(event) {
    this.query = event.target.textContent;
  }

  onPaste(event) {
    event.preventDefault();
    event.stopPropagation();
    var plaintext = event.clipboardData.getData('text/plain');
    document.execCommand('inserttext', false, plaintext);
  }

  // disable drag and drop
  @HostListener("drop", ["$event"]) onDrop(event: any) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  }
}
