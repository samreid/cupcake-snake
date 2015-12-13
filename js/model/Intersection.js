// Copyright 2015

/**
 * Faster intersection routines
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var cupcakeSnake = require( 'CUPCAKE_SNAKE/cupcakeSnake' );
  var Line = require( 'KITE/segments/Line' );
  var Arc = require( 'KITE/segments/Arc' );
  var Vector2 = require( 'DOT/Vector2' );

  var Intersection = {
    intersect: function( firstSegment, secondSegment ) {
      if ( !firstSegment.bounds.intersectsBounds( secondSegment.bounds ) ) {
        return null;
      }

      if ( firstSegment instanceof Line ) {
        if ( secondSegment instanceof Line ) {
          return Intersection.lineLine( firstSegment, secondSegment );
        }
        else if ( secondSegment instanceof Arc ) {
          return Intersection.lineArc( firstSegment, secondSegment );
        }
        else {
          throw new Error( 'intersect case' );
        }
      }
      else if ( firstSegment instanceof Arc ) {
        if ( secondSegment instanceof Line ) {
          var hits = Intersection.lineArc( secondSegment, firstSegment );
          if ( hits ) {
            hits = hits.map( Intersection.switchHit );
          }
          return hits;
        }
        else if ( secondSegment instanceof Arc ) {
          return Intersection.arcArc( firstSegment, secondSegment );
        }
        else {
          throw new Error( 'intersect case' );
        }
      }
      else {
        throw new Error( 'intersect case' );
      }
    },

    switchHit: function( hit ) {
      return {
        intersection: hit.intersection,
        tFirst: hit.tSecond,
        tSecond: hit.tFirst
      };
    },

    lineLine: function( firstLine, secondLine ) {
      var x1 = firstLine.start.x;
      var y1 = firstLine.start.y;
      var x2 = firstLine.end.x;
      var y2 = firstLine.end.y;
      var x3 = secondLine.start.x;
      var y3 = secondLine.start.y;
      var x4 = secondLine.end.x;
      var y4 = secondLine.end.y;

      /*
       * Algorithm taken from Paul Bourke, 1989:
       * http://paulbourke.net/geometry/pointlineplane/
       * http://paulbourke.net/geometry/pointlineplane/pdb.c
       * Ported from MathUtil.java on 9/20/2013 by @samreid
       */
      var numA = ( x4 - x3 ) * ( y1 - y3 ) - ( y4 - y3 ) * ( x1 - x3 );
      var numB = ( x2 - x1 ) * ( y1 - y3 ) - ( y2 - y1 ) * ( x1 - x3 );
      var denom = ( y4 - y3 ) * ( x2 - x1 ) - ( x4 - x3 ) * ( y2 - y1 );

      // If denominator is 0, the lines are parallel or coincident
      if ( denom === 0 ) {
        return null;
      }
      else {
        var ua = numA / denom;
        var ub = numB / denom;

        // ua and ub must both be in the range 0 to 1 for the segments to have an intersection pt.
        if ( !( ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1 ) ) {
          return null;
        }
        else {
          var x = x1 + ua * ( x2 - x1 );
          var y = y1 + ua * ( y2 - y1 );
          return [ {
            intersection: new Vector2( x, y ),
            tFirst: ua,
            tSecond: ub
          } ];
        }
      }
    },

    lineArc: function( line, arc ) {
      var position = line.start;
      var direction = line.startTangent;
      var lineLength = line.start.distance( line.end );
      var center = arc.center;
      var radius = arc.radius;

      // left here, if in the future we want to better-handle boundary points
      var epsilon = 0;

      // general line circle intersection
      var centerToRay = position.minus( center );
      var tmp = direction.dot( centerToRay );
      var centerToRayDistSq = centerToRay.magnitudeSquared();
      var discriminant = 4 * tmp * tmp - 4 * ( centerToRayDistSq - radius * radius );
      if ( discriminant < epsilon ) {
        // ray misses circle entirely
        return null;
      }
      var base = direction.dot( center ) - direction.dot( position );
      var sqt = Math.sqrt( discriminant ) / 2;
      var ta = ( base - sqt ) / lineLength;
      var tb = ( base + sqt ) / lineLength;

      var hasA = ta >= 0 && ta <= 1;
      var hasB = tb >= 0 && tb <= 1;

      if ( !hasA && !hasB ) {
        return null;
      }

      var result = [];

      if ( hasA ) {
        var pointA = line.positionAt( ta );
        var angleA = pointA.minus( center ).angle();
        if ( arc.containsAngle( angleA ) ) {
          result.push( {
            intersection: line.positionAt( ta ),
            tFirst: ta,
            tSecond: arc.tAtAngle( angleA )
          } );
        }
      }

      if ( hasB ) {
        var pointB = line.positionAt( tb );
        var angleB = pointB.minus( center ).angle();
        if ( arc.containsAngle( angleB ) ) {
          result.push( {
            intersection: line.positionAt( tb ),
            tFirst: tb,
            tSecond: arc.tAtAngle( angleB )
          } );
        }
      }

      if ( result.length ) {
        return result;
      }
      else {
        return null;
      }
    },

    arcArc: function( firstArc, secondArc ) {
      if ( firstArc.radius < secondArc.radius ) {
        var tmpResult = Intersection.arcArc( secondArc, firstArc );
        if ( tmpResult ) {
          tmpResult = tmpResult.map( Intersection.switchHit );
        }
        return tmpResult;
      }
      var delta = secondArc.center.minus( firstArc.center );
      var deltaAngle = delta.angle();
      var distance = delta.magnitude();

      // ensure one circle isn't contained in the other
      if ( distance < Math.abs( firstArc.radius - secondArc.radius ) ) {
        return null;
      }

      // ensure the circles aren't completely separate
      if ( distance > firstArc.radius + secondArc.radius ) {
        return null;
      }

      var firstRadiusSq = firstArc.radius * firstArc.radius;
      var secondRadiusSq = secondArc.radius * secondArc.radius;
      var distanceSq = distance * distance;

      // in the rotated coordinate frame where (0,0) is the first center and (distance,0) is the second center
      var relativeX;
      var relativeY;
      var relativeFirstAngle;
      var relativeSecondAngle;

      relativeX = ( firstRadiusSq - secondRadiusSq + distanceSq ) / ( 2 * distance );
      relativeY = Math.sqrt( firstRadiusSq - relativeX * relativeX );
      relativeFirstAngle = Math.atan2( relativeY, relativeX );
      relativeSecondAngle = Math.atan2( relativeY, relativeX - distance );

      var firstAngleA = deltaAngle + relativeFirstAngle;
      var firstAngleB = deltaAngle - relativeFirstAngle;
      var secondAngleA = deltaAngle + relativeSecondAngle;
      var secondAngleB = deltaAngle - relativeSecondAngle;

      var hasA = firstArc.containsAngle( firstAngleA ) && secondArc.containsAngle( secondAngleA );
      var hasB = firstArc.containsAngle( firstAngleB ) && secondArc.containsAngle( secondAngleB );

      if ( !hasA && !hasB ) {
        return null;
      }

      var result = [];

      if ( hasA ) {
        result.push( {
          intersection: firstArc.positionAtAngle( firstAngleA ),
          tFirst: firstArc.tAtAngle( firstAngleA ),
          tSecond: secondArc.tAtAngle( secondAngleA )
        } );
      }

      if ( hasB ) {
        result.push( {
          intersection: firstArc.positionAtAngle( firstAngleB ),
          tFirst: firstArc.tAtAngle( firstAngleB ),
          tSecond: secondArc.tAtAngle( secondAngleB )
        } );
      }

      return result;
    }
  };

  cupcakeSnake.register( 'Intersection', Intersection );

  return Intersection;
} );