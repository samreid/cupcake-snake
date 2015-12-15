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
  var Vector3 = require( 'DOT/Vector3' );
  var Color = require( 'SCENERY/util/Color' );
  var clamp = require( 'DOT/Util' ).clamp;

  function BackgroundNode( cupcakeSnakeModel ) {
    var self = this;

    CanvasNode.call( this, {
      preventFit: true
    } );

    this.cupcakeSnakeModel = cupcakeSnakeModel;

    cupcakeSnakeModel.currentLevelProperty.link( function( level ) {
      if ( level ) {
        self.targetColor = cupcakeSnakeModel.currentLevel.color;
      }
      else {
        self.targetColor = new Color( 'rgb(255,250,115)' );
      }
    } );
    this.currentColor = new Vector3( this.targetColor.r, this.targetColor.g, this.targetColor.b );

    this.setCanvasBounds( new Bounds2( -10000, -10000, 10000, 10000 ) );
  }

  cupcakeSnake.register( 'BackgroundNode', BackgroundNode );

  inherit( CanvasNode, BackgroundNode, {
    step: function( dt ) {
      var ratio = Math.pow( 0.7, dt );
      this.currentColor.setXYZ(
        ( 1 - ratio ) * this.targetColor.r + ratio * this.currentColor.x,
        ( 1 - ratio ) * this.targetColor.g + ratio * this.currentColor.y,
        ( 1 - ratio ) * this.targetColor.b + ratio * this.currentColor.z )
    },

    sync: function() {
      this.currentColor.setXYZ( this.targetColor.r, this.targetColor.g, this.targetColor.b );
    },

    paintCanvas: function( context ) {
      context.save();

      context.fillStyle = 'rgb(' + Math.round( clamp( this.currentColor.x, 0, 255 ) ) +
                          ',' + Math.round( clamp( this.currentColor.y, 0, 255 ) ) +
                          ',' + Math.round( clamp( this.currentColor.z, 0, 255 ) ) + ')';
      context.fillRect( -10000, -10000, 20000, 20000 );

      context.restore();
    }
  } );

  return BackgroundNode;
} );