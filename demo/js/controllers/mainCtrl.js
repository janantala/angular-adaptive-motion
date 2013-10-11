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

  $scope.lightsaberDirection = '';
  $motion.start();

  $motion.onSwipeLeft(function(data){
    $scope.$apply(function(){
      console.log('onSwipeLeft');
      $scope.lightsaberDirection = 'lightsaber-left';
      playSound();
    });
  });

  $motion.onSwipeRight(function(data){
    $scope.$apply(function(){
      console.log('onSwipeRight');
      $scope.lightsaberDirection = 'lightsaber-right';
      playSound();
    });
  });

  $motion.onSwipeUp(function(data){
    $scope.$apply(function(){
      console.log('onSwipeUp');
      $scope.lightsaberDirection = 'lightsaber-up';
      playSound();
    });
  });

  $motion.onSwipeDown(function(data){
    $scope.$apply(function(){
      console.log('onSwipeDown');
      $scope.lightsaberDirection = 'lightsaber-down';
      playSound();
    });
  });

});

})();