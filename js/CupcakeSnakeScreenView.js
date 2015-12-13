define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var HomeScreen = require( 'CUPCAKE_SNAKE/HomeScreen' );
  var SnakeView = require( 'CUPCAKE_SNAKE/view/SnakeView' );

  function CupcakeSnakeScreenView( cupcakeSnakeModel ) {
    this.cupcakeSnakeModel = cupcakeSnakeModel;
    var cupcakeSnakeScreenView = this;
    var bounds = new Bounds2( 0, 0, 1024, 618 );
    ScreenView.call( this, { layoutBounds: bounds } );

    //this.addChild( new Text( 'Level 1', { top: 10, left: 10, font: new PhetFont( { size: 30, weight: 'bold' } ) } ) );

    this.homeScreen = new HomeScreen( bounds, function() {
      cupcakeSnakeScreenView.closeHomeScreenAndStartLevel( 1 );
    } );
    this.addChild( this.homeScreen );

    this.snakeView = new SnakeView( cupcakeSnakeModel.snake );
    this.snakeView.center = bounds.center;
    this.addChild( this.snakeView );

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
      this.startLevel( level );
    },

    startLevel: function( levelNumber ) {
      this.snakeView = new SnakeView( this.cupcakeSnakeModel.snake );
      this.addChild( this.snakeView );
    },
    step: function( dt ) {
      if ( this.snakeView ) {
        this.snakeView.invalidatePaint();
      }

      if ( this.homeScreen ) {
        this.homeScreen.step( dt );
      }
    }
  } );
} );