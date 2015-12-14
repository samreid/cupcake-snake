define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var StarNode = require( 'SCENERY_PHET/StarNode' );
  var HomeScreen = require( 'CUPCAKE_SNAKE/HomeScreen' );
  var SnakeView = require( 'CUPCAKE_SNAKE/view/SnakeView' );
  var Wall = require( 'CUPCAKE_SNAKE/model/Wall' );
  var LevelView = require( 'CUPCAKE_SNAKE/view/LevelView' );
  var Vector2 = require( 'DOT/Vector2' );
  var Line = require( 'KITE/segments/Line' );
  var LineSegment = require( 'CUPCAKE_SNAKE/model/LineSegment' );
  var ButtonControls = require( 'CUPCAKE_SNAKE/view/ButtonControls' );
  var Cupcake = require( 'CUPCAKE_SNAKE/model/Cupcake' );
  var Level = require( 'CUPCAKE_SNAKE/model/Level' );
  var GameOverPanel = require( 'CUPCAKE_SNAKE/view/GameOverPanel' );
  var BackgroundNode = require( 'CUPCAKE_SNAKE/view/BackgroundNode' );
  var Sound = require( 'VIBE/Sound' );
  var Emitter = require( 'AXON/Emitter' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var LevelReadout = require( 'CUPCAKE_SNAKE/view/LevelReadout' );

  // audio
  var death = require( 'audio!CUPCAKE_SNAKE/qubodupImpactMeat02' );
  var deathSound = new Sound( death );

  var scratchVector = new Vector2();

  function CupcakeSnakeScreenView( cupcakeSnakeModel, level, restart ) {
    phet.joist.display.backgroundColor = '#000';
    this.starNodes = new ObservableArray();

    window.screenView = this;

    var cupcakeSnakeScreenView = this;
    this.cupcakeSnakeModel = cupcakeSnakeModel;

    var bounds = new Bounds2( 0, 0, 1024, 618 );
    ScreenView.call( this, { layoutBounds: bounds } );

    this.preventFit = true;

    // create button controls early so it can register itself for screen size changes
    this.buttonControls = new ButtonControls( this, this.cupcakeSnakeModel.leftProperty, this.cupcakeSnakeModel.rightProperty );

    this.levelReadout = new LevelReadout( this );

    this.layoutCenter = bounds.center;

    //this.addChild( new Text( 'Level 1', { top: 10, left: 10, font: new PhetFont( { size: 30, weight: 'bold' } ) } ) );

    this.homeScreen = new HomeScreen( bounds, function() {
      cupcakeSnakeScreenView.closeHomeScreenAndStartLevel( 1 );
    } );
    this.addChild( this.homeScreen );

    // Play area visual stacking order
    this.playArea = new Node();
    this.levelLayer = new Node();
    this.snakeView = new SnakeView( this.cupcakeSnakeModel.snake ); // The snake is always there, he just navigates to different levels.
    this.backgroundNode = new BackgroundNode( cupcakeSnakeModel );
    this.playArea.addChild( this.backgroundNode );
    this.playArea.addChild( this.levelLayer );
    this.playArea.addChild( this.snakeView );

    cupcakeSnakeModel.snake.cutEmitter.addListener( function( point ) {
      var starNode = new StarNode( {
        filledFill: 'red',
        center: point
      } );
      cupcakeSnakeScreenView.starNodes.add( starNode );
      cupcakeSnakeScreenView.playArea.addChild( starNode );
    } );

    this.playArea.visible = false;
    this.buttonControls.visible = false;
    this.levelReadout.visible = false;

    this.addChild( this.playArea );
    this.addChild( this.buttonControls );
    this.addChild( this.levelReadout );

    var KEY_LEFT = 37;
    var KEY_RIGHT = 39;
    var KEY_A = 65;
    var KEY_D = 68;
    var KEY_ENTER = 13;
    var KEY_SPACEBAR = 32;
    var keyEnterEmitter = new Emitter();
    var keySpacebarEmitter = new Emitter();

    document.addEventListener( 'keydown', function( event ) {
      if ( event.keyCode === KEY_ENTER ) {
        keyEnterEmitter.emit();
      }
      if ( event.keyCode === KEY_SPACEBAR ) {
        keySpacebarEmitter.emit();
      }
      if ( event.keyCode === KEY_LEFT || event.keyCode === KEY_A ) {
        cupcakeSnakeModel.left = true;
      }
      if ( event.keyCode === KEY_RIGHT || event.keyCode === KEY_D ) {
        cupcakeSnakeModel.right = true;
      }
    } );

    document.addEventListener( 'keyup', function( event ) {
      if ( event.keyCode === KEY_LEFT || event.keyCode === KEY_A ) {
        cupcakeSnakeModel.left = false;
      }
      if ( event.keyCode === KEY_RIGHT || event.keyCode === KEY_D ) {
        cupcakeSnakeModel.right = false;
      }
    } );
    if ( level !== 0 ) {
      this.closeHomeScreenAndStartLevel( level );
    }

    cupcakeSnakeScreenView.gameOverPanelShowing = false;
    cupcakeSnakeModel.deathEmitter.addListener( function( message ) {
      deathSound.play();

      cupcakeSnakeScreenView.gameOverPanelShowing = true;
      var gameOverPanel = new GameOverPanel( message, cupcakeSnakeScreenView.cupcakeSnakeModel, restart );
      gameOverPanel.centerBottom = cupcakeSnakeScreenView.layoutBounds.center.plusXY( 0, -75 );
      cupcakeSnakeScreenView.addChild( gameOverPanel );
      cupcakeSnakeScreenView.playArea.opacity = 0.7;
    } );

    var buttonListener = function() {
      if ( cupcakeSnakeScreenView.homeScreen ) {
        cupcakeSnakeScreenView.closeHomeScreenAndStartLevel( 1 );
      }
      else if ( cupcakeSnakeScreenView.gameOverPanelShowing ) {
        restart( cupcakeSnakeModel.currentLevel.number );
      }
    };
    keyEnterEmitter.addListener( buttonListener );
    keySpacebarEmitter.addListener( buttonListener );
  }

  return inherit( ScreenView, CupcakeSnakeScreenView, {
    closeHomeScreenAndStartLevel: function( level ) {
      var self = this;

      this.removeChild( this.homeScreen );
      this.homeScreen = null;

      this.playArea.visible = true;
      this.buttonControls.visible = true;
      this.levelReadout.visible = true;

      // Listen to the model's visible levels, and add/remove the corresponding level views
      this.levelViews = [];
      this.cupcakeSnakeModel.visibleLevels.addItemAddedListener( function( level ) {
        var levelView = new LevelView( level );
        self.levelLayer.addChild( levelView );
        self.levelViews.push( levelView );
      } );
      this.cupcakeSnakeModel.visibleLevels.addItemRemovedListener( function( level ) {
        for ( var i = 0; i < self.levelViews.length; i++ ) {
          var levelView = self.levelViews[ i ];
          if ( levelView.level === level ) {
            self.levelViews.splice( i, 1 );
            self.levelLayer.removeChild( levelView );
            break;
          }
        }
      } );

      this.startLevel( level );
      this.cupcakeSnakeModel.running = true;
    },

    startLevel: function( levelNumber ) {
      this.cupcakeSnakeModel.startLevel( Level.levels[ levelNumber - 1 ] );
      this.backgroundNode.sync();
    },

    step: function( dt ) {
      var toRemove = [];
      for ( var i = 0; i < this.starNodes.getArray().length; i++ ) {
        var starNode = this.starNodes.getArray()[ i ];
        var center = starNode.center;
        var m = starNode.getScaleVector().timesScalar( 0.96 );
        starNode.setScaleMagnitude( m );
        starNode.center = center;
        if ( m.magnitude() < 0.1 ) {
          this.playArea.removeChild( starNode );
          toRemove.push( starNode );
        }
      }
      this.starNodes.removeAll( toRemove );
      this.playArea.setTranslation( scratchVector.set( this.cupcakeSnakeModel.snake.position ).negate().add( this.layoutCenter ) );

      if ( this.snakeView ) {
        this.snakeView.invalidatePaint();
      }

      if ( this.homeScreen ) {
        this.homeScreen.step( dt );
      }

      this.backgroundNode.step( dt );
    }
  } );
} );