function addImage() {
    let imageList = document.getElementById('imageList');
    let imageFile = document.createElement("li");
    imageFile.appendChild(this);
    imageFile.appendChild(document.createTextNode(this.alt))
    imageList.appendChild(imageFile);
}

function loadImages() {
    [...this.files].map(file => {
        let img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        img.alt = file.name;
        img.onload = addImage;
    });
}

window.addEventListener('load', function () {
    document.querySelector('#fileUpload').addEventListener('change', loadImages);
});