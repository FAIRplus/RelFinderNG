import { TestBed } from '@angular/core/testing';

import { ConstantsService } from './constants.service';
import { TestConfUtil } from 'src/app/test/test-conf.util';
import { TestConfigModel } from 'src/app/test/test-config.model';

describe('ConstantsService', () => {
  let service: ConstantsService;
  let testConf : TestConfUtil = new TestConfUtil();
  let testConfigData: TestConfigModel = testConf.getConfigData();
  let nodeResUrl = testConfigData.nodeResource;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConstantsService]
    });
    service = TestBed.get(ConstantsService);

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#sendMessage and #getMessage should set and return behaviour subject respectively.', (done) => {
    spyOn(service, 'sendMessage').and.callThrough();
    service.sendMessage('Test send message', 'Test');
    expect(service.sendMessage).toHaveBeenCalled();

    service.getMessage().subscribe((msg: any) => {
      expect(msg.text).toEqual('Test send message');
      expect(msg.label).toEqual('Test');
      done();
    });
  });

  it('#setNodeLocalization should set the mapNodeObj.', (done) => {
    spyOn(service, "setNodeLocalization").and.callThrough();
    service.setNodeLocalization(getMapNodeObj());
    expect(service.setNodeLocalization).toHaveBeenCalled();
    expect(service.mapNodeObj[0].id).toEqual(nodeResUrl+"Virat_Kohli");
    expect(service.mapNodeObj[0].value.labeledData[0].lang).toEqual("English");
    expect(service.mapNodeObj[0].value.labeledData[0].value).toEqual("Virat Kohli");
    done();
  });

  it('#getFormData will return querystring.' , (done) => {
    spyOn(service, "getFormData").and.callThrough();
    service.querystring = ["Testing"];
    let result = service.getFormData();
    expect(service.getFormData).toHaveBeenCalled();
    expect(result[0]).toEqual("Testing");
    done();
  });

  it('#clearMessages will clear querystring and subject.' , (done) => {
    spyOn(service, "clearMessages").and.callThrough();
    service.clearMessages();
    expect(service.clearMessages).toHaveBeenCalled();
    done();
  });

  function getMapNodeObj() {
    return [{"id":nodeResUrl+"Virat_Kohli","value":{"labeledData":[{"lang":"English","value":"Virat Kohli"}],"abstractData":[{"lang":"English","value":"Virat Kohli  pronunciation (born 5 November 1988 in Delhi) is an Indian international cricketer. He is a middle order batsman, who can also open the batting. He can also bowl right arm medium pace. Kohli was the captain of the victorious Indian team at the 2008 U/19 Cricket World Cup held in Malaysia. He represents Delhi in first-class cricket and is the captain of Royal Challengers Bangalore franchise in the Indian Premier League. He also played for the West Delhi Cricket Academy. He made his One Day International (ODI) debut in 2008 and was part of the Indian team which won the 2011 World Cup. Despite being a regular in the ODI side, Kohli only played his first Test in 2011 against West Indies in Kingston. But on the disastrous 2011/12 India tour of Australia, in which India's senior batsmen struggled throughout, Kohli stood out, scoring his first Test hundred in Adelaide. Kohli was the recipient of the ICC ODI Player of the Year award in 2012."}]}},{"id":nodeResUrl+"Rohit_Sharma","value":{"labeledData":[{"lang":"English","value":"Rohit Sharma"}],"abstractData":[{"lang":"English","value":"Rohit Gurunath Sharma (born 30 April 1987) is an Indian international cricketer. He is a right-handed middle-order batsman and occasional right-arm off break bowler, who plays for Mumbai in domestic cricket. He also plays for Mumbai Indians in the Indian Premier League. Having started international career at the age of 20, Sharma quickly exhibited his athletic fielding and cool temperament to complement his graceful stroke play. He is pegged by many analysts to be a permanent fixture on the Indian cricket team in the next decade. His record in the recent past has been highly questionable, however, and mostly disappointing, and would a merit a drop in every International cricket team. His continued presence in the team suggest that he has the blessings of higher powers in the BCCI. His masterful stroke play and brilliant technique has drawn comparisons with the legendary sachin tendulkar."}]}},{"id":nodeResUrl+"Indian_cricket_team_in_West_Indies_in_2011","value":{"labeledData":[{"lang":"English","value":"Indian cricket team in West Indies in 2011"}],"abstractData":[{"lang":"English","value":"The Indian cricket team toured West Indies from 4 June to 10 July 2011. The tour consisted of one Twenty20 (T20), five One Day Internationals (ODIs) and three Tests."}]}},{"id":nodeResUrl+"West_Indian_cricket_team_in_India_in_2011%E2%80%9312","value":{"labeledData":[{"lang":"English","value":"West Indian cricket team in India in 2011–12"}],"abstractData":[{"lang":"English","value":"The West Indies cricket team toured India from 6 November to 11 December 2011. The tour consisted of three Test matches and five One Day Internationals (ODIs). On day three of the First Test, Indian batsman Sachin Tendulkar became the first cricketer to pass 15,000 runs in Test cricket."}]}},{"id":nodeResUrl+"Indian_cricket_team_in_South_Africa_in_2010%E2%80%9311","value":{"labeledData":[{"lang":"English","value":"Indian cricket team in South Africa in 2010–11"}],"abstractData":[{"lang":"English","value":"The Indian cricket team toured South Africa from 16 December 2010 to 23 January 2011. The tour consisted of three Tests, one Twenty20 International (T20I) and five One Day Internationals (ODIs)."}]}},{"id":nodeResUrl+"Delhi","value":{"labeledData":[{"lang":"Deutsch","value":"Delhi"},{"lang":"English","value":"Delhi"}],"abstractData":[{"lang":"Deutsch","value":"Delhi ist eine Stadt im Norden Indiens. Die Metropole Delhi schließt mit Neu-Delhi die indische Hauptstadt ein und ist unter dem Namen Nationales Hauptstadtterritorium Delhi (National Capital Territory of Delhi) als Unionsterritorium direkt der indischen Zentralregierung unterstellt. Mit 11,0 Millionen Einwohnern in der eigentlichen Stadt und 16,3 Millionen in der Agglomeration (Volkszählung 2011) ist Delhi nach Mumbai die zweitgrößte Stadt Indiens und gehört weltweit zu den Megastädten."},{"lang":"English","value":"Delhi (officially the National Capital Territory of Delhi, is a metropolitan area located on the banks of the Yamuna in northern India and includes the Indian national capital city, New Delhi. It is the second most populous metropolis in India after Mumbai and the largest city in terms of area. With a population of 22 million in 2011, the city is also the fourth most populous metropolis in the world. The NCT and its urban region have been given the special status of National Capital Region under the Constitution of India's 69th amendment act of 1991. The NCR includes the neighbouring cities of Baghpat, Gurgaon, Sonepat, Faridabad, Ghaziabad, Noida, Greater Noida and other nearby towns, and has nearly 22.2 million residents. Although technically a federally administered union territory, the political administration of the NCT of Delhi today more closely resembles that of a state of India with its own legislature, high court and an executive council of ministers headed by a Chief Minister. New Delhi is jointly administered by the federal Government of India and the local Government of Delhi, and is the capital of the NCT of Delhi. Delhi is known to have been continuously inhabited since the 6th century BC. Through most of its history, Delhi has served as a capital of various kingdoms and empires. It has been captured, sacked and rebuilt several times, particularly during the medieval period, and therefore the modern conurbation of Delhi is a cluster of a number of cities spread across the metropolitan region. Delhi is believed to have been the site of Indraprastha, the legendary capital of the Pandavas during the times of the Mahabharata. Delhi re-emerged as a major political, cultural and commercial city along the trade routes between northwest India and the Gangetic plain during the period of the Delhi sultanates. In AD 1639, the Mughal emperor Shahjahan built a new walled city in Delhi which served as the capital of the Mughal Empire from 1649 until the Rebellion of 1857. The British captured Delhi in 1857 and the city replaced Kolkata as the seat of British government in India in 1911. A new capital city, New Delhi, was built to the south of the old city during the 1920s. When the British left India in 1947, New Delhi became the national capital and seat of government. Today Delhi contains many important historical monuments, buildings and features."}]}}];
  }

});
