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
  var Line = require( 'KITE/segments/Line' );

  function Door( left, right ) {
    this.left = left; // Vector2
    this.right = right; // Vector2
    this.segment = new Line( left, right );
  }

  cupcakeSnake.register( 'Door', Door );

  return inherit( Object, Door, {
    copy: function() {
      return new Door( this.left, this.right );
    }
  } );
} );