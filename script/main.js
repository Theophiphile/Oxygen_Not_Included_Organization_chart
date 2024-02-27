function arrowClickButton() {
    let butt = document.getElementById('buttonArrow');
    if (butt.style.backgroundColor == "") {
        butt.style.backgroundColor = 'green';
    }
    else {
        butt.style.backgroundColor = "";
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
    document.body.append(c);
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
        styles.insertRule('.' + key + 's{background-color:rgb(' + r * 1.7 + ',' + g * 1.7 + ',' + b * 1.7 + ');img{background-color:rgb(' + r * 1.3 + ',' + g * 1.3 + ',' + b * 1.3 + ')}}', styles.cssRules.length);
        styles.insertRule('#' + key + 'sButton{background-color:rgb(' + r + ',' + g + ',' + b + ');}', styles.cssRules.length);
        styles.insertRule('#' + key + 'sList{background-color:rgb(' + r + ',' + g + ',' + b + ');}', styles.cssRules.length);
    }
    console.log(styles);
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