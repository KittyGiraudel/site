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
  
}(window));