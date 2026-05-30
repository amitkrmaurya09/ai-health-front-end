import { FaBriefcaseMedical, FaCamera, FaEnvelope, FaMapMarkerAlt, FaPhone, FaTimes, FaUserInjured } from 'react-icons/fa';
import { useLanguage } from '../../../hooks/useLanguage';

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 rounded-lg bg-white/10 px-4 py-3 text-left">
    <span className="text-white/80">{icon}</span>
    <div>
      <div className="text-xs uppercase tracking-wide text-white/60">{label}</div>
      <div className="text-sm font-semibold text-white">{value || 'Not added'}</div>
    </div>
  </div>
);

const ProfileHeader = ({ user, formData, doctorData, profilePicture, onPictureChange, onRemovePicture, isEditing, fileInputRef }) => {
  const { t } = useLanguage();
  const isDoctor = user?.role === 'doctor';
  const roleLabel = isDoctor ? t('profile.doctorProfile') : t('profile.patientProfile');
  const roleIcon = isDoctor ? <FaBriefcaseMedical /> : <FaUserInjured />;

  return (
    <div className="bg-slate-950 rounded-2xl shadow-xl p-8 mb-8 text-white relative overflow-hidden">
      <div className="relative flex flex-col md:flex-row items-center gap-8">
        <div className="relative group">
          <div className="w-32 h-32 rounded-2xl overflow-hidden bg-gradient-to-br from-cyan-500 to-blue-600 flex-shrink-0 flex items-center justify-center shadow-2xl border border-white/20">
            {profilePicture ? (
              <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-5xl font-bold text-white">
                {user?.name?.charAt(0).toUpperCase() || 'J'}
              </span>
            )}
          </div>

          {isEditing && (
            <div className="absolute inset-0 bg-slate-950/70 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-white text-blue-600 p-4 rounded-xl hover:bg-blue-50 transition-all duration-300 shadow-xl transform hover:scale-105"
              >
                <FaCamera size={20} />
              </button>
            </div>
          )}

          {profilePicture && isEditing && (
            <button
              onClick={onRemovePicture}
              className="absolute -top-3 -right-3 bg-red-500 text-white p-3 rounded-xl hover:bg-red-600 transition-all duration-300 shadow-xl transform hover:scale-105"
            >
              <FaTimes size={16} />
            </button>
          )}
        </div>

        <input ref={fileInputRef} type="file" accept="image/*" onChange={onPictureChange} className="hidden" />

        <div className="flex-grow text-center md:text-left">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-cyan-400/15 px-4 py-2 text-sm font-semibold text-cyan-100">
            {roleIcon}
            {roleLabel}
          </div>
          <h2 className="text-4xl font-bold text-white mb-3">{user?.name}</h2>
          <p className="text-slate-300 text-lg mb-6 flex items-center justify-center md:justify-start gap-3">
            <FaEnvelope className="text-cyan-200" />
            {user?.email}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto md:mx-0">
            {isDoctor ? (
              <>
                <InfoItem icon={<FaBriefcaseMedical />} label={t('profile.specialty')} value={doctorData?.specialty} />
                <InfoItem icon={<FaPhone />} label={t('profile.clinicPhone')} value={doctorData?.phone || formData?.phone} />
                <InfoItem icon={<FaMapMarkerAlt />} label={t('profile.location')} value={doctorData?.location} />
              </>
            ) : (
              <>
                <InfoItem icon={<FaPhone />} label={t('profile.phone')} value={formData?.phone} />
                <InfoItem icon={<FaUserInjured />} label={t('profile.bloodGroup')} value={formData?.bloodGroup} />
                <InfoItem icon={<FaMapMarkerAlt />} label={t('profile.emergencyContact')} value={formData?.emergencyContact} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
