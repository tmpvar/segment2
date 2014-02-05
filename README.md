# segment2

2d line segment

## install

```npm install segment2```

or include it in the browser

## use

```javascript

var Segment2 = require('segment2');
var Vec2 = require('vec2');

var s = new Segment2(Vec2(0, 0), Vec2(10, 0));

console.log(s.midpoint().toString()); // (5, 0)

console.log(s.intersect(Segment2(Vec2(5, 10), Vec2(5, -10))).toString()) // (5, 0)

```

### properties

`.start` - the starting point of the line

`.end` - the ending point of the line

### methods

fn __change__([fn])

Add a listener to be called when the line changes. Returns `fn`

_callback signature_: `function(segment2, vec2) {}` where `segment2` is the segment that changed and `vec2` is the component that changed

__ignore__([fn])

Remove a listener, or all of them if `fn` is not passed

__clone__([segmentCtor [, vecCtor]])

Create a copy of this segment.

Pass `segmentCtor` if you have subclassed `Segment2`

Pass `vecCtor` if you have subclassed `Vec2`

__length__()

return the length of the line segment

__lengthSquared__()

return the length of this line segment (squared)

__closestPointTo__(vec2)

return the closest point on this segment to the passed vec2

__containsPoint__(vec2)

return true if `vec2` lies on the segment

__midpoint__()

return the vec2 equidistant from `segment2.start` and `segment.end`

__slope__()

return the computed slope of this line segment.

_note_: this function will return `Infinity` for vertical lines

__rotate__(rads[, origin [, returnNew]])

apply a rotation to the current start/end points around `origin`.  If `origin` is not passed the midpoint is used.  If `returnNew` is truthy, a new `Segment2` instance will be returnd instead of applying the result on `this`

_note_: calling it like `seg.rotate(Math.PI, true)` is also valid and will return a copy of `seg` rotated around `seg`'s midpoint.


### license

MIT (see: [license.txt](blob/master/license.txt))
