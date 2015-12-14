// Copyright 2015, University of Colorado Boulder

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function() {
  'use strict';

  return function( v, c, smooth, Level, Wall, Slicer, Cupcake, Shape ) {

    // v( 850, -1350 ), v( 850, -1250 )
    return new Level( v( 850 + 1000, -1350 ), v( 850 + 1000, -1250 ), v( 900, -1300 ), v( 1, 0 ) )
      .addWall( new Wall( smooth( [
        v( 800, -1350 ),
        v( 2000, -1350 ),
        v( 2000, -1250 ),
        v( 800, -1250 )
      ] ) ) )

      //.addObstacle( new Slicer( v( 100, -800 ), v( -100, -800 ), 2 ) )
      //.addObstacle( new Slicer( v( 100, -1000 ), v( -100, -1000 ), 2 ) )
      //.addCupcake( new Cupcake( -200, -1300 ) )
      //
      //.addCupcake( new Cupcake( 410, -1480 ) )
      //.addCupcake( new Cupcake( 690, -1480 ) )
      //.addCupcake( new Cupcake( 370, -1300 ) )
      //.addCupcake( new Cupcake( 730, -1300 ) )
      //.addCupcake( new Cupcake( 410, -1120 ) )
      //.addCupcake( new Cupcake( 690, -1120 ) )
      //
      .addBlueButton( Shape.circle( 1800, -1350, 30 ) )
      .addYellowButton( Shape.circle( 1900, -1350, 30 ) );

  };
} );