// PWM Math engine: average voltage from duty, duty and frequency from times, and counter resolution. Exact integers (hundredths of a V, hundredths of a percent, whole µs), half-up on display only.
function _p(t, err, intDigits, places, lo, hi) {
  t = typeof t === "string" ? t.trim() : "";
  var m = new RegExp("^([0-9]{1," + intDigits + "})(?:\\.([0-9]{1," + places + "}))?$").exec(t);
  if (!m) throw new Error(err);
  var v = parseInt(m[1], 10) * Math.pow(10, places) + (m[2] ? parseInt(m[2].padEnd(places, "0"), 10) : 0);
  if (v < lo || v > hi) throw new Error(err);
  return v;
}
function _pi(t, err, lo, hi) {
  t = typeof t === "string" ? t.trim() : "";
  if (!/^[0-9]{1,7}$/.test(t)) throw new Error(err);
  var v = parseInt(t, 10);
  if (v < lo || v > hi) throw new Error(err);
  return v;
}
var _V = "the rail must be from 0.01 to 100 V with at most two decimal places";
var _D = "the duty must be from 0.01 to 100 percent with at most two decimal places";
var _T = "each time must be a whole number from 1 to 1000000 µs";
var _B = "the bits must be a whole number from 1 to 24";
function _hu(n, d) { return Math.floor((2 * n + d) / (2 * d)); }
function _dec(v, places) {
  if (v < 0) return "-" + _dec(-v, places);
  var base = Math.pow(10, places);
  var s = String(Math.floor(v / base)), f = String(v % base).padStart(places, "0").replace(/0+$/, "");
  return f ? s + "." + f : s;
}

function averageTruth(v, d) {
  var vv = _p(v, _V, 3, 2, 1, 10000), dd = _p(d, _D, 3, 2, 1, 10000);
  var avg = _hu(vv * dd, 10000);
  return "A " + _dec(vv, 2) + " V rail at " + _dec(dd, 2) + "% duty averages " + _dec(avg, 2) + " V.";
}
function dutyTruth(on, period) {
  var o = _pi(on, _T, 1, 1000000), p = _pi(period, _T, 1, 1000000);
  var duty = _hu(10000 * o, p), hz = _hu(100000000, p);
  return "A " + o + " µs on-time in a " + p + " µs period is " + _dec(duty, 2) + "% duty at " + _dec(hz, 2) + " Hz.";
}
function stepsTruth(bits, v) {
  var b = _pi(bits, _B, 1, 24), vv = _p(v, _V, 3, 2, 1, 10000);
  var steps = Math.pow(2, b);
  var pct = _hu(10000, steps), mv = _hu(1000 * vv, steps);
  return ([8,11,18].includes(b) ? "An " : "A ") + b + "-bit counter on a " + _dec(vv, 2) + " V rail gives " + steps + " steps of " + _dec(pct, 2) + "%, or " + _dec(mv, 2) + " mV each.";
}
