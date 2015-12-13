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

  var checkerSize = 30;
  var backgroundPatternCanvas = document.createElement( 'canvas' );
  backgroundPatternCanvas.width = checkerSize * 2;
  backgroundPatternCanvas.height = checkerSize * 2;
  var backgroundPatternContext = backgroundPatternCanvas.getContext( '2d' );
  backgroundPatternContext.fillStyle = '#fff';
  backgroundPatternContext.fillRect( 0, 0, checkerSize * 2, checkerSize * 2 );
  backgroundPatternContext.fillStyle = '#f3f3f3';
  backgroundPatternContext.fillRect( 0, 0, checkerSize, checkerSize );
  backgroundPatternContext.fillRect( checkerSize, checkerSize, checkerSize, checkerSize );
  var backgroundPattern = backgroundPatternContext.createPattern( backgroundPatternCanvas, 'repeat' );

  function MultiWallView( snake, walls ) {
    this.snake = snake;
    CanvasNode.call( this, {
      preventFit: true
    } );

    this.walls = walls;

    this.setCanvasBounds( new Bounds2( -10000, -10000, 10000, 10000 ) );
  }

  cupcakeSnake.register( 'MultiWallView', MultiWallView );

  inherit( CanvasNode, MultiWallView, {
    paintCanvas: function( context ) {
      context.save();

      context.fillStyle = 'rgb(255,250,115)';
      context.fillRect( -10000, -10000, 20000, 20000 );

      context.beginPath();

      for ( var i = 0; i < this.walls.length; i++ ) {
        var wall = this.walls[ i ];

        context.moveTo( wall.segments[ 0 ].start.x, wall.segments[ 0 ].start.y );

        wall.segments.forEach( function( segment ) {
          segment.writeToContext( context );
        } );

      }

      // context.fillStyle = '#fff';
      context.fillStyle = backgroundPattern;
      context.strokeStyle = '#666';
      context.lineWidth = 1;
      context.lineCap = 'round';
      context.fill();
      context.stroke();

      context.restore();
    }
  } );

  return MultiWallView;
} );