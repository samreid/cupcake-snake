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

  var numberOfReplays = 0;

  // audio
  var chomp = require( 'audio!CUPCAKE_SNAKE/chomp' );
  var chompSound = new Sound( chomp );

  var cut = require( 'audio!CUPCAKE_SNAKE/cut' );
  var cutSound = new Sound( cut );

  var INITIAL_SNAKE_LENGTH = 150;
  var INITIAL_SNAKE_RADIUS = 30;

  function CupcakeSnakeModel( idontknowwhatthisis, restart ) {
    this.restartEntireGame = restart;
    var self = this;
    this.deathEmitter = new Emitter();

    PropertySet.call( this, {
      left: false,
      right: false,
      everTurned: false,
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
      self.everTurned = self.everTurned || self.left || self.right;
    } );

    this.running = false;
  }

  return inherit( PropertySet, CupcakeSnakeModel, {
    step: function( dt ) {
      if ( dt > 0.5 ) {
        dt = 0.5;
      }

      var cupcakeSnakeModel = this;

      if ( this.running && this.alive ) {
        var growLength = ( 110 + numberOfReplays * 80 ) * dt;
        var shrinkLength = Math.max( growLength - this.remainingLengthToGrow, 0 );
        this.snake.step( growLength, shrinkLength, this.motion );
        this.remainingLengthToGrow = Math.max( this.remainingLengthToGrow - growLength, 0 );

        // Button intersection
        this.currentLevel.bluePressed = this.snake.intersectsSegments( this.currentLevel.blueButton.segments );
        this.currentLevel.yellowPressed = this.snake.intersectsSegments( this.currentLevel.yellowButton.segments );

        // Door intersection
        if ( Intersection.intersect( this.snake.currentSegment.segment, this.currentLevel.door.segment ) ) {
          this.currentLevel.active = false;

          if ( this.currentLevel.nextLevel ) {
            var level = this.currentLevel.nextLevel.copy();
            level.previousLevel = this.currentLevel; // hook for later
            this.visibleLevels.push( level );
            this.currentLevel = level;
          }
          else {

            // reached the last level, cycle back to level 1, but faster
            numberOfReplays++;
            this.running = false;
            this.restartEntireGame( 1 );
            return;
          }
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
            this.remainingLengthToGrow += 100; // for debugging, make this larger
          }
        }
        this.currentLevel.cupcakes.removeAll( toRemove );
        if ( toRemove.length > 0 ) {
          this.snake.triggerTongue();
          chompSound.play();
        }

        var hitObstacle = false;
        var hitMessage = null;

        // Check if the snake hit a wall
        for ( var k = 0; k < this.currentLevel.walls.length && !hitObstacle; k++ ) {
          var wall = this.currentLevel.walls[ k ];

          var hit = this.snake.intersectsSegments( wall.segments, true );
          if ( hit ) {
            hitObstacle = true;
            hitMessage = 'Thou hast been slain by a mere wall!';
            break;
          }
        }

        var previousLevel = this.currentLevel.previousLevel;
        if ( previousLevel ) {
          // hit-test against the closed door (if we passed it)
          var headOverDoor = Intersection.intersect( this.snake.currentSegment.segment, previousLevel.door.segment );
          if ( headOverDoor ) {
            if ( previousLevel.headOut ) {
              hitMessage = 'My mother always said to not dwell in the past.';
              hitObstacle = true;
            }
          }
          else {
            previousLevel.headOut = true;
          }

          // see if we can make the previous level invisible
          if ( this.visibleLevels.contains( previousLevel ) ) {
            var bodyOverDoor = this.snake.intersectsSegments( [ previousLevel.door.segment ] );

            if ( !bodyOverDoor ) {
              previousLevel.snakeFullyOut = true;
              this.visibleLevels.remove( previousLevel );
            }
          }
        }

        // Check if the snake hit the doors
        // Comment out to make it easy to transition
        if ( ( !this.currentLevel.bluePressed && this.snake.intersectsSegments( this.currentLevel.door.blueSegments, false ) ) ||
             ( !this.currentLevel.yellowPressed && this.snake.intersectsSegments( this.currentLevel.door.yellowSegments, false ) ) ) {
          hitObstacle = true;
          if ( this.currentLevel.everPressed ) {
            hitMessage = 'Looks like there\'s no open-door policy here.';
          }
          else {
            hitMessage = 'Try slithering over a button to open this door.';
          }
        }

        // check obstacles
        for ( var m = 0; m < this.currentLevel.obstacles.length; m++ ) {
          var obstacle = this.currentLevel.obstacles[ m ];

          obstacle.step( dt );

          for ( var p = 0; p < obstacle.segments.length; p++ ) {
            var segment = obstacle.segments[ p ];

            var hit = this.snake.intersectRange( segment, 0, this.snake.segments.length );
            if ( hit ) {
              // head hit?
              if ( this.snake.endLength - hit.length < 7 ) {
                hitObstacle = true;
                hitMessage = obstacle.message;
              }
              // otherwise cut body
              else {
                this.snake.cut( hit.length );

                cutSound.play();
                this.snake.cutEmitter.emit1( hit.point );
              }
            }
          }
        }

        if ( hitObstacle ) {
          if ( !this.everTurned && this.currentLevel.number === 1 ) {
            hitMessage = 'Try the left/right arrow keys or the on-screen buttons';
          }

          // snake died (perhaps in the future)
          this.deathEmitter.emit1( hitMessage );
          this.alive = false;
        }
      }
    },

    startLevel: function( level ) {
      level = level.copy();

      this.visibleLevels.clear();
      this.visibleLevels.push( level );
      this.currentLevel = level;

      this.snake.reinitialize( level.startPosition.copy(), level.startAngle.copy(), INITIAL_SNAKE_LENGTH, INITIAL_SNAKE_RADIUS );
    }
  } );
} );