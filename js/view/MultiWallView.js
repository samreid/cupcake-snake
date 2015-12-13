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

  function MultiWallView( walls ) {
    CanvasNode.call( this, {
      preventFit: true
    } );

    this.walls = walls;

    this.setCanvasBounds( new Bounds2( -10000, -10000, 10000, 10000 ) );
  }

  cupcakeSnake.register( 'MultiWallView', MultiWallView );

  inherit( CanvasNode, MultiWallView, {
    paintCanvas: function( context ) {

      for ( var i = 0; i < this.walls.length; i++ ) {
        var wall = this.walls[ i ];

        context.beginPath();

        context.moveTo( wall.segments[ 0 ].start.x, wall.segments[ 0 ].start.y );

        wall.segments.forEach( function( segment ) {
          segment.drawContext( context );
        } );

        context.strokeStyle = 'green';
        context.lineWidth = 3;
        context.lineCap = 'round';
        context.stroke();
      }
    }
  } );

  return MultiWallView;
} );