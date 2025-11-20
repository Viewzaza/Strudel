// INTERACTIVE ACID TECHNO / HARDCORE
//
// INSTRUCTIONS:
// 1. Go to https://strudel.cc/
// 2. Paste this script.
// 3. Run with Ctrl+Enter.
// 4. PLAY WITH THE SLIDERS! (Cutoff & Rez are essential)
// 5. Enable 'Scope' for visual feedback.

samples('github:yaxu/clean-breaks'); // Ensure samples are loaded

// --- CONTROLS ---
const cutoffCtrl = slider(1000, 100, 8000, 100); // The "Acid Knob"
const rezCtrl = slider(10, 0, 40, 1);            // The "Squeal"
const distCtrl = slider(0.4, 0, 1, 0.1);         // Hardcore Distortion
const speedCtrl = slider(145, 120, 200, 5);      // BPM Control

setcps(speedCtrl.div(60).div(4)); // Interactive BPM

// --- INSTRUMENTS ---

// 1. The Acid Line (303 Emulator)
// Uses a sawtooth wave with interactive filter
const acid = note("0 0 7 0 12 12 0 0 3 0 0 7 0 0 12 0")
  .scale("F:phrygian")
  .s("sawtooth")
  .lpf(cutoffCtrl)      // Controlled by slider
  .resonance(rezCtrl)   // Controlled by slider
  .decay(0.2)
  .sustain(0)
  .cut(1)               // Monophonic
  .gain(0.9)
  .pan(sine.range(0.4, 0.6).slow(2)); // Subtle movement

// 2. Rumble Kick (Techno Style)
// Main kick + Reverb Rumble
const kick = stack(
  // The Punch
  s("bd!4")
    .shape(distCtrl) // Distortion slider
    .gain(1.2),

  // The Rumble (Reverb Bass)
  s("bd!4")
    .lpf(300)
    .shape(0.8)
    .room(0.9)
    .size(0.9)
    .delay(0.125) // 1/8th delay for rolling bass
    .gain(distCtrl.mul(1.5)) // Rumble increases with distortion
);

// 3. Industrial Percussion
// Metallic FM sounds
const industrial = note("0 [0 12] . [0 7]")
  .s("clavisynth")
  .freq(200) // Fixed frequency for percussive effect
  .dec(0.1)
  .shape(0.8)
  .hpf(1000) // Thin and metallic
  .pan(rand.range(0, 1))
  .gain(0.7)
  .mask("<0 1 0 1>"); // Polyrhythmic masking

// 4. Sharp Hats
const hats = stack(
  s("~ oh").gain(1.1),        // Open hat
  s("hh*16").gain(distCtrl)   // Closed hat roll, louder with distortion
);

// 5. Dark Pad (Atmosphere)
const pad = note("0 4")
  .scale("F:phrygian")
  .s("vibraphone_bowed")
  .slow(4)
  .lpf(800)
  .room(0.9)
  .gain(0.5);

// --- MAIN STACK ---
stack(
  kick,
  acid,
  industrial,
  hats,
  pad
)
