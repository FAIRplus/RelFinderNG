import { SearchComp } from './search.po';
import { browser, logging, ElementArrayFinder, element, by } from 'protractor';
import { ConfigurationsPage } from './configurations.po';

describe('Left menu e2e test cases', () => {
    let searchComponent: SearchComp;
    let configuration: ConfigurationsPage;

    // browser.manage().window().maximize(); //Maximize window 
    beforeEach(() => {
        searchComponent = new SearchComp();
        configuration = new ConfigurationsPage();
    });

    it('should display search component', (done) => {
        searchComponent.checkMenuIsOpen('SEARCH');
        done();
    });

    it('provide value in search input fields', (done) => {
        browser.sleep(200);
        searchComponent.provideSearchValue('txt_0', 'virat');
        browser.sleep(1000);
        searchComponent.provideSearchValue('txt_1', 'rohit');
        browser.sleep(1000);
        searchComponent.getSearchBtn();
        expect(searchComponent.searchBtn.isEnabled()).toBe(true);
        searchComponent.hitSearchBtn();
        browser.ignoreSynchronization = true;
        expect(searchComponent.getSearchBtn()).toBeUndefined();
        browser.sleep(10 * 1000);
        done();
    });

    it('search popup should be closed', (done) => {
        searchComponent.checkMenuIsClosed();
        done();
    });

    it('open filter popup', (done) => {
        searchComponent.toggleFilterPopup();
        searchComponent.checkMenuIsOpen('FILTER');
        browser.sleep(1000);
        done();
    });

    it('check filter popup tab is visible', (done) => {
        searchComponent.isFilterPoupTabsVisible();
        done();
    });

    it('should close filter popup', (done) => {
        searchComponent.toggleFilterPopup();
        browser.sleep(2000);
        searchComponent.checkMenuIsClosed();
        done();
    });

    it('check top panel filter is visible', (done) => {
        searchComponent.isTopPanelFilterVisible();
        searchComponent.topPanelFilterAction();
        done();
    });

    it('check header text is visible', (done) => {
        searchComponent.isHeaderTextVisible();
        done();
    });

    it('#changeSource should change the selected source.', (done) => {
        configuration.changeSource('lmdb', 'settings_config');
        expect(element(by.id('source_name_0')).getText()).toEqual('Linked Movie Data Ba...');
        done();
    });

    it('#deleteSource should open the confirmation pop up to delete the source at specific index and delete it.', (done) => {
        configuration.deleteSource(1);
        browser.sleep(1000);
        expect(element(by.css(".title-text")).isDisplayed()).toBeTruthy();
        expect(element(by.id('confirmTitle')).getText()).toEqual('Delete Database Resource');
        configuration.delete('delete-btn');
        browser.sleep(1000);
        // expect(element(by.id('source_name_3')).getText()).toEqual('Test Name');
        done();
    });

    it('#editSource should open the dialog box to edit the existing source and close the dialog.', (done) => {
        configuration.editSource(0);
        browser.sleep(10000);
        // expect(element(by.css(".list-item")).isDisplayed()).toBeTruthy();
        expect(element(by.id('source_name_0')).getText()).toEqual('Linked Movie Data Ba...');
        configuration.clickById('save_source_data');
        browser.sleep(1000);
        done();
    });

    it('should open the dialog box to add new source and close the dialog.', (done) => {
        browser.sleep(1000);
        configuration.clickById('add_new_source');
        browser.sleep(1000);
        expect(element(by.id("create_source_title")).isDisplayed()).toBeTruthy();
        expect(element(by.id('create_source_title')).getText()).toEqual('Create Source');
        configuration.clickById('img_close_dialog_btn');
        browser.sleep(1000);
        done();
    });

    it('should open the dialog box to upload file and close the dialog.', (done) => {
        configuration.clickById('upload_file');
        browser.sleep(1000);
        expect(element(by.id("upload_config_file")).isDisplayed()).toBeTruthy();
        expect(element(by.id('upload_config_file')).getText()).toEqual('Upload Configuration File');
        configuration.clickById('upload_config_file_close_btn');
        browser.sleep(1000);
        done();
    });

    it('should open query tool and execute query', (done) => {
        configuration.clickById('button-autoclose-menus');
        browser.sleep(500);
        configuration.clickById('query_tool');
        browser.sleep(1000);
        expect(element(by.id('query_tool_title')).isDisplayed()).toBeTruthy();
        expect(element(by.id('query_tool_title')).getText()).toEqual('Query Selected Database');
        browser.sleep(500);
        configuration.hitQuery("select distinct ?Concept where {[] a ?Concept} LIMIT 10");
        browser.sleep(1000);
        configuration.clickById('exeQueryBtn');
        browser.sleep(4000);
        let response = element(by.tagName("p"));
        expect(response.getText()).toBeTruthy();
        browser.sleep(4000);
        configuration.clickById('closeImg');
        browser.sleep(1000);
        done();
    });

    it('should open the dialog box to add new source and fill correct values in all fields and create new source.', (done) => {
        browser.sleep(1000);
        configuration.createSourceWithCorrectValues('add_new_source');
        expect(element(by.id('source_name_3')).isDisplayed()).toBeTruthy();
        expect(element(by.id('source_name_3')).getText()).toEqual('Test Name');
        browser.sleep(1000);
        done();
    });

    it('should open the dialog box to add new source and fill empty values to mandatory fields and it should invalid the form.', (done) => {
        browser.sleep(1000);
        configuration.createSourceWithEmptyValues('add_new_source');
        expect(element(by.id("create_source_title")).isDisplayed()).toBeTruthy();
        expect(element(by.id('create_source_title')).getText()).toEqual('Create Source');
        expect(element(by.className('text-danger')).getAttribute("innerHTML")).toEqual('Enter Name')
        element(by.id('source_form')).getAttribute('class').then((classes) => {
            expect(classes).toContain('ng-invalid');
            configuration.clickById('img_close_dialog_btn');
            done();
        });
    });

    it('should open the dialog box to add new source and fill correct values only in mandatory fields and create new source.', (done) => {
        browser.sleep(1000);
        configuration.createSourceWithMandatoryValues('add_new_source');
        expect(element(by.id('source_name_2')).isDisplayed()).toBeTruthy();
        expect(element(by.id('source_name_2')).getText()).toEqual('Semantic Web Dog Foo...');
        browser.sleep(1000);
        done();
    });

    it('should open the dialog box to add new source and fill existing id and it should invalid the form.', (done) => {
        browser.sleep(1000);
        configuration.createSourceWithCorrectValues('add_new_source');
        expect(element(by.id("create_source_title")).isDisplayed()).toBeTruthy();
        expect(element(by.id('create_source_title')).getText()).toEqual('Create Source');
        expect(element(by.className('text-danger')).getAttribute("innerHTML")).toContain('Sorry, ID already exists with this name.')
        element(by.id('source_form')).getAttribute('class').then((classes) => {
            expect(classes).toContain('ng-invalid');
            configuration.clickById('img_close_dialog_btn');
            done();
        });
    });

    it('should open the dialog box to edit the existing source and replace the existing values and save it.', (done) => {
        configuration.editSourceWithTwoValues(1);
        expect(element(by.id("source_name_1")).isDisplayed()).toBeTruthy();
        expect(element(by.id('source_name_1')).getText()).toEqual('Test Name_Edited');
        done();
    });

    it('should open the dialog box to edit the existing source and ID field should be disabled.', (done) => {
        configuration.editSource(1);
        browser.sleep(1000);
        expect(element(by.css(".db-text")).isDisplayed()).toBeTruthy();
        expect(element(by.id('source_id')).getAttribute('disabled')).toEqual('true');
        configuration.clickById('img_close_dialog_btn');
        done();
    });

    it('should open and close share URL popup', (done) => {
        let ele = element(by.id('urlMenu'));
        expect(ele.getAttribute('class')).not.toContain('menu-disabled');
        ele.click();
        browser.sleep(1500);
        expect(element(by.id("shareUrlHeading")).isDisplayed()).toBeTruthy();
        element(by.className('btn btn-link copy-btn')).click();
        expect(element(by.className("success-info")).getText()).toEqual('URL copied to clipboard successfully');
        configuration.clickById('closeShareURL');
        done();
    });

    it('should open and close Release Version popup', (done) => {
        let ele = element(by.id('releaseMenu'));
        expect(ele.isDisplayed()).toBeTruthy();
        ele.click();
        browser.sleep(1000);
        expect(element(by.id("releaseInfoHeading")).isDisplayed()).toBeTruthy();
        element(by.id('relcloseBtn')).click();
        done();
    });

    it('should click on graph node', (done) => {
        // let canvasEle = element(by.tagName('canvas'));
        // let canvasWidth = 0;
        // let canvasHeight = 0;
        // /* canvasEle.getAttribute('width').then(function(val) {
        //      canvasWidth = val;
        //  });
        //  canvasEle.getAttribute('height').then(function(val) {
        //      canvasHeight = val;
        //  });
        //  */
        // canvasEle.getSize().then(function (eleObj) {
        //     canvasWidth = eleObj.width;
        //     canvasHeight = eleObj.height;
        //     let nodeIds = 2; // number of search inputs
        //     let ratio = 1 - 1 / (nodeIds * nodeIds);
        //     let angle = Math.PI;
        //     let scopeX = ratio * canvasWidth / 2;
        //     let scopeY = ratio * canvasHeight / 2;
        //     let delta = 2 * Math.PI / nodeIds;
        //     var xAxis = scopeX * Math.cos(angle);
        //     var yAxis = scopeY * Math.sin(angle);
        //     browser.sleep(1000);
        //     expect(xAxis).toBe(200);
        //     expect(yAxis).toBe(700);
        //     browser.driver.actions().
        //         mouseMove({ x: -453.375, y: 2.0665914735611585e-14 }).
        //         click().
        //         perform();
        // });
        // browser.sleep(5000);
        done();
    });

    afterEach(async () => {
        // Assert that there are no errors emitted from the browser
        const logs = await browser.manage().logs().get(logging.Type.BROWSER);
        expect(logs).not.toContain(jasmine.objectContaining({
            level: logging.Level.INFO,
        } as logging.Entry));
    });
});