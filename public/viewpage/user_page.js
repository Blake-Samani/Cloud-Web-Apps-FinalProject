import * as Element from './element.js'
import * as Route from '../controller/route.js'

export function addEventListeners() {
	Element.menuUsers.addEventListener('click', () => {
		history.pushState(null, null, Route.routePathname.USERS)
		users_page();
	})
}

export function users_page() {
	Element.root.innerHTML = `
		<h1>Welcome to User management page </h1>
	`;
}