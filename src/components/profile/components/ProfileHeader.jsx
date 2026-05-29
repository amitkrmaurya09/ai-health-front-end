import { FaCamera, FaTimes, FaEnvelope } from 'react-icons/fa';

const ProfileHeader = ({ user, profilePicture, onPictureChange, onRemovePicture, isEditing, fileInputRef }) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 mb-8 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full -ml-24 -mb-24" />
      </div>

      <div className="relative flex flex-col md:flex-row items-center gap-8">
        {/* Avatar */}
        <div className="relative group">
          <div className="w-36 h-36 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 flex-shrink-0 flex items-center justify-center shadow-2xl border-4 border-white/30">
            {profilePicture ? (
              <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-6xl font-bold text-white">
                {user?.name?.charAt(0).toUpperCase() || 'J'}
              </span>
            )}
          </div>

          {isEditing && (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 to-blue-700/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-white text-blue-600 p-4 rounded-full hover:bg-blue-50 transition-all duration-300 shadow-xl transform hover:scale-110"
              >
                <FaCamera size={20} />
              </button>
            </div>
          )}

          {profilePicture && isEditing && (
            <button
              onClick={onRemovePicture}
              className="absolute -top-3 -right-3 bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-all duration-300 shadow-xl transform hover:scale-110"
            >
              <FaTimes size={16} />
            </button>
          )}
        </div>

        <input ref={fileInputRef} type="file" accept="image/*" onChange={onPictureChange} className="hidden" />

        {/* User info + stats */}
        <div className="flex-grow text-center md:text-left">
          <h2 className="text-4xl font-bold text-white mb-3">{user?.name}</h2>
          <p className="text-blue-100 text-lg mb-8 flex items-center justify-center md:justify-start gap-3">
            <FaEnvelope className="text-blue-200" />
            {user?.email}
          </p>

          <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto md:mx-0">
            {[
              { value: '12', label: 'Predictions' },
              { value: '94%', label: 'Accuracy' },
              { value: '85', label: 'Health Score' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-3xl font-bold text-white">{value}</div>
                <div className="text-sm font-medium text-blue-100 uppercase tracking-wider">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
