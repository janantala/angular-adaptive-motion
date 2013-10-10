/**
 * angular-adaptive-motion v0.1.0
 * The MIT License
 * Copyright (c) 2013 Jan Antala
 */

(function () {
'use strict';

var adaptive = angular.module('adaptive.motion', []);

// RequestAnimationFrame fallback
(function() {
  var lastTime = 0;
  var vendors = ['webkit', 'moz'];
  for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
      window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
      window.cancelAnimationFrame =
        window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = function(callback, element) {
          var currTime = new Date().getTime();
          var timeToCall = Math.max(0, 16 - (currTime - lastTime));
          var id = window.setTimeout(function() { callback(currTime + timeToCall); },
            timeToCall);
          lastTime = currTime + timeToCall;
          return id;
      };
  }

  if (!window.cancelAnimationFrame) {
      window.cancelAnimationFrame = function(id) {
          clearTimeout(id);
      };
  }
}());

adaptive.provider('$motion', [function() {

  var requestId;
  var video = document.createElement('video');
  video.setAttribute('autoplay', 'true');
  video.setAttribute('width', '300');
  var canvas = document.createElement('canvas');
  var _ = canvas.getContext('2d');
  

  var rgb2Hsv = function(r, g, b){

    r = r/255;
    g = g/255;
    b = b/255;

    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);

    var h, s, v = max;

    var d = max - min;

    s = max === 0 ? 0 : d / max;

    if (max == min){
        h = 0; // achromatic
    }
    else{
      switch(max){
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return [h, s, v];
  };

  


  this.$get = function($rootScope) {

    var compression = 5;
    var width = 0;
    var height = 0;

    var draw;
    var localMediaStream;

    var huemin = 0.0;
    var huemax = 0.10;
    var satmin = 0.0;
    var satmax = 1.0;
    var valmin = 0.4;
    var valmax = 1.0;

    var lastDraw;
    var thresh = 150;
    var lastDown = {
      x: 0,
      y: 0,
      d: 0
    };

    var start = function(){
      console.log('start');

      window.URL = window.URL || window.webkitURL;
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

      if (navigator.getUserMedia) {
        navigator.getUserMedia({audio: false, video: true},
          function(stream){
            localMediaStream = stream;
            video.src = window.URL.createObjectURL(stream);
            video.addEventListener('play', function() {
              window.setTimeout(function(){
                requestId = window.requestAnimationFrame(redraw);
              }, 1000);
            });
          },
          function(){
            console.error('Denied!');
          }
        );
      }
      else {
        console.error('getUserMedia() is not supported in your browser');
      }
    };

    var stop = function(){
      window.cancelAnimationFrame(requestId);
      localMediaStream && localMediaStream.stop();
      localMediaStream = undefined;
    };

    var redraw = function() {
      if (canvas.width !== video.videoWidth){
        width = Math.floor(video.videoWidth / compression);
        height = Math.floor(video.videoHeight / compression);
        canvas.width = width;
        canvas.height = height;
      }

      _.drawImage(video,0,0,width,height);
      draw = _.getImageData(0, 0, width, height);
      var skinFilter = filterSkin(draw);
      lastDraw = getMovements(skinFilter);

      requestId = window.requestAnimationFrame(redraw);
    };

    var filterSkin = function(draw){

      var skinFilter = _.getImageData(0,0,width,height);
      var totalPixels = skinFilter.width * skinFilter.height;
      var indexValue = totalPixels * 4;

      var countDataBigArray = 0;
      for (var y=0; y<height; y++)
      {
        for (var x=0; x<width; x++)
        {
          indexValue = x+y*width;
          var r = draw.data[countDataBigArray];
          var g = draw.data[countDataBigArray+1];
          var b = draw.data[countDataBigArray+2];
          var a = draw.data[countDataBigArray+3];

          var hsv = rgb2Hsv(r,g,b);
          //When the hand is too lose (hsv[0] > 0.59 && hsv[0] < 1.0)
          //Skin Range on HSV values
          if(((hsv[0] > huemin && hsv[0] < huemax)||(hsv[0] > 0.59 && hsv[0] < 1.0))&&(hsv[1] > satmin && hsv[1] < satmax)&&(hsv[2] > valmin && hsv[2] < valmax)){
            skinFilter[countDataBigArray] = r;
            skinFilter[countDataBigArray+1] = g;
            skinFilter[countDataBigArray+2] = b;
            skinFilter[countDataBigArray+3] = a;
          }
          else{
            skinFilter.data[countDataBigArray] = 0;
            skinFilter.data[countDataBigArray+1] = 0;
            skinFilter.data[countDataBigArray+2] = 0;
            skinFilter.data[countDataBigArray+3] = 0;
          }

          countDataBigArray = indexValue * 4;
        }
      }
      return skinFilter;
    };

    var getMovements = function(draw){
      var edge = _.createImageData(width, height);
      var totalx = 0;
      var totaly = 0;
      var totald = 0;
      var pix = edge.width * edge.height * 4;

      if (lastDraw){

        while ((pix -= 4) > 0) {
          var rgbaDelta = Math.abs(draw.data[pix] - lastDraw.data[pix]) +
                  Math.abs(draw.data[pix+1] - lastDraw.data[pix+1]) +
                  Math.abs(draw.data[pix+2] - lastDraw.data[pix+2]);

          if (rgbaDelta > thresh){
            edge.data[pix] = 0;
            edge.data[pix+1] = 0;
            edge.data[pix+2] = 0;
            edge.data[pix+3] = 255;
            totald += 1;
            totalx += (pix/4) % width;
            totaly += Math.floor((pix/4) / edge.height);
          }
          else {
            edge.data[pix] = 0;
            edge.data[pix+1] = 0;
            edge.data[pix+2] = 0;
            edge.data[pix+3] = 0;
          }
        }
      }

      $rootScope.$broadcast('adaptive.motion:onMovement', edge);
      

      if (totald){
        var down = {
          x: totalx / totald,
          y: totaly / totald,
          d: totald
        };
        recognizeGesture(down);
      }

      return draw;
    };

    var movethresh = 2;
    var brightthresh = 300;
    var overthresh = 1000;

    var calibrate = function(down){
      lastDown = {
        x: down.x,
        y: down.y,
        d: down.d
      };
    };

    var avg = 0;
    var state = 0; //States: 0 waiting for gesture, 1 waiting for next move after gesture, 2 waiting for gesture to end

    var recognizeGesture = function(down){
      avg = 0.9 * avg + 0.1 * down.d;
      var davg = down.d - avg;
      var foundGesture = davg > brightthresh;

      switch (state){
        case 0:
          if (foundGesture){ //Found a gesture, waiting for next move
            state = 1;
            calibrate(down);
          }
          break;
        case 2: //Wait for gesture to end
          if (!foundGesture){ //Gesture ended
            state = 0;
          }
          break;
        case 1: //Got next move, do something based on direction
          var dx = down.x - lastDown.x;
          var dy = down.y - lastDown.y;
          var dirx = Math.abs(dy) < Math.abs(dx) - movethresh; //(dx,dy) is on a bowtie
          var diry = Math.abs(dx) < Math.abs(dy) - movethresh; //(dx,dy) is on a bowtie
          console.log(dx, dy, dirx);

          if (dirx) {
            if (dx < - movethresh){
              $rootScope.$broadcast('adaptive.motion:onSwipeRight');
            }
            else if (dx > movethresh){
              $rootScope.$broadcast('adaptive.motion:onSwipeLeft');
            }
          }
          else if (diry) {
            if (dy > movethresh){
              $rootScope.$broadcast('adaptive.motion:onSwipeDown');
            }
            else if (dy < - movethresh){
              $rootScope.$broadcast('adaptive.motion:onSwipeUp');
            }
          }

          state = 2;
          break;
      }
    };

    var onSwipeLeft = function(cb){
      $rootScope.$on('adaptive.motion:onSwipeLeft', function(e, data){
        cb(data);
      });
    };

    var onSwipeRight = function(cb){
      $rootScope.$on('adaptive.motion:onSwipeRight', function(e, data){
        cb(data);
      });
    };

    var onSwipeUp = function(cb){
      $rootScope.$on('adaptive.motion:onSwipeUp', function(e, data){
        cb(data);
      });
    };

    var onSwipeDown = function(cb){
      $rootScope.$on('adaptive.motion:onSwipeDown', function(e, data){
        cb(data);
      });
    };

    return {
      start: function(){
        start();
      },
      stop: function(){
        stop();
      },
      onSwipeLeft: function(cb){
        onSwipeLeft(cb);
      },
      onSwipeRight: function(cb){
        onSwipeRight(cb);
      },
      onSwipeUp: function(cb){
        onSwipeUp(cb);
      },
      onSwipeDown: function(cb){
        onSwipeDown(cb);
      }
    };
  };
}]);

adaptive.directive('motion', ['$rootScope', function ($rootScope) {
  return {
    restrict: 'A',
    link: function postLink(scope, element, attrs) {
      var canvas = element[0];
      var _ = canvas.getContext('2d');

      $rootScope.$on('adaptive.motion:onMovement', function(e, edge){
        _.putImageData(edge, 0, 0);
      });
    }
  };
}]);

})();