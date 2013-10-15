# adaptive-motion v0.1.0 [![Build Status](https://travis-ci.org/angular-adaptive/adaptive-motion.png?branch=master)](https://travis-ci.org/angular-adaptive/adaptive-motion)

This module allows you to control an AngularJS app using web camera.

### Demo

Check out http://angular-adaptive.github.io/adaptive-motion/demo/

# Requirements

- AngularJS v 1.0+

# Usage

We use [bower](http://twitter.github.com/bower/) for dependency management. Add

    dependencies: {
        "angular-adaptive-motion": "latest"
    }

To your `bower.json` file. Then run

    bower install

This will copy the angular-isbn files into your `bower_components` folder, along with its dependencies. Load the script files in your application:

    <script type="text/javascript" src="components/angular/angular.js"></script>
    <script type="text/javascript" src="components/angular-adaptive-motion/src/adaptive-motion.js"></script>

Add the **adaptive.motion** module as a dependency to your application module:

    var myAppModule = angular.module('MyApp', ['adaptive.motion']);

and include $motion provider as a dependency to your controller:

    angular.module('MyApp').controller('MainCtrl', function ['$scope', '$motion', ($scope, $motion) {

    }]);

### Configuration

You can configure provider to a custom settings in app configuration.

    

### Public methods

#### $motion.start();

#### $motion.stop();

#### $motion.onSwipeLeft(cb);

#### $motion.onSwipeRight(cb);

#### $motion.onSwipeUp(cb);

#### $motion.onSwipeDown(cb);

### Directive

If you want to visualize you can add `adaptive-motion` attribute into your canvas element.

```
<canvas adaptive-motion="video"></canvas>
```

```
<canvas adaptive-motion="skin"></canvas>
```

```
<canvas adaptive-motion="edge"></canvas>
```
    
# Contributing

Contributions are welcome. Please make a pull request against canary branch and do not bump versions. Also include tests.

# Testing

We use karma and jshint to ensure the quality of the code. The easiest way to run these checks is to use grunt:

    npm install -g grunt-cli
    npm install
    bower install
    grunt

The karma task will try to open Chrome as a browser in which to run the tests. Make sure this is available or change the configuration in `test/test.config.js` 

# References

Check out [willy-vvu`s](https://github.com/willy-vvu) webcam-based control of [reveal.js fork](https://github.com/willy-vvu/reveal.js).


# License

The MIT License

Copyright (c) 2013 Jan Antala, https://github.com/janantala
