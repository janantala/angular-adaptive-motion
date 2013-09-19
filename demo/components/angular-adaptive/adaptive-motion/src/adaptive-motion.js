/**
 * angular-adaptive-motion v0.1.0
 * The MIT License
 * Copyright (c) 2013 Jan Antala
 */

(function () {

var adaptive = angular.module('adaptive.motion', []);

adaptive.provider('$motion', [function() {

  var start = function(){
    console.log('start');
  };

  this.$get = function() {
    return {
      start: function(){
        start();
      }
    };
  };
}]);

})();