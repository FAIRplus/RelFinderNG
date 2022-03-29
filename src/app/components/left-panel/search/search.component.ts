import { ConfigurationsService } from './../../../services/configurations/configurations.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { AutoCompleteService } from 'src/app/services/autocomplete.service';
import { requireMatch } from 'src/app/validations/require-match.validation';
import { SPARQLConnectionService } from 'src/app/services/sparql/sparqlconnection.service';
import { ConstantsService } from 'src/app/services/util/constants.service';
import { SparqlPropertyService } from 'src/app/services/sparql/sparql-property.service';
import { ConfirmDialogModel, ConfirmDialogComponent } from '../../default/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material';
import { ClearConfirmationDialogService } from 'src/app/services/dialogs/clear-confirmation-dialog.service'
import { Utils } from 'src/app/services/util/common.utils';
import { ISlimScrollOptions } from 'ngx-slimscroll';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  searchForm: FormGroup;
  search: FormGroup;
  items: FormArray;
  sources = [];
  localSearchHistory = [];
  historyLimit: number = 5;
  SEARCH_HISTORY: string = 'searchHistory';
  dummyOptions: number[] = Array(5).fill(1);
  invalidCntls: number = 0;
  tabIndexArrayObj = [];
  opts: ISlimScrollOptions;

  constructor(private formBuilder: FormBuilder,
    public autoCompleteService: AutoCompleteService,
    private sparqlConnService: SPARQLConnectionService,
    private constantService: ConstantsService,
    private configService: ConfigurationsService,
    private sparqlPropService: SparqlPropertyService,
    public dialog: MatDialog, private clearConfirmationDialogService: ClearConfirmationDialogService) { }


  ngOnInit() {
    this.opts = {
      alwaysVisible: false,
      alwaysPreventDefaultScroll: true
    };
    this.tabIndexArrayObj=[];
    if (this.autoCompleteService.getAutoCompFormData().length > 0) {
      this.configService.isOverrideSearch = true;
      let arrOfItems = [];
      for (let data of this.autoCompleteService.getAutoCompFormData()) {
        arrOfItems.push(this.createItem(data));
      }
      this.searchForm = this.formBuilder.group({
        items: new FormArray(arrOfItems)
      });
      this.items = this.formControls.items as FormArray;
    } else {
      this.searchForm = this.formBuilder.group({
        items: this.formBuilder.array([this.createItem(''), this.createItem('')])
      });
      this.items = this.formControls.items as FormArray;
    }
    this.triggerChange();
    this.localSearchHistory = this.getSearchHistory();
  }

  get formControls() {
    return this.searchForm.controls;
  }

  createItem(value: any): FormGroup {
    if (!value) { value = ''; }

    return this.formBuilder.group({
      'searchKeyword': [value, [Validators.required, requireMatch]]
    });
  }

  triggerChange() {
    let idx = 0;
    this.items.controls.forEach((control: FormGroup) => {
      this.autoCompleteService.getAutoCompleteData(control.controls.searchKeyword, idx);
      idx++;
    });
  }

  addItem(): void {
    this.items.push(this.createItem(''));
    for(let i=0;i<this.items.length;i++){
      this.tabIndexArrayObj.push(i); 
    }
    this.tabIndexArrayObj=Array.from(new Set(this.tabIndexArrayObj)).sort((a, b) => a - b);
    this.triggerChange();
    setTimeout(()=>{
      if(document.getElementById("txt_"+this.tabIndexArrayObj.slice(-1)[0]) != null)
      document.getElementById("txt_"+this.tabIndexArrayObj.slice(-1)[0]).focus({preventScroll:false});
    },500);
  }

  

  removeItem(idx: number) {
    if (this.items.length > 2) {
      this.items.removeAt(idx);
      this.tabIndexArrayObj.splice(this.tabIndexArrayObj.indexOf(idx), 1);
      document.getElementById("txt_"+this.tabIndexArrayObj.slice(-1)[0]).focus({preventScroll:false});
      this.triggerChange();
      this.findInvalidControls();
    }
  }

  onSubmit() {
    if (this.configService.isOverrideSearch) {
      this.overrideSearchConfirmation();
    } else {
      this.submitFormPrep();
    }
    this.saveSearchHistory();
  }

  submitFormPrep() {
    this.autoCompleteService.clearAutoCompFormArr();
    this.items.controls.forEach((control: FormGroup) => {
      let keywordVal = control.controls.searchKeyword.value;
      this.autoCompleteService.pushDataToAutoCompFormArr(keywordVal);
      this.sources.push(keywordVal.sub.value);
    });
    this.sparqlConnService.emptyNodesObjectSubject.next('');
    this.sparqlConnService.graphLoadStatus.next(this.constantService.LOADING);
    this.sparqlConnService.findRelation(this.sources);
    this.configService.toggleLeftMenu.next({ type: 'search', visible: false });
    this.sparqlPropService.clearMessages();
    this.sparqlPropService.setLanguageSelected('English');
    this.configService.disableInfoMenu.next(true);
    this.sparqlConnService.clearMessages();
    Utils.isSeletedSourcesLoading = false;
  }

  reset() {
    if (this.configService.isOverrideSearch) {
      this.clearConfirmationDialogService.openDialog();
      if (this.autoCompleteService.isOkClicked) {
        this.autoCompleteService.isOkClicked.subscribe(val => {
          if (val == true)
            this.initEmptyForm();
        });
      }
    }
    else {
      this.searchForm.reset()
      this.initEmptyForm();
    }
  }

  initEmptyForm() {
    this.searchForm = this.formBuilder.group({
      items: this.formBuilder.array([this.createItem(''), this.createItem('')])
    });
    this.items = this.formControls.items as FormArray;
    this.triggerChange();
  }

  focusFunc(event, idx) {
    this.autoCompleteService.searchResult = [];
    if (!event.target.value && this.autoCompleteService.isLoading == false) {
      this.autoCompleteService.searchResult = this.localSearchHistory;
      this.autoCompleteService.currentIndex = idx;
    }
    this.findInvalidControls();
  }

  onFocusout(idx) {
    // this.autoCompleteService.searchResult = [];
    this.autoCompleteService.isLoading = false;
    this.autoCompleteService.cancelAutoCompleteData(idx);
    this.findInvalidControls();
  }

  overrideSearchConfirmation() {
    const message = "Do you want to proceed and delete all graph record, while making new search?";
    const dialogData = new ConfirmDialogModel("Clear all data?", message, "./assets/icons/trash.svg");
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "373px",
      height: "197px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.autoCompleteService.clearDataOnSearchOverride();
        this.submitFormPrep();
      } else {
        this.configService.toggleLeftMenu.next({ type: 'search', visible: false });
      }
    });
  }

  getSearchHistory() {
    let history = localStorage.getItem(this.SEARCH_HISTORY);
    if (history)
      return JSON.parse(history);
    else
      return [];
  }

  saveSearchHistory() {
    this.items.controls.forEach((control: FormGroup) => {
      let keywordVal = control.controls.searchKeyword.value;
      if (this.localSearchHistory.length == 0) {
        this.localSearchHistory.push(keywordVal);
      } else {
        this.localSearchHistory.unshift(keywordVal);
      }
    });
    this.localSearchHistory = this.autoCompleteService.removeDuplicacy(this.localSearchHistory);
    this.localSearchHistory = this.localSearchHistory.slice(0, this.historyLimit);
    localStorage.setItem(this.SEARCH_HISTORY, JSON.stringify(this.localSearchHistory));
  }

  onChage() {
    this.findInvalidControls();
  }

  findInvalidControls() {
    this.invalidCntls = 0;
    this.items.controls.forEach((control: FormGroup) => {
      let txt = control.controls.searchKeyword.value;
      if (txt && txt.length > 0 && control.touched && control.invalid) {
        this.invalidCntls++;
      }
    });
  }
}