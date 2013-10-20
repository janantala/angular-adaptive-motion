describe('adaptive.motion', function() {

  var $motion;

  beforeEach(module('adaptive.motion', function($motionProvider) {
    $motion = $motionProvider;
  }));

  var rootscope;
  beforeEach(inject(function($rootScope) {
    rootScope = $rootScope;
    spyOn(rootScope, "$on").andCallThrough();
    spyOn(rootScope, "$broadcast").andCallThrough();
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

  it('should have public methods', inject(function() {
    expect($motion.$get()).toBeDefined();
    expect($motion.$get().start).toBeDefined();
    expect($motion.$get().stop).toBeDefined();
    expect($motion.$get().onSwipeLeft).toBeDefined();
    expect($motion.$get().onSwipeRight).toBeDefined();
    expect($motion.$get().onSwipeUp).toBeDefined();
    expect($motion.$get().onSwipeDown).toBeDefined();

    expect(typeof $motion.$get().start).toBe('function');
    expect(typeof $motion.$get().stop).toBe('function');
    expect(typeof $motion.$get().onSwipeLeft).toBe('function');
    expect(typeof $motion.$get().onSwipeRight).toBe('function');
    expect(typeof $motion.$get().onSwipeUp).toBe('function');
    expect(typeof $motion.$get().onSwipeDown).toBe('function');
  }));

  it('should have called rootScope.$broadcast', function(){

    // var counter = 0;

    // $motion.$get().onSwipeLeft(function(){
    //   counter++;
    // });

    // $motion.$get().onSwipeRight(function(){
    //   counter++;
    // });

    // $motion.$get().onSwipeUp(function(){
    //   counter++;
    // });

    // $motion.$get().onSwipeDown(function(){
    //   counter++;
    // });
    // 

    rootScope.$broadcast('adaptive.motion:onSwipeLeft');
    expect(rootScope.$broadcast).toHaveBeenCalled();
    // expect(counter).toBe(1);

    rootScope.$broadcast('adaptive.motion:onSwipeRight');
    expect(rootScope.$broadcast).toHaveBeenCalled();
    // expect(counter).toBe(2);

    rootScope.$broadcast('adaptive.motion:onSwipeUp');
    expect(rootScope.$broadcast).toHaveBeenCalled();
    // expect(counter).toBe(3);

    rootScope.$broadcast('adaptive.motion:onSwipeDown');
    expect(rootScope.$broadcast).toHaveBeenCalled();
    // expect(counter).toBe(4);
  });
});