import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); 

const DocumentEditor = () => {
  const { id } = useParams();
  const [content, setContent] = useState("");

  useEffect(() => {
    socket.emit('joinDocument', id);

    socket.on('documentData', (document) => {
      setContent(document.content);
    });

    socket.on('documentUpdate', (document) => {
      setContent(document.content);
    });

    return () => {
      socket.off('documentData');
      socket.off('documentUpdate');
    };
  }, [id]);

  const handleChange = (e) => {
    setContent(e.target.value);
    socket.emit('editDocument', { documentId: id, content: e.target.value });
  };

  return (
    <textarea value={content} onChange={handleChange} placeholder="Start editing..." />
  );
};

export default DocumentEditor;
