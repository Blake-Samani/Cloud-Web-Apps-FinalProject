import * as Element from './element.js'
import * as Route from '../controller/route.js'
import * as FirebaseController from '../controller/firebase_controller.js'
import * as Constant from '../model/constant.js'
import * as Util from './util.js'
import * as Auth from '../controller/auth.js'
import { ShoppingCart } from '../model/ShoppingCart.js'
import { Comment } from '../model/comment.js'


export function addEventListeners(){

	Element.menuHome.addEventListener('click', async () =>{
		history.pushState(null, null, Route.routePathname.HOME);
		const label = Util.disableButton(Element.menuHome);
		await home_page();
		Util.enableButton(Element.menuHome, label);
	})
}
export let cart;

export async function home_page(){

	let html = '<h1>Enjoy Shopping!</h1>'

	let products;
	try {
		products = await FirebaseController.getProductListNoCloud();
		if (cart){
			cart.items.forEach(item => {
				const product = products.find(p => item.docId == p.docId)
				product.qty = item.qty;
			})
		}
	} catch (e) {
		if (Constant.DEV) console.log(e);
		Util.info('Cannot get product info', JSON.stringify(e));
	}

	
	// if(Auth){
	// let history;
	// history = await FirebaseController.getPurchaseHistory(Auth.currentUser.uid);
	// let hasPurchased = false;
	// }
	for (let i = 0; i < products.length; i++){
		html += buildProductView(products[i], i);
	}
	Element.root.innerHTML = html;


	const revForms = document.getElementsByClassName('form-write-review');
	for (let i = 0; i < revForms.length; i++){
		revForms[i].addEventListener('submit', async e =>{
			e.preventDefault();
			const p = products[e.target.index.value];
			const content = document.getElementById('rev-' + p.docId).value;
			const uid = Auth.currentUser.uid;
      		const email = Auth.currentUser.email;
        	const timestamp = Date.now();
			const productId = p.docId;
			// const docId = p.docId;

			const comment = new Comment({
				uid, email, timestamp, content, productId
			});


			const button = document.getElementById('button-add-new-review');
        	const label = Util.disableButton(button)

			try {
            	const docId = await FirebaseController.addComment(comment);
            	comment.docId = docId;
        	} catch (e) {
            	if (Constant.DEV) console.log(e)
            	Util.info('Error', JSON.stringify(e))
        	}

			document.getElementById('rev-' + p.docId).value = "" //clear the text area
			Util.enableButton(button, label);
		})
	}

	// let commentList;
	// try {
	// 	commentList = await FirebaseController.getCommentList();
	// 	console.log(commentList);
	// } catch (e) {
	// 	if (Constant.DEV) console.log(e);
    //     Util.info('Error to get comment list', JSON.stringify(e));
    //     return;

	// }
	

	const readForms = document.getElementsByClassName('form-read-review');
	for (let i = 0; i < revForms.length; i++){
		readForms[i].addEventListener('submit', async e =>{
			e.preventDefault();
			const p = products[e.target.index.value];
			Element.modalReviewTitle.innerHTML = `${p.name}`;
			Element.modalReviewBody.innerHTML = await buildreviewView(p);
			Element.modalReview.show();
		})
	}


	const decForms = document.getElementsByClassName('form-dec-qty');
	for (let i =0; i <decForms.length; i++){
		decForms[i].addEventListener('submit', e => {
			e.preventDefault();
			const p = products[e.target.index.value];
			//dec p to shopping cart
			cart.removeItem(p);
			
			document.getElementById('qty-' + p.docId).innerHTML = 
				(p.qty == null || p.qty == 0) ? 'Add' : p.qty;
			Element.shoppingCartCount.innerHTML = cart.getTotalQty();
		})
	}

	const incForms = document.getElementsByClassName('form-inc-qty');
	for (let i =0; i <decForms.length; i++){
		incForms[i].addEventListener('submit', e => {
			e.preventDefault();
			const p = products[e.target.index.value];
			//add p to shopping cart
			cart.addItem(p);
			document.getElementById('qty-' + p.docId).innerHTML = p.qty;
			Element.shoppingCartCount.innerHTML = cart.getTotalQty();

		})
	}

}

function buildProductView(product, index){
	return `
	<div  class="card" style="width: 18rem; display: inline-block;">
  		<img src="${product.imageURL}" class="card-img-top">
  		<div id="card-${product.docId}" class="card-body">
   			<h5 class="card-title">${product.name}</h5>
   			<p class="card-text">
			   ${Util.currency(product.price)} <br>
			   ${product.summary}
			</p>
			<div class="container pt-3 bg-light ${Auth.currentUser ? 'd-block' : 'd-none'}">
			<form method="post" class="d-inline form-dec-qty">
				<input type="hidden" name="index" value ="${index}">
				<button class="btn btn-outline-danger" type="submit">&minus;</button>
			</form>
			<div id="qty-${product.docId}" class="container round text-center text-white bg-primary d-inline-block w-50">
				${product.qty == null || product.qty == 0 ? 'Add' : product.qty}
			</div>
		
			<form method="post" class="d-inline form-inc-qty">
				<input type="hidden" name="index" value ="${index}">
				<button class="btn btn-outline-primary" type="submit">&plus;</button>
			</form>
			<form method="post" class="d-inline form-write-review">
				<div>
				<textarea id="rev-${product.docId}" placeholder="Write a review"></textarea>
				<input type="hidden" name="index" value="${index}">
				<br>
				<button type="submit" id="button-add-new-review" class="btn btn-outline-info">Submit Review</button>
				</div>
			</form>
				
			<form method="post" class="d-inline form-read-review">
				<div>
				<input type="hidden" name="index" value ="${index}">
				<button type="submit" id="button-rev-${product.docId}" class="btn btn-outline-info">Read Reviews</button>
				</div>
			</form>

		</div>
  </div>
</div>
	`;
}

export function initShoppingCart() {

	const cartString = window.localStorage.getItem('cart-' + Auth.currentUser.uid);
	cart = ShoppingCart.parse(cartString);
	if (!cart || !cart.isValid() || cart.uid != Auth.currentUser.uid){
		window.localStorage.removeItem('cart-' + Auth.currentUser.uid);
		cart = new ShoppingCart(Auth.currentUser.uid)
	}

	Element.shoppingCartCount.innerHTML = cart.getTotalQty();
}

async function buildreviewView (product){ //builds our review modal
	let html = `
	<table class="table">
	<thead>
		<tr>
			<th scope="col">Email</th>
			<th scope="col">Review</th>
		<tr>
	</thead>
	<tbody>
	`
	let comments;
	comments = await FirebaseController.getCommentListIds(product.docId); //retreive only comments pertaining to our product
	if(comments){
	for(let i = 0; i < comments.length; i++){
		let email = comments[i].email;
		let contents = comments[i].content;
		html +=	`
		<tr>
			<td>${email}</td>
			<td>${contents}</td>
		</tr>
		`

		}
	}else{
		html +=	`
		<tr>
			<td>${''}</td>
			<td>${''}</td>
		</tr>
		`

	}
	html += '</tbody></table>';

	return html;
}