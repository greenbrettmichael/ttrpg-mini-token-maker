function scaleImage(img, width, height) {
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    canvas.height = height;
    canvas.width = width;
    ctx.drawImage(img, 0, 0,  img.width, img.height, 0,0, width, height);
    return canvas;
}

function addImage() {
    const canvas = scaleImage(this, 128, 128);
    let img = document.createElement('img');
    img.src = canvas.toDataURL("image/jpeg");
    img.name = this.name;
    img.alt = this.alt;
    let imageList = document.getElementById('imageList');
    let imageFile = document.createElement("li");
    let imageLabel = document.createElement("label");
    imageLabel.setAttribute("for", img.name);
    imageLabel.innerText = img.name;
    imageFile.appendChild(imageLabel);
    imageFile.appendChild(img);
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
        img.class = "real-image"
        img.style = "display: none;";
        img.onload = addImage;
    });
}

window.addEventListener('load', function () {
    document.querySelector('#fileUpload').addEventListener('change', loadImages);
   // document.querySelector('#convert').addEventListener('click', )
});