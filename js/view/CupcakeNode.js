// Copyright 2015

/**
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Image = require( 'SCENERY/nodes/Image' );

  var cupcakeImage = require( 'image!CUPCAKE_SNAKE/cupcake-small.png' );

  function CupcakeNode( cupcake ) {
    Node.call( this );
    this.addChild( new Image( cupcakeImage, { scale: 0.3 } ) );
    this.centerX = cupcake.x;
    this.centerY = cupcake.y;
  }

  return inherit( Node, CupcakeNode, {} );
} );