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

  enterValueToTitleField(resourceName: string) {
    element(by.id('title')).sendKeys(resourceName);
  }

  clickSaveResourceButton() {
    element(by.id('save-resource')).click();
  }

  getResourceList() {
    return element.all(by.css('.list-group a'));
  }


}
