# Happy Birthday, Joy! ✨

A personalized, interactive birthday surprise for Joy, built with React and Vite. The celebration unfolds as an 11-page story: use **Next** and **Back** to move between the welcome, Joy's profile, K-pop playlist, K-drama universe, birthday wishes, scrapbook, quiz, and final surprise.

## Getting started

Requires Node.js 18 or newer.

```bash
npm install
npm run dev
```

Open the local address printed by Vite, usually <http://localhost:5173/>.

## Build for production

```bash
npm run build
npm run preview
```

Vite writes the production site to `dist/`.

## Personalize the surprise

- **Portrait:** Replace `image/IMG_8524.jpg` with Joy's portrait and update its import near the top of `src/App.jsx` if the filename changes. Page 2 also has a photo control for replacing the portrait in the current session.
- **Scrapbook photos:** On page 8, select a photo in any of the four Polaroid frames. JPG, PNG, WebP, HEIC/HEIF, and TIFF are supported; HEIC/HEIF and TIFF images are converted in the browser for display.
- **Music:** The K-pop page includes the supplied SoundCloud birthday track. It does not autoplay. Use the playlist controls to change the song link or add a local audio file.
- **Birthday letter:** Page 6 is signed by Cynthia. Edit the `Cynthia` text in `src/App.jsx` to change the fixed signature.
- **Messages:** Add birthday notes from the message wall. The starter messages and other birthday copy can be edited in `src/App.jsx`.

Photo uploads, added messages, checklist selections, and playlist changes are held in browser memory and are not saved after a page refresh. For a lasting version of the gift, add the photos and music to the project and configure the desired content in the source before building.

## Tech stack

- React 18
- Vite 6
- Lucide icons
- `heic2any` and `utif` for HEIC/HEIF and TIFF photo conversion
