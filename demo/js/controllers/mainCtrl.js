/*global motion */
(function () {
'use strict';

/**
 * The main controller for the app. 
 */
motion.controller('mainCtrl', function mainCtrl($scope, $rootScope, $motion) {

  $scope.visualization = 'edge';

  var playSound = function(){
    var audio = new Audio('/assets/lightsaber.wav');
    audio.play();
  };

  $scope.gestures = [];
  $motion.start();

  $motion.onSwipeLeft(function(data){
    $scope.$apply(function(){
      console.log('onSwipeLeft');
      $scope.gestures.unshift('Swipe Left');
      playSound();
    });
  });

  $motion.onSwipeRight(function(data){
    $scope.$apply(function(){
      console.log('onSwipeRight');
      $scope.gestures.unshift('Swipe Right');
      playSound();
    });
  });

  $motion.onSwipeUp(function(data){
    $scope.$apply(function(){
      console.log('onSwipeUp');
      $scope.gestures.unshift('Swipe Up');
      playSound();
    });
  });

  $motion.onSwipeDown(function(data){
    $scope.$apply(function(){
      console.log('onSwipeDown');
      $scope.gestures.unshift('Swipe Down');
      playSound();
    });
  });

});

})();