// Copyright 2015

/**
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var cupcakeSnake = require( 'CUPCAKE_SNAKE/cupcakeSnake' );
  var Line = require( 'KITE/segments/Line' );
  var Vector2 = require( 'DOT/Vector2' );

  var scratchVector = new Vector2();

  function Slicer( left, right, speed ) {
    this.left = left; // Vector2
    this.right = right; // Vector2
    this.speed = speed;

    var halfLength = 10;

    this.center = this.left.average( this.right );
    this.magnitude = this.left.minus( this.right ).magnitude() / 2 - halfLength * 2; // don't go past left/right
    this.horizontal = this.left.minus( this.right ).normalized();
    this.vertical = this.horizontal.perpendicular();
    this.angle = this.left.minus( this.right ).angle();

    this.theta = 0;

    this.leftTip = this.center.plus( this.horizontal.timesScalar( -halfLength ) );
    this.rightTip = this.center.plus( this.horizontal.timesScalar( halfLength ) );
    this.top = this.center.plus( this.vertical.timesScalar( 3 ) );
    this.bottom = this.center.plus( this.vertical.timesScalar( -3 ) );

    this.segments = [
      new Line( this.leftTip, this.top ),
      new Line( this.top, this.rightTip ),
      new Line( this.rightTip, this.bottom ),
      new Line( this.bottom, this.leftTip )
    ];

    this.step( Math.random() * 1000 ); // randomly initialize angle
  }

  cupcakeSnake.register( 'Slicer', Slicer );

  return inherit( Object, Slicer, {
    message: 'Those things look sharp!',

    copy: function() {
      return new Slicer( this.left, this.right, this.speed );
    },

    step: function( dt ) {
      var h0 = Math.sin( this.theta ) * this.magnitude;
      this.theta += dt * this.speed;
      var h1 = Math.sin( this.theta ) * this.magnitude;

      var delta = scratchVector.setPolar( h1 - h0, this.angle );

      this.leftTip.add( delta );
      this.rightTip.add( delta );
      this.top.add( delta );
      this.bottom.add( delta );

      for ( var i = 0; i < this.segments.length; i++ ) {
        this.segments[ i ].invalidate();
      }
    },

    // screw MVT!
    draw: function( context ) {
      // TODO: better graphics?
      context.beginPath();
      context.moveTo( this.leftTip.x, this.leftTip.y );
      context.lineTo( this.top.x, this.top.y );
      context.lineTo( this.rightTip.x, this.rightTip.y );
      context.lineTo( this.bottom.x, this.bottom.y );
      context.lineTo( this.leftTip.x, this.leftTip.y );
      context.closePath();
      context.fillStyle = 'red';
      context.strokeStyle = 'black';
      context.lineWidth = 1;
      context.lineJoin = 'miter';
      context.fill();
      context.stroke();
    }
  } );
} );