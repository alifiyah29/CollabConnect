import React, { useEffect, useRef, useState } from 'react';
import { useSocket } from '../../hooks/useSocket';
import { useDocument } from '../../hooks/useDocument';
import { Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Collaboration from '@tiptap/extension-collaboration';

const DocumentEditor = ({ documentId }) => {
  const { socket } = useSocket();
  const { document, loading, error } = useDocument(documentId);
  const editor = useRef(null);

  useEffect(() => {
    if (!socket || !documentId) return;

    socket.emit('joinDocument', documentId);

    return () => {
      socket.emit('leaveDocument', documentId);
    };
  }, [socket, documentId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="document-editor">
      <Editor
        ref={editor}
        extensions={[
          StarterKit,
          Collaboration.configure({
            document: document.content,
            onChange: ({ editor }) => {
              socket.emit('operation', {
                documentId,
                content: editor.getJSON()
              });
            }
          })
        ]}
      />
    </div>
  );
};

export default DocumentEditor;