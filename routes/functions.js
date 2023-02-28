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

router.post("/add", upload.any(), function (req, res) {
  var obj = {};

  req.files.map((item) => {
    if (!obj[item.fieldname]) {
      obj[item.fieldname] = [];
    }
    obj[item.fieldname].push(item.filename);
  });

  for (let key in obj) {
    obj[key] = obj[key].join();
  }

  req.body = { ...req.body, ...obj };

  pool.query("insert into files set ?", req.body, function (error, result) {
    if (error) {
      console.log(error);
      res.status(500).json({ status: false });
    } else {
      res.status(200).json({ status: true, data: req.body });
    }
  });
});

router.get("/displayall", function (req, res) {
  pool.query("select * from files", function (error, result) {
    if (error) {
      console.log(error);
      res.status(500).json({ status: false, data: [] });
    } else {
      res.status(200).json({ status: true, data: result });
    }
  });
});

module.exports = router;
