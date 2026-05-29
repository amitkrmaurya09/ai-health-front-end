import { FaLock, FaTrash } from 'react-icons/fa';
import { FormGroup, FormLabel } from './FormPrimitives';
import { inputStyles, primaryButtonStyles, dangerButtonStyles } from '../constants/styles';

const PasswordField = ({ label, name, value, onChange, placeholder }) => (
  <FormGroup>
    <FormLabel>{label}</FormLabel>
    <div className="relative">
      <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
      <input
        type="password"
        name={name}
        className={`${inputStyles} pl-10`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  </FormGroup>
);

const SecurityTab = ({ passwordData, onPasswordChange, onPasswordUpdate, onDeleteAccount }) => {
  return (
    <div className="max-w-2xl">
      <div className="bg-blue-50/50 rounded-xl p-6 mb-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Security Settings</h3>
        <p className="text-blue-700">Update your password and manage your account security</p>
      </div>

      <div className="space-y-6">
        <PasswordField
          label="Current Password"
          name="currentPassword"
          value={passwordData.currentPassword}
          onChange={onPasswordChange}
          placeholder="Enter current password"
        />
        <PasswordField
          label="New Password"
          name="newPassword"
          value={passwordData.newPassword}
          onChange={onPasswordChange}
          placeholder="Enter new password"
        />
        <PasswordField
          label="Confirm New Password"
          name="confirmPassword"
          value={passwordData.confirmPassword}
          onChange={onPasswordChange}
          placeholder="Confirm new password"
        />

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-6 border-t border-slate-200">
          <button className={primaryButtonStyles} onClick={onPasswordUpdate}>
            <FaLock /> Update Password
          </button>
          <button className={dangerButtonStyles} onClick={onDeleteAccount}>
            <FaTrash /> Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecurityTab;
