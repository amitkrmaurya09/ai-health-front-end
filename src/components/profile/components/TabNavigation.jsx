import { useLanguage } from '../../../hooks/useLanguage';

const TABS = [
  { id: 'personal', labelKey: 'profile.info' },
  { id: 'medical', labelKey: 'profile.history' },
];

const TabNavigation = ({ activeTab, setActiveTab }) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-wrap gap-3 p-8 border-b border-slate-200 bg-gradient-to-r from-slate-50/50 to-white">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`py-3 px-6 font-semibold text-sm rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            activeTab === tab.id
              ? 'text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg'
              : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
          }`}
        >
          {t(tab.labelKey)}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;
