type Tab<T extends string> = {
  key: T;
  label: string;
};

type TabToggleProps<T extends string> = {
  tabs: Tab<T>[];
  activeTab: T;
  onChange: (tab: T) => void;
};

const TabToggle = <T extends string>({
  tabs,
  activeTab,
  onChange,
}: TabToggleProps<T>) => {
  const activeIndex = tabs.findIndex((t) => t.key === activeTab);

  return (
    <div className="relative flex bg-surface rounded-pill">
      {/* Sliding indicator */}
      <div
        className="absolute top-0 bottom-0 bg-brand rounded-pill animate-smooth"
        style={{
          width: `${100 / tabs.length}%`,
          transform: `translateX(${activeIndex * 100}%)`,
        }}
      />

      {/* Tab buttons */}
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`relative z-10 min-w-tab-btn py-3 rounded-pill
            text-sm font-medium animate-smooth cursor-pointer
            ${activeTab === tab.key ? 'text-white' : 'text-brand'}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabToggle;
