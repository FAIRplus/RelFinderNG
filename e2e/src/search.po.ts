import { browser, by, element, ElementArrayFinder, ElementFinder } from 'protractor';
import { protractor } from 'protractor/built/ptor';

export class SearchComp {
    searchBtn: any;

    checkMenuIsOpen(menu: string) {
        let sampleElements: ElementArrayFinder = element(by.className('nav navbar-nav')).all(by.className('tab-active'));
        sampleElements.then(() => {
            sampleElements.getText().then((text) => {
                expect(text).toContain(menu);
            })
        })
    }

    checkMenuIsClosed() {
        let sampleElements: ElementArrayFinder = element(by.className('nav navbar-nav')).all(by.className('tab-active'));
        sampleElements.then(() => {
            sampleElements.getText().then((text) => {
                expect(text).toEqual([]);
            })
        })
    }

    provideSearchValue(index: string, value: string) {
        let inputText = element(by.id(index));
        inputText.sendKeys(value);
        browser.sleep(3500);
        // browser.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
        browser.actions().sendKeys(protractor.Key.ENTER).perform();
    }

    hitSearchBtn() {
        this.getSearchBtn();
        this.searchBtn.isEnabled().then(() => {
            this.searchBtn.click();
        });
    }

    getSearchBtn() {
        this.searchBtn = element(by.id('searchBtn'));
    }

    toggleFilterPopup() {
        let config = element(by.id('filterMenu'));
        config.click();
    }

    isFilterPoupTabsVisible() {
        let ele = element(by.tagName('tabset'));
        this.checkElement(ele, 'Filter popup');
    }

    isTopPanelFilterVisible() {
        let ele = element(by.id('filterParent'));
        this.checkElement(ele, 'Top panel filter');
    }

    isHeaderTextVisible() {
        let ele = element(by.id('headerTxt'));
        this.checkElement(ele, 'Header texts');
    }

    checkElement(ele: ElementFinder, info: string) {
        let until = protractor.ExpectedConditions;
        browser.wait(until.presenceOf(ele), 16 * 1000, info + ' is taking too long to appear in the DOM');
        expect(ele).toBeTruthy();
    }

    switchFilterTab() {
        let ele = element(by.id('tab_3'));
        ele.click();
    }

    topPanelFilterAction() {
        browser.sleep(2000);
        let selectEle = element(by.id('filtersSelection'));
        selectEle.click();
        browser.sleep(2000);
        browser.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
        browser.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
        browser.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
        browser.actions().sendKeys(protractor.Key.ENTER).perform();
    }
}