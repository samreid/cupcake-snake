// Copyright 2015, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Chandrashekar Bemagoni (Actual Concepts)
 */
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