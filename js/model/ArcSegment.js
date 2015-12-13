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
  var Arc = require( 'KITE/segments/Arc' );

  function ArcSegment( initialPosition, initialDirection, startLength, radius, anticlockwise ) {
    var directionToCenter = anticlockwise ? initialDirection.perpendicular() : initialDirection.perpendicular().negate();
    var center = initialPosition.plus( directionToCenter.timesScalar( radius ) );
    var startAngle = directionToCenter.negated().angle();
    var endAngle = startAngle;

    SnakeSegment.call( this, new Arc( center, radius, startAngle, endAngle, anticlockwise ), initialPosition, initialDirection, startLength );
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
      this.segment.invalidate();

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
      this.segment.invalidate();

      this.startLength += shrinkLength;
    },

    toString: function() {
      return 'Arc(' + this.length + ',' + this.start.toString() + ',' + this.end.toString() + ')';
    },

    drawContext: function( context ) {
      context.arc( this.center.x, this.center.y, this.radius, this.startAngle, this.endAngle, this.anticlockwise );
    },

    drawReverseContext: function( context ) {
      context.arc( this.center.x, this.center.y, this.radius, this.endAngle, this.startAngle, !this.anticlockwise );
    },

    set radius( value ) {
      this.segment.radius = value;
    },
    get radius() {
      return this.segment.radius;
    },

    set center( value ) {
      this.segment.center = value;
    },
    get center() {
      return this.segment.center;
    },

    set anticlockwise( value ) {
      this.segment.anticlockwise = value;
    },
    get anticlockwise() {
      return this.segment.anticlockwise;
    },

    set startAngle( value ) {
      this.segment.startAngle = value;
    },
    get startAngle() {
      return this.segment.startAngle;
    },

    set endAngle( value ) {
      this.segment.endAngle = value;
    },
    get endAngle() {
      return this.segment.endAngle;
    }
  } );
} );