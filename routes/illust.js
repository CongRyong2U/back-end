const express = require("express");
const router = express.Router();
const { Illust } = require("../models/Illust");

router.get("/list", async (req, res, next) => {
    try{
        const illustList = await Illust.find({}, {desc: 0});
        return res.status(200).json({
            success: true,
            illustList
        });

        } catch (err) {
        res.json({ success: false, err });
        next(err);
    }
  
});

router.get("/detail/:illustId", async (req, res, next) => {
    try{
        const illust = await Illust.findOne({_id: req.params.illustId});
        return res.status(200).json({
            success: true,
            illust
        });

        } catch (err) {
        res.json({ success: false, err });
        next(err);
    }
  
});

module.exports = router;
