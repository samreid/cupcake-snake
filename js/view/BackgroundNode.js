// Copyright 2015

/**
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var cupcakeSnake = require( 'CUPCAKE_SNAKE/cupcakeSnake' );
  var CanvasNode = require( 'SCENERY/nodes/CanvasNode' );
  var Bounds2 = require( 'DOT/Bounds2' );

  function BackgroundNode( cupcakeSnakeModel ) {
    CanvasNode.call( this, {
      preventFit: true
    } );

    this.cupcakeSnakeModel = cupcakeSnakeModel;

    this.setCanvasBounds( new Bounds2( -10000, -10000, 10000, 10000 ) );
  }

  cupcakeSnake.register( 'BackgroundNode', BackgroundNode );

  inherit( CanvasNode, BackgroundNode, {
    paintCanvas: function( context ) {
      context.save();

      context.fillStyle = 'rgb(255,250,115)';
      context.fillRect( -10000, -10000, 20000, 20000 );

      context.restore();
    }
  } );

  return BackgroundNode;
} );