# UGC Video Assets

Place your vertical `.mp4` video files in this directory.

Recommended specs:
- Format: H.264 / MP4 (or WebM)
- Aspect Ratio: 9:16 (1080x1920 or 720x1280)
- Muted / AAC audio track
- Optimized for web streaming (`faststart` / moov atom at beginning)

File mapping (configured in `src/config.js`):
- `public/videos/intro_ugc.mp4` -> [Scene 00] Cinematic Intro Showreel (Elena Rostova / Creator Story)
- `public/videos/reel_1.mp4` -> Elena Rostova (Morning Pour-over)
- `public/videos/reel_2.mp4` -> Alex Morgan (Drafting Desk & Brass Dial)
- `public/videos/reel_3.mp4` -> Sophia Lindqvist (Terrace Golden Hour)
- `public/videos/reel_4.mp4` -> Sarah Jenkins (Travertine Unboxing)
- `public/videos/reel_5.mp4` -> Marcus Vance (Evening Ambient Glow)
- `public/videos/reel_6.mp4` -> Freja Holm (Scandinavian Shelf Styling)

When a video file is present, the carousel automatically switches from poster display to seamless, lazy-loaded HTML5 video playback.
