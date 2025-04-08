import React, { useState, useEffect } from 'react';
import { PlusCircle, Check, Clock, Calendar, Star, Edit2, Trash2, Users, MapPin, Bell } from 'lucide-react';
import './events.scss';

// EventsApp Component
const EventsApp = () => {
  // State management
  const [events, setEvents] = useState(() => {
    const savedEvents = localStorage.getItem('mindshare-events');
    return savedEvents ? JSON.parse(savedEvents) : [
      { 
        id: 1, 
        title: "Team Gaming Tournament", 
        status: "upcoming", 
        priority: "high", 
        date: "2025-03-15", 
        time: "14:00", 
        location: "Main Gaming Hub",
        attendees: 12
      },
      { 
        id: 2, 
        title: "Monthly Community Meetup", 
        status: "completed", 
        priority: "medium", 
        date: "2025-02-25", 
        time: "18:30",
        location: "Virtual Room #3",
        attendees: 45
      },
      { 
        id: 3, 
        title: "New Game Release Party", 
        status: "upcoming", 
        priority: "high", 
        date: "2025-03-10", 
        time: "20:00",
        location: "Downtown Arcade",
        attendees: 30
      },
      { 
        id: 4, 
        title: "Content Creator Workshop", 
        status: "planning", 
        priority: "medium", 
        date: "2025-03-18", 
        time: "16:00",
        location: "Studio Room",
        attendees: 8
      }
    ];
  });
  
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    attendees: 0
  });
  const [activeFilter, setActiveFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editInfo, setEditInfo] = useState({});
  const [currentDate, setCurrentDate] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Save events to localStorage whenever events state changes
  useEffect(() => {
    localStorage.setItem('mindshare-events', JSON.stringify(events));
  }, [events]);
  
  // Set current date on component mount
  useEffect(() => {
    const now = new Date();
    setCurrentDate(now.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }));
  }, []);

  // Generate particles for background animation
  const [particles, setParticles] = useState([]);
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 30; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 10 + 2,
          speed: Math.random() * 0.3 + 0.1,
          opacity: Math.random() * 0.5 + 0.1
        });
      }
      setParticles(newParticles);
    };
    
    generateParticles();
    
    // Animate particles
    const intervalId = setInterval(() => {
      setParticles(prevParticles => 
        prevParticles.map(particle => ({
          ...particle,
          y: particle.y + particle.speed > 100 ? 0 : particle.y + particle.speed
        }))
      );
    }, 100);
    
    return () => clearInterval(intervalId);
  }, []);

  // Filter events based on active filter and sort by date (newest first)
  const filteredEvents = events
    .filter(event => {
      if (activeFilter === "all") return true;
      return event.status === activeFilter;
    })
    .sort((a, b) => {
      // Sort by date in descending order (newest first)
      return new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time);
    });
  
  // Calculate statistics
  const stats = {
    all: events.length,
    upcoming: events.filter(event => event.status === "upcoming").length,
    completed: events.filter(event => event.status === "completed").length,
    planning: events.filter(event => event.status === "planning").length
  };

  // Add new event
  const addEvent = (e) => {
    e.preventDefault();
    if (!newEvent.title.trim()) return;
    
    const event = {
      id: Date.now(),
      title: newEvent.title,
      status: "planning",
      priority: "medium",
      date: newEvent.date || new Date().toISOString().slice(0, 10),
      time: newEvent.time || "12:00",
      location: newEvent.location || "TBD",
      attendees: newEvent.attendees || 0
    };
    
    // Add new event at the beginning of the array (newest first)
    setEvents([event, ...events]);
    setNewEvent({
      title: "",
      date: "",
      time: "",
      location: "",
      attendees: 0
    });
    setShowForm(false);
  };
  
  // Delete event
  const deleteEvent = (id) => {
    setEvents(events.filter(event => event.id !== id));
  };
  
  // Toggle event status
  const toggleStatus = (id) => {
    setEvents(events.map(event => {
      if (event.id === id) {
        const statuses = ["planning", "upcoming", "completed"];
        const currentIndex = statuses.indexOf(event.status);
        const newStatus = statuses[(currentIndex + 1) % statuses.length];
        return { ...event, status: newStatus };
      }
      return event;
    }));
  };
  
  // Start editing event
  const startEdit = (event) => {
    setEditingId(event.id);
    setEditInfo({
      title: event.title,
      date: event.date,
      time: event.time,
      location: event.location,
      attendees: event.attendees
    });
  };
  
  // Save edited event
  const saveEdit = (id) => {
    if (!editInfo.title.trim()) return;
    setEvents(events.map(event => 
      event.id === id ? { ...event, ...editInfo } : event
    ));
    setEditingId(null);
  };
  
  // Change event priority
  const changePriority = (id) => {
    setEvents(events.map(event => {
      if (event.id === id) {
        const priorities = ["low", "medium", "high"];
        const currentIndex = priorities.indexOf(event.priority);
        const newPriority = priorities[(currentIndex + 1) % priorities.length];
        return { ...event, priority: newPriority };
      }
      return event;
    }));
  };

  // Get priority icon and color
  const getPriorityElement = (priority) => {
    switch(priority) {
      case "high":
        return <Star className="priority-high" size={16} />;
      case "medium":
        return <Star className="priority-medium" size={16} />;
      case "low":
        return <Star className="priority-low" size={16} />;
      default:
        return null;
    }
  };

  // Get status class
  const getStatusClass = (status) => {
    switch(status) {
      case "completed":
        return "status-completed";
      case "upcoming":
        return "status-upcoming";
      case "planning":
        return "status-planning";
      default:
        return "status-default";
    }
  };

  // Format date for display
  const formatDate = (dateString, timeString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    return `${date.toLocaleDateString('en-US', options)} at ${timeString}`;
  };

  return (
    <div className="events-app">
      {/* Animated particles */}
      {particles.map(particle => (
        <div 
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity
          }}
        />
      ))}
      
      {/* Main container */}
      <div className="app-container">
        {/* App header */}
        <div className="app-header">
        <div className="logo-container">
                <div className="logo-icon">
                  <span>EZ</span>
                </div>
                <h1 className="logo-text">
                  EventZone | Presented by MindShare
                </h1>
              </div>
          <p>{currentDate}</p>
        </div>
        
        {/* Filters & Stats */}
        <div className="filters-bar">
          <div className="filter-buttons">
            <button 
              onClick={() => setActiveFilter("all")}
              className={`filter-btn ${activeFilter === "all" ? "active" : ""}`}
            >
              <Calendar size={16} /> All <span className="count-badge">{stats.all}</span>
            </button>
            <button 
              onClick={() => setActiveFilter("planning")}
              className={`filter-btn ${activeFilter === "planning" ? "active planning" : ""}`}
            >
              <Clock size={16} /> Planning <span className="count-badge">{stats.planning}</span>
            </button>
            <button 
              onClick={() => setActiveFilter("upcoming")}
              className={`filter-btn ${activeFilter === "upcoming" ? "active upcoming" : ""}`}
            >
              <Bell size={16} /> Upcoming <span className="count-badge">{stats.upcoming}</span>
            </button>
            <button 
              onClick={() => setActiveFilter("completed")}
              className={`filter-btn ${activeFilter === "completed" ? "active completed" : ""}`}
            >
              <Check size={16} /> Completed <span className="count-badge">{stats.completed}</span>
            </button>
          </div>
          
          <button 
            onClick={() => setShowForm(!showForm)}
            className="new-event-btn"
          >
            <PlusCircle size={18} /> New Event
          </button>
        </div>
        
        {/* Add new event form */}
        {showForm && (
          <form onSubmit={addEvent} className="event-form">
            <div className="form-grid">
              <div className="form-group">
                <label>Event Title</label>
                <input
                  type="text"
                  placeholder="Enter event title..."
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="date-time-group">
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Time</label>
                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                    className="form-input"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  placeholder="Event location..."
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>Expected Attendees</label>
                <input
                  type="number"
                  placeholder="0"
                  min="0"
                  value={newEvent.attendees}
                  onChange={(e) => setNewEvent({...newEvent, attendees: parseInt(e.target.value) || 0})}
                  className="form-input"
                />
              </div>
            </div>
            
            <div className="form-actions">
              <button 
                type="button" 
                onClick={() => setShowForm(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="submit-btn"
              >
                <PlusCircle size={18} /> Add Event
              </button>
            </div>
          </form>
        )}
        
        {/* Events list */}
        <div className="events-list-container">
          {filteredEvents.length === 0 ? (
            <div className="empty-state">
              {activeFilter === "all" ? "No events yet. Create your first event using the button above!" : `No ${activeFilter} events.`}
            </div>
          ) : (
            <ul className="events-list">
              {filteredEvents.map(event => (
                <li 
                  key={event.id} 
                  className={`event-item ${event.status === "completed" ? "completed" : ""}`}
                >
                  {editingId === event.id ? (
                    <div className="edit-form">
                      <div className="edit-form-grid">
                        <div className="form-group">
                          <label>Event Title</label>
                          <input
                            type="text"
                            value={editInfo.title}
                            onChange={(e) => setEditInfo({...editInfo, title: e.target.value})}
                            className="form-input"
                            autoFocus
                          />
                        </div>
                        
                        <div className="date-time-group">
                          <div className="form-group">
                            <label>Date</label>
                            <input
                              type="date"
                              value={editInfo.date}
                              onChange={(e) => setEditInfo({...editInfo, date: e.target.value})}
                              className="form-input"
                            />
                          </div>
                          <div className="form-group">
                            <label>Time</label>
                            <input
                              type="time"
                              value={editInfo.time}
                              onChange={(e) => setEditInfo({...editInfo, time: e.target.value})}
                              className="form-input"
                            />
                          </div>
                        </div>
                        
                        <div className="form-group">
                          <label>Location</label>
                          <input
                            type="text"
                            value={editInfo.location}
                            onChange={(e) => setEditInfo({...editInfo, location: e.target.value})}
                            className="form-input"
                          />
                        </div>
                        
                        <div className="form-group">
                          <label>Expected Attendees</label>
                          <input
                            type="number"
                            min="0"
                            value={editInfo.attendees}
                            onChange={(e) => setEditInfo({...editInfo, attendees: parseInt(e.target.value) || 0})}
                            className="form-input"
                          />
                        </div>
                      </div>
                      
                      <div className="form-actions">
                        <button 
                          onClick={() => setEditingId(null)}
                          className="cancel-btn"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={() => saveEdit(event.id)}
                          className="save-btn"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className={`event-content ${getStatusClass(event.status)}`}>
                      <div className="event-header">
                        <div className="event-title-row">
                          <button 
                            onClick={() => toggleStatus(event.id)}
                            className={`status-indicator ${event.status}`}
                            title={`Status: ${event.status}`}
                          >
                            {event.status === "completed" ? <Check size={18} /> : 
                             event.status === "upcoming" ? <Bell size={18} /> : 
                             <Clock size={18} />}
                          </button>
                          
                          <button 
                            onClick={() => changePriority(event.id)}
                            className="priority-indicator"
                            title={`Priority: ${event.priority}`}
                          >
                            {getPriorityElement(event.priority)}
                          </button>
                          
                          <h3 className={event.status === "completed" ? "crossed-out" : ""}>
                            {event.title}
                          </h3>
                        </div>
                        
                        <div className="event-actions">
                          <button 
                            onClick={() => startEdit(event)}
                            className="edit-btn"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => deleteEvent(event.id)}
                            className="delete-btn"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="event-details">
                        <div className="event-detail">
                          <Calendar size={14} />
                          {formatDate(event.date, event.time)}
                        </div>
                        
                        {event.location && (
                          <div className="event-detail">
                            <MapPin size={14} />
                            {event.location}
                          </div>
                        )}
                        
                        <div className="event-detail">
                          <Users size={14} />
                          {event.attendees} {event.attendees === 1 ? "attendee" : "attendees"}
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsApp;