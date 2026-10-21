import json, random
from fractions import Fraction

def hu(num, den):
    return Fraction((2*num + den) - ((2*num + den) % (2*den)), 2*den)

def dec(v, places=2):
    if v < 0: return "-" + dec(-v, places)
    base = 10**places
    n = v.numerator // v.denominator
    s = str(n // base); f = str(n % base).zfill(places).rstrip("0")
    return s + "." + f if f else s

def s100(n):
    w, f = divmod(n, 100)
    return f"{w}.{f:02d}".rstrip("0").rstrip(".")

def average(v, d):
    avg = hu(v*d, 10000)
    return f"A {dec(Fraction(v))} V rail at {dec(Fraction(d))}% duty averages {dec(avg)} V."
def duty(o, p):
    dd = hu(10000*o, p); hz = hu(100000000, p)
    return f"A {o} µs on-time in a {p} µs period is {dec(dd)}% duty at {dec(hz)} Hz."
def steps(b, v):
    st = 2**b; pct = hu(10000, st); mv = hu(1000*v, st)
    art = "An" if b in (8,11,18) else "A"
    return f"{art} {b}-bit counter on a {dec(Fraction(v))} V rail gives {st} steps of {dec(pct)}%, or {dec(mv)} mV each."

random.seed(731)
cases = [
  dict(fn="average", args=["5","30"], expect=average(500,3000)),
  dict(fn="duty", args=["300","1000"], expect=duty(300,1000)),
  dict(fn="steps", args=["8","5"], expect=steps(8,500)),
]
for _ in range(30):
    v = random.randint(1,10000); d = random.randint(1,10000)
    cases.append(dict(fn="average", args=[s100(v),s100(d)], expect=average(v,d)))
    o = random.randint(1,1000000); p = random.randint(1,1000000)
    cases.append(dict(fn="duty", args=[str(o),str(p)], expect=duty(o,p)))
    b = random.randint(1,24); v2 = random.randint(1,10000)
    cases.append(dict(fn="steps", args=[str(b),s100(v2)], expect=steps(b,v2)))
errcases = [
  ("average", ["0","30"]), ("average", ["5","0"]), ("average", ["5","100.001"]), ("average", ["100.001","30"]),
  ("duty", ["0","1000"]), ("duty", ["300","0"]), ("duty", ["1.5","1000"]),
  ("steps", ["0","5"]), ("steps", ["25","5"]), ("steps", ["8","0"]), ("steps", ["1.5","5"]),
]
json.dump({"cases": cases, "errors": errcases}, open("expected.json","w"), ensure_ascii=False, indent=1)
open("expected.json","a").write("\n")
print("expected.json written:", len(cases), "cases")
