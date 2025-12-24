import React, { useState } from 'react';
import axios from 'axios';
import './FileUpload.css'; // We'll create this for animation styles

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    if (f.type !== 'application/pdf') {
      setError('Please select a PDF file');
      setFile(null);
      return;
    }
    setError('');
    setFile(f);
  };

  const clearFile = () => {
    setFile(null);
    setError('');
  };

  const formatSize = (bytes) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const handleStartSession = async () => {
    if (!file) return;

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { session_id } = response.data;

      if (session_id) {
        // Wait for 3 seconds as requested
        setTimeout(() => {
          // Redirect to the chat session
          // Using window.location.href as per user request to "redirect to" a specific URL path
          // If we implement client-side routing, we could use useNavigate() here.
          // But given the instruction "redirect to /api/chat/session_id", I will stick to the literal path.
          // However, /api/ usually implies backend. If the user meant the frontend route, it might be /chat/session_id.
          // I will assume they might want to actually go to that URL. 
          // But to be safe and "React-like", I will also support client-side navigation if I set up the router.
          // Let's assume for now we use window.location.href to be exact with the user's request.
          window.location.href = `/api/chat/${session_id}`;
        }, 3000);
      } else {
        setError('No session ID returned from server');
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to upload file. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="ds-card">
      {loading ? (
        <div className="ds-loading-container">
          <div className="ds-spinner"></div>
          <p className="ds-loading-text">Processing your document...</p>
        </div>
      ) : (
        <>
          <div className="ds-upload-row">
            <input
              id="pdf-input"
              type="file"
              accept="application/pdf"
              className="ds-input"
              onChange={onFileChange}
            />
            <label htmlFor="pdf-input" className="ds-upload">Select PDF</label>
            <button
              className="ds-btn ds-btn-primary"
              disabled={!file}
              onClick={handleStartSession}
            >
              Start Session
            </button>
            <button
              className="ds-btn"
              onClick={clearFile}
              disabled={!file && !error}
            >
              Clear
            </button>
          </div>
          <div className="ds-file-meta">
            {!file && !error && 'Choose a PDF to begin'}
            {error && <span className="ds-error">{error}</span>}
            {file && (
              <>
                {file.name} • {formatSize(file.size)}
              </>
            )}
          </div>
        </>
      )}
      <div className="ds-section-title">Recent Sessions</div>
      <div className="ds-history">
        <div className="ds-history-item">
          <div className="ds-item-title">No sessions yet</div>
          <div className="ds-item-meta">Your conversations will appear here</div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
