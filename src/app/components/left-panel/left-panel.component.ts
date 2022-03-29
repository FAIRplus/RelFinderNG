import { AutoCompleteService } from './../../services/autocomplete.service';
import { ConstantsService } from './../../services/util/constants.service';
import { Subscription } from 'rxjs';
import { ConfigurationsService } from 'src/app/services/configurations/configurations.service';
import { ShareUrlComponent } from './share-url/share-url.component';
import { MatDialog } from '@angular/material';
import { Component, ViewChildren, QueryList, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { PopoverDirective } from 'ngx-bootstrap/popover';
import { ReleaseInfoComponent } from './release-info/release-info.component';
import { Endpoint } from '../../models/endpoint.model';

@Component({
  selector: '.app-left-panel',
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.css']
})
export class LeftPanelComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChildren(PopoverDirective) popovers: QueryList<PopoverDirective>;

  menu: Map<string, boolean> = new Map<string, boolean>();

  leftMenuPopup: Subscription;
  autoCompleteFormData = [];
  autoCompSub: Subscription;
  disableInfo: boolean = true;
  infoMenuPopup: Subscription;
  configHeaderSub:Subscription;
  activeEndpoint: Endpoint = null;
  dbName: string = '';

  constructor(public dialog: MatDialog, public configurationsService: ConfigurationsService,
    public constantService: ConstantsService, public autocompService: AutoCompleteService) { 
      this.configHeaderSub = this.configurationsService.configPopupHeader.subscribe((data) => {
        if(data == "No Database Available, Add New!"){
          this.dbName = data;
        }
        else {
          this.dbName = 'Selected DataSource : '+data;
        }        
      });
    }

  ngOnInit() {
    this.menu.set('search', true);
    this.menu.set('info', false);
    this.menu.set('link', false);
    this.menu.set('filter', false);
    this.menu.set('config', false);
    this.menu.set('release', false);   

    this.leftMenuPopup = this.configurationsService.toggleLeftMenu.subscribe(val => {
      this.updateToggleValue(val.type, val.visible);
    });

    this.autoCompSub = this.autocompService.getAutoFormData().subscribe((data) => {
      this.autoCompleteFormData = data;
    });
    this.infoMenuPopup = this.configurationsService.disableInfoMenu.subscribe(val => {
      this.disableInfo = val;
    });
    

  }

  // https://stackoverflow.com/questions/48941387/ngx-bootstrap-popover-to-display-only-one-popover-at-a-time?rq=1
  ngAfterViewInit() {
    this.popovers.forEach((popover: PopoverDirective) => {
      popover.onShown.subscribe(() => {
        this.popovers
          .filter(p => p !== popover)
          .forEach(p => p.hide());
      });
    });
  }

  updateToggleValue(type: string, visible: boolean) {
    this.menu.forEach((value, key) => {
      if (key === type) {
        this.menu.set(type, visible);
      } else {
        this.menu.set(key, false);
      }
    });
  }

  onUrlClick() {
    const dialogRef = this.dialog.open(ShareUrlComponent, {
      minHeight: 'calc(20vh)',
      minWidth: 'calc(60vw)',
    });
    dialogRef.afterClosed().subscribe(result => {
      this.updateToggleValue('link', false);
    });
  }

  onReleaseInfoClick() {
    const dialogRef = this.dialog.open(ReleaseInfoComponent, {
    });
    dialogRef.afterClosed().subscribe(result => {
      this.updateToggleValue('release', false);
    });
  }

  // configMenuHover(): string {    
  //   return this.dbName;
  // }

  ngOnDestroy() {
    this.configurationsService.toggleLeftMenu.unsubscribe();
    this.configurationsService.disableInfoMenu.unsubscribe();
    this.configHeaderSub.unsubscribe();
  }
}
