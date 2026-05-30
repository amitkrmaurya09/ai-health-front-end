import { FaSave } from 'react-icons/fa';
import { FormGroup, FormLabel } from './FormPrimitives';
import { inputStyles, primaryButtonStyles } from '../constants/styles';
import { useLanguage } from '../../../hooks/useLanguage';

const MedicalHistoryTab = ({ formData, onChange, onSave, isEditing, predictionHistory = [] }) => {
  const isPatient = formData.role !== 'doctor';
  const { t } = useLanguage();

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormGroup>
          <FormLabel>{t('profile.previousDiseases')}</FormLabel>
          <textarea
            name="previousDiseases"
            className={`${inputStyles} min-h-[120px] resize-none`}
            rows="4"
            value={formData.previousDiseases}
            onChange={onChange}
            disabled={!isEditing}
            placeholder="Diabetes, asthma, dengue, surgery history..."
          />
        </FormGroup>

        <FormGroup>
          <FormLabel>{t('profile.currentDisease')}</FormLabel>
          <textarea
            name="currentDisease"
            className={`${inputStyles} min-h-[120px] resize-none`}
            rows="4"
            value={formData.currentDisease}
            onChange={onChange}
            disabled={!isEditing}
            placeholder="Fever since 2 days, chest pain, migraine..."
          />
        </FormGroup>

        <FormGroup>
          <FormLabel>{t('profile.heartRate')}</FormLabel>
          <textarea
            name="sevenDayHeartRate"
            className={`${inputStyles} min-h-[120px] resize-none`}
            rows="4"
            value={formData.sevenDayHeartRate}
            onChange={onChange}
            disabled={!isEditing}
            placeholder="Mon 78, Tue 82, Wed 80..."
          />
        </FormGroup>

        <FormGroup>
          <FormLabel>{t('profile.bp')}</FormLabel>
          <textarea
            name="bloodPressure"
            className={`${inputStyles} min-h-[120px] resize-none`}
            rows="4"
            value={formData.bloodPressure}
            onChange={onChange}
            disabled={!isEditing}
            placeholder="120/80 morning, 128/84 evening..."
          />
        </FormGroup>

        <FormGroup>
          <FormLabel>{t('profile.medicines')}</FormLabel>
          <textarea
            name="medicines"
            className={`${inputStyles} min-h-[120px] resize-none`}
            rows="4"
            value={formData.medicines}
            onChange={onChange}
            disabled={!isEditing}
            placeholder="Medicine name, dose, timing..."
          />
        </FormGroup>

        <FormGroup>
          <FormLabel>{t('profile.allergies')}</FormLabel>
          <textarea
            name="allergies"
            className={`${inputStyles} min-h-[120px] resize-none`}
            rows="4"
            value={formData.allergies}
            onChange={onChange}
            disabled={!isEditing}
            placeholder="Food, medicine, dust, pollen..."
          />
        </FormGroup>
      </div>

      {isEditing && (
        <button className={`${primaryButtonStyles} mt-4`} onClick={onSave}>
          <FaSave /> {t('profile.saveHistory')}
        </button>
      )}

      {isPatient && predictionHistory.length > 0 && (
        <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Symptom Check Log</h3>
          <div className="space-y-4">
            {predictionHistory.map((item) => (
              <div key={item._id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <div className="text-sm text-slate-500">Checked on {new Date(item.createdAt).toLocaleDateString()}</div>
                    <div className="text-lg font-semibold text-slate-900">{item.topPrediction?.disease || 'Unknown'}</div>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-emerald-100 text-emerald-700 px-3 py-1">
                      Confidence: {item.topPrediction?.confidence ?? 0}%
                    </span>
                    <span className="rounded-full bg-amber-100 text-amber-700 px-3 py-1">
                      Urgency: {item.topPrediction?.urgency || 'Low'}
                    </span>
                  </div>
                </div>
                <div className="mt-3 text-sm text-slate-600">
                  <strong>Symptoms:</strong> {item.symptoms?.join(', ') || 'No symptoms recorded'}
                </div>
                {item.recommendations?.length > 0 && (
                  <div className="mt-3 text-sm text-slate-700">
                    <strong>Recommendations:</strong>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      {item.recommendations.map((rec, idx) => (
                        <li key={idx}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalHistoryTab;
