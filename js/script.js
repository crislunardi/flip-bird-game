function createElement(tagName, className) {
    const elem = document.createElement(tagName);
    elem.className = className;
    return elem;
};

function CreateBarrier(reverse = false) {
    this.element = createElement('div', 'barrier');

    const border = createElement('div', 'border');
    const body = createElement('div', 'body');

    this.element.appendChild(reverse ? body : border);
    this.element.appendChild(reverse ? border : body);

    this.setHeight = height => (body.style.height = `${height}px`);
};

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

    this.getX = () => parseInt(this.element.style.left) || 0;
    this.setX = x => (this.element.style.left = `${x}px`);
    this.getWidth = () => this.element.clientWidth;

    this.drawOpening();
    this.setX(x);
};

function Barriers(height, width, opening, space, pointNotify = () => {}) {
    this.pairs = [
        new PairOfBarriers(height, opening, width),
        new PairOfBarriers(height, opening, width + space),
        new PairOfBarriers(height, opening, width + space * 2),
        new PairOfBarriers(height, opening, width + space * 3)
    ];

    const displacement = 3;
    this.animate = () => {
        this.pairs.forEach(pair => {
            pair.setX(pair.getX() - displacement);

            if (pair.getX() < -pair.getWidth()) {
                pair.setX(pair.getX() + space * this.pairs.length);
                pair.drawOpening();
            }

            const middle = width / 2;
            const crossedMiddle = pair.getX() + displacement >= middle && pair.getX() < middle;

            if (crossedMiddle) {
                pointNotify();
            }
        });
    };
};

function Bird(gameHeight) {
    let flying = false;

    this.element = createElement('img', 'bird');
    this.element.src = 'img/bird.png';

    this.getY = () => parseInt(this.element.style.bottom) || 0;
    this.setY = y => (this.element.style.bottom = `${y}px`);

    window.onkeydown = () => (flying = true);
    window.onkeyup = () => (flying = false);

    this.animate = () => {
        const newY = this.getY() + (flying ? 8 : -5);
        const maxHeight = gameHeight - this.element.clientHeight;

        if (newY <= 0) {
            this.setY(0);
        } else if (newY >= maxHeight) {
            this.setY(maxHeight);
        } else {
            this.setY(newY);
        }
    };

    this.setY(gameHeight / 2);
};

const gameArea = document.querySelector('[wm-flappy]');
const barriers = new Barriers(700, 1200, 200, 400);
const bird = new Bird(700);

gameArea.appendChild(bird.element);
barriers.pairs.forEach(pair => gameArea.appendChild(pair.element));

setInterval(() => {
    barriers.animate();
    bird.animate();
}, 20);
