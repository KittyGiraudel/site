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

    if (window.matchMedia('(min-width: 750px').matches) {
      var gridify = this.gridifyImages.bind(this);
      window.addEventListener('resize', gridify);
      gridify();
    }
  };

  App.prototype.gridifyImage = function (image, containerWidth) {
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

  App.prototype.gridifyImages = function () {
    var images = document.querySelectorAll('img');
    var containerWidth = document
      .querySelector('.container')
      .offsetWidth - (40 * 2);

    var gridify = this.gridifyImage;
    Array.prototype.forEach.call(images, function (image) {
      gridify(image, containerWidth);
    });
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
