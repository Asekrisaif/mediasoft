import React, { useEffect, useState } from 'react';

const ClientNotifications = ({ clientId }) => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch(`/api/users/clients/${clientId}/notifications`);
                const data = await response.json();
                setNotifications(data.notifications);
            } catch (error) {
                console.error('Erreur lors de la récupération des notifications:', error);
            }
        };

        fetchNotifications();
    }, [clientId]);

    const markNotificationAsRead = async (notificationId) => {
        try {
            const response = await fetch(`/api/users/notifications/${notificationId}/mark-as-read`, {
                method: 'PUT',
            });
            const data = await response.json();
            console.log(data);

            // Mettre à jour l'état local pour refléter le changement
            setNotifications(notifications.map(notification =>
                notification.id === notificationId ? { ...notification, statut: 'lu' } : notification
            ));
            alert('Notification marquée comme lue !');
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la notification:', error);
            alert('Erreur lors de la mise à jour de la notification.');
        }
    };

    return (
        <div>
            <h2>Mes Notifications</h2>
            {notifications.length === 0 ? (
                <p>Aucune notification pour le moment.</p>
            ) : (
                <ul>
                    {notifications.map((notification) => (
                        <li key={notification.id} style={{ marginBottom: '20px' }}>
                            <p><strong>Message :</strong> {notification.message}</p>
                            <p><strong>Date :</strong> {new Date(notification.dateEnvoi).toLocaleString()}</p>
                            <p><strong>Statut :</strong> {notification.statut}</p>
                            {notification.statut === 'non lu' && (
                                <button onClick={() => markNotificationAsRead(notification.id)}>
                                    Marquer comme lu
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ClientNotifications;