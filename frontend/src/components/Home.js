import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [documents, setDocuments] = useState([]);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:5000/api/documents');
        if (!response.ok) {
          throw new Error('Failed to fetch documents');
        }
        const data = await response.json();
        setDocuments(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const createDocument = async (e) => {
    e.preventDefault();
    setError(null); // Reset error state before creating a new document

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

      if (!response.ok) {
        throw new Error('Failed to create document');
      }

      const newDoc = await response.json();
      setDocuments((prevDocs) => [...prevDocs, newDoc]);
      setNewDocTitle('');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">CollabConnect</h1>

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
            disabled={loading} // Disable button when loading
          >
            {loading ? 'Creating...' : 'Create'}
          </button>
        </form>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Your Documents ({documents.length})</h2>
        {loading ? (
          <p className="text-gray-500">Loading documents...</p>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
