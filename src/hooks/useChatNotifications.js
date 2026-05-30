import { useContext } from 'react';
import { ChatNotificationContext } from '../context/ChatNotificationContext';

export const useChatNotifications = () => useContext(ChatNotificationContext);
