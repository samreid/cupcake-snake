define( function( require ) {
  'use strict';

  // modules
  var CupcakeSnakeScreen = require( 'CUPCAKE_SNAKE/CupcakeSnakeScreen' );
  var App = require( 'CUPCAKE_SNAKE/App' );
  var SimLauncher = require( 'JOIST/SimLauncher' );

  // strings
  var simOptions = {
    credits: {}
  };

  SimLauncher.launch( function() {
    var app = new App( 'Cupcake Snake', [ new CupcakeSnakeScreen() ], simOptions );
    app.start();
  } );
} );