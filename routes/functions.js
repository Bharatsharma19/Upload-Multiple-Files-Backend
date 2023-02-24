var express = require("express");
var router = express.Router();
var pool = require("./pool");
var upload = require("./multer");

router.get("/check", function (req, res) {
  res.status(200).json({ status: true });
});

router.post("/checkconnection", upload.any("picture"), function (req, res) {
  try {
    pool.query(
      "insert into check_connection(name, icon) values(?, ?)",
      [req.body.name, req.files[0].filename],
      function (error, result) {
        if (error) {
          res.status(500).json({ status: false, message: "Server Error" });
        } else {
          res.status(200).json({
            status: true,
            message: "Connection Established Successfully",
          });
        }
      }
    );
  } catch (error) {
    res
      .status(500)
      .json({ status: false, message: "Server Error", text: error });
  }
});

module.exports = router;
