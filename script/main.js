let DbList;

function lookInDb(key) {
    var ret = [];
    if ('High' in db.elements[key]) {
        ret.push(...Object.keys(db.elements[key].High.elements));
    }
    if ('Low' in db.elements[key]) {
        ret.push(...Object.keys(db.elements[key].Low.elements));
    }
    for (const [k, v] of Object.entries(db.elements)) {
        if ('High' in v && key in v.High.elements) {
            ret.push(k);
        }
        if ('Low' in v && key in v.Low.elements) {
            ret.push(k);
        }
    }
    console.log([...new Set(ret)]);
    while (DbList.firstChild) {
        DbList.firstChild.remove();
    }
    for (const e of [...new Set(ret)]) {
        let elem = document.getElementById(e).cloneNode(true);
        elem.removeAttribute('id');
        elem.onmousedown = event => onmousedownForElementsList(elem, event, false);
        DbList.insertAdjacentElement("beforeend", elem);
    }
}

let overlaysStartArrows;

function initOverlaysStartArrows() {
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.style.position = 'absolute';
    svg.style.width = '120px';
    svg.style.height = '60px';
    for (value of [
        [[0, 0], [15, 15], [15, 20], [0, 20]],
        [[0, 40], [15, 40], [15, 45], [0, 60]],
        [[24, 0], [48, 0], [48, 15], [24, 15]],
        [[24, 60], [48, 60], [48, 45], [24, 45]],
        [[72, 0], [96, 0], [96, 15], [72, 15]],
        [[72, 60], [96, 60], [96, 45], [72, 45]],
        [[120, 0], [105, 15], [105, 20], [120, 20]],
        [[120, 40], [105, 40], [105, 45], [120, 60]]
    ]) {
        let poly = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        poly.style.fill = 'green';
        poly.style.fillOpacity = 0.4;
        svg.appendChild(poly);
        for (v of value) {
            let p = svg.createSVGPoint();
            p.x = v[0];
            p.y = v[1];
            poly.points.appendItem(p);
        }
        poly.onmousedown = function (event) {
            if (event.offsetX < 15 ||
                event.offsetX > 105 ||
                event.offsetY < 15 ||
                event.offsetY > 45) {
                event.stopPropagation();
                return false;
            };
        }
        poly.onmouseenter = function (event) {
            poly.style.fill = 'blue';
        }
        poly.onmouseleave = function (event) {
            poly.style.fill = 'green';
        }
    }
    for (value of [
        [[0, 0], [15, 15], [24, 15], [24, 0]],
        [[48, 0], [72, 0], [72, 15], [48, 15]],
        [[96, 0], [120, 0], [105, 15], [96, 15]],
        [[0, 60], [15, 45], [24, 45], [24, 60]],
        [[48, 60], [72, 60], [72, 45], [48, 45]],
        [[96, 60], [120, 60], [105, 45], [96, 45]],
        [[0, 20], [15, 20], [15, 40], [0, 40]],
        [[120, 20], [105, 20], [105, 40], [120, 40]]
    ]) {
        let poly = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        poly.style.fill = 'green';
        poly.style.fillOpacity = 0.6;
        svg.appendChild(poly);
        for (v of value) {
            let p = svg.createSVGPoint();
            p.x = v[0];
            p.y = v[1];
            poly.points.appendItem(p);
        }
        poly.onmousedown = function (event) {
            if (event.offsetX < 15 ||
                event.offsetX > 105 ||
                event.offsetY < 15 ||
                event.offsetY > 45) {
                event.stopPropagation();
                return false;
            };
        }
        poly.onmouseenter = function (event) {
            poly.style.fill = 'blue';
        }
        poly.onmouseleave = function (event) {
            poly.style.fill = 'green';
        }

    }
    document.body.appendChild(svg);
    overlaysStartArrows = svg;

}

function onMouseHoverStartArrows(c, event) {
    c.appendChild(overlaysStartArrows);
    overlaysStartArrows.style.visibility = 'visible';
}

function onMouseHoverLeaveStartArrows(c, event) {
    overlaysStartArrows.style.visibility = 'hidden';
}
function onMouseMoveSnapGrid(c, offsetX, offsetY, event) {
    c.style.left = ((event.pageX - offsetX) / 20).toFixed() * 20 + 'px';
    c.style.top = ((event.pageY - offsetY) / 20).toFixed() * 20 + 'px';
}

function onmousedownGeneric(c, event, lookdb = true) {
    overlaysStartArrows.style.visibility = 'hidden';
    offsetX = event.pageX - c.getBoundingClientRect().left;
    offsetY = event.pageY - c.getBoundingClientRect().top;
    if (lookdb) {
        lookInDb(c.getAttribute("element"));
    }
    omm = event => onMouseMoveSnapGrid(c, offsetX, offsetY, event);
    omm(event);
    document.addEventListener('mousemove', omm);
    document.onmouseup = function (event) {
        document.removeEventListener('mousemove', omm);
        document.onmouseup = null;
        c.onmouseenter = event => onMouseHoverStartArrows(c, event);
        c.onmouseleave = event => onMouseHoverLeaveStartArrows(c, event);
        onMouseHoverStartArrows(c, event);
        if (((event.pageX - offsetX) / 20).toFixed() * 20 < 140) {
            c.remove();
        }
    };
}

function onmousedownForElementsList(figure, event, lookdb = true) {
    let c = figure.cloneNode(true);
    c.removeAttribute('id');
    c.style.position = 'absolute';
    document.body.append(c);
    c.onmousedown = event => onmousedownGeneric(c, event);

    offsetX = event.pageX - figure.getBoundingClientRect().left;
    offsetY = event.pageY - figure.getBoundingClientRect().top;
    onMouseMoveSnapGrid(c, offsetX, offsetY, event);
    onmousedownGeneric(c, event, lookdb);
}

function initElementsList() {
    let elementsList = document.createElement('div');
    elementsList.id = "ElementsList";
    elementsList.style.width = '137px';
    elementsList.style.height = '500px';
    elementsList.style.overflow = 'auto';
    for (const [key, value] of Object.entries(db.elements)) {
        let figure = document.createElement("figure");
        figure.className = "elements";
        figure.id = key;
        figure.setAttribute("element", key);
        figure.onmousedown = event => onmousedownForElementsList(figure, event);
        let image = document.createElement('img');
        console.log(img.elements);
        image.setAttribute('src', 'images/elements/' + img.elements[key] + '.png');
        image.draggable = false;
        let caption = document.createElement("figcaption");
        caption.insertAdjacentHTML('afterbegin', key);
        figure.appendChild(image);
        figure.appendChild(caption);
        console.log(figure);
        elementsList.appendChild(figure);
    }
    document.body.appendChild(elementsList);
}

window.addEventListener('load', function () {
    initElementsList();
    initOverlaysStartArrows();
    DbList = document.createElement('div');
    DbList.style.width = '137px';
    DbList.style.height = '500px';
    DbList.style.overflow = 'auto';
    DbList.style.position = 'absolute';
    DbList.style.left = window.innerWidth - 140 + 'px';
    DbList.style.top = 0;
    document.body.appendChild(DbList);
});