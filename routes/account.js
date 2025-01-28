const express = require("express");
const { Account } = require("../model/Account");

const router = express.Router();

router.get("/balance", async (req, res) => {
  let account = await Account.findOne({
    userId: req.userId,
  });
  res.json({balance:account.balance})
});

router.post("/transfer",async(req,res)=>{
  const session = await mongoose.startSession();
  
  //start a transaction
  session.startTransaction();
  let toId = req.body.toId;
  let amount = req.body.amount;

  let sendingAccount = await Account.findOne({
    userId: req.userId,
  }).session(session);

  if (amount > sendingAccount.balance) {
    await session.abortTransaction();
    return res.status(400).json({
      message: "insufficent balance",
    });
  }

  let toAccount = await Account.findOne({
    userId: toId,
  }).session(session);

  if (!toAccount) {
    await session.abortTransaction();
    return res.status(400).json({
      message: "invalid user",
    });
  }

  await Account.updateOne(
    {
      userId: req.userId,
    },
    {
      $inc: {
        balance: -amount,
      },
    }
  ).session(session);

  await Account.updateOne(
    {
      userId: toId,
    },
    {
      $inc: {
        balance: amount,
      },
    }
  ).session(session);

  // Commit the transaction
  await session.commitTransaction();

  res.json({ message: "Transfer successful" });
})

module.exports = router;
