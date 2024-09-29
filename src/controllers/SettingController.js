const SettingModel = require("../models/SettingModel");

exports.setting = async (req, res) => {
  try {
    let reqBody = req.body;
    let data = await SettingModel.findOneAndUpdate(
      { baseID: "setting_1" },
      reqBody,
      {
        upsert: true,
      }
    );
    res.status(200).json({ status: "success", data: data });
  } catch (e) {
    res.status(200).json({ status: "error", error: e.toString() });
  }
};
exports.setting_read = async (req, res) => {
  try {
    let MatchStage = {
      $match: {
        baseID: "setting_1",
      },
    };
    let data = await SettingModel.aggregate([MatchStage]);
    res.status(200).json({ status: "success", data: data[0] });
  } catch (e) {
    res.status(200).json({ status: "error", error: e.toString() });
  }
};
