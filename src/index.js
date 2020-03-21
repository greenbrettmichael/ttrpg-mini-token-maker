import * as pdfGen from './doc.js'

function pxToIn(px) {
    return px / 96;
}

function InToPx(In) {
    return In * 96;
}

async function modifyImage(img, fr, width, height) {
    img.src = fr.result;
    let token = document.createElement('img');
    let hiddenImage = document.createElement('div');
    hiddenImage.style.opacity = "0%";
    hiddenImage.appendChild(img);
    document.body.appendChild(hiddenImage);
    let canvas = await html2canvas(img);
    let ctx = canvas.getContext("2d");
    let tempCanvas=document.createElement("canvas");
    let tctx=tempCanvas.getContext("2d");
    const cw = canvas.width;
    const ch = canvas.height;
    tempCanvas.width = cw;
    tempCanvas.height = ch;
    tctx.drawImage(canvas,0,0);
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(tempCanvas,0,0,cw,ch,0,0,width,height);
    token.src = canvas.toDataURL("image/png");
    token.name = img.name;
    token.alt = img.alt;
    document.body.removeChild(hiddenImage);
    return token;
}

function loadImage(file, width, height, isCircle) {
    return new Promise((resolve, reject) => {
        let img = document.createElement('img');
        img.name = file.name;
        img.alt = file.name;
        if(isCircle) {
            img.style.borderRadius = "50%";
        }
        var fr = new FileReader();
        fr.onload = () => resolve(modifyImage(img, fr, width, height));
        fr.onerror = reject;
        fr.readAsDataURL(file);
    });
}

async function loadImages() {
    const count = document.querySelector('#count').value;
    const tokenSize = document.querySelector('#sizer').value;
    const isCircle = document.querySelector('#circle').value == "on";
    const tokenWidth = InToPx(tokenSize);
    const tokenHeight = tokenWidth;
    let doc = new pdfGen.Doc(tokenSize);
    let imgLoaders = [...this.files].map(file => {
        return loadImage(file, tokenWidth, tokenHeight, isCircle).then(img => {
            for (let i = 0; i < count; ++i) {
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