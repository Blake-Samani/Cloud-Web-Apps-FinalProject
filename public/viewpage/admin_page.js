import * as Element from './element.js'
import * as Route from '../controller/route.js'
import * as Auth from '../controller/auth.js'

export function addEventListeners() {
	Element.menuAdmin.addEventListener('click', () => {
		history.pushState(null, null, Route.routePathname.ADMIN)
		admin_page();
	})
}

export function admin_page() {
	if(!Auth.currentUser) return;

	Element.root.innerHTML = `
		<h1>Welcome to Admin page </h1>
	`;
}