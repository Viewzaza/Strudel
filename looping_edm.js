// INFINITE EPIC EDM LOOP
//
// INSTRUCTIONS:
// 1. Go to https://strudel.cc/
// 2. Paste this script.
// 3. Run with Ctrl+Enter.
// 4. Click the sliders to start the sound!

samples('github:yaxu/clean-breaks');
setcps(128/60/4);

// --- CONTROLS ---
const cutoff = slider(5000, 100, 15000, 100);
const build  = slider(0, 0, 1, 0.1);

// --- PATTERNS ---
const kick = s("bd!4").gain(1.5).lpf(2000);

const bass = note("0 . 0 . 0 . 0 .")
  .scale("C:minor")
  .s("sawtooth")
  .decay(0.2) // Short decay for punchy bass
  .lpf(cutoff)
  .resonance(10)
  .gain(1.2);

const chords = note("0 [2 4] 6 [4 2]")
  .scale("C:minor")
  .chord("minor")
  .s("sawtooth")
  .lpf(cutoff.mul(1.5))
  .sustain(0.5)
  .jux(x => x.rev().pan(0.2))
  .gain(0.8);

const lead = note("7 . 6 4 . 2 1 . 0 . -3 . 0 1 2")
  .scale("C:minor")
  .s("square")
  .lpf(cutoff.mul(2))
  .gain(0.8);

const drums = stack(
  s("hh*16").gain(0.8),
  s("~ oh").gain(1.0),
  s("~ cp").gain(1.2)
);

// --- ARRANGEMENT ---
// Use 'slowcat' to cycle through sections naturally
// Each section plays for 16 cycles (about 30 seconds)

slowcat([
  // Section 1: Intro (Bass + Chords)
  stack(bass, chords, s("hh*16").gain(0.5)),

  // Section 2: Build (Add Snare Roll)
  stack(
    bass,
    chords,
    drums,
    s("sd*16").hpf(1000).gain(build.mul(saw.range(0,1).slow(4))) // Riser
  ),

  // Section 3: Drop (Everything)
  stack(kick, bass, chords, lead, drums),

  // Section 4: Breakdown (Just Chords)
  chords.lpf(800)
])
