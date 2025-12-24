import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import FileUpload from './components/FileUpload';
import ChatInterface from './components/ChatInterface';
import logo from './dataspark.svg';
import './App.css';

function App() {
  return (
    <Router>
      <div className="ds-app">
        <header className="ds-header">
          <div className="ds-brand">
            <img src={logo} className="ds-logo" alt="Data Spark logo" />
            <div className="ds-title">Data Spark</div>
          </div>
        </header>

        <main className="ds-main">
          <section className="ds-hero">
            <Routes>
              <Route path="/" element={
                <>
                  <h1 className="ds-heading">Upload a PDF and chat with it</h1>
                  <p className="ds-subheading">
                    Data Spark turns educational PDFs and documentation into interactive answers.
                    Preserve conversation history and work with documents up to 50 pages.
                  </p>
                  <div className="ds-badges">
                    <span className="ds-badge">PDF up to 50 pages</span>
                    <span className="ds-badge">History preserved</span>
                    <span className="ds-badge">Tech-forward design</span>
                  </div>
                  <FileUpload />
                </>
              } />
              <Route path="/api/chat/:sessionId" element={<ChatInterface />} />
            </Routes>
          </section>
        </main>

        <footer className="ds-footer">
          Data Spark © {new Date().getFullYear()}
        </footer>
      </div>
    </Router>
  );
}

export default App;
