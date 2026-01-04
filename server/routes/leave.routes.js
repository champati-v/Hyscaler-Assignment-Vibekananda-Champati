const express = require("express");
const pool = require("../db.js");
const { protect } = require("../middleware/auth.middleware.js");

const leaveRoutes = express.Router();

// request leave by employee
leaveRoutes.post("/request", protect, async (req, res) => {
  const { leave_type, start_date, end_date, reason } = req.body;

  if(req.user.role !== "employee") {
    return res.status(403).json({ message: "Access denied" });
  }

  const leaveDaysRequested = (new Date(end_date) - new Date(start_date)) / (1000 * 60 * 60 * 24) + 1;

  const balanceLeaves = await pool.query(
    "SELECT * FROM leave_balances WHERE user_id=$1",
    [req.user.id]
  );

  //check if user is eligible for leaves
  const balance = balanceLeaves.rows[0];

  if(leave_type === "vacation" && balance.vacation_days < leaveDaysRequested) {
    return res.status(400).json({ message: "Insufficient vacation days" });
  } else if(leave_type === "sick" && balance.sick_days < leaveDaysRequested) {
    return res.status(400).json({ message: "Insufficient sick days" });
  } 

  await pool.query(
    `INSERT INTO leaves (user_id, leave_type, start_date, end_date, reason)
     VALUES ($1,$2,$3,$4,$5)`,
    [req.user.id, leave_type, start_date, end_date, reason]
  );

  res.json({ message: `Leave request submitted from ${start_date} to ${end_date}` });
});

//employee view their leave requests
leaveRoutes.get('/my', protect, async (req, res) => {
    if(req.user.role !== "employee") {
        return res.status(403).json({ message: "Access denied" });
    }

    const leaves = await pool.query(
        "SELECT * FROM leaves WHERE user_id=$1 ORDER BY created_at DESC",
        [req.user.id]
    );

    res.json(leaves.rows);
});

//employee view their leave balance
leaveRoutes.get('/balance', protect, async (req, res) => {
    if(req.user.role !== "employee") {
        return res.status(403).json({ message: "Access denied" });
    }

    const balanceRes = await pool.query(
        "SELECT * FROM leave_balances WHERE user_id=$1",
        [req.user.id]
    );

    const balance = balanceRes.rows[0];

    res.json({
        vacation_days: balance.vacation_days,
        sick_days: balance.sick_days
    });
});

//all requests for manager
leaveRoutes.get("/all", protect, async (req, res) => {
  if (req.user.role !== "manager") {
    return res.status(403).json({ message: "Access denied" });
  }

  const leaves = await pool.query(
    `SELECT l.*, u.name, u.email
     FROM leaves l
     JOIN users u ON l.user_id = u.id
     ORDER BY l.created_at DESC`
  );

  res.json(leaves.rows);
});

// pending requests for manager
leaveRoutes.get("/pending", protect, async (req, res) => {
  
    if (req.user.role !== "manager") {
    return res.status(403).json({ message: "Access denied" });
  }

  const leaves = await pool.query(
    "SELECT * FROM leaves WHERE status='pending'"
  );

  res.json(leaves.rows);
});

// approve/reject leave by manager
leaveRoutes.patch("/:leaveId", protect, async (req, res) => {
    const { leaveId } = req.params;
    const { status, manager_comment } = req.body;

    if(req.user.role !== "manager") {
        return res.status(403).json({ message: "Access denied" });
    }

    if(!["approved", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
    }

    const client = await pool.connect();

    try{
        await client.query("BEGIN");

        const leaveRes = await client.query(
            "SELECT * FROM leaves WHERE id=$1",
            [leaveId]
        ); 

        if(leaveRes.rows.length === 0) {
            await client.query("ROLLBACK");
            return res.status(404).json({ message: "Leave request not found" });
        }

        const leave = leaveRes.rows[0];

        if(leave.status !== "pending") {
            await client.query("ROLLBACK");
            return res.status(400).json({ message: "Leave request already processed" });
        }

        //for approving leave
        if(status === "approved") {
            const leaveDaysRequested = (new Date(leave.end_date) - new Date(leave.start_date)) / (1000 * 60 * 60 * 24) + 1;

            const balanceRes = await client.query(
                "SELECT * FROM leave_balances WHERE user_id=$1",
                [leave.user_id]
            );

            const balance = balanceRes.rows[0];

            if(leave.leave_type === "vacation") {
                if(balance.vacation_days < leaveDaysRequested) {
                    await client.query("ROLLBACK");
                    return res.status(400).json({ message: "Insufficient vacation days" });
                }

                await client.query(
                    `UPDATE leave_balances
                     SET vacation_days = vacation_days - $1
                     WHERE user_id = $2`,
                    [leaveDaysRequested, leave.user_id]
                );
            }

            if(leave.leave_type === "sick") {
                if(balance.sick_days < leaveDaysRequested) {
                    await client.query("ROLLBACK");
                    return res.status(400).json({ message: "Insufficient sick days" });
                }

                await client.query(
                    `UPDATE leave_balances
                     SET sick_days = sick_days - $1
                     WHERE user_id = $2`,
                    [leaveDaysRequested, leave.user_id]
                );
            }
        }

        //Rejection or final update
        await client.query(
            `UPDATE leaves
            SET status = $1,
            manager_comment = $2
            WHERE id = $3`,
            [status, manager_comment, leaveId]
        );

        await client.query("COMMIT");
        res.json({ message: `Leave request ${status} successfully` });

    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    } finally {
        client.release();
    }
});

module.exports = leaveRoutes;