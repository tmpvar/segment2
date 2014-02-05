if (typeof require !== 'undefined') {
  var Vec2 = require('vec2');
  var segseg = require('segseg');
}


function Segment2(start, end) {
  if (!(this instanceof Segment2)) {
    return new Segment2(start, end);
  }

  this.start = start || new Vec2();
  this.end = end || new Vec2();

  this.start.change(this.notify.bind(this));
  this.end.change(this.notify.bind(this));

  this._listeners = [];
}

Segment2.prototype.change = function(fn) {
  this._listeners.push(fn);
  return fn;
};

Segment2.prototype.ignore = function(fn) {

  if (!fn) {
    this._listeners = [];
  } else {
    this._listeners = this._listeners.filter(function(a) {
      return a !== fn;
    });
  }

};

Segment2.prototype.notify = function(vec) {
  var fns = this._listeners, l = fns.length;
  for (var i=0; i<l; i++) {
    fns[i](this, vec);
  }
};

Segment2.prototype.clone = function(segmentCtor, vecCtor) {
  vecCtor = vecCtor || Vec2;
  segmentCtor = segmentCtor || Segment2;

  return new segmentCtor(
    new vecCtor(this.start.x, this.start.y),
    new vecCtor(this.end.x, this.end.y)
  );
};

Segment2.prototype.length = function() {
  return this.start.distance(this.end);
};

Segment2.prototype.lengthSquared = function() {
  return this.start.subtract(this.end).lengthSquared();
};

Segment2.prototype.closestPointTo = function(vec) {
  var a = this.start;
  var b = this.end;
  var ab = b.subtract(a, true);
  var veca = vec.subtract(a, true);
  var vecadot = veca.dot(ab);
  var abdot = ab.dot(ab);

  var t = Math.min(Math.max(vecadot/abdot, 0), 1);

  if (isNaN(t)) {
    t = 0;
  }

  var point = ab.multiply(t).add(a);
  var length = vec.subtract(point, true).lengthSquared();

  return point;
};

Segment2.prototype.containsPoint = function(vec) {

  var s = this.start, e = this.end;
  var dx = (s.x <= vec.x && e.x >= vec.x) || (s.x >= vec.x && e.x <= vec.x);
  var dy = (s.y <= vec.y && e.y >= vec.y) || (s.y >= vec.y && e.y <= vec.y);
  if (dx && dy) {
    var a =  ((e.x - s.x) * (vec.y - s.y)) - ((vec.x - s.x) * (e.y - s.y));
    return Vec2.clean(a) === 0;
  }

  return false;
};

Segment2.prototype.midpoint = function() {
  return this.start.subtract(this.end, true).divide(2).add(this.end);
};

Segment2.prototype.slope = function() {
  var dy = this.end.y - this.start.y;
  var dx = this.end.x - this.start.x;

  if (!dx) {
    return Infinity;
  }

  return Vec2.clean(dy/dx);
};

Segment2.prototype.rotate = function(rads, origin, returnNew) {

  if (origin === true) {
    returnNew = true;
    origin = null;
  }

  if (!origin) {
    origin = this.midpoint();
  }

  var start = this.start.subtract(origin, true).rotate(rads);
  var end = this.end.subtract(origin, true).rotate(rads);

  start.add(origin);
  end.add(origin);

  if (returnNew) {
    return new Segment2(start, end);
  } else {
    this.start.set(start.x, start.y);
    this.end.set(end.x, end.y);
    return this;
  }
};

Segment2.prototype.intersect = function(seg) {
  if (!seg || !seg.start || !seg.end) {
    return false;
  }

  var isect = segseg(this.start, this.end, seg.start, seg.end);
  if (!isect || isect === true) {
    return isect;
  } else {
    return Vec2.fromArray(isect);
  }
};

if (typeof module !== "undefined" && typeof module.exports == "object") {
  module.exports = Segment2;
}

if (typeof window !== "undefined") {
  window.Segment2 = window.Segment2 || Segment2;
}

