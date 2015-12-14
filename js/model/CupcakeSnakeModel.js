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

  var INITIAL_SNAKE_LENGTH = 150;
  var INITIAL_SNAKE_RADIUS = 30;

  function CupcakeSnakeModel() {
    var self = this;
    this.deathEmitter = new Emitter();

    PropertySet.call( this, {
      left: false,
      right: false,
      remainingLengthToGrow: 0,
      motion: Snake.STRAIGHT,
      currentLevel: null, // Level
      alive: true,
      level: 0 // {number} 0 is home screen, 1 is level 1
    } );
    window.model = this;

    this.snake = new Snake( new Vector2( 0, 0 ), new Vector2( 0, -1 ), INITIAL_SNAKE_LENGTH, INITIAL_SNAKE_RADIUS );

    this.visibleLevels = new ObservableArray(); // .<Level>

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

        // Door intersection
        if ( Intersection.intersect( this.snake.currentSegment.segment, this.currentLevel.door.segment ) ) {
          var level = this.currentLevel.nextLevel;
          this.visibleLevels.push( level );
          this.currentLevel = level;
        }

        var cupcakeArray = this.currentLevel.cupcakes.getArray();
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
        this.currentLevel.cupcakes.removeAll( toRemove );
        if ( toRemove.length > 0 ) {
          chompSound.play();
        }

        // Check if the snake hit a wall
        var wallHits = [];
        for ( var k = 0; k < this.currentLevel.walls.length; k++ ) {
          var wall = this.currentLevel.walls[ k ];

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
    },

    startLevel: function( level ) {
      this.visibleLevels.clear();
      this.visibleLevels.push( level );
      this.currentLevel = level;

      this.snake.reinitialize( level.startPosition.copy(), new Vector2( 0, -1 ), INITIAL_SNAKE_LENGTH, INITIAL_SNAKE_RADIUS );
    }
  } );
} );