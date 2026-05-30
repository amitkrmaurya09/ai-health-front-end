import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import api from '../services/api';
import { API_BASE_URL } from '../utils/constants';
import { useAuth } from '../hooks/useAuth';

export const ChatNotificationContext = createContext({
  totalUnread: 0,
  conversations: [],
  unreadByConsultation: {},
  refreshUnread: () => {},
});

const getId = (value) => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value._id || value.id || '';
};

export const ChatNotificationProvider = ({ children }) => {
  const { user, tokenVerified } = useAuth();
  const [totalUnread, setTotalUnread] = useState(0);
  const [conversations, setConversations] = useState([]);

  const refreshUnread = useCallback(async () => {
    if (!user || !tokenVerified) {
      setTotalUnread(0);
      setConversations([]);
      return;
    }

    try {
      const response = await api.chat.getUnreadSummary();
      if (response.success) {
        setTotalUnread(response.total || 0);
        setConversations(response.conversations || []);
      }
    } catch (error) {
      console.error('Unread chat refresh failed:', error);
    }
  }, [user, tokenVerified]);

  useEffect(() => {
    refreshUnread();
  }, [refreshUnread]);

  useEffect(() => {
    const userId = getId(user);
    if (!userId || !tokenVerified) return undefined;

    const socket = io(API_BASE_URL.replace(/\/$/, ''));
    socket.emit('join_user', userId);

    socket.on('receive_message', (message) => {
      if (getId(message.senderId) !== userId) refreshUnread();
    });

    return () => {
      socket.disconnect();
    };
  }, [user, tokenVerified, refreshUnread]);

  const unreadByConsultation = useMemo(
    () => conversations.reduce((map, item) => {
      const consultationId = getId(item.consultation);
      if (consultationId) map[consultationId] = item.count || 0;
      return map;
    }, {}),
    [conversations]
  );

  const value = useMemo(() => ({
    totalUnread,
    conversations,
    unreadByConsultation,
    refreshUnread,
  }), [totalUnread, conversations, unreadByConsultation, refreshUnread]);

  return (
    <ChatNotificationContext.Provider value={value}>
      {children}
    </ChatNotificationContext.Provider>
  );
};
