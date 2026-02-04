import { JSX, Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './pages/PaginaLogin';

// Lazy Loading
const PetDetailsPage = lazy(() => import('./pages/PaginaDetalhesPet'));
const PetFormPage = lazy(() => import('./pages/PaginaFormularioPet'));
const PetListPage = lazy(() => import('./pages/PaginaListaPets'));
const TutorListPage = lazy(() => import('./pages/PaginaListaTutores'));
const TutorFormPage = lazy(() => import('./pages/PaginaFormularioTutor'));

// Protected Route Component
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('access_token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Layout />}>
        <Route index element={
          <PrivateRoute>
            <Navigate to="/pets" replace />
          </PrivateRoute>
        } />
        <Route path="pets" element={
          <Suspense fallback={<div>Carregando...</div>}>
            <PrivateRoute><PetListPage /></PrivateRoute>
          </Suspense>
        } />
        <Route path="pets/novo" element={
          <Suspense fallback={<div>Carregando...</div>}>
            <PrivateRoute><PetFormPage /></PrivateRoute>
          </Suspense>
        } />
        <Route path="pets/:id" element={
          <Suspense fallback={<div>Carregando...</div>}>
            <PrivateRoute><PetDetailsPage /></PrivateRoute>
          </Suspense>
        } />
        <Route path="pets/:id/editar" element={
          <Suspense fallback={<div>Carregando...</div>}>
            <PrivateRoute><PetFormPage /></PrivateRoute>
          </Suspense>
        } />
        <Route path="tutores" element={
          <Suspense fallback={<div>Carregando...</div>}>
            <PrivateRoute><TutorListPage /></PrivateRoute>
          </Suspense>
        } />
        <Route path="tutores/novo" element={
          <Suspense fallback={<div>Carregando...</div>}>
            <PrivateRoute><TutorFormPage /></PrivateRoute>
          </Suspense>
        } />
        <Route path="tutores/:id" element={
          <Suspense fallback={<div>Carregando...</div>}>
            <PrivateRoute><TutorFormPage /></PrivateRoute>
          </Suspense>
        } />
      </Route>
    </Routes>
  );
}

export default App;