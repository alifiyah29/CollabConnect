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

    // Handle disconnect
    socket.on('disconnect', () => {
      this.handleDisconnect(socket);
    });
  }

  handleJoinDocument(socket, documentId, userId) {
    socket.join(documentId);
  
    if (!this.documentSessions.has(documentId)) {
      this.documentSessions.set(documentId, new Map());
    }
  
    const session = this.documentSessions.get(documentId);
    session.set(userId, { socket, cursor: 0 });
  
    // Broadcast to other users that someone joined
    this.io.to(documentId).emit('userJoined', { userId, documentId });
  }

  handleDisconnect(socket) {
    // Find the documentId and userId from the session
    for (let [documentId, session] of this.documentSessions.entries()) {
      for (let [userId, userSession] of session.entries()) {
        if (userSession.socket === socket) {
          // Remove the user from the session
          session.delete(userId);
          
          // Broadcast to other users that someone left
          this.io.to(documentId).emit('userLeft', { userId });
          return;
        }
      }
    }
    console.log("Client disconnected");
  }

  // Placeholder for operation handling
  handleOperation(socket, documentId, operation) {
    // Implement operation handling logic here
  }

  // Placeholder for cursor handling
  handleCursor(socket, documentId, position) {
    // Implement cursor handling logic here
  }
}

module.exports = SocketManager;
