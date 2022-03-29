import { SearchComp } from './search.po';
import { AppPage } from './app.po';
import { browser, logging } from 'protractor';

describe('workspace-project App', () => {
  let page: AppPage;
  let searchComponent: SearchComp;
  
  browser.manage().window().maximize(); //Maximize window 
  beforeEach(() => {
    page = new AppPage();
    searchComponent = new SearchComp();
  });

  it('should display page title', () => {
    page.navigateTo();
    expect(page.getPageTitle()).toEqual('RelFinder');
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
