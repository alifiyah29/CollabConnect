const Operation = require('./operationalTransformation');

class SocketManager {
  constructor(io) {
    this.io = io;
    this.documentSessions = new Map();
  }

  handleConnection(socket) {
    socket.on('joinDocument', (documentId, userId) => {
      this.handleJoinDocument(socket, documentId, userId);
    });
    
    socket.on('operation', (documentId, operation) => {
      this.handleOperation(socket, documentId, operation);
    });
    
    socket.on('cursor', (documentId, position) => {
      this.handleCursor(socket, documentId, position);
    });
  }

  handleJoinDocument(socket, documentId, userId) {
    socket.join(documentId);
    
    if (!this.documentSessions.has(documentId)) {
      this.documentSessions.set(documentId, new Map());
    }
    
    const session = this.documentSessions.get(documentId);
    session.set(userId, { socket, cursor: 0 });
    
    this.io.to(documentId).emit('userJoined', userId);
  }
}

module.exports = SocketManager;