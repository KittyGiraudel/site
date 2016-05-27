(function (global) {
  
  var Article = function (conf) {
    this.conf = global.extend({ 
      tableOfContent: false
    }, conf || {});
     
    this.initialize();
   
    this.head = document.getElementsByTagName('head')[0];
  };
  
  Article.prototype.initialize = function () {   
    this.createSections();
    
    if (this.conf.tableOfContent === true) { 
      this.createTableOfContent();
    }
  };
  
  Article.prototype.createSections = function () {
    var link, name, headings = document.querySelectorAll('.main h2[id]');
    
    for (var i = 0; i < headings.length; i++) {
      link = document.createElement('a');
      link.setAttribute('href', '#' + headings[i].id);
      link.innerHTML = '#';
      headings[i].appendChild(link);
    }
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
    
    console.log(anchor);

    nav.setAttribute("class", "toc");
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
