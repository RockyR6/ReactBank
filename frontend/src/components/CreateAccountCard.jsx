import { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { createAccount } from "../features/accounts/account.slice";

export default function CreateAccountCard() {
  const [clicked, setClicked] = useState(false);
  const { loading } = useSelector((state) => state.accounts);
  const dispatch = useDispatch();

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createAccount()).unwrap();
      toast.success("Account created successfully");
    } catch (error) {
      console.error("Failed to create account", error);
      toast.error(
        "Failed to create account: " +
          (error.response?.data?.message || error.message)
      );
    }
    setClicked(true);
    setTimeout(() => setClicked(false), 600);
  };

  return (
    <div className="relative rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden px-5 py-5 flex items-center gap-4">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500" />

      {/* Icon */}
      <div className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0">
        <svg
          className="w-5 h-5 text-violet-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4v16m8-8H4"
          />
        </svg>
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-semibold">Open a new account</p>
        <p className="text-slate-500 text-xs mt-0.5">
          Free to create, instant activation
        </p>
      </div>

      {/* Button */}
      <button
        disabled={loading}
        onClick={handleClick}
        className={`
          flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-xs font-semibold
          transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed
          ${clicked ? "scale-95" : ""}
        `}
        style={{
          background: "linear-gradient(135deg, #7c3aed, #a21caf)",
        }}
      >
        {loading ? (
          <>
            <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Creating…
          </>
        ) : (
          <>
            Create
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </>
        )}
      </button>
    </div>
  );
}