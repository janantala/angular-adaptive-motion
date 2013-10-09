/*global motion */
(function () {
'use strict';

/**
 * The main controller for the app. 
 */
motion.controller('mainCtrl', function mainCtrl($scope, $rootScope, $motion) {
  $motion.start();

  $motion.onSwipeLeft(function(data){
    console.log('onSwipeLeft');
  });

  $motion.onSwipeRight(function(data){
    console.log('onSwipeRight');
  });

  $motion.onSwipeUp(function(data){
    console.log('onSwipeUp');
  });

  $motion.onSwipeDown(function(data){
    console.log('onSwipeDown');
  });

});

})();