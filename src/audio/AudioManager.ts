import { Audio, AudioListener, PositionalAudio, type Camera, type Object3D } from 'three';

export interface PlayOptions {
  volume?: number;
  playbackRate?: number;
  loop?: boolean;
}

export interface PositionalPlayOptions extends PlayOptions {
  /** Distance at which the sound plays at full volume. Default 5. */
  refDistance?: number;
}

/**
 * Game audio in three calls: `playOneShot` for UI/impact sounds,
 * `playAt` for positional 3D audio attached to an object, and
 * `playMusic` for looping music with automatic cross-fade.
 *
 * ```ts
 * const audio = new AudioManager(game.camera);
 * const [hit, theme] = await Promise.all([
 *   assets.audio('sfx/hit.ogg'),
 *   assets.audio('music/theme.ogg'),
 * ]);
 * audio.playMusic(theme);
 * audio.playOneShot(hit, { volume: 0.8 });
 * ```
 *
 * Note: browsers require a user gesture before audio can start — call
 * these from (or after) an input handler.
 */
export class AudioManager {
  readonly listener = new AudioListener();
  private music: Audio | null = null;

  constructor(camera?: Camera) {
    if (camera) this.attach(camera);
  }

  /** Attach the listener to the (possibly new) camera. */
  attach(camera: Camera): void {
    camera.add(this.listener);
  }

  playOneShot(buffer: AudioBuffer, options: PlayOptions = {}): Audio {
    const sound = new Audio(this.listener);
    this.configure(sound, buffer, options);
    sound.play();
    return sound;
  }

  /** Play a sound positioned at (and following) an object in the scene. */
  playAt(object: Object3D, buffer: AudioBuffer, options: PositionalPlayOptions = {}): PositionalAudio {
    const sound = new PositionalAudio(this.listener);
    this.configure(sound, buffer, options);
    sound.setRefDistance(options.refDistance ?? 5);
    object.add(sound);
    sound.play();
    return sound;
  }

  /** Start looping music, cross-fading from any currently playing track. */
  playMusic(buffer: AudioBuffer, { volume = 0.6, fade = 1.5 }: { volume?: number; fade?: number } = {}): Audio {
    const context = this.listener.context;
    const now = context.currentTime;

    const previous = this.music;
    if (previous) {
      const gain = previous.gain.gain;
      gain.cancelScheduledValues(now);
      gain.setValueAtTime(gain.value, now);
      gain.linearRampToValueAtTime(0, now + fade);
      setTimeout(() => previous.stop(), fade * 1000 + 100);
    }

    const next = new Audio(this.listener);
    next.setBuffer(buffer);
    next.setLoop(true);
    next.setVolume(0);
    next.play();
    next.gain.gain.setValueAtTime(0, now);
    next.gain.gain.linearRampToValueAtTime(volume, now + fade);
    this.music = next;
    return next;
  }

  stopMusic(fade = 1): void {
    const music = this.music;
    if (!music) return;
    const now = this.listener.context.currentTime;
    const gain = music.gain.gain;
    gain.cancelScheduledValues(now);
    gain.setValueAtTime(gain.value, now);
    gain.linearRampToValueAtTime(0, now + fade);
    setTimeout(() => music.stop(), fade * 1000 + 100);
    this.music = null;
  }

  setMasterVolume(volume: number): void {
    this.listener.setMasterVolume(volume);
  }

  private configure(sound: Audio<AudioNode>, buffer: AudioBuffer, options: PlayOptions): void {
    sound.setBuffer(buffer);
    sound.setVolume(options.volume ?? 1);
    sound.setPlaybackRate(options.playbackRate ?? 1);
    sound.setLoop(options.loop ?? false);
  }
}
