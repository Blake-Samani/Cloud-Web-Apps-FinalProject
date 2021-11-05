import * as Element from '../viewpage/element.js'
import * as FirebaseController from './firebase_controller.js'
import * as Constant from '../model/constant.js'
import * as Util from '../viewpage/util.js'
import * as Route from './route.js'
import { home_page } from '../viewpage/home_page.js'

export let currentUser;

export function addEventListeners() {
	Element.formSignin.addEventListener('submit',async e =>{
		e.preventDefault();
		const email = e.target.email.value;
		const password = e.target.password.value;

		// if(!Constant.adminEmails.includes(email)){
		// 	Util.info('Error', 'Only for Admins');
		// 	return;
		// }

		try {
			await FirebaseController.signIn(email, password)
			Element.modalSignin.hide()
		} catch (e) {
			if (Constant.DEV) console.log(e);
			Util.info('Sign in Error', JSON.stringify(e), Element.modalSignin)
		}
	})

	Element.menuSignout.addEventListener('click', async () =>{
		try {
			await FirebaseController.signOut();
		} catch (e) {
			if (Constant.DEV) console.log(e);
			Util.info('Sign Out Error: Try again', JSON.stringify(e))
		}
	})

	firebase.auth().onAuthStateChanged ( user =>{ //to change states upon sign in
		if(user && Constant.adminEmails.includes(user.email)){ //signed in
			currentUser = user;
			let elements = document.getElementsByClassName('modal-pre-auth');
			for (let i = 0; i < elements.length; i++)
				elements[i].style.display = 'none' //do not display
			elements = document.getElementsByClassName('modal-post-auth');
			for (let i = 0; i < elements.length; i++)
				elements[i].style.display = 'block' //display

			const pathname = window.location.pathname;
			const hash = window.location.hash;
			Route.routing(pathname, hash);
		}
		else if(user){
			currentUser = user;
			let elements = document.getElementsByClassName('modal-pre-auth');
			for (let i = 0; i < elements.length; i++)
				elements[i].style.display = 'none' //do not display
			elements = document.getElementsByClassName('modal-post-auth');
			for (let i = 0; i < elements.length; i++)
				elements[i].style.display = 'block' //display

			let elementsZero = document.getElementById('menu-home');
			elementsZero.style.display = 'block'
			elementsZero = document.getElementById('menu-users');
			elementsZero.style.display = 'none'
			elementsZero = document.getElementById('menu-admin');
			elementsZero.style.display = 'none'
			elementsZero = document.getElementById('menu-products');
			elementsZero.style.display = 'none'

			
			// let elements = document.getElementsByClassName('modal-pre-auth');
			// for (let i = 0; i < elements.length; i++)
			// 	elements[i].style.display = 'none' //do not display
			// elements = document.getElementsByClassName('modal-post-auth');
			// for (let i = 0; i < elements.length; i++)
			// 	elements[i].style.display = 'block' //display

			const pathname = window.location.pathname;
			const hash = window.location.hash;
			Route.routing(pathname, hash);
			
		// if(!Constant.adminEmails.includes(user.email)){
		
		// 	return;
		// }
		}
		else{ //signed out
			currentUser = null;
			let elements = document.getElementsByClassName('modal-pre-auth');
			for (let i = 0; i < elements.length; i++)
				elements[i].style.display = 'block'
			elements = document.getElementsByClassName('modal-post-auth');
			for (let i = 0; i < elements.length; i++)
				elements[i].style.display = 'none'

			history.pushState(null, null, Route.routePathname.HOME);
		}
	})
}