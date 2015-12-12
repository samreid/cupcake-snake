// Copyright 2015

/**
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var cupcakeSnake = require( 'CUPCAKE_SNAKE/cupcakeSnake' );

  function SnakeSegment( initialPosition, initialDirection, initialLength ) {
    this.start = initialPosition.copy();
    this.end = initialPosition.copy();

    this.startTangent = initialDirection.copy();
    this.endTangent = initialDirection.copy();

    this.startLength = initialLength;
    this.endLength = initialLength;
  }
  cupcakeSnake.register( 'SnakeSegment', SnakeSegment );

  return inherit( Object, SnakeSegment, {
    get length() {
      return this.endLength - this.startLength;
    }
  } );
} );