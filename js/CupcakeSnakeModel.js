define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Snake = require( 'CUPCAKE_SNAKE/model/Snake' );
  var Vector2 = require( 'DOT/Vector2' );
  var ObservableArray = require( 'AXON/ObservableArray' );

  function CupcakeSnakeModel() {
    var self = this;

    PropertySet.call( this, {
      left: false,
      right: false,
      remainingLengthToGrow: 0,
      motion: Snake.STRAIGHT
    } );
    window.model = this;

    this.walls = [];
    this.cupcakes = new ObservableArray();

    this.snake = new Snake( new Vector2( 0, 0 ), new Vector2( 0, -1 ), 200, 30 );

    this.multilink( [ 'left', 'right' ], function() {
      self.motion = ( self.left === self.right ) ? Snake.STRAIGHT : ( self.left ? Snake.LEFT : Snake.RIGHT );
    } );

    this.running = false;
  }

  return inherit( PropertySet, CupcakeSnakeModel, {
    step: function( dt ) {
      if ( this.running ) {
        var growLength = 150 * dt;
        var shrinkLength = Math.max( growLength - this.remainingLengthToGrow, 0 );
        this.snake.step( growLength, shrinkLength, this.motion );
        this.remainingLengthToGrow = Math.max( this.remainingLengthToGrow - growLength, 0 );

        var cupcakeArray = this.cupcakes.getArray();
        var toRemove = [];
        for ( var i = 0; i < cupcakeArray.length; i++ ) {
          var cupcake = cupcakeArray[ i ];
          var dx = cupcake.x - this.snake.position.x;
          var dy = cupcake.y - this.snake.position.y;

          var distance = Math.sqrt( dx * dx + dy * dy );
          if ( distance < 50 ) {
            toRemove.push( cupcake );
            this.remainingLengthToGrow += 100;
          }
        }
        this.cupcakes.removeAll( toRemove );
      }
    }
  } );
} );