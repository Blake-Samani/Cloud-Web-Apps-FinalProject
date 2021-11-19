export class Comment{
    constructor(data){
        this.uid = data.uid;
        this.email = data.email;
        this.timestamp = data.timestamp;
        this.content = data.content;
        this.productId = data.productId;
        // this.likes = data.likes;

    }
    //to store in firestore
    serialize(){
        return{
            uid: this.uid,
            email: this.email,
            timestamp: this.timestamp,
            content: this.content,
            productId: this.productId,
            // likes: this.likes,
        };
    }

    validate_title(){
        if (this.title && this.title.length > 2) return null;
        return 'invalid: min length should be 3';
    }
    validate_content(){
        if (this.content && this.content.length > 5) return null;
        return 'invalid: min length should be 5';
    }


}