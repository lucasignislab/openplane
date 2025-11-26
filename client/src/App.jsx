import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import GlobalIssueModal from './components/GlobalIssueModal';
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts';
import useWorkspaceStore from './context/useWorkspaceStore';
import useAuthStore from './context/authStore';

// Layouts
import AppLayout from './components/layout/AppLayout';

// Pages
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MyIssues from './pages/MyIssues';
import ProjectDetails from './pages/ProjectDetails';
import Cycles from './pages/Cycles';
import CycleDetails from './pages/CycleDetails';
import SettingsLayout from './pages/settings/SettingsLayout';

function App() {
  // Inicializar keyboard shortcuts
  useKeyboardShortcuts();

  const { fetchWorkspaces } = useWorkspaceStore();
  const { isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    // Verificar autenticação ao carregar
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    // Carregar workspace quando usuário estiver autenticado
    if (isAuthenticated) {
      fetchWorkspaces();
    }
  }, [isAuthenticated, fetchWorkspaces]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rotas Protegidas com Layout */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my-issues" element={<MyIssues />} />
          <Route path="/projects/:projectId" element={<ProjectDetails />} />
          <Route path="/projects/:projectId/cycles" element={<Cycles />} />
          <Route path="/cycles/:cycleId" element={<CycleDetails />} />
          <Route path="/settings" element={<SettingsLayout />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Modal global mantido aqui também, embora AppLayout já tenha um. 
          Se AppLayout já tem, podemos remover daqui para evitar duplicidade.
          Vou remover daqui pois vi que AppLayout tem.
      */}
    </>
  );
}

export default App;
