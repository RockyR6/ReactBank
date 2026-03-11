import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../features/user/userSlice";

const LogoutPage = () => {
  const { loading, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.error("Error occurred while logging out:", error);
    }
  };

  return (
    <div
      className="min-h-screen bg-slate-950 flex items-center justify-center p-4"
      style={{ fontFamily: "'Georgia', serif" }}
    >
      <div className="w-full max-w-sm">

        {/* Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">

          {/* Header strip */}
          <div
            className="px-6 py-6 flex items-center gap-3"
            style={{ background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)" }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #3b82f6, #1d4ed8)" }}
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10l9-7 9 7v10a1 1 0 01-1 1H4a1 1 0 01-1-1V10z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 21V12h6v9" />
              </svg>
            </div>
            <span className="text-white font-bold text-lg tracking-wide">First Bank</span>
          </div>

          {/* Body */}
          <div className="px-6 py-8 flex flex-col items-center text-center gap-4">

            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>

            {/* Text */}
            <div className="space-y-1">
              <h1 className="text-white text-xl font-bold">Sign out?</h1>
              {user?.firstname && (
                <p className="text-slate-400 text-sm">
                  You're signed in as{" "}
                  <span className="text-slate-200 font-medium">{user.firstname}</span>
                </p>
              )}
              <p className="text-slate-500 text-xs pt-1">
                You'll need to sign back in to access your accounts.
              </p>
            </div>

            {/* Actions */}
            <div className="w-full space-y-3 pt-2">
              <button
                disabled={loading}
                onClick={handleLogout}
                className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ background: loading ? "#1e3a5f" : "linear-gradient(135deg, #ef4444, #b91c1c)" }}
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Signing out…
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" />
                    </svg>
                    Yes, sign me out
                  </>
                )}
              </button>

              <button
                disabled={loading}
                onClick={() => navigate("/")}
                className="w-full py-3 rounded-xl text-slate-400 hover:text-white text-sm font-medium border border-slate-800 hover:border-slate-600 hover:bg-slate-800 transition-all duration-200 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

        <p className="text-slate-600 text-xs text-center mt-5">
          Your session data will be cleared on sign out.
        </p>
      </div>
    </div>
  );
};

export default LogoutPage;