export class Product {
	constructor(data){ //data == js object that holds info about product
		this.name = data.name.toLowerCase().trim();
		this.price = typeof data.price == 'number' ? data.price : Number(data.price); //store as is otherwise convert to number
		this.summary = data.summary.trim();
		this.imageName = data.imageName;
		this.imageURL = data.imageURL;
		this.qty = Number.isInteger(data.qty) ? data.qty : null;

	}

	serialize(){
		return {
			name: this.name,
			price: this.price,
			summary: this.summary,
			imageName: this.imageName,
			imageURL: this.imageURL,
			qty: this.qty,
		}
	}

	serializeForUpdate(){
		const p = {};
		if (this.name) p.name = this.name;
		if (this.price) p.price = this.price;
		if (this.summary) p.summary = this.summary;
		if (this.imageName) p.imageName = this.imageName;
		if (this.imageURL) p.imageURL = this.imageURL;
		return p;

	}

	validate(imageFile){
		const errors = {};

		if(!this.name || this.name.length < 2 )
			errors.name = 'Product name too short: min 3 chars';
		if(!this.price || !Number(this.price))
			errors.price = 'Price is not a number';
		if(!this.summary || this.summary.length < 5)
			errors.summary = 'Product summary too short; min 5 chars';
		if(!imageFile)
			errors.image = 'image not selected';
		
		return errors;

		

		//save the product object in firebase
	}

	static isSerializedProduct(p){
		if(!p.name) return false;
		if(!p.price || typeof p.price != 'number') return false;
		if (!p.summary) return false;
		if (!p.imageName) return false;
		if(!p.imageURL || !p.imageURL.includes('https')) return false;
		if(!p.qty || !Number.isInteger(p.qty)) return false;

		return true;
	}

}