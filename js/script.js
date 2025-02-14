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

    this.getX = () => parseInt(this.element.style.left) || 0;
    this.setX = x => (this.element.style.left = `${x}px`);
    this.getWidth = () => this.element.clientWidth;

    this.drawOpening();
    this.setX(x);
}

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
}

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
}

function Progress() {
    this.element = createElement('span', 'progress');
    this.updatePoints = points => {
        this.element.innerHTML = points;
    };
    this.updatePoints(0);
}

function elementsCollided(elementA, elementB) {
    const rectA = elementA.getBoundingClientRect();
    const rectB = elementB.getBoundingClientRect();

    const horizontal = rectA.left + rectA.width >= rectB.left && rectB.left + rectB.width >= rectA.left;
    const vertical = rectA.top + rectA.height >= rectB.top && rectB.top + rectB.height >= rectA.top;
    
    return horizontal && vertical;
}

function collided(bird, barriers) {
    return barriers.pairs.some(pair => {
        return elementsCollided(bird.element, pair.upper.element) || 
               elementsCollided(bird.element, pair.lower.element);
    });
}

function FlappyBird() {
    let points = 0;

    const gameArea = document.querySelector('[wm-flappy]');
    if (!gameArea) {
        console.error("Elemento '[wm-flappy]' não encontrado no DOM.");
        return;
    }

    const height = gameArea.clientHeight;
    const width = gameArea.clientWidth;

    const progress = new Progress();
    const barriers = new Barriers(height, width, 200, 400, () => progress.updatePoints(++points));
    const bird = new Bird(height);

    gameArea.appendChild(progress.element);
    gameArea.appendChild(bird.element);
    barriers.pairs.forEach(pair => gameArea.appendChild(pair.element));

    this.start = () => {
        const timer = setInterval(() => {
            barriers.animate();
            bird.animate();

            if (collided(bird, barriers)) {
                clearInterval(timer);
                alert("Game Over!");
            }
        }, 20);
    };
}

new FlappyBird().start();
