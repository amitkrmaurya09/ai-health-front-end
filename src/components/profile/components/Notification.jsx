import { FaTimes } from 'react-icons/fa';

const Notification = ({ notification, onDismiss }) => {
  if (!notification) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 bg-white rounded-xl shadow-xl p-4 flex items-center gap-3 animate-slide-in border-l-4 ${
        notification.type === 'success' ? 'border-emerald-500' : 'border-red-500'
      }`}
    >
      <span className="text-gray-700 font-medium">{notification.message}</span>
      <button onClick={onDismiss} className="text-gray-400 hover:text-gray-600 transition-colors">
        <FaTimes />
      </button>
    </div>
  );
};

export default Notification;
