import { FaEdit, FaCheck } from 'react-icons/fa';
import { useProfile } from './hooks/useProfile';
import Notification from './components/Notification';
import ProfileHeader from './components/ProfileHeader';
import TabNavigation from './components/TabNavigation';
import TabContent from './components/TabContent';

const Profile = () => {
  const {
    formData,
    profilePicture,
    isEditing,
    setIsEditing,
    activeTab,
    setActiveTab,
    notification,
    setNotification,
    passwordData,
    fileInputRef,
    user,
    handleChange,
    handleSave,
    handlePasswordChange,
    handlePasswordUpdate,
    handleProfilePictureChange,
    handleRemoveProfilePicture,
    handleDeleteAccount,
  } = useProfile();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-8">
      <Notification notification={notification} onDismiss={() => setNotification(null)} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              My Profile
            </h1>
            <p className="text-slate-600 mt-2">Manage your personal and medical information</p>
          </div>
          <button
            onClick={() => setIsEditing((prev) => !prev)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
              isEditing
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
            }`}
          >
            {isEditing ? <FaCheck /> : <FaEdit />}
            {isEditing ? 'View Mode' : 'Edit Mode'}
          </button>
        </div>

        <ProfileHeader
          user={user}
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
              passwordData={passwordData}
              onChange={handleChange}
              onPasswordChange={handlePasswordChange}
              onSave={handleSave}
              onPasswordUpdate={handlePasswordUpdate}
              onDeleteAccount={handleDeleteAccount}
              isEditing={isEditing}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
