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
      remainingLengthToGrow: 0,
      motion: Snake.STRAIGHT
    } );

    this.walls = [];

    this.snake = new Snake( new Vector2( 0, 0 ), new Vector2( 0, -1 ), 200, 30 );

    this.multilink( [ 'left', 'right' ], function() {
      self.motion = ( self.left === self.right ) ? Snake.STRAIGHT : ( self.left ? Snake.LEFT : Snake.RIGHT );
    } );
  }

  return inherit( PropertySet, CupcakeSnakeModel, {
    step: function( dt ) {
      var growLength = 150 * dt;
      var shrinkLength = Math.max( growLength - this.remainingLengthToGrow, 0 );
      this.snake.step( growLength, shrinkLength, this.motion );
      this.remainingLengthToGrow = Math.max( this.remainingLengthToGrow - growLength, 0 );
    }
  } );
} );