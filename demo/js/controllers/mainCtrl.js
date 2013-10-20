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

  var addGesture = function(gesture){
    $scope.gestures.push(gesture);
  };

  $scope.gestures = [];
  $motion.start();

  $motion.onSwipeLeft(function(data){
    $scope.$apply(function(){
      console.log('onSwipeLeft');
      addGesture('Swipe Left');
      playSound();
    });
  });

  $motion.onSwipeRight(function(data){
    $scope.$apply(function(){
      console.log('onSwipeRight');
      addGesture('Swipe Right');
      playSound();
    });
  });

  $motion.onSwipeUp(function(data){
    $scope.$apply(function(){
      console.log('onSwipeUp');
      addGesture('Swipe Up');
      playSound();
    });
  });

  $motion.onSwipeDown(function(data){
    $scope.$apply(function(){
      console.log('onSwipeDown');
      addGesture('Swipe Down');
      playSound();
    });
  });

  $motion.onStart(function(){
    console.log('onStart');
  });

  $motion.onStop(function(){
    console.log('onStart');
  });

  $motion.onError(function(err){
    console.error('onError', err);
    alert(err);
  });

});

})();