import { ClearConfirmationDialogService } from 'src/app/services/dialogs/clear-confirmation-dialog.service';
import { QueryToolComponent } from './query-tool/query-tool.component';
import { LeftPanelComponent } from './../left-panel.component';
import { Component, OnInit, AfterViewInit, OnDestroy, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatTooltip } from '@angular/material';
import { ConfigFormComponent } from './config-form/config-form.component';
import { Endpoint } from 'src/app/models/endpoint.model';
import { ConfigurationsService } from 'src/app/services/configurations/configurations.service';
import { ConfirmDialogModel, ConfirmDialogComponent } from '../../default/confirm-dialog/confirm-dialog.component';
import { saveAs } from 'file-saver';
import { LoadConfigComponent } from './load-config/load-config.component';
import { ISlimScrollOptions, SlimScrollEvent } from 'ngx-slimscroll';
import { Subscription } from 'rxjs';
import { ProxyDialogComponent } from './proxy-dialog/proxy-dialog.component';

@Component({
  selector: 'app-configurations',
  templateUrl: './configurations.component.html',
  styleUrls: ['./configurations.component.css'],
})
export class ConfigurationsComponent implements OnInit, OnDestroy {

  endpoints: Endpoint[] = [];
  isSubmitted = false;
  settingForm: FormGroup;
  activeEndpoint: Endpoint;
  isDataAvailable = false;
  opts: ISlimScrollOptions;
  configHeaderSub: Subscription;
  configHeader: string = '';
  scrollEvents: EventEmitter<SlimScrollEvent>;

  @ViewChild('tooltip', { static: false }) tooltip: any;

  constructor(private formBuilder: FormBuilder, public dialog: MatDialog,
    public configService: ConfigurationsService, public leftPanel: LeftPanelComponent, private dialogService: ClearConfirmationDialogService) {
      
    this.configHeaderSub = this.configService.configPopupHeader.subscribe((data) => {
      this.configHeader = data;      
    });
  }

  ngOnInit() {
    this.opts = {
      alwaysVisible: true,
      alwaysPreventDefaultScroll: true
    };
    this.endpoints = this.configService.getAllEndpoints();
    if (this.endpoints && this.endpoints.length > 0) {
      this.isDataAvailable = true;
      // Activate endpoint if only one endpoint left.
      this.activateEndpoint(this.endpoints);
      this.activeEndpoint = this.configService.getActiveEndpoint();

      this.settingForm = this.formBuilder.group({
        source: [this.activeEndpoint.id, [Validators.required]]
      })
    }
    this.scrollEvents = new EventEmitter<SlimScrollEvent>();
    this.sortingElementsBasedonActiveEndpoint(false);
  }

  get selectedEndpoint(): string {
    return this.activeEndpoint.name;

  }

  get formControl() {
    return this.settingForm.controls;
  }

  openEditDialog(data: Endpoint) {
    this.dialog.open(ConfigFormComponent, {
      data: {
        data: data
      }
    });
  }

  createDialog() {
    let endpoint = new Endpoint(false, '', '', '', '', false, '', false, false, 'POST', 2, [''], 'en', [''], [''], [''], [''], 'STD');

    this.dialog.open(ConfigFormComponent, {
      data: {
        data: endpoint
      }
    });

    this.dialog.afterAllClosed.subscribe(dialogResult => {
      this.ngOnInit();
    });

  }

  activateEndpoint(endpoints: Endpoint[]) {
    if (endpoints.length === 1) {
      this.configService.setActiveEndpoint(endpoints[0].id);
    }
  }

  delete(data: Endpoint) {
    const message = "Do you want to proceed and delete selected Database?";
    const dialogData = new ConfirmDialogModel("Delete Database Resource", message, "./assets/icons/icons_delete_db.svg");
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "373px",
      height: "197px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        let result = this.configService.removeEndpoint(data);
        if (result) {
          this.endpoints = this.configService.getAllEndpoints();
          if (this.endpoints.length > 0) {
            this.activeEndpoint = this.configService.getActiveEndpoint();
            this.formControl.source.setValue(this.activeEndpoint.id);
          } else {
            this.isDataAvailable = false;
          }
        }
        this.dialogService.openSnackBar(data.name + ' Deleted ', 'Successfully', 'Close', '');
        if(this.endpoints.length==0){
          this.configService.configPopupHeader.next("No database Available, Add New!"); 
        }
      }
    });

  }

  onSubmit() {
    this.isSubmitted = true;
    let id = this.formControl.source.value;
    let result = this.configService.setActiveEndpoint(id);
    if (result) {
      this.activeEndpoint = this.configService.getActiveEndpoint();
      this.configService.configPopupHeader.next(this.activeEndpoint.name);      
    }    
    return;
  }

  downloadConfigurations() {
    const blob = new Blob([JSON.stringify(this.configService.getConfigData())], { type: 'application/json' });
    saveAs(blob, 'config.json');
    this.dialogService.openSnackBar('File Downloaded ', 'Successfully', 'Close', '');
  }

  loadConfig() {
    this.dialog.open(LoadConfigComponent, {
      data: {
        data: '',
      },
    });

    this.dialog.afterAllClosed.subscribe(dialogResult => {
      this.ngOnInit();
    });
  }

  loadQueryTool() {
    this.dialog.open(QueryToolComponent, {
      panelClass: 'hide-scroll',      
      data: ''
    });
  }

  onDbChange(event) {    
    if (event.target.checked) {
      this.onSubmit();
      this.sortingElementsBasedonActiveEndpoint(true);
    }
    this.tooltip.show();
    
  }

  sortingElementsBasedonActiveEndpoint(isToasterShown: boolean) {
    this.endpoints.sort(function (endPointObj1, endPointObj2) {
      return (endPointObj1.active === endPointObj2.active) ? 0 : endPointObj1.active ? -1 : 1;
    });
    if (isToasterShown)
      this.playScrollEvent();
  }

  playScrollEvent(): void {
    let event = null;
    Promise.resolve()
      .then(() => this.timeout(1000))
      .then(() => {
        event = new SlimScrollEvent({
          y: Math.min(this.endpoints.length),
          duration: 100,          
          type: 'scrollToTop',
          easing: 'outCubic',
        });
        this.scrollEvents.emit(event);
      })
      setTimeout(() => {
        this.tooltip.hide();
      },4000)
  }

  timeout(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(() => resolve(), ms));
  }

  LoadConfigGlobalProxy() {
    this.dialog.open(ProxyDialogComponent, {
      panelClass: 'hide-scroll',      
      data: ''
    });
  }
  ngOnDestroy() {
    if (this.configHeaderSub) {
      this.configHeaderSub.unsubscribe();
    }
  }
}
