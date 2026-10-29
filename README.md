# Character Studio

独立的角色卡提示词组装工具。从 Poo AI V2 的角色卡模块提取，原项目保持原样。

## 在线使用

访问 [Character Studio](https://jasinghuang.github.io/character-studio/)，无需安装。

## 打开方式

直接双击 `index.html` 即可使用。推荐通过本地服务打开，以获得稳定的复制和草稿保存能力：

```sh
git clone https://github.com/jasinghuang/character-studio.git
cd character-studio
npm start
```

浏览器打开 http://127.0.0.1:8760 。没有第三方依赖，无需安装依赖或配置 API Key。可通过 `PORT=8761 npm start` 更换端口。

## 使用

1. 在「基础外形」「发型与服装」「表情与细节」设置角色。各项支持预设和自定义；未指定的特征沿用参考照片。
2. 点击「生成提示词」。生成后可以手动编辑；修改设定会提示更新。
3. 点击「复制提示词」，到生图网站粘贴，并上传人物参考照片。画面比例选择 **16:9**。

排版固定为三视图：左侧正面全身服装（隐形模特效果）、中间背面全身、右侧胸部以上人像。

## 数据与范围

- 仅在浏览器本地组装提示词；不调用 AI、图像生成或供应商 API，不收集照片和 API Key。
- 设定与当前提示词保存在本浏览器的 `character-studio.draft.v1` 草稿中。清除网站数据会清除草稿。
- 自定义文本按输入原样保留，不自动翻译。最终图像效果由外部生图网站和所用模型决定。
- 复制权限不可用时会尝试兼容复制；仍失败时可手动选中并按 ⌘C / Ctrl+C。

## 文件

- `index.html`：独立页面
- `assets/schema.js`：角色表单及默认值
- `assets/character-prompt.js`：三视图规则与预设的英文映射
- `assets/prompt-engine.js`：纯文本提示词组装
- `assets/app.js`：表单、草稿和复制交互
- `assets/style.css`：桌面与移动端样式
- `server.mjs`：仅监听本机的静态服务

```sh
npm test
npm run check
```

## 发布

网站通过 GitHub Pages 从 `main` 分支的根目录发布。将修改推送到 `main` 后，GitHub 会自动更新在线网页，无需构建。
