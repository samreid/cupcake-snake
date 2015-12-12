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
    var bounds = new Bounds2( 0, 0, 1024, 618 );
    ScreenView.call( this, { layoutBounds: bounds } );

    //this.addChild( new Text( 'Level 1', { top: 10, left: 10, font: new PhetFont( { size: 30, weight: 'bold' } ) } ) );

    // this.addChild( new HomeScreen( bounds, { centerX: bounds.centerX, centerY: bounds.centerY } ) );

    this.snakeView = new SnakeView( cupcakeSnakeModel.snake );
    this.addChild( this.snakeView );
  }

  return inherit( ScreenView, CupcakeSnakeScreenView, {
    step: function( dt ) {
      this.snakeView.invalidatePaint();
    }
  } );
} );