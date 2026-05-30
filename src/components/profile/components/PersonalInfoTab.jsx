import { FaPhone, FaMapMarkerAlt, FaEnvelope, FaSave } from 'react-icons/fa';
import { FormGroup, FormLabel } from './FormPrimitives';
import { inputStyles, primaryButtonStyles } from '../constants/styles';
import { useLanguage } from '../../../hooks/useLanguage';

const PersonalInfoTab = ({ formData, doctorData, onChange, onDoctorChange, onSave, isEditing, isSaving }) => {
  const isDoctor = formData.role === 'doctor';
  const { t, languages } = useLanguage();

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormGroup className="md:col-span-2">
          <FormLabel>{t('profile.language')}</FormLabel>
          <select
            name="languagePreference"
            className={inputStyles}
            value={formData.languagePreference || 'en'}
            onChange={onChange}
            disabled={!isEditing}
          >
            {languages.map((language) => (
              <option key={language.code} value={language.code}>{language.label}</option>
            ))}
          </select>
          <p className="mt-2 text-sm text-slate-500">{t('profile.languageHelp')}</p>
        </FormGroup>

        {/* Full Name */}
        <FormGroup>
          <FormLabel required>{t('profile.fullName')}</FormLabel>
          <input
            type="text"
            name="name"
            className={`${inputStyles} ${isEditing ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}
            value={formData.name}
            onChange={onChange}
            disabled={!isEditing}
            placeholder="Enter your full name"
          />
        </FormGroup>

        {/* Email */}
        <FormGroup>
          <FormLabel required>{t('profile.email')}</FormLabel>
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              name="email"
              className={`${inputStyles} pl-10 ${isEditing ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}
              value={formData.email}
              readOnly
              disabled
              placeholder="Enter your email"
            />
          </div>
        </FormGroup>

        {isDoctor ? (
          <>
            <FormGroup>
              <FormLabel>{t('profile.specialty')}</FormLabel>
              <input name="specialty" className={inputStyles} value={doctorData.specialty} onChange={onDoctorChange} disabled={!isEditing} placeholder="Cardiologist" />
            </FormGroup>

            <FormGroup>
              <FormLabel>{t('profile.experience')}</FormLabel>
              <input name="experience" className={inputStyles} value={doctorData.experience} onChange={onDoctorChange} disabled={!isEditing} placeholder="5 years" />
            </FormGroup>

            <FormGroup>
              <FormLabel>{t('profile.fee')}</FormLabel>
              <input type="number" name="fees" className={inputStyles} value={doctorData.fees} onChange={onDoctorChange} disabled={!isEditing} placeholder="500" />
            </FormGroup>

            <FormGroup>
              <FormLabel>{t('profile.clinicPhone')}</FormLabel>
              <div className="relative">
                <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input type="tel" name="phone" className={`${inputStyles} pl-10`} value={doctorData.phone} onChange={onDoctorChange} disabled={!isEditing} placeholder="+91 98765 43210" />
              </div>
            </FormGroup>

            <FormGroup>
              <FormLabel>{t('profile.location')}</FormLabel>
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input name="location" className={`${inputStyles} pl-10`} value={doctorData.location} onChange={onDoctorChange} disabled={!isEditing} placeholder="Clinic location" />
              </div>
            </FormGroup>

            <FormGroup>
              <FormLabel>{t('profile.availability')}</FormLabel>
              <select name="availability" className={inputStyles} value={doctorData.availability} onChange={onDoctorChange} disabled={!isEditing}>
                <option value="Available Today">Available Today</option>
                <option value="Tomorrow">Tomorrow</option>
                <option value="This Week">This Week</option>
                <option value="Not Available">Not Available</option>
              </select>
            </FormGroup>
          </>
        ) : (
          <>
            <FormGroup>
              <FormLabel>{t('profile.phone')}</FormLabel>
              <div className="relative">
                <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input type="tel" name="phone" className={`${inputStyles} pl-10`} value={formData.phone} onChange={onChange} disabled={!isEditing} placeholder="+91 98765 43210" />
              </div>
            </FormGroup>

            <FormGroup>
              <FormLabel>{t('profile.age')}</FormLabel>
              <input type="number" name="age" className={inputStyles} value={formData.age} onChange={onChange} disabled={!isEditing} placeholder="Enter your age" min="1" max="120" />
            </FormGroup>

            <FormGroup>
              <FormLabel>{t('profile.gender')}</FormLabel>
              <select name="gender" className={inputStyles} value={formData.gender} onChange={onChange} disabled={!isEditing}>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </FormGroup>

            <FormGroup>
              <FormLabel>{t('profile.bloodGroup')}</FormLabel>
              <select name="bloodGroup" className={inputStyles} value={formData.bloodGroup} onChange={onChange} disabled={!isEditing}>
                <option value="">Select Blood Group</option>
                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </FormGroup>

            <FormGroup>
              <FormLabel>{t('profile.emergencyContact')}</FormLabel>
              <div className="relative">
                <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input type="tel" name="emergencyContact" className={`${inputStyles} pl-10`} value={formData.emergencyContact} onChange={onChange} disabled={!isEditing} placeholder="+91 98765 43210" />
              </div>
            </FormGroup>

            <FormGroup>
              <FormLabel>{t('profile.occupation')}</FormLabel>
              <input type="text" name="occupation" className={inputStyles} value={formData.occupation} onChange={onChange} disabled={!isEditing} placeholder="Enter your occupation" />
            </FormGroup>

            <FormGroup className="md:col-span-2">
              <FormLabel>{t('profile.address')}</FormLabel>
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input type="text" name="address" className={`${inputStyles} pl-10`} value={formData.address} onChange={onChange} disabled={!isEditing} placeholder="Enter your address" />
              </div>
            </FormGroup>
          </>
        )}
      </div>

      {isEditing && (
        <button className={`${primaryButtonStyles} mt-8`} onClick={onSave} disabled={isSaving}>
          <FaSave /> {isSaving ? t('profile.saving') : t('profile.save')}
        </button>
      )}
    </div>
  );
};

export default PersonalInfoTab;
