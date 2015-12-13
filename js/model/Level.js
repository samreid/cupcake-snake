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

  function Level() {
    this.walls = [];
    this.cupcakes = [];
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

  Level.levels = [
    new Level().addWallShape( Shape.roundRect( -200, -600, 400, 700, 80, 80 ) )
               .addCupcake( new Cupcake( 0, -400 ) ),
    new Level().addWallShape( Shape.roundRect( -400, -600, 800, 700, 80, 80 ) )
               .addWallShape( Shape.roundRect( -200, -400, 400, 80, 40, 40 ), true )
               .addCupcake( new Cupcake( 200, -500 ) )
               .addCupcake( new Cupcake( -200, -500 ) )
  ];

  return Level;
} );