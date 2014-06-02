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
    var link, name, headings = document.querySelectorAll('h2');
    
    for (var i = 0; i < headings.length; i++) {
      name = 'section-' + (i + 1);
      headings[i].id = name;
      link = document.createElement('a');
      link.setAttribute('href', '#' + name);
      link.innerHTML = '#';
      headings[i].appendChild(link);
    }
    
  };
  
  Article.prototype.createTableOfContent = function () {
    var content, 
        items = [],
        html  = "", 
        article  = document.querySelector('article'),
        headings = article.querySelectorAll('h2');
            
    if (headings.length === 0) {
      return false;
    }

    for (var i = 0; i < headings.length; i++) {
      content = headings[i].innerText;
      items.push("<a href='#" + headings[i].id + "'>" + content.substr(0, content.length - 1) + "</a>");
    }
    
    html += "<h2 class='table-of-contents__title'>Table of contents</h2>";
    html += "<ul class='table-of-contents__list'>";    
    html += "<li>" + items.join("</li><li>") + '</li>';
    html += "</ul>";
        
    var date = document.querySelector(".date"),
        nav  = document.createElement("nav"),
        frag = document.createDocumentFragment(); 
    
    nav.setAttribute("class", "table-of-contents");
    nav.setAttribute("role", "navigation");
    nav.innerHTML = html;
    frag.appendChild(nav);
    
    if (date.nextSibling) {
        date.parentNode.insertBefore(frag, date.nextSibling)
    } else {
        date.parentNode.appendChild(frag)
    }
  };
  global.Article = Article;
  
}(window));