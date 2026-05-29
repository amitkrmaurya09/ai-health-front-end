import { FaCheck, FaPhone, FaMapMarkerAlt, FaEnvelope, FaSave } from 'react-icons/fa';
import { FormGroup, FormLabel } from './FormPrimitives';
import { inputStyles, primaryButtonStyles } from '../constants/styles';

const PersonalInfoTab = ({ formData, onChange, onSave, isEditing }) => {
  const autoSaveHint = isEditing && (
    <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
      <FaCheck size={10} /> Changes are saved automatically
    </p>
  );

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <FormGroup>
          <FormLabel required>Full Name</FormLabel>
          <input
            type="text"
            name="name"
            className={`${inputStyles} ${isEditing ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}
            value={formData.name}
            onChange={onChange}
            disabled={!isEditing}
            placeholder="Enter your full name"
          />
          {autoSaveHint}
        </FormGroup>

        {/* Email */}
        <FormGroup>
          <FormLabel required>Email</FormLabel>
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              name="email"
              className={`${inputStyles} pl-10 ${isEditing ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}
              value={formData.email}
              onChange={onChange}
              disabled={!isEditing}
              placeholder="Enter your email"
            />
          </div>
          {autoSaveHint}
        </FormGroup>

        {/* Phone */}
        <FormGroup>
          <FormLabel>Phone Number</FormLabel>
          <div className="relative">
            <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="tel"
              name="phone"
              className={`${inputStyles} pl-10`}
              value={formData.phone}
              onChange={onChange}
              disabled={!isEditing}
              placeholder="+1 234-567-8900"
            />
          </div>
        </FormGroup>

        {/* Age */}
        <FormGroup>
          <FormLabel>Age</FormLabel>
          <input
            type="number"
            name="age"
            className={inputStyles}
            value={formData.age}
            onChange={onChange}
            disabled={!isEditing}
            placeholder="Enter your age"
            min="1"
            max="120"
          />
        </FormGroup>

        {/* Gender */}
        <FormGroup>
          <FormLabel>Gender</FormLabel>
          <select name="gender" className={inputStyles} value={formData.gender} onChange={onChange} disabled={!isEditing}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </FormGroup>

        {/* Blood Group */}
        <FormGroup>
          <FormLabel>Blood Group</FormLabel>
          <select name="bloodGroup" className={inputStyles} value={formData.bloodGroup} onChange={onChange} disabled={!isEditing}>
            <option value="">Select Blood Group</option>
            {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
        </FormGroup>

        {/* Emergency Contact */}
        <FormGroup>
          <FormLabel>Emergency Contact</FormLabel>
          <div className="relative">
            <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="tel"
              name="emergencyContact"
              className={`${inputStyles} pl-10`}
              value={formData.emergencyContact}
              onChange={onChange}
              disabled={!isEditing}
              placeholder="+1 234-567-8900"
            />
          </div>
        </FormGroup>

        {/* Occupation */}
        <FormGroup>
          <FormLabel>Occupation</FormLabel>
          <input
            type="text"
            name="occupation"
            className={inputStyles}
            value={formData.occupation}
            onChange={onChange}
            disabled={!isEditing}
            placeholder="Enter your occupation"
          />
        </FormGroup>

        {/* Address */}
        <FormGroup className="md:col-span-2">
          <FormLabel>Address</FormLabel>
          <div className="relative">
            <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              name="address"
              className={`${inputStyles} pl-10`}
              value={formData.address}
              onChange={onChange}
              disabled={!isEditing}
              placeholder="Enter your address"
            />
          </div>
        </FormGroup>

        {/* Marital Status */}
        <FormGroup>
          <FormLabel>Marital Status</FormLabel>
          <select name="maritalStatus" className={inputStyles} value={formData.maritalStatus} onChange={onChange} disabled={!isEditing}>
            <option value="">Select Status</option>
            <option value="single">Single</option>
            <option value="married">Married</option>
            <option value="divorced">Divorced</option>
            <option value="widowed">Widowed</option>
          </select>
        </FormGroup>
      </div>

      {isEditing && (
        <button className={`${primaryButtonStyles} mt-8`} onClick={onSave}>
          <FaSave /> Save All Changes
        </button>
      )}
    </div>
  );
};

export default PersonalInfoTab;
