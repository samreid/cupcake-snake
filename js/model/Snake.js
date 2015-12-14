// Copyright 2015

/**
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Util = require( 'DOT/Util' );
  var cupcakeSnake = require( 'CUPCAKE_SNAKE/cupcakeSnake' );
  var LineSegment = require( 'CUPCAKE_SNAKE/model/LineSegment' );
  var ArcSegment = require( 'CUPCAKE_SNAKE/model/ArcSegment' );
  var Intersection = require( 'CUPCAKE_SNAKE/model/Intersection' );

  function Snake( initialPosition, initialDirection, initialLength, initialRadius ) {
    this.initialize( initialPosition, initialDirection, initialLength, initialRadius );

    this.initialLength = initialLength;
    this.initialRadius = initialRadius;
  }
  cupcakeSnake.register( 'Snake', Snake );

  inherit( Object, Snake, {
    initialize: function( initialPosition, initialDirection, initialLength, initialRadius ) {
      this.position = initialPosition;
      this.direction = initialDirection; // unit vector

      this.radius = initialRadius;
      this.motion = Snake.STRAIGHT;

      this.tongueExtension = 0; // 0 to 8
      this.tongueExtending = false;

      this.totalLengthCut = 0;

      var firstSegment = new LineSegment( initialPosition, initialDirection, 0 );
      firstSegment.growStep( initialLength );
      this.currentSegment = firstSegment;
      this.segments = [ firstSegment ];

      this.elapsedLength = initialLength; // includes parts that have disappeared
    },

    reinitialize: function( initialPosition, initialDirection, initialLength, initialRadius ) {
      this.initialize( initialPosition, initialDirection, initialLength, initialRadius );
    },

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

      this.shrink( shrinkLength );

      this.elapsedLength += growLength;

      if ( this.tongueExtending || this.tongueExtension !== 0 ) {
        this.tongueExtension = Math.max( this.tongueExtension + ( this.tongueExtending ? growLength : -growLength ) / 2, 0 );
        if ( this.tongueExtension > 8 ) {
          this.tongueExtension = Math.max( 16 - this.tongueExtension, 0 );
          this.tongueExtending = false;
        }
      }

      // Check self-intersection of the current segment with the parts of the body it can intersect with.
      var selfIntersection = this.intersectRange( this.currentSegment.segment, 0, this.segments.length - 2 );
      if ( selfIntersection ) {
        this.cut( selfIntersection.length );
      }

      // Check for a 360-degree loop, which will cut off everything but one loop's worth
      if ( this.currentSegment.segment.radius && Math.abs( this.currentSegment.segment.startAngle - this.currentSegment.segment.endAngle ) >= Math.PI * 2 - 0.00001 ) {
        this.cut( this.currentSegment.endLength - 2 * Math.PI * this.currentSegment.segment.radius );
      }
    },

    shrink: function( length ) {
      while ( length > 0 ) {
        var segment = this.segments[ 0 ];
        if ( length >= segment.length ) {
          length -= segment.length;
          this.removeSegment( segment );
        }
        else {
          segment.shrinkStep( length );
          break;
        }
      }
    },

    cut: function( atLength ) {
      assert && assert( atLength >= this.startLength && atLength < this.endLength );

      var amountToCut = Math.max( atLength - this.startLength, 0 );

      this.totalLengthCut += amountToCut;

      this.shrink( amountToCut );
    },

    triggerTongue: function() {
      if ( this.tongueExtension === 0 ) {
        this.tongueExtending = true;
      }
    },

    resetTongue: function() {
      this.tongueExtension = 0;
      this.tongueExtending = false;
    },

    addSegment: function( segment ) {
      this.segments.push( segment );
    },

    removeSegment: function( segment ) {
      assert && assert( this.segments[ 0 ] === segment );
      this.segments.shift();
    },

    intersectsSegments: function( segments, headOnly ) {
      var hit = false;
      var myLength = this.segments.length;
      for ( var i = 0; i < segments.length; i++ ) {
        var segment = segments[ i ];
        var hits = this.intersectRange( segment, headOnly ? ( myLength - 1 ) : 0, myLength );
        if ( hits ) {
          hit = true;
          break;
        }
      }
      return hit;
    },

    // only concerned with the intersection closest to the snake head
    intersectRange: function( segment, firstIndex, beforeIndex ) {
      assert && assert( firstIndex >= 0 );
      assert && assert( beforeIndex <= this.segments.length );

      var latestLength = Number.NEGATIVE_INFINITY;
      var latestT = 0;
      var latestPoint = null;
      for ( var i = beforeIndex - 1; i >= firstIndex; i-- ) {
        var snakeSegment = this.segments[ i ];
        var hits = Intersection.intersect( segment, snakeSegment.segment );
        if ( hits ) {
          for ( var k = 0; k < hits.length; k++ ) {
            var hit = hits[ k ];

            var intersectionLength = Util.linear( 0, 1, snakeSegment.startLength, snakeSegment.endLength, hit.tSecond );
            if ( intersectionLength > latestLength ) {
              latestLength = intersectionLength;
              latestT = hit.tFirst;
              latestPoint = hit.intersection;
            }
          }
        }

        // Since we are traversing the segments array backwards (head to tail), if we get a hit we can bail and not
        // test segments further down the tail (since they are farther from the head).
        if ( latestPoint ) {
          break;
        }
      }

      if ( latestPoint ) {
        return {
          point: latestPoint, // point of intersection
          t: latestT, // t-value for the segment passed in as a parameter
          length: latestLength // length (position) in snake
        };
      }
      else {
        return null;
      }
    },

    get startLength() {
      if ( this.segments.length === 0 ) {
        return 0;
      }
      else {
        return this.segments[ 0 ].startLength;
      }
    },

    get endLength() {
      if ( this.segments.length === 0 ) {
        return 0;
      }
      else {
        return this.segments[ this.segments.length - 1 ].endLength;
      }
    },

    get length() {
      var numSegments = this.segments.length;
      if ( numSegments === 0 ) {
        return 0;
      }
      else {
        return this.segments[ numSegments - 1 ].endLength - this.segments[ 0 ].startLength;
      }
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