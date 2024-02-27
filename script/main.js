let startArrow = document.createElement('div');
startArrow.classList.add('startArrow');
startArrow.style.border = '1px';
startArrow.style.borderRadius = '50%';
startArrow.style.position = 'absolute';
startArrow.style.boxSizing = 'border-box';
startArrow.style.width = '10px';
startArrow.style.height = '10px';

function drawArrowSnap(event, startx, starty) {
    event.stopPropagation();
}

function arrowClickButton() {
    let butt = document.getElementById('buttonArrow');
    if (butt.style.backgroundColor == "rgb(99, 91, 102)") { // On
        butt.style.backgroundColor = 'rgb(173, 159, 178)';
        for (domino of document.getElementById('dessin').getElementsByClassName('domino')) {
            for (i = 0; i <= 120; i += 10) {
                let circle = startArrow.cloneNode(true);
                circle.style.left = i - 5 + 'px';
                circle.style.top = 0 - 5 + 'px';
                circle.onclick = ((i) => (event) => drawArrowSnap(event, i, 0))(i); // Pfouuuuuuh, j'aime pas le curry a la sauce javascript
                circle.onmousedown = circle.onclick;
                domino.appendChild(circle);
                circle = startArrow.cloneNode();
                circle.style.left = i - 5 + 'px';
                circle.style.top = 50 - 5 + 'px';
                circle.onclick = ((i) => (event) => drawArrowSnap(event, i, 50))(i);
                circle.onmousedown = circle.onclick;
                domino.appendChild(circle);
            }
            for (i = 12.5; i <= 40; i += 12.5) {
                let circle = startArrow.cloneNode(true);
                circle.style.top = i - 5 + 'px';
                circle.style.left = 0 - 5 + 'px';
                circle.onclick = ((i) => (event) => drawArrowSnap(event, 0, i))(i);
                circle.onmousedown = circle.onclick;
                domino.appendChild(circle);
                circle = startArrow.cloneNode();
                circle.style.top = i - 5 + 'px';
                circle.style.left = 120 - 5 + 'px';
                circle.onclick = ((i) => (event) => drawArrowSnap(event, 120, i))(i);
                circle.onmousedown = circle.onclick;
                domino.appendChild(circle);
            }
            console.log(domino);
        }
    }
    else { // Off
        document.querySelectorAll('.startArrow').forEach(e => e.remove());
        butt.style.backgroundColor = "rgb(99, 91, 102)";
    }
}

function onMouseMoveSnapGrid(c, offsetX, offsetY, event) {
    c.style.left = ((event.pageX - offsetX) / 20).toFixed() * 20 + 'px';
    c.style.top = ((event.pageY - offsetY) / 20).toFixed() * 20 + 'px';
}

function onmousedownGeneric(c, event) {
    offsetX = event.pageX - c.getBoundingClientRect().left;
    offsetY = event.pageY - c.getBoundingClientRect().top;
    omm = event => onMouseMoveSnapGrid(c, offsetX, offsetY, event);
    omm(event);
    document.addEventListener('mousemove', omm);
    document.onmouseup = function (event) {
        document.removeEventListener('mousemove', omm);
        document.onmouseup = null;
        if (((event.pageX - offsetX) / 20).toFixed() * 20 < 140) {
            c.remove();
        }
    };
}

function onmousedownForElementsList(figure, event) {
    if (event.button > 0) {
        return;
    }
    let c = figure.cloneNode(true);
    c.removeAttribute('id');
    c.style.position = 'absolute';
    document.getElementById('dessin').append(c);
    c.onmousedown = event => onmousedownGeneric(c, event);

    offsetX = event.pageX - figure.getBoundingClientRect().left;
    offsetY = event.pageY - figure.getBoundingClientRect().top;
    onMouseMoveSnapGrid(c, offsetX, offsetY, event);
    onmousedownGeneric(c, event);
}

function createMenu() {
    let stylesheet = document.createElement("style");
    stylesheet.setAttribute("type", "text/css");
    document.head.appendChild(stylesheet);
    let styles = stylesheet.sheet;
    for (const [key, color] of Object.entries(img.colors)) {
        [r, g, b] = color.split(' ');
        styles.insertRule('.' + key + 's{background-color:rgb(' + [r, g, b].map(x => x * 1.7).join(',') + ');img{background-color:rgb(' + [r, g, b].map(x => x * 1.3).join(',') + ')}}', styles.cssRules.length);
        styles.insertRule('#' + key + 'sButton{background-color:rgb(' + [r, g, b].join(',') + ');}', styles.cssRules.length);
        styles.insertRule('#' + key + 'sList{background-color:rgb(' + [r, g, b].join(',') + ');}', styles.cssRules.length);
    } // Beurk
    let menu = document.getElementById('leftMenu');
    let middle = document.getElementById('middle');
    for (const [str, entries] of Object.entries(img)) {
        if (str == 'colors')
            continue;

        let list = document.createElement("div");
        list.id = str + "List";
        list.classList.add('dominoList');
        let butt = document.createElement("div");
        butt.classList.add('leftMenuButton')
        butt.id = str + 'Button';
        butt.onclick = () => HideAllListsBut(list.id);
        let i = document.createElement("img");
        i.src = 'images/' + str + '/' + Object.entries(img[str])[0][1] + '.png';
        butt.appendChild(i);
        menu.appendChild(butt);

        for (const [key, value] of Object.entries(img[str])) {
            let figure = document.createElement("div");
            figure.classList.add('domino', str);
            figure.id = key;
            figure.setAttribute(str.slice(0, -1), key);
            figure.onmousedown = event => onmousedownForElementsList(figure, event);
            let image = document.createElement('img');
            image.setAttribute('src', 'images/' + str + '/' + value + '.png');
            image.draggable = false;
            let caption = document.createElement("div");
            caption.className = "textElement";
            caption.appendChild(document.createTextNode(key));
            figure.appendChild(image);
            figure.appendChild(caption);
            list.appendChild(figure);
        }
        middle.appendChild(list);
    }
}

function HideAllListsBut(visible) {
    for (hide of document.getElementsByClassName('dominoList'))
        hide.style.display = hide.id == visible ? 'flex' : 'none';
}

window.addEventListener('load', function () {
    createMenu();
    HideAllListsBut('elementsList');
});