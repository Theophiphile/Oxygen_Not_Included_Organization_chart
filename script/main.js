let DbList;

function arrowClickButton() {
    let butt = document.getElementById('buttonArrow');
    if (butt.style.backgroundColor == "") {
        butt.style.backgroundColor = 'green';
    }
    else {
        butt.style.backgroundColor = "";
    }
}

function lookInDb(key) {
    return;
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
    onmousedownGeneric(c, event, lookdb);
}

function initElementsList() {
    let elementsList = document.getElementById("ElementsList");
    for (const [key, value] of Object.entries(img.elements)) {
        let figure = document.createElement("div");
        figure.className = "elements";
        figure.id = key;
        figure.setAttribute("element", key);
        figure.onmousedown = event => onmousedownForElementsList(figure, event);
        let image = document.createElement('img');
        image.setAttribute('src', 'images/elements/' + value + '.png');
        image.draggable = false;
        let caption = document.createElement("div");
        caption.className = "textElement";
        caption.appendChild(document.createTextNode(key));
        figure.appendChild(image);
        figure.appendChild(caption);
        console.log(figure);
        elementsList.appendChild(figure);
    }
    let crittersList = document.getElementById("CrittersList");
    for (const [key, value] of Object.entries(img.critters)) {
        let figure = document.createElement("div");
        figure.className = "critters";
        figure.id = key;
        figure.setAttribute("critter", key);
        figure.onmousedown = event => onmousedownForElementsList(figure, event);
        let image = document.createElement('img');
        image.setAttribute('src', 'images/critters/' + value + '.png');
        image.draggable = false;
        let caption = document.createElement("div");
        caption.className = "textElement";
        caption.appendChild(document.createTextNode(key));
        figure.appendChild(image);
        figure.appendChild(caption);
        console.log(figure);
        crittersList.appendChild(figure);
    }
}

function HideAllListsBut(visible) {
    for (hide of document.getElementsByClassName('ChoicesList')) 
        hide.style.display = hide.id == visible ? 'flex' : 'none';
}


window.addEventListener('load', function () {
    initElementsList();
    HideAllListsBut('ElementsList');
    DbList = document.createElement('div');
    DbList.style.width = '137px';
    DbList.style.overflow = 'scroll';
    DbList.style.left = window.innerWidth - 140 + 'px';
    DbList.style.top = 0;
    document.body.appendChild(DbList);
});