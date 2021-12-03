import * as FirebaseController from './firebase_controller.js'
import * as Util from  '../viewpage/util.js'
import * as Constant from '../model/constant.js'
import * as Element from '../viewpage/element.js'
import { Comment } from '../model/comment.js'

export function addEventListeners(){
	Element.formEditReview.form.addEventListener('submit', e =>{
		e.preventDefault();

		const c = new Comment({
			uid: e.target.uid.value,
			email: e.target.email.value,
			content: e.target.content.value,
			timestamp: new Date(Date.now()).toString(),
			productId: e.target.productId,
		})
	})
	c.docId = e.target.docId.value;


	await FirebaseController.updateReview(c);
}


export async function edit_review(docId){
let review;
try {
	review = await FirebaseController.getReviewById(docId);
} catch (e) {
	if (Constant.DEV) console.log(e);
}

}