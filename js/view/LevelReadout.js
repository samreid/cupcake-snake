// Copyright 2015

/**
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var RectangularMomentaryButton = require( 'SUN/buttons/RectangularMomentaryButton' );
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var Property = require( 'AXON/Property' );
  var Vector2 = require( 'DOT/Vector2' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Image = require( 'SCENERY/nodes/Image' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  function LevelReadout( cupcakeSnakeScreenView ) {
    Node.call( this );

    var cupcakeSnakeModel = cupcakeSnakeScreenView.cupcakeSnakeModel;

    var text = new Text( 'Level: ', {
      font: new PhetFont( { size: 22, weight: 'bold' } )
    } );

    cupcakeSnakeModel.currentLevelProperty.link( function( currentLevel ) {
      var number = currentLevel ? currentLevel.number : '?';
      text.text = 'Level: ' + number;
    } );
    this.addChild( text );

    var levelReadout = this;
    cupcakeSnakeScreenView.events.on( 'layoutFinished', function( dx, dy, width, height ) {
        levelReadout.left = -dx + 10;
        levelReadout.top = -dy + 10;
      }
    );
  }

  return inherit( Node, LevelReadout, {} );
} );