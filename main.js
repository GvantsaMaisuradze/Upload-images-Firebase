

class FirebaseImage{
    imageBaseUrl;
    imageFirebaseId;

    constructor(imageBaseUrl,imageFirebaseId){
        this.imageBaseUrl = imageBaseUrl;
        this.imageFirebaseId = imageFirebaseId;
    }
}

class FirebaseWorker
{
    firebaseRef;

    constructor(){
        this.firebaseRef = firebase.firestore();
    }

    async readlAllImages(renderLogic){
        try{
            var allImages =[];
            var result = await this.firebaseRef.collection("images").get();
            result.forEach(item => {
                var tmpObj = item.data();
                tmpObj.id = item.id;
                allImages.push(tmpObj);
            });
            renderLogic(allImages);
        }catch(error){
            console.log("Error", error);
        }
    }
    async addImage(animalItem){
        try {
            var json = JSON.stringify(animalItem)
            console.log(animalItem);
            var result =  await this.firebaseRef.collection("images").add(JSON.parse(json));
            console.log("image id : ",result.id);
        }catch(error){
            console.log("error", error);
        }
    }
}
var imageInp = document.querySelector("#image");
var tmpImage = document.querySelector(".tmp-image");
var uploadBtn = document.querySelector("#upload");
var readBtn = document.querySelector("#readImage");
var uploadedImagesArea = document.querySelector(".uploaded-images-area")
var firebaseWorker = new FirebaseWorker();
// firebaseWorker.addAnimal(animal);
// firebaseWorker.readlAllAnimals();

var firebaseImageItem;

imageInp.addEventListener("change",function(){
    var reader = new FileReader();
    reader.readAsDataURL(this.files[0]);
    reader.onload = function(){
        tmpImage.src = reader.result;
        firebaseImageItem = new FirebaseImage(reader.result);
    }
});


uploadBtn.addEventListener("click",function(){
    firebaseWorker.addImage(firebaseImageItem);
})

readBtn.addEventListener("click",function(){
    firebaseWorker.readlAllImages(function(data){
        data.forEach(item =>{
            uploadedImagesArea.innerHTML += `<img src="${item.imageBaseUrl}" class="uploaded-images" alt="">`
        })
    })
})