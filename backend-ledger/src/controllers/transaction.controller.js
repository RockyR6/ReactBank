const transactionModel = require("../Models/transaction.model");
const ledgerModel = require("../Models/ledger.model");
const accountModel = require("../Models/account.model");
const emailService = require("../services/email.service");
const mongoose = require("mongoose");


/* ------------------------------------------------ */
/* GET TRANSACTION HISTORY */
/* ------------------------------------------------ */

async function getTransactionHistory(req, res) {
  const { accountId } = req.params;

  try {

    const transactions = await transactionModel
      .find({
        $or: [{ fromAccount: accountId }, { toAccount: accountId }],
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({ transactions });

  } catch (error) {

    return res.status(500).json({
      message: "Failed to fetch transactions",
      error: error.message
    });

  }
}


/* ------------------------------------------------ */
/* CREATE MONEY TRANSFER */
/* ------------------------------------------------ */

async function createTransaction(req, res) {

  const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

  if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({
      message: "fromAccount, toAccount, amount and idempotencyKey are required",
    });
  }

  const fromUserAccount = await accountModel.findById(fromAccount);
  const toUserAccount = await accountModel.findById(toAccount);

  if (!fromUserAccount || !toUserAccount) {
    return res.status(400).json({
      message: "Invalid fromAccount or toAccount",
    });
  }

  /* Idempotency Check */

  const existingTransaction = await transactionModel.findOne({
    idempotencyKey,
  });

  if (existingTransaction) {

    if (existingTransaction.status === "COMPLETED") {
      return res.status(200).json({
        message: "Transaction already processed",
        transaction: existingTransaction,
      });
    }

    if (existingTransaction.status === "PENDING") {
      return res.status(200).json({
        message: "Transaction is still processing",
      });
    }

    if (existingTransaction.status === "FAILED") {
      return res.status(500).json({
        message: "Transaction processing failed, please retry",
      });
    }

    if (existingTransaction.status === "REVERSED") {
      return res.status(200).json({
        message: "Transaction was reversed, please retry",
      });
    }
  }

  /* Account status check */

  if (
    fromUserAccount.status !== "ACTIVE" ||
    toUserAccount.status !== "ACTIVE"
  ) {
    return res.status(400).json({
      message:
        "Both fromAccount and toAccount must be ACTIVE to process transaction",
    });
  }

  /* Balance check */

  const balance = await fromUserAccount.getBalance();

  if (balance < amount) {
    return res.status(400).json({
      message: `Insufficient balance. Current balance is ${balance}`,
    });
  }

  let session;

  try {

    session = await mongoose.startSession();
    session.startTransaction();

    /* Create transaction */

    const transactionArr = await transactionModel.create(
      [
        {
          fromAccount,
          toAccount,
          amount,
          idempotencyKey,
          status: "PENDING",
        },
      ],
      { session }
    );

    const transaction = transactionArr[0];

    /* Debit Ledger */

    await ledgerModel.create(
      [
        {
          account: fromAccount,
          transaction: transaction._id,
          type: "DEBIT",
          amount,
        },
      ],
      { session }
    );

    /* Credit Ledger */

    await ledgerModel.create(
      [
        {
          account: toAccount,
          transaction: transaction._id,
          type: "CREDIT",
          amount,
        },
      ],
      { session }
    );

    /* Mark completed */

    transaction.status = "COMPLETED";
    await transaction.save({ session });

    await session.commitTransaction();

    /* Email Notification (doesn't break transfer) */

    try {
      await emailService.sendTransactionEmail(
        req.user.email,
        req.user.name,
        amount,
        toUserAccount
      );
    } catch (emailError) {
      console.error(
        "Email failed but transaction succeeded:",
        emailError.message
      );
    }

    return res.status(200).json({
      message: "Transaction processed successfully",
      transaction,
    });

  } catch (error) {

    if (session) {
      await session.abortTransaction();
    }

    return res.status(500).json({
      message: "Transaction failed",
      error: error.message,
    });

  } finally {

    if (session) {
      session.endSession();
    }

  }
}


/* ------------------------------------------------ */
/* INITIAL FUNDS (SYSTEM DEPOSIT) */
/* ------------------------------------------------ */

async function createInitialFundsTransaction(req, res) {

  const { toAccount, amount, idempotencyKey } = req.body;

  if (!toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({
      message: "toAccount, amount and idempotencyKey are required",
    });
  }

  try {

    const toUserAccount = await accountModel.findById(toAccount);

    if (!toUserAccount) {
      return res.status(400).json({
        message: "Invalid toAccount",
      });
    }

    const fromUserAccount = await accountModel.findOne({
      user: req.user._id,
    });

    if (!fromUserAccount) {
      return res.status(400).json({
        message: "System account not found",
      });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    /* Create transaction */

    const transactionArr = await transactionModel.create(
      [
        {
          fromAccount: fromUserAccount._id,
          toAccount,
          amount,
          idempotencyKey,
          status: "PENDING",
        },
      ],
      { session }
    );

    const transaction = transactionArr[0];

    /* Debit */

    await ledgerModel.create(
      [
        {
          account: fromUserAccount._id,
          transaction: transaction._id,
          type: "DEBIT",
          amount,
        },
      ],
      { session }
    );

    /* Credit */

    await ledgerModel.create(
      [
        {
          account: toAccount,
          transaction: transaction._id,
          type: "CREDIT",
          amount,
        },
      ],
      { session }
    );

    /* FIX: Update same object */

    transaction.status = "COMPLETED";
    await transaction.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      message: "Initial funds transaction processed successfully",
      transaction,
    });

  } catch (error) {

    return res.status(500).json({
      message: "Initial funds transaction failed",
      error: error.message,
    });

  }
}


module.exports = {
  createTransaction,
  createInitialFundsTransaction,
  getTransactionHistory,
};