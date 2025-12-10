const fs = require('fs-extra');
const path = require('path');
const crypto = require('crypto');

/**
 * 生成文件的短哈希值
 * @param {string} filePath - 文件路径
 * @param {number} length - 哈希长度，默认8位
 * @returns {string} 短哈希值
 */
function generateFileHash(filePath, length = 8) {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const hash = crypto.createHash('md5').update(content).digest('hex');
        return hash.substring(0, length);
    } catch (error) {
        console.warn(`无法读取文件 ${filePath}:`, error.message);
        return Date.now().toString(36); // 如果无法读取文件，使用时间戳作为备选
    }
}

/**
 * 更新 index.html 中的资源版本号
 */
async function updateAssetVersions() {
    try {
        console.log('开始更新资源版本号...');

        const indexPath = path.join(__dirname, 'public', 'index.html');
        const cssDir = path.join(__dirname, 'public', 'css');
        const jsDir = path.join(__dirname, 'public');

        // 检查 index.html 是否存在
        if (!await fs.pathExists(indexPath)) {
            console.error('index.html 文件不存在:', indexPath);
            return;
        }

        // 读取 index.html 内容
        let htmlContent = await fs.readFile(indexPath, 'utf-8');

        // 定义需要更新版本号的资源文件模式
        const assetPatterns = [
            // CSS 文件
            {
                pattern: /href="css\/([^"]+\.css)\?v=[^"]+"/g,
                fileDir: cssDir,
                template: (filename, hash) => `href="css/${filename}?v=${hash}"`
            },
            // JS 文件
            {
                pattern: /src="([^"]+\.js)\?v=[^"]+"/g,
                fileDir: jsDir,
                template: (filename, hash) => `src="${filename}?v=${hash}"`
            }
        ];

        let updatedCount = 0;

        // 处理每种资源模式
        for (const assetType of assetPatterns) {
            const matches = [...htmlContent.matchAll(assetType.pattern)];

            for (const match of matches) {
                const filename = match[1];
                const filePath = path.join(assetType.fileDir, filename);

                if (await fs.pathExists(filePath)) {
                    const hash = generateFileHash(filePath);
                    const newReference = assetType.template(filename, hash);

                    // 替换旧的引用
                    htmlContent = htmlContent.replace(match[0], newReference);
                    updatedCount++;

                    console.log(`更新 ${filename} -> 版本: ${hash}`);
                } else {
                    console.warn(`资源文件不存在: ${filePath}`);
                }
            }
        }

        // 写回更新后的内容
        await fs.writeFile(indexPath, htmlContent, 'utf-8');

        console.log(`资源版本号更新完成！共更新 ${updatedCount} 个文件`);
        console.log(`更新文件: ${indexPath}`);

    } catch (error) {
        console.error('更新资源版本号失败:', error);
        process.exit(1);
    }
}

/**
 * 监听文件变化并自动更新版本号
 */
async function watchAssets() {
    const pathsToWatch = [
        path.join(__dirname, 'public', 'css', '**/*.css'),
        path.join(__dirname, 'public', '**/*.js')
    ];

    console.log('开始监听资源文件变化...');
    console.log('监听路径:', pathsToWatch);

    const chokidar = require('chokidar');

    const watcher = chokidar.watch(pathsToWatch, {
        ignored: /node_modules/,
        persistent: true,
        ignoreInitial: true
    });

    watcher.on('change', (filePath) => {
        console.log(`检测到文件变化: ${filePath}`);
        updateAssetVersions();
    });

    console.log('文件监听已启动。按 Ctrl+C 退出。');
}

// 命令行参数处理
const args = process.argv.slice(2);
const watchMode = args.includes('--watch') || args.includes('-w');

if (watchMode) {
    // 检查是否安装了 chokidar
    try {
        require('chokidar');
        updateAssetVersions().then(() => watchAssets());
    } catch (error) {
        console.error('监听模式需要安装 chokidar 包:');
        console.error('npm install chokidar --save-dev');
        process.exit(1);
    }
} else {
    updateAssetVersions();
}

// 如果直接运行此脚本
if (require.main === module) {
    // 导出函数供其他模块使用
    module.exports = {
        updateAssetVersions,
        generateFileHash,
        watchAssets
    };
}