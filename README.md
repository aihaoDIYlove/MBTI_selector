# MBTI喜好生成器

一个简易MBTI人格类型的喜好填写器，可以通过点击颜色和人物图标来生成个性化的MBTI喜好矩阵图。

## 技术栈

- **前端**：HTML5, CSS3, JavaScript
- **图片处理**：html2canvas
- **服务器**：Node.js

## 项目结构

```text
MBTI_selector/
├── public/
│   ├── index.html          # 主页面
│   ├── main.css            # 样式文件
│   ├── main.js             # 交互逻辑
│   └── img/                # 图片资源
│       └── img.webp        # 表格图片
│       └── favicon.ico     # 网站图标
│   └── libs/               # 第三方库
│   └── js/                 # js文件
│   └── css/                # css文件
├── server.js               # 开发服务器
├── package.json            # 项目配置
└── README.md               # 项目说明
```

## 安装与运行

### 环境要求

- Node.js

### 安装依赖

```bash
npm install
```

### 启动服务

```bash
node server.js
```

服务启动后，在浏览器中访问 `http://localhost:3000` 即可使用。

## 贡献者

- **表格作者**：Twilight Moonlight
- **角色形象作者**：王维诗里的MBTI

## 版权声明

- 本项目不会以任何形式（包括捐赠、广告等形式）盈利
- 表格的一切权益归属于两位作者
- 角色形象版权归原作者所有

## 相关链接

- 表格作者抖音主页：[v.douyin.com/SMyKaUV4nS4](https://v.douyin.com/SMyKaUV4nS4)
- 角色形象作者抖音主页：[v.douyin.com/T0dtUYQGQag](https://v.douyin.com/T0dtUYQGQag)
- 项目部署：[mbti.dreamripples.icu](https://mbti.dreamripples.icu)
