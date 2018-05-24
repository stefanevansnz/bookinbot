import { AppPage } from './app.pageobjects';

describe('website ', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should remove current resources', () => {
    const modalHeadingName = 'Heading';
    //const resourceName = 'Cancel';
        
    let resources = page.getResourceList();

    resources.each(function(element, index) {
      page.clickFirstEditResourceButton();   
      page.waitForClass('modal-dialog');
      
      expect(page.getModalTitleText()).toEqual(modalHeadingName); 

      page.clickDeleteResourceButton();
      page.waitForId('add-resource');

    });

  });


  it('should open modal and save resource', () => {
    const resourceName = 'Apartment';
    const modalHeadingName = 'Heading';

    page.clickAddResourceModalButton();
    page.waitForClass('modal-dialog');

    expect(page.getModalTitleText()).toEqual(modalHeadingName);    
    page.enterValueToTitleField(resourceName);

    page.clickSaveResourceButton();
    page.waitForId('add-resource');
  
    expect(page.getResourceList().count()).toBeGreaterThan(0);
    //expect(page.getResourceList().first().getText()).toEqual(resourceName);
  });


});
