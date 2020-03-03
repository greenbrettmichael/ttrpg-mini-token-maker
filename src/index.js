import * as uploader from './upload.js'

var elDrop = document.getElementById('dropzone');
var elItems = document.getElementById('images');

elDrop.addEventListener('dragover', function (event) {
    event.preventDefault();
    elItems.innerHTML = 0;
});

elDrop.addEventListener('drop', async function (event) {
    event.preventDefault();
    let items = await uploader.getAllFileEntries(event.dataTransfer.items);
    elItems.innerHTML = items.length;
});