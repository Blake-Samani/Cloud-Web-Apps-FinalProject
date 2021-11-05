import * as Admin from '../viewpage/admin_page.js'
import * as Product from '../viewpage/product_page.js'
import * as User from '../viewpage/user_page.js'
import * as Home from '../viewpage/home_page.js'

export const routePathname = {
	HOME: '/', //root location
	PRODUCTS: '/products',
	USERS: '/users',
	ADMIN: '/admin',
}

export const routes = [ 
	{pathname: routePathname.HOME, page: Home.home_page},
	{pathname: routePathname.ADMIN, page: Admin.admin_page},
	{pathname: routePathname.PRODUCTS, page: Product.product_page},
	{pathname: routePathname.USERS, page: User.users_page},

];

export function routing(pathname, hash){
	const route = routes.find(r => r.pathname == pathname);
	if (route) route.page();
	else routes[0].page(); //home page?
}