import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Endpoint } from 'src/app/models/endpoint.model';
import { ConfigurationsService } from 'src/app/services/configurations/configurations.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { ClearConfirmationDialogService } from 'src/app/services/dialogs/clear-confirmation-dialog.service';

@Component({
  selector: 'app-config-form',
  templateUrl: './config-form.component.html',
  styleUrls: ['./config-form.component.css']
})
export class ConfigFormComponent implements OnInit {

  sourceForm: FormGroup;
  submitted = false;
  sourceData: Endpoint;
  autocompleteUris = [];
  ignoredProperties = [];
  abstractUris = [];
  imageUris = [];
  linkUris = [];
  
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  editMode = true;
  DB_name: string;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  queryTypes: any[] = [
    { key: 'Standard', value: 'STD' },
    { key: 'Complete', value: 'CMP' },
    { key: 'Virtuoso', value: 'VIR' },
  ];
  httpMethods: any[] = [
    { key: 'GET', value: 'GET' },
    { key: 'POST', value: 'POST' },
  ];
  
  addAutoUri(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if((value || '').trim()) {
      this.autocompleteUris.push(value.trim());
    }
    if(input){
      input.value = '';
    }
  }

  removeAutoUri(autouri : string): void {
    const index = this.autocompleteUris.indexOf(autouri);

    if(index >= 0){
      this.autocompleteUris.splice(index,1);
    }
  }

  addProp(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if((value || '').trim()) {
      this.ignoredProperties.push(value.trim());
    }
    if(input){
      input.value = '';
    }
  }

  removeProp(prop : string): void {
    const index = this.ignoredProperties.indexOf(prop);
    
    if(index >= 0){
      this.ignoredProperties.splice(index,1);
    }
  }

  addAbsURI(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if((value || '').trim()) {
      this.abstractUris.push(value.trim());
    }
    if(input){
      input.value = '';
    }
  }

  removeAbsURI(absuri : string): void {
    const index = this.abstractUris.indexOf(absuri);

    if(index >= 0){
      this.abstractUris.splice(index, 1);
    }
  }

  addImguri(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if((value || '').trim()) {
      this.imageUris.push(value.trim());
    }
    if(input) {
      input.value = '';
    }
  }

  removeImguri(imguri : string): void {
    const index = this.imageUris.indexOf(imguri);

    if( index >= 0){
      this.imageUris.splice(index, 1);
    }
  }

  addLinkuri(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if((value || '').trim()) {
      this.linkUris.push(value.trim());
    }
    if(input){
      input.value ='';
    }
  }

  removeLinkuri(linkuri : string): void {
    const index = this.linkUris.indexOf(linkuri);

    if( index >= 0) {
      this.linkUris.splice(index, 1);
    }
  }

  constructor(
    public dialogRef:  MatDialogRef<ConfigFormComponent>, 
    @Inject(MAT_DIALOG_DATA) public  data:  any, 
    private formBuilder: FormBuilder,
    private configService: ConfigurationsService,
    public dialog: MatDialog,
    public dialogService: ClearConfirmationDialogService) {
  }

  ngOnInit() {
    this.setDialogSize();    
    this.sourceData = this.data.data;
    // To initialize URIs list.
    this.init();
    // regex for urls.
   // const reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';      

    this.sourceForm = this.formBuilder.group({
      id: [{value: this.sourceData.id, disabled: this.isEditMode(this.sourceData.id)} , Validators.required],
      name: [this.sourceData.name , Validators.required],
      description: [this.sourceData.description ],
      endpointURI: [this.sourceData.endpointURI , Validators.required],
      dontAppendSparql: [this.sourceData.dontAppendSparql],
      defaultGraphURI: [this.sourceData.defaultGraphURI],//, Validators.pattern(reg)
      isVirtuoso: [this.sourceData.isVirtuoso],
      useProxy: [this.sourceData.useProxy],
      method:[this.sourceData.method],
      maxRelationLength: [this.sourceData.maxRelationLength , [Validators.max(10), Validators.min(0)]],
      autocompleteLanguage: [this.sourceData.autocompleteLanguage],
      active: [this.sourceData.active],
      queryType: [this.sourceData.queryType]
    });
  }

  init() {
    this.autocompleteUris = this.sourceData.autocompleteURIs ? this.sourceData.autocompleteURIs.filter(item => item) : [];
    this.ignoredProperties = this.sourceData.ignoredProperties ? this.sourceData.ignoredProperties.filter(item => item) : [];
    this.abstractUris = this.sourceData.abstractURIs ? this.sourceData.abstractURIs.filter(item => item) : [];
    this.imageUris = this.sourceData.imageURIs ? this.sourceData.imageURIs.filter(item => item) : [];
    this.linkUris = this.sourceData.linkURIs ? this.sourceData.linkURIs.filter(item => item) : [];
  }
  
  setDialogSize() {
    // To set size of the dialog.
    this.dialogRef.updateSize('70%', '85%');
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.sourceForm.controls; 
  }

  isEditMode(id: string): boolean {
    if(id) {
      this.editMode = true;
      this.DB_name = this.sourceData.name;
      return true;
    }
    else {
      this.editMode = false;
      return false;
    }
  }

  checkDuplicate(idVal: string) {
    let result = this.configService.isEndpointExisted(idVal);
    if(result) {
      this.f.id.setErrors({'duplicate': true});
    } else {
      this.f.id.setErrors(null);
    }
    return;
  }
  onDismiss() {
    this.dialogRef.close();
  }
  onSubmit() {
      this.submitted = true;  
       // stop here if form is invalid    
      if (this.sourceForm.invalid) {
          return;
      }      
      this.configService.updateEndpointsList(this.setUrisInFormData());
      let activeEP = this.configService.getActiveEndpoint();
      let formData = this.sourceForm.value;
      if(activeEP && activeEP.id == this.sourceData.id) {
        if(formData) {
          this.configService.configPopupHeader.next(formData.name);
        }
      } else if(activeEP == undefined) {
        this.configService.configPopupHeader.next(formData.name);
      }
      //this.configService.updateEndpointsListByIndex(formData, 1);
      this.dialogService.openSnackBar((this
        .editMode ? '' : 'New ') +  this.setUrisInFormData().name, (this.editMode ? ' Edited ' : ' Created ')+'Successfully','Close' , '');
      this.closeMe();
  }  

  public closeMe() {
    this.dialogRef.close();
  }

  setUrisInFormData() {
    // Get values from form.
    let formData = this.sourceForm.value;
    // Set from source if edit mode.
    if(this.sourceData.id) {
      formData.id = this.sourceData.id;
    } 

    formData.autocompleteURIs = this.autocompleteUris;
    formData.ignoredProperties = this.ignoredProperties;
    formData.abstractURIs = this.abstractUris;
    formData.imageURIs = this.imageUris;
    formData.linkURIs = this.linkUris;

    return formData;
  }
}