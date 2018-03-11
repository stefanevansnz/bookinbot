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
    page.navigateTo();
    page.clickAddResourceModalButton();
    expect(page.getModalTitleText()).toEqual('Heading');    
    page.enterValueToTitleField();
    page.clickSaveResourceButton();
  });



});
