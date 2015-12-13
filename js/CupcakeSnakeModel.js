define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Snake = require( 'CUPCAKE_SNAKE/model/Snake' );
  var Vector2 = require( 'DOT/Vector2' );

  function CupcakeSnakeModel() {
    this.snake = new Snake( new Vector2( 0, 0 ), new Vector2( 1, 0 ), 10, 30 );
    this.motion = this.snake.motion;
  }

  return inherit( Object, CupcakeSnakeModel, {
    step: function( dt ) {
      this.snake.step( 30 * dt, 15 * dt, this.motion );
    }
  } );
} );