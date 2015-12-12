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
  var LineSegment = require( 'CUPCAKE_SNAKE/model/LineSegment' );
  var ArcSegment = require( 'CUPCAKE_SNAKE/model/ArcSegment' );

  function Snake( initialPosition, initialDirection, initialLength, initialRadius ) {
    this.position = initialPosition;
    this.direction = initialDirection; // unit vector

    this.radius = initialRadius;
    this.motion = Snake.STRAIGHT;

    var firstSegment = new LineSegment( initialPosition, initialDirection, 0 );
    firstSegment.growStep( initialLength );
    this.currentSegment = firstSegment;
    this.segments = [ firstSegment ];

    this.elapsedLength = initialLength; // includes parts that have disappeared
  }
  cupcakeSnake.register( 'Snake', Snake );

  inherit( Object, Snake, {
    step: function( growLength, shrinkLength, direction ) {
      if ( direction !== this.motion ) {
        this.currentSegment = null;
        this.motion = direction;
      }

      // On a radius change, we need to interrupt our current segment.
      if ( this.currentSegment && this.motion !== Snake.STRAIGHT && this.radius !== this.currentSegment.radius ) {
        this.currentSegment = null;
      }

      if ( !this.currentSegment ) {
        if ( this.motion === Snake.STRAIGHT ) {
          this.currentSegment = new LineSegment( this.position, this.direction, this.elapsedLength );
        }
        else if ( this.motion === Snake.LEFT ) {
          this.currentSegment = new ArcSegment( this.position, this.direction, this.elapsedLength, this.radius, true );
        }
        else if ( this.motion === Snake.RIGHT ) {
          this.currentSegment = new ArcSegment( this.position, this.direction, this.elapsedLength, this.radius, false );
        }
        this.addSegment( this.currentSegment );
      }

      this.currentSegment.growStep( growLength );
      this.position.set( this.currentSegment.end );
      this.direction.set( this.currentSegment.endTangent );

      while ( shrinkLength > 0 ) {
        var segment = this.segments[ 0 ];
        if ( shrinkLength >= segment.length ) {
          shrinkLength -= segment.length;
          this.removeSegment( segment );
        }
        else {
          segment.shrinkStep( shrinkLength );
          break;
        }
      }

      this.elapsedLength += growLength;
    },

    addSegment: function( segment ) {
      this.segments.push( segment );
    },

    removeSegment: function( segment ) {
      assert && assert( this.segments[ 0 ] === segment );
      this.segments.shift();
    },

    toString: function() {
      return this.segments.map( function( segment ) { return segment.toString(); } ).join( '\n' );
    }
  }, {
    // motion orientations
    LEFT: -1,
    STRAIGHT: 0,
    RIGHT: 1
  } );

  return Snake;
} );