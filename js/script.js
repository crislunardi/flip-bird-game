function createElement(tagName, className) {
    const elem = document.createElement(tagName);
    elem.className = className;
    return elem;
}

function CreateBarrier(reverse = false) {
    this.element = createElement('div', 'barrier');

    const border = createElement('div', 'border');
    const body = createElement('div', 'body');

    this.element.appendChild(reverse ? body : border);
    this.element.appendChild(reverse ? border : body);

    this.setHeight = height => (body.style.height = `${height}px`);
}

function PairOfBarriers(height, opening, x) {
    this.element = createElement('div', 'pair-of-barriers');

    this.upper = new CreateBarrier(true);
    this.lower = new CreateBarrier(false);

    this.element.appendChild(this.upper.element);
    this.element.appendChild(this.lower.element);

    this.drawOpening = () => {
        const heightUpper = Math.random() * (height - opening);
        const heightLower = height - opening - heightUpper;

        this.upper.setHeight(heightUpper);
        this.lower.setHeight(heightLower);
    };

    this.getX = () => parseInt(this.element.style.left.split('px')[0]) || 0;
    this.setX = x => (this.element.style.left = `${x}px`);
    this.getWidth = () => this.element.clientWidth;

    this.drawOpening();
    this.setX(x);
}

const b = new PairOfBarriers(700, 200, 400);
document.querySelector('[wm-flappy]').appendChild(b.element);
