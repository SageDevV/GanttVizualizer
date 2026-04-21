import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProjectProvider } from './context/ProjectContext';
import Dashboard from './components/Dashboard/Dashboard';
import TimelinePage from './components/Timeline/TimelinePage';
import './App.css';

function App() {
  return (
    <ProjectProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/timeline/:projectId" element={<TimelinePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </ProjectProvider>
  );
}

export default App;
