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
  var Intersection = require( 'CUPCAKE_SNAKE/model/Intersection' );
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

  var showDebugIntersections = !!phet.chipper.getQueryParameter( 'debugIntersections' );

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
      var snake = this.snake;

      context.save();

      context.fillStyle = 'rgb(255,250,115)';
      context.fillRect( -10000, -10000, 20000, 20000 );

      context.beginPath();

      var hits = [];

      for ( var i = 0; i < this.walls.length; i++ ) {
        var wall = this.walls[ i ];

        context.moveTo( wall.segments[ 0 ].start.x, wall.segments[ 0 ].start.y );

        wall.segments.forEach( function( wallSegment ) {
          wallSegment.writeToContext( context );

          if ( showDebugIntersections ) {
            snake.segments.forEach( function( snakeSegment ) {
              var segmentHits = Intersection.intersect( wallSegment, snakeSegment.segment );
              if ( segmentHits ) {
                // debugger;
                // Intersection.intersect( wallSegment, snakeSegment.segment );
                hits = hits.concat( segmentHits );
              }
            } );
          }
        } );
      }

      if ( showDebugIntersections ) {
        for ( var j = 0; j < snake.segments.length; j++ ) {
          var jSegment = snake.segments[ j ].segment;

          // self-intersection (loop) test
          if ( jSegment.radius && Math.abs( jSegment.startAngle - jSegment.endAngle ) >= Math.PI * 2 - 0.000001 ) {
            hits.push( {
              intersection: jSegment.end
            } );
          }

          // other segment test
          for ( var k = 0; k < snake.segments.length; k++ ) {
            if ( Math.abs( j - k ) > 1 && j < k ) {
              var kSegment = snake.segments[ k ].segment;

              var segmentHits = Intersection.intersect( jSegment, kSegment );
              if ( segmentHits ) {
                // debugger;
                // Intersection.intersect( wallSegment, snakeSegment.segment );
                hits = hits.concat( segmentHits );
              }
            }
          }
        }
      }

      // context.fillStyle = '#fff';
      context.fillStyle = backgroundPattern;
      context.strokeStyle = '#666';
      context.lineWidth = 1;
      context.lineCap = 'round';
      context.fill();
      context.stroke();

      if ( showDebugIntersections ) {
        hits.forEach( function( hit ) {
          context.beginPath();
          context.arc( hit.intersection.x, hit.intersection.y, 8, 0, Math.PI * 2, false );
          context.closePath();
          context.fillStyle = 'red';
          context.fill();
        } );
      }

      context.restore();
    }
  } );

  return MultiWallView;
} );