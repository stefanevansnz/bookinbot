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

  clickAddButton() {
    element(by.id('add')).click();
  }

}
