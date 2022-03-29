import { AutoCompleteService } from 'src/app/services/autocomplete.service';
import { SPARQLConnectionService } from '../../../services/sparql/sparqlconnection.service';
import { Endpoint } from '../../../models/endpoint.model';
import { ConfigurationsService } from '../../../services/configurations/configurations.service';
import { MatDialogRef } from '@angular/material';
import { Component, OnInit } from '@angular/core';

declare var window: any;

@Component({
  selector: 'app-url',
  templateUrl: './share-url.component.html',
  styleUrls: ['./share-url.component.css']
})
export class ShareUrlComponent implements OnInit {
  endpointName: string = '';
  endpointUrl: string = '';
  activeEndpoint: Endpoint = null;
  isCopied: boolean = false;
  formData: string = '';


  constructor(public dialogRef: MatDialogRef<ShareUrlComponent>, public configService: ConfigurationsService, public sparqlConnectionService: SPARQLConnectionService, private autoCompleteService: AutoCompleteService) { }

  ngOnInit() {
    this.dialogRef.updateSize('625px', '230px');

    this.activeEndpoint = this.configService.getActiveEndpoint();
    this.endpointName = this.activeEndpoint.name;
    this.endpointUrl = this.sparqlConnectionService.getUrl(this.activeEndpoint);

    const parsedUrl = new URL(window.location.href);
    this.formData = parsedUrl.origin;
    this.formData = this.formData + this.prepareQueryParam();
  }

  prepareQueryParam() {
    let queryStr = '?';
    if (this.autoCompleteService && this.autoCompleteService.getAutoCompFormData()) {
      queryStr = queryStr + 'objects=' + btoa(JSON.stringify(this.autoCompleteService.getAutoCompFormData())) + '&';
    }
    if (this.activeEndpoint) {
      queryStr = queryStr + 'endpoint=' + btoa(JSON.stringify(this.activeEndpoint));
    }
    return queryStr;
  }

  public closeDialog() {
    this.dialogRef.close();
  }

  copyToClipboard(): void {
    let listener = (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', (this.formData));
      e.preventDefault();
    };

    document.addEventListener('copy', listener);
    document.execCommand('copy');
    document.removeEventListener('copy', listener);
    this.isCopied = true;
  }
}
