import * as Constant from '../model/constant.js'
import { AccountInfo } from '../model/account_info.js';
import { Product } from '../model/product.js';
import { ShoppingCart } from '../model/ShoppingCart.js';


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

export async function getProductListNoCloud() {
	const products = [];
	const snapShot = await firebase.firestore().collection(Constant.collectionNames.PRODUCTS)
		.orderBy('name')
		.get();
	snapShot.forEach(doc => {
		const p = new Product(doc.data());
		p.docId = doc.id;
		products.push(p);
	})
	return products;
}

export async function checkOut(cart){
	const data = cart.serialize(Date.now());
	await firebase.firestore().collection(Constant.collectionNames.PURCHASE_HISTORY).add(data);
}

export async function getAccountInfo(uid) {
	const doc = await firebase.firestore().collection(Constant.collectionNames.ACCOUNT_INFO)
		.doc(uid).get();
	if(doc.exists){
		return new AccountInfo(doc.data());
	} else{
		const defaultInfo = AccountInfo.instance();
		await firebase.firestore().collection(Constant.collectionNames.ACCOUNT_INFO)
			.doc(uid).set(defaultInfo.serialize());
		return defaultInfo;
	}
}

export async function updateAccountInfo(uid, updateInfo){
	await firebase.firestore().collection(Constant.collectionNames.ACCOUNT_INFO)
		.doc(uid).update(updateInfo);
}

export async function uploadProfilePhoto(photoFile, imageName){
	const ref = firebase.storage().ref()
			.child(Constant.storageFolderName.PROFILE_PHOTOS + imageName)
	const taskSnapShot = await ref.put(photoFile);
	const photoURL = await taskSnapShot.ref.getDownloadURL();
	return photoURL;
}

export async function getPurchaseHistory(uid){
	const snapShot = await firebase.firestore().collection(Constant.collectionNames.PURCHASE_HISTORY)
		.where('uid', '==', uid)
		.orderBy('timestamp', 'desc')
		.get();
	const carts = [];
	snapShot.forEach(doc =>{
		const sc = ShoppingCart.deserialize(doc.data());
		carts.push(sc);
	})
	return carts;
}


const cf_getProductById = firebase.functions().httpsCallable('cf_getProductById');
export async function getProductById(docId){
	const result = await cf_getProductById(docId);
	if (result.data) {
		const product = new Product(result.data);
		product.docId = result.data.docId;
		return product;

	}
	else {
		return null;
	}
}

const cf_updateProduct = firebase.functions().httpsCallable('cf_updateProduct');

export async function updateProduct(product){
	const docId = product.docId;
	const data = product.serializeForUpdate();
	await cf_updateProduct({docId, data});
	//call cloud function
}

const cf_deleteProduct = firebase.functions().httpsCallable('cf_deleteProduct');
export async function deleteProduct(docId, imageName){
	await cf_deleteProduct(docId);
	const ref = firebase.storage().ref()
		.child(Constant.storageFolderNames.PRODUCT_IMAGES + imageName);
	await ref.delete();
}
export async function createUser(email, password) {
	await firebase.auth().createUserWithEmailAndPassword(email, password);
}


const cf_getUserList = firebase.functions().httpsCallable('cf_getUserList');
export async function getUserList() {
	const result = await cf_getUserList();
	return result.data;
}

const cf_updateUser = firebase.functions().httpsCallable('cf_updateUser');
export async function updateUser(uid, update){
	await cf_updateUser({uid, update});
}

const cf_deleteUser = firebase.functions().httpsCallable('cf_deleteUser');
export async function deleteUser(uid){
	await cf_deleteUser(uid);
}