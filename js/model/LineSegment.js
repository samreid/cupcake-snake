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
  var SnakeSegment = require( 'CUPCAKE_SNAKE/model/SnakeSegment' );
  var Vector2 = require( 'DOT/Vector2' );

  var scratchVector = new Vector2();

  function LineSegment( initialPosition, initialDirection, startLength ) {
    SnakeSegment.call( this, initialPosition, initialDirection, startLength );
  }
  cupcakeSnake.register( 'LineSegment', LineSegment );

  return inherit( SnakeSegment, LineSegment, {
    growStep: function( growLength ) {
      // end = end + endTangent * growLength
      scratchVector.set( this.endTangent ).multiplyScalar( growLength );
      this.end.add( scratchVector );

      this.endLength += growLength;
    },

    shrinkStep: function( shrinkLength ) {
      // start = start + startTangent * shrinkLength
      scratchVector.set( this.startTangent ).multiplyScalar( shrinkLength );
      this.start.add( scratchVector );

      this.startLength += shrinkLength;
    },

    toString: function() {
      return 'Line(' + this.length + ',' + this.start.toString() + ',' + this.end.toString() + ')';
    },

    drawContext: function( context ) {
      context.lineTo( this.end.x, this.end.y );
    }
  } );
} );