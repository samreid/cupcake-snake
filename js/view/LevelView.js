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
  var CupcakeNode = require( 'CUPCAKE_SNAKE/view/CupcakeNode' );

  var checkerSize = 25;
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

  function LevelView( level ) {
    CanvasNode.call( this, {
      preventFit: true
    } );

    this.level = level;

    this.setCanvasBounds( new Bounds2( -10000, -10000, 10000, 10000 ) );

    this.cupcakeNodes = [];

    level.cupcakes.forEach( this.addCupcakeNode.bind( this ) );

    level.cupcakes.addItemAddedListener( this.addCupcakeNode.bind( this ) );
    level.cupcakes.addItemRemovedListener( this.removeCupcakeNode.bind( this ) );
  }

  cupcakeSnake.register( 'LevelView', LevelView );

  inherit( CanvasNode, LevelView, {
    paintCanvas: function( context ) {
      context.save();

      context.beginPath();

      var walls = this.level.walls;

      for ( var i = 0; i < walls.length; i++ ) {
        var wall = walls[ i ];

        context.moveTo( wall.segments[ 0 ].start.x, wall.segments[ 0 ].start.y );

        wall.segments.forEach( function( wallSegment ) {
          wallSegment.writeToContext( context );
        } );
      }

      context.fillStyle = backgroundPattern;
      context.strokeStyle = '#333';
      context.lineWidth = 1;
      context.lineCap = 'round';
      context.fill();
      context.stroke();

      context.restore();
    },

    addCupcakeNode: function( cupcake ) {
      var cupcakeNode = new CupcakeNode( cupcake );
      this.cupcakeNodes.push( cupcakeNode );
      this.addChild( cupcakeNode );
    },

    removeCupcakeNode: function( cupcake ) {
      for ( var i = 0; i < this.cupcakeNodes.length; i++ ) {
        var cupcakeNode = this.cupcakeNodes[ i ];
        if ( cupcakeNode.cupcake === cupcake ) {
          this.cupcakeNodes.splice( i, 1 );
          this.removeChild( cupcakeNode );
          break;
        }
      }
    }
  } );

  return LevelView;
} );