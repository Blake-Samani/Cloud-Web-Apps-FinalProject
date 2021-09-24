import * as Route from './controller/route.js'
import * as Auth from './controller/auth.js'
import * as ProductPage from './viewpage/product_page.js'
import * as Home from './viewpage/home_page.js'
import * as User from './viewpage/user_page.js'

window.onload = () => {
	const pathname = window.location.pathname;
	const hash = window.location.hash;

	Route.routing(pathname, hash);
}

Auth.addEventListeners();
ProductPage.addEventListeners();
Home.addEventListeners();
User.addEventListeners();