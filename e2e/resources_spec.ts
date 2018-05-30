import { AppPage } from './app.pageobjects';

describe('website ', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should edit and delete all current resources', () => {
    const modalHeadingName = 'Edit Resource';

    let resources = page.getResourceList();
    resources.each(function(element, index) {
      page.clickFirstEditResourceButton();   
      page.waitForClass('modal-dialog');      
      expect(page.getModalTitleText()).toEqual(modalHeadingName); 
      page.clickDeleteResourceButton();
      page.waitForId('resources');

    });

  });


  it('should open modal and save resource', () => {
    const resourceName = 'Apartment';
    const modalHeadingName = 'Add Resource';

    page.clickAddResourceModalButton();
    page.waitForClass('modal-dialog');
    expect(page.getModalTitleText()).toEqual(modalHeadingName);    
    page.enterValueToTitleField(resourceName);
    page.clickSaveResourceButton();
    page.waitForId('resources');
    //page.waitForClass('list-group');
  
    let resources = page.getResourceList();

    resources.count().then(function(count) {
      expect(count).toBeGreaterThan(0);
    });
    
    //expect(resources.count()).toBeGreaterThan(0);
    //expect(resources.first().getText()).toContain(resourceName);
  });


});
