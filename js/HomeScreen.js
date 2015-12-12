define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Image = require( 'SCENERY/nodes/Image' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  // images
  var snakeImage = require( 'image!CUPCAKE_SNAKE/snake.png' );
  var cupcakeImage = require( 'image!CUPCAKE_SNAKE/cupcake-large.png' );

  function HomeScreen( bounds, options ) {
    var startGameButton = new RectangularPushButton( {
      content: new Text( 'Start Game', {
        font: new PhetFont( { size: 40, weight: 'bold' } )
      } ),
      baseColor: '#a63137',
      centerX: bounds.centerX,
      bottom: bounds.maxY - 10
    } );

    var instructions = new Text( 'use arrow keys', { font: new PhetFont( { size: 28 } ) } );
    instructions.left = startGameButton.right + 80;
    instructions.centerY = startGameButton.centerY;

    var subtitle = new Text( 'Ludum Dare 34', { font: new PhetFont( { size: 28 } ) } );
    subtitle.right = startGameButton.left - 80;
    subtitle.centerY = startGameButton.centerY;

    var titleText = new Text( 'Cupcake Snake', {
      font: new PhetFont( { size: 105 } ),
      centerX: bounds.centerX,
      top: 10
    } );

    Node.call( this, {
      children: [
        startGameButton,
        instructions,
        titleText,
        subtitle,
        new Image( snakeImage, { scale: 0.8, right: bounds.maxX - 50, bottom: startGameButton.top - 10 } ),
        new Image( cupcakeImage, { scale: 0.8, left: bounds.minX + 200, bottom: startGameButton.top - 10 } )
      ]
    } );
  }

  return inherit( Node, HomeScreen, {} );
} );