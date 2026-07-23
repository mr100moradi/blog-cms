import './App.css';
import Layout from './components/layout/Layout';
import PublicLayout from './components/layout/PublicLayout';
import Home from './pages/Home';
import PublicHome from './pages/PublicHome';
import Create from './pages/Create';
import Edit from './pages/Edit';
import Post from './pages/Post';
import PublicPost from './pages/PublicPost';
import Drafts from './pages/Drafts';
import Categories from './pages/Categories';
import Comments from './pages/Comments';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public site */}
        <Route
          path="/"
          element={(
            <PublicLayout>
              <PublicHome />
            </PublicLayout>
          )}
        />
        <Route
          path="/post/:id"
          element={(
            <PublicLayout>
              <PublicPost />
            </PublicLayout>
          )}
        />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User Dashboard - Redirect regular users to home */}
        <Route
          path="/user"
          element={(
            <ProtectedRoute>
              <Navigate to="/" replace />
            </ProtectedRoute>
          )}
        />

        {/* Admin */}
        <Route
          path="/admin"
          element={(
            <ProtectedRoute requireAdmin>
              <Layout>
                <Home />
              </Layout>
            </ProtectedRoute>
          )}
        />
        <Route
          path="/admin/new"
          element={(
            <ProtectedRoute requireAdmin>
              <Layout>
                <Create />
              </Layout>
            </ProtectedRoute>
          )}
        />
        <Route
          path="/admin/edit/:id"
          element={(
            <ProtectedRoute requireAdmin>
              <Layout>
                <Edit />
              </Layout>
            </ProtectedRoute>
          )}
        />
        <Route
          path="/admin/post/:id"
          element={(
            <ProtectedRoute requireAdmin>
              <Layout>
                <Post />
              </Layout>
            </ProtectedRoute>
          )}
        />
        <Route
          path="/admin/drafts"
          element={(
            <ProtectedRoute requireAdmin>
              <Layout>
                <Drafts />
              </Layout>
            </ProtectedRoute>
          )}
        />
        <Route
          path="/admin/categories"
          element={(
            <ProtectedRoute requireAdmin>
              <Layout>
                <Categories />
              </Layout>
            </ProtectedRoute>
          )}
        />
        <Route
          path="/admin/comments"
          element={(
            <ProtectedRoute requireAdmin>
              <Layout>
                <Comments />
              </Layout>
            </ProtectedRoute>
          )}
        />
        <Route
          path="/admin/settings"
          element={(
            <ProtectedRoute requireAdmin>
              <Layout>
                <Settings />
              </Layout>
            </ProtectedRoute>
          )}
        />
      </Routes>
    </BrowserRouter>
  );
}
