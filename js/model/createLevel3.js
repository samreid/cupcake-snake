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

    return new Level( v( 850 + 1200 + 200, -1350 ), v( 850 + 1200 + 200, -1250 ), v( 900, -1300 ), v( 1, 0 ) )
      .addWall( new Wall( shapeToSegments( new Shape()
        .lineTo( origin.x, origin.y )
        .lineToRelative( a - b, 0 )
        .lineToRelative( b - d, -m )
        .lineToRelative( d + d, 0 )
        .lineToRelative( b, m + h )
        .lineTo( origin.x, origin.y + h )
        .close()
      ) ) )

      .addObstacle( new Slicer( origin.plusXY( a - 200, -100 ), origin.plusXY( a + 50 + 200, -100 + 50 ), 3 ) )
      .addObstacle( new Slicer( origin.plusXY( a - 200, -100 + 50 ), origin.plusXY( a + 50 + 200, -100 + 50 - 50 ), 2 ) )

      .addObstacle( new Slicer( origin.plusXY( a - 200 + 30, -100 - 200 ), origin.plusXY( a + 50 + 200 - 30, -100 + 50 - 200 ), 3 ) )
      .addObstacle( new Slicer( origin.plusXY( a - 200 + 30, -100 + 50 - 200 ), origin.plusXY( a + 50 + 200 - 30, -100 + 50 - 50 - 200 ), 2 ) )

      .addObstacle( new Slicer( origin.plusXY( a - 200 + 30 + 30, -100 - 200 - 200 ), origin.plusXY( a + 50 + 200 - 30 - 30, -100 + 50 - 200 - 200 ), 3 ) )
      .addObstacle( new Slicer( origin.plusXY( a - 200 + 30 + 30, -100 + 50 - 200 - 200 ), origin.plusXY( a + 50 + 200 - 30 - 30, -100 + 50 - 50 - 200 - 200 ), 2 ) )
      .addCupcake( cupcakeAt( origin.plusXY( 200, 10 ) ) )
      .addCupcake( cupcakeAt( origin.plusXY( 400, 10 ) ) )
      .addCupcake( cupcakeAt( origin.plusXY( 600, 10 ) ) )
      .addCupcake( cupcakeAt( origin.plusXY( 800, 10 ) ) )
      .addCupcake( cupcakeAt( origin.plusXY( 300, h - 20 ) ) )
      .addCupcake( cupcakeAt( origin.plusXY( 500, h - 20 ) ) )
      .addCupcake( cupcakeAt( origin.plusXY( 700, h - 20 ) ) )
      .addCupcake( cupcakeAt( origin.plusXY( 900, h - 20 ) ) )
      //
      //.addCupcake( new Cupcake( 410, -1480 ) )
      //.addCupcake( new Cupcake( 690, -1480 ) )
      //.addCupcake( new Cupcake( 370, -1300 ) )
      //.addCupcake( new Cupcake( 730, -1300 ) )
      //.addCupcake( new Cupcake( 410, -1120 ) )
      //.addCupcake( new Cupcake( 690, -1120 ) )
      //
      .addBlueButton( Shape.circle( origin.x + a, origin.y - m + 500, 30 ) )
      .addYellowButton( Shape.circle( origin.x + a, origin.y - m + 800, 30 ) );

  };
} );