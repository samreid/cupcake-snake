define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );
  var Text = require( 'SCENERY/nodes/Text' );
  var CupcakeSnakeScreenView = require( 'CUPCAKE_SNAKE/view/CupcakeSnakeScreenView' );
  var CupcakeSnakeModel = require( 'CUPCAKE_SNAKE/model/CupcakeSnakeModel' );

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