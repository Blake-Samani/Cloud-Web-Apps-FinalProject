import * as Constant from '../model/constant.js'
import { Product } from '../model/product.js';

export async function signIn(email, password){
	await firebase.auth().signInWithEmailAndPassword(email, password);
}

export async function signOut(){
	await firebase.auth().signOut();
}
const cf_addProduct = firebase.functions().httpsCallable('cf_addProduct')
export async function addProduct(product){
	await cf_addProduct(product);
}

export async function uploadImage(imageFile, imageName){
	if(!imageName)
		imageName = Date.now() + imageFile.name;

	const ref = firebase.storage().ref()
		.child(Constant.storageFolderNames.PRODUCT_IMAGES + imageName);
	const taskSnapShot = await ref.put(imageFile);
	const imageURL = await taskSnapShot.ref.getDownloadURL();
	return {imageName, imageURL};
}
const cf_getProductList = firebase.functions().httpsCallable('cf_getProductList')
export async function getProductList(){
	const products = [];
	const result = await cf_getProductList();
	result.data.forEach(data => {
		const p = new Product(data)
		p.docId = data.docId;
		products.push(p)
	});
	return products;
}