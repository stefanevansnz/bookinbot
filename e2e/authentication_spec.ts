import { AppPage } from './app.pageobjects';

describe('website ', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should login and display heading', async function() {
    
    const emailLogin = 'test@test.com';
    const passwordLogin = 'password';
    const resourceName = 'Resources';

    page.navigateTo('/signin');

    page.enterValueToEmailField(emailLogin);
    page.enterValueToPasswordField(passwordLogin);
    page.clickSignInButton();

    expect(page.getResourceHeading()).toEqual(resourceName);

    //expect(page.getResourceList().count()).toBe(0);
    //expect(page.getResourceList().first().getText()).toEqual(resourceName);

  });



});
