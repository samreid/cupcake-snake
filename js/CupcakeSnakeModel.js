define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Snake = require( 'CUPCAKE_SNAKE/model/Snake' );
  var Vector2 = require( 'DOT/Vector2' );

  function CupcakeSnakeModel() {
    var self = this;

    PropertySet.call( this, {
      left: false,
      right: false,
      motion: Snake.STRAIGHT
    } );

    this.snake = new Snake( new Vector2( 0, 0 ), new Vector2( 0, -1 ), 10, 30 );

    this.multilink( [ 'left', 'right' ], function() {
      self.motion = ( self.left === self.right ) ? Snake.STRAIGHT : ( self.left ? Snake.LEFT : Snake.RIGHT );
    } );
  }

  return inherit( PropertySet, CupcakeSnakeModel, {
    step: function( dt ) {
      this.snake.step( 150 * dt, 75 * dt, this.motion );
    }
  } );
} );