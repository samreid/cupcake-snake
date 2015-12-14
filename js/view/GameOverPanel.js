// Copyright 2015, University of Colorado Boulder

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Panel = require( 'SUN/Panel' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );

  function GameOverPanel( cupcakeSnakeModel, restart ) {
    Node.call( this );

    var restartLevelButton = new RectangularPushButton( {
      content: new Text( 'Restart Level', {
        font: new PhetFont( { size: 40 } )
      } ),
      baseColor: '#f8515d',
      listener: function() {
        restart( cupcakeSnakeModel.level );
      }
    } );

    var homeScreenButton = new RectangularPushButton( {
      content: new Text( 'Home', {
        font: new PhetFont( { size: 40 } )
      } ),
      baseColor: '#f8515d',
      listener: function() {
        restart( 0 );
      }
    } );

    var contents = new VBox( {
      spacing: 50,
      children: [
        new Text( 'Game Over', {
          font: new PhetFont( { size: 76, weight: 'bold' } )

        } ),
        new HBox( {
          spacing: 25,
          children: [ restartLevelButton, homeScreenButton ]
        } )
      ]
    } );
    this.addChild( new Panel( contents ) );
  }

  return inherit( Node, GameOverPanel, {} );
} );