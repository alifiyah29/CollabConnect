import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';

const DocumentEditor = () => {
  const { id } = useParams();
  const socket = io('http://localhost:5000'); 

  useEffect(() => {
    socket.emit('joinDocument', id);

    socket.on('documentUpdated', (data) => {
      console.log('Document updated:', data);
      // Logic to update document state goes here
    });

    return () => {
      socket.emit('leaveDocument', id);
    };
  }, [id, socket]);

  return (
    <div>
      <h1>Editing Document: {id}</h1>
      {/* Add document editing UI here */}
    </div>
  );
};

export default DocumentEditor;
