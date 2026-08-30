// Web Audio API ambient sound generator for the art salon experience

class ArtSoundscapePlayer {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private gainNode: GainNode | null = null;
  private intervalId: number | null = null;
  private noiseNode: AudioNode | null = null;
  public currentTrack: string = 'atelier'; // 'atelier' | 'rain' | 'vinyl' | 'chords'

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(0.12, this.ctx.currentTime);
      this.gainNode.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public play() {
    this.initContext();
    if (!this.ctx || !this.gainNode) return;
    this.isPlaying = true;
    this.startTrack();
  }

  public stop() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.noiseNode) {
      try {
        this.noiseNode.disconnect();
      } catch {}
      this.noiseNode = null;
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  public setTrack(track: string) {
    this.currentTrack = track;
    if (this.isPlaying) {
      this.stop();
      this.play();
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  private startTrack() {
    if (!this.ctx || !this.gainNode) return;

    if (this.currentTrack === 'rain' || this.currentTrack === 'atelier' || this.currentTrack === 'vinyl') {
      // Create pink/brown noise for rain / canvas brush sound
      const bufferSize = 2 * this.ctx.sampleRate;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.03;
        b6 = white * 0.115926;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Filter for warm soft atmosphere
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(this.currentTrack === 'rain' ? 800 : 450, this.ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(this.gainNode);
      whiteNoise.start(0);
      this.noiseNode = whiteNoise;
    }

    // Play periodic soothing musical harmonics (pentatonic gentle scale)
    const notes = [220, 261.63, 293.66, 329.63, 392.00, 440.00, 523.25]; // A minor / C major pentatonic
    const playHarmonic = () => {
      if (!this.ctx || !this.gainNode || !this.isPlaying) return;
      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();
      
      const randomNote = notes[Math.floor(Math.random() * notes.length)];
      osc.type = 'sine';
      osc.frequency.setValueAtTime(randomNote, this.ctx.currentTime);

      noteGain.gain.setValueAtTime(0, this.ctx.currentTime);
      noteGain.gain.linearRampToValueAtTime(0.04, this.ctx.currentTime + 1.2);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 4.5);

      osc.connect(noteGain);
      noteGain.connect(this.gainNode);

      osc.start();
      osc.stop(this.ctx.currentTime + 4.6);
    };

    playHarmonic();
    this.intervalId = window.setInterval(playHarmonic, 3500);
  }
}

export const soundscape = new ArtSoundscapePlayer();
