import PersonalInfoTab from './PersonalInfoTab';
import MedicalHistoryTab from './MedicalHistoryTab';
import SecurityTab from './SecurityTab';

const TabContent = ({
  activeTab,
  formData,
  passwordData,
  onChange,
  onPasswordChange,
  onSave,
  onPasswordUpdate,
  onDeleteAccount,
  isEditing,
}) => {
  const sharedProps = { formData, onChange, onSave, isEditing };

  switch (activeTab) {
    case 'personal':
      return <PersonalInfoTab {...sharedProps} />;
    case 'medical':
      return <MedicalHistoryTab {...sharedProps} />;
    case 'security':
      return (
        <SecurityTab
          passwordData={passwordData}
          onPasswordChange={onPasswordChange}
          onPasswordUpdate={onPasswordUpdate}
          onDeleteAccount={onDeleteAccount}
        />
      );
    default:
      return null;
  }
};

export default TabContent;
