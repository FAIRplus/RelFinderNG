import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FilterProcessService } from 'src/app/services/filters/filter-process.service';
import { SPARQLConnectionService } from 'src/app/services/sparql/sparqlconnection.service';
import { ConstantsService } from 'src/app/services/util/constants.service';
import { FiltersUtils } from 'src/app/services/util/filters.utils';
import { Utils } from 'src/app/services/util/common.utils';
import { FormGroup, FormBuilder } from '@angular/forms';
import { delay } from 'rxjs/operators';

@Component({
  selector: '.app-top-panel',
  templateUrl: './top-panel.component.html',
  styleUrls: ['./top-panel.component.css']
})
export class TopPanelComponent implements OnInit, OnDestroy {
  filterSubscription: Subscription;
  filterChangeSubscription: Subscription;
  allFilters: Map<string, { isAllVisible: boolean, filterData: Map<string, { counts: string, isVisible: boolean }> }>;
  filteredData = [];
  graphLoadStatusSub: Subscription;
  visStatus: string = this.constantService.IDLE;
  indexVal: number = 0;
  filterKeyForm: FormGroup;
  isCollapsedLeft: boolean = false;
  topPanelTooltipClass: string = this.constantService.TOP_TOOL_TIP_CLASS_TOP;
  topToolTipSubscription: Subscription;

  constructor(private sparqlConService: SPARQLConnectionService,
    public constantService: ConstantsService,
    public filterProcessService: FilterProcessService, private formBuilder: FormBuilder) {
    this.topToolTipSubscription = this.sparqlConService.topToolTipDynamic.subscribe((data: any) => {
      if (this.topToolTipSubscription != undefined) {
        this.topPanelTooltipClass = data;
      }
    });
  }

  ngOnInit() {
    this.initializeFiltersData();
    this.graphLoadStatusSub = this.sparqlConService.graphLoadStatus.subscribe(status => {
      this.visStatus = status;
    });
    this.filterNodeClick();
    this.getFormFilterKeys();
  }

  filterNodeClick() {
    this.filterChangeSubscription = this.filterProcessService.getFilterNodeSubject().subscribe((node: any) => {
      if (node) {
        // if (node.type) {
        //   this.topPanelFilterType = node.type;
        // }
        this.filterProcessService.activeFilterLabel = node.label;
        this.filterProcessService.activeFilter = node.type;
        if (node.label !== '') {
          if (node.trigger === true) {
            this.filterProcessService.setFitlersSubject(node.type, node.label, false);
          }
        }
      }
    });
  }


  initializeFiltersData() {
    this.filterSubscription = this.filterProcessService.getBaseFilterSubject().subscribe((allFiltersData: Map<string, { active: boolean, isAllVisible: boolean, filterData: Map<string, { counts: string, isVisible: boolean }> }>) => {
      this.allFilters = allFiltersData;
      this.changeFilter(this.filterProcessService.topPanelFilterType); // To show default filter data.
    });
  }

  asIsOrder(a, b) {
    return 1;
  }

  changeFilter(filterType: string) {
    this.filterProcessService.topPanelFilterType = filterType;
    //this.prevFilterType = this.topPanelFilterType;
    if (this.allFilters) {
      let filterData = this.allFilters.get(filterType);
      if (filterData) {
        this.filteredData = FiltersUtils.getFilterObject(filterData.filterData, filterType);
      } else {
        this.filteredData = [];
      }
    } else {
      this.filteredData = [];
    }
  }

  handleFilterClick(event, filterType: string) {
    let isChecked: boolean = event.target.checked;
    let filterLabel = event.target.value;
    let deSelectedFilters = [];
    let filterData = this.filterProcessService.filterObj.get(filterType);
    if (filterData && filterData.length > 0) {
      deSelectedFilters = filterData;
    }
    if (!isChecked) {
      if (!deSelectedFilters.includes(filterLabel))
        deSelectedFilters.push(filterLabel);
    } else {
      const index: number = deSelectedFilters.indexOf(filterLabel);
      if (index !== -1) {
        deSelectedFilters.splice(index, 1);
      }
    }
    this.filterProcessService.filterObj.set(filterType, deSelectedFilters);
    this.filterProcessService.activeFilter = filterType;

    this.filterProcessService.fetchFilterData();
    return;
  }

  getFormFilterKeys() {
    this.filterKeyForm = this.formBuilder.group({
      filterKeyControl: 'length'
    });
  }

  // delay(ms: number) {
  //   return new Promise( resolve => setTimeout(resolve, ms) );
  // }

  async isCollapsedToggle() {
    if (this.isCollapsedLeft) {
      // await this.delay(500);
      this.sparqlConService.leftMenuToggle.next(true);
      this.isCollapsedLeft = false;
    } else {
      // await this.delay(500);
      this.sparqlConService.leftMenuToggle.next(false);
      this.isCollapsedLeft = true;
    }
  }

  ngOnDestroy() {
    this.filterSubscription.unsubscribe();
    this.graphLoadStatusSub.unsubscribe();
    this.filterChangeSubscription.unsubscribe();
    this.topToolTipSubscription.unsubscribe();
  }
}