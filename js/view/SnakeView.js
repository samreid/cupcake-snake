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
  var Vector2 = require( 'DOT/Vector2' );

  var scratchVector = new Vector2();

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
      context.save();

      // context.translate( -this.snake.position.x, -this.snake.position.y );

      context.beginPath();

      var snake = this.snake;

      // main body
      context.moveTo( snake.segments[ 0 ].start.x, snake.segments[ 0 ].start.y );
      snake.segments.forEach( function( segment ) {
        segment.drawContext( context );
      } );
      context.lineCap = 'round';
      context.strokeStyle = '#000';
      context.lineWidth = 7;
      context.stroke();
      context.strokeStyle = '#a7cb4d';
      context.lineWidth = 5;
      context.stroke();

      // head
      context.beginPath();
      context.arc( this.snake.position.x, this.snake.position.y, 5, 0, Math.PI * 2, false );
      context.closePath();
      context.fillStyle = '#a7cb4d';
      context.fill();
      context.lineWidth = 1;
      context.strokeStyle = '#000';
      context.stroke();

      // eyes
      context.fillStyle = '#fff';
      context.strokeStyle = '#000';
      context.lineWidth = 0.5;
      var eyeOffsetMagnitude = 4;
      var eyeRadius = 2;
      var eyeOffsetAngle = Math.PI / 3.5;

      var faceAngle = this.snake.direction.angle();
      var eyeCenter = scratchVector.setPolar( eyeOffsetMagnitude, faceAngle + eyeOffsetAngle ).add( this.snake.position );
      context.beginPath();
      context.arc( eyeCenter.x, eyeCenter.y, eyeRadius, 0, Math.PI * 2, false );
      context.closePath();
      context.fill();
      context.stroke();
      eyeCenter = scratchVector.setPolar( eyeOffsetMagnitude, faceAngle - eyeOffsetAngle ).add( this.snake.position );
      context.beginPath();
      context.arc( eyeCenter.x, eyeCenter.y, eyeRadius, 0, Math.PI * 2, false );
      context.closePath();
      context.fill();
      context.stroke();


      context.restore();
    }
  } );

  return SnakeView;
} );