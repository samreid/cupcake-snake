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
  var titleImage = require( 'image!CUPCAKE_SNAKE/cupcake-title.png' );

  function HomeScreen( options ) {
    var homeScreenContents = new Node( {
      children: [
        new Text( 'hello' ),
        new Image( titleImage ),
        new RectangularPushButton( {
          content: new Text( 'Start Game', { font: new PhetFont( { size: 30, weight: 'bold' } ) } )
        } )
      ]
    } );
    Panel.call( this, homeScreenContents, options );
  }

  return inherit( Panel, HomeScreen, {} );
} );