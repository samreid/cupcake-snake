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
      context.lineJoin = 'round';
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
      var stripeSize = ( snake.length + snake.totalLengthCut ) / 40 * (200 / 150);
      context.setLineDash( [ stripeSize, stripeSize ] );
      context.stroke();
      context.setLineDash( [] );

      var px = snake.position.x;
      var py = snake.position.y;
      var dx = snake.direction.x;
      var dy = snake.direction.y;

      // tongue
      // console.log( snake.tongueExtension );
      if ( snake.tongueExtension !== 0 ) {
        var tongueOffset = snake.tongueExtension - 9;
        context.fillStyle = '#f00';
        context.beginPath();
        context.moveTo( px + dx * ( tongueOffset + 9 ) - dy * 1, py + dy * ( tongueOffset + 9 ) + dx * 1 );
        context.lineTo( px + dx * ( tongueOffset + 12 ) - dy * 1, py + dy * ( tongueOffset + 12 ) + dx * 1 );
        context.lineTo( px + dx * ( tongueOffset + 16 ) - dy * 3, py + dy * ( tongueOffset + 16 ) + dx * 3 );
        context.lineTo( px + dx * ( tongueOffset + 13 ) - dy * 0, py + dy * ( tongueOffset + 13 ) + dx * 0 );
        context.lineTo( px + dx * ( tongueOffset + 16 ) + dy * 3, py + dy * ( tongueOffset + 16 ) - dx * 3 );
        context.lineTo( px + dx * ( tongueOffset + 12 ) + dy * 1, py + dy * ( tongueOffset + 12 ) - dx * 1 );
        context.lineTo( px + dx * ( tongueOffset + 9 ) + dy * 1, py + dy * ( tongueOffset + 9 ) - dx * 1 );
        context.fill();
      }

      // head
      context.beginPath();
      context.moveTo( px - dx * 5 - dy * 3, py - dy * 5 + dx * 3 ); // "left" base at neck
      context.lineTo( px + dx * 0 - dy * 6, py + dy * 0 + dx * 6 ); // head expands
      context.lineTo( px + dx * 2 - dy * 6, py + dy * 2 + dx * 6 ); // forward
      context.lineTo( px + dx * 7 - dy * 3, py + dy * 7 + dx * 3 ); // narrowing
      context.lineTo( px + dx * 9 - dy * 1, py + dy * 9 + dx * 1 ); // almost a point
      context.lineTo( px + dx * 9 + dy * 1, py + dy * 9 - dx * 1 ); // almost a point
      context.lineTo( px + dx * 7 + dy * 3, py + dy * 7 - dx * 3 ); // narrowing
      context.lineTo( px + dx * 2 + dy * 6, py + dy * 2 - dx * 6 ); // forward
      context.lineTo( px + dx * 0 + dy * 6, py + dy * 0 - dx * 6 ); // head expands
      context.lineTo( px - dx * 5 + dy * 3, py - dy * 5 - dx * 3 ); // "right" base at neck
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

      // whites
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

      // pupils
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