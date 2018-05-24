import { browser, by, element, Browser } from 'protractor';
require('./waitReady.js');

export class AppPage {

  navigateTo(url: string) {
    return browser.get(url);
  }

  waitForId(id: string) {
    var dialog = element(by.id(id));
    expect(dialog.waitReady()).toBeTruthy();
  }

  waitForClass(className: string) {
    var dialog = element(by.className(className));
    expect(dialog.waitReady()).toBeTruthy();
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

  clickDeleteResourceButton() {
    element(by.id('delete-resource')).click();
    // wait for modal to open
  }

  clickCancelResourceButton() {
    element(by.id('cancel-resource')).click();    
  }

  clickFirstEditResourceButton() {
    console.log('click first button');
    element.all(by.css('.list-group li button')).first().click();          
  }


  /*
  async clickEditResourceButton(button) {
    //console.log(innerElement);
    await element(button).click();    
    //await element(by.xpath('/button.edit-resource[' + index + ']')).click();
  }
  */

  getModalTitleText() {
    return element(by.css('div.modal-header h4')).getText();
  }

  getResourceHeading() {
    return element(by.css('div#resources h1')).getText();
  }

  getResourceList() {
    return element.all(by.css('ul.list-group li'));
  }


}
