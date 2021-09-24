import * as Element from '../viewpage/element.js'
import * as FirebaseController from './firebase_controller.js'
import * as Constant from '../model/constant.js'
import * as Util from '../viewpage/util.js'

export let currentUser;

export function addEventListeners() {
	Element.formSignin.addEventListener('submit',async e =>{
		e.preventDefault();
		const email = e.target.email.value;
		const password = e.target.password.value;

		if(!Constant.adminEmails.includes(email)){
			Util.info('Error', 'Only for Admins');
			return;
		}

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
		}
		else{ //signed out
			currentUser = null;
			let elements = document.getElementsByClassName('modal-pre-auth');
			for (let i = 0; i < elements.length; i++)
				elements[i].style.display = 'block'
			elements = document.getElementsByClassName('modal-post-auth');
			for (let i = 0; i < elements.length; i++)
				elements[i].style.display = 'none'
		}
	})
}