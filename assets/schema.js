// 独立角色设定；不包含供应商、API 或图像生成配置。
(function(g){
  g.CharacterSchema = {
  "sections": [
    {
      "id": "basics",
      "title": "基础外形",
      "description": "未单独设定的特征沿用参考照片。",
      "fields": [
        {
          "type": "choice",
          "key": "photoStyle",
          "label": "视觉风格",
          "options": [
            "逼真真人",
            "超写实",
            "游戏角色",
            "动画电影",
            "3D 渲染",
            "自定义"
          ],
          "dense": true,
          "help": "真人摄影支持皮肤状态与肤质细节设置。"
        },
        {
          "type": "choice",
          "key": "height",
          "label": "身高",
          "options": [
            "与图片相同",
            "矮",
            "平均",
            "高",
            "自定义"
          ],
          "dense": true
        },
        {
          "type": "choice",
          "key": "bodyType",
          "label": "体型",
          "options": [
            "与图片相同",
            "纤瘦",
            "苗条",
            "普通",
            "结实",
            "肌肉",
            "微胖",
            "自定义"
          ],
          "dense": true
        },
        {
          "type": "choice",
          "key": "skinTone",
          "label": "肤色",
          "options": [
            "与图片相同",
            "白皙",
            "浅色",
            "自然",
            "小麦色",
            "深色",
            "自定义"
          ],
          "dense": true
        },
        {
          "type": "choice",
          "key": "skinState",
          "label": "皮肤状态",
          "options": ["自然半哑光", "运动后微汗", "雨后湿润", "轻薄底妆"],
          "photoStyles": ["逼真真人", "超写实"],
          "help": "每次选择一种状态，系统自动匹配皮肤的反光与湿润程度。"
        },
        {
          "type": "choice",
          "key": "skinDetail",
          "label": "肤质细节强度",
          "options": ["柔和", "自然", "精细"],
          "photoStyles": ["逼真真人", "超写实"],
          "help": "主要影响右侧胸像。保留参考人物的年龄感与已有特征，不额外添加瑕疵。"
        }
      ]
    },
    {
      "id": "outfit",
      "title": "发型与服装",
      "description": "统一三个视图中的发型与穿着。",
      "fields": [
        {
          "type": "cascade",
          "key": "hairStyle",
          "label": "发型",
          "groups": [
            [
              "与图片相同",
              [
                "与图片相同"
              ]
            ],
            [
              "长发",
              [
                "长直发",
                "大波浪卷",
                "羊毛卷",
                "双马尾"
              ]
            ],
            [
              "短发",
              [
                "齐肩短发",
                "波波头",
                "寸头"
              ]
            ],
            [
              "束发与编发",
              [
                "高马尾",
                "丸子头",
                "编发"
              ]
            ]
          ]
        },
        {
          "type": "cascade",
          "key": "outfit",
          "label": "外衣",
          "groups": [
            [
              "与图片相同",
              [
                "与图片相同"
              ]
            ],
            [
              "休闲",
              [
                "T 恤牛仔裤",
                "连帽卫衣",
                "针织毛衣",
                "牛仔外套"
              ]
            ],
            [
              "正式",
              [
                "衬衫长裤",
                "西装套装",
                "风衣"
              ]
            ],
            [
              "气质与季节",
              [
                "连衣裙",
                "旗袍",
                "羽绒服"
              ]
            ]
          ]
        },
        {
          "type": "choice",
          "key": "hairColor",
          "label": "头发颜色",
          "options": [
            "与图片相同",
            "黑色",
            "深棕",
            "金色",
            "红色",
            "银灰",
            "白色",
            "自定义"
          ],
          "dense": true
        },
        {
          "type": "text",
          "key": "eyeColor",
          "label": "眼睛颜色",
          "placeholder": "例如：深棕色 / brown"
        },
        {
          "type": "choice",
          "key": "portraitAngle",
          "label": "上半身角度",
          "options": [
            "正面",
            "四分之三（右）",
            "四分之三（左）"
          ],
          "dense": true
        },
        {
          "type": "textarea",
          "key": "etc",
          "label": "补充外形要求",
          "note": "（选项没覆盖的,直接写）",
          "placeholder": "例如：米白色风衣、精致小耳钉，保留原人物的五官"
        }
      ]
    },
    {
      "id": "emotion",
      "title": "表情与细节",
      "description": "表情与视线应用于右侧人像，肤色与已有特征保持一致。",
      "fields": [
        {
          "type": "cascade",
          "key": "emotion",
          "label": "面部情绪",
          "groups": [
            [
              "平静与喜",
              [
                "平静",
                "淡淡微笑",
                "灿烂笑容",
                "咧嘴笑",
                "大笑",
                "腼腆微笑",
                "坏笑",
                "俏皮",
                "眨眼"
              ]
            ],
            [
              "开心与兴奋",
              [
                "开心",
                "喜悦",
                "兴奋",
                "得意",
                "自信",
                "傲娇"
              ]
            ],
            [
              "爱与感动",
              [
                "温柔",
                "深情",
                "感动",
                "渴望",
                "害羞微笑"
              ]
            ],
            [
              "哀伤",
              [
                "悲伤",
                "含泪",
                "哭泣",
                "忧郁",
                "痛苦",
                "迷茫"
              ]
            ],
            [
              "恐与忧",
              [
                "害怕",
                "惊恐",
                "紧张",
                "焦虑",
                "担忧",
                "疲惫",
                "困倦",
                "无聊",
                "叹气"
              ]
            ],
            [
              "怒与蔑",
              [
                "愤怒",
                "暴怒",
                "恼火",
                "皱眉",
                "轻蔑",
                "嘲讽",
                "厌恶",
                "冰冷"
              ]
            ],
            [
              "惊与思",
              [
                "惊讶",
                "震惊",
                "怀疑",
                "困惑",
                "好奇",
                "专注",
                "坚定",
                "严肃",
                "羞愧",
                "慌乱",
                "漫不经心"
              ]
            ]
          ]
        },
        {
          "type": "choice",
          "key": "gaze",
          "label": "视线",
          "options": ["随表情", "看向镜头", "看向画面左侧", "看向画面右侧", "微微垂眸", "闭眼"],
          "help": "视线控制眼睛朝向，头部角度保持所选设置；眨眼时只控制睁开的眼睛。"
        },
        {
          "type": "textarea",
          "key": "emoNote",
          "label": "自定义情绪",
          "note": "（选填）",
          "placeholder": "例如：嘴角微笑，眼神放松，像在和朋友交流",
          "help": "填写后优先使用这段描述，覆盖预设情绪与视线；可以一起描述眼神。"
        }
      ]
    }
  ],
  "defaults": {
    "photoStyle": "逼真真人",
    "height": "与图片相同",
    "bodyType": "与图片相同",
    "skinTone": "与图片相同",
    "skinState": "自然半哑光",
    "skinDetail": "自然",
    "hairStyle": "与图片相同",
    "outfit": "与图片相同",
    "hairColor": "与图片相同",
    "eyeColor": "",
    "portraitAngle": "正面",
    "etc": "",
    "emotion": "平静",
    "gaze": "随表情",
    "emoNote": ""
  }
};
})(typeof window !== "undefined" ? window : globalThis);
