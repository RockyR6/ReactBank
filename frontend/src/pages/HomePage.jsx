import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAccounts } from "../features/accounts/account.slice";
import { useNavigate } from "react-router-dom";
import CreateAccountCard from "../components/CreateAccountCard";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("Dashboard");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchAccounts());
  }, [dispatch]);

  const navItems = [
    { label: "Dashboard", icon: HomeIcon },
    { label: "Accounts", icon: CreditCardIcon },
    { label: "Transfers", icon: ArrowsIcon },
    { label: "Payments", icon: ReceiptIcon },
    { label: "Analytics", icon: ChartIcon },
    { label: "Settings", icon: SettingsIcon },
  ];

  // Bottom nav: 5 key items for mobile
  const bottomNavItems = [
    { label: "Dashboard", icon: HomeIcon },
    { label: "Accounts", icon: CreditCardIcon },
    { label: "Transfers", icon: ArrowsIcon },
    { label: "Analytics", icon: ChartIcon },
    { label: "Settings", icon: SettingsIcon },
  ];

  const user = useSelector((state) => state.user.user);
  const { accounts, loading } = useSelector((state) => state.accounts);

  const totalBalance =
    accounts?.reduce((sum, acc) => sum + (acc.balance || 0), 0) || 0;

  return (
    <div
      className="min-h-screen bg-slate-950 flex"
      style={{ fontFamily: "'Georgia', serif" }}
    >
      {/* ── Desktop Sidebar ── */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800
          flex flex-col transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:relative lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-800">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #3b82f6, #1d4ed8)" }}
          >
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10l9-7 9 7v10a1 1 0 01-1 1H4a1 1 0 01-1-1V10z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 21V12h6v9" />
            </svg>
          </div>
          <span className="text-white text-lg font-bold tracking-wide">First Bank</span>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map(({ label, icon: Icon }) => (
            <button
              key={label}
              onClick={() => { setActiveNav(label); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                ${activeNav === label
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
            >
              <Icon active={activeNav === label} />
              {label}
            </button>
          ))}
        </nav>

        {/* User profile */}
        <div className="px-4 py-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{user?.firstname}</p>
              <p className="text-slate-500 text-xs truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Sidebar backdrop (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Main column ── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <header className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Hamburger — mobile only */}
            <button
              className="lg:hidden text-slate-400 hover:text-white transition-colors p-1"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-white font-bold text-base sm:text-lg leading-tight">
                {getGreeting()}, {user?.firstname?.toUpperCase() || "Guest"}
              </h1>
              <p className="text-slate-400 text-xs">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long", month: "short", day: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xs font-bold cursor-pointer flex-shrink-0">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <button
              className="text-slate-400 hover:text-white transition-colors p-1"
              onClick={() => navigate("/logout")}
              title="Sign out"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H3" />
              </svg>
            </button>
          </div>
        </header>

        {/* ── Scrollable content ──
            pb-24 on mobile to clear the fixed bottom nav bar */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 pb-24 lg:pb-6">

          {/* Summary banner */}
          <div className="bg-gradient-to-br from-blue-700 to-blue-950 rounded-2xl p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-blue-200 text-xs uppercase tracking-widest mb-1">Total Balance</p>
                {loading
                  ? <p className="text-white text-2xl font-bold">Loading…</p>
                  : <p className="text-white text-3xl sm:text-4xl font-bold">₹{totalBalance.toFixed(2)}</p>
                }
                <p className="text-blue-300 text-sm mt-1">
                  {accounts?.length || 0} account{accounts?.length !== 1 ? "s" : ""}
                </p>
              </div>
              <button
                className="w-full sm:w-auto bg-white text-blue-700 font-semibold text-sm px-5 py-3 sm:py-2.5 rounded-xl hover:bg-blue-50 active:scale-95 transition-all flex-shrink-0"
                onClick={() => navigate("/transfer")}
              >
                Transfer Money
              </button>
            </div>
          </div>

          {/* Account list */}
          <section>
            <h2 className="text-slate-400 text-xs uppercase tracking-widest mb-3">Your Accounts</h2>

            {loading ? (
              <div className="text-slate-400 text-sm py-8 text-center">Loading accounts…</div>
            ) : accounts?.length === 0 ? (
              <div className="text-slate-500 text-sm py-8 text-center">No accounts yet.</div>
            ) : (
              <div className="space-y-3">
                {accounts.map((acc) => (
                  <div
                    key={acc._id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl px-4 sm:px-5 py-4"
                  >
                    <div className="flex items-start sm:items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-slate-400 text-xs mb-0.5">Account ending in</p>
                        <p className="text-white font-semibold text-sm">•••• {acc._id.slice(-4)}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-slate-400 text-xs mb-0.5">Balance</p>
                        <p className="text-white font-bold text-lg">₹{acc.balance?.toFixed(2) || "0.00"}</p>
                      </div>
                    </div>
                    {/* Full-width on mobile, auto-width on larger screens */}
                    <button
                      className="mt-3 w-full sm:w-auto bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs font-medium px-4 py-2.5 sm:py-2 rounded-xl transition-all"
                      onClick={() => navigate(`/transactions/${acc._id}`)}
                    >
                      View Transactions
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Create account */}
          <section>
            <h2 className="text-slate-400 text-xs uppercase tracking-widest mb-3">Open a New Account</h2>
            <CreateAccountCard />
          </section>

        </div>

        {/* ── Mobile bottom navigation bar ── */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900 border-t border-slate-800 flex items-center justify-around px-1 py-2">
          {bottomNavItems.map(({ label, icon: Icon }) => (
            <button
              key={label}
              onClick={() => setActiveNav(label)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all duration-200 flex-1
                ${activeNav === label ? "text-blue-400" : "text-slate-500 hover:text-slate-300"}`}
            >
              <Icon active={activeNav === label} />
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          ))}
        </nav>

      </main>
    </div>
  );
}

// ── Icon components ──

function HomeIcon({ active }) {
  return (
    <svg className="w-5 h-5 flex-shrink-0" fill={active ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 10l9-7 9 7v10a1 1 0 01-1 1H4a1 1 0 01-1-1V10z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 21V12h6v9" />
    </svg>
  );
}
function CreditCardIcon({ active }) {
  return (
    <svg className="w-5 h-5 flex-shrink-0" fill={active ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  );
}
function ArrowsIcon({ active }) {
  return (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>
  );
}
function ReceiptIcon({ active }) {
  return (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  );
}
function ChartIcon({ active }) {
  return (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}
function SettingsIcon({ active }) {
  return (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}