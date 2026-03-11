import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactionHistory } from "../features/transction/transctionSlice";
import TransactionList from "../components/TransactionList";
import { useNavigate, useParams } from "react-router-dom";

const TransactionsPage = () => {
  const dispatch = useDispatch();
  const { accountId } = useParams();
  const navigate = useNavigate();

  const { transactions, loading } = useSelector((state) => state.transactions);

  useEffect(() => {
    if (accountId) {
      dispatch(fetchTransactionHistory(accountId));
    }
  }, [dispatch, accountId]);

  const credits = transactions?.filter((t) => t.toAccount === accountId) || [];
  const debits = transactions?.filter((t) => t.fromAccount === accountId) || [];
  const totalIn = credits.reduce((s, t) => s + (t.amount || 0), 0);
  const totalOut = debits.reduce((s, t) => s + (t.amount || 0), 0);

  return (
    <div
      className="min-h-screen bg-slate-950"
      style={{ fontFamily: "'Georgia', serif" }}
    >
      {/* Top bar */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-4 flex items-center gap-4 sticky top-0 z-10">
        <button
          onClick={() => navigate("/")}
          className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-all flex-shrink-0"
          aria-label="Back"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex-1 min-w-0">
          <h1 className="text-white font-bold text-base sm:text-lg leading-tight">
            Transaction History
          </h1>
          <p className="text-slate-500 text-xs truncate">
            Account •••• {accountId?.slice(-6)}
          </p>
        </div>

        {/* Bank logo */}
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #3b82f6, #1d4ed8)" }}
        >
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10l9-7 9 7v10a1 1 0 01-1 1H4a1 1 0 01-1-1V10z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 21V12h6v9" />
          </svg>
        </div>
      </header>

      <div className="px-4 sm:px-6 py-6 space-y-5 max-w-2xl mx-auto pb-24 sm:pb-8">

        {/* Summary cards */}
        {!loading && transactions?.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {/* Total transactions */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-1">
              <p className="text-slate-500 text-xs uppercase tracking-wider">Total</p>
              <p className="text-white font-bold text-xl">{transactions.length}</p>
              <p className="text-slate-500 text-xs">transactions</p>
            </div>

            {/* Money in */}
            <div className="bg-slate-900 border border-emerald-900/50 rounded-2xl p-4 flex flex-col gap-1">
              <p className="text-emerald-500 text-xs uppercase tracking-wider flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                In
              </p>
              <p className="text-emerald-400 font-bold text-lg">₹{totalIn.toFixed(0)}</p>
              <p className="text-slate-500 text-xs">{credits.length} credits</p>
            </div>

            {/* Money out */}
            <div className="bg-slate-900 border border-red-900/50 rounded-2xl p-4 flex flex-col gap-1">
              <p className="text-red-400 text-xs uppercase tracking-wider flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7M12 3v18" />
                </svg>
                Out
              </p>
              <p className="text-red-400 font-bold text-lg">₹{totalOut.toFixed(0)}</p>
              <p className="text-slate-500 text-xs">{debits.length} debits</p>
            </div>
          </div>
        )}

        {/* Transaction list section */}
        <div>
          <h2 className="text-slate-400 text-xs uppercase tracking-widest mb-3">
            All Transactions
          </h2>

          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 flex items-center gap-4 animate-pulse"
                >
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-slate-800 rounded w-1/2" />
                    <div className="h-3 bg-slate-800 rounded w-1/3" />
                  </div>
                  <div className="h-4 bg-slate-800 rounded w-16" />
                </div>
              ))}
            </div>
          ) : transactions?.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl px-6 py-14 flex flex-col items-center gap-3 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-1">
                <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-white font-semibold text-sm">No transactions yet</p>
              <p className="text-slate-500 text-xs max-w-xs">
                Your transaction history will appear here once you make a transfer.
              </p>
              <button
                onClick={() => navigate("/transfer")}
                className="mt-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium px-5 py-2.5 rounded-xl transition-colors"
              >
                Make a Transfer
              </button>
            </div>
          ) : (
            <TransactionList transactions={transactions} accountId={accountId} />
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;