import * as pdfGen from './doc.js'

function pxToIn(px) {
    return px / 96;
}

function InToPx(In) {
    return In * 96;
}

function modifyImage(img, width, height, isCircle) {
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    canvas.height = height;
    canvas.width = width;
    
    ctx.beginPath();
    ctx.arc(25, 25, 25, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(img, 0, 0,  img.width, img.height, 0,0, width, height);
    ctx.beginPath();
    ctx.arc(0, 0, 25, 0, Math.PI * 2, true);
    ctx.clip();
    ctx.closePath();
    let token = document.createElement('img');
    token.src = canvas.toDataURL("image/jpeg");
    token.name = img.name;
    token.alt = img.alt;
    return token;
}

function loadImage(file, width, height, isCircle) {
    return new Promise((resolve, reject) => {
        let img = document.createElement('img');
        img.name = file.name;
        img.alt = file.name;
        img.onload = () => resolve(modifyImage(img,width, height, isCircle));
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
    });
}

async function loadImages() {
    const count = document.querySelector('#count').value;
    const tokenSize = document.querySelector('#sizer').value;
    const isCircle = document.querySelector('#circle').value == "on";
    let doc = new pdfGen.Doc(tokenSize);
    let imgLoaders = [...this.files].map(file => {
        return loadImage(file, isCircle).then(img => {
            for (i = 0; i < count; ++i) {
                doc.addImage(img.src);
            }
        });
    });
    await Promise.all(imgLoaders);
    doc.save('tokens.pdf');
}

window.addEventListener('load', function () {
    document.querySelector('#fileUpload').addEventListener('change', loadImages);
});