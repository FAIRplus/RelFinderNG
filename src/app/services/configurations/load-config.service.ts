import { Injectable } from '@angular/core';
import { ConfigModel } from 'src/app/models/config.model';
import { Endpoint } from 'src/app/models/endpoint.model';
import { Utils } from 'src/app/services/util/common.utils';

@Injectable({ providedIn: 'root' })
export class LoadConfigService {

  errorMsg: ErrorMessage;

  constructor() {
    this.errorMsg = new ErrorMessage('', '', []);
  }

  validateFileProps(file: File): ErrorMessage {
    let fileType = file.type.search("json");// Check the file type.
    let fileSize = Math.round(file.size / 1024);// Calculate the size of file in kb.
    if (fileType < 0) {
      this.setErrorMessages('Invalid File Format!', ' Please Check the File Format & Try Again!');
    } else if (fileSize > 1024) { // 1024 kb
      this.setErrorMessages('Error!', ' File size should not be more than 1 MB.');
    }
    return this.errorMsg;
  }

  // To validate file.
  validateFile(fileContent: any): ErrorMessage {
    try {
      let fileData = JSON.parse(fileContent) as ConfigModel;

      if (!fileData.endpoints) {
        this.setErrorMessages('', 'Atleast one Endpoint Property Must be active & named true.');
      } else if (fileData.endpoints.length < 1) {
        this.setErrorMessages('', 'Atleast one Endpoint Property Must hold Value. It must be Either True/False.');
      }

      let activeEndpointCount = 0;
      for (let i = 0; i < fileData.endpoints.length; i++) {
        let data = fileData.endpoints[i];
        // Check required attribute fields starts from here

        if ((data.id === undefined || data.id === null) && (data.name === undefined || data.name === null)) {
          this.errorMsg.messageList = [];
          this.setErrorMessages('Error Exist!', ' Please Check file & re-upload.');
          break;
        }

        if (data.id === undefined || data.id === null) {
          this.setErrorMessages('No ID Found!', ' End Point ' + this.shrinkText(data) + ' has No ID attribute.');
        }
        if (data.name === undefined || data.name === null) {
          this.setErrorMessages('No Name attribute Found!', ' End Point ' + this.shrinkText(data) + ' has No Name attribute.');
        }
        if (data.endpointURI === undefined || data.endpointURI === null) {
          this.setErrorMessages('No EndPoint URI Found!', ' End Point ' + this.shrinkText(data) + ' has No Endpoint URI Attribute.');
        }
        // Check required attribute fields end here

        this.errorMsg = this.validateBooleanProp(data);
        this.errorMsg = this.validateStringProp(data);
        this.errorMsg = this.validateMaxRelation(data);


        if (data.active) {
          activeEndpointCount++;
          if (activeEndpointCount > 1) {
            this.setErrorMessages('Multiple Active Endpoints Identified!', ' File should have only one Active Endpoint.');
          }
        }
        if (this.checkDuplicateById(fileData.endpoints, data.id)) {
          this.errorMsg = new ErrorMessage('', '', []);
          this.setErrorMessages('Duplicate ID Found!', ' File must contain Unique IDs.');
          break;
        }
      }

      if (this.errorMsg && this.errorMsg.messageList.length > 0) {
        return this.errorMsg;
      }
      if (activeEndpointCount === 0) {
        this.setErrorMessages('No Endpoints Identified!', ' File should have atleast one Active Endpoint.');
      }
    } catch (error) {
      this.errorMsg.type = 'error';
      this.setErrorMessages('Error Exist!', ' Please check the File and Re-Upload it.');
      return this.errorMsg;
    }
    return this.errorMsg;
  }

  checkDuplicateById(endpointsArr: Endpoint[], propValue: string): boolean {
    let count = 0;
    endpointsArr.forEach(endpoint => {
      if (endpoint.id === propValue) {
        count++;
      }
    });
    return (count > 1 ? true : false);
  }

  // To validate boolean type of attributes.
  validateBooleanProp(endpoint: Endpoint): ErrorMessage {
    if (endpoint.active && typeof endpoint.active !== "boolean") {
      this.setErrorMessages('Invalid "active" Property!', ' Attribute Of End Point ' + this.shrinkText(endpoint) + ' must be either true or false.');
    } else if (endpoint.dontAppendSparql && typeof endpoint.dontAppendSparql !== "boolean") {
      this.setErrorMessages('Invalid "dontAppendSparql" Property!', ' Attribute Of End Point ' + this.shrinkText(endpoint) + ' must be either true or false.');
    // } else if (endpoint.isVirtuoso && typeof endpoint.isVirtuoso !== "boolean") {
    //   this.setErrorMessages('Invalid "isVirtuoso" Property!', ' Attribute Of End Point ' + this.shrinkText(endpoint) + ' must be either true or false.');
    } else if (endpoint.useProxy && typeof endpoint.useProxy !== "boolean") {
      this.setErrorMessages('Invalid "useProxy" Property!', ' Attribute Of End Point ' + this.shrinkText(endpoint) + ' must be either true or false.');
    }
    return this.errorMsg;
  }

  // To validate string type of attributes.
  validateStringProp(endpoint: Endpoint): ErrorMessage {
    if (endpoint.name && typeof endpoint.name !== "string") {
      this.setErrorMessages('Invalid Name Format!', ' Name in Endpoint ' + this.shrinkText(endpoint) + ' must be enclosed within "Double Quotes".');
    }
    if (endpoint.id && typeof endpoint.id !== "string") {
      this.setErrorMessages('Invalid ID Format!', ' Endpoint ' + this.shrinkText(endpoint) + ' must be enclosed within "Double Quotes".');
    }
    if (endpoint.description && typeof endpoint.description !== "string") {
      this.setErrorMessages('Invalid Description!', ' Description in Endpoint ' + this.shrinkText(endpoint) + ' must be enclosed within "Double Quotes".');
    }
    if (endpoint.endpointURI && typeof endpoint.endpointURI !== "string") {
      this.setErrorMessages('Invalid Endpoint URI!', ' EndpointURI in Endpoint ' + this.shrinkText(endpoint) + ' must be enclosed within "Double Quotes".');
    }
    if (endpoint.method && typeof endpoint.method !== "string") {
      this.setErrorMessages('Invalid Method!', ' Method in Endpoint ' + this.shrinkText(endpoint) + ' must be enclosed within  "Double Quotes".');
    }
    if (endpoint.autocompleteLanguage && typeof endpoint.autocompleteLanguage !== "string") {
      this.setErrorMessages('Invalid autocompleteURI!', ' AutocompleteURI in Endpoint ' + this.shrinkText(endpoint) + ' must be enclosed within "Double Quotes".');
    }
    return this.errorMsg;
  }

  validateMaxRelation(endpoint: Endpoint): ErrorMessage {
    let maxRel = Number(endpoint.maxRelationLength);
    if (isNaN(maxRel)) {
      this.setErrorMessages('Error!', ' Value of maxRelationLength must be a Numeric.');
    }
    if (maxRel < 0 || maxRel > 10) {
      this.setErrorMessages('Error!', ' Value of maxRelationLength must be within 0 to 10.');
    }
    return this.errorMsg;
  }

  shrinkText(data: Endpoint): string {
    let txt: string = '';
    let val: string = '';
    if (data) {
      if (data.id) {
        val = 'with ID: ';
        txt = data.id;
      }
      else if (data.name) {
        val = 'named ';
        txt = data.name;
      }
      if (txt && txt.length > 15) {
        txt = Utils.truncateString(txt, 10, 'middle');
      }
      val = val + txt;
    }
    return val;
  }

  setErrorMessages(primaryMsg: string, infoMsg: string) {
    this.errorMsg.type = 'error';
    if (!this.errorMsg) {
      this.errorMsg = new ErrorMessage('', '', []);
    }
    this.errorMsg.messageList.push({ message: primaryMsg + infoMsg });
  }

}

export class ErrorMessage {

  constructor(public type: string, public message?: string, public messageList?: { message: string }[]) {
  }
}