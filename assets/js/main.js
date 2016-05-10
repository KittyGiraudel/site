(function (global) {
  
  global.extend = function(obj, extObj) {
    obj = obj || {};
    if (arguments.length > 2) {
      for (var a = 1; a < arguments.length; a++) {
        global.extend(obj, arguments[a]);
      }
    } else {
      for (var i in extObj) {
        obj[i] = extObj[i];
      }
    }
    return obj;
  };
  
}(window));(function (global) {
  
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
    
    html += "<h2 class='toc__title'>Table of contents</h2>";
    html += "<ol class='toc__list'>";    
    html += "<li class='toc__item'>" + items.join("</li><li class='toc__item'>") + '</li>';
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
(function (global) {

  var App = function (conf) {
    this.conf = global.extend({
      codepen: false,
      sassmeister: false,
      tableOfContent: false,
      tracking: true,
      ad: true,
      comments: true,
      layout: 'default',
      disqus: {
        name: 'hugogiraudel',
        title: false,
        url: window.location.href
      }
    }, conf || {});

    this.initialize();
  };

  App.prototype.initialize = function () {
    this.article = new global.Article({
      tableOfContent: this.conf.tableOfContent
    });

    ['tracking', 'ad', 'comments', 'codepen', 'sassmeister'].forEach(function (key) {
      if (this.conf[key] === true) {
        this[key]();
      }
    }.bind(this));
  };

  App.prototype.tracking = function () {
    global._gaq = [
      ['_setAccount','UA-30333387-2'],
      ['_trackPageview']
    ];

    this._inject("//www.google-analytics.com/ga.js");
  };

  App.prototype.ad = function () {
    this._inject("//engine.carbonads.com/z/24598/azcarbon_2_1_0_HORIZ");
  };

  App.prototype.comments = function () {
    global.disqus_shortname = this.conf.disqus.name;
    global.disqus_url = this.conf.disqus.url;
    global.disqus_title = this.conf.disqus.title;

    this._inject("//" + disqus_shortname + ".disqus.com/embed.js");
  };

  App.prototype.codepen = function () {
    this._inject("//codepen.io/assets/embed/ei.js");
  };

  App.prototype.sassmeister = function () {
    this._inject("//static.sassmeister.com/js/embed.js");
  };

  App.prototype._inject = function (url) {
    var d = document,
        s = "script",
        g = d.createElement(s),
        z = d.getElementsByTagName(s)[0];

    g.async = true;
    g.src = url;
    z.parentNode.insertBefore(g, z);
  };

  global.App = App;
}(window));
