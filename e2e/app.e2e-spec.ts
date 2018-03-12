import { AppPage } from './app.po';

describe('bookinbot App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display resource heading', () => {
    page.navigateTo();
    expect(page.getResourceHeadingText()).toEqual('Resources');
  });

  it('should open modal and save resource', () => {
    const resourceName = 'City Apartment';
    const modalHeadingName = 'Heading';

    page.navigateTo();
    page.clickAddResourceModalButton();
    expect(page.getModalTitleText()).toEqual(modalHeadingName);    
    page.enterValueToTitleField(resourceName);
    page.clickSaveResourceButton();

    page.navigateTo();
    expect(page.getResourceList().count()).toBe(1);
    expect(page.getResourceList().first().getText()).toEqual(resourceName);


  });



});
