// 200-LINE EPIC EDM / BIG ROOM HOUSE ANTHEM
//
// INSTRUCTIONS:
// 1. Go to https://strudel.cc/
// 2. Paste this ENTIRE script (it's long!).
// 3. Run with Ctrl+Enter.
// 4. USE THE SLIDERS at the top to control the mix live.
// 5. ENJOY THE JOURNEY (Intro -> Build -> Drop -> Break -> Drop 2 -> Outro).

// --- GLOBAL SETTINGS ---
samples('github:yaxu/clean-breaks'); // Load standard samples
setcps(128/60/4); // 128 BPM Standard EDM Tempo

// --- MIXER CONTROLS (SLIDERS) ---
// Use these to tweak the track in real-time
const cutoffCtrl = slider(5000, 100, 15000, 100);  // Filter Cutoff
const resCtrl    = slider(10, 0, 50, 1);           // Filter Resonance
const verbCtrl   = slider(0.5, 0, 1, 0.05);        // Reverb Amount
const buildCtrl  = slider(0, 0, 1, 0.1);           // Riser Tension
const leadCtrl   = slider(0.8, 0, 1.2, 0.1);       // Lead Synth Volume

// --- HELPER FUNCTIONS ---
// Repeat a pattern n times
const rep = (pat, n) => Array(n).fill(pat);

// --- DRUM PATTERNS ---

// 1. The Kick Drum
// Heavy, compressed 4-on-the-floor kick
const kick = s("bd!4")
  .shape(0.9)
  .lpf(2000)
  .gain(1.5);

// Kick with High Pass for intros (simulates "DJ filter")
const kickIntro = kick
  .hpf(400)
  .gain(1.2);

// 2. Hi-Hats
// Closed hats running 16th notes with velocity groove
const hhClosed = s("hh*16")
  .gain(sine.range(0.6, 0.9).fast(4));

// Open hats on the offbeat (the "tss")
const hhOpen = s("~ oh")
  .decay(0.2)
  .gain(1.1);

// Ride cymbal for the chorus/drop energy
const ride = s("rd*4")
  .gain(0.7)
  .velocity(rand.range(0.6, 0.8).segment(4));

// 3. Snares & Claps
// Big gated clap on beats 2 and 4
const clap = s("~ cp")
  .shape(0.8)
  .room(verbCtrl) // Interactive Reverb
  .gain(1.2);

// Snare buildup roll (pitch rising)
const snareRoll = s("sd*8")
  .speed(saw.range(1, 2).segment(32)) // Rising pitch over time
  .hpf(500)
  .gain(buildCtrl); // Controlled by slider

// --- BASSLINES ---

// 4. Offbeat Bass (Donk)
// Classic bouncy house bass
const bassOffbeat = note("~ 0").scale("C:minor")
  .s("sawtooth")
  .decay(0.2)
  .sustain(0)
  .lpf(cutoffCtrl)
  .resonance(resCtrl)
  .gain(1.2);

// 5. Rolling Bass (Mid-range)
// Adds driving energy to the drop
const bassRoll = note("0 0 0 0").scale("C:minor")
  .s("square")
  .lpf(1500)
  .decay(0.1)
  .gain(0.9)
  .pan(sine.range(0.4, 0.6).fast(2));

// --- HARMONIC LAYERS ---

// 6. Pad (Atmosphere)
// Long sustaining chords for the breakdown
const pad = note("c3min [~ eb3maj] g3min [~ as3maj]")
  .s("vibraphone_bowed") // Smooth organic texture
  .lpf(800)
  .room(0.9)
  .size(0.9)
  .gain(0.6);

// 7. Pluck (Arpeggio)
// Melodic movement
const pluck = note("c4 d4 eb4 g4")
  .scale("C:minor")
  .arpeggiate()
  .fast(4)
  .s("sine")
  .decay(0.3)
  .lpf(cutoffCtrl)
  .delay(0.25)
  .gain(0.8);

// 8. Anthem Chords (Supersaws)
// Huge stacked saws for the main drop
const anthem = stack(
  note("c4min [~ eb4maj] g4min [~ as4maj]"),
  note("c3min [~ eb3maj] g3min [~ as3maj]"), // Lower octave
  note("c4min [~ eb4maj] g4min [~ as4maj]").transpose(0.15), // Detune
  note("c4min [~ eb4maj] g4min [~ as4maj]").transpose(-0.15) // Detune
)
  .s("sawtooth")
  .lpf(cutoffCtrl.mul(1.5)) // Open filter wider
  .resonance(10)
  .sustain(0.4)
  .release(1)
  .jux(x => x.rev().pan(0.2)) // Wide stereo image
  .gain(0.9);

// 9. Main Lead Melody
// Catchy, simple hook
const lead = note("c5 . . as5 g5 . eb5 d5 . c5 . g4 . c5 d5 eb5")
  .scale("C:minor")
  .s("square")
  .clip(1)
  .lpf(cutoffCtrl.mul(2))
  .delay(0.4)
  .decay(0.1)
  .sustain(0)
  .gain(leadCtrl);

// --- FX ---

// 10. White Noise Sweep
const sweep = s("wind") // Wind sample or filtered noise
  .lpf(saw.range(100, 10000).slow(8)) // Slow sweep up
  .gain(0.4);

// 11. Downlifter (Crash)
const crash = s("cr")
  .room(0.8)
  .gain(0.8)
  .decay(2);

// --- SECTIONS (The Arrangement) ---

// Section A: INTRO (Build atmosphere)
// Just kick, bass, and pads
const intro = stack(
  kickIntro,
  hhClosed,
  bassOffbeat,
  pad
);

// Section B: BREAKDOWN (Emotional)
// Remove drums, introduce melody
const breakdown = stack(
  pad,
  pluck,
  sweep
);

// Section C: BUILD UP (Rising tension)
// Snare rolls, rising filters
const buildup = stack(
  pad,
  pluck.fast(2), // Double time arp
  snareRoll,     // The riser
  sweep.gain(0.6)
);

// Section D: THE DROP (Maximum Energy)
// Full stack: Kick, Bass, Chords, Lead, Drums
const drop = stack(
  kick,
  bassOffbeat,
  bassRoll,
  hhOpen,
  clap,
  ride,
  anthem, // The Supersaws
  lead,   // The Melody
  crash.mask("<1 0 0 0>") // Crash on the 1
);

// Section E: BRIDGE (Minimal)
// Strip back to groove
const bridge = stack(
  kick,
  hhClosed,
  bassOffbeat,
  pluck
);

// Section F: OUTRO (Fade out)
// Just the beat and pads
const outro = stack(
  kickIntro,
  hhClosed,
  pad.lpf(400)
);

// --- SEQUENCER (Constructing the Track) ---
// This assembles the sections into a linear song.
// Total length: ~5 minutes depending on repetition.

cat([
  // 1. Intro (32 Bars)
  ...rep(intro, 16),

  // 2. First Breakdown (16 Bars)
  ...rep(breakdown, 16),

  // 3. Build Up (8 Bars)
  ...rep(buildup, 8),

  // 4. DROP 1 (32 Bars) - High Energy
  ...rep(drop, 32),

  // 5. Bridge (16 Bars) - Cooldown
  ...rep(bridge, 16),

  // 6. Second Build (8 Bars) - Faster
  ...rep(buildup.fast(2), 8),

  // 7. DROP 2 (32 Bars) - Maximum Energy
  ...rep(drop.jux(x => x.iter(4)), 32), // Add extra glitch variation

  // 8. Outro (16 Bars)
  ...rep(outro, 16)
])

// -------------------------------------------------------
// END OF SCRIPT
// -------------------------------------------------------
// "Music is the silence between the notes." - Debussy
// ...but in EDM, it's the silence before the DROP.
