import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { RELATION_PATH, GraphEdgeSet } from 'src/app/models/vis.model';
import { Utils } from '../util/common.utils';

@Injectable({ providedIn: 'root' })
export class FilterProcessService {
    private visibleNodesEdgesSubject = new BehaviorSubject<{ nodes: string[], edges: string[] }>(undefined);
    private baseFilters = new BehaviorSubject<Map<string, { active: boolean, isAllVisible: boolean, filterData: Map<string, { counts: string, isVisible: boolean }> }>>
        (new Map<string, { active: boolean, isAllVisible: boolean, filterData: Map<string, { counts: string, isVisible: boolean }> }>());

    private allClassFilterData: Map<string, number> = new Map();
    private allLinkDataMap: Map<string, number>;
    private allLengthFilterData: Map<string, number>;
    private allConnectivityFilterData: Map<string, number>;
  

    public consumedRelationPaths: RELATION_PATH[] = [];
    //private edges: any[] = []; 
    public connectivity: any[];
    private visibleConnectivity = [];
    public classData: any[] = [];
    private visibleClassData = [];
    public filterObj: Map<string, string[]> = new Map<string, string[]>();
    private selectedSources: string[];
    public activeFilter = 'length';
    public activeFilterLabel = '';
    public topPanelFilterType : string = "length";

    public _nodes: any[] = [];
    public _edges: any[] = [];
    public _paths: any[] = [];
    
    allFilters = new Map<string, {active: boolean, isAllVisible: boolean, filterData: Map<string, {counts: string, isVisible: boolean}>}>();
    visibleClassFilterData: Map<string, number>;
    visibleLengthFilterData: Map<string, number>;
    visibleLinkDataMap: Map<string, number>;
    visibleConnectivityDataMap = new Map();
    
    private fitlersNodeSubject = new BehaviorSubject<any>('');// to handle node click highlights with filter
    private fitlersSubject = new BehaviorSubject<any>('');

    public clearAllFilters() {
        this.consumedRelationPaths = [];
        //this.edges = [];
        this.connectivity = [];
        this.visibleConnectivity = [];
        this.classData = [];
        this.visibleClassData = [];
        this.selectedSources = [];
        this.visibleNodesEdgesSubject.next(undefined);
        this.baseFilters.next(undefined);
        this.activeFilterLabel = '';
        this.activeFilter = 'length';
        if(this.filterObj) 
            this.filterObj.clear();
        if (this.fitlersNodeSubject)
            this.fitlersNodeSubject.next(undefined);
        if(this.fitlersSubject)
            this.fitlersSubject.next(undefined);
        if(this.allClassFilterData)
            this.allClassFilterData.clear();
        if(this.allLinkDataMap)
            this.allLinkDataMap.clear();
        if(this.allLengthFilterData)
            this.allLengthFilterData.clear();
        if(this.allConnectivityFilterData)
            this.allConnectivityFilterData.clear();

        this.topPanelFilterType = 'length';

        this._nodes = [];
        this._edges = [];
        this._paths = [];

        if (this.visibleClassFilterData) {
            this.visibleClassFilterData.clear();
        }
        if (this.visibleLengthFilterData) {
            this.visibleLengthFilterData.clear();
        }
        if (this.visibleLinkDataMap) {
            this.visibleLinkDataMap.clear();
        }
        if (this.visibleConnectivityDataMap) {
            this.visibleConnectivityDataMap.clear();
        }
        if(this.allFilters) {
            this.allFilters.clear();
        }
    }

    public setGlobalData(nodes: object[],edges: object[],paths: object[]){
        Array.prototype.push.apply(this._nodes, nodes);
        Array.prototype.push.apply(this._edges, edges);
        this._edges = Utils.distinct(this._edges);
        Array.prototype.push.apply(this._paths, paths);
    }

    public setGlobalVariables(consumedRelationPaths: RELATION_PATH[], selectedSources: string[]) {
        //this.consumedRelationPaths = [...consumedRelationPaths];
        Array.prototype.push.apply(this.consumedRelationPaths, consumedRelationPaths);
        //  Array.prototype.push.apply(this.edges, edges);
        // this.edges = Utils.distinct(this.edges);
        //this.edges = [...edges];
        //this.classData =[...classData];
        this.selectedSources = selectedSources;
    }

    public setClassData(classData: any[]) {
        Array.prototype.push.apply(this.classData, classData);
    }

    public getClassFilterData(): any[] {
        return this.classData;
    }

    public fetchFilterData() {
        let filteredRelationPath: RELATION_PATH[] = [];
        let isFilterEnabled = false;
        if (this.filterObj && this.filterObj.size > 0) {
            isFilterEnabled = true;
            let classLabelsFilter: string[] = this.filterObj.get('class');
            let lengthFilter: string[] = this.filterObj.get('length');
            let linkFilter: string[] = this.filterObj.get('link');
            let connectivityFilter: string[] = this.filterObj.get('connectivity');
            let nodeToUpdate: string[] = [];

            // Set invisible nodes for class filter
            if (classLabelsFilter && classLabelsFilter.length > 0) {
                this.visibleClassData = [];
                this.classData.forEach((data: any) => {
                    if (classLabelsFilter.includes(data.key)) {
                        nodeToUpdate = nodeToUpdate.concat(data.value);
                    } else {
                        this.visibleClassData.push(data);
                    }
                });
            } else {
                this.visibleClassData = this.classData;
            }
            // Set invisible nodes for Connectivity filter
            if (connectivityFilter && connectivityFilter.length > 0) {
                this.visibleConnectivity = [];
                this.connectivity.forEach((data: any) => {
                    if (connectivityFilter.includes(data.key)) {
                        nodeToUpdate = nodeToUpdate.concat(data.value);
                    } else {
                        this.visibleConnectivity.push(data);
                    }
                });
            } else {
                this.visibleConnectivity = this.connectivity;
            }

            this.consumedRelationPaths.forEach((path: RELATION_PATH) => {
                let isPathVisible = true;
                // Length
                if (lengthFilter && lengthFilter.length > 0) {
                    if (lengthFilter.includes(path.length.toString())) {
                        isPathVisible = false;
                    }
                }
                // Class & connectivity
                if (nodeToUpdate.length > 0 && isPathVisible) {
                    path.nodes.forEach((node: any) => {
                        if (nodeToUpdate.includes(node.id)) {
                            isPathVisible = false;
                        }
                    });
                }
                // Link
                if (linkFilter && linkFilter.length > 0 && isPathVisible) {
                    for (let j = 0; j < path.edges.length; j++) {
                        let edge = path.edges[j] as any;
                        if (linkFilter.includes(edge.label)) {
                            isPathVisible = false;
                        }
                    }
                }
                if (isPathVisible) {
                    filteredRelationPath.push(path);
                }
            });
        }
        if (isFilterEnabled) {
            this.triggerEvents(filteredRelationPath, isFilterEnabled);

        } else {
            this.triggerEvents(this.consumedRelationPaths, isFilterEnabled);
        }
    }

    private triggerEvents(filteredRelationPath: RELATION_PATH[], isFilterEnabled: boolean) {
        let visibleNodes = Object.assign([], this.selectedSources); // Assigning selected sources so that these should be visible all the times.
        let visibleEdges = [];
        filteredRelationPath.forEach((path: RELATION_PATH) => {
            path.nodes.forEach((node: any) => {
                visibleNodes.push(node.id);
            });
            path.edges.forEach((edge: any) => {
                visibleEdges.push(edge);
            });
        });
        visibleNodes = Array.from(new Set(visibleNodes));
        visibleEdges = Utils.distinct(visibleEdges);
        let visibleEdgeIds = visibleEdges.map(edge => edge.id);
        let visibleEdgeLabels = visibleEdges.map(edge => edge.label);

        // To update visible class data.
        this.visibleClassData = this.getVisibleData(visibleNodes, this.visibleClassData);
        // To update connectivity class data.
        this.visibleConnectivity = this.getVisibleData(visibleNodes, this.visibleConnectivity);

        if (isFilterEnabled) {
            // This will update the graph.
            this.visibleNodesEdgesSubject.next({ nodes: visibleNodes, edges: visibleEdgeIds });
        }
        // This will update the filter data which will display in top and left filter box. 
        this.updateFiltersCount(filteredRelationPath, visibleEdgeLabels, isFilterEnabled);
    }

    public getVisibleNodesEdgesSubject(): Observable<any> {
        return this.visibleNodesEdgesSubject.asObservable();
    }

    public setVisibleNodesEdgesSubject(visibleNodes: string[], visibleEdgeIds: string[]): void {
        this.visibleNodesEdgesSubject.next({ nodes: visibleNodes, edges: visibleEdgeIds });
    }

    private getVisibleData(visibleNodes: string[], visibleData: any[]): any[] {
        let tempArr = Object.assign([], visibleData);
        visibleData = [];
        tempArr.forEach((data: any) => {
            let resUris = data.value;
            resUris = resUris.filter((val: string) => visibleNodes.includes(val));
            if (resUris && resUris.length > 0)
                visibleData.push({ key: data.key, value: resUris });
        });
        return visibleData;
    }

    private updateFiltersCount(filteredRelationPath: RELATION_PATH[],visibleEdgeLabels: string[], isFilterEnabled: boolean) {
        //var allLength = [];
        let visibleLength = [];
        let visibleLinks = [];

        // This block will execute until graph is loaded.
        let isLoadCompleted = document.getElementById('VisualizationFinished');
        if(isLoadCompleted === null || isLoadCompleted === undefined) {
            this.setAllFiltersTotalCountData();
        }
        // Class data will load after graph is loaded.
        if(this.classData.length > 0) {
            this.allClassFilterData = this.getFilterMap(this.classData);
        }

        if (isFilterEnabled) {
            filteredRelationPath.forEach((path: RELATION_PATH) => {
                let lenth = path.length;
                visibleLength.push(lenth.toString());
                // if (isFilterEnabled) {
                //     visibleLength.push(lenth.toString());
                // } 
                // else {
                //     allLength.push(lenth.toString());
                // }
            });

            // Class filter
            this.visibleClassFilterData = this.getFilterMap(this.visibleClassData);
            // Connectivity filter
            this.visibleConnectivityDataMap = this.getFilterMap(this.visibleConnectivity);
            //length filter
            this.visibleLengthFilterData = this.updateMapFilter(visibleLength);
            //link filter
            visibleEdgeLabels.forEach((edge: any) => {
                visibleLinks.push(edge);
            });
            this.visibleLinkDataMap = this.updateMapFilter(visibleLinks);
        } else {
            // Class filter
            this.visibleClassFilterData = this.allClassFilterData;
            // Connectivity filter
            this.visibleConnectivityDataMap = this.allConnectivityFilterData;
            //length filter
            this.visibleLengthFilterData = this.allLengthFilterData;
            //link filter
            this.visibleLinkDataMap = this.allLinkDataMap;
        }

        this.allFilters.set('length', this.appendAllAndVisibleFiltersCount(this.visibleLengthFilterData, this.allLengthFilterData, 'length'));
        this.allFilters.set('link', this.appendAllAndVisibleFiltersCount(this.visibleLinkDataMap, this.allLinkDataMap, 'link'));
        this.allFilters.set('connectivity', this.appendAllAndVisibleFiltersCount(this.visibleConnectivityDataMap, this.allConnectivityFilterData, 'connectivity'));
        this.allFilters.set('class', this.appendAllAndVisibleFiltersCount(this.visibleClassFilterData, this.allClassFilterData, 'class'));
        
        this.baseFilters.next(this.allFilters);
    }

    private setAllFiltersTotalCountData() {
        this.allConnectivityFilterData = this.getFilterMap(this.connectivity);
        this.allLinkDataMap = this.setLinkFilter();
        let allLength = [];
        this.consumedRelationPaths.forEach((path: RELATION_PATH) => {
            allLength.push(path.length.toString());
        });
        this.allLengthFilterData = this.updateMapFilter(allLength);
    }

    private setLinkFilter(): any {
        let linkFilterData = new Map();
        this._edges.forEach((edge: any) => {
            let link = edge.label;
            if (linkFilterData.has(link)) {
                linkFilterData.set(link, linkFilterData.get(link) + 1);
            } else {
                linkFilterData.set(link, 1);
            }
        });
        return linkFilterData;
    }

    private getFilterMap(filterData: any[]): any {
        let filterDataMap = new Map();
        filterData.forEach((filterObj: any) => {
            filterDataMap.set(filterObj.key, filterObj.value.length);
        });
        return filterDataMap;
    }

    private appendAllAndVisibleFiltersCount(visibleFilterData: Map<string, number>,
        allFilterData: Map<string, number>, filterType: string): { active: boolean, isAllVisible: boolean, filterData: Map<string, { counts: string, isVisible: boolean }> } {
        let filterData = new Map<string, { counts: string, isVisible: boolean }>();
        let isAllVisible = true;
        let isActiveFilter = false;
        if (filterType === this.activeFilter) {
            isActiveFilter = true;
        }
        //let counter = 0;
        for(let [key, value] of allFilterData) {
            let activeCount = visibleFilterData.get(key);
            if (activeCount) {
                //let visible = true;
                //if(activeCount !== value) {
                // visible = false;
                //isAllVisible = false;
                //}
                let countsStr = activeCount + '/' + value;
                filterData.set(key, { counts: countsStr, isVisible: true });
            } else {
                let countsStr = '0' + '/' + value;
                filterData.set(key, { counts: countsStr, isVisible: false });
                //isAllVisible = false;
               // counter++;
            }
        }
        // if(counter === allFilterData.size)
        //     isAllVisible = false;

        let retData = { active: isActiveFilter, isAllVisible: isAllVisible, filterData: filterData };
        return retData;
    }

    updateMapFilter(filterData: string[]): Map<string, number> {
        let retMap = new Map<string, number>();
        filterData.forEach(filter => {
            if (retMap.has(filter)) {
                retMap.set(filter, retMap.get(filter) + 1);
            } else {
                retMap.set(filter, 1);
            }
        });
        return retMap;
    }

    // updateClassFilterCount(visibleClasses: any[]): Map<string, number> {
    //     let visibleClass = new Map<string, number>();
    //     visibleClasses.forEach(classData => {
    //         if (visibleClass.has(classData.label)) {
    //             visibleClass.set(classData.label, visibleClass.get(classData.label) + 1);
    //         } else {
    //             visibleClass.set(classData.label, 1);
    //         }
    //     });
    //     return visibleClass;
    // }

    public getBaseFilterSubject(): Observable<any> {
        return this.baseFilters.asObservable();
    }

    public setBaseFilterSubject(data: Map<string, { active: boolean, isAllVisible: boolean, filterData: Map<string, { counts: string, isVisible: boolean }> }>): void {
        this.baseFilters.next(data);
    }

    // Coonectivity logic
    setConnectivityFilterData() {
        let connectivityLevels: Map<string, string[]> = new Map<string, string[]>();        
        this._nodes.forEach(nodeObj => {
            if (!this.selectedSources.includes(nodeObj.id)) {
                let nodeList: Set<string> = new Set<string>();
                let conLength: number = 0;
                let nodeArr: string[] = [];
                this._paths.forEach((pathObj: any) => {
                    if (pathObj.nodes.includes(nodeObj.id)) {
                        let s: string = pathObj.startNode;
                        let o: string = pathObj.endNode;
                        if (s != nodeObj.id && o != nodeObj.id) {

                            nodeList.add(s);
                            nodeList.add(o);
                        }
                    }
                });
                nodeList.delete(undefined);
                conLength = nodeList.size;
                if (connectivityLevels.has("" + conLength)) {
                    nodeArr = connectivityLevels.get("" + conLength);
                    nodeArr.push(nodeObj.id);
                    connectivityLevels.set("" + conLength, Array.from(new Set(nodeArr)));
                } else {
                    nodeArr = [];
                    nodeArr.push(nodeObj.id);
                    connectivityLevels.set("" + conLength, nodeArr);
                }
            }
        });
        this.connectivity = [];
        connectivityLevels.forEach((value, key) => {
            this.connectivity.push({ key: key, value: value });
        });
    }

    // Highlight filter logic starts here

    highlightNodesEdges(label: string, filterType: string) {
        this.activeFilterLabel = label;
        this.activeFilter = filterType;
        this.setFitlersSubject(filterType, label, false);
    }

    public changeFilterOnNodeClick(nodeId: string) {
        let classLabel = '';
        let isClassAvailable = false;
        //let currentFilterLabel = this.activeFilterLabel;
        if (nodeId) {
            this.getClassFilterData().forEach((data: any) => {
                let resUris: string[] = data.value;
                if (resUris.includes(nodeId)) {
                    classLabel = data.key;
                    isClassAvailable = true;
                    return;
                }
            });
        }
        if(isClassAvailable) {
            this.fitlersNodeSubject.next({ label: classLabel, type: 'class', trigger: isClassAvailable });
        } else {            
            this.fitlersNodeSubject.next({ label: classLabel, type: this.activeFilter, trigger: isClassAvailable });
        }
        // if (isClassAvailable) {
        //     this.fitlersNodeSubject.next({ label: classLabel, type: 'class', trigger: true });
        // } else {
        //     this.fitlersNodeSubject.next({ label: classLabel, type: this.activeFilter, trigger: isClassAvailable });//currentFilterLabel. currentFilterType
        // }
        return;
    }

    public getFilterNodeSubject(): Observable<any> {
        return this.fitlersNodeSubject.asObservable();
    }
    public setFilterNodeSubject(currentFilterLabel: string, currentFilterType: string, triggerVal: boolean) {
        this.fitlersNodeSubject.next({ label: currentFilterLabel, type: currentFilterType, trigger: triggerVal });
    }

    // Set data to highlight corressponding nodes or edges
    public setFitlersSubject(currentFilterType: string, label: string, triggerVal: boolean) {
        this.fitlersSubject.next({ type: currentFilterType, value: label, trigger: triggerVal });
    }

    // Set data to highlight corressponding nodes or edges if user has selected any filter during graph loading.
    public setGlobalFiterSubject() {
        this.fitlersSubject.next({ type: this.activeFilter, value: this.activeFilterLabel, trigger: false });
    }

    public getFitlersSubject(): Observable<any> {
        return this.fitlersSubject.asObservable();
    }

    // Hide/un-hide or highlight nodes/edges If user selected any filter during graph loading
    public setFilterSelectionIfAny() {
        this.setGlobalFiterSubject();
        // if(this.filterObj && this.filterObj.size > 0) 
        //     this.fetchFilterData();
    }

    // Highlight filter logic end here

}