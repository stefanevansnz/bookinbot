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

  it('should open modal when the add buttom is clicked', () => {
    page.navigateTo();
    page.clickAddButton();
    expect(page.getModalTitleText()).toEqual('Heading');    
  });



});
