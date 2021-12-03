import * as Element from './element.js'
import * as FirebaseController from '../controller/firebase_controller.js'
import * as Route from '../controller/route.js'
import * as Auth from '../controller/auth.js'
import * as Constant from '../model/constant.js'



export function addEventListeners(){
	Element.reviewPage.addEventListener('click', async () =>{
		history.pushState(null, null, Route.routePathname.PRODUCTS);
		const button = Element.reviewPage;
		const label = Util.disableButton(button)
		await review_page();
		Util.enableButton(button,label);
	})
}

export function review_page(reviews) {


	let html =`	<table class="table table-striped">
	<thead>
	  <tr>
		<th scope="col">Name</th>
		<th scope="col">Review</th>
		<th scope="col">Date</th>
		<th scope="col"></th>
		<th scope="col"></th>
	  </tr>
	</thead>
	<tbody>
  	`;

	if(Auth.currentUser){
	for(let i = 0; i < reviews.length; i++){
		html += buildReviews(reviews[i],i);

	}
	html += '</tbody></table>'
	}else{
		for(let i = 0; i < reviews.length; i++){
			html += buildReviewsNoUser(reviews[i],i);
	
		}
		html += '</tbody></table>'
	
	}


	  Element.root.innerHTML = html;

	  const deleteForm = document.getElementsByClassName('form-delete-review');
		for(let i=0; i<deleteForm.length; i++){
			deleteForm[i].addEventListener('submit', async e =>{
				e.preventDefault();
				const docId = reviews[i].docId;
				if(!window.confirm('ARE YOU SURE YOU WANT TO DELETE THIS COMMENT: "' + reviews[i].content + '"?')) return;
				document.getElementById(`review-row-${docId}`).remove();
				await FirebaseController.userDeleteComments(reviews[i].docId);
			})
		}
		const editForm = document.getElementsByClassName('form-edit-review');
		for(let i=0; i<deleteForm.length; i++){
			editForm[i].addEventListener('submit', async e =>{
				e.preventDefault();
				const docId = reviews[i].docId;
				Element.modalEditReviewBody.innerHTML = buildTextReview(reviews[i],i);
				document.getElementById('rev-'+ reviews[i].docId).value = reviews[i].content; //puts current comment into text box
				Element.modalEditReview.show();
			})
		}


function buildReviews(review, index){
	return `
	<tr id="review-row-${review.docId}">
	   <td>${review.email} </td>
	   <td>${review.content}</td>
	   <td>${review.timestamp}</td>
	   <td>
			<form method="post" class="form-delete-review ${Auth.currentUser.uid == review.uid || Constant.adminEmails.includes(Auth.currentUser.email) ? 'd-block' : 'd-none'}" >
				<input type="hidden" name="index" value="${index}">
				<button class="btn btn-outline-danger" type="submit">Delete</button>
			</form>
		</td>
		<td>
			<form method="post" class="form-edit-review ${Auth.currentUser.uid == review.uid ? 'd-block' : 'd-none'}">
			<input type="hidden" name="index" value="${index}">
			<button id="edit-button" class="btn btn-outline-info" type="submit">Edit</button>
			</form>
		</td>
		
	</tr>
	`

	
	}
	function buildReviewsNoUser(review, index){
		return `
		<tr id="review-row-${review.docId}">
		   <td>${review.email} </td>
		   <td>${review.content}</td>
		   <td>${review.timestamp}</td>			
		</tr>
		`
	
		
		}

		function buildTextReview(review, index){
			return `
			<div>
			<form method="post" class="d-inline form-edit-review">
				<div>
				<textarea id="rev-${review.docId}""></textarea>
				<input type="hidden" name="index" value="${index}">
				<br>
				<button type="submit" id="button-edit-review" class="btn btn-outline-info">Submit Review</button>
				</div>
			</form>
			</div>
			`
		}
}
