import { browser, element, By, by, ElementFinder } from 'protractor';
import { protractor } from 'protractor/built/ptor';

export class ConfigurationsPage {

    navigateTo() {
        return browser.get(browser.baseUrl) as Promise<any>;
    }

    changeSource(sourceId: string, boxId: string) {
        element(by.id(boxId)).click();
        element(by.id(sourceId)).click();
        browser.sleep(1000);
    }

    deleteSource(index: number) {
        //element(by.id(boxId)).click();
        element(by.id('dropdown-autoclose-' + index)).click();
        browser.sleep(1000);
        element(by.id('delete_source_' + index)).click();
        // browser.actions().mouseMove(element(by.id('delete_source_'+ index))).click().perform();
        //element(by.id(boxId)).click();
    }

    delete(className: string) {
        element(by.className(className)).click();
    }

    editSource(index: number) {
        element(by.id('dropdown-autoclose-' + index)).click();
        browser.sleep(1000);
        element(by.id('edit_source_' + index)).click();
    }

    clickById(dialogId: string) {
        element(by.id(dialogId)).click();
    }

    createSourceWithCorrectValues(dialogId: string) {
        this.clickById(dialogId);
        this.inputValueToFormField('source_name', 'Test Name');
        this.inputValueToFormField('source_id', 'TestId');
        this.inputValueToFormField('source_description', 'Test Description');
        this.inputValueToFormField('source_endpointUri', 'Test endpoint URI');
        this.inputValueToFormField('source_defaultGraphUri', 'Test default URI');
        this.inputValueToFormField('source_maxRelationPath', 5);
        this.inputValueToFormField('source_autocompleUris', 'Test autocomplete URI');
        this.inputValueToFormField('source_autocompleteLanguage', 'en');
        this.inputValueToFormField('source_ignoredPropsList', 'Test ignored properties');
        this.inputValueToFormField('source_imageUris', 'Test image URI');
        this.inputValueToFormField('source_abstractUris', 'Test abtract URI');
        this.inputValueToFormField('source_linkUris', 'Test link URI');
        // Submit form
        this.clickById('save_source_data');
        browser.sleep(1000);

    }

    createSourceWithMandatoryValues(dialogId: string) {
        this.clickById(dialogId);
        this.inputValueToFormField('source_name', 'Test Name_next');
        this.inputValueToFormField('source_id', 'TestId_next');
        this.inputValueToFormField('source_endpointUri', 'Test endpoint URI_next');
        this.inputValueToFormField('source_maxRelationPath', 5);
        // Submit form
        this.clickById('save_source_data');
        browser.sleep(1000);
    }

    createSourceWithEmptyValues(dialogId: string) {
        this.clickById(dialogId);
        this.inputValueToFormField('source_name', '');
        this.inputValueToFormField('source_id', 'id');
        this.inputValueToFormField('source_description', 'Test Description');
        this.inputValueToFormField('source_endpointUri', 'Test endpoint URI');
        this.inputValueToFormField('source_defaultGraphUri', 'Test default URI');
        this.inputValueToFormField('source_maxRelationPath', 5);
        this.inputValueToFormField('source_autocompleUris', 'Test autocomplete URI');
        this.inputValueToFormField('source_autocompleteLanguage', 'en');
        this.inputValueToFormField('source_ignoredPropsList', 'Test ignored properties');
        this.inputValueToFormField('source_imageUris', 'Test image URI');
        this.inputValueToFormField('source_abstractUris', 'Test abtract URI');
        this.inputValueToFormField('source_linkUris', 'Test link URI');
        // Submit form
        this.clickById('save_source_data');
        browser.sleep(1000);

    }

    inputValueToFormField(inputFieldId: string, value: any) {
        let inputText = element(by.id(inputFieldId));
        if(inputFieldId !== 'source_abstractUris')
            browser.actions().mouseMove(inputText).perform();
        browser.sleep(500);
        if (value === 5 || value === 'en') // TO replace override the existing value otherwise value is appending.
            inputText.sendKeys('', protractor.Key.CONTROL, "a", protractor.Key.NULL, value);
        else
            inputText.sendKeys(value);
        browser.sleep(500);
    }

    moveToNextElementsByName(inputFieldId: string) {
        let inputText = element(by.id(inputFieldId));
        browser.actions().mouseMove(inputText).perform();
    }

    editSourceWithTwoValues(index: number) {
        this.editSource(index);
        this.editValueToFormField('source_name', 'Test Name_Edited');
        this.moveToNextElementsByName('source_endpointUri');
        this.editValueToFormField('source_endpointUri', 'Test endpoint URI_Edited');
        this.editValueToFormField('source_maxRelationPath', 5);
        // Submit form
        this.clickById('save_source_data');
        browser.sleep(1000);
    }

    editSourceId(index: number) {
        this.editSource(index);
        this.editValueToFormField('source_id', 'Id_Edited');
        // Submit form
        this.clickById('save_source_data');
        browser.sleep(1000);
    }

    editValueToFormField(inputFieldId: string, value: any) {
        let inputText = element(by.id(inputFieldId));
        browser.actions().mouseMove(inputText).perform();
        browser.sleep(500);
        inputText.sendKeys('', protractor.Key.CONTROL, "a", protractor.Key.NULL, value);
        browser.sleep(500);
    }

    hitQuery(query: string) {
        browser.sleep(200);
        let ele = element(by.className("note-editable panel-body sub-panel"));
        ele.click();
        ele.sendKeys(query);
    }
}