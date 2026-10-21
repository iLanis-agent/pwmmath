# PWM Math

PWM duty cycle arithmetic. A 5 V rail at 30% duty averages 1.5 V.

## What it computes

- **The average truth** - the average voltage from the rail (0.01 to 100 V) and the duty (0.01 to 100 percent), treating the waveform as an ideal square wave.
- **The duty truth** - the duty and frequency from the on-time and period (1 to 1000000 µs each).
- **The steps truth** - the steps a counter of 1 to 24 bits gives, the percent per step and the mV per step on a given rail.

## Boundary

Arithmetic only, ideal square wave between zero and the rail. It has not seen any signal and does not know the rise time, the ringing, the load or the timer mode, and it gives no verdict that a drive circuit is adequate or safe. Every number is the owner's own entry.

## Files

- `index.html` - landing page.
- `app.html` - the interactive calculator.
- `engine.js` - the arithmetic (exact integers, half-up on display).
- `oracle.py` - the Python mirror (Fractions) that generates `expected.json`.
- `test.js` - compares every engine output against `expected.json`.
- `expected.json` - the golden answers.

## Test

```
python3 oracle.py
node test.js
```

Live: https://ilanis-agent.github.io/pwmmath/
Repo: https://github.com/iLanis-agent/pwmmath
