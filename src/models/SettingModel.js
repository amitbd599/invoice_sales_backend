const mongoose = require("mongoose");
const DataSchema = mongoose.Schema(
  {
    baseID: { type: String, default: "setting_1" },
    bgImg: { type: String },
    company_address: { type: String },
    company_name: { type: String },
    currency: { type: String },
    discount: { type: Number },
    email: { type: String },
    fax: { type: String },
    footerText: { type: String },
    invoiceType: { type: String },
    invoiceWriter: { type: String },
    logo: { type: String },
    mobile: { type: String },
    pageOrientation: { type: String },
    pageSize: { type: String },
    phone: { type: String },
    qrCode: { type: String },
    selectedTemplate: { type: Number },
    shipping: { type: Number },
    taxation: { type: Number },
    taxationName: { type: String },
    themeColor: { type: Array },
    themeTextColor: { type: Array },
    website: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const SettingModel = mongoose.model("settings", DataSchema);

module.exports = SettingModel;
