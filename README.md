# Gaze Lab

Experimental mobile lab for testing what useful, repeatable signals can be captured through the eyes with an ordinary phone.

## V0 — capture first

The first version deliberately does one thing only:

- requests camera permission;
- opens the iPhone camera;
- gives the user a one-eye alignment guide;
- captures a high-quality still image;
- previews it locally;
- sends nothing to a server.

There is **no diagnosis or health interpretation** in V0. The purpose is to validate camera quality, framing, working distance, and repeatability before adding measurement logic.

## Run it

Requirements:

- Node.js 22.13 or newer
- npm
- Expo Go on the iPhone

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go. No local Xcode build is required for this V0 because `expo-camera` is supported in Expo Go.

## Build path

1. **V0:** reliable one-eye capture and framing.
2. **V0.2:** crop the eye region and estimate pupil / iris geometry in pixels.
3. **V0.3:** repeat timed captures under a controlled visual task and test signal repeatability.
4. **V1:** move to live-frame processing if the still-image prototype produces a useful signal.
5. **TestFlight:** build in EAS cloud, then distribute to testers without needing a new Mac.

## Positioning

Working description:

> **Gaze Lab — cognitive signals through the eyes.**

For now, the product should be described as experimental measurement / wellness software, not as a diagnostic tool.

## Privacy principle

Prefer on-device processing. Eye images should not leave the device unless a future feature genuinely requires it and the user explicitly agrees.
