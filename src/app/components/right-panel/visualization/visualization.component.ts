import { Component, OnDestroy, OnInit, Input, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import { SPARQLConnectionService } from 'src/app/services/sparql/sparqlconnection.service';
import { ConstantsService } from 'src/app/services/util/constants.service';
import { ConfigurationsService } from 'src/app/services/configurations/configurations.service';

@Component({
  selector: 'app-visualization',
  templateUrl: './visualization.component.html',
  styleUrls: ['./visualization.component.css']
})
export class VisualizationComponent implements OnInit, OnDestroy {

  @Input("errorInformation") errorInformation: any;

  visStatus: string = this.constantService.IDLE;
  graphLoadStatusSub: Subscription;
  errorInfo: string = 'NO';
  isDisplayed: boolean = false;
  errorMessagesubscription: Subscription;
  leftMenuToggle: Subscription;
  isCollapsed: boolean = false;
  isCollapsedLeft: boolean = false;
  intialHeight: any;
  intialWidth: any;
  orginalScreenHeight: any;
  orginalScreenWidth: any;
  // graphLoadVal: boolean = false;

  constructor(public constantService: ConstantsService,
    public sparqlConnectionService: SPARQLConnectionService, public configurationsService: ConfigurationsService) {
    this.errorMessagesubscription = this.sparqlConnectionService.getMessage().subscribe(data => {
      if (this.errorMessagesubscription != undefined) {
        this.errorInfo = 'YES';
        this.isDisplayed = true;
        this.errorInformation = data;
        this.sparqlConnectionService.clearGraph();
      }
    });
    this.leftMenuToggle = this.sparqlConnectionService.leftMenuToggle.subscribe((data: any) => {
      if (this.leftMenuToggle != undefined) {
        this.isCollapsedLeft = data;
        this.isCollapsedToggle();
      }
    });
  }

  ngOnInit() {
    this.graphLoadStatusSub = this.sparqlConnectionService.graphLoadStatus.subscribe(status => {
      this.visStatus = status;
    });
    // if (this.visStatus == this.constantService.LOADED) {
    //   this.graphLoadVal=true;
    // }
    this.getScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: undefined) {
    this.intialHeight = window.innerHeight - (56 + 72);
    this.orginalScreenHeight = this.intialHeight
    this.intialWidth = window.innerWidth - 55;
    this.orginalScreenWidth = this.intialWidth;
  }

  @HostListener('window:devtoolschange', ['$event'])
  getDevTools(event?: { detail: { isOpen: any; }; }) {
    if (!event.detail.isOpen) {
      this.intialHeight = window.innerHeight - (56 + 72);
      this.intialWidth = window.innerWidth - 55;
      if(this.sparqlConnectionService.relfinderObj != undefined){
        this.sparqlConnectionService.relfinderObj._network.moveTo({
          scale: 1
        });
      }  
    }
    // future purpose if we need to to horizontal and vertical scenarion user orientation option 
    // [ event.detail.orientation ]
  }

  ngOnDestroy() {
    this.graphLoadStatusSub.unsubscribe();
    this.errorMessagesubscription.unsubscribe();
    this.leftMenuToggle.unsubscribe();
  }

  isCollapsedVisulized() {
    if (this.isCollapsed) {
      this.isCollapsed = false;
      this.intialHeight = this.orginalScreenHeight;
      this.intialWidth = this.orginalScreenWidth;
      if (this.isCollapsedLeft) {
        this.marginAlignment();
        this.intialWidth = this.orginalScreenWidth + 55;
      }
      this.zooinMarginAlignment(31);
      this.sparqlConnectionService.topToolTipDynamic.next(this.constantService.TOP_TOOL_TIP_CLASS_TOP);
    } else {
      this.isCollapsed = true;
      this.marginAlignment();
      this.intialHeight = this.orginalScreenHeight + 56;
      this.intialWidth = this.orginalScreenWidth;
      if (this.isCollapsedLeft) {
        this.intialWidth = this.orginalScreenWidth + 55;
      }
      this.zooinMarginAlignment(27);
      this.sparqlConnectionService.topToolTipDynamic.next(this.constantService.TOP_TOOL_TIP_CLASS_DOWN);
    }
  }

  isCollapsedToggle() {
    if (this.isCollapsedLeft) {
      this.isCollapsedLeft = false;
      // header : 70 topPane :70 leftPanel: 55
      this.reSizeingLeftPanel(70, 70, 55);
      this.intialWidth = this.orginalScreenWidth;

    }
    else {
      this.isCollapsedLeft = true;      
      this.intialWidth = this.orginalScreenWidth + 55;
      //header : 35 topPane :35 leftPanel: 0
      this.reSizeingLeftPanel(35, 35, 0);      
      this.resetPopUp();
    }
  }

  zooinMarginAlignment(heightVal: string | number) {
    let zoomIN = document.getElementById("graph-area-vis").getElementsByClassName("vis-fullscreen");
    let zoomEle = zoomIN.item(0) as HTMLElement;
    zoomEle.style.height = heightVal + 'px';
  }

  marginAlignment() {
    let graphArea = document.getElementById("loadGraph").getElementsByClassName("vis-network");
    let graphEle = graphArea.item(0) as HTMLElement;
    graphEle.style.margin = '0 0 0 0';
    graphEle.style.padding = '0 0 0 0';
  }

  reSizeingLeftPanel(header: string | number, topPanel: string | number, leftPanel: string | number) {
    let head = document.getElementsByClassName("container-fluid");
    let headD = head.item(1) as HTMLElement;
    headD.style.padding = '0 0 0 ' + header + 'px';
    let tabToDisplay = head.item(2) as HTMLElement;
    tabToDisplay.style.padding = '0 0 0 ' + topPanel + 'px';
    let vis = head.item(3) as HTMLElement;
    vis.style.padding = '0 0 0 ' + leftPanel + 'px';
  }

  resetPopUp() {
    this.configurationsService.toggleLeftMenu.next({ type: 'search', visible: false });
    this.configurationsService.toggleLeftMenu.next({ type: 'info', visible: false });
    this.configurationsService.toggleLeftMenu.next({ type: 'link', visible: false });
    this.configurationsService.toggleLeftMenu.next({ type: 'filter', visible: false });
    this.configurationsService.toggleLeftMenu.next({ type: 'config', visible: false });
    this.configurationsService.toggleLeftMenu.next({ type: 'release', visible: false });
  }

}
