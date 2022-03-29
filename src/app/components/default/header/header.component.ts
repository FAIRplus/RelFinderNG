import { ClearConfirmationDialogService } from './../../../services/dialogs/clear-confirmation-dialog.service';
import { Component, OnDestroy, OnInit, ViewEncapsulation, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import { AutoCompleteService } from 'src/app/services/autocomplete.service';
import { SPARQLConnectionService } from 'src/app/services/sparql/sparqlconnection.service';
import { ConstantsService } from 'src/app/services/util/constants.service';
import { MatTooltip } from '@angular/material/tooltip';
import { Utils } from 'src/app/services/util/common.utils';

@Component({
  selector: '.app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  autoCompleteFormData = [];
  autoCompSub: Subscription;
  graphLoadStatusSub: Subscription;
  visStatus: string = this.constantService.IDLE;  
  searchInputs = [];
  searchVal: string = '';
  valx = MatTooltip;
  screenWidth: any;

  constructor(public autocompService: AutoCompleteService,
    private sparqlConnectionService: SPARQLConnectionService,
    public constantService: ConstantsService, public clearConfirmationDialogService: ClearConfirmationDialogService) { }

  ngOnInit() {
    this.autoCompSub = this.autocompService.getAutoFormData().subscribe((data) => {
      this.autoCompleteFormData = data;
      this.onLoad();
      this.onHover();
    });    
    this.graphLoadStatusSub = this.sparqlConnectionService.graphLoadStatus.subscribe(status => {
      this.visStatus = status;

    });    
    this.getScreenSize();
  }

  ngOnDestroy(): void {
    this.autoCompSub.unsubscribe();
    this.graphLoadStatusSub.unsubscribe();
  }
  
  onLoad() {
    var temp = '';
    for (let index = 0; index < this.autoCompleteFormData.length; index++) {
      temp = temp + this.autoCompleteFormData[index].middle.value + ' Vs ';
    }
    temp = temp.substr(0,temp.length-3);
    temp = Utils.truncateString(temp, (this.screenWidth), 'end-space');
    this.searchVal = temp;
    this.searchInputs = temp.split(' Vs ', temp.length);
  }
  
  onHover() {
    var temp = '';
    for (let index = 0; index < this.autoCompleteFormData.length; index++) {
      temp = temp + this.autoCompleteFormData[index].middle.value + ' vs ';
    }
    temp = temp.substr(0,temp.length-3);
    if(temp.length>(this.screenWidth)){
      this.searchVal = temp;
    }
    else {
      this.searchVal = '';
    }
  }

  onDismiss() {
    this.clearConfirmationDialogService.openDialog();
  }

  onSkipLoad() {
    this.sparqlConnectionService.intervalSubject.next(1);
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: undefined) {
    this.screenWidth = window.innerWidth;
    this.screenWidth = Math.floor(this.screenWidth/18*2) - 50;
    this.onLoad();
    this.onHover();
  }
}