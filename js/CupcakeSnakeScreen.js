define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );
  var Text = require( 'SCENERY/nodes/Text' );
  var CupcakeSnakeScreenView = require( 'CUPCAKE_SNAKE/CupcakeSnakeScreenView' );
  var CupcakeSnakeModel = require( 'CUPCAKE_SNAKE/CupcakeSnakeModel' );

  /**
   * @constructor
   */
  function CupcakeSnakeScreen() {
    Screen.call( this, 'Cupcake Snake', new Text( 'hello' ),
      function() { return new CupcakeSnakeModel(); },
      function( model ) {
        return new CupcakeSnakeScreenView( model );
      }, {
        backgroundColor: 'white'
      }
    );
  }

  return inherit( Screen, CupcakeSnakeScreen );
} );