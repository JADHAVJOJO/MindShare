import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './chatroom.css';

const socket = io.connect("http://localhost:8800");

function MindShareChat() {
  const [username, setUsername] = useState(localStorage.getItem('username') || "");
  const [room, setRoom] = useState(localStorage.getItem('room') || "");
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState(
    JSON.parse(localStorage.getItem(`messages_${room}`)) || []
  );
  const [isRoomJoined, setIsRoomJoined] = useState(false);
  const [roomNotification, setRoomNotification] = useState("");
  const [roomParticipants, setRoomParticipants] = useState([]);
  const [joinError, setJoinError] = useState("");
  const chatBodyRef = useRef(null);

  // Persist username and room in local storage
  useEffect(() => {
    if (username) {
      localStorage.setItem('username', username);
    }
    if (room) {
      localStorage.setItem('room', room);
    }
  }, [username, room]);

  // Persist messages in local storage
  useEffect(() => {
    if (room) {
      localStorage.setItem(`messages_${room}`, JSON.stringify(messageList));
    }
  }, [messageList, room]);

  // Join a room
  const joinRoom = () => {
    if (username.trim() !== "" && room.trim() !== "") {
      // Clear previous error
      setJoinError("");

      socket.emit("join_room", { room, username });
    }
  };

  // Leave room
  const leaveRoom = () => {
    // Emit leave room event to server
    socket.emit("leave_room", { room, username });
    
    // Clear room-specific local storage
    localStorage.removeItem(`messages_${room}`);
    
    // Reset states
    setIsRoomJoined(false);
    setMessageList([]);
    setRoomParticipants([]);
    setRoom("");
    setRoomNotification("");
  };

  // Send a message
  const sendMessage = async () => {
    if (message.trim() !== "") {
      const messageData = {
        room: room,
        author: username,
        message: message,
        time: new Date(Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, { ...messageData, type: 'sent' }]);
      setMessage("");
    }
  };

  // Listen for room events and messages
  useEffect(() => {
    // Handle room join error
    socket.on("join_error", (errorMessage) => {
      setJoinError(errorMessage);
    });

    // Listen for room participants update
    socket.on("room_participants", (participants) => {
      setRoomParticipants(participants);
      
      // Set room joined state
      if (participants.includes(username)) {
        setIsRoomJoined(true);
        setRoomNotification(`${username} joined room ${room}`);
        
        // Clear notification after 3 seconds
        setTimeout(() => {
          setRoomNotification("");
        }, 3000);
      }
    });

    // Listen for incoming messages
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, { ...data, type: 'received' }]);
    });

    // Scroll to bottom when messages update
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }

    // Cleanup listeners on component unmount
    return () => {
      socket.off("join_error");
      socket.off("room_participants");
      socket.off("receive_message");
    };
  }, [room, username]);

  // Handle Enter key for sending messages
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="mindshare-chat-container">
      {/* Animated Background */}
      <div className="chat-background">
        {[...Array(20)].map((_, index) => (
          <div 
            key={index} 
            className="background-bubble"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              width: `${10 + Math.random() * 40}px`,
              height: `${10 + Math.random() * 40}px`
            }}
          ></div>
        ))}
      </div>

      {/* Chat Application */}
      <div className="mindshare-chat-wrapper">
        {/* Sidebar */}
        {isRoomJoined && (
          <div className="mindshare-sidebar">
            <div className="sidebar-header">
              <div className="animated-logo">
                <h1>MindShare</h1>
                <p>Connect. Communicate. Collaborate.</p>
              </div>
              <div className="room-info">
                <h3>Room: {room}</h3>
                <p>Logged in as: {username}</p>
              </div>
            </div>
            <div className="room-participants">
              <h4>Participants ({roomParticipants.length})</h4>
              <ul>
                {roomParticipants.map((participant, index) => (
                  <li key={index} className="participant-item">
                    <span className="participant-icon">👤</span>
                    {participant}
                  </li>
                ))}
              </ul>
            </div>
            <div className="sidebar-footer">
              <button 
                onClick={leaveRoom} 
                className="leave-room-btn"
              >
                Leave Room
              </button>
            </div>
          </div>
        )}

        {/* Login/Join Room Section */}
        {!isRoomJoined ? (
          <div className="mindshare-login-container">
            <div className="mindshare-logo">
              <h1 className="animated-title">MindShare</h1>
              <p className="animated-subtitle">Connect. Communicate. Collaborate.</p>
            </div>
            {joinError && (
              <div className="join-error">
                {joinError}
              </div>
            )}
            <div className="mindshare-login-form">
              <input
                type="text"
                placeholder="Your Name"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="mindshare-input"
              />
              <input
                type="text"
                placeholder="Room ID"
                value={room}
                onChange={(event) => setRoom(event.target.value)}
                className="mindshare-input"
              />
              <button 
                onClick={joinRoom} 
                className="mindshare-join-btn"
                disabled={!username || !room}
              >
                Join Room
              </button>
            </div>
          </div>
        ) :  (
          <div className="mindshare-chat-screen">
            {/* Chat Headers  */}
            <div className="mindshare-chat-header">
              <h2>MindShare Chat</h2>
              <p>Room: {room}</p>
              <button 
                onClick={leaveRoom} 
                className="leave-room-btn-mobile"
              >
                Leave Room
              </button>
            </div>

            {/* Room Joined Notification */}
            {roomNotification && (
              <div className="room-notification">
                {roomNotification}
              </div>
            )}

            {/* Chat Body */}
            <div 
              className="mindshare-chat-body" 
              ref={chatBodyRef}
            >
              {messageList.map((messageContent, index) => (
                <div 
                  key={index}
                  className={`mindshare-message ${messageContent.type}`}
                >
                  <div className="message-content">
                    <span className="message-author">{messageContent.author}</span>
                    <p>{messageContent.message}</p>
                    <span className="message-time">{messageContent.time}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Inputs */}
            <div className="mindshare-chat-input">
              <input
                type="text"
                value={message}
                placeholder="Type your message..."
                onChange={(event) => setMessage(event.target.value)}
                onKeyPress={handleKeyPress}
                className="mindshare-message-input"
              />
              <button 
                onClick={sendMessage}
                className="mindshare-send-btn"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MindShareChat;
