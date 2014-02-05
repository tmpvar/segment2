
if (typeof require !== "undefined") {
  var Segment2 = require("../segment2.js");
  var Vec2 = require("vec2");
}

var ok = function(a, msg) { if (!a) throw new Error(msg || "not ok"); };

describe('segment2', function() {
  describe('#change', function() {
    it('should add a listener', function() {
      var s = Segment2();

      ok(s._listeners.length === 0);

      s.change(function() {});
      ok(s._listeners.length === 1);
    });

    it('should return the passed function', function() {
      var s = Segment2();
      var fn = function() {};
      ok(s.change(fn) === fn);
    });

    it('should call the listener when start/end changes', function(t) {
      var s = Segment2();
      s.change(function(seg, vec) {
        ok(seg === s);
        ok(vec === s.start);
        t();
      });
      s.start.add(Vec2(5, 5));
    });
  });

  describe('#ignore', function() {
    it('it should ignore the passed function', function() {

      var s = Segment2();
      var fn1 = s.change(function() {});
      var fn2 = s.change(function() {});

      ok(s._listeners.length === 2);
      s.ignore(fn1);
      ok(s._listeners.length === 1);
      ok(s._listeners[0] === fn2);
    });

    it('should ignore all if no function is passed', function() {
      var s = Segment2();
      var fn1 = s.change(function() {});
      var fn2 = s.change(function() {});

      s.ignore();
      ok(s._listeners.length === 0);
    });
  });

  describe('#notify', function() {
    it('should call all of the listeners in the order of addition', function() {
      var s = Segment2();
      var calls = '';
      var fn1 = s.change(function() { calls += '1'; });
      var fn2 = s.change(function() { calls += '2'; });

      s.notify();
      ok(calls === '12');
    });

    it('should call the callback with itself as the first arg', function(t) {
      var s = Segment2();
      s.change(function(seg) {
        ok(seg === s);
        t();
      });
      s.notify();
    });
  });

  describe('#length', function() {
    it('it should compute the length of line segment', function() {
      var s = new Segment2(new Vec2(0, 0), new Vec2(10, 0));
      ok(s.length() === 10);
    });
  });

  describe('#lengthSquared', function() {
    it('it should compute the length of line segment', function() {
      var s = new Segment2(new Vec2(0, 0), new Vec2(10, 0));
      ok(s.lengthSquared() === 100);
    });
  });

  describe('#closestPointTo', function() {
    it('should return a vec2 that is the closest point on this line to the passed vec', function() {
      var s = Segment2(Vec2(0, 0), Vec2(10, 0));
      ok(s.closestPointTo(Vec2(5, 10)).equal(Vec2(5, 0)))
    });

    it('should not throw nan when both start/end are the same', function() {
      var s = Segment2(Vec2(5, 5), Vec2(5, 5));
      ok(s.closestPointTo(Vec2(5, 10)).equal(Vec2(5, 5)))
    });
  });

  describe('#midpoint', function() {
    it('should return a vec2 equidistant to start and end', function() {
      var s = Segment2(Vec2(0, 0), Vec2(10, 0));
      ok(s.midpoint().equal(Vec2(5, 0)));

      var s2 = Segment2(Vec2(-10, 0), Vec2(10, 0));
      ok(s2.midpoint().equal(Vec2(0, 0)));
    });
  });

  describe('#slope', function() {
    it('should returnt the slope of the segment 1/1', function() {
      var s = Segment2(Vec2(0, 0), Vec2(10, 10));
      ok(s.slope() === 1);
    });

    it('should return the slope of the segment 2/1', function() {
      var s = Segment2(Vec2(0, 0), Vec2(10, 20));
      ok(s.slope() === 2);
    });

    it('should return the slope of the segment 1/2', function() {
      var s = Segment2(Vec2(0, 0), Vec2(20, 10));
      ok(s.slope() === .5);
    });

    it('should handle horizontal lines', function() {
      var s = Segment2(Vec2(0, 0), Vec2(10, 0));
      ok(s.slope() === 0);
    });

    it('should handle vertical lines', function() {
      var s = Segment2(Vec2(0, 0), Vec2(0, 10));
      ok(s.slope() === Infinity);
    });
  });

  describe('#intersect', function() {
    it('should return true if colinear', function() {
      var s = Segment2(Vec2(0,0), Vec2(10, 0));
      var s2 = Segment2(Vec2(5,0), Vec2(10, 0));
      ok(s.intersect(s2) === true);
    });

    it('should return a vec2 at intersection', function() {
      var s = Segment2(Vec2(0,0), Vec2(10, 0));
      var s2 = Segment2(Vec2(5,10), Vec2(5, -10));
      ok(s.intersect(s2).equal(Vec2(5, 0)));
    });

    it('should return falsy if no intersection', function() {
      var s = Segment2(Vec2(0,0), Vec2(10, 0));
      var s2 = Segment2(Vec2(5,10), Vec2(5, 1));
      ok(!s.intersect(s2));
    });

    it('should return falsy if invalid seg is passed', function() {
      var s = Segment2(Vec2(0,0), Vec2(10, 0));
      ok(!s.intersect(null));
      ok(!s.intersect({}));
      ok(!s.intersect({ start : {} }));
    });
  });

  describe('#rotate', function() {
    it('should choose the midpoint by default', function() {
      var s = Segment2(Vec2(0, 0), Vec2(10, 0));
      s.rotate(Math.PI/2);
      ok(s.start.equal(Vec2(5, -5)));
      ok(s.end.equal(Vec2(5, 5)));
    });

    it('should choose the midpoint by default (null) (returnNew)', function() {
      var s = Segment2(Vec2(0, 0), Vec2(10, 0));
      var s2 = s.rotate(Math.PI/2, null, true);
      ok(s2.start.equal(Vec2(5, -5)));
      ok(s2.end.equal(Vec2(5, 5)));
      ok(s2 !== s);
    });

    it('should choose the midpoint by default (returnNew)', function() {
      var s = Segment2(Vec2(0, 0), Vec2(10, 0));
      var s2 = s.rotate(Math.PI/2, true);
      ok(s2.start.equal(Vec2(5, -5)));
      ok(s2.end.equal(Vec2(5, 5)));
      ok(s2 !== s);
    });

    it('should rotate around origin if passed', function() {
      var s = Segment2(Vec2(0, 0), Vec2(10, 0));
      s.rotate(Math.PI, Vec2(5, 10));
      ok(s.start.equal(Vec2(10, 20)));
      ok(s.end.equal(Vec2(0, 20)));
    });

    it('should rotate around origin if passed (returnNew)', function() {
      var s = Segment2(Vec2(0, 0), Vec2(10, 0));
      var s2 = s.rotate(Math.PI, Vec2(5, 10), true);
      ok(s2.start.equal(Vec2(10, 20)));
      ok(s2.end.equal(Vec2(0, 20)));
      ok(s2 !== s);
    });
  });
});
