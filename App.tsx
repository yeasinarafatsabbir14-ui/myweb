import React, { useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { requestForToken, onMessageListener } from './utils/notification';
import { Toaster, toast } from 'react-hot-toast'; // Assuming you might install this, or use a custom toast

// Pages
import { Home } from './pages/Home';
import { Mission } from './pages/Mission';
import { Services } from './pages/Services';
import { DonorList } from './pages/DonorList';
import { Register } from './pages/Register';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Community } from './pages/Community';
import { BloodCampaign } from './pages/Campaign';
import { AdminPanel } from './pages/AdminPanel';

function App() {
  useEffect(() => {
    // Request permission on app load
    requestForToken();

    // Handle foreground messages
    onMessageListener()
      .then((payload: any) => {
        // You can use a Toast library here to show the notification
        // For now, we just use a browser alert or console
        console.log('Foreground Message:', payload);
        const title = payload?.notification?.title || "New Message";
        const body = payload?.notification?.body || "";
        
        // Simple browser notification if supported and permission granted (even in foreground)
        if (Notification.permission === 'granted') {
             new Notification(title, { body, icon: 'https://cdn-icons-png.flaticon.com/512/206/206024.png' });
        }
      })
      .catch((err) => console.log('failed: ', err));
  }, []);

  return (
    <AuthProvider>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/mission" element={<Mission />} />
            <Route path="/services" element={<Services />} />
            <Route path="/donors" element={<DonorList />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/community" element={<Community />} />
            <Route path="/campaign" element={<BloodCampaign />} />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminPanel />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Layout>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;