import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AIInterviewPage from './pages/AIInterviewPage';
import SocialCardPage from './pages/SocialCardPage';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-indigo-50 font-sans leading-relaxed">
      <Router>
        <Routes>
          <Route path="/" element={<AIInterviewPage />} />
          <Route path="/result" element={<SocialCardPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App