/*global motion */
(function () {
'use strict';

/**
 * The main controller for the app. 
 */
motion.controller('mainCtrl', function mainCtrl($scope, $rootScope, $motion) {

  var playSound = function(){
    var audio = new Audio('/assets/lightsaber.wav');
    audio.play();
  };


  $motion.start();

  $motion.onSwipeLeft(function(data){
    $scope.$apply(function(){
      console.log('onSwipeLeft');
      playSound();
    });
  });

  $motion.onSwipeRight(function(data){
    $scope.$apply(function(){
      console.log('onSwipeRight');
      playSound();
    });
  });

  $motion.onSwipeUp(function(data){
    $scope.$apply(function(){
      console.log('onSwipeUp');
      playSound();
    });
  });

  $motion.onSwipeDown(function(data){
    $scope.$apply(function(){
      console.log('onSwipeDown');
      playSound();
    });
  });

});

})();