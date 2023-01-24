const express = require("express");
const router = express.Router();
const { Stage } = require("../models/Stage");

router.get("/list", async (req, res, next) => {
    try{
        const stageList = await Stage.find({}, {"_id":1, "placeName":1, "lat":1, "lng":1, "personName":1, "category":1 });
        return res.status(200).json({
            success: true,
            stageList
        });

        } catch (err) {
        res.json({ success: false, err });
        next(err);
    }
});

router.get("/detail/:stageId", async (req, res, next) => {
    try{
        const stage = await Stage.findOne({_id: req.params.stageId});
        return res.status(200).json({
            success: true,
            stage
        });

        } catch (err) {
        res.json({ success: false, err });
        next(err);
    }
});

module.exports = router;
