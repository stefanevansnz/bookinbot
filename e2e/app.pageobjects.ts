import { browser, by, element, Browser } from 'protractor';

export class AppPage {

  navigateTo(url: string) {
    return browser.get(url);
  }

  enterValueToTitleField(resourceName: string) {
    element(by.id('title')).sendKeys(resourceName);
  }

  enterValueToEmailField(email: string) {
    element(by.id('email')).sendKeys(email);
  }

  enterValueToPasswordField(password: string) {
    element(by.id('password')).sendKeys(password);
  }


  clickSignInButton() {
    element(by.id('signin')).click();
  }

  clickAddResourceModalButton() {
    element(by.id('add-resource')).click();
  }

  clickSaveResourceButton() {
    element(by.id('save-resource')).click();
  }

  /*
  getResourceHeadingText() {
    return element(by.css('h2')).getText();
  }
  */

  getModalTitleText() {
    return element(by.css('div.modal-header h4')).getText();
  }

  getResourceHeading() {
    return element(by.css('div#resources h1')).getText();
  }

  getResourceList() {
    return element.all(by.css('.list-group a'));
  }


}
