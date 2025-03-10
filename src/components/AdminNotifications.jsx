import React, { useState } from 'react';

const AdminNotifications = () => {
    const [message, setMessage] = useState('');

    const sendNotification = async () => {
        try {
            const response = await fetch('/api/users/notifications/send-to-all-clients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            });
            const data = await response.json();
            console.log(data);
            alert('Notification envoyée avec succès !');
        } catch (error) {
            console.error('Erreur lors de l\'envoi de la notification:', error);
            alert('Erreur lors de l\'envoi de la notification.');
        }
    };

    return (
        <div>
            <h2>Envoyer une notification à tous les clients</h2>
            <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Entrez votre message ici..."
                rows={5}
                cols={50}
            />
            <br />
            <button onClick={sendNotification}>Envoyer</button>
        </div>
    );
};

export default AdminNotifications;