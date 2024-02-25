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

function onMouseMoveSnapGrid(c, offsetX, offsetY, event) {
    c.style.left = ((event.pageX - offsetX) / 20).toFixed() * 20 + 'px';
    c.style.top = ((event.pageY - offsetY) / 20).toFixed() * 20 + 'px';
}

function onmousedownGeneric(c, event, lookdb = true) {
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
    elementsList.style.width = '132px';
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
    DbList = document.createElement('div');
    DbList.style.width = '132px';
    DbList.style.height = '500px';
    DbList.style.overflow = 'auto';
    DbList.style.position = 'absolute';
    DbList.style.left = window.innerWidth - 140 + 'px';
    DbList.style.top = 0;
    document.body.appendChild(DbList);
});