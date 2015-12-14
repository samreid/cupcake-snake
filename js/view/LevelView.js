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
      if ( this.level.previousLevel ) {
        var previousDoor = this.level.previousLevel.door;
        context.moveTo( previousDoor.left.x, previousDoor.left.y );
        context.lineTo( previousDoor.right.x, previousDoor.right.y );
      }

      context.fillStyle = backgroundPattern;
      context.strokeStyle = '#333';
      context.lineWidth = 1;
      context.lineCap = 'round';
      if ( !this.level.active ) {
        context.globalAlpha = 0.5;
      }
      context.fill();
      context.stroke();
      context.globalAlpha = 1.0;

      if ( this.level.active ) {
        var blueDoorSegments = this.level.door.blueSegments;
        context.fillStyle = this.level.bluePressed ? 'rgba(255,128,255,0.2)' : 'rgb(255,128,255)';
        context.strokeStyle = this.level.bluePressed ? 'transparent' : 'rgb(40,40,40)';
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo( blueDoorSegments[ 0 ].start.x, blueDoorSegments[ 0 ].start.y );
        for ( var i = 0; i < blueDoorSegments.length; i++ ) {
          blueDoorSegments[ i ].writeToContext( context );
        }
        context.closePath();
        context.fill();
        context.stroke();

        var yellowDoorSegments = this.level.door.yellowSegments;
        context.fillStyle = this.level.yellowPressed ? 'rgba(128,255,255,0.2)' : 'rgb(128,255,255)';
        context.strokeStyle = this.level.yellowPressed ? 'transparent' : 'rgb(40,40,40)';
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo( yellowDoorSegments[ 0 ].start.x, yellowDoorSegments[ 0 ].start.y );
        for ( var i = 0; i < yellowDoorSegments.length; i++ ) {
          yellowDoorSegments[ i ].writeToContext( context );
        }
        context.closePath();
        context.fill();
        context.stroke();

        var blueButtonSegments = this.level.blueButton.segments;
        context.fillStyle = 'rgba(255,128,255,0.5)';
        context.strokeStyle = 'rgb(40,40,40)';
        context.lineWidth = 1;
        context.setLineDash( [ 3, 3 ] );
        context.beginPath();
        context.moveTo( blueButtonSegments[ 0 ].start.x, blueButtonSegments[ 0 ].start.y );
        for ( var i = 0; i < blueButtonSegments.length; i++ ) {
          blueButtonSegments[ i ].writeToContext( context );
        }
        context.closePath();
        context.fill();
        context.stroke();
        context.setLineDash( [] );

        var yellowButtonSegments = this.level.yellowButton.segments;
        context.fillStyle = 'rgba(128,255,255,0.5)';
        context.strokeStyle = 'rgb(40,40,40)';
        context.lineWidth = 1;
        context.setLineDash( [ 3, 3 ] );
        context.beginPath();
        context.moveTo( yellowButtonSegments[ 0 ].start.x, yellowButtonSegments[ 0 ].start.y );
        for ( var i = 0; i < yellowButtonSegments.length; i++ ) {
          yellowButtonSegments[ i ].writeToContext( context );
        }
        context.closePath();
        context.fill();
        context.stroke();
        context.setLineDash( [] );
      }


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