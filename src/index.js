import * as pdfGen from './doc.js'

function pxToIn(px) {
    return px / 96;
}

function InToPx(In) {
    return In * 96;
}

async function imgWCSSToCanvas(img, fr) {
    img.src = fr.result;
    let hiddenImage = document.createElement('div');
    hiddenImage.style.opacity = "0%";
    hiddenImage.appendChild(img);
    document.body.appendChild(hiddenImage);
    let canvas = await html2canvas(img);
    document.body.removeChild(hiddenImage);
    return canvas;
}

function canvasToTokenImg(canvas, number) {
    let tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    let ctx = tempCanvas.getContext('2d');
    ctx.drawImage(canvas, 0, 0);
    ctx.font = "30px Comic Sans MS";
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.fillText(number, tempCanvas.width/2, 25);
    return tempCanvas.toDataURL("image/png");
}



function loadImageToCanvas(file, width, height, isCircle) {
    return new Promise((resolve, reject) => {
        let img = document.createElement('img');
        img.name = file.name;
        img.alt = file.name;
        img.width = width;
        img.height = height;
        if(isCircle) {
            img.style.borderRadius = "50%";
        }
        var fr = new FileReader();
        fr.onload = () => resolve(imgWCSSToCanvas(img, fr, width, height));
        fr.onerror = reject;
        fr.readAsDataURL(file);
    });
}

async function loadImages() {
    const count = document.querySelector('#count').value;
    const tokenSize = document.querySelector('#sizer').value;
    const isCircle = document.querySelector('#circle').checked;
    const tokenWidth = InToPx(tokenSize);
    const tokenHeight = tokenWidth;
    let doc = new pdfGen.Doc(tokenSize);
    let imgLoaders = [...this.files].map(file => {
        return loadImageToCanvas(file, tokenWidth, tokenHeight, isCircle).then(imgCanvas => {
            for (let i = 0; i < count; ++i) {
                doc.addImage(canvasToTokenImg(imgCanvas, i + 1));
            }
        });
    });
    await Promise.all(imgLoaders);
    doc.save('tokens.pdf');
}

window.addEventListener('load', function () {
    document.querySelector('#fileUpload').addEventListener('change', loadImages);
});