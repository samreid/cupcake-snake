// Copyright 2015

/**
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var cupcakeSnake = require( 'CUPCAKE_SNAKE/cupcakeSnake' );
  var Cupcake = require( 'CUPCAKE_SNAKE/model/Cupcake' );
  var Spinner = require( 'CUPCAKE_SNAKE/model/Spinner' );
  var Slicer = require( 'CUPCAKE_SNAKE/model/Slicer' );
  var Door = require( 'CUPCAKE_SNAKE/model/Door' );
  var Wall = require( 'CUPCAKE_SNAKE/model/Wall' );
  var Button = require( 'CUPCAKE_SNAKE/model/Button' );
  var Vector2 = require( 'DOT/Vector2' );
  var Line = require( 'KITE/segments/Line' );
  var Arc = require( 'KITE/segments/Arc' );
  var Shape = require( 'KITE/Shape' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var createLevel3 = require( 'CUPCAKE_SNAKE/model/createLevel3' );

  var Sound = require( 'VIBE/Sound' );

  var toneUp = require( 'audio!CUPCAKE_SNAKE/zapThreeToneUp' );
  var toneUpSound = new Sound( toneUp );

  var toneUp2 = require( 'audio!CUPCAKE_SNAKE/zapThreeToneUp2' );
  var toneUp2Sound = new Sound( toneUp2 );

  var toneDown = require( 'audio!CUPCAKE_SNAKE/zapThreeToneDown' );
  var toneDownSound = new Sound( toneDown );

  // TODO: add to Kite?
  function reverseSegment( segment ) {
    if ( segment instanceof Line ) {
      return new Line( segment.end, segment.start );
    }
    else if ( segment instanceof Arc ) {
      return new Arc( segment.center, segment.radius, segment.endAngle, segment.startAngle, !segment.anticlockwise );
    }
    else {
      throw new Error( 'reverse segment!' );
    }
  }

  function shapeToSegments( shape, reverse ) {
    var result = [];
    shape.subpaths.forEach( function( subpath ) {
      if ( subpath.segments.length ) {
        var segments = subpath.segments.slice();
        if ( subpath.isClosed() && subpath.hasClosingSegment() ) {
          segments.push( subpath.getClosingSegment() );
        }
        if ( reverse ) {
          // reverse order of segments, and the segments individually
          segments = segments.slice();
          segments.reverse();
          segments = segments.map( reverseSegment );
        }
        result = result.concat( segments );
      }
    } );
    return result;
  }

  function Level( doorLeft, doorRight, startPosition, startAngle ) {
    var self = this;

    PropertySet.call( this, {
      bluePressed: false,
      yellowPressed: false,
      everPressed: false,
      active: true,
      headOut: false,
      snakeFullyOut: false
    } );
    this.door = new Door( doorLeft, doorRight );
    this.walls = [];
    this.obstacles = [];
    this.cupcakes = new ObservableArray();
    this.doorLeft = doorLeft; // Vector2
    this.doorRight = doorRight; // Vector2
    this.startPosition = startPosition; // Vector2
    this.startAngle = startAngle; // Vector2

    this.multilink( [ 'bluePressed', 'yellowPressed' ], function() {
      self.everPressed = self.everPressed || self.bluePressed || self.yellowPressed;
    } );

    this.bluePressedProperty.lazyLink( function( bluePressed ) {
      if ( bluePressed ) {
        if ( self.yellowPressed ) {
          toneUp2Sound.play();
        }
        else {
          toneUpSound.play();

        }
      }
      else {
        toneDownSound.play();
      }
    } );

    this.yellowPressedProperty.lazyLink( function( yellowPressed ) {
      if ( yellowPressed ) {
        if ( self.bluePressed ) {
          toneUp2Sound.play();
        }
        else {
          toneUpSound.play();
        }
      }
      else {
        toneDownSound.play();
      }
    } );
  }

  inherit( PropertySet, Level, {
    isPressingBlue: function( pressing ) {
      if ( this.active ) {
        this.bluePressed = pressing;
      }
    },

    isPressingYellow: function( pressing ) {
      if ( this.active ) {
        this.yellowPressed = pressing;
      }
    },

    copy: function() {
      var level = new Level( this.doorLeft, this.doorRight, this.startPosition, this.startAngle );
      level.walls = this.walls;
      level.obstacles = this.obstacles.map( function( obstacle ) { return obstacle.copy(); } );
      level.blueButton = this.blueButton;
      level.yellowButton = this.yellowButton;
      this.cupcakes.forEach( function( cupcake ) {
        level.cupcakes.push( cupcake.copy() );
      } );
      level.number = this.number;
      level.nextLevel = this.nextLevel;
      level.previousLevel = this.previousLevel;
      return level;
    },

    addBlueButton: function( shape ) {
      this.blueButton = new Button( shapeToSegments( shape, false ) );

      return this;
    },

    addYellowButton: function( shape ) {
      this.yellowButton = new Button( shapeToSegments( shape, false ) );

      return this;
    },

    addObstacle: function( obstacle ) {
      this.obstacles.push( obstacle );

      return this;
    },

    // construction
    addWall: function( wall ) {
      // TODO: handle coordinate offsets between levels (snake for levels starts at (0,0?)?
      this.walls.push( wall );

      return this; // chaining
    },

    // construction
    // {kite.Shape}
    addWallShape: function( shape, isInteriorWall ) {
      this.addWall( new Wall( shapeToSegments( shape, isInteriorWall ) ) );

      return this;
    },

    // construction
    addCupcake: function( cupcake ) {
      // TODO: handle coordinate offsets between levels (snake for levels starts at (0,0?)?
      this.cupcakes.push( cupcake );

      return this; // chaining
    }
  } );
  cupcakeSnake.register( 'Level', Level );

  function smooth( points ) {
    if ( points.length < 3 ) {
      return points;
    }

    var result = [];

    var position = points[ 0 ];

    for ( var i = 1; i < points.length - 1; i++ ) {
      var point0 = points[ i - 1 ];
      var point1 = points[ i ];
      var point2 = points[ i + 1 ];

      if ( point1.curved ) {
        var radius = point1.radius;
        var dir0 = point0.minus( point1 ).normalized();
        var dir2 = point2.minus( point1 ).normalized();

        var directionToCenter = dir0.blend( dir2, 0.5 ).normalized();

        var angleBetween = dir0.angleBetween( dir2 );
        var alpha = angleBetween / 2;
        var beta = Math.PI / 2 - alpha;
        var lineOffsetMagnitude = Math.tan( beta ) * radius;
        var magnitudeToCenter = Math.sqrt( radius * radius + lineOffsetMagnitude * lineOffsetMagnitude ); // pythagoras
        var center = point1.plus( directionToCenter.timesScalar( magnitudeToCenter ) );

        var midAngle = directionToCenter.negated().angle();

        var point0Offset = point1.plus( dir0.timesScalar( lineOffsetMagnitude ) );
        var point2Offset = point1.plus( dir2.timesScalar( lineOffsetMagnitude ) );

        result.push( new Line( position, point0Offset ) );
        position = point2Offset;
        if ( dir0.crossScalar( directionToCenter ) > 0 ) {
          result.push( new Arc( center, radius, midAngle + beta, midAngle - beta, true ) );
          // result.push( new Line( point0Offset, point2Offset ) );
        }
        else {
          result.push( new Arc( center, radius, midAngle - beta, midAngle + beta, false ) );
          // result.push( new Line( point0Offset, point2Offset ) );
        }
      }
      else {
        // simple?
        result.push( new Line( position, point1 ) );
        position = point1;
      }

    }
    result.push( new Line( position, points[ points.length - 1 ] ) );

    return result;
  }

  function c( x, y, radius, offset ) {
    var result = new Vector2( x, y );
    if ( offset ) {
      result.add( offset );
    }
    result.curved = true;
    result.radius = radius;
    return result;
  }

  function v( x, y, offset ) {
    var result = new Vector2( x, y );
    if ( offset ) {
      result.add( offset );
    }
    return result;
  }

  var level3 = createLevel3( v, c, smooth, Level, Wall, Shape, shapeToSegments, Slicer, Cupcake );

  var level4Offset = level3.door.center;
  var level4 = new Level( level3.door.left.plus( v( 0, -1050 ) ), level3.door.right.plus( v( 0, -1050 ) ), level4Offset.plus( v( 0, -30 ) ), v( 0, -1 ) );
  {
    var verticalOffset = 100 + 30;
    var horizontalOffset = verticalOffset * Math.sqrt( 3 ) / 2;
    var wallX = horizontalOffset * 2.7;
    level4.addWall( new Wall( smooth( [
      v( -50, 0, level4Offset ),
      c( -wallX, -150, 50, level4Offset ),

      // v( -wallX, -350 - verticalOffset * 1.2, level4Offset ),
      // c( -wallX + verticalOffset * 0.2, -350 - verticalOffset * 1, level4Offset ),
      // c( -wallX, -350 - verticalOffset * 0.8, level4Offset ),

      // v( -wallX, -350 - verticalOffset * 1, level4Offset ),
      // c( -wallX + 50, -350 - verticalOffset * 1, level4Offset ),
      // c( -wallX, -350 - verticalOffset * 1, level4Offset ),

      v( -wallX, -350 - verticalOffset * 1.3, level4Offset ),
      v( -wallX + 40, -350 - verticalOffset * 1.5, level4Offset ),
      v( -wallX, -350 - verticalOffset * 1.7, level4Offset ),

      c( -wallX, -800, 50, level4Offset ),
      c( -50, -950, 50, level4Offset ),
      v( -50, -1050, level4Offset ),
      v( 50, -1050, level4Offset ),
      c( 50, -950, 50, level4Offset ),
      c( wallX, -800, 50, level4Offset ),

      v( wallX, -350 - verticalOffset * 1.7, level4Offset ),
      v( wallX - 40, -350 - verticalOffset * 1.5, level4Offset ),
      v( wallX, -350 - verticalOffset * 1.3, level4Offset ),

      c( wallX, -150, 50, level4Offset ),
      v( 50, 0, level4Offset )
    ] ) ) );
    level4.addWallShape( Shape.circle( level4Offset.x, level4Offset.y - 350 - verticalOffset * 0, 50 ), true );
    level4.addWallShape( Shape.circle( level4Offset.x, level4Offset.y - 350 - verticalOffset * 1 , 50 ), true );
    level4.addWallShape( Shape.circle( level4Offset.x, level4Offset.y - 350 - verticalOffset * 2 , 50 ), true );
    level4.addWallShape( Shape.circle( level4Offset.x, level4Offset.y - 350 - verticalOffset * 3 , 50 ), true );

    level4.addWallShape( Shape.circle( level4Offset.x - horizontalOffset * 1, level4Offset.y - 350 - verticalOffset * 0.5 , 50 ), true );
    // level4.addWallShape( Shape.circle( level4Offset.x - horizontalOffset * 1, level4Offset.y - 350 - verticalOffset * 1.5 , 50 ), true );
    level4.addWallShape( Shape.circle( level4Offset.x - horizontalOffset * 1, level4Offset.y - 350 - verticalOffset * 2.5 , 50 ), true );

    level4.addWallShape( Shape.circle( level4Offset.x + horizontalOffset * 1, level4Offset.y - 350 - verticalOffset * 0.5 , 50 ), true );
    // level4.addWallShape( Shape.circle( level4Offset.x + horizontalOffset * 1, level4Offset.y - 350 - verticalOffset * 1.5 , 50 ), true );
    level4.addWallShape( Shape.circle( level4Offset.x + horizontalOffset * 1, level4Offset.y - 350 - verticalOffset * 2.5 , 50 ), true );

    level4.addWallShape( Shape.circle( level4Offset.x - horizontalOffset * 2, level4Offset.y - 350 - verticalOffset * 1 , 50 ), true );
    level4.addWallShape( Shape.circle( level4Offset.x - horizontalOffset * 2, level4Offset.y - 350 - verticalOffset * 2 , 50 ), true );

    level4.addWallShape( Shape.circle( level4Offset.x + horizontalOffset * 2, level4Offset.y - 350 - verticalOffset * 1 , 50 ), true );
    level4.addWallShape( Shape.circle( level4Offset.x + horizontalOffset * 2, level4Offset.y - 350 - verticalOffset * 2 , 50 ), true );

    level4.addBlueButton( Shape.circle( level4Offset.x - horizontalOffset * 1, level4Offset.y - 350 - verticalOffset * 1.5, 50 ) );
    level4.addYellowButton( Shape.circle( level4Offset.x + horizontalOffset * 1, level4Offset.y - 350 - verticalOffset * 1.5, 50 ) );

    // level4.addCupcake( new Cupcake( level4Offset.x, level4Offset.y - 350 - verticalOffset * 4 ) );
    level4.addCupcake( new Cupcake( level4Offset.x - horizontalOffset * 1, level4Offset.y - 350 - verticalOffset * 3.5 ) );
    level4.addCupcake( new Cupcake( level4Offset.x + horizontalOffset * 1, level4Offset.y - 350 - verticalOffset * 3.5 ) );
    level4.addCupcake( new Cupcake( level4Offset.x - horizontalOffset * 1, level4Offset.y - 350 - verticalOffset * -0.5 ) );
    level4.addCupcake( new Cupcake( level4Offset.x + horizontalOffset * 1, level4Offset.y - 350 - verticalOffset * -0.5 ) );
    level4.addCupcake( new Cupcake( level4Offset.x - horizontalOffset * 2, level4Offset.y - 350 - verticalOffset * 0 ) );
    level4.addCupcake( new Cupcake( level4Offset.x + horizontalOffset * 2, level4Offset.y - 350 - verticalOffset * 0 ) );
  }

  var level5Offset = level4.door.center;
  var level5 = new Level( level4.door.left.plus( v( 0, -1200 ) ), level4.door.right.plus( v( 0, -1200 ) ), level5Offset.plus( v( 0, -30 ) ), v( 0, -1 ) );
  {
    var firstRadius = 70;
    var secondRadius = 50;
    level5.addWall( new Wall( smooth( [
      v( -50, 0, level5Offset ),
      v( -150, -200, level5Offset ),
      v( -firstRadius, -400, level5Offset ),
      v( -firstRadius, -900, level5Offset ),
      c( -250, -900, 50, level5Offset ),
      c( -250, -1150, 50, level5Offset ),
      v( -50, -1150, level5Offset ),
      v( -50, -1200, level5Offset ),
      v( 50, -1200, level5Offset ),
      v( 50, -1150, level5Offset ),
      c( 250, -1150, 50, level5Offset ),
      c( 250, -900, 50, level5Offset ),
      v( firstRadius, -900, level5Offset ),
      v( firstRadius, -400, level5Offset ),
      v( 150, -200, level5Offset ),
      v( 50, 0, level5Offset )
    ] ) ) );
    level5.addObstacle( new Spinner( level5Offset.plus( v( 0, -400 ) ), firstRadius, 20, 2 ) );
    level5.addObstacle( new Spinner( level5Offset.plus( v( 0, -700 ) ), firstRadius, 20, -2 ) );


    level5.addBlueButton( Shape.circle( level5Offset.x - 100, level5Offset.y - 1025, secondRadius ) );
    level5.addYellowButton( Shape.circle( level5Offset.x + 100, level5Offset.y - 1025, secondRadius ) );

    // covering buttons
    level5.addObstacle( new Spinner( level5Offset.plus( v( -100, -1025 ) ), firstRadius, 20, 0.2 ) );
    level5.addObstacle( new Spinner( level5Offset.plus( v( 100, -1025 ) ), firstRadius, 20, -0.2 ) );

    level5.addCupcake( new Cupcake( level5Offset.x, level5Offset.y - 850 ) );
    level5.addCupcake( new Cupcake( level5Offset.x, level5Offset.y - 950 ) );
    level5.addCupcake( new Cupcake( level5Offset.x, level5Offset.y - 1050 ) );

    level5.addCupcake( new Cupcake( level5Offset.x - 225, level5Offset.y - 1025 ) );
    level5.addCupcake( new Cupcake( level5Offset.x + 225, level5Offset.y - 1025 ) );
  }

  Level.levels = [
    new Level( v( -50, -450 ), v( 50, -450 ), v( 0, 0 ), v( 0, -1 ) ).addWall( new Wall( smooth( [
        v( -50, -450 ),
        c( -50, -400, 10 ),
        c( -200, -400, 40 ),
        c( -200, 0, 40 ),
        c( 200, 0, 40 ),
        c( 200, -400, 40 ),
        c( 50, -400, 10 ),
        v( 50, -450 ),
      ] ) ) )
      .addCupcake( new Cupcake( 0, -300 ) )
      .addCupcake( new Cupcake( -100, -100 ) )
      .addCupcake( new Cupcake( 100, -100 ) )
      .addBlueButton( Shape.circle( -100, -300, 30 ) )
      .addYellowButton( Shape.circle( 100, -300, 30 ) ),

    new Level( v( 850, -1350 ), v( 850, -1250 ), v( 0, -450 ), v( 0, -1 ) )
      .addWall( new Wall( smooth( [
        v( 50, -450 ),
        c( 100, -500, 20 ),
        c( 100, -1200, 50 ),
        c( 300, -1200, 50 ),
        c( 300, -1000, 50 ),
        c( 800, -1000, 50 ),
        v( 800, -1250 ),
        v( 850, -1250 ),
        // ...?
        v( 850, -1350 ),
        v( 800, -1350 ),
        c( 800, -1600, 50 ),

        v( 570, -1600 ),
        v( 570, -1100 ),
        v( 530, -1100 ),
        v( 530, -1600 ),

        c( 300, -1600, 50 ),
        c( 300, -1400, 50 ),
        c( -300, -1400, 50 ),
        c( -300, -1200, 50 ),
        c( -100, -1200, 50 ),
        c( -100, -500, 20 ),
        v( -50, -450 )
      ] ) ) )

      .addWall( new Wall( smooth( [
        v( 450 - 50, -1500 ),
        v( 490 - 50, -1500 ),
        v( 490 - 50, -1460 ),
        v( 450 - 50, -1460 ),
        v( 450 - 50, -1500 )
      ] ) ) )
      .addWall( new Wall( smooth( [
        v( 450 - 50, -1140 ),
        v( 490 - 50, -1140 ),
        v( 490 - 50, -1100 ),
        v( 450 - 50, -1100 ),
        v( 450 - 50, -1140 )
      ] ) ) )
      .addWall( new Wall( smooth( [
        v( 610 + 50, -1500 ),
        v( 650 + 50, -1500 ),
        v( 650 + 50, -1460 ),
        v( 610 + 50, -1460 ),
        v( 610 + 50, -1500 )
      ] ) ) )
      .addWall( new Wall( smooth( [
        v( 610 + 50, -1140 ),
        v( 650 + 50, -1140 ),
        v( 650 + 50, -1100 ),
        v( 610 + 50, -1100 ),
        v( 610 + 50, -1140 )
      ] ) ) )

      // .addWallShape( Shape.roundRect( 500, -1500, 100, 400 ), false )
      .addObstacle( new Slicer( v( 100, -800 ), v( -100, -800 ), 2 ) )
      .addObstacle( new Slicer( v( 100, -950 ), v( -100, -950 ), 2 ) )
      .addObstacle( new Slicer( v( 100, -1100 ), v( -100, -1100 ), 2 ) )
      .addCupcake( new Cupcake( -200, -1300 ) )

      .addCupcake( new Cupcake( 410 - 50, -1480 ) )
      .addCupcake( new Cupcake( 690 + 50, -1480 ) )
      .addCupcake( new Cupcake( 370 - 50, -1300 ) )
      .addCupcake( new Cupcake( 730 + 50, -1300 ) )
      .addCupcake( new Cupcake( 410 - 50, -1120 ) )
      .addCupcake( new Cupcake( 690 + 50, -1120 ) )

      .addBlueButton( Shape.circle( 470, -1300, 30 ) )
      .addYellowButton( Shape.circle( 630, -1300, 30 ) ),

    level3,
    level4,
    level5
  ];

  // Defines level.nextLevel, level.previousLevel
  for ( var i = 1; i < Level.levels.length; i++ ) {
    Level.levels[ i ].previousLevel = Level.levels[ i - 1 ];
    Level.levels[ i - 1 ].nextLevel = Level.levels[ i ];
  }

  // Defines level.number
  for ( var k = 0; k < Level.levels.length; k++ ) {
    Level.levels[ k ].number = k + 1;
  }

  return Level;
} );