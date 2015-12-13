// Copyright 2015

/**
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var cupcakeSnake = require( 'CUPCAKE_SNAKE/cupcakeSnake' );

  function Wall( segments ) {
    assert && assert( segments.length > 0, 'should have segments' );

    // @public (immutable, see copy function)
    this.segments = segments; // kite segments
  }

  cupcakeSnake.register( 'Wall', Wall );

  return inherit( Object, Wall, {
    copy: function() {
      return new Wall( this.segments );
    }
  } );
} );