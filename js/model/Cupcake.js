// Copyright 2015, University of Colorado Boulder

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var cupcakeSnake = require( 'CUPCAKE_SNAKE/cupcakeSnake' );

  function Cupcake( x, y ) {
    this.x = x;
    this.y = y;
  }
  cupcakeSnake.register( 'Cupcake', Cupcake );

  return inherit( Object, Cupcake, {
    copy: function() {
      return new Cupcake( this.x, this.y );
    }
  } );
} );