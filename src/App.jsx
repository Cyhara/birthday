import { useEffect, useRef, useState } from 'react';
import joyPortrait from '../image/IMG_8524.jpg';
import {
  ArrowUpRight, Check, ChevronLeft, ChevronRight, CirclePlay, Gift, Heart,
  ImagePlus, Pause, Plus, Send, Sparkles, Volume2, X,
} from 'lucide-react';

// Edit the default copy below; Joy's photos, playlist, guest notes, and letter signature
// can also be personalized directly from their upload/edit controls on the page.
const birthdayMusicLink = 'https://soundcloud.com/wida-chan-709544075/korean-happy-birthday-mp3?utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing';
const traits = [
  { icon: '🧠', title: 'Brilliant', copy: 'Smart, thoughtful, curious, and always capable of amazing things.', tint: 'pink' },
  { icon: '💖', title: 'Beautiful', copy: 'Beautiful inside and out, with a heart that makes people feel special.', tint: 'blue' },
  { icon: '🌸', title: 'Joyful', copy: "Her name isn't Joy by accident — she brings light wherever she goes.", tint: 'lilac' },
  { icon: '🎀', title: 'One of one', copy: 'No duplicates. No replacements. Simply, wonderfully Joy.', tint: 'peach' },
];
const loveList = [
  ['Her brilliant mind', '🧠'], ['That beautiful smile', '😊'], ['Her kind heart', '💖'],
  ['Her sense of humor', '😂'], ['Her love for K-pop', '🎶'], ['Her K-drama obsession', '🎬'],
  ['Her confidence', '✨'], ['Her one-of-a-kind personality', '🌸'],
  ['The happiness she brings', '🌈'], ['Simply being JOY', '💕'],
];
const bucketItems = [
  'Attend a K-pop concert', 'Visit South Korea 🇰🇷', 'Take beautiful Seoul photos 📸',
  'Try authentic Korean food 🍜', 'Have a K-drama marathon', 'Learn some Korean 🇰🇷',
  'Meet a favorite K-pop artist', 'Take an unforgettable birthday trip ✈️',
  'Achieve a major career goal', 'Make memories that last forever',
];
const dramaCards = [
  ['01', 'The Smart Girl', 'She already knows how this plot ends. Probably.'],
  ['02', 'The Main Character', 'Every room gets a little brighter when she walks in.'],
  ['03', 'The Romance Arc', 'Standards high. OST even higher. 💕'],
  ['04', 'The Plot Twist', 'She somehow gets even more iconic.'],
  ['05', 'The Happy Ending', 'A life full of love, laughter, and everything she deserves.'],
];
const questions = [
  { q: 'What is Joy most likely to watch at midnight?', choices: ['The evening news', 'A K-drama', 'A nature documentary', 'The weather'], answer: 1 },
  { q: 'What would Joy choose?', choices: ['A boring meeting', 'A K-pop concert', 'Doing absolutely nothing', 'Going to bed early'], answer: 1 },
  { q: 'Joy is the main character in…', choices: ['Every room she enters', 'A spreadsheet', 'The background', 'A different universe'], answer: 0 },
  { q: 'A perfect Joy kind of evening includes…', choices: ['Great music & a favorite show', 'Folding laundry competitively', 'Staring at a wall', 'An 8 PM bedtime'], answer: 0 },
  { q: 'How many K-drama episodes is “just one” at 10 PM?', choices: ['One, obviously', 'Two, maximum', 'There is no known limit', 'Zero'], answer: 2 },
];
const initialMessages = [
  { name: 'Your favorite people', text: 'The world is a brighter place with you in it. Keep being your incredible self! 💖' },
  { name: 'The birthday committee', text: 'Wishing you a year full of plot twists that are actually good and an OST for every moment. 🎬' },
  { name: 'Someone who adores you', text: 'You deserve every beautiful thing coming your way. Happy birthday, Joy! ✨' },
];

function SectionHeading({ eyebrow, title, copy, light = false }) {
  return <div className={`section-heading ${light ? 'heading-light' : ''}`}>
    {eyebrow && <span className="eyebrow">{eyebrow}</span>}
    <h2>{title}</h2>
    {copy && <p>{copy}</p>}
  </div>;
}

function Confetti({ active }) {
  if (!active) return null;
  return <div className="confetti-layer" aria-hidden="true">{Array.from({ length: 60 }, (_, i) =>
    <i key={i} style={{ '--x': `${(i * 37) % 100}%`, '--delay': `${(i % 13) * 0.035}s`, '--rot': `${i * 41}deg`, '--hue': `${(i * 31) % 360}` }} />)}</div>;
}

async function photoPreviewUrl(file) {
  const extension = file.name.split('.').pop()?.toLowerCase();
  const isHeif = ['heic', 'heif'].includes(extension) || /image\/hei[cf]/i.test(file.type);
  const isTiff = ['tif', 'tiff'].includes(extension) || file.type === 'image/tiff';

  if (isHeif) {
    const { default: convertHeic } = await import('heic2any');
    const converted = await convertHeic({ blob: file, toType: 'image/jpeg', quality: 0.9 });
    return URL.createObjectURL(Array.isArray(converted) ? converted[0] : converted);
  }

  if (isTiff) {
    const UTIF = await import('utif');
    const buffer = await file.arrayBuffer();
    const [frame] = UTIF.decode(buffer);
    if (!frame) throw new Error('This TIFF file does not contain a readable image.');

    UTIF.decodeImage(buffer, frame);
    const canvas = document.createElement('canvas');
    canvas.width = frame.width;
    canvas.height = frame.height;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Your browser could not prepare this TIFF image.');
    context.putImageData(new ImageData(new Uint8ClampedArray(UTIF.toRGBA8(frame)), frame.width, frame.height), 0, 0);

    const jpeg = await new Promise((resolve, reject) => canvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error('Your browser could not convert this TIFF image.'));
    }, 'image/jpeg', 0.9));
    return URL.createObjectURL(jpeg);
  }

  return URL.createObjectURL(file);
}

function PhotoUpload({ image, onChange, label, className = '' }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const handleUpload = async event => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setUploading(true);
    setUploadError('');
    try {
      onChange(await photoPreviewUrl(file));
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'This photo could not be opened. Try a different image file.');
    } finally {
      setUploading(false);
    }
  };

  return <div className={`photo-upload ${className} ${uploading ? 'photo-uploading' : ''}`} onClick={() => !uploading && inputRef.current?.click()} role="button" tabIndex={0}
    onKeyDown={event => (event.key === 'Enter' || event.key === ' ') && !uploading && inputRef.current?.click()} aria-label={`Upload ${label}`} aria-busy={uploading}>
    {image ? <img src={image} alt={label} /> : <div className="photo-placeholder">
      <ImagePlus size={25} /><span>{uploading ? 'Preparing your photo…' : `Add ${label}`}</span><small>{uploading ? 'Just a moment' : 'Your photo goes here'}</small>
    </div>}
    {uploadError && <span className="photo-upload-error" role="alert">{uploadError}</span>}
    <input ref={inputRef} type="file" accept="image/*,.heic,.heif,.tif,.tiff" hidden onChange={handleUpload} />
  </div>;
}

export default function App() {
  const [opened, setOpened] = useState(false);
  const [page, setPage] = useState(0);
  const [confetti, setConfetti] = useState(false);
  const [modal, setModal] = useState('');
  const [giftOpening, setGiftOpening] = useState(false);
  // Replace this imported image to use a different portrait on page 2 of 11.
  const [portrait, setPortrait] = useState(joyPortrait);
  const [photos, setPhotos] = useState(['', '', '', '']);
  const [messages, setMessages] = useState(initialMessages);
  const [checked, setChecked] = useState({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answer, setAnswer] = useState(null);
  const [gameDone, setGameDone] = useState(false);
  const [songTitle, setSongTitle] = useState('Korean Happy Birthday');
  const [artist, setArtist] = useState('Wida Chan · SoundCloud');
  const [audioSrc, setAudioSrc] = useState('');
  const [audioUrl, setAudioUrl] = useState(birthdayMusicLink);
  const [externalMusicLink, setExternalMusicLink] = useState(birthdayMusicLink);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, [opened, modal, page]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (!audioSrc) {
      audioRef.current.pause();
      return;
    }
    audioRef.current.src = audioSrc;
    if (audioPlaying) audioRef.current.play().catch(() => setAudioPlaying(false));
    else audioRef.current.pause();
  }, [audioSrc, audioPlaying]);

  const celebrate = () => {
    setConfetti(true);
    window.setTimeout(() => setConfetti(false), 3600);
  };
  const openSurprise = () => {
    setOpened(true);
    celebrate();
    setPage(1);
  };
  const goToPage = nextPage => {
    setPage(Math.max(0, Math.min(10, nextPage)));
    if (nextPage > 0) setOpened(true);
  };
  const finishQuestion = choice => {
    if (answer !== null) return;
    setAnswer(choice);
    if (choice === questions[questionIndex].answer) setScore(value => value + 1);
  };
  const nextQuestion = () => {
    if (questionIndex === questions.length - 1) setGameDone(true);
    else {
      setQuestionIndex(value => value + 1);
      setAnswer(null);
    }
  };
  const saveMessage = event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const photo = form.get('photo');
    setMessages(current => [...current, {
      name: form.get('name').trim(),
      text: form.get('message').trim(),
      photo: photo instanceof File && photo.size ? URL.createObjectURL(photo) : '',
    }]);
    setModal('');
  };
  const toggleAudio = () => {
    if (audioSrc) setAudioPlaying(value => !value);
    else if (externalMusicLink) window.open(externalMusicLink, '_blank', 'noopener,noreferrer');
  };
  const openFinalGift = () => {
    setGiftOpening(true);
    celebrate();
    window.setTimeout(() => setModal('final'), 650);
  };
  const uploadAudio = event => {
    const file = event.target.files?.[0];
    if (file) {
      setSongTitle(file.name.replace(/\.[^.]+$/, ''));
      setAudioSrc(URL.createObjectURL(file));
      setAudioPlaying(true);
    }
  };
  const soundcloudEmbedUrl = externalMusicLink
    && externalMusicLink.includes('soundcloud.com/')
    ? `https://w.soundcloud.com/player/?${new URLSearchParams({
      url: externalMusicLink,
      color: '#d987a9',
      auto_play: 'false',
      hide_related: 'true',
      show_comments: 'false',
      show_user: 'true',
      show_reposts: 'false',
      visual: 'false',
    })}`
    : '';

  return <div className="site-shell">
    <Confetti active={confetti} />
    <nav className="top-nav">
      <button className="brand" onClick={() => goToPage(0)}><span className="brand-mark">J</span> a little joy<span className="brand-heart">♥</span></button>
      <div className="nav-links">
        <button onClick={() => goToPage(1)}>About Joy</button><button onClick={() => goToPage(2)}>Her K-pop era</button><button onClick={() => goToPage(5)}>A little letter</button>
      </div>
      <button className="nav-gift" onClick={() => goToPage(10)}><Gift size={16} /> For Joy</button>
    </nav>

    <header className={`hero ${page === 0 ? 'active-story-page' : ''}`} id="home">
      <div className="hero-wash wash-one" /><div className="hero-wash wash-two" />
      <span className="hero-star star-one">✦</span><span className="hero-star star-two">✧</span>
      <span className="hero-heart heart-one">♡</span><span className="hero-heart heart-two">♥</span>
      <div className="hero-content">
        <div className="hero-kicker"><span /> IT'S YOUR DAY <span /></div>
        <h1>Happy Birthday,<br /><em>Joy!</em><span className="title-heart">💖</span></h1>
        <p className="hero-subtitle">To a brilliant, beautiful soul who makes<br className="desktop-break" /> the world a little brighter.</p>
        <button className="button button-primary hero-button" onClick={openSurprise}>
          {opened ? 'Your surprise is open!' : 'Open Your Birthday Surprise'} <span>🎁</span><ArrowUpRight size={17} />
        </button>
        <div className="hero-footnote"><Sparkles size={15} /> A little something made just for you</div>
      </div>
      <div className="cake-scene" aria-label="A birthday cake with glowing candles">
        <span className="cake-sparkle cs-1">✧</span><span className="cake-sparkle cs-2">✦</span>
        <div className="candles"><i /><i /><i /></div>
        <div className="cake-top"><span className="cake-berry">♥</span><span className="cake-berry">✿</span><span className="cake-berry">♥</span></div>
        <div className="cake-layer cake-top-layer" /><div className="cake-layer cake-bottom-layer" />
        <div className="cake-plate" /><div className="cake-label">make a wish ✨</div>
      </div>
      <p className="hero-note">Today isn't just another day...<br />It's the day the world was blessed with <strong>YOU.</strong> ✨</p>
      <div className="hero-step-note">A LITTLE BIRTHDAY STORY, MADE JUST FOR YOU <span>✦</span></div>
    </header>

    <main className={`main-content ${opened ? 'main-open' : ''}`} data-page={page}>
      <section className={`meet-section section-pad story-page ${page === 1 ? 'active-story-page' : ''}`} id="meet-joy">
        <div className="section-grid">
          <div className="portrait-wrap reveal">
            <div className="portrait-frame"><PhotoUpload image={portrait} onChange={setPortrait} label="Joy's portrait" className="portrait-upload" /></div>
            <div className="portrait-sticker sticker-top">that girl ✨</div><div className="portrait-sticker sticker-bottom">♡ always iconic</div>
            <span className="portrait-doodle">✿</span>
          </div>
          <div className="meet-copy">
            <SectionHeading eyebrow="THE ONE & ONLY" title={<>Meet <em>Joy</em> ✨</>} copy="A little appreciation post for the person who makes every room feel a little more like home." />
            <div className="trait-grid">{traits.map((trait, index) =>
              <article className={`trait-card trait-${trait.tint} reveal`} key={trait.title} style={{ '--delay': `${index * 90}ms` }}>
                <span className="trait-icon">{trait.icon}</span><h3>{trait.title}</h3><p>{trait.copy}</p>
              </article>)}</div>
          </div>
        </div>
      </section>

      <section className={`kpop-section section-pad story-page ${page === 2 ? 'active-story-page' : ''}`} id="kpop">
        <div className="kpop-glow" />
        <SectionHeading eyebrow="LIGHTS, CAMERA, JOY" title={<>Joy's K-pop <em>era</em> 🎤</>} copy="Every K-pop playlist needs a main character... and obviously, that's Joy." light />
        <div className="music-stage reveal">
          <div className="music-visual">
            <div className={`vinyl ${audioPlaying ? 'vinyl-spin' : ''}`}><div className="vinyl-center"><span>JOY</span><Heart size={18} fill="currentColor" /></div></div>
            <span className="note note-a">♪</span><span className="note note-b">♫</span><span className="note note-c">♬</span>
            <div className="visual-caption">JOY'S SOUNDTRACK <span>EST. ALWAYS</span></div>
          </div>
          <div className="player-panel">
            <span className="now-playing"><span className={audioPlaying ? 'playing-dot active' : 'playing-dot'} /> NOW PLAYING</span>
            <h3>{songTitle}</h3><p className="artist-line">{artist}</p>
            <div className="track-line"><span /><i /></div>
            <div className="player-controls">
              {(audioSrc || (externalMusicLink && !soundcloudEmbedUrl)) && <button className="play-control" onClick={toggleAudio} aria-label={audioPlaying ? 'Pause music' : 'Play music'}>{audioPlaying ? <Pause size={19} fill="currentColor" /> : <CirclePlay size={21} />}</button>}
              <span>{audioSrc ? 'Your song is ready' : soundcloudEmbedUrl ? 'Listen in the SoundCloud player below' : externalMusicLink ? 'Open your playlist link' : 'Add your own audio below'}</span><Volume2 size={17} />
            </div>
            {!audioSrc && soundcloudEmbedUrl && <iframe
              className="soundcloud-player"
              title="Korean Happy Birthday on SoundCloud"
              src={soundcloudEmbedUrl}
              loading="lazy"
              allow="autoplay"
            />}
            <div className="playlist-config">
              <label className="file-button">＋ Add an audio file<input type="file" accept="audio/*" hidden onChange={uploadAudio} /></label>
              <button className="text-button" onClick={() => setModal('playlist')}>Add music link</button>
            </div>
          </div>
        </div>
        <div className="kpop-bottom"><span>🎧 YOUR PERSONAL BIRTHDAY SOUNDTRACK</span><button onClick={() => setModal('playlist')} className="playlist-button">Play Joy's Birthday Playlist <ArrowUpRight size={16} /></button></div>
      </section>

      <section className={`drama-section section-pad story-page ${page === 3 ? 'active-story-page' : ''}`}>
        <SectionHeading eyebrow="PREVIOUSLY ON: JOY" title={<>The Joy K-drama <em>universe</em> 🎬</>} copy="A critically acclaimed, extremely bingeable story starring—who else?—Joy." />
        <div className="genre-row">{['Romance 💕', 'Comedy 😂', 'Mystery 🔍', 'Emotional damage 😭', 'Just one more episode 😭😂'].map((genre, index) =>
          <span className={`genre-pill genre-${index}`} key={genre}>{genre}</span>)}</div>
        <div className="drama-poster reveal">
          <div className="poster-topline"><span>THE JOY ORIGINAL</span><span>★★★★★</span></div>
          <div className="poster-title">JOY'S<br /><em>STARTER</em><br />PACK</div>
          <p className="poster-tagline">A tale of brilliance, charm & excellent taste in TV.</p>
          <div className="poster-stamp">100%<br /><small>MAIN<br />CHARACTER</small></div>
          <div className="poster-flower">✿</div>
        </div>
        <div className="drama-cards">{dramaCards.map(([num, title, text], index) =>
          <article className="drama-card reveal" key={num} style={{ '--delay': `${index * 80}ms` }}>
            <span>{num}</span><h3>{title}</h3><p>{text}</p><i>✧</i>
          </article>)}</div>
        <div className="binge-note reveal"><div className="binge-clock">10<span>PM</span></div><div><b>Joy watching one episode at 10 PM:</b><p>10:00 — just one · 11:00 — one more · 1:00 — now it's getting good · 3:00 — <em>I regret nothing.</em> 😂</p></div></div>
      </section>

      <section className={`love-section section-pad story-page ${page === 4 ? 'active-story-page' : ''}`}>
        <SectionHeading eyebrow="A VERY IMPORTANT LIST" title={<>10 reasons we love <em>Joy</em> 💌</>} copy="We could go on forever, but here are ten of our favorites." />
        <div className="love-list">{loveList.map(([text, emoji], index) =>
          <div className="love-row reveal" key={text} style={{ '--delay': `${index * 55}ms` }}>
            <span className="love-number">{String(index + 1).padStart(2, '0')}</span><span className="love-text">{text}</span><span className="love-emoji">{emoji}</span><span className="love-sparkle">✦</span>
          </div>)}</div>
        <div className="love-aside">the list is not ranked.<br /><em>you're perfect in every order.</em> ♡</div>
      </section>

      <section className={`letter-section section-pad story-page ${page === 5 ? 'active-story-page' : ''}`} id="letter">
        <SectionHeading eyebrow="OPEN WHEN YOU NEED A LITTLE LOVE" title={<>A little birthday letter <em>for Joy</em> 💌</>} />
        <article className="letter-card reveal">
          <span className="letter-heart">♡</span><div className="letter-top">A NOTE FOR YOU <span>✦</span></div>
          <div className="letter-body"><p className="letter-dear">Dear Joy,</p>
            <p>Today we celebrate more than just your birthday. We celebrate the amazing person you are.</p>
            <p>You are brilliant, beautiful, kind, and wonderfully unique. May this new chapter of your life bring you unforgettable memories, genuine happiness, beautiful friendships, exciting opportunities, and everything your heart has been hoping for.</p>
            <p>May your life be filled with moments that feel like the perfect K-drama ending, songs that make you want to dance, and reasons to smile every single day.</p>
            <p>Never forget how special you are.</p>
            <p className="letter-happy">Happy Birthday, Joy! 💖</p>
            <p>Keep shining. Keep dreaming. Keep being you.</p>
            <p className="letter-sign">With lots of love,<br /><span className="letter-signature">Cynthia</span></p>
          </div><span className="letter-seal">J</span>
        </article>
      </section>

      <section className={`bucket-section section-pad story-page ${page === 6 ? 'active-story-page' : ''}`}>
        <div className="bucket-heading"><SectionHeading eyebrow="THE YEAR AHEAD" title={<>Joy's <em>dream list</em> ✈️</>} copy="A few adventures for your next trip around the sun." /><span className="bucket-stamp">TO DO:<br /><b>BE ICONIC</b></span></div>
        <div className="bucket-grid">{bucketItems.map((item, index) =>
          <label className={`bucket-item ${checked[index] ? 'bucket-done' : ''}`} key={item}>
            <input type="checkbox" checked={Boolean(checked[index])} onChange={() => setChecked(current => ({ ...current, [index]: !current[index] }))} />
            <span className="fake-check">{checked[index] && <Check size={13} />}</span><span>{item}</span>
          </label>)}</div>
        <p className="bucket-foot">Big dreams look good on you. ♡</p>
      </section>

      <section className={`memory-section section-pad story-page ${page === 7 ? 'active-story-page' : ''}`}>
        <SectionHeading eyebrow="LITTLE MOMENTS, BIG LOVE" title={<>The Joy <em>archives</em> 📸</>} copy="Four blank pages in your very own scrapbook. Tap any frame to add a favorite photo." />
        <div className="polaroid-grid">{['Main character energy ✨', 'Beautiful memories 💕', 'Another iconic Joy moment 📸', 'Too beautiful for one photo 😌'].map((caption, index) =>
          <div className={`polaroid polaroid-${index + 1} reveal`} key={caption} style={{ '--delay': `${index * 95}ms` }}>
            <div className="tape" /><PhotoUpload image={photos[index]} onChange={url => setPhotos(current => current.map((photo, i) => i === index ? url : photo))} label={`memory ${index + 1}`} />
            <div className="polaroid-caption">{caption}</div><span className="polaroid-heart">♥</span>
          </div>)}</div>
        <p className="memory-tip"><ImagePlus size={15} /> JPG, PNG, WebP, HEIC/HEIF and TIFF photos are welcome.</p>
      </section>

      <section className={`message-section section-pad story-page ${page === 8 ? 'active-story-page' : ''}`}>
        <div className="message-head"><SectionHeading eyebrow="A WHOLE LOT OF LOVE" title={<>The birthday <em>love notes</em> 💌</>} copy="A little wall of love, for the girl who gives so much of it." />
          <button className="add-note-button" onClick={() => setModal('message')}><Plus size={18} /> Leave Joy a note</button></div>
        <div className="notes-grid">{messages.map((message, index) =>
          <article className={`note-card note-${index % 4} reveal`} key={`${message.name}-${index}`}>
            <span className="note-pin">✦</span>{message.photo && <img className="note-photo" src={message.photo} alt={`From ${message.name}`} />}
            <p>“{message.text}”</p><div className="note-author">— {message.name} <span>♡</span></div>
          </article>)}</div>
      </section>

      <section className={`game-section section-pad story-page ${page === 9 ? 'active-story-page' : ''}`}>
        <div className="game-glow" />
        <SectionHeading eyebrow="A VERY SERIOUS TEST" title={<>How well do you know <em>Joy?</em> 👀</>} copy="Five questions. One very iconic person. Let's see what you know." light />
        <div className="quiz-card reveal">
          {!gameDone ? <>
            <div className="quiz-progress"><span>QUESTION {String(questionIndex + 1).padStart(2, '0')} / 0{questions.length}</span><div>{questions.map((_, index) => <i key={index} className={index <= questionIndex ? 'progress-active' : ''} />)}</div></div>
            <h3>{questions[questionIndex].q}</h3>
            <div className="quiz-choices">{questions[questionIndex].choices.map((choice, index) =>
              <button key={choice} className={`quiz-choice ${answer === index ? (index === questions[questionIndex].answer ? 'choice-correct' : 'choice-wrong') : ''} ${answer !== null && index === questions[questionIndex].answer ? 'choice-reveal' : ''}`}
                onClick={() => finishQuestion(index)}><span>{String.fromCharCode(65 + index)}</span>{choice}{answer !== null && index === questions[questionIndex].answer && <Check size={17} />}</button>)}</div>
            {answer !== null && <div className="quiz-feedback"><span>{answer === questions[questionIndex].answer ? 'You know her so well! ✨' : 'The correct answer is Joy-coded. 💖'}</span><button onClick={nextQuestion}>{questionIndex === questions.length - 1 ? 'See results' : 'Next question'} <ChevronRight size={16} /></button></div>}
          </> : <div className="quiz-result"><span>🏆</span><p>YOU SCORED {score} / {questions.length}</p><h3>Congratulations!<br />You officially understand Joy's vibe. 😂💖</h3><button onClick={() => { setQuestionIndex(0); setAnswer(null); setScore(0); setGameDone(false); }}>Play again <ArrowUpRight size={15} /></button></div>}
        </div>
      </section>

      <section className={`final-section section-pad story-page ${page === 10 ? 'active-story-page' : ''}`} id="last-surprise">
        <div className="final-deco final-left">✦<br />♡</div><div className="final-deco final-right">✧<br />✿</div>
        <SectionHeading eyebrow="THE GRAND FINALE" title={<>One last thing... <em>💖</em></>} copy="Because one birthday surprise simply wasn't enough." />
        <button className={`gift-box ${giftOpening ? 'gift-opening' : ''}`} onClick={openFinalGift} aria-label="Open the final birthday surprise">
          <span className="gift-bow">♡</span><span className="gift-lid"><i /></span><span className="gift-body"><i /></span><span className="gift-spark gift-spark-one">✦</span><span className="gift-spark gift-spark-two">✧</span>
        </button>
        <button className="button button-primary final-button" onClick={openFinalGift}>Open Your Final Surprise <Gift size={17} /></button>
      </section>
      <div className={`page-navigation ${page > 0 ? 'page-navigation-visible' : ''}`}>
        <button className="page-back" onClick={() => goToPage(page - 1)}><ChevronLeft size={16} /> Back</button>
        <div className="page-progress" aria-label={`Page ${page + 1} of 11`}>
          <span>{String(page + 1).padStart(2, '0')}</span><i /><span>11</span>
        </div>
        <button className="page-next" onClick={() => goToPage(page + 1)}>Next <ChevronRight size={16} /></button>
      </div>
    </main>

    <footer className={`footer ${page === 10 ? 'footer-visible' : ''}`}><span className="footer-stars">✧　✦　✧</span><p>Made with <Heart size={14} fill="currentColor" /> for Joy</p><span>Because ordinary birthday wishes simply weren't enough.</span><span className="footer-sparkle">✦</span></footer>

    {modal && <div className="modal-backdrop" onMouseDown={event => event.target === event.currentTarget && setModal('')}>
      <div className={`modal-card ${modal === 'final' ? 'final-modal' : ''}`} role="dialog" aria-modal="true" aria-label={modal === 'message' ? 'Leave Joy a birthday message' : 'Birthday surprise'}>
        <button className="modal-close" onClick={() => setModal('')} aria-label="Close"><X size={19} /></button>
        {modal === 'playlist' && <><span className="modal-icon">🎧</span><span className="eyebrow">JOY'S BIRTHDAY MIX</span><h2>Make it <em>sound like Joy.</em></h2><p className="modal-copy">Add a song title, artist, and your own audio file or music link. SoundCloud tracks play right here; other links open separately.</p>
          <div className="playlist-form"><label>Song title<input value={songTitle} onChange={event => setSongTitle(event.target.value)} placeholder="Your favorite song" /></label>
            <label>Artist<input value={artist} onChange={event => setArtist(event.target.value)} placeholder="Favorite artist" /></label>
            <label>Music link<input value={audioUrl} onChange={event => setAudioUrl(event.target.value)} placeholder="SoundCloud track or direct audio URL" /></label>
            <div className="modal-actions"><label className="file-button">＋ Upload audio<input type="file" accept="audio/*" hidden onChange={uploadAudio} /></label><button className="button button-primary" onClick={() => { if (audioUrl.trim()) { setExternalMusicLink(audioUrl.trim()); setAudioSrc(''); setAudioPlaying(false); } setModal(''); }}>Save playlist <Check size={16} /></button></div>
          </div>
        </>}
        {modal === 'message' && <><span className="modal-icon">💌</span><span className="eyebrow">A NOTE FOR JOY</span><h2>Leave her a little <em>love.</em></h2><form className="message-form" onSubmit={saveMessage}><label>Your name<input name="name" required maxLength="40" placeholder="Who is this from?" /></label><label>Your birthday message<textarea name="message" required maxLength="240" rows="4" placeholder="Tell Joy what makes her special..." /></label><label>Add a photo (optional)<input name="photo" type="file" accept="image/*" /></label><button className="button button-primary" type="submit">Pin your note <Send size={16} /></button></form></>}
        {modal === 'final' && <><span className="final-modal-stars">✦　♡　✧</span><span className="eyebrow">A WISH, JUST FOR YOU</span><h2>JOY, may this year be your <em>best chapter yet.</em> ✨</h2><div className="final-message"><p>May you laugh more.<br />Dream bigger.<br />Travel farther.<br />Love deeply.<br />Create beautiful memories.<br />Watch ridiculously good K-dramas.<br />Discover amazing music.<br />And become everything you were meant to be.</p><h3>Happy Birthday, Beautiful! 🎂💖</h3><span>Your story is just getting started...</span></div><button className="button button-primary" onClick={() => setModal('')}>Keep shining, Joy <Heart size={16} fill="currentColor" /></button></>}
      </div>
    </div>}
    <audio ref={audioRef} onEnded={() => setAudioPlaying(false)} onError={() => setAudioPlaying(false)} />
  </div>;
}
