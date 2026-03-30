import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AIInterviewPage from './pages/AIInterviewPage';
import SocialCardPage from './pages/SocialCardPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AIInterviewPage />} />
        <Route path="/result" element={<SocialCardPage />} />
      </Routes>
    </Router>
  );
}

export default App