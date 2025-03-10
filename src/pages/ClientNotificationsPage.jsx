import React from 'react';
import ClientNotifications from '../components/ClientNotifications';

const ClientNotificationsPage = () => {
    // Récupérer l'ID du client depuis l'authentification ou le contexte
    const clientId = 123; // Remplacez par l'ID réel du client

    return (
        <div>
            <h1>Mes Notifications</h1>
            <ClientNotifications clientId={clientId} />
        </div>
    );
};

export default ClientNotificationsPage;