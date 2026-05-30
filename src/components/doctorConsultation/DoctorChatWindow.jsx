import React, { useEffect, useRef, useState } from 'react';
import { FaPaperclip, FaPaperPlane, FaTimes } from 'react-icons/fa';
import { io } from 'socket.io-client';
import api from '../../services/api';
import { API_BASE_URL } from '../../utils/constants';

const API_ORIGIN = API_BASE_URL.replace(/\/$/, '');

const getId = (value) => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value._id || value.id || '';
};

const getName = (value, fallback) => value?.name || fallback;

const getInitial = (name) => name?.trim()?.charAt(0)?.toUpperCase() || 'D';

const formatMessageTime = (dateValue) => {
  if (!dateValue) return 'Sending...';
  return new Date(dateValue).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatDay = (dateValue) => {
  if (!dateValue) return '';
  return new Date(dateValue).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
};

const DoctorChatWindow = ({ consultation, currentUser, onClose, embedded = false, onMessagesRead }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const consultationId = consultation?._id;
  const currentUserId = getId(currentUser);
  const doctorId = getId(consultation?.doctorId);
  const otherUser = currentUserId === doctorId ? consultation?.patientId : consultation?.doctorId;
  const otherName = getName(otherUser, currentUser?.role === 'doctor' ? 'Patient' : 'Doctor');

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, consultationId]);

  useEffect(() => {
    if (!consultationId || !currentUserId) return;

    const socket = io(API_ORIGIN);
    socketRef.current = socket;

    socket.emit('join_user', currentUserId);
    socket.emit('join_consultation', consultationId);

    socket.on('receive_message', (message) => {
      if (getId(message.consultationId) !== consultationId) return;
      if (getId(message.receiverId) === currentUserId) {
        api.chat.markAsRead(consultationId, getId(message))
          .then(() => onMessagesRead?.())
          .catch(() => {});
      }
      setMessages((prev) => {
        if (prev.some((item) => getId(item) === getId(message))) return prev;
        return [...prev, message];
      });
    });

    socket.on('connect_error', () => {
      setError('Live chat is offline. Messages still load from history.');
    });

    return () => {
      socket.emit('leave_consultation', consultationId);
      socket.disconnect();
    };
  }, [consultationId, currentUserId, onMessagesRead]);

  useEffect(() => {
    const loadMessages = async () => {
      if (!consultationId) return;
      setLoading(true);
      setError('');

      try {
        const response = await api.chat.getMessages(consultationId);
        setMessages(response.messages || []);
        onMessagesRead?.();
      } catch (err) {
        setError(err.message || 'Unable to load messages.');
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [consultationId, onMessagesRead]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setError('Only JPG, PNG, and PDF attachments are allowed.');
      return;
    }

    setAttachment(file);
  };

  const handleSend = async (event) => {
    event.preventDefault();
    if ((!input.trim() && !attachment) || !consultationId) return;

    setSending(true);
    setError('');

    const formData = new FormData();
    formData.append('content', input.trim());
    if (attachment) formData.append('attachment', attachment);

    try {
      const response = await api.chat.sendMessage(consultationId, formData);
      const savedMessage = response.data;
      setMessages((prev) => {
        if (prev.some((item) => getId(item) === getId(savedMessage))) return prev;
        return [...prev, savedMessage];
      });
      setInput('');
      setAttachment(null);
    } catch (err) {
      setError(err.message || 'Unable to send message.');
    } finally {
      setSending(false);
    }
  };

  const wrapperClass = embedded
    ? 'w-full h-[560px] bg-white rounded-2xl shadow-xl border border-slate-200 flex flex-col overflow-hidden'
    : 'fixed bottom-20 right-5 z-[9998] w-[calc(100vw-2rem)] sm:w-[410px] h-[560px] max-h-[82vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200';

  let lastMessageDay = '';

  return (
    <div className={wrapperClass}>
      <div className="bg-white px-4 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white flex items-center justify-center font-semibold shadow-sm">
            {getInitial(otherName)}
            <span className="absolute -right-0.5 -bottom-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-slate-900 truncate">{otherName}</h3>
            <p className="text-xs text-emerald-600 font-medium">Available for chat</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 flex items-center justify-center transition"
            aria-label="Close chat"
          >
            <FaTimes />
          </button>
        )}
      </div>

      <div className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-4">
        {error && <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl p-3">{error}</div>}
        {loading ? (
          <div className="text-sm text-gray-500 text-center mt-8">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-6">
            <div className="w-14 h-14 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-indigo-600 font-semibold mb-3">
              {getInitial(otherName)}
            </div>
            <p className="text-sm font-medium text-slate-700">Start chatting with {otherName}</p>
            <p className="text-xs text-slate-400 mt-1">Messages are saved and delivered when either person returns.</p>
          </div>
        ) : (
          messages.map((message) => {
            const mine = getId(message.senderId) === currentUserId;
            const messageDay = formatDay(message.createdAt);
            const showDay = messageDay && messageDay !== lastMessageDay;
            if (showDay) lastMessageDay = messageDay;

            return (
              <React.Fragment key={getId(message) || `${message.createdAt}-${message.content}`}>
                {showDay && (
                  <div className="flex justify-center">
                    <span className="text-[11px] text-slate-400 bg-white border border-slate-100 rounded-full px-3 py-1 shadow-sm">
                      {messageDay}
                    </span>
                  </div>
                )}
                <div className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-end gap-2 max-w-[84%] ${mine ? 'flex-row-reverse' : ''}`}>
                    {!mine && (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
                        {getInitial(otherName)}
                      </div>
                    )}
                    <div
                      className={`px-4 py-3 rounded-3xl text-sm shadow-sm ${
                        mine
                          ? 'bg-indigo-600 text-white rounded-br-lg'
                          : 'bg-white text-slate-800 border border-slate-100 rounded-bl-lg'
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words leading-relaxed">{message.content}</p>
                      {message.attachments?.map((file) => (
                        <a
                          key={file.url}
                          href={file.url}
                          target="_blank"
                          rel="noreferrer"
                          className={`block mt-2 underline ${mine ? 'text-indigo-100' : 'text-indigo-600'}`}
                        >
                          {file.filename || 'View attachment'}
                        </a>
                      ))}
                      <div className={`text-[10px] mt-2 text-right ${mine ? 'text-indigo-100' : 'text-slate-400'}`}>
                        {formatMessageTime(message.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100">
        {attachment && (
          <div className="mb-2 flex items-center justify-between rounded-xl bg-slate-100 px-3 py-2 text-xs text-slate-600">
            <span className="truncate">{attachment.name}</span>
            <button type="button" onClick={() => setAttachment(null)} className="text-slate-500 hover:text-slate-800">
              <FaTimes />
            </button>
          </div>
        )}
        <div className="flex gap-2 items-center">
          <label className="w-11 h-11 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center cursor-pointer hover:bg-slate-200 transition flex-shrink-0">
            <FaPaperclip />
            <input type="file" className="hidden" onChange={handleFileChange} />
          </label>
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Type your message..."
            className="min-w-0 flex-1 h-11 px-4 border border-slate-200 rounded-full focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 text-sm text-slate-700 placeholder:text-slate-400 transition"
          />
          <button
            type="submit"
            disabled={sending || (!input.trim() && !attachment)}
            className="bg-indigo-600 text-white p-2 w-11 h-11 rounded-full flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-indigo-200 flex-shrink-0"
          >
            <FaPaperPlane size={14} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default DoctorChatWindow;
