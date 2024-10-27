import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';

const DocumentEditor = () => {
  const { id } = useParams();
  const [content, setContent] = useState('');
  const [socket, setSocket] = useState(null);
  const [collaborators, setCollaborators] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.emit('joinDocument', id);

    newSocket.on('documentData', (data) => {
      setContent(data.content);
      setCollaborators(data.collaborators);
    });

    newSocket.on('documentUpdated', (newContent) => {
      setContent(newContent);
    });

    newSocket.on('userJoined', (user) => {
      setCollaborators(prev => [...prev, user]);
    });

    newSocket.on('userLeft', (userId) => {
      setCollaborators(prev => prev.filter(user => user.id !== userId));
    });

    newSocket.on('chatMessage', (message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => {
      newSocket.emit('leaveDocument', id);
      newSocket.disconnect();
    };
  }, [id]);

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    socket.emit('documentChange', { id, content: newContent });
    
    // Auto-save functionality
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
    }, 1000);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      socket.emit('sendMessage', { documentId: id, message: newMessage });
      setNewMessage('');
    }
  };

  return (
    <div className="flex h-screen">
      {/* Main Editor */}
      <div className="flex-1 p-4">
        <div className="mb-2 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Document: {id}</h1>
          <span className="text-sm text-gray-500">
            {saving ? 'Saving...' : 'All changes saved'}
          </span>
        </div>
        <textarea
          className="w-full h-[calc(100vh-200px)] p-4 border rounded"
          value={content}
          onChange={handleContentChange}
        />
      </div>

      {/* Sidebar */}
      <div className="w-80 border-l p-4">
        {/* Collaborators Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Collaborators</h2>
          <ul>
            {collaborators.map((user) => (
              <li key={user.id} className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span>{user.name}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Chat Section */}
        <div className="h-[calc(100vh-400px)]">
          <h2 className="text-lg font-semibold mb-2">Chat</h2>
          <div className="h-[calc(100%-100px)] overflow-y-auto mb-4">
            {messages.map((msg, index) => (
              <div key={index} className="mb-2">
                <span className="font-semibold">{msg.user}: </span>
                <span>{msg.text}</span>
              </div>
            ))}
          </div>
          <form onSubmit={sendMessage} className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 border rounded px-2 py-1"
              placeholder="Type a message..."
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-1 rounded"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DocumentEditor;