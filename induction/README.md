# INDUCTION

Watch a transformer grow the circuit that lets it copy.

A two-layer model is initialised, trained and drawn in the browser, live, on a
task it can only solve one way. Nothing is downloaded — no weights, no assets,
not even a font. Built on **gama3d**, **scena3d** and **anima3d**.

```
npm install
npm run dev          # watch it train
npm run build        # typecheck + bundle
npm run gradcheck    # are the hand-derived gradients right?
npm run laws         # are the three facts the architecture rests on true?
npm run circuit      # does the circuit this app claims to show actually form?
npm run verify       # drive the real app, and check the picture against the tensors
```

## What it shows

A transformer has three independent axes and a diagram on paper can only show
two, which is the whole reason this is in 3D:

| axis | quantity |
| --- | --- |
| across | token position |
| away from you | depth through the model |
| tilt | which head drew the arc |

The bars running the length of the board are the **residual stream**. Elhage et
al. (2021) describe it as a communication channel that every block reads from
and adds back into, and "two heads composing through a shared channel" is the
one idea in the architecture that is genuinely spatial.

## The task, and why it has to be this one

Each line is a short random pattern of letters, repeated until the line is full.
The pattern's **length changes every line**.

Until a letter has appeared once, nothing can predict what follows it. Those
positions sit at the loss of pure guessing forever, and the model never beats
them — that is the grey curve, pinned at ln(V). After a letter has appeared, the
answer is exact: whatever followed it last time. That is the teal curve, and it
falls off a cliff.

Finding that earlier occurrence means matching on **content**, and content
matching takes two layers — one head to record "the letter before me was X", and
a second to look for a place whose recorded letter matches the one I am holding
now. Elhage et al. show a one-layer attention-only model cannot express it.

**The pattern length has to vary.** The first version of this task used a fixed
period, so the answer always sat exactly seven positions back — reachable from
the positional encoding alone, with no content matching whatever. The model duly
learned "look 7 back", drove the repeat loss to 0.001, and the induction metric
read **0.85 for a head doing nothing of the kind**. The tell was that the head
was in layer 0, where the circuit being claimed is impossible.

## What the gates found

**The gradient check rejected ReLU** — correctly, and not because the derivative
was wrong. A central difference that straddles ReLU's kink compares a one-sided
slope to a two-sided secant, so its error falls off as *h* rather than *h²*. The
check measures convergence order rather than trusting a tolerance I picked, saw
order 1 where it wanted 2, and failed the build. The honest fix is not a looser
threshold but an activation that is actually differentiable, so the model uses
GELU — which is what every transformer since GPT-2 uses anyway. It got more
faithful and more verifiable in the same edit.

**The learning rate decided which algorithm the model implemented.** At 3e-3 it
learns the task and never forms the circuit: three seeds, eight thousand steps
each, repeat loss stuck between 0.03 and 0.13 and no head above 0.20 induction.
At 1e-2 the same model finds the clean two-head circuit and the repeat loss drops
another order of magnitude. That is not a tuning knob.

**The MLPs hide the circuit.** With them in, the model still learns — and no head
is interpretable: best induction 0.19 against a 0.12 chance baseline, with the
previous-token heads turning up in layer 1 where nothing can read them. The
mechanism is real and smeared where no attention picture can show it. Switch them
off and the circuit snaps into place. That is why attention-only is the default,
why Elhage et al. work in that setting, and why the app keeps the toggle: the
contrast is the lesson.

## The gates

Not one of these thresholds is a number chosen to make the build pass.

- **`gradcheck`** measures the **convergence order** of the discrepancy between
  each hand-derived gradient and a central difference. A correct derivative
  leaves pure truncation error, which quarters when *h* halves — order 2. A wrong
  one leaves a fixed error that *h* does not touch — order 0. Neither case needs
  me to know what the right residual is. It ends by corrupting every gradient by
  2% and showing the order collapse to 0.00.
- **`laws`** measures the three facts underneath the architecture. The
  √d<sub>k</sub> divisor is not asserted, it is **fitted**: sample dot products
  at seven widths, regress log(sd) on log(d_k), and check the exponent against
  the derivation in Vaswani et al. §3.2.1. It comes out at **0.5002**. Then what
  the divisor buys, in bits: unscaled attention over 16 keys collapses 1.35 →
  0.30 bits as d_k goes 16 → 256, while scaled attention holds at 3.4. Then
  softmax conservation, causal masking, and the positional table's relative-offset
  property — whose control (an all-sine table with no cosine partner) spreads
  47% where the real one spreads exactly 0.
- **`circuit`** trains the shipped model and **two controls that must fail**. A
  one-layer model must not solve it; if it does, the task has a shortcut and the
  two-layer story is unearned — which is exactly what happened the first time.
  An MLP model must learn it and stay unreadable. Induction is scored against
  what a *uniform* head would put on the same targets, measured from the same
  sequences, so "8.4× chance" means eight times attending to nothing in
  particular.
- **`verify`** drives the real app through its own buttons and keys, trains it
  to the circuit, and then **reads the colour buffer back out of the scene**,
  inverts the brightness mapping, and compares the recovered weights against the
  attention tensor. An arc diagram is convincing whatever numbers you feed it;
  this is the only check that can tell whether the picture is the model. Worst
  error, last run: 4×10⁻⁸.

That last check earned its place immediately. `window.inductionDebug()` was
calling `evaluate()` — twenty-four forward passes — *after* restoring the display
sequence, so the reported tensor came from an unrelated sequence while the arcs
came from the right one. The picture was correct and the gate called it a lie.
Nothing about the screenshot would have shown either the bug or the fix.

## What the gates could not find

Three defects survived every check above and were caught by looking at a
screenshot, which is the mirror image of the usual lesson here and worth
recording as such:

- The head-score bars were a two-column grid in which only the label and the
  number had been given an explicit `grid-column`, so the bar auto-placed into
  the 34-pixel label column. A head at 0.98 and a head at 0.00 drew the same
  three-pixel stub. Every number was right; the picture of it was not.
- The rows had no names, so the board was four identical rows of tiles with no
  way to tell layer 0 from layer 1 — the one thing the depth axis exists to
  show.
- Heads were coloured by head index, so layer 0 head 0 and layer 1 head 0 came
  out the same teal. Since arcs from both layers bow up into the same airspace,
  the previous-token head and a diffuse layer-1 head were indistinguishable.
  Colour is now per (layer, head).

A gate can check that a drawing matches a tensor. It cannot check that the
drawing is legible.

## Credits

Vaswani et al. (2017) for the architecture and the √d<sub>k</sub> derivation;
Elhage et al. (2021) for the residual stream and the two-layer argument; Olsson
et al. (2022) for induction heads.
