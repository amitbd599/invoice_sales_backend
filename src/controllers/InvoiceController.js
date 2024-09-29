const mongoose = require("mongoose");
const InvoiceModel = require("../models/InvoiceModel");
const moment = require("moment");
const ObjectId = mongoose.Types.ObjectId;
const startOfDay = moment().startOf("day");
const endOfDay = moment().endOf("day");
exports.create = async (req, res) => {
  try {
    let reqBody = req.body;
    let data = await InvoiceModel.create(reqBody);
    res.status(200).json({ status: "success", data: data });
  } catch (e) {
    res.status(200).json({ status: "error", error: e.toString() });
  }
};

exports.read_all = async (req, res) => {
  try {
    let projectionStage = {
      $project: {
        invoiceID: 1,
        customerName: 1,
        deliveryDate: 1,
        startDate: 1,
        due: 1,
        payment: 1,
      },
    };
    let data = await InvoiceModel.aggregate([projectionStage]);
    res.status(200).json({ status: "success", data: data });
  } catch (e) {
    res.status(200).json({ status: "error", error: e.toString() });
  }
};

exports.read_single = async (req, res) => {
  try {
    let invoice_id = new ObjectId(req.params.invoice_id);
    let MatchStage = {
      $match: {
        _id: invoice_id,
      },
    };
    let projectionStage = {
      $project: {
        _id: 0,
        createdAt: 0,
        updatedAt: 0,
      },
    };
    let data = await InvoiceModel.aggregate([MatchStage, projectionStage]);
    res.status(200).json({ status: "success", data: data[0] });
  } catch (e) {
    res.status(200).json({ status: "error", error: e.toString() });
  }
};

exports.update_single = async (req, res) => {
  try {
    let invoice_id = new ObjectId(req.params.invoice_id);
    let MatchStage = {
      _id: invoice_id,
    };
    let reqBody = req.body;
    let data = await InvoiceModel.updateOne(MatchStage, reqBody);
    res.status(200).json({ status: "success", data: data });
  } catch (e) {
    res.status(200).json({ status: "error", error: e.toString() });
  }
};

exports.delete_single = async (req, res) => {
  try {
    let invoice_id = new ObjectId(req.params.invoice_id);
    let MatchStage = {
      _id: invoice_id,
    };
    let data = await InvoiceModel.deleteOne(MatchStage);
    res.status(200).json({ status: "success", data: data });
  } catch (e) {
    res.status(200).json({ status: "error", error: e.toString() });
  }
};

exports.delete_all = async (req, res) => {
  try {
    let reqBody = req.body;
    reqBody = reqBody["_id"];

    const objectIdArray = reqBody.map((id) => new mongoose.Types.ObjectId(id));

    let data = await InvoiceModel.deleteMany({
      _id: { $in: objectIdArray },
    });

    res.status(200).json({ status: "success", data: data });
  } catch (e) {
    res.status(200).json({ status: "error", error: e.toString() });
  }
};


//! Get Dashboard data 

exports.getDashboard = async (req, res) => {
  try {
    let data_flow = await InvoiceModel.aggregate(
      [
        {
          $group: {
            _id: null,
            totalSalesAmount: { $sum: "$total" },
            totalCustomerCount: { $sum: 1 },
            totalDueAmount: { $sum: { $cond: { if: { $gt: ["$due", 0] }, then: "$due", else: 0 } } },
            totalDueCustomer: { $sum: { $cond: { if: { $gt: ["$due", 0] }, then: 1, else: 0 } } },
            totalPaidAmount: { $sum: { $cond: { if: { $gt: ["$payment", 0] }, then: "$payment", else: 0 } } },
            totalFullPaidCustomer: { $sum: { $cond: { if: { $lt: ["$due", 1] }, then: 1, else: 0 } } },
            totalInvoiceItems: { $sum: { $size: "$invoiceItems" } }
          }
        }
      ]
    )
    let table_data = await InvoiceModel.aggregate(
      [
        {
          $sort: { "createdAt": -1 }
        },
        {
          $limit: 10
        },
        {
          $project: {
            invoiceID: 1,
            customerName: 1,
            startDate: 1,
            deliveryDate: 1,
            due: 1,
            payment: 1,
            total: 1,
          }
        }
      ]
    )
    let bar_chat_monthly_sales = await InvoiceModel.aggregate(
      [
        {
          $group: {
            _id: { $month: "$createdAt" }, // Extract the month from the createdAt field
            totalSalesAmount: { $sum: "$total" } // Sum of total amounts for each month
          }
        },
        {
          $project: {
            _id: 1,
            totalSalesAmount: 1,
            monthName: {
              $switch: {
                branches: [
                  { case: { $eq: ["$_id", 1] }, then: "January" },
                  { case: { $eq: ["$_id", 2] }, then: "February" },
                  { case: { $eq: ["$_id", 3] }, then: "March" },
                  { case: { $eq: ["$_id", 4] }, then: "April" },
                  { case: { $eq: ["$_id", 5] }, then: "May" },
                  { case: { $eq: ["$_id", 6] }, then: "June" },
                  { case: { $eq: ["$_id", 7] }, then: "July" },
                  { case: { $eq: ["$_id", 8] }, then: "August" },
                  { case: { $eq: ["$_id", 9] }, then: "September" },
                  { case: { $eq: ["$_id", 10] }, then: "October" },
                  { case: { $eq: ["$_id", 11] }, then: "November" },
                  { case: { $eq: ["$_id", 12] }, then: "December" }
                ],
                default: "Unknown"
              }
            }
          }
        },
        {
          $project: {
            _id: "$monthName",
            totalSalesAmount: 1
          }
        }
      ]
    )
    let bar_chat_monthly_report = await InvoiceModel.aggregate(
      [{
        $group: {
          _id: { $month: "$createdAt" },
          totalDueAmount: { $sum: "$due" },
          totalPaymentAmount: { $sum: "$payment" }
        }
      },
      {
        $project: {
          _id: 1,
          monthName: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id", 1] }, then: "January" },
                { case: { $eq: ["$_id", 2] }, then: "February" },
                { case: { $eq: ["$_id", 3] }, then: "March" },
                { case: { $eq: ["$_id", 4] }, then: "April" },
                { case: { $eq: ["$_id", 5] }, then: "May" },
                { case: { $eq: ["$_id", 6] }, then: "June" },
                { case: { $eq: ["$_id", 7] }, then: "July" },
                { case: { $eq: ["$_id", 8] }, then: "August" },
                { case: { $eq: ["$_id", 9] }, then: "September" },
                { case: { $eq: ["$_id", 10] }, then: "October" },
                { case: { $eq: ["$_id", 11] }, then: "November" },
                { case: { $eq: ["$_id", 12] }, then: "December" }
              ],
              default: "Unknown"
            }
          },
          totalSalesAmount: 1,
          totalDueAmount: 1,
          totalPaymentAmount: 1
        }
      },
      {
        $project: {
          _id: "$monthName",
          totalSalesAmount: 1,
          totalDueAmount: 1,
          totalPaymentAmount: 1
        }
      }]

    )

    let today_total_sale = await InvoiceModel.aggregate(
      [
        {
          $match: {
            createdAt: {
              $gte: startOfDay.toDate(), // Filter by documents created on or after the start of today
              $lte: endOfDay.toDate() // Filter by documents created before or at the end of today
            }
          }
        },
        {
          $project: {
            invoiceItemsCount: { $size: "$invoiceItems" } // Count the number of items in the invoiceItems array
          }
        },
        {
          $group: {
            _id: null,
            items: { $sum: "$invoiceItemsCount" } // Sum of total sales items for today
          }
        }
      ]
    )
    let today_total_sales_amount = await InvoiceModel.aggregate(
      [
        {
          $match: {
            createdAt: {
              $gte: startOfDay.toDate(), // Filter by documents created on or after the start of today
              $lte: endOfDay.toDate() // Filter by documents created before or at the end of today
            }
          }
        },
        {
          $group: {
            _id: null,
            amount: { $sum: "$total" } // Sum of total amounts for today
          }
        }
      ]
    )
    let today_total_due_amount = await InvoiceModel.aggregate(
      [
        {
          $match: {
            createdAt: {
              $gte: startOfDay.toDate(), // Filter by documents created on or after the start of today
              $lte: endOfDay.toDate() // Filter by documents created before or at the end of today
            }
          }
        },
        {
          $group: {
            _id: null,
            amount: { $sum: "$due" } // Sum of total due amounts for today
          }
        }
      ]
    )
    let today_total_paid_amount = await InvoiceModel.aggregate(
      [
        {
          $match: {
            createdAt: {
              $gte: startOfDay.toDate(), // Filter by documents created on or after the start of today
              $lte: endOfDay.toDate() // Filter by documents created before or at the end of today
            }
          }
        },
        {
          $group: {
            _id: null,
            amount: { $sum: "$payment" } // Sum of total paid amounts for today
          }
        }
      ]
    )

    console.log(startOfDay.local().format('h:mm A dddd, MMMM D, YYYY'));
    console.log(endOfDay.local().format('h:mm A dddd, MMMM D, YYYY'));




    res.status(200).json({ status: "success", data: { data_flow, table_data, bar_chat_monthly_sales, bar_chat_monthly_report, today_total_sale, today_total_sales_amount, today_total_due_amount, today_total_paid_amount } });
  } catch (e) {
    res.status(200).json({ status: "error", error: e.toString() });
  }
}
