(function (global) {
  
  var Article = function (conf) {
    this.conf = global.extend({ 
      tableOfContent: false
    }, conf || {});
     
    this.initialize();
   
    this.head = document.getElementsByTagName('head')[0];
  };
  
  Article.prototype.initialize = function () {   
    if (this.conf.tableOfContent === true) { 
      this.createTableOfContent();
    }
  
    if (
      window.matchMedia('(min-width: 750px').matches
      && document.querySelector('.post-date')
    ) {
      var gridify = this.gridifyImages.bind(this);
      window.addEventListener('resize', gridify);
      gridify();
    }
  };

  Article.prototype.gridifyImage = function (image, containerWidth) {
    var i = new Image();
    i.onload = function () {
      var height = i.height;
      var width = Math.min(i.width, containerWidth);
      var height = i.width > containerWidth
        ? containerWidth * i.height / i.width
        : i.height;
      var roundedHeight = (Math.round(height / 40) * 40);

      image.style.width = width + 'px';
      image.style.height = roundedHeight + 'px';
    };
    i.src = image.src;
  };

  Article.prototype.gridifyImages = function () {
    var images = document.querySelectorAll('img');
    var containerWidth = document
      .querySelector('.container')
      .offsetWidth - (40 * 2);

    var gridify = this.gridifyImage;
    Array.prototype.forEach.call(images, function (image) {
      gridify(image, containerWidth);
    });
  };

  Article.prototype.createTableOfContent = function () {
    var content, 
        items = [],
        html  = "", 
        headings = document.querySelectorAll('.main h2[id]');
            
    if (headings.length === 0) {
      return false;
    }

    for (var i = 0; i < headings.length; i++) {
      content = headings[i].innerText;
      items.push("<a href='#" + headings[i].id + "'>" + content.substr(0, content.length - 1) + "</a>");
    }
    
    html += "<ol>";    
    html += "<li>" + items.join("</li><li>") + '</li>';
    html += "</ol>";
        
    var anchor = document.querySelector(".post-date"),
        nav  = document.createElement("nav"),
        frag = document.createDocumentFragment(); 
    
    nav.setAttribute("role", "navigation");
    nav.innerHTML = html;
    frag.appendChild(nav);
    
    if (anchor && anchor.nextSibling) {
      anchor.parentNode.insertBefore(frag, anchor.nextSibling)
    } else {
      anchor.parentNode.appendChild(frag)
    }
  };

  global.Article = Article;
  
}(window));
