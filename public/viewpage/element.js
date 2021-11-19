//single page root
export const root = document.getElementById('root');

//menu
export const menuHome = document.getElementById('menu-home')
export const menuAdmin = document.getElementById('menu-admin')
export const menuProducts = document.getElementById('menu-products')
export const menuUsers = document.getElementById('menu-users')
export const menuSignout = document.getElementById('menu-signout')
export const menuCart = document.getElementById('menu-cart')
export const menuProfile = document.getElementById('menu-profile');
export const shoppingCartCount = document.getElementById('shoppingcart-count');
export const menuPurchases = document.getElementById('menu-purchases');

//forms
export const formSignin = document.getElementById('form-signin');
export const formAddProduct = {
	form: document.getElementById('form-add-product'),
	errorName: document.getElementById('form-add-product-error-name'),
	errorPrice: document.getElementById('form-add-product-error-price'),
	errorSummary: document.getElementById('form-add-product-error-summary'),
	imageTag: document.getElementById('form-add-product-image-tag'),
	imageButton: document.getElementById('form-add-product-image-button'),
	errorImage: document.getElementById('form-add-product-error-image'),
}
export const formSignupPasswordError = document.getElementById('form-signup-password-error');
export const formSignup = document.getElementById('form-signup');
export const buttonSignup = document.getElementById('button-signup');


export const formEditProduct = {
	form: document.getElementById('form-edit-product'),
	imageTag: document.getElementById('form-edit-product-image-tag'),
	imageButton: document.getElementById('form-edit-product-image-button'),
	errorName: document.getElementById('form-edit-product-error-name'),
	errorPrice: document.getElementById('form-edit-product-error-price'),
	errorSummary: document.getElementById('form-edit-product-error-summary'),
	errorImage: document.getElementById('form-edit-product-error-image'),
}
//modals
export const modalInfobox = new bootstrap.Modal(document.getElementById('modal-info'), {backdrop: 'static'})
export const modalInfoboxTitleElement = document.getElementById('modal-info-title')
export const modalInfoboxBodyElement = document.getElementById('modal-info-body')

export const modalSignin = new bootstrap.Modal(document.getElementById('modal-signin'), {backdrop: 'static'})

export const modalAddProduct = new bootstrap.Modal(document.getElementById('modal-add-product'), {backdrop: 'static'});

export const modalEditProduct = new bootstrap.Modal(document.getElementById('modal-edit-product'), {backdrop: 'static'});
export const modalTransactionView = new bootstrap.Modal(document.getElementById('modal-transaction-view'), {backdrop: 'static'});
export const modalTransactionTitle = document.getElementById('modal-transaction-title');
export const modalTransactionBody = document.getElementById('modal-transaction-body');
export const modalSignup = new bootstrap.Modal(document.getElementById('modal-signup'), {backdrop: 'static'});
export const modalReview = new bootstrap.Modal(document.getElementById('modal-read-reviews'), {backdrop: 'static'});
export const modalReviewTitle = document.getElementById('modal-read-reviews-title');
export const modalReviewBody = document.getElementById('modal-read-reviews-body');