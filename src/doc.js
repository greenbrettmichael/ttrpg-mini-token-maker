class Doc {
    #a5Width = 5.83;
    #a5Height = 8.27;
    #wIters;
    #hIters;
    #wIter = 0;
    #hIter = 0;
    #pdf = new jsPDF('p', 'in');;
    constructor(tokenSize) {
        this.tokenSize = tokenSize;
        this.#wIters = Math.floor(this.#a5Width / this.tokenSize);
        this.#hIters = Math.floor(this.#a5Height / this.tokenSize);
    }

    addImage(src) {
        const wStart = this.#wIter * this.tokenSize;
        const hStart = this.#hIter * this.tokenSize;
        this.#pdf.addImage(src, 'jpeg', wStart, hStart);
        this.#wIter++;
        if(this.#wIter > this.#wIters) {
            this.#wIter = 0;
            this.#hIter++;
        }
        if(this.#hIter > this.#hIters) {
            this.#hIter = 0;
            this.#pdf.addPage();
        }
    }

    save(path) {
        this.#pdf.save(path);
    }
}

function pxToIn(px) {
    return px / 96;
}

export { Doc, pxToIn }