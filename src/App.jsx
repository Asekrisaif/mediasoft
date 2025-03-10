import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminNotificationsPage from './pages/AdminNotificationsPage';
import ClientNotificationsPage from './pages/ClientNotificationsPage';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/admin/notifications" element={<AdminNotificationsPage />} />
                <Route path="/client/notifications" element={<ClientNotificationsPage />} />
                {/* Ajoutez d'autres routes ici */}
            </Routes>
        </Router>
    );
};

export default App;