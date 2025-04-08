import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import './musicPlayer.scss';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [currentSong, setCurrentSong] = useState(0);
  const audioRef = useRef(null);

  const playlist = [
    {
      title: "Energy",
      artist: "Bensound",
      album: "Royalty Free",
      cover: "https://www.bensound.com/bensound-img/energy.jpg",
      url: "https://www.bensound.com/bensound-music/bensound-energy.mp3"
    },
    {
      title: "Going Higher",
      artist: "Bensound",
      album: "Royalty Free",
      cover: "https://www.bensound.com/bensound-img/goinghigher.jpg",
      url: "https://www.bensound.com/bensound-music/bensound-goinghigher.mp3"
    },
    {
      title: "Ukulele",
      artist: "Bensound",
      album: "Royalty Free",
      cover: "https://www.bensound.com/bensound-img/ukulele.jpg",
      url: "https://www.bensound.com/bensound-music/bensound-ukulele.mp3"
    },
    {
      title: "Jazzy Frenchy",
      artist: "Bensound",
      album: "Royalty Free",
      cover: "https://www.bensound.com/bensound-img/jazzyfrenchy.jpg",
      url: "https://www.bensound.com/bensound-music/bensound-jazzyfrenchy.mp3"
    },
    {
      title: "Epic",
      artist: "Bensound",
      album: "Royalty Free",
      cover: "https://www.bensound.com/bensound-img/epic.jpg",
      url: "https://www.bensound.com/bensound-music/bensound-epic.mp3"
    },
    {
      title: "Creative Minds",
      artist: "Bensound",
      album: "Royalty Free",
      cover: "https://www.bensound.com/bensound-img/creativeminds.jpg",
      url: "https://www.bensound.com/bensound-music/bensound-creativeminds.mp3"
    },
    {
      title: "Little Idea",
      artist: "Bensound",
      album: "Royalty Free",
      cover: "https://www.bensound.com/bensound-img/littleidea.jpg",
      url: "https://www.bensound.com/bensound-music/bensound-littleidea.mp3"
    },
    {
      title: "Happy Rock",
      artist: "Bensound",
      album: "Royalty Free",
      cover: "https://www.bensound.com/bensound-img/happyrock.jpg",
      url: "https://www.bensound.com/bensound-music/bensound-happyrock.mp3"
    },
    {
      title: "Once Again",
      artist: "Bensound",
      album: "Royalty Free",
      cover: "https://www.bensound.com/bensound-img/onceagain.jpg",
      url: "https://www.bensound.com/bensound-music/bensound-onceagain.mp3"
    },
    {
      title: "Memories",
      artist: "Bensound",
      album: "Royalty Free",
      cover: "https://www.bensound.com/bensound-img/memories.jpg",
      url: "https://www.bensound.com/bensound-music/bensound-memories.mp3"
    }
  ];
  

  useEffect(() => {
    if (!audioRef.current) audioRef.current = new Audio();

    const audio = audioRef.current;
    audio.src = playlist[currentSong].url;
    audio.load();
    audio.volume = volume;

    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => nextSong();

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    if (isPlaying) {
      audio.play().catch((err) => {
        console.error("Playback error:", err);
        setIsPlaying(false);
      });
    }

    return () => {
      audio.pause();
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentSong]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    audio.addEventListener('timeupdate', updateTime);

    return () => audio.removeEventListener('timeupdate', updateTime);
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((e) => console.error("Autoplay prevented:", e));
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e) => {
    const value = parseFloat(e.target.value);
    setVolume(value);
    if (audioRef.current) {
      audioRef.current.volume = value;
      setIsMuted(value === 0);
    }
  };

  const handleProgressChange = (e) => {
    const value = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = value;
      setCurrentTime(value);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = String(Math.floor(time % 60)).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const prevSong = () => {
    setCurrentSong((prev) => (prev === 0 ? playlist.length - 1 : prev - 1));
    setIsPlaying(true);
  };

  const nextSong = () => {
    setCurrentSong((prev) => (prev === playlist.length - 1 ? 0 : prev + 1));
    setIsPlaying(true);
  };

  const song = playlist[currentSong];

  return (
    <div className="music-player">
      <div className="player-header">
        <h4 className="header-title">
          Experience the sound of <span className="header-span">MindShare!</span>
        </h4>
      </div>

      <div className="player-body">
        <div className="cover-container">
          {/* <div className={`disk ${isPlaying ? 'spinning' : ''}`}> */}
          <div className="disk">

            <div className="disk-inner">
              <img src={song.cover} alt={`${song.title} album cover`} />
            </div>
          </div>
        </div>

        <div className="track-info">
          <h4 className="track-title">{song.title}</h4>
          <p className="track-artist">{song.artist}</p>
        </div>

        <div className="progress-container">
          <span className="time">{formatTime(currentTime)}</span>
          <input type="range" className="progress-bar" min="0" max={duration || 0} value={currentTime} onChange={handleProgressChange} />
          <span className="time">{formatTime(duration)}</span>
        </div>

        <div className="controls-container">
          <button className="control-btn" onClick={prevSong}><SkipBack size={18} /></button>
          <button className={`play-btn ${isPlaying ? 'pulse' : ''}`} onClick={togglePlay}>
            {isPlaying ? <Pause size={22} /> : <Play size={22} />}
          </button>
          <button className="control-btn" onClick={nextSong}><SkipForward size={18} /></button>
        </div>

        <div className="volume-controls">
          <button className="volume-btn" onClick={toggleMute}>
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <input
            type="range"
            className="volume-slider"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
          />
        </div>
      </div>

      <div className="player-footer">
        <div className="wave">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="wave-bar" style={{ animation: isPlaying ? `waveAnimation 1.${i + 2}s ease-in-out infinite` : 'none' }}></span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;


// import React, { useState, useRef, useEffect } from 'react';
// import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
// import './musicPlayer.scss';

// const MusicPlayer = () => {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [duration, setDuration] = useState(0);
//   const [volume, setVolume] = useState(0.7);
//   const [isMuted, setIsMuted] = useState(false);
//   const [currentSong, setCurrentSong] = useState(0);
//   const audioRef = useRef(null);

//   const playlist = [
//     {
//       title: "Tum Hi Ho",
//       artist: "Arijit Singh",
//       album: "Aashiqui 2",
//       cover: "/api/placeholder/300/300",
//       // Replace with your actual hosted audio file
//       url: "https://www.bensound.com/bensound-music/bensound-buddy.mp3"
//       // In production, this would be something like: "https://your-server.com/music/tum-hi-ho.mp3"
//     },
//     {
//       title: "Chaiyya Chaiyya",
//       artist: "Sukhwinder Singh & Sapna Awasthi",
//       album: "Dil Se",
//       cover: "/api/placeholder/300/300",
//       // Replace with your actual hosted audio file
//       url: "https://actions.google.com/sounds/v1/alarms/beep_short.ogg"
//       // In production: "https://your-server.com/music/chaiyya-chaiyya.mp3"
//     },
//     {
//       title: "Jai Ho",
//       artist: "A.R. Rahman & Sukhwinder Singh",
//       album: "Slumdog Millionaire",
//       cover: "/api/placeholder/300/300",
//       // Replace with your actual hosted audio file
//       url: "https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg"
//       // In production: "https://your-server.com/music/jai-ho.mp3"
//     }
//   ];
//   useEffect(() => {
//     if (!audioRef.current) {
//       audioRef.current = new Audio();
//     }

//     const audio = audioRef.current;
//     audio.src = playlist[currentSong].url;
//     audio.load();

//     const handleLoadedMetadata = () => setDuration(audio.duration);
//     audio.addEventListener('loadedmetadata', handleLoadedMetadata);

//     if (isPlaying) {
//       audio.play().catch((error) => {
//         console.error("Playback error:", error);
//         setIsPlaying(false);
//       });
//     }

//     return () => {
//       audio.pause();
//       audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
//     };
//   }, [currentSong]);

//   useEffect(() => {
//     if (!audioRef.current) return;
//     const audio = audioRef.current;

//     const updateTime = () => setCurrentTime(audio.currentTime);
//     audio.addEventListener('timeupdate', updateTime);

//     return () => {
//       audio.removeEventListener('timeupdate', updateTime);
//     };
//   }, []);

//   const togglePlay = () => {
//     if (!audioRef.current) return;
//     const audio = audioRef.current;

//     if (isPlaying) {
//       audio.pause();
//     } else {
//       audio.play().catch((error) => {
//         console.error("Autoplay prevented:", error);
//         setIsPlaying(false);
//       });
//     }
//     setIsPlaying(!isPlaying);
//   };

//   const toggleMute = () => {
//     if (!audioRef.current) return;
//     audioRef.current.muted = !isMuted;
//     setIsMuted(!isMuted);
//   };

//   const handleVolumeChange = (e) => {
//     if (!audioRef.current) return;
//     const value = parseFloat(e.target.value);
//     setVolume(value);
//     audioRef.current.volume = value;
//     setIsMuted(value === 0);
//   };

//   const handleProgressChange = (e) => {
//     if (!audioRef.current) return;
//     const value = parseFloat(e.target.value);
//     audioRef.current.currentTime = value;
//     setCurrentTime(value);
//   };

//   const formatTime = (time) => {
//     if (isNaN(time)) return "0:00";
//     const minutes = Math.floor(time / 60);
//     const seconds = String(Math.floor(time % 60)).padStart(2, '0');
//     return `${minutes}:${seconds}`;
//   };

//   const prevSong = () => setCurrentSong(prev => (prev === 0 ? playlist.length - 1 : prev - 1));
//   const nextSong = () => setCurrentSong(prev => (prev === playlist.length - 1 ? 0 : prev + 1));
//   const song = playlist[currentSong];

//   return (
//     <div className="music-player">
//       <div className="player-header">
//         <h4 className="header-title">Experience the sound of <span className="header-span">MindShare!</span></h4>
//       </div>
//       <div className="player-body">
//         {/* <div className="cover-container">
//           <div className={`disk ${isPlaying ? 'spinning' : ''}`}>
//             <div className="disk-inner">
//               <img src={song.cover} alt={`${song.title} album cover`} />
//             </div>
//           </div>
//         </div> */}
//         <div className="track-info">
//           <h4 className="track-title">{song.title}</h4>
//           <p className="track-artist">{song.artist}</p>
//         </div>
//         <div className="progress-container">
//           <span className="time">{formatTime(currentTime)}</span>
//           <input type="range" className="progress-bar" min="0" max={duration || 0} value={currentTime} onChange={handleProgressChange} />
//           <span className="time">{formatTime(duration)}</span>
//         </div>
//         <div className="controls-container">
//           <button className="control-btn" onClick={prevSong}><SkipBack size={16} /></button>
//           <button className="play-btn" onClick={togglePlay}>{isPlaying ? <Pause size={20} /> : <Play size={20} />}</button>
//           <button className="control-btn" onClick={nextSong}><SkipForward size={16} /></button>
//         </div>
//         {/* <div className="volume-controls">
//           <button className="volume-btn" onClick={toggleMute}>{isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}</button>
//           <input type="range" className="volume-slider" min="0" max="1" step="0.01" value={isMuted ? 0 : volume} onChange={handleVolumeChange} />
//         </div> */}
//       </div>
//       {/* <div className="player-footer">
//         <div className="wave">
//           {[...Array(5)].map((_, i) => (<span key={i} className="wave-bar" style={{ animation: isPlaying ? `waveAnimation 1.${i+2}s ease-in-out infinite` : 'none' }}></span>))}
//         </div>
//       </div> */}
//     </div>
//   );
// };

// export default MusicPlayer;

