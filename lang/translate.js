window.addEventListener('load', function () {
    var allImages = document.getElementsByTagName('img');
    for(var i = 0; i < allImages.length ; i++) {
      let caption = document.createElement("figcaption");
      caption.insertAdjacentHTML('afterbegin', dico[allImages[i].getAttribute("src").split('/').pop().slice(0, -4)]);
      allImages[i].after(caption);
      console.log(caption)
    }
});