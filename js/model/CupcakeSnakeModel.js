define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Snake = require( 'CUPCAKE_SNAKE/model/Snake' );
  var Vector2 = require( 'DOT/Vector2' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var Intersection = require( 'CUPCAKE_SNAKE/model/Intersection' );
  var Emitter = require( 'AXON/Emitter' );

  var Sound = require( 'VIBE/Sound' );

  // audio
  var chomp = require( 'audio!CUPCAKE_SNAKE/chomp' );
  var chompSound = new Sound( chomp );

  function CupcakeSnakeModel() {
    var self = this;
    this.deathEmitter = new Emitter();

    PropertySet.call( this, {
      left: false,
      right: false,
      remainingLengthToGrow: 0,
      motion: Snake.STRAIGHT,
      alive: true,
      level: 0 // {number} 0 is home screen, 1 is level 1
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
      var cupcakeSnakeModel = this;

      if ( this.running && this.alive ) {
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
          if ( distance < 30 ) {
            toRemove.push( cupcake );
            this.remainingLengthToGrow += 100;
          }
        }
        this.cupcakes.removeAll( toRemove );
        if ( toRemove.length > 0 ) {
          chompSound.play();
        }

        // Check if the snake hit a wall
        var wallHits = [];
        for ( var k = 0; k < this.walls.length; k++ ) {
          var wall = this.walls[ k ];

          wall.segments.forEach( function( wallSegment ) {
            cupcakeSnakeModel.snake.segments.forEach( function( snakeSegment ) {
              var segmentHits = Intersection.intersect( wallSegment, snakeSegment.segment );
              if ( segmentHits ) {
                // debugger;
                // Intersection.intersect( wallSegment, snakeSegment.segment );
                wallHits = wallHits.concat( segmentHits );
              }
            } );
          } );
        }
        if ( wallHits.length > 0 ) {

          // snake died (perhaps in the future)
          this.deathEmitter.emit();
          this.alive = false;
        }
      }
    }
  } );
} );