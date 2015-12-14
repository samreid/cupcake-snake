// Copyright 2015, University of Colorado Boulder

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function() {
  'use strict';

  return function( v, c, smooth, Level, Wall, Shape, shapeToSegments, Slicer, Cupcake ) {

    var origin = v( 800, -1350 );
    var a = 1000;
    var b = 200;
    var d = 50;
    var h = 100;
    var m = 1500;
    var cupcakeAt = function( vector ) {
      return new Cupcake( vector.x, vector.y );
    };

    return new Level( origin.plusXY( a - d - 100, -m + 50 ), origin.plusXY( a + d - 100, -m + 50 ), v( 900, -1300 ), v( 1, 0 ) )
      .addWall( new Wall( shapeToSegments( new Shape()
        .lineTo( origin.x - 100, origin.y )
        .lineToRelative( a - b, 0 )
        .lineToRelative( b - d, -m )
        .lineToRelative( d + d, 0 )
        .lineToRelative( b, m + h )
        .lineTo( origin.x - 100, origin.y + h )
      ) ) )

      .addObstacle( new Slicer( origin.plusXY( a - 200 - 100, -100 ), origin.plusXY( a + 50 + 200 - 100, -100 + 50 ), 3 ) )
      .addObstacle( new Slicer( origin.plusXY( a - 200 - 100, -100 + 50 ), origin.plusXY( a + 50 + 200 - 100, -100 + 50 - 50 ), 2 ) )

      .addObstacle( new Slicer( origin.plusXY( a - 200 + 30 - 100, -100 - 200 ), origin.plusXY( a + 50 + 200 - 30 - 100, -100 + 50 - 200 ), 3 ) )
      .addObstacle( new Slicer( origin.plusXY( a - 200 + 30 - 100, -100 + 50 - 200 ), origin.plusXY( a + 50 + 200 - 30 - 100, -100 + 50 - 50 - 200 ), 2 ) )

      .addObstacle( new Slicer( origin.plusXY( a - 200 + 30 + 30 - 100, -100 - 200 - 200 ), origin.plusXY( a + 50 + 200 - 30 - 30 - 100, -100 + 50 - 200 - 200 ), 3 ) )
      .addObstacle( new Slicer( origin.plusXY( a - 200 + 30 + 30 - 100, -100 + 50 - 200 - 200 ), origin.plusXY( a + 50 + 200 - 30 - 30 - 100, -100 + 50 - 50 - 200 - 200 ), 2 ) )
      .addCupcake( cupcakeAt( origin.plusXY( 200 - 100, 10 ) ) )
      .addCupcake( cupcakeAt( origin.plusXY( 400 - 100, 10 ) ) )
      .addCupcake( cupcakeAt( origin.plusXY( 600 - 100, 10 ) ) )
      .addCupcake( cupcakeAt( origin.plusXY( 800 - 100, 10 ) ) )
      .addCupcake( cupcakeAt( origin.plusXY( 300 - 100, h - 20 ) ) )
      .addCupcake( cupcakeAt( origin.plusXY( 500 - 100, h - 20 ) ) )
      .addCupcake( cupcakeAt( origin.plusXY( 700 - 100, h - 20 ) ) )
      .addCupcake( cupcakeAt( origin.plusXY( 900 - 100, h - 20 ) ) )

      .addCupcake( cupcakeAt( origin.plusXY( a - 150 - 100, -200 ) ) )
      .addCupcake( cupcakeAt( origin.plusXY( a - 100 - 100, -200 ) ) )
      .addCupcake( cupcakeAt( origin.plusXY( a - 50 - 100, -200 ) ) )
      .addCupcake( cupcakeAt( origin.plusXY( a - 0 - 100, -200 ) ) )
      .addCupcake( cupcakeAt( origin.plusXY( a + 50 - 100, -200 ) ) )
      .addCupcake( cupcakeAt( origin.plusXY( a + 100 - 100, -200 ) ) )
      .addCupcake( cupcakeAt( origin.plusXY( a + 150 - 100, -200 ) ) )

      .addCupcake( cupcakeAt( origin.plusXY( a - 100 - 100, -200 - 200 ) ) )
      .addCupcake( cupcakeAt( origin.plusXY( a - 50 - 100, -200 - 200 ) ) )
      .addCupcake( cupcakeAt( origin.plusXY( a - 0 - 100, -200 - 200 ) ) )
      .addCupcake( cupcakeAt( origin.plusXY( a + 50 - 100, -200 - 200 ) ) )
      .addCupcake( cupcakeAt( origin.plusXY( a + 100 - 100, -200 - 200 ) ) )

      .addCupcake( cupcakeAt( origin.plusXY( a - 100 - 100, -200 - 200 - 200 ) ) )
      .addCupcake( cupcakeAt( origin.plusXY( a - 50 - 100, -200 - 200 - 200 ) ) )
      .addCupcake( cupcakeAt( origin.plusXY( a - 0 - 100, -200 - 200 - 200 ) ) )
      .addCupcake( cupcakeAt( origin.plusXY( a + 50 - 100, -200 - 200 - 200 ) ) )
      .addCupcake( cupcakeAt( origin.plusXY( a + 100 - 100, -200 - 200 - 200 ) ) )
      //
      //.addCupcake( new Cupcake( 410, -1480 ) )
      //.addCupcake( new Cupcake( 690, -1480 ) )
      //.addCupcake( new Cupcake( 370, -1300 ) )
      //.addCupcake( new Cupcake( 730, -1300 ) )
      //.addCupcake( new Cupcake( 410, -1120 ) )
      //.addCupcake( new Cupcake( 690, -1120 ) )
      //
      .addBlueButton( Shape.circle( origin.x + a - 100, origin.y - m + 300, 30 ) )
      .addYellowButton( Shape.circle( origin.x + a - 100, origin.y - m + 600, 30 ) );

  };
} );