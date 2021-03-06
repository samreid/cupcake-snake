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

  function GameOverPanel( message, cupcakeSnakeModel, restart ) {
    Node.call( this );

    var restartLevelButton = new RectangularPushButton( {
      content: new Text( 'Restart Level', {
        font: new PhetFont( { size: 25 } )
      } ),
      baseColor: '#71f84d',
      listener: function() {
        restart( cupcakeSnakeModel.currentLevel.number );
      }
    } );

    var homeScreenButton = new RectangularPushButton( {
      content: new Text( 'Home', {
        font: new PhetFont( { size: 25 } )
      } ),
      baseColor: 'rgb(255,250,115)',
      listener: function() {
        restart( 0 );
      }
    } );

    var contents = new VBox( {
      spacing: 20,
      children: [
        new Text( 'Ouch!', {
          font: new PhetFont( { size: 60, weight: 'bold' } )
        } ),
        new Text( message, {
          font: new PhetFont( { size: 30 } )
        } ),
        new HBox( {
          spacing: 25,
          children: [ restartLevelButton, homeScreenButton ]
        } )
      ]
    } );
    this.addChild( new Panel( contents, {
      xMargin: 20,
      yMargin: 15
    } ) );
  }

  return inherit( Node, GameOverPanel, {} );
} );