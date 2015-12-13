define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Image = require( 'SCENERY/nodes/Image' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Path = require( 'SCENERY/nodes/Path' );
  var RadialGradient = require( 'SCENERY/util/RadialGradient' );
  var Color = require( 'SCENERY/util/Color' );
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );

  // images
  var snakeImage = require( 'image!CUPCAKE_SNAKE/snake.png' );
  var cupcakeImage = require( 'image!CUPCAKE_SNAKE/cupcake-large.png' );

  function HomeScreen( bounds, options ) {
    var startGameButton = new RectangularPushButton( {
      content: new Text( 'Start Game', {
        font: new PhetFont( { size: 40, weight: 'bold' } )
      } ),
      baseColor: '#a63137',
      centerX: bounds.centerX,
      bottom: bounds.maxY - 10
    } );

    var instructions = new Text( 'use arrow keys', { font: new PhetFont( { size: 28 } ) } );
    instructions.left = startGameButton.right + 80;
    instructions.centerY = startGameButton.centerY;

    var subtitle = new Text( 'Ludum Dare 34', { font: new PhetFont( { size: 28 } ) } );
    subtitle.right = startGameButton.left - 80;
    subtitle.centerY = startGameButton.centerY;

    var titleText = new Text( 'Cupcake Snake', {
      font: new PhetFont( { size: 105 } ),
      centerX: bounds.centerX,
      top: 10
    } );

    var cupcake = new Image( cupcakeImage, { scale: 0.8, left: bounds.minX + 200, bottom: startGameButton.top - 10 } );
    var circle = new Circle( 1000, {
      centerX: cupcake.centerX,
      centerY: cupcake.centerY + cupcake.height / 4,
      fill: new Color( 255, 250, 115, 1 )

      //new RadialGradient( 0, 0, 0, 0, 0, 1000 )
      //.addColorStop( 0, new Color( 204, 13, 15, 1.0 ) )
      //.addColorStop( 0.5,  )
    } );

    var children = [];
    for ( var angle = 0; angle < Math.PI * 2; angle += Math.PI * 2 / 20 ) {
      var startPoint = Vector2.createPolar( 1000, angle - Math.PI * 2 / 40 );
      var endPoint = Vector2.createPolar( 1000, angle + Math.PI * 2 / 40 );
      var triangle = new Path( new Shape()
        .moveTo( circle.centerX, circle.centerY )
        .lineToRelative( startPoint.x, startPoint.y )
        .lineToRelative( endPoint.x, endPoint.y )
        .close(), { fill: 'white' } );
      children.push( triangle );
    }

    var triangleFan = new Node( {
      children: children
    } );
    this.triangleFan = triangleFan;
    Node.call( this, {
      children: [
        circle,
        triangleFan,
        startGameButton,
        instructions,
        titleText,
        subtitle,
        new Image( snakeImage, { scale: 0.8, right: bounds.maxX - 50, bottom: startGameButton.top - 10 } ),

        cupcake
      ]
    } );
  }

  return inherit( Node, HomeScreen, {
    step: function( dt ) {
      this.triangleFan.rotateAround( this.triangleFan.center, Math.PI / 32 * dt );
    }
  } );
} );