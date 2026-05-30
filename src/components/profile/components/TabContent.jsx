import PersonalInfoTab from './PersonalInfoTab';
import MedicalHistoryTab from './MedicalHistoryTab';
const TabContent = ({
  activeTab,
  formData,
  doctorData,
  onChange,
  onDoctorChange,
  onSave,
  isEditing,
  isSaving,
  predictionHistory,
}) => {
  const sharedProps = { formData, doctorData, onChange, onDoctorChange, onSave, isEditing, isSaving };

  switch (activeTab) {
    case 'personal':
      return <PersonalInfoTab {...sharedProps} />;
    case 'medical':
      return <MedicalHistoryTab {...sharedProps} predictionHistory={predictionHistory} />;
    default:
      return null;
  }
};

export default TabContent;
