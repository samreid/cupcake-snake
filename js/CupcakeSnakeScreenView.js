define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var HomeScreen = require( 'CUPCAKE_SNAKE/HomeScreen' );
  var SnakeView = require( 'CUPCAKE_SNAKE/view/SnakeView' );
  var Wall = require( 'CUPCAKE_SNAKE/model/Wall' );
  var MultiWallView = require( 'CUPCAKE_SNAKE/view/MultiWallView' );
  var Vector2 = require( 'DOT/Vector2' );
  var Line = require( 'KITE/segments/Line' );
  var LineSegment = require( 'CUPCAKE_SNAKE/model/LineSegment' );
  var ButtonControls = require( 'CUPCAKE_SNAKE/view/ButtonControls' );
  var Cupcake = require( 'CUPCAKE_SNAKE/model/Cupcake' );
  var CupcakeNode = require( 'CUPCAKE_SNAKE/view/CupcakeNode' );

  var scratchVector = new Vector2();

  function CupcakeSnakeScreenView( cupcakeSnakeModel ) {
    var cupcakeSnakeScreenView = this;
    this.cupcakeSnakeModel = cupcakeSnakeModel;
    this.cupcakeSnakeModel.cupcakes.addItemAddedListener( function( cupcake ) {
      cupcakeSnakeScreenView.playArea.addChild( new CupcakeNode( cupcake ) );
    } );
    var bounds = new Bounds2( 0, 0, 1024, 618 );
    ScreenView.call( this, { layoutBounds: bounds } );

    // create button controls early so it can register itself for screen size changes
    this.buttonControls = new ButtonControls( this, this.cupcakeSnakeModel.leftProperty, this.cupcakeSnakeModel.rightProperty );

    this.layoutCenter = bounds.center;

    //this.addChild( new Text( 'Level 1', { top: 10, left: 10, font: new PhetFont( { size: 30, weight: 'bold' } ) } ) );

    this.homeScreen = new HomeScreen( bounds, function() {
      cupcakeSnakeScreenView.closeHomeScreenAndStartLevel( 1 );
    } );
    this.addChild( this.homeScreen );

    this.playArea = new Node();
    this.addChild( this.playArea );

    var KEY_LEFT = 37;
    var KEY_RIGHT = 39;

    document.addEventListener( 'keydown', function( event ) {
      if ( event.keyCode === KEY_LEFT ) {
        cupcakeSnakeModel.left = true;
      }
      if ( event.keyCode === KEY_RIGHT ) {
        cupcakeSnakeModel.right = true;
      }
    } );

    document.addEventListener( 'keyup', function( event ) {
      if ( event.keyCode === KEY_LEFT ) {
        cupcakeSnakeModel.left = false;
      }
      if ( event.keyCode === KEY_RIGHT ) {
        cupcakeSnakeModel.right = false;
      }
    } );
    if ( phet.chipper.getQueryParameter( 'level' ) ) {
      var level = parseInt( phet.chipper.getQueryParameter( 'level' ) );
      this.closeHomeScreenAndStartLevel( level );
    }
  }

  return inherit( ScreenView, CupcakeSnakeScreenView, {
    closeHomeScreenAndStartLevel: function( level ) {
      this.removeChild( this.homeScreen );
      this.homeScreen = null;

      this.playArea.addChild( new MultiWallView( this.cupcakeSnakeModel.snake, this.cupcakeSnakeModel.walls ) );

      // The snake is always there, he just navigates to different levels.
      this.snakeView = new SnakeView( this.cupcakeSnakeModel.snake );
      this.playArea.addChild( this.snakeView );

      this.addChild( this.buttonControls );

      this.startLevel( level );
      this.cupcakeSnakeModel.running = true;
    },

    startLevel: function( levelNumber ) {

      var segments = [];
      for ( var i = 0; i < 100; i++ ) {
        var step = 2 * Math.PI / 100;
        var angle = step * i;
        segments.push( new Line( Vector2.createPolar( 300, angle ), Vector2.createPolar( 300, angle + step ) ) );
      }
      var boundary = new Wall( segments );
      var wall = new Wall( [
        new Line( new Vector2( 50, 50 ), new Vector2( 50, -50 ) ),
        new Line( new Vector2( 50, -50 ), new Vector2( -50, -50 ) ),
        new Line( new Vector2( -50, -50 ), new Vector2( -50, 50 ) ),
        new Line( new Vector2( -50, 50 ), new Vector2( 50, 50 ) )
      ] );

      this.cupcakeSnakeModel.walls.length = 0;
      this.cupcakeSnakeModel.walls.push( boundary );
      this.cupcakeSnakeModel.walls.push( wall );

      this.cupcakeSnakeModel.cupcakes.add( new Cupcake( 0, 0 ) );
    },

    step: function( dt ) {
      this.playArea.setTranslation( scratchVector.set( this.cupcakeSnakeModel.snake.position ).negate().add( this.layoutCenter ) );

      if ( this.snakeView ) {
        this.snakeView.invalidatePaint();
      }

      if ( this.homeScreen ) {
        this.homeScreen.step( dt );
      }
    }
  } );
} );