// 200-LINE EPIC EDM / BIG ROOM HOUSE ANTHEM
//
// INSTRUCTIONS:
// 1. Go to https://strudel.cc/
// 2. Paste this ENTIRE script.
// 3. Run with Ctrl+Enter.
// 4. USE THE SLIDERS at the top to control the mix.
// 5. Troubleshooting: If no sound, refresh the page and try again.

// --- GLOBAL SETTINGS ---
// Load standard samples from the clean-breaks library
samples('github:yaxu/clean-breaks');
// Set BPM to 128 (Standard EDM Tempo)
// Formula: BPM / 60 / 4 (for 4/4 time signature)
setcps(128/60/4);

// --- MIXER CONTROLS (INTERACTIVE SLIDERS) ---
// Syntax: slider(default_value, min, max, step)
const lowPass   = slider(10000, 100, 20000, 100);  // Filter Cutoff Frequency
const resonance = slider(10, 0, 50, 1);            // Filter Resonance (Squelch)
const reverbAmt = slider(0.5, 0, 1, 0.05);         // Reverb Mix
const tension   = slider(0, 0, 1, 0.1);            // Build-up Intensity
const leadVol   = slider(0.8, 0, 1.2, 0.1);        // Lead Synth Volume

// --- HELPER FUNCTIONS ---
// Utility to repeat a pattern 'n' times for the arrangement
const repeat = (pattern, times) => Array(times).fill(pattern);

// --- DRUM PATTERNS ---

// 1. The "4-on-the-floor" Kick Drum
// A punchy kick playing on every beat.
const kickMain = s("bd!4")
  .shape(0.9)      // Add distortion/saturation
  .lpf(2000)       // Cut extreme highs
  .gain(1.5);      // Boost volume

// A filtered kick for the Intro section (simulates a DJ High Pass Filter)
const kickIntro = kickMain
  .hpf(400)        // Remove bass frequencies
  .gain(1.2);

// 2. Hi-Hats (The Groove)
// Closed hats playing 16th notes with dynamic velocity
const hatsClosed = s("hh*16")
  .gain(sine.range(0.6, 0.9).fast(4)); // LFO on gain for human feel

// Open hats on the offbeat (the "and" of the beat)
const hatsOpen = s("~ oh")
  .decay(0.2)      // Shorten the sample
  .gain(1.1);

// Ride cymbal for the Drop (adds high-end energy)
const rideCymbal = s("rd*4")
  .gain(0.7)
  .velocity(rand.range(0.6, 0.8).segment(4));

// 3. Snares and Claps
// A big, reverb-heavy clap on beats 2 and 4
const clapMain = s("~ cp")
  .shape(0.8)
  .room(reverbAmt) // Controlled by slider
  .gain(1.2);

// A rising snare roll for build-ups
// Pitch rises over 32 steps
const snareRiser = s("sd*8")
  .speed(saw.range(1, 2).segment(32))
  .hpf(500)
  .gain(tension);  // Volume controlled by slider

// --- BASSLINES ---

// 4. Offbeat Bass (The "Donk")
// Classic House bass playing on the offbeats
const bassOffbeat = note("~ 0").scale("C:minor")
  .s("sawtooth")
  .decay(0.2)
  .sustain(0)
  .lpf(lowPass)    // Controlled by slider
  .resonance(resonance)
  .gain(1.2);

// 5. Rolling Bass (The Drive)
// Continuous 16th notes for momentum during the Drop
const bassRolling = note("0 0 0 0").scale("C:minor")
  .s("square")
  .lpf(1500)
  .decay(0.1)
  .gain(0.9)
  .pan(sine.range(0.4, 0.6).fast(2));

// --- HARMONIC LAYERS ---

// 6. Atmospheric Pad
// Long, sustaining chords for breakdowns
// Using a Triangle wave synth for instant loading (no download needed)
// 0=C, 2=Eb, 4=G, 6=Bb
const padAtmosphere = note("0 [~ 2] 4 [~ 6]")
  .scale("C:minor")
  .chord("minor")
  .s("triangle") // Synth instead of sample
  .attack(0.5).decay(0.5).sustain(1).release(2) // Pad envelope
  .lpf(800)
  .room(0.9)
  .gain(0.6);

// 7. Plucky Arpeggio
// A melodic sequence to add movement
const melodyPluck = note("0 1 2 4") // C D Eb G
  .scale("C:minor")
  .fast(4)         // Play 4x speed
  .s("sine")
  .decay(0.3)
  .lpf(lowPass)    // Follows the filter slider
  .delay(0.25)
  .gain(0.8);

// 8. Anthem Supersaws (The Drop)
// Stacked sawtooth waves for a massive sound
// Pattern: Cmin, EbMaj, Gmin, BbMaj
const anthemPat = note("0 [~ 2] 4 [~ 6]").scale("C:minor").chord("minor");

const anthemChords = stack(
  anthemPat.transpose(12), // C4
  anthemPat,               // C3
  anthemPat.transpose(12.15), // Detune Up
  anthemPat.transpose(11.85)  // Detune Down
)
  .s("sawtooth")
  .lpf(lowPass.mul(1.5)) // Filter is more open here
  .resonance(10)
  .sustain(0.4)
  .release(1)
  .jux(x => x.rev().pan(0.2)) // Spread stereo image
  .gain(0.9);

// 9. Main Lead Synth
// The catchy melody hook
// Converted to scale degrees: 7=C(hi) 6=Bb 4=G 2=Eb 1=D 0=C -3=G(lo)
const mainLead = note("7 . . 6 4 . 2 1 . 0 . -3 . 0 1 2")
  .scale("C:minor")
  .s("square")
  .clip(1)         // Hard clipping
  .lpf(lowPass.mul(2))
  .delay(0.4)
  .decay(0.1)
  .sustain(0)
  .gain(leadVol);  // Controlled by slider

// --- FX (Sound Effects) ---

// 10. White Noise Sweep
// Rising filter sweep
const fxSweep = s("wind") // Uses a 'wind' sample
  .lpf(saw.range(100, 10000).slow(8))
  .gain(0.4);

// 11. Impact Crash
// Hits at the start of a section
const fxCrash = s("cr")
  .room(0.8)
  .gain(0.8)
  .decay(2);

// --- SECTIONS (Arrangement Blocks) ---

// Section A: INTRO (32 Bars)
// Simple groove to start mixing
const sectionIntro = stack(
  kickIntro,
  hatsClosed,
  bassOffbeat,
  padAtmosphere
);

// Section B: BREAKDOWN (16 Bars)
// Energy drops, melody enters
const sectionBreak = stack(
  padAtmosphere,
  melodyPluck,
  fxSweep
);

// Section C: BUILD UP (8 Bars)
// Rising tension before the drop
const sectionBuild = stack(
  padAtmosphere,
  melodyPluck.fast(2), // Double speed arp
  snareRiser,          // Rising snare pitch
  fxSweep.gain(0.6)
);

// Section D: THE DROP (32 Bars)
// Maximum energy
const sectionDrop = stack(
  kickMain,
  bassOffbeat,
  bassRolling,
  hatsOpen,
  clapMain,
  rideCymbal,
  anthemChords,
  mainLead,
  fxCrash.mask("<1 0 0 0>") // Crash only on the first beat
);

// Section E: BRIDGE (16 Bars)
// Stripped back version of the drop
const sectionBridge = stack(
  kickMain,
  hatsClosed,
  bassOffbeat,
  melodyPluck
);

// Section F: OUTRO (16 Bars)
// Fading out
const sectionOutro = stack(
  kickIntro,
  hatsClosed,
  padAtmosphere.lpf(400)
);

// --- SEQUENCER (The Timeline) ---
// Assemble the track linearly using 'cat'
// Note: '...repeat()' spreads the array of patterns into arguments

cat([
  // 1. Start with the Intro
  ...repeat(sectionIntro, 16),

  // 2. Breakdown - bring in the melody
  ...repeat(sectionBreak, 16),

  // 3. Build Up the tension!
  ...repeat(sectionBuild, 8),

  // 4. DROP 1 - The main event
  ...repeat(sectionDrop, 32),

  // 5. Bridge - catch your breath
  ...repeat(sectionBridge, 16),

  // 6. Second Build - Faster energy
  ...repeat(sectionBuild.fast(2), 8),

  // 7. DROP 2 - Final climax with glitch variation
  ...repeat(sectionDrop.jux(x => x.iter(4)), 32),

  // 8. Outro - fade to silence
  ...repeat(sectionOutro, 16)
])

// -------------------------------------------------------
// SCRIPT COMPLETE
// -------------------------------------------------------
// Created for the Strudel Live Coding Environment
