
export class Utils {
    public static _displaySwitch: boolean = true;
    public static RESOURCE: string = 'resource';

    public static hideHeader(isDisplayed: boolean) {
        this._displaySwitch = isDisplayed;
    }

    public static distinct(arr: any[]): any[] {
        var ae = [];
        arr.forEach((t) => {
            if (ae.indexOf(t) < 0)
                ae.push(t);
        });
        return ae;
    }

    public static deepClone(value: any): any {
        if (value === undefined)
            return undefined;

        if (value === null)
            return null;

        if (typeof (value) == 'string'
            || typeof (value) == 'number'
            || typeof (value) == 'boolean'
            || value instanceof Function) {
            return value;
        }

        if (value instanceof Array) {
            var arr: any[] = value;
            return arr.map((item) => {
                return Utils.deepClone(item);
            });
        }

        if (typeof (value) == 'object') {
            return Utils._deepCloneObject(value);
        }

        throw new TypeError("unsupported type: " + typeof (value));
    }

    private static _deepCloneObject(src: object): object {
        var dest = {};
        for (let key in src) {
            if (src.hasOwnProperty(key)) {
                var value = src[key];
                dest[key] = Utils.deepClone(value);
            }
        }

        return dest;
    }

	/**
	 * base + delta
	 * @param base 
	 * @param delta 
	 */
    public static deepExtend(base: object, delta: object): object {
        //do not working on base object
        var dest = Utils._deepCloneObject(base);

        for (let key in delta) {
            if (delta.hasOwnProperty(key)) {
                var baseValue = base[key];
                var extValue = delta[key];

                if (typeof (extValue) == 'object' &&
                    typeof (baseValue) == 'object') {
                    dest[key] = Utils.deepExtend(baseValue, extValue);
                    continue;
                }

                //base={a:{x:...}}, ext={a:2}
                dest[key] = Utils.deepClone(extValue);
            }
        }

        return dest;
    }


    public static toMap(o): Map<any, any> {
        var m = new Map();
        for (let key in o) {
            if (o.hasOwnProperty(key)) {
                m.set(key, o[key]);
            }
        }
        return m;
    }

    public static truncateString(str: string, maxLen: number, position: string = 'middle'): string {
        if (str.length <= maxLen) return str;
        let separator = '...';
        let sepLen = separator.length,
            charsToShow = maxLen - sepLen,
            frontChars = Math.ceil(charsToShow / 2),
            backChars = Math.floor(charsToShow / 2);

        if (position == 'start') {
            frontChars = 0;
            backChars = charsToShow;
            separator = '...';
        } else if (position == 'end') {
            frontChars = charsToShow;
            backChars = 0;
            separator = '...';
        } else if (position == 'end-space') {
            frontChars = charsToShow;
            backChars = 0;
            separator = '  ...';
        }

        return str.substr(0, frontChars) +
            separator + str.substr(str.length - backChars);
    }

    public static trimSpace(str: string): string {
        return str.replace(/_/g, ' ');
    }

    public static trimURI(uri: string): string {
        if (uri.charAt(uri.length - 1) == '/') {
            uri = (uri.substr(0, uri.length - 1));
        }
        return uri;
    }
    public static lastEleInArray(array: string[]) {
        if (array == null)
            return void 0;
        return decodeURI(this.trimSpace(array[array.length - 1]));
    }

    public static fetchSmoothOption(index: number) {
        switch (index) {
            case 2:
                return { type: 'curvedCW', roundness: -0.2 };
            case 3:
                return { type: 'curvedCW', roundness: 0.2 };
            case 4:
                return { type: 'curvedCW', roundness: 0 };
        }
    }
    static counterEdge = 1;
    static currentRelSet = 1;
    static relSetId: number = 1;
    static isSeletedSourcesLoading = false;

    public static triplesToNodeEdgeSet(data: string[], duplicateEdgesMap: Map<string, number>, selectedSources) {
        let graph = { data: { nodes: [], edges: [], paths: [], connectivity: [], inputNodes: [] } };
        let path: { startNode: string, endNode: string, nodes: string[], edges: number[] } = { startNode: '', endNode: '', nodes: [], edges: [] };
        let paths: { startNode: string, endNode: string, nodes: string[], edges: number[] }[] = [];
        let pathsObj: Map<string, any> = new Map<string, any>();
        //let connectivityLevels: Map<string, string[]> = new Map<string, string[]>();
        let pathKey: string = '';
        // let counterEdge = 1;
        // let currentRelSet = 1;
        // let relSetId: number = 1;
        let subjId: string;
        let predId: string;
        let objId: string;
        let subjLabel: string;
        let predLabel: string;
        let objLabel: string;
        let trpObj: string[];
        let inputOne: string;
        let inputTwo: string;
        let subjNode: { id: string, label: string, value: number, group?: number };
        let objNode: { id: string, label: string, value: number, group?: number };
        let linkSmooth: Map<string, string[]> = new Map<string, string[]>();
        let subUObj = '';
        let subUObjValue: string[] = [];
        let smoothOptions = null;
        let sourceList: Set<string> = new Set<string>();

        if (!this.isSeletedSourcesLoading && selectedSources) {
            for (let nodeId of selectedSources) {
                subjNode = this.filterNodesById(graph.data.nodes, nodeId)[0];
                if (subjNode == null) {
                    subjLabel = Utils.trimNodeURI(nodeId);
                    subjNode = { id: nodeId, label: subjLabel, value: 1 };
                    graph.data.nodes.push(subjNode);
                }
            }
            this.isSeletedSourcesLoading = true;
        }

        data.forEach(triple => {
            if (triple != null && typeof triple !== 'undefined' && triple.length > 0) {
                trpObj = triple.split('|')
                this.relSetId = +trpObj[2];
                subjId = trpObj[3];
                predId = trpObj[4];
                objId = trpObj[5];
                subjLabel = Utils.trimNodeURI(subjId);
                objLabel = Utils.lastEleInArray(Utils.trimURI(objId).split('/'));
                predLabel = Utils.lastEleInArray(Utils.trimURI(predId).split('/'))

                subUObj = subjId + "_" + objId;
                if (this.currentRelSet != this.relSetId) {
                    inputOne = trpObj[0],
                    inputTwo = trpObj[1],
                    path.nodes = Utils.distinct(path.nodes);
                    path.edges = Utils.distinct(path.edges);
                    pathKey = Utils.distinct(path.edges).sort().join('_');
                    path.startNode = inputOne;
                    path.endNode = inputTwo;
                    if (!pathsObj.has(pathKey) && path.nodes.length > 0) {
                        pathsObj.set(pathKey, path);
                        paths.push(path);
                    }
                    sourceList.add(inputOne);
                    sourceList.add(inputTwo);
                    path = { startNode: '', endNode: '', nodes: [], edges: [] };
                    path.nodes.push(subjId);
                    path.nodes.push(objId);
                    this.currentRelSet = this.relSetId;
                } else {
                    path.nodes.push(subjId);
                    path.nodes.push(objId);
                }
                subjNode = this.filterNodesById(graph.data.nodes, subjId)[0];
                objNode = this.filterNodesById(graph.data.nodes, objId)[0];


                if (subjNode == null) {
                    subjNode = { id: subjId, label: subjLabel, value: 1 };
                    graph.data.nodes.push(subjNode);
                }

                if (objNode == null) {
                    objNode = { id: objId, label: objLabel, value: 1 };
                    graph.data.nodes.push(objNode);
                }

                if (!duplicateEdgesMap.has(subjNode.id + '_' + objNode.id + '_' + predLabel)) {
                    subUObjValue = [];
                    if (linkSmooth.has(subUObj)) {
                        subUObjValue = linkSmooth.get(subUObj);
                        var index = subUObjValue.push(predLabel);
                        //write logic to fetch smooth data here based on index
                        smoothOptions = this.fetchSmoothOption(index);
                        subUObjValue = Utils.distinct(subUObjValue);
                        linkSmooth.set(subUObj, subUObjValue);
                    } else {
                        subUObjValue.push(predLabel);
                        linkSmooth.set(subUObj, subUObjValue);
                    }
                    if (smoothOptions != null) {
                        graph.data.edges.push({
                            id: this.counterEdge,
                            from: subjNode.id,
                            to: objNode.id,
                            label: predLabel,
                            smooth: smoothOptions
                        });
                        smoothOptions = null;
                    } else {
                        graph.data.edges.push({
                            id: this.counterEdge,
                            from: subjNode.id,
                            to: objNode.id,
                            label: predLabel
                        });
                    }
                    duplicateEdgesMap.set(subjNode.id + '_' + objNode.id + '_' + predLabel, this.counterEdge);
                    path.edges.push(this.counterEdge);
                    this.counterEdge++;
                } else {
                    path.edges.push(duplicateEdgesMap.get(subjNode.id + '_' + objNode.id + '_' + predLabel));
                }
            }
        });
        path.startNode = inputOne;
        path.endNode = inputTwo;
        path.nodes = Utils.distinct(path.nodes);
        path.edges = Utils.distinct(path.edges);
        pathKey = Utils.distinct(path.edges).sort().join('_');
        if (!pathsObj.has(pathKey) && path.nodes.length > 0) {
            pathsObj.set(pathKey, path);
            paths.push(path);
        }
        graph.data.edges = Utils.distinct(graph.data.edges);
        graph.data.paths = paths;
        graph.data.inputNodes = Array.from(sourceList);
        console.log('Utils: Nodes :' + JSON.stringify(graph.data.nodes.length));
        console.log('Utils: Edges :' + JSON.stringify(graph.data.edges.length));
        console.log('Utils: Paths :' + JSON.stringify(graph.data.paths.length));
        console.log('Utils: PATHS :' + JSON.stringify(pathsObj.size));

        // graph.data.nodes.forEach(nodeObj => {
        //     if (!sourceList.has(nodeObj.id)) {
        //         let nodeList: Set<string> = new Set<string>();
        //         let conLength: number = 0;
        //         let nodeArr: string[] = [];
        //         paths.forEach((pathObj: any) => {
        //             if (pathObj.nodes.includes(nodeObj.id)) {
        //                 let s: string = pathObj.startNode;
        //                 let o: string = pathObj.endNode;
        //                 if (s != nodeObj.id && o != nodeObj.id) {

        //                     nodeList.add(s);
        //                     nodeList.add(o);
        //                 }
        //             }
        //         });
        //         conLength = nodeList.size;
        //         if (connectivityLevels.has("" + conLength)) {
        //             nodeArr = connectivityLevels.get("" + conLength);
        //             nodeArr.push(nodeObj.id);
        //             connectivityLevels.set("" + conLength, nodeArr);
        //         } else {
        //             nodeArr = [];
        //             nodeArr.push(nodeObj.id);
        //             connectivityLevels.set("" + conLength, nodeArr);
        //         }
        //     }
        // });

        // connectivityLevels.forEach((value, key) => {
        //     graph.data.connectivity.push({ key: key, value: value });
        // });
        return graph;
    }
    public static filterNodesById(nodes, id) {
        return nodes.filter(function (n) { return n.id === id; });
    }

    public static getLocaleData(nodeid: string, mapObjForLocaleData: any, language: string) {
        let languag = [];
        for (let obj of mapObjForLocaleData) {
            let labelValue = '';
            if (obj.id === nodeid) {
                for (let lableObj of obj.value.labeledData) {
                    if (language === 'res') {
                        if (lableObj.lang === 'English') {
                            //labelValue = lableObj.value;
                            labelValue = obj.id;
                            break;
                        }
                    }
                    else {
                        if (lableObj.lang === language) {
                            labelValue = lableObj.value;
                            break;
                        }
                    }
                }
                for (let abstract of obj.value.abstractData) {
                    if (language === 'res') {
                        if (abstract.lang === 'English') {
                            languag.push({ desc: obj.value.linkURIData[0] + "_SEP_" + abstract.value + "_SEP_" + obj.value.imageURI[0], lang: labelValue });
                            break;
                        }
                    }
                    else {
                        if (abstract.lang === language) {
                            languag.push({ desc: obj.value.linkURIData[0] + "_SEP_" + abstract.value + "_SEP_" + obj.value.imageURI[0], lang: labelValue });
                            break;
                        }
                    }
                }
                break;
            }
        }
        return languag;
    }

    public static removeDuplicates(arr) {

        const result = [];
        const duplicatesIndices = [];

        // Loop through each item in the original array
        arr.forEach((current, index) => {

            if (duplicatesIndices.includes(index)) return;

            result.push(current);

            // Loop through each other item on array after the current one
            for (let comparisonIndex = index + 1; comparisonIndex < arr.length; comparisonIndex++) {

                const comparison = arr[comparisonIndex];
                const currentKeys = Object.keys(current);
                const comparisonKeys = Object.keys(comparison);

                // Check number of keys in objects
                if (currentKeys.length !== comparisonKeys.length) continue;

                // Check key names
                const currentKeysString = currentKeys.sort().join("").toLowerCase();
                const comparisonKeysString = comparisonKeys.sort().join("").toLowerCase();
                if (currentKeysString !== comparisonKeysString) continue;

                // Check values
                let valuesEqual = true;
                for (let i = 0; i < currentKeys.length; i++) {
                    const key = currentKeys[i];
                    if (current[key] !== comparison[key]) {
                        valuesEqual = false;
                        break;
                    }
                }
                if (valuesEqual) duplicatesIndices.push(comparisonIndex);

            } // end for loop

        }); // end arr.forEach()

        return result;
    }

    public static trimNodeURI(uri: string) {
        let uriLableValue = '';
        if (uri.includes(this.RESOURCE)) {
            let nodeVale = uri.split(this.RESOURCE);
            let nodeLabel = nodeVale[nodeVale.length - 1].substring(1)
            uriLableValue = decodeURI(Utils.trimSpace(nodeLabel));
        } else {
            uriLableValue = Utils.lastEleInArray(Utils.trimURI(uri).split('/'));
        }
        return uriLableValue;
    }

}
