const mongoose = require("mongoose");
const DataSchema = mongoose.Schema(
  {
    accountName: { type: String },
    accountNumber: { type: String },
    address: { type: String },
    branchName: { type: String },
    currency: { type: String },
    customerName: { type: String },
    deliveryDate: { type: String },
    discount: { type: Number },
    due: { type: Number },
    email: { type: String },
    invoiceID: { type: String },
    invoiceItems: { type: Array },
    invoiceWriter: { type: String },
    note: { type: String },
    payment: { type: Number },
    paymentMethod: { type: String },
    phone: { type: String },
    selectedTemplate: { type: Number },
    shipping: { type: Number },
    startDate: { type: String },
    subTotal: { type: Number },
    taxation: { type: Number },
    taxationAmount: { type: Number },
    taxationName: { type: String },
    total: { type: Number },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const InvoiceModel = mongoose.model("Invoices", DataSchema);

module.exports = InvoiceModel;
