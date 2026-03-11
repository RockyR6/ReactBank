import React from "react";

const TransactionList = ({ transactions, accountId }) => {
  if (!transactions?.length) return null;

  return (
    <div className="space-y-2">
      {transactions.map((tx) => {
        const isDebit = tx.fromAccount === accountId;
        const counterparty = isDebit ? tx.toAccount : tx.fromAccount;
        const date = new Date(tx.createdAt);

        const formattedDate = date.toLocaleDateString("en-IN", {
          day: "numeric", month: "short", year: "numeric",
        });
        const formattedTime = date.toLocaleTimeString("en-IN", {
          hour: "2-digit", minute: "2-digit",
        });

        const statusColors = {
          success:   "bg-emerald-900/40 text-emerald-400 border-emerald-800",
          pending:   "bg-amber-900/40  text-amber-400  border-amber-800",
          failed:    "bg-red-900/40    text-red-400    border-red-800",
        };
        const statusStyle =
          statusColors[tx.status?.toLowerCase()] ||
          "bg-slate-800 text-slate-400 border-slate-700";

        return (
          <div
            key={tx._id}
            className="bg-slate-900 border border-slate-800 rounded-2xl px-4 sm:px-5 py-4 flex items-center gap-4 hover:border-slate-700 transition-colors"
          >
            {/* Icon */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                isDebit
                  ? "bg-red-900/40 border border-red-800"
                  : "bg-emerald-900/40 border border-emerald-800"
              }`}
            >
              {isDebit ? (
                <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7M12 3v18" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              )}
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-white text-sm font-semibold">
                  {isDebit ? "Money Sent" : "Money Received"}
                </p>
                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-full border capitalize ${statusStyle}`}
                >
                  {tx.status}
                </span>
              </div>
              <p className="text-slate-500 text-xs truncate mt-0.5">
                {isDebit ? "To" : "From"}:{" "}
                <span className="text-slate-400">•••• {counterparty?.slice(-6)}</span>
              </p>
              <p className="text-slate-600 text-xs mt-0.5">
                {formattedDate} · {formattedTime}
              </p>
            </div>

            {/* Amount */}
            <div className="text-right flex-shrink-0">
              <p
                className={`font-bold text-base ${
                  isDebit ? "text-red-400" : "text-emerald-400"
                }`}
              >
                {isDebit ? "−" : "+"} ₹{Number(tx.amount).toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TransactionList;