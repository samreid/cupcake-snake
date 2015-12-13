// Copyright 2015

/**
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var cupcakeSnake = require( 'CUPCAKE_SNAKE/cupcakeSnake' );

  function SnakeSegment( segment, initialPosition, initialDirection, initialLength ) {
    this.segment = segment;

    this.startTangent = initialDirection.copy();
    this.endTangent = initialDirection.copy();

    this.startLength = initialLength;
    this.endLength = initialLength;
  }
  cupcakeSnake.register( 'SnakeSegment', SnakeSegment );

  return inherit( Object, SnakeSegment, {
    get length() {
      return this.endLength - this.startLength;
    },

    get start() {
      return this.segment.start;
    },
    set start( value ) {
      this.segment.start = value;
    },

    get end() {
      return this.segment.end;
    },
    set end( value ) {
      this.segment.end = value;
    }
  } );
} );