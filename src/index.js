function addImage() {
    let imageList = document.getElementById('imageList');
    let imageFile = document.createElement("li");
    let imageLabel = document.createElement("label");
    imageLabel.setAttribute("for",this.name);
    imageLabel.innerText  = this.name;
    imageFile.appendChild(imageLabel);
    imageFile.appendChild(this);
    imageList.appendChild(imageFile);
}

function loadImages() {
    [...this.files].map(file => {
        let img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        const basename = file.name.split('.')[file.name.split('.').length - 2];
        img.alt = basename;
        img.name = basename;
        img.onload = addImage;
    });
}

window.addEventListener('load', function () {
    document.querySelector('#fileUpload').addEventListener('change', loadImages);
});