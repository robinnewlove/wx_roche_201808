import Toast                    from 'plugins/toast.plugin'
export default {
    // 校验
    checkData (data) {
        let result = [];
        try {
            data.forEach((item) => {
                let {Type, Code, check, Name, Answers, tagid, tag} = item;
                if (!check && Type !== 2) throw `请选择${Name}`;
                let obj = {};
                switch (Type) {
                    // 单选
                    case 1:
                        obj = {
                            QuestionId: Code,
                            ChooseResult: [
                                {
                                    ChooseNum: check,
                                }
                            ]
                        };
                        break;
                    // 复选
                    case 2:
                        let ChooseResult = [];
                        Answers.forEach((it) => {
                            if (it.check) {
                                ChooseResult.push({
                                    ChooseNum: it.ChooseNum,
                                })
                            }
                        });
                        if (!ChooseResult.length) throw `请选择${Name}`;
                        obj = {
                            QuestionId: Code,
                            ChooseResult,
                        };
                        break;
                    // 问答
                    case 3:
                        obj = {
                            QuestionId: Code,
                            ChooseResult: [
                                {
                                    ChooseNum: -1,
                                    AnswerName: check,
                                }
                            ]
                        };
                        break;
                    // 子集
                    case 4:
                        let answerTag = {};
                        Answers.forEach((it) => {
                            if (it.Id === check) answerTag = it;
                        });
                        let {AnswerTags} = answerTag;
                        if (!AnswerTags || !AnswerTags.length) {
                            obj = {
                                QuestionId: Code,
                                ChooseResult: [
                                    {
                                        ChooseNum: check,
                                    }
                                ]
                            };
                        } else {
                            if(!tagid || !tag) throw `请选择${Name}`;
                            obj = {
                                QuestionId: Code,
                                ChooseResult: [
                                    {
                                        ChooseNum: check,
                                        AnswerTags: [
                                            {
                                                Id: tagid,
                                                Tag: tag
                                            }
                                        ]
                                    }
                                ]
                            };
                        }
                        break;
                }
                result.push(obj);
            })
        } catch (err) {
            Toast.error(err);
            result = [];
        }
        return result;
    },

    // 选择
    handleCheck (e) {
        let {detail, currentTarget} = e;
        let Type = currentTarget.dataset.type;          // 题目类型
        let index = currentTarget.dataset.index;        // 题目index
        let ChooseNum = currentTarget.dataset.id;       // 答案id
        let ans = currentTarget.dataset.ans;
        let tagindex = currentTarget.dataset.tagindex;
        let ind = currentTarget.dataset.ind;
        let tagid = currentTarget.dataset.tagid;
        let tag = currentTarget.dataset.tag;
        let value = detail.value || '';
        let sItem = "arrData["+ index + "].check";
        switch (Type) {
            // 单选
            case 1:
                this.setData({
                    [sItem]: ChooseNum,
                });
                break;
            // 复选
            case 2:
                let sT = "arrData["+ index + "].Answers["+ ind +"].check";
                let check = this.data.arrData[index].Answers[ind].check || false;
                this.setData({
                    [sT]: !check,
                });
                break;
            // 问答
            case 3:
                this.setData({
                    [sItem]: value,
                });
                break;
            // 子集
            case 4:
                if (!ans) {
                    // 点击了子选项
                    let sT = "arrData["+ index + "].Answers["+ tagindex +"].check";
                    let sTag = "arrData["+ index + "].tagid";
                    let sTagText = "arrData["+ index + "].tag";
                    this.setData({
                        [sT]: tagid,
                        [sTag]: tagid,
                        [sTagText]: tag,
                    });
                }  else { // 点击了父选项
                    this.setData({
                        [sItem]: ChooseNum,
                    });
                }
                break;
        }
    }
}
