"use client";

export default function SettingsSidebar({ tabs, activeTab, onChange }) {
  return (
    <>
      <aside className="hidden rounded-2xl border border-[#E2E8F0] bg-white p-2 shadow-[0_16px_45px_rgba(15,23,42,0.05)] lg:block">
        <nav className="grid gap-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = tab.id === activeTab;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onChange(tab.id)}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                  active
                    ? "bg-[#EAF5FF] text-[#2E95F7] shadow-[0_10px_24px_rgba(77,168,255,0.12)]"
                    : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                }`}
              >
                <Icon size={18} strokeWidth={2.3} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      <div className="-mx-4 overflow-x-auto px-4 pb-1 lg:hidden">
        <div className="flex min-w-max gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = tab.id === activeTab;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onChange(tab.id)}
                className={`flex h-11 items-center gap-2 rounded-2xl border px-4 text-sm font-semibold transition ${
                  active
                    ? "border-[#4DA8FF] bg-[#EAF5FF] text-[#2E95F7]"
                    : "border-[#E2E8F0] bg-white text-[#64748B]"
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
