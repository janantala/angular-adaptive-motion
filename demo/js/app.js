/*global angular */
/*jshint unused:false */
'use strict';

/**
 * @type {angular.Module}
 */
var motion = angular.module('motion', ['ngAnimate', 'adaptive.motion']);

motion.config(function ($motionProvider) {
  $motionProvider.setTreshold({
    'rgb': 150,
    'move': 3,
    'bright': 300
  });
});