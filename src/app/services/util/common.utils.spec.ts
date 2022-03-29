import { Utils } from './common.utils';
import { FRAME_OPTIONS } from '../../models/vis.model';
import { TestConfUtil } from 'src/app/test/test-conf.util';
import { TestConfigModel } from 'src/app/test/test-config.model';

describe('Utils', () => {
  let testConf : TestConfUtil = new TestConfUtil();
  let testConfigData: TestConfigModel = testConf.getConfigData();
  let nodeResUrl = testConfigData.nodeResource;
  
  it('should be created', () => {
    const util: Utils = new Utils();
    expect(util).toBeTruthy();
  });

  it('should return lastEleInArray', () => {
    let arr = ['0', '1', '2', '3'];
    let result = Utils.lastEleInArray(arr);
    expect('3').toBe(result);
  });

  it('shold return truncateString', () => {
    let result = Utils.truncateString('abcdefghijk', 5);
    expect('a...k').toBe(result);
  });

  it('should return distinct', () => {
    let arr = [0, 0, 1, 5, 0, 2, 4, 4, 3];
    let finalResult = [0, 1, 5, 2, 4, 3];
    let result = Utils.distinct(arr);
    expect(finalResult).toEqual(result);
  });

  it('should return triplesToNodeEdgeSet', () => {
    let data = ['1|4|1|1|to|2', '1|4|1|2|to|3', '1|4|1|3|to|4'];
    let nodes = [
      { id: nodeResUrl+'Sachin_Tendulkar', label: 'Sachin Tendulkar', value: 1 },
      { id: nodeResUrl+'Mahendra_Singh_Dhoni', label: 'Mahendra Singh Dhoni', value: 1 },
      { id: '1', label: '1', value: 1 },
      { id: '2', label: '2', value: 1 },
      { id: '3', label: '3', value: 1 },
      { id: '4', label: '4', value: 1 }
    ];
    let selectedSources = [nodeResUrl+"Sachin_Tendulkar", nodeResUrl+"Mahendra_Singh_Dhoni"];
    let duplicateEdgesMap = new Map<string, number>();
    let result = Utils.triplesToNodeEdgeSet(data,duplicateEdgesMap,selectedSources);
    console.log(result.data.nodes)
    if(result.data.nodes.length==4){
      expect(result.data.nodes[0].id).toEqual('1');
      expect(result.data.nodes[1].id).toEqual('2');
      expect(result.data.nodes[2].id).toEqual('3');
      expect(result.data.nodes[3].id).toEqual('4');
    }else{
      expect(result.data.nodes[2].id).toEqual('1');
      expect(result.data.nodes[3].id).toEqual('2');
      expect(result.data.nodes[4].id).toEqual('3');
      expect(result.data.nodes[5].id).toEqual('4');
    }
 
    // let finalResult = {
    //   data: {
    //     nodes:
    //       [
    //         { id: '1', label: '1', value: 1 },
    //         { id: '2', label: '2', value: 1 },
    //         { id: '3', label: '3', value: 1 },
    //         { id: '4', label: '4', value: 1 }
    //       ],
    //     edges:
    //       [
    //         { id: 1, from: '1', to: '2', label: 'to' },
    //         { id: 2, from: '2', to: '3', label: 'to' },
    //         { id: 3, from: '3', to: '4', label: 'to' },
    //       ],
    //     paths:
    //       [
    //         {
    //           "nodes":
    //             ["1", "2", "3", "4"],
    //           "edges":
    //             [1, 2, 3]
    //         }
    //       ],
    //     connectivity: [
    //       {
    //         key: '1',
    //         value: ['1', '2', '3', '4']
    //       }
    //     ]
    //   }
    // };
    //expect(finalResult).toEqual(result);

  });

  it('should retrun deepExtend', () => {
    let _showGraphOptionsResult: FRAME_OPTIONS = {};
    let showGraphOptions = {
      showNodes: true,
      showEdges: true,
      showLabels: true
    };
    let defalutGrapOptions = {
      showFaces: false,
      showGroups: false,
      showNodes: false,
      showDegrees: false,
      showEdges: false,
      showLabels: false,
      showTitles: false
    };
    let expectedGrapOptions = {
      showFaces: false,
      showGroups: false,
      showNodes: true,
      showDegrees: false,
      showEdges: true,
      showLabels: true,
      showTitles: false
    };
    _showGraphOptionsResult = Utils.deepExtend(defalutGrapOptions, showGraphOptions);
    expect(_showGraphOptionsResult).toEqual(expectedGrapOptions);
  });

  it('#hideHeader should update _displaySwitch property.', (done)=> {
    Utils.hideHeader(true);
    expect(Utils._displaySwitch).toBeTruthy();
    done();
  });

  it('#fetchSmoothOption return obbject for curve and roundness on the basis of index 2.', (done)=> {
    let result = Utils.fetchSmoothOption(2);
    expect(result.type).toEqual('curvedCW');
    expect(result.roundness).toBe(-0.2);
    done();
  });

  it('#fetchSmoothOption return obbject for curve and roundness on the basis of index 3.', (done)=> {
    let result = Utils.fetchSmoothOption(3);
    expect(result.type).toEqual('curvedCW');
    expect(result.roundness).toBe(0.2);
    done();
  });

  it('#fetchSmoothOption return obbject for curve and roundness on the basis of index 4.', (done)=> {
    let result = Utils.fetchSmoothOption(4);
    expect(result.type).toEqual('curvedCW');
    expect(result.roundness).toBe(0);
    done();
  });

  it('#getLocaleData should return the language specific data.', (done)=> {
    let result = Utils.getLocaleData(nodeResUrl+"Indian_cricket_team_in_West_Indies_in_2011", getMaoObjForLacationData(), "English");
    expect(result[0].desc).toContain("The Indian cricket team toured West Indies");
    expect(result[0].lang).toEqual("Indian cricket team in West Indies in 2011");
    done();
  });

  it('#toMap should return the map of events.', (done)=> {
    let result = Utils.toMap({"click": "NETWORK_CLICK", "doubleClick": "NETWORK_DBLCLICK","beforeDrawing": "NETWORK_BEFORE_DRAWING"});
    expect(result.get("click")).toEqual("NETWORK_CLICK");
    done();
  });
  
  function getMaoObjForLacationData() {
    return [{"id":nodeResUrl+"Rohit_Sharma","value":{"labeledData":[{"lang":"English","value":"Rohit Sharma"}],"abstractData":[{"lang":"English","value":"Rohit Gurunath Sharma (born 30 April 1987) is an Indian international cricketer. He is a right-handed middle-order batsman and occasional right-arm off break bowler, who plays for Mumbai in domestic cricket. He also plays for Mumbai Indians in the Indian Premier League. Having started international career at the age of 20, Sharma quickly exhibited his athletic fielding and cool temperament to complement his graceful stroke play. He is pegged by many analysts to be a permanent fixture on the Indian cricket team in the next decade. His record in the recent past has been highly questionable, however, and mostly disappointing, and would a merit a drop in every International cricket team. His continued presence in the team suggest that he has the blessings of higher powers in the BCCI. His masterful stroke play and brilliant technique has drawn comparisons with the legendary sachin tendulkar."}],linkURIData : [],imageURI :[]}},{"id":nodeResUrl+"Virat_Kohli","value":{"labeledData":[{"lang":"English","value":"Virat Kohli"}],"abstractData":[{"lang":"English","value":"Virat Kohli  pronunciation (born 5 November 1988 in Delhi) is an Indian international cricketer. He is a middle order batsman, who can also open the batting. He can also bowl right arm medium pace. Kohli was the captain of the victorious Indian team at the 2008 U/19 Cricket World Cup held in Malaysia. He represents Delhi in first-class cricket and is the captain of Royal Challengers Bangalore franchise in the Indian Premier League. He also played for the West Delhi Cricket Academy. He made his One Day International (ODI) debut in 2008 and was part of the Indian team which won the 2011 World Cup. Despite being a regular in the ODI side, Kohli only played his first Test in 2011 against West Indies in Kingston. But on the disastrous 2011/12 India tour of Australia, in which India's senior batsmen struggled throughout, Kohli stood out, scoring his first Test hundred in Adelaide. Kohli was the recipient of the ICC ODI Player of the Year award in 2012."}],linkURIData : [],imageURI :[]}},{"id":nodeResUrl+"Indian_cricket_team_in_West_Indies_in_2011","value":{"labeledData":[{"lang":"English","value":"Indian cricket team in West Indies in 2011"}],"abstractData":[{"lang":"English","value":"The Indian cricket team toured West Indies from 4 June to 10 July 2011. The tour consisted of one Twenty20 (T20), five One Day Internationals (ODIs) and three Tests."}],linkURIData : [],imageURI :[]}},{"id":nodeResUrl+"West_Indian_cricket_team_in_India_in_2011%E2%80%9312","value":{"labeledData":[{"lang":"English","value":"West Indian cricket team in India in 2011–12"}],"abstractData":[{"lang":"English","value":"The West Indies cricket team toured India from 6 November to 11 December 2011. The tour consisted of three Test matches and five One Day Internationals (ODIs). On day three of the First Test, Indian batsman Sachin Tendulkar became the first cricketer to pass 15,000 runs in Test cricket."}],linkURIData : [],imageURI :[]}},{"id":nodeResUrl+"Indian_cricket_team_in_South_Africa_in_2010%E2%80%9311","value":{"labeledData":[{"lang":"English","value":"Indian cricket team in South Africa in 2010–11"}],"abstractData":[{"lang":"English","value":"The Indian cricket team toured South Africa from 16 December 2010 to 23 January 2011. The tour consisted of three Tests, one Twenty20 International (T20I) and five One Day Internationals (ODIs)."}],linkURIData : [],imageURI :[]}},{"id":nodeResUrl+"Delhi","value":{"labeledData":[{"lang":"Deutsch","value":"Delhi"},{"lang":"English","value":"Delhi"}],"abstractData":[{"lang":"Deutsch","value":"Delhi ist eine Stadt im Norden Indiens. Die Metropole Delhi schließt mit Neu-Delhi die indische Hauptstadt ein und ist unter dem Namen Nationales Hauptstadtterritorium Delhi (National Capital Territory of Delhi) als Unionsterritorium direkt der indischen Zentralregierung unterstellt. Mit 11,0 Millionen Einwohnern in der eigentlichen Stadt und 16,3 Millionen in der Agglomeration (Volkszählung 2011) ist Delhi nach Mumbai die zweitgrößte Stadt Indiens und gehört weltweit zu den Megastädten."},{"lang":"English","value":"Delhi (officially the National Capital Territory of Delhi, is a metropolitan area located on the banks of the Yamuna in northern India and includes the Indian national capital city, New Delhi. It is the second most populous metropolis in India after Mumbai and the largest city in terms of area. With a population of 22 million in 2011, the city is also the fourth most populous metropolis in the world. The NCT and its urban region have been given the special status of National Capital Region under the Constitution of India's 69th amendment act of 1991. The NCR includes the neighbouring cities of Baghpat, Gurgaon, Sonepat, Faridabad, Ghaziabad, Noida, Greater Noida and other nearby towns, and has nearly 22.2 million residents. Although technically a federally administered union territory, the political administration of the NCT of Delhi today more closely resembles that of a state of India with its own legislature, high court and an executive council of ministers headed by a Chief Minister. New Delhi is jointly administered by the federal Government of India and the local Government of Delhi, and is the capital of the NCT of Delhi. Delhi is known to have been continuously inhabited since the 6th century BC. Through most of its history, Delhi has served as a capital of various kingdoms and empires. It has been captured, sacked and rebuilt several times, particularly during the medieval period, and therefore the modern conurbation of Delhi is a cluster of a number of cities spread across the metropolitan region. Delhi is believed to have been the site of Indraprastha, the legendary capital of the Pandavas during the times of the Mahabharata. Delhi re-emerged as a major political, cultural and commercial city along the trade routes between northwest India and the Gangetic plain during the period of the Delhi sultanates. In AD 1639, the Mughal emperor Shahjahan built a new walled city in Delhi which served as the capital of the Mughal Empire from 1649 until the Rebellion of 1857. The British captured Delhi in 1857 and the city replaced Kolkata as the seat of British government in India in 1911. A new capital city, New Delhi, was built to the south of the old city during the 1920s. When the British left India in 1947, New Delhi became the national capital and seat of government. Today Delhi contains many important historical monuments, buildings and features."}],linkURIData : [],imageURI :[]}}];
  }

});
