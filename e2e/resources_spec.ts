import { AppPage } from './app.pageobjects';

describe('website ', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });


  it('should open modal and save resource', () => {
    const resourceName = 'Apartment';
    const modalHeadingName = 'Heading';

    page.clickAddResourceModalButton();
    expect(page.getModalTitleText()).toEqual(modalHeadingName);    
    page.enterValueToTitleField(resourceName);
    page.clickSaveResourceButton();

    //page.navigateTo('/');
    expect(page.getResourceList().count()).toBeGreaterThan(0);
    expect(page.getResourceList().first().getText()).toEqual(resourceName);
  });

});
