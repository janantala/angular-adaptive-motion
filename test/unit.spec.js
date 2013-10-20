describe('adaptive.motion', function() {

  describe('$motionProvider config', function() {
    var $motion;

    beforeEach(module('adaptive.motion', function($motionProvider) {
      $motion = $motionProvider;
    }));

    it('should be defined', inject(function() {
      expect($motion).toBeDefined();
      expect(typeof $motion).toBe('object');
    }));

    it('should have default treshold options', inject(function() {
      expect($motion.treshold).toBeDefined();
      expect($motion.treshold.rgb).toBeDefined();
      expect($motion.treshold.move).toBeDefined();
      expect($motion.treshold.bright).toBeDefined();
    }));

    it('should have setTreshold method', inject(function() {
      expect($motion.setTreshold).toBeDefined();
      expect(typeof $motion.setTreshold).toBe('function');

      $motion.setTreshold({
        'rgb': 123
      });

      expect($motion.treshold.rgb).toBe(123);
    }));

  });

  describe('$get methods', function() {

    beforeEach(module('adaptive.motion', function() {

    }));

    it('should have public methods', inject(function($motion) {
      expect($motion).toBeDefined();
      expect($motion.start).toBeDefined();
      expect($motion.stop).toBeDefined();
      expect($motion.onStart).toBeDefined();
      expect($motion.onStop).toBeDefined();
      expect($motion.onError).toBeDefined();
      expect($motion.onSwipeLeft).toBeDefined();
      expect($motion.onSwipeRight).toBeDefined();
      expect($motion.onSwipeUp).toBeDefined();
      expect($motion.onSwipeDown).toBeDefined();

      expect(typeof $motion.start).toBe('function');
      expect(typeof $motion.stop).toBe('function');
      expect(typeof $motion.onStart).toBe('function');
      expect(typeof $motion.onStop).toBe('function');
      expect(typeof $motion.onError).toBe('function');
      expect(typeof $motion.onSwipeLeft).toBe('function');
      expect(typeof $motion.onSwipeRight).toBe('function');
      expect(typeof $motion.onSwipeUp).toBe('function');
      expect(typeof $motion.onSwipeDown).toBe('function');
    }));

    it('should have called rootScope.$broadcast', inject(function($motion, $rootScope){

      spyOn($rootScope, '$on').andCallThrough();
      spyOn($rootScope, '$broadcast').andCallThrough();
      $rootScope.$apply();

      var counter = 0;

      $motion.onSwipeLeft(function(){
        counter++;
      });

      $motion.onSwipeRight(function(){
        counter++;
      });

      $motion.onSwipeUp(function(){
        counter++;
      });

      $motion.onSwipeDown(function(){
        counter++;
      });
      

      $rootScope.$broadcast('adaptive.motion:onSwipeLeft');
      expect($rootScope.$broadcast).toHaveBeenCalled();
      expect(counter).toBe(1);

      $rootScope.$broadcast('adaptive.motion:onSwipeRight');
      expect($rootScope.$broadcast).toHaveBeenCalled();
      expect(counter).toBe(2);

      $rootScope.$broadcast('adaptive.motion:onSwipeUp');
      expect($rootScope.$broadcast).toHaveBeenCalled();
      expect(counter).toBe(3);

      $rootScope.$broadcast('adaptive.motion:onSwipeDown');
      expect($rootScope.$broadcast).toHaveBeenCalled();
      expect(counter).toBe(4);
    }));

  });
});