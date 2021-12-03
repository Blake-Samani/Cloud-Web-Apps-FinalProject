import * as Element from './element.js'
import * as Route from '../controller/route.js'
import * as FirebaseController from '../controller/firebase_controller.js'
import * as Constant from '../model/constant.js'
import * as Util from './util.js'
import * as Auth from '../controller/auth.js'
import { ShoppingCart } from '../model/ShoppingCart.js'
import { Comment } from '../model/comment.js'
import * as Review from '../viewpage/review_page.js'


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

	if(Auth.currentUser){
	
		for (let i = 0; i < products.length; i++){ //for each product
			html += buildProductView(products[i], i);
			html += buildReviewBox(products[i],i)
			html += `</div>`
	}
	}else{
		for (let i = 0; i < products.length; i++){ //for each product
			html += buildProductView(products[i], i);
			html += `</div>`
		}
	}

	Element.root.innerHTML = html;

	if(Auth.currentUser){
	let history;
	let hasPurchased = false;
	history = await FirebaseController.getPurchaseHistory(Auth.currentUser.uid);
	const revForms = document.getElementsByClassName('form-write-review');
	for (let i = 0; i < revForms.length; i++){
		revForms[i].addEventListener('submit', async e =>{
			e.preventDefault();
			hasPurchased = false;
			for(let k = 0; k < history.length; k++){//for each object in history array
				for(let j = 0; j < history[k].items.length; j++){ //for each item at history[k]
					if(products[i].docId == history[k].items[j].docId){
						hasPurchased = true;
					}
				}
			}
			if(hasPurchased == true){
				const p = products[e.target.index.value];
				const content = document.getElementById('rev-' + p.docId).value;

					if(content){ //if the comment box is not blank
					const uid = Auth.currentUser.uid;
					const email = Auth.currentUser.email;
					const timestamp = new Date(Date.now()).toString();
					const productId = p.docId;
		
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
					}else{
						Element.modalErrorReview.show();
					}
			}else{
				Element.modalError.show();
			}

		})
	}
}

	let reviews;
	const readForms = document.getElementsByClassName('form-read-review');
	for (let i = 0; i < readForms.length; i++){
		readForms[i].addEventListener('submit', async e =>{
			e.preventDefault();
			reviews = await FirebaseController.getCommentListIds(products[i].docId); //retreive only comments pertaining to our product
			
			Review.review_page(reviews);
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
		</div>
		<form method="post" class="d-inline form-read-review">
			<div>
			<input type="hidden" name="index" value ="${index}">
			<button type="submit" id="button-review" class="btn btn-outline-info">Read Reviews</button>
			</div>
		</form>

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

function buildReviewBox(product, index){
	return `
	<div>
	<form method="post" class="d-inline form-write-review">
		<div>
		<textarea id="rev-${product.docId}" placeholder="Write a review"></textarea>
		<input type="hidden" name="index" value="${index}">
		<br>
		<button type="submit" id="button-add-new-review" class="btn btn-outline-info">Submit Review</button>
		</div>
	</form>
	</div>
	`
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
			<td>
			<form class="form-delete-comment" method="post" style="display: inline-block;">
				<input type="hidden" name="index" value ="${i}">
				<button type="submit" class="btn btn-outline-danger">Delete</button>
			</form>
			</td>
			
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

	const delForms = document.getElementsByClassName('form-delete-comment');
	for(let i=0; i<delForms.length;i++){
		delForms[i].addEventListener('submit', async () =>{
			e.preventDefault();
			console.log(i);

		})
	}
	return html;
}