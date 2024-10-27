import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [documents, setDocuments] = useState([]);
  const [newDocTitle, setNewDocTitle] = useState('');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/documents');
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const createDocument = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newDocTitle,
          content: '',
        }),
      });
      const newDoc = await response.json();
      setDocuments([...documents, newDoc]);
      setNewDocTitle('');
    } catch (error) {
      console.error('Error creating document:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">CollabConnect</h1>

      {/* Create New Document */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Create New Document</h2>
        <form onSubmit={createDocument} className="flex gap-4">
          <input
            type="text"
            value={newDocTitle}
            onChange={(e) => setNewDocTitle(e.target.value)}
            placeholder="Enter document title"
            className="flex-1 border rounded px-3 py-2"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Create
          </button>
        </form>
      </div>

      {/* Documents List */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Documents</h2>
        {documents.length === 0 ? (
          <p className="text-gray-500">No documents yet. Create one to get started!</p>
        ) : (
          <div className="grid gap-4">
            {documents.map((doc) => (
              <Link
                key={doc._id}
                to={`/document/${doc._id}`}
                className="block p-4 border rounded hover:border-blue-500 transition-colors"
              >
                <h3 className="font-semibold">{doc.title}</h3>
                <p className="text-sm text-gray-500">
                  Last edited: {new Date(doc.lastEdited).toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;