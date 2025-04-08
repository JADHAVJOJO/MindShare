import React, { useState, useEffect } from 'react';
import "./gaming.scss";
import { Link } from 'react-router-dom';

const GameCard = ({ game }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="game-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="game-image-container">
        <div className={`image-overlay ${isHovered ? 'hovered' : ''}`}></div>
        <img 
          src={game.imageUrl}
          alt={game.title}
          className="game-image" 
        />
           
        {game.isNew && (
          <div className="new-tag">
            NEW
          </div>
        )}
    
      </div>
      
      <div className="game-details">
        <div className="game-header">
          <h3 className="game-title">{game.title}</h3>
          <span className="game-rating">
            <svg className="star-icon" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {game.rating}
          </span>
        </div>
        
        <div className="game-genres">
          {game.genres.map((genre, index) => (
            <span key={index} className="genre-tag">
              {genre}
            </span>
          ))}
        </div>
        
        <p className="game-description">{game.description}</p>
        <Link to={game.gameLink} target="_blank" rel="noopener noreferrer">
        <button className="play-button">
          Play Now
        </button>
        </Link>
      </div>
    </div>
  );
};

const GameGrid = () => {
  const [games, setGames] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  
  useEffect(() => {
    // Simulating data fetch
    const sampleGames = [
      {
        id: 1,
        title: "Tic-Tac-Toe",
        description: "A classic strategy game where players take turns marking X or O to win by forming a row, column, or diagonal.",
        rating: 4.5,
        genres: ["Puzzle", "Strategy", "Casual"],
        isNew: true,
        imageUrl: "https://files.oaiusercontent.com/file-FhGdHLHYLkyb8b9J9Utws5?se=2025-02-28T01%3A39%3A22Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3D0fca0c29-8b89-4c52-a46d-f2edc4d93762.webp&sig=6TQ/wDzbFgRMZpTkKQ%2BQPvA4dYgFK%2B3bBA5sDhiNLLM%3D",
        gameLink:"https://tic-tac-toe-by-pratap.netlify.app/"
    }
    
      // {
      //   id: 2,
      //   title: "Stellar Command",
      //   description: "Command your fleet across the galaxy in this epic space strategy game.",
      //   rating: 4.5,
      //   genres: ["Strategy", "Space", "Multiplayer"],
      //   isNew: false,
      //   imageUrl: "/images/games/stellar-command.jpg" // Add image path
      // },
      // {
      //   id: 3,
      //   title: "Shadow Hunters",
      //   description: "Team-based action with unique characters and abilities in a dark fantasy world.",
      //   rating: 4.7,
      //   genres: ["Action", "Multiplayer", "Fantasy"],
      //   isNew: true
      // },
      // {
      //   id: 4,
      //   title: "Velocity Rush",
      //   description: "Experience high-speed racing with customizable vehicles and challenging tracks.",
      //   rating: 4.3,
      //   genres: ["Racing", "Sports", "Arcade"],
      //   isNew: false
      // },
      // {
      //   id: 5,
      //   title: "Mythic Legends",
      //   description: "Build your deck and battle against players worldwide in this strategic card game.",
      //   rating: 4.6,
      //   genres: ["Card Game", "Strategy", "Fantasy"],
      //   isNew: false
      // },
      // {
      //   id: 6,
      //   title: "Quantum Break",
      //   description: "Solve puzzles and unravel mysteries in this mind-bending puzzle adventure.",
      //   rating: 4.4,
      //   genres: ["Puzzle", "Adventure", "Sci-Fi"],
      //   isNew: true
      // }
    ];
    
    setGames(sampleGames);
  }, []);

  const filters = [
    { id: 'all', label: 'All Games' },
    { id: 'new', label: 'New Releases' },
    { id: 'rpg', label: 'RPG' },
    { id: 'action', label: 'Action' },
    { id: 'strategy', label: 'Strategy' },
    { id: 'puzzle', label: 'Puzzle' }
  ];

  const filteredGames = games.filter(game => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'new') return game.isNew;
    return game.genres.some(genre => genre.toLowerCase() === activeFilter.toLowerCase());
  });

  return (
    <div className="game-grid-container">
      <div className="game-filters-header">
        <h2 className="section-title">Featured Games</h2>
        <div className="filter-buttons">
          {filters.map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`filter-button ${activeFilter === filter.id ? 'active' : ''}`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="game-cards-grid">
        {filteredGames.map(game => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
};

const FloatingParticles = () => {
  return (
    <div className="particles-container">
      {[...Array(20)].map((_, i) => (
        <div 
          key={i}
          className="particle"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 150 + 20}px`,
            height: `${Math.random() * 150 + 20}px`,
            animationDuration: `${Math.random() * 20 + 10}s`,
            animationDelay: `${Math.random() * 5}s`,
            opacity: Math.random() * 0.5 + 0.1,
          }}
        />
      ))}
    </div>
  );
};

const MindshareSelectGames = () => {
  return (
    <div className="mindshare-gaming">
      <FloatingParticles />
      
      <div className="content-wrapper">
        {/* Header */}
        <header className="gaming-header">
          <div className="header-container">
            <div className="header-content">
              <div className="logo-container">
                <div className="logo-icon">
                  <span>GZ</span>
                </div>
                <h1 className="logo-text">
                  GamingZone | Presented by MindShare
                </h1>
              </div>
              
              {/* <div className="navigation-links">
                <a href="#" className="nav-link">Home</a>
                <a href="#" className="nav-link">Library</a>
                <a href="#" className="nav-link">Friends</a>
                <a href="#" className="nav-link">Support</a>
              </div> */}
              
              {/* <button className="profile-button">
                <svg className="profile-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button> */}
            </div>
          </div>
        </header>
        
        {/* Hero Section */}
        {/* <div className="hero-section">
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Discover Your Next Gaming Adventure
              </h1>
              <p className="hero-description">
                Explore our curated collection of premium games, handpicked for the ultimate gaming experience.
              </p>
              <div className="hero-buttons">
                <button className="browse-button">
                  Browse Collection
                </button>
                <button className="membership-button">
                  View Membership
                </button>
              </div>
            </div>
          </div>
        </div> */}
        
        {/* Game Grid */}
        <section className="games-section">
          <GameGrid />
        </section>
      </div>
    </div>
  );
};

export default MindshareSelectGames;