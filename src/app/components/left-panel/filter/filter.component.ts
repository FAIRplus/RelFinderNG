import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { FilterProcessService } from 'src/app/services/filters/filter-process.service';
import { ISlimScrollOptions, SlimScrollState, ISlimScrollState } from 'ngx-slimscroll';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit, OnDestroy {
  filterSubscription: Subscription;
  nodeChangeSubscription: Subscription;
  allFilters: Map<string, { isAllVisible: boolean, filterData: Map<string, { counts: string, isVisible: boolean }> }>;
  filteredDataAfterFilteration: Map<string, Map<string, number>>;
  totalActiveCounts = '';
  private initCounter: number = 0;
  opts: ISlimScrollOptions;
  enableScroll = true;
  slimScrollState = new SlimScrollState();


  constructor(public filterProcessService: FilterProcessService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.opts = {
      alwaysVisible: false
    };
    this.initializeFiltersData();
    this.filterNodeClick();
  }

  initializeFiltersData() {
    this.filterSubscription = this.filterProcessService.getBaseFilterSubject().subscribe((allFiltersData: Map<string, { active: boolean, isAllVisible: boolean, filterData: Map<string, { counts: string, isVisible: boolean }> }>) => {
      this.allFilters = allFiltersData;
      if (this.allFilters) {
        this.updateVisibleAll();
        this.updateCounts();
      } else
        this.totalActiveCounts = '0/0';
    });
  }

  // For select/deselect all
  updateVisibleAll() {
    for (let [key, value] of this.allFilters) {
      let desectedFilter = this.filterProcessService.filterObj.get(key);
      if (desectedFilter && desectedFilter.length > 0) {
        let isVisible = true;
        for (let filterVal of value.filterData.values()) {
          if (!filterVal.isVisible) {
            isVisible = false;
            break;
          }
        }
        this.allFilters.get(key).isAllVisible = isVisible;
      }
    }
  }

  updateCounts() {
    let lengthFilterData = this.allFilters.get('length');
    if (lengthFilterData) {
      let filteredData = lengthFilterData.filterData;
      let activeCounts = 0;
      let totalCounts = 0;
      for (let value of filteredData.values()) {
        let allCounts = value.counts.split('/');
        activeCounts = +allCounts[0] + activeCounts;
        totalCounts = +allCounts[1] + totalCounts;
      }
      this.totalActiveCounts = activeCounts + '/' + totalCounts;
    }
  }

  // To sort map 
  asIsOrder(a, b) {
    return 1;
  }

  filterNodeClick() {
    this.nodeChangeSubscription = this.filterProcessService.getFilterNodeSubject().subscribe((node: any) => {
      if (node && this.initCounter > 0) { // if initCounter is 0 then it is called from ngOnInit method that means when component is initialized. We don't need to apply this functionality at initial time.
        this.filterProcessService.activeFilterLabel = node.label;
        this.filterProcessService.activeFilter = node.type;
        if (node.label && node.label !== '') {
          if (node.trigger === true) {
            this.filterProcessService.setFitlersSubject(node.type, node.label, false);
          }
        }
      }
      this.initCounter++;
    });
  }

  handleFilterHeaderClick(checked: boolean, filterType: string) {
    let isChecked: boolean = !checked;
    let deSelectedFilters = [];
    if (!isChecked) {
      // If un-select all then push all filter data.
      let filteredData = this.allFilters.get(filterType);
      if (filteredData) {
        for (let key of Array.from(filteredData.filterData.keys())) {
          deSelectedFilters.push(key);
        }
      }
    } else {
      // If select all then clear filter data.
      deSelectedFilters = [];
    }
    this.filterProcessService.filterObj.set(filterType, deSelectedFilters);
    //this.filterProcessService.activeFilter = filterType;
    this.filterProcessService.highlightNodesEdges(this.filterProcessService.activeFilterLabel, filterType);

    //this.filterProcessService.setFitlersSubject(filterType, '', false);
    this.filterProcessService.fetchFilterData();
    return;
  }

  handleFilterValClick(event, filterType: string) {
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
    //this.filterProcessService.activeFilter = filterType;
    this.filterProcessService.highlightNodesEdges(filterLabel, filterType);
    this.filterProcessService.fetchFilterData();

    return;
  }

  ngOnDestroy() {
    this.filterSubscription.unsubscribe();
    this.nodeChangeSubscription.unsubscribe();
  }

  // highlightNodesEdges(label: string, filterType: string) {
  //  // this.activeFilter = idx;
  //   // if(this.currentFilterType!=filterType){
  //   //   this.filterProcessService.setFitlersSubject(this.currentFilterType, "", false);
  //   //   this.currentFilterType= filterType;
  //   // }
  //   //this.currentFilterType= filterType;

  //   this.filterProcessService.activeFilterLabel = label;
  //   this.filterProcessService.activeFilter = filterType;

  //   this.filterProcessService.setFitlersSubject(filterType, label, false);
  // }
}
