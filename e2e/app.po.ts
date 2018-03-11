import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get('/');
  }

  getResourceHeadingText() {
    return element(by.css('h2')).getText();
  }

  getModalTitleText() {
    return element(by.css('div.modal-header h4')).getText();
  }

  clickAddResourceModalButton() {
    element(by.id('add-resource')).click();
  }

  enterValueToTitleField() {
    element(by.id('title')).sendKeys('Sydney Apartment');
  }

  clickSaveResourceButton() {
    element(by.id('save-resource')).click();
  }


}
