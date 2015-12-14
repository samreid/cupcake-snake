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
  var Door = require( 'CUPCAKE_SNAKE/model/Door' );
  var Wall = require( 'CUPCAKE_SNAKE/model/Wall' );
  var Vector2 = require( 'DOT/Vector2' );
  var Line = require( 'KITE/segments/Line' );
  var Arc = require( 'KITE/segments/Arc' );
  var Shape = require( 'KITE/Shape' );
  var ObservableArray = require( 'AXON/ObservableArray' );

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

  function Level( doorLeft, doorRight, startPosition ) {
    this.door = new Door( doorLeft, doorRight );
    this.walls = [];
    this.cupcakes = new ObservableArray();
    this.doorLeft = doorLeft; // Vector2
    this.doorRight = doorRight; // Vector2
    this.startPosition = startPosition; // Vector2
  }

  inherit( Object, Level, {
    copy: function() {
      var level = new Level( this.doorLeft, this.doorRight, this.startPosition );
      level.walls = this.walls;
      this.cupcakes.forEach( function( cupcake ) {
        level.cupcakes.push( cupcake.copy() );
      } );
      level.number = this.number;
      level.nextLevel = this.nextLevel;
      level.previousLevel = this.previousLevel;
      return level;
    },

    // construction
    addWall: function( wall ) {
      // TODO: handle coordinate offsets between levels (snake for levels starts at (0,0?)?
      this.walls.push( wall );

      return this; // chaining
    },

    // construction
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

    // construction
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
    new Level( v( -50, -450 ), v( 50, -450 ), v( 0, 0 ) ).addWall( new Wall( smooth( [
        v( -50, -450 ),
        v( -50, -400 ),
        c( -200, -400, 40 ),
        c( -200, 0, 40 ),
        c( 200, 0, 40 ),
        c( 200, -400, 40 ),
        v( 50, -400 ),
        v( 50, -450 ),
      ] ) ) )
      .addCupcake( new Cupcake( 0, -300 ) ),

    new Level( v( -50, -10000 ), v( 50, -10000 ), v( 0, -450 ) )
      .addWall( new Wall( smooth( [
        v( -50, -450 ),
        c( -500, -1000, 100 ),
        c( 0, -1500, 100 ),
        c( 500, -1000, 100 ),
        v( 50, -450 )
      ] ) ) )
     .addWallShape( Shape.circle( 0, -1000, 200 ), true )
     .addCupcake( new Cupcake( 300, -1000 ) )
     .addCupcake( new Cupcake( -300, -1000 ) )
  ];

  // Defines level.nextLevel, level.previousLevel
  for ( var i = 1; i < Level.levels.length; i++ ) {
    Level.levels[ i ].previousLevel = Level.levels[ i - 1 ];
    Level.levels[ i - 1 ].nextLevel = Level.levels[ i ];
  }

  // Defines level.number
  for ( var k = 0; k < Level.levels.length; k++ ) {
    Level.levels[ k ].number = k + 1;
  }

  return Level;
} );