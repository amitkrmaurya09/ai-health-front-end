import { FaSave } from 'react-icons/fa';
import { FormGroup, FormLabel } from './FormPrimitives';
import { inputStyles, primaryButtonStyles } from '../constants/styles';

const MedicalHistoryTab = ({ formData, onChange, onSave, isEditing }) => {
  return (
    <div>
      <FormGroup>
        <FormLabel>Allergies</FormLabel>
        <textarea
          name="allergies"
          className={`${inputStyles} min-h-[140px] resize-none`}
          rows="5"
          value={formData.allergies}
          onChange={onChange}
          disabled={!isEditing}
          placeholder="List any known allergies (e.g., peanuts, shellfish, penicillin)..."
        />
      </FormGroup>

      <FormGroup>
        <FormLabel>Current Medications</FormLabel>
        <textarea
          name="medications"
          className={`${inputStyles} min-h-[140px] resize-none`}
          rows="5"
          value={formData.medications}
          onChange={onChange}
          disabled={!isEditing}
          placeholder="List current medications (e.g., Aspirin 100mg daily, Metformin 500mg twice daily)..."
        />
      </FormGroup>

      {isEditing && (
        <button className={`${primaryButtonStyles} mt-8`} onClick={onSave}>
          <FaSave /> Save Medical History
        </button>
      )}
    </div>
  );
};

export default MedicalHistoryTab;
