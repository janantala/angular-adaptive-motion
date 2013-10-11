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
    console.log('onSwipeLeft');
    playSound();
    $scope.$apply();
  });

  $motion.onSwipeRight(function(data){
    console.log('onSwipeRight');
    playSound();
    $scope.$apply();
  });

  $motion.onSwipeUp(function(data){
    console.log('onSwipeUp');
    playSound();
    $scope.$apply();
  });

  $motion.onSwipeDown(function(data){
    console.log('onSwipeDown');
    playSound();
    $scope.$apply();
  });

});

})();