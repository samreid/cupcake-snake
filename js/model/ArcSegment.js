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

  function ArcSegment( initialPosition, initialDirection, startLength, radius, anticlockwise ) {
    SnakeSegment.call( this, initialPosition, initialDirection, startLength );

    this.radius = radius;
    this.anticlockwise = anticlockwise;

    var directionToCenter = anticlockwise ? initialDirection.perpendicular() : initialDirection.perpendicular().negate();
    this.center = initialPosition.plus( directionToCenter.timesScalar( radius ) );

    this.startAngle = directionToCenter.negated().angle();
    this.endAngle = this.startAngle;
  }
  cupcakeSnake.register( 'ArcSegment', ArcSegment );

  return inherit( SnakeSegment, ArcSegment, {
    growStep: function( growLength ) {
      var angleDelta = growLength / this.radius;
      if ( this.anticlockwise ) {
        angleDelta = -angleDelta;
      }

      this.endAngle += angleDelta;
      this.end.setPolar( this.radius, this.endAngle ).add( this.center ); // center + offset from center
      this.endTangent.setPolar( 1, this.endAngle + ( this.anticlockwise ? -Math.PI / 2 : Math.PI / 2 ) );

      this.endLength += growLength;
    },

    shrinkStep: function( shrinkLength ) {
      var angleDelta = shrinkLength / this.radius;
      if ( this.anticlockwise ) {
        angleDelta = -angleDelta;
      }

      this.startAngle += angleDelta;
      this.start.setPolar( this.radius, this.startAngle ).add( this.center ); // center + offset from center
      this.startTangent.setPolar( 1, this.startAngle + ( this.anticlockwise ? -Math.PI / 2 : Math.PI / 2 ) );

      this.startLength += shrinkLength;
    },

    toString: function() {
      return 'Arc(' + this.length + ',' + this.start.toString() + ',' + this.end.toString() + ')';
    },

    drawContext: function( context ) {
      context.arc( this.center.x, this.center.y, this.radius, this.startAngle, this.endAngle, this.anticlockwise );
    }
  } );
} );