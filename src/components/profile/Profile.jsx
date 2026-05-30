import { FaEdit, FaCheck, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useProfile } from './hooks/useProfile';
import Notification from './components/Notification';
import ProfileHeader from './components/ProfileHeader';
import TabNavigation from './components/TabNavigation';
import TabContent from './components/TabContent';
import { useLanguage } from '../../hooks/useLanguage';
import { useAuth } from '../../hooks/useAuth';

const Profile = () => {
  const { t } = useLanguage();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const {
    formData,
    doctorData,
    profilePicture,
    isEditing,
    setIsEditing,
    activeTab,
    setActiveTab,
    notification,
    setNotification,
    fileInputRef,
    user,
    predictionHistory,
    isSaving,
    handleChange,
    handleDoctorChange,
    handleSave,
    handleProfilePictureChange,
    handleRemoveProfilePicture,
  } = useProfile();

  const handleLogout = async () => {
    navigate('/login');
    await logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-8">
      <Notification notification={notification} onDismiss={() => setNotification(null)} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {t('profile.title')}
            </h1>
            <p className="text-slate-600 mt-2">{t('profile.subtitle')}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="px-5 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 bg-white text-red-600 border border-red-100 hover:bg-red-50 shadow-sm"
            >
              <FaSignOutAlt /> {t('nav.logout')}
            </button>
            <button
              onClick={() => {
                if (isEditing) {
                  handleSave();
                } else {
                  setIsEditing(true);
                }
              }}
              disabled={isSaving}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${isEditing
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                }`}
            >
              {isEditing ? <FaCheck /> : <FaEdit />}
              {isSaving ? t('profile.saving') : isEditing ? t('profile.save') : t('profile.edit')}
            </button>
          </div>
        </div>

        <ProfileHeader
          user={user}
          formData={formData}
          doctorData={doctorData}
          profilePicture={profilePicture}
          onPictureChange={handleProfilePictureChange}
          onRemovePicture={handleRemoveProfilePicture}
          isEditing={isEditing}
          fileInputRef={fileInputRef}
        />

        <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200">
          <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="p-8 bg-gradient-to-b from-white to-slate-50/30">
            <TabContent
              activeTab={activeTab}
              formData={formData}
              doctorData={doctorData}
              onChange={handleChange}
              onDoctorChange={handleDoctorChange}
              onSave={handleSave}
              isEditing={isEditing}
              isSaving={isSaving}
              predictionHistory={predictionHistory}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
