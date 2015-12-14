// Copyright 2015

/**
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var cupcakeSnake = require( 'CUPCAKE_SNAKE/cupcakeSnake' );
  var Cupcake = require( 'CUPCAKE_SNAKE/model/Cupcake' );
  var Wall = require( 'CUPCAKE_SNAKE/model/Wall' );
  var Vector2 = require( 'DOT/Vector2' );
  var Line = require( 'KITE/segments/Line' );
  var Arc = require( 'KITE/segments/Arc' );
  var Shape = require( 'KITE/Shape' );

  // TODO: add to Kite?
  function reverseSegment( segment ) {
    if ( segment instanceof Line ) {
      return new Line( segment.end, segment.start );
    }
    else if ( segment instanceof Arc ) {
      return new Arc( segment.center, segment.radius, segment.endAngle, segment.startAngle, !segment.anticlockwise );
    }
    else {
      throw new Error( 'reverse segment!' );
    }
  }

  function Level( doorLeft, doorRight ) {
    this.walls = [];
    this.cupcakes = [];
    this.doorLeft = doorLeft; // Vector2
    this.doorRight = doorRight; // Vector2
  }

  inherit( Object, Level, {
    addWall: function( wall ) {
      // TODO: handle coordinate offsets between levels (snake for levels starts at (0,0?)?
      this.walls.push( wall );

      return this; // chaining
    },

    // {kite.Shape}
    addWallShape: function( shape, isInteriorWall ) {
      var self = this;
      shape.subpaths.forEach( function( subpath ) {
        if ( subpath.segments.length ) {
          var segments = subpath.segments.slice();
          if ( subpath.hasClosingSegment() ) {
            segments.push( subpath.getClosingSegment() );
          }
          if ( isInteriorWall ) {
            // reverse order of segments, and the segments individually
            segments = segments.slice();
            segments.reverse();
            segments = segments.map( reverseSegment );
          }
          self.addWall( new Wall( segments ) );
        }
      } );

      return this; // chaining
    },

    addCupcake: function( cupcake ) {
      // TODO: handle coordinate offsets between levels (snake for levels starts at (0,0?)?
      this.cupcakes.push( cupcake );

      return this; // chaining
    }
  } );
  cupcakeSnake.register( 'Level', Level );

  function smooth( points ) {
    if ( points.length < 3 ) {
      return points;
    }

    var result = [];

    var position = points[ 0 ];

    for ( var i = 1; i < points.length - 1; i++ ) {
      var point0 = points[ i - 1 ];
      var point1 = points[ i ];
      var point2 = points[ i + 1 ];

      if ( point1.curved ) {
        var radius = point1.radius;
        var dir0 = point0.minus( point1 ).normalized();
        var dir2 = point2.minus( point1 ).normalized();

        var directionToCenter = dir0.blend( dir2, 0.5 ).normalized();

        var angleBetween = dir0.angleBetween( dir2 );
        var alpha = angleBetween / 2;
        var beta = Math.PI / 2 - alpha;
        var lineOffsetMagnitude = Math.tan( beta ) * radius;
        var magnitudeToCenter = Math.sqrt( radius * radius + lineOffsetMagnitude * lineOffsetMagnitude ); // pythagoras
        var center = point1.plus( directionToCenter.timesScalar( magnitudeToCenter ) );

        var midAngle = directionToCenter.negated().angle();

        var point0Offset = point1.plus( dir0.timesScalar( lineOffsetMagnitude ) );
        var point2Offset = point1.plus( dir2.timesScalar( lineOffsetMagnitude ) );

        result.push( new Line( position, point0Offset ) );
        position = point2Offset;
        if ( dir0.crossScalar( directionToCenter ) > 0 ) {
          result.push( new Arc( center, radius, midAngle + beta, midAngle - beta, true ) );
          // result.push( new Line( point0Offset, point2Offset ) );
        }
        else {
          result.push( new Arc( center, radius, midAngle - beta, midAngle + beta, false ) );
          // result.push( new Line( point0Offset, point2Offset ) );
        }
      }
      else {
        // simple?
        result.push( new Line( position, point1 ) );
      }

    }
    result.push( new Line( position, points[ points.length - 1 ] ) );

    return result;
  }

  function c( x, y, radius ) {
    var result = new Vector2( x, y );
    result.curved = true;
    result.radius = radius;
    return result;
  }

  function v( x, y ) {
    return new Vector2( x, y );
  }


  Level.levels = [
    new Level( v( -50, 650 ), v( 50, -650 ) ).addWall( new Wall( smooth( [
      v( -50, -650 ),
      v( -100, -600 ),
      c( -200, -600, 40 ),
      c( -200, 100, 40 ),
      c( 200, 100, 40 ),
      c( 200, -600, 40 ),
      v( 100, -600 ),
      v( 50, -650 ),
    ] ) ) )
               .addCupcake( new Cupcake( 0, -400 ) ),
    new Level().addWallShape( Shape.roundRect( -400, -600, 800, 700, 80, 80 ) )
               .addWallShape( Shape.roundRect( -200, -400, 400, 80, 40, 40 ), true )
               .addCupcake( new Cupcake( 200, -500 ) )
               .addCupcake( new Cupcake( -200, -500 ) )
  ];

  return Level;
} );