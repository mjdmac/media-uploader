import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import FileUploader from './components/FileUploader';
import FileList from './components/FileList';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-400 via-blue-400 to-slate-500 py-8 relative overflow-hidden">
 
        {/* ROUTES */}
        <div className="relative z-10">
          <Routes>
            <Route path="/" element={<FileUploader />} />
            <Route path="/files" element={<FileList />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
