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

  function Button( segments ) {
    this.segments = segments;
  }

  cupcakeSnake.register( 'Button', Button );

  return inherit( Object, Button, {
    copy: function() {
      return new Button( this.segments );
    }
  } );
} );