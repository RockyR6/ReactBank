import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { v4 as uuidv4 } from "uuid";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const TransferMoney = () => {
  const { accounts } = useSelector((state) => state.accounts);

  const [fromAccount, setFromAccount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const selectedAccount = accounts?.find((a) => a._id === fromAccount);

  const handleTransfer = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post(
        "/api/transactions",
        { fromAccount, toAccount, amount, idempotencyKey: uuidv4() },
        { withCredentials: true }
      );
      setFromAccount("");
      setToAccount("");
      setAmount("");
      toast.success("Transfer successful!");
    } catch (error) {
      console.error("Transfer failed", error);
      toast.error(
        "Transfer failed: " + (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4"
      style={{ fontFamily: "'Georgia', serif" }}
    >
      {/* Card */}
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">

        {/* Card header */}
        <div
          className="px-6 py-8 flex flex-col gap-1"
          style={{ background: "linear-gradient(135deg, #1d4ed8 0%, #1e3a5f 100%)" }}
        >
          <div className="flex items-center justify-between mb-2">
            {/* Bank logo mark */}
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <span className="text-white/60 text-xs uppercase tracking-widest font-medium">First Bank</span>
          </div>
          <h1 className="text-white text-2xl font-bold">Send Money</h1>
          <p className="text-blue-200 text-sm">Transfer funds between accounts instantly</p>
        </div>

        {/* Form body */}
        <form onSubmit={handleTransfer} className="px-6 py-6 space-y-5">

          {/* From account */}
          <div className="space-y-1.5">
            <label className="text-slate-400 text-xs uppercase tracking-widest font-medium">
              From Account
            </label>
            <div className="relative">
              <select
                value={fromAccount}
                onChange={(e) => setFromAccount(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-xl px-4 py-3 pr-10 appearance-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors cursor-pointer"
              >
                <option value="" disabled>Select your account</option>
                {accounts?.map((acc) => (
                  <option key={acc._id} value={acc._id}>
                    •••• {acc._id.slice(-4)} — ₹{acc.balance?.toFixed(2)}
                  </option>
                ))}
              </select>
              {/* Chevron */}
              <svg className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Available balance pill */}
            {selectedAccount && (
              <p className="text-xs text-slate-500 pl-1">
                Available:{" "}
                <span className="text-blue-400 font-medium">
                  ₹{selectedAccount.balance?.toFixed(2)}
                </span>
              </p>
            )}
          </div>

          {/* Arrow divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-800" />
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          {/* To account */}
          <div className="space-y-1.5">
            <label className="text-slate-400 text-xs uppercase tracking-widest font-medium">
              To Account ID
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                value={toAccount}
                onChange={(e) => setToAccount(e.target.value)}
                type="text"
                placeholder="Enter receiver account ID"
                required
                className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-xl pl-10 pr-4 py-3 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <label className="text-slate-400 text-xs uppercase tracking-widest font-medium">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm pointer-events-none">
                ₹
              </span>
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
                placeholder="0.00"
                min="1"
                required
                className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-xl pl-8 pr-4 py-3 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-white font-semibold text-sm transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{ background: loading ? "#1e3a5f" : "linear-gradient(135deg, #3b82f6, #1d4ed8)" }}
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Processing…
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4" />
                </svg>
                Transfer Money
              </>
            )}
          </button>
        </form>

        {/* Footer link */}
        <div className="px-6 pb-6">
          <button
            onClick={() => navigate("/")}
            className="w-full py-3 rounded-xl text-slate-400 hover:text-white text-sm font-medium border border-slate-800 hover:border-slate-600 hover:bg-slate-800 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
        </div>

      </div>

      {/* Subtle notice */}
      <p className="text-slate-600 text-xs mt-6 text-center">
        Transfers are processed instantly and cannot be reversed.
      </p>
    </div>
  );
};

export default TransferMoney;