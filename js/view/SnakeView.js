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

  function SnakeView( snake ) {
    CanvasNode.call( this, {
      preventFit: true
    } );

    this.snake = snake;

    this.setCanvasBounds( new Bounds2( -10000, -10000, 10000, 10000 ) );
  }
  cupcakeSnake.register( 'SnakeView', SnakeView );

  inherit( CanvasNode, SnakeView, {
    paintCanvas: function( context ) {
      context.translate( -this.snake.position.x, -this.snake.position.y );

      context.beginPath();

      var snake = this.snake;
      context.moveTo( snake.segments[ 0 ].start.x, snake.segments[ 0 ].start.y );

      snake.segments.forEach( function( segment ) {
        segment.drawContext( context );
      } );

      context.strokeStyle = 'green';
      context.lineWidth = 3;
      context.lineCap = 'round';
      context.stroke();

      context.fillStyle = 'red';
      context.beginPath();
      context.arc( this.snake.position.x, this.snake.position.y, 3, 0, Math.PI * 2, false );
      context.closePath();
      context.fill();
    }
  } );

  return SnakeView;
} );