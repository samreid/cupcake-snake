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
  var scratchVector2 = new Vector2();

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
      // context.moveTo( snake.segments[ 0 ].start.x, snake.segments[ 0 ].start.y );
      // snake.segments.forEach( function( segment ) {
      //   segment.drawContext( context );
      // } );

      // reversed motion so that the line dash offset isn't needed (draws from head)
      var lastSegment = snake.segments[ snake.segments.length - 1 ];
      context.moveTo( lastSegment.end.x, lastSegment.end.y );
      for ( var i = snake.segments.length - 1; i >= 0; i-- ) {
        snake.segments[ i ].drawReverseContext( context );
      }
      context.lineCap = 'round';
      context.strokeStyle = '#000';
      context.lineWidth = 7;
      context.stroke();
      context.strokeStyle = '#dcf558';
      context.lineWidth = 5;
      context.stroke();
      context.lineCap = 'butt';
      context.strokeStyle = '#a7cb4d';
      context.lineWidth = 5;
      context.setLineDash( [ 10, 10 ] );
      context.stroke();
      context.setLineDash( [] );

      // head
      context.beginPath();
      context.moveTo( this.snake.position.x - this.snake.direction.x * 5 - this.snake.direction.y * 3,
                      this.snake.position.y - this.snake.direction.y * 5 + this.snake.direction.x * 3 );
      context.lineTo( this.snake.position.x + this.snake.direction.x * 0 - this.snake.direction.y * 6,
                      this.snake.position.y + this.snake.direction.y * 0 + this.snake.direction.x * 6 );
      context.lineTo( this.snake.position.x + this.snake.direction.x * 2 - this.snake.direction.y * 6,
                      this.snake.position.y + this.snake.direction.y * 2 + this.snake.direction.x * 6 );
      context.lineTo( this.snake.position.x + this.snake.direction.x * 7 - this.snake.direction.y * 3,
                      this.snake.position.y + this.snake.direction.y * 7 + this.snake.direction.x * 3 );
      context.lineTo( this.snake.position.x + this.snake.direction.x * 9 - this.snake.direction.y * 1,
                      this.snake.position.y + this.snake.direction.y * 9 + this.snake.direction.x * 1 );
      context.lineTo( this.snake.position.x + this.snake.direction.x * 9 + this.snake.direction.y * 1,
                      this.snake.position.y + this.snake.direction.y * 9 - this.snake.direction.x * 1 );
      context.lineTo( this.snake.position.x + this.snake.direction.x * 7 + this.snake.direction.y * 3,
                      this.snake.position.y + this.snake.direction.y * 7 - this.snake.direction.x * 3 );
      context.lineTo( this.snake.position.x + this.snake.direction.x * 2 + this.snake.direction.y * 6,
                      this.snake.position.y + this.snake.direction.y * 2 - this.snake.direction.x * 6 );
      context.lineTo( this.snake.position.x + this.snake.direction.x * 0 + this.snake.direction.y * 6,
                      this.snake.position.y + this.snake.direction.y * 0 - this.snake.direction.x * 6 );
      context.lineTo( this.snake.position.x - this.snake.direction.x * 5 + this.snake.direction.y * 3,
                      this.snake.position.y - this.snake.direction.y * 5 - this.snake.direction.x * 3 );
      context.fillStyle = '#a7cb4d';
      context.fill();
      context.lineWidth = 1;
      context.strokeStyle = '#000';
      context.stroke();

      // eyes
      context.fillStyle = '#fff';
      context.strokeStyle = '#000';
      context.lineWidth = 0.5;
      var eyeOffsetMagnitude = 3;
      var eyeRadius = 2.5;
      var pupilOffsetMagnitude = 1; // from the eye
      var pupilRadius = 1;
      var eyeOffsetAngle = Math.PI / 3;

      var faceAngle = this.snake.direction.angle();
      var center;

      center = scratchVector.setPolar( eyeOffsetMagnitude, faceAngle + eyeOffsetAngle ).add( this.snake.position );
      context.beginPath();
      context.arc( center.x, center.y, eyeRadius, 0, Math.PI * 2, false );
      context.closePath();
      context.fill();
      context.stroke();
      center = scratchVector.setPolar( eyeOffsetMagnitude, faceAngle - eyeOffsetAngle ).add( this.snake.position );
      context.beginPath();
      context.arc( center.x, center.y, eyeRadius, 0, Math.PI * 2, false );
      context.closePath();
      context.fill();
      context.stroke();

      context.fillStyle = '#000';
      var pupilOffset = scratchVector2.setPolar( pupilOffsetMagnitude, faceAngle );
      center = scratchVector.setPolar( eyeOffsetMagnitude, faceAngle + eyeOffsetAngle ).add( pupilOffset ).add( this.snake.position );
      context.beginPath();
      context.arc( center.x, center.y, pupilRadius, 0, Math.PI * 2, false );
      context.closePath();
      context.fill();
      center = scratchVector.setPolar( eyeOffsetMagnitude, faceAngle - eyeOffsetAngle ).add( pupilOffset ).add( this.snake.position );
      context.beginPath();
      context.arc( center.x, center.y, pupilRadius, 0, Math.PI * 2, false );
      context.closePath();
      context.fill();


      context.restore();
    }
  } );

  return SnakeView;
} );