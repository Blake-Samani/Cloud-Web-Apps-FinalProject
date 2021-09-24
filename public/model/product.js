export class Product {
	constructor(data){ //data == js object that holds info about product
		this.name = data.name.toLowerCase();
		this.price = typeof data.price == 'number' ? data.price : Number(data.price); //store as is otherwise convert to number
		this.summary = data.summary;
		this.imageName = data.imageName;
		this.imageURL = data.imageURL;
	}

	serialize(){
		return {
			name: this.name,
			price: this.price,
			summary: this.summary,
			imageName: this.imageName,
			imageURL: this.imageURL,
		}
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
}