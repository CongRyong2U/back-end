const express = require("express");
const router = express.Router();
const { User } = require("../models/User");
const { Stage } = require("../models/Stage");
const { Illust } = require("../models/Illust");
const { auth } = require("../middleware/auth");


router.post("/info", async (req, res, next) => {
  try{
    const user = await User.findOne({_id: req.body._id});

    return res.status(200).json({
      success: true,
      user
    });

  } catch (err) {
    res.json({ success: false, err });
    next(err);
  }
});

router.post("/collection", async (req, res, next) => {
  try{
      const collection = await User.findOne({_id: req.body._id}, {illustList: 1}, {itemList: 1})
      .populate("illustList", "name")
      .populate({path: "itemList", populate: {path: "illustId", model: "Illust", populate: {path: "stageId", model: "Stage", select: {"itemName": 1}}} })
      
      /*
      collection.aggregate([
        {$project: {"illustList.$[].illustId.stageId.itemName": 0, "itemList.$[].count": 1}}
      ])
      */

     /*
      const collection2 = User.aggregate([
        {
          $lookup: {
            from: 'Illust',
            localField: 'illustList.$[].illustId',
            foreignField: '_id',
            as: 'illust'
          }
        },
        {
          $lookup: {
            from: 'Illust',
            localField: 'itemList.$[].illustId',
            foreignField: '_id',
            as: 'item'
          }
        }, {
          $unwind: "$item"
        }, {
          $project: {
            "illustList.$[].illustId.stageId.itemName": 0, "itemList.$[].count": 1
          }
        }
      ]) 
      */

      return res.status(200).json({
          success: true,
          collection
      });
      } catch (err) {
      res.json({ success: false, err });
      next(err);
  }
});

router.post("/illustList", async (req, res, next) => {
  try{
    const illustList = await User.findOne({_id: req.body._id}, {illustList: 1})
    .populate("illustList", "name")
    return res.status(200).json({
      success: true,
      illustList
    });
  } catch (err) {
  res.json({ success: false, err });
  next(err);
  }
});


router.post("/itemList", async (req, res, next) => {
  try{
    const itemList = await User.findOne({_id: req.body._id}, {itemList: 1})
      .populate({path: "itemList", populate: {path: "illustId", model: "Illust", populate: {path: "stageId", model: "Stage", select: {"itemName": 1}}} })
      return res.status(200).json({
        success: true,
        itemList
      });
    } catch (err) {
    res.json({ success: false, err });
    next(err);
  }
});

/* ????????? auth ?????? ????????? */

router.get("/auth", auth, (req, res) => {
    // ??????????????? ????????? ???????????? ????????? Authentication??? true
    // ?????????????????? req.user = user ????????? ????????? ??? ??? ??????
    res.status(200).json({
      _id: req.user._id,
      isAuth: true,
      email: req.user.email,
      name: req.user.name,
      image: req.user.image,
      favorites: req.user.favorites,
    });
});
  
router.post("/register", (req, res) => {
  // ???????????? ??? ????????? ???????????? client?????? ????????????
  // ???????????? ????????????????????? ????????????

  const user = new User(req.body); // json ????????? ?????? ?????? (bodyparser ??????)

  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

router.post("/login", (req, res) => {
  // ????????? ???????????? DB??? ????????? ?????????

  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "????????? ???????????? ???????????? ????????? ????????????.",
      });
    }
    //  ???????????? ????????? ??????????????? ?????? ?????????????????? ??????
    // comparePassword() ???????????? User ???????????? ?????????
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({
          loginSuccess: false,
          message: "??????????????? ???????????????.",
        });

      // ?????????????????? ????????? ????????? ????????????
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        // ???????????? user??? ????????? ????????? ????????????.
        // ?????????? (????????? ?????????) ??????, ??????????????????, ?????????????????? ??????...
        // ????????? ????????????: cookie-parser ???????????????
        // ????????? ????????????: 
        res
          .cookie("x_auth", user.token) // x_auth ????????? ?????? ?????????
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
      });
    });
  });
});

router.get("/logout", auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({
      success: true,
    });
  });
});

module.exports = router;
