import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ScrapedData from "./pages/ScrapedData";
import ProtectedRoute from "./components/ProtectedRoute";
import SearchHistory from "./pages/SearchHistory";
function App() {
  return (
    <BrowserRouter>

      <AuthProvider>

        <Routes>

          <Route
            path="/"
            element={<Navigate to="/dashboard" replace />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
<Route
  path="/scraped-data"
  element={
    <ProtectedRoute>
      <ScrapedData />
    </ProtectedRoute>
  }
/>
<Route
  path="/search-history"
  element={
    <ProtectedRoute>
      <SearchHistory />
    </ProtectedRoute>
  }
/>
          <Route
            path="*"
            element={<Navigate to="/dashboard" replace />}
          />

        </Routes>
     
      </AuthProvider>

    </BrowserRouter>
  );
}

export default App;