const express = require("express");
const router = express.Router();
const { User } = require("../models/User");

router.post("/save", async (req, res, next) => {
    try{
        const userId = req.body.userId;
        const illustId = req.body.illustId;
        const count = req.body.count;

        // User를 찾는다
        const user = await User.findOne({ _id: req.body.userId});

        // 이미 일러스트를 보유 중이면 false 리턴
        const illust = user.illustList.find(function(illustListItem){ return illustListItem.illustId == illustId}) 
        if (illust==null) {
            return res.status(200).json({
                success: true,
                unlocked: false,
                message: "일러스트 보유 중"
            });
        }

        // user가 가진 itemList에서 illustId가 일치하는 아이템을 찾는다
        // 조건에 맞는 결과값 여러 개 찾으려면 filter, 가장 처음 하나 찾으려면 find
        let item = user.itemList.find(function(itemListItem){ return itemListItem.illustId == illustId}) 

        if (item!=null) {  // 존재하면 count에 더한다
            const newCount = item.count + count;
            
            if (newCount>=100) {  // count가 100을 넘으면 획득한 것!
                // illustList에 일러스트 추가
                await User.findOneAndUpdate({_id: userId}, { $addToSet: { illustList: illustId } })
                // itemList에서 아이템 제거
                await User.findOneAndUpdate(
                    { _id: userId },
                    { $pull: { "itemList": { "illustId": illustId } } }, false
                  );
                // true 리턴
                return res.status(200).json({
                    success: true,
                    unlocked: true,
                    message: "해금"
                });
            }

            // 100을 넘지 않았다면 count 업데이트
            await User.findOneAndUpdate({_id: userId}, {$set: {"itemList.$[t].count": newCount}}, {arrayFilters: [{"t.illustId": illustId}]});

            return res.status(200).json({
                success: true,
                unlocked: false
            });

        } else {  // 아이템을 갖고있지 않았다면 itemList에 push한다
            const newItem = {illustId, count};
            await User.findOneAndUpdate({_id: userId}, { $push: { itemList: {illustId, count} } });
            // false 리턴
            return res.status(200).json({
                success: true,
                unlocked: false,
            });
        }

    } catch (err) {
        res.json({ success: false, err });
        next(err);
    }

});

module.exports = router;
