function scaleImage(img, width, height) {
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    canvas.height = height;
    canvas.width = width;
    ctx.drawImage(img, 0, 0,  img.width, img.height, 0,0, width, height);
    return canvas;
}

function addImage(img) {
    const canvas = scaleImage(img, 128, 128);
    let token = document.createElement('img');
    token.src = canvas.toDataURL("image/jpeg");
    token.name = img.name;
    token.alt = img.alt;
    return token;
}

function loadImage(file) {
    return new Promise((resolve, reject) => {
        let img = document.createElement('img');
        img.name = file.name;
        img.alt = file.name;
        img.onload = () => resolve(addImage(img));
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
    });
}

async function loadImages(uploader, doc) {
    imgLoaders = [...uploader.files].map(file => {
        return loadImage(file).then(img => {
            doc.addImage(img.src, 'jpeg', 0, 0);
        });
    });
    await Promise.all(imgLoaders);
    doc.save('tokens.pdf');
}

function createPDF() {
    let doc = new jsPDF('p', 'mm')
    loadImages(this, doc);
}

window.addEventListener('load', function () {
    document.querySelector('#fileUpload').addEventListener('change', createPDF);
});