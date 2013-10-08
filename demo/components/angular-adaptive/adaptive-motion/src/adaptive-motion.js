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
  var ccanvas = document.createElement('canvas');
  var _ = canvas.getContext('2d');
  var c_ = ccanvas.getContext('2d');

  var compression = 5;
  var width = 0;
  var height = 0;

  var draw;

  var start = function(){
    console.log('start');

    var hasGetUserMedia = function() {
      return !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
    };

    window.URL = window.URL || window.webkitURL;
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

    if (navigator.getUserMedia) {
      navigator.getUserMedia({audio: false, video: true},
        function(stream){
          video.src = window.URL.createObjectURL(stream);
          video.addEventListener('play', function() {
            window.setTimeout(function(){
              requestId = window.requestAnimationFrame(dump);
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
  };

  var dump = function() {
    if (canvas.width != video.videoWidth){
      width = Math.floor(video.videoWidth/compression);
      height = Math.floor(video.videoHeight/compression);
      canvas.width = ccanvas.width = width;
      canvas.height = ccanvas.height = height;
    }

    _.drawImage(video,0,0,width,height);
    draw = _.getImageData(0,0,width,height);
    // c_.putImageData(draw,0,0);
    skinfilter();
    test();

    requestId = window.requestAnimationFrame(dump);
  };

var huemin=0.0;
var huemax=0.10;
var satmin=0.0;
var satmax=1.0;
var valmin=0.4;
var valmax=1.0;

var skinfilter = function(){

  var skin_filter = _.getImageData(0,0,width,height);
  var total_pixels = skin_filter.width*skin_filter.height;
  var index_value = total_pixels*4;

  var count_data_big_array = 0;
  for (var y=0; y<height; y++)
  {
    for (var x=0; x<width; x++)
    {
      index_value = x+y*width;
      var r = draw.data[count_data_big_array];
      var g = draw.data[count_data_big_array+1];
      var b = draw.data[count_data_big_array+2];
      var a = draw.data[count_data_big_array+3];

      var hsv = rgb2Hsv(r,g,b);
      //When the hand is too lose (hsv[0] > 0.59 && hsv[0] < 1.0)
      //Skin Range on HSV values
      if(((hsv[0] > huemin && hsv[0] < huemax)||(hsv[0] > 0.59 && hsv[0] < 1.0))&&(hsv[1] > satmin && hsv[1] < satmax)&&(hsv[2] > valmin && hsv[2] < valmax)){
        skin_filter[count_data_big_array]=r;
        skin_filter[count_data_big_array+1]=g;
        skin_filter[count_data_big_array+2]=b;
        skin_filter[count_data_big_array+3]=a;
      }
      else{
        skin_filter.data[count_data_big_array]=0;
        skin_filter.data[count_data_big_array+1]=0;
        skin_filter.data[count_data_big_array+2]=0;
        skin_filter.data[count_data_big_array+3]=0;
      }

      count_data_big_array = index_value * 4;
    }
  }
  draw = skin_filter;
};

var rgb2Hsv = function(r, g, b){

  r = r/255;
  g = g/255;
  b = b/255;

  var max = Math.max(r, g, b);
  var min = Math.min(r, g, b);

  var h, s, v = max;

  var d = max - min;

  s = max === 0 ? 0 : d / max;

  if(max == min){
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

var last = false;
var thresh = 150;
var down = false;
var wasdown = false;

var test = function(){
  var delt = _.createImageData(width,height);
  var totalx = 0;
  var totaly = 0;
  var totald = 0;
  var totaln = delt.width * delt.height;
  var dscl = 0;
  var pix = totaln * 4;

  if(last !== false){

    while(pix-=4) {
      var d=Math.abs(
        draw.data[pix]-last.data[pix]
      )+Math.abs(
        draw.data[pix+1]-last.data[pix+1]
      )+Math.abs(
        draw.data[pix+2]-last.data[pix+2]
      );

      if(d>thresh){
        delt.data[pix]=160;
        delt.data[pix+1]=255;
        delt.data[pix+2]=255;
        delt.data[pix+3]=255;
        totald+=1;
        totalx+=((pix/4)%width);
        totaly+=(Math.floor((pix/4)/delt.height));
      }
      else{
        delt.data[pix]=0;
        delt.data[pix+1]=0;
        delt.data[pix+2]=0;
        delt.data[pix+3]=0;
      }
    }
  }

  if (totald){
    down = {
      x: totalx/totald,
      y: totaly/totald,
      d: totald
    };
    handleGesture();
  }

  last = draw;
  c_.putImageData(delt,0,0);
};

var movethresh = 2;
var brightthresh = 300;
var overthresh = 1000;

var calibrate = function(){
  wasdown = {
    x: down.x,
    y: down.y,
    d: down.d
  };
}

var avg = 0;
var state = 0; //States: 0 waiting for gesture, 1 waiting for next move after gesture, 2 waiting for gesture to end

var handleGesture = function(){
  avg = 0.9 * avg + 0.1 * down.d;
  var davg = down.d - avg;
  var good = davg > brightthresh;

  switch (state){
    case 0:
      if (good){ //Found a gesture, waiting for next move
        state = 1;
        calibrate();
      }
      break;
    case 2: //Wait for gesture to end
      if (!good){ //Gesture ended
        state = 0;
      }
      break;
    case 1: //Got next move, do something based on direction
      var dx = down.x - wasdown.x;
      var dy = down.y - wasdown.y;
      var dirx = Math.abs(dy) < Math.abs(dx); //(dx,dy) is on a bowtie
      console.log(dx, dy, dirx);

      if (dirx) {
        if (dx < - movethresh){
          console.log('Swipe right.');
        }
        else if (dx > movethresh){
          console.log('Swipe left.');
        }
      }
      else {
        if (dy > movethresh){
          console.log('Swipe down.');
        }
        else if (dy < - movethresh){
          console.log('Swipe up.');
        }
      }

      state = 2;
      break;
  }
};


  this.$get = function() {
    return {
      start: function(){
        start();
      },
      stop: function(){
        stop();
      }
    };
  };
}]);

})();