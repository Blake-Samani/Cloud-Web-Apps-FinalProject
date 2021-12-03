import * as Route from './controller/route.js'
import * as Auth from './controller/auth.js'
import * as ProductPage from './viewpage/product_page.js'
import * as Home from './viewpage/home_page.js'
import * as User from './viewpage/user_page.js'
import * as Edit from './controller/edit_product.js'
import * as Cart from './viewpage/cart.js'
import * as Purchase from './viewpage/purchase_page.js'
import * as Profile from './viewpage/profile_page.js'
import * as Review from './viewpage/review_page.js'

window.onload = () => {
	const pathname = window.location.pathname;
	const hash = window.location.hash;

	Route.routing(pathname, hash);
}

window.addEventListener('popstate', e => {
	e.preventDefault();
	const pathname = e.target.location.pathname;
	const hash = e.target.location.hash;
	Route.routing(pathname, hash);
})

Auth.addEventListeners();
ProductPage.addEventListeners();
Home.addEventListeners();
User.addEventListeners();
Edit.addEventListeners();
Cart.addEventListeners();
Purchase.addEventListeners();
Profile.addEventListeners();
