/**
 * MBTI 选择器应用主脚本文件
 * 提供颜色选择、矩阵填充和图片生成功能
 * 
 * @file main.js
 * @version 1.0.0
 * @description MBTI 矩阵颜色选择器应用
 */

// 全局变量定义
/** @type {string} 当前选中的颜色，默认为白色 */
let currentColor = 'white';

/** @type {HTMLElement|null} 生成按钮元素引用 */
let generateButton;

/** @type {Object} DOM 元素缓存对象，避免重复查询 */
let cachedElements = {};

/**
 * 样式常量定义 - 集中管理便于维护
 * @constant {Object} STYLES
 * @property {string} FORCE_COLOR_ADJUST - 强制颜色调整样式（防止浏览器深色模式干预）
 * @property {string} MAIN_CARD - 主卡片背景样式
 * @property {string} BUTTON - 按钮基础样式
 * @property {string} COLOR_INDICATOR_BASE - 颜色指示器基础样式
 * @property {string} MATRIX_DEFAULT - 矩阵元素默认背景样式
 */
const STYLES = {
    FORCE_COLOR_ADJUST: 'forced-color-adjust: none !important; -webkit-forced-color-adjust: none !important; color-scheme: light !important; print-color-adjust: exact !important;',
    MAIN_CARD: 'background-color: #ffffff !important;',
    BUTTON: 'background-color: rgba(254, 65, 141, 0.91) !important; color: rgb(255, 255, 255) !important;',
    COLOR_INDICATOR_BASE: 'border: 2px solid #5a684a !important; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15) !important;',
    MATRIX_DEFAULT: 'background-color: #fff !important;'
};

/**
 * 颜色配置数组 - 定义可选择的颜色列表
 * @constant {string[]} LIST_COLORS
 */
const LIST_COLORS = [
    '#ff3e3e', '#ff9100', '#ffff00',
    '#4dff00', '#0099ff', '#b700ff'
];

/**
 * 应用初始化入口点
 * 在 DOM 加载完成后执行所有初始化设置
 * @listens DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', function() {
    initElements();
    setupEventListeners();
    applyInitialStyles();
});

/**
 * 初始化并缓存 DOM 元素引用
 * 避免重复查询 DOM 提升性能
 * @function initElements
 */
function initElements() {
    cachedElements = {
        mainCard: document.getElementById('main-card'),
        listElements: document.querySelectorAll('.list-element'),
        resetButton: document.getElementById('reset-button'),
        generateButton: document.getElementById('generate-button'),
        colorIndicator: document.getElementById('color-indication'),
        matrixElements: document.querySelectorAll('.matrix-element'),
        imgContainer: document.getElementById('img-container')
    };

    // 更新全局变量引用
    generateButton = cachedElements.generateButton;
}

/**
 * 设置所有事件监听器
 * 包括颜色选择、按钮点击和矩阵填充事件
 * @function setupEventListeners
 */
function setupEventListeners() {
    // 列表元素点击事件（颜色选择）
    cachedElements.listElements.forEach((element) => {
        element.addEventListener('click', handleListElementClick);
    });

    // 按钮点击事件
    cachedElements.resetButton?.addEventListener('click', handleResetClick);
    cachedElements.generateButton?.addEventListener('click', handleGenerateClick);

    // 矩阵元素点击事件（填充颜色）
    cachedElements.matrixElements.forEach(element => {
        element.addEventListener('click', handleMatrixElementClick);
    });
}

/**
 * 应用初始样式设置
 * 强制设置白色背景以对抗浏览器深色模式
 * @function applyInitialStyles
 */
function applyInitialStyles() {
    // 主卡片背景强制设为白色
    if (cachedElements.mainCard) {
        cachedElements.mainCard.style.cssText = STYLES.MAIN_CARD + STYLES.FORCE_COLOR_ADJUST;
    }

    // 设置列表元素颜色
    cachedElements.listElements.forEach((element, index) => {
        if (LIST_COLORS[index]) {
            const colorStyle = `background-color: ${LIST_COLORS[index]} !important; ${STYLES.FORCE_COLOR_ADJUST}`;
            element.style.cssText = colorStyle;
        }
    });

    // 设置按钮样式
    if (cachedElements.resetButton) {
        cachedElements.resetButton.style.cssText = STYLES.BUTTON + STYLES.FORCE_COLOR_ADJUST;
    }
    if (cachedElements.generateButton) {
        cachedElements.generateButton.style.cssText = STYLES.BUTTON + STYLES.FORCE_COLOR_ADJUST;
    }

    // 设置颜色指示器
    if (cachedElements.colorIndicator) {
        const indicatorStyle = `background-color: ${currentColor} !important; ${STYLES.COLOR_INDICATOR_BASE} ${STYLES.FORCE_COLOR_ADJUST}`;
        cachedElements.colorIndicator.style.cssText = indicatorStyle;
    }

    // 设置矩阵元素默认背景
    cachedElements.matrixElements.forEach(element => {
        element.style.cssText = STYLES.MATRIX_DEFAULT + STYLES.FORCE_COLOR_ADJUST;
    });
}

/**
 * 处理列表元素点击事件（颜色选择）
 * @function handleListElementClick
 * @param {Event} event - 点击事件对象
 */
function handleListElementClick(event) {
    const clickedElement = event.currentTarget;

    // 获取点击元素的计算后背景色
    const computedStyle = window.getComputedStyle(clickedElement);
    const backgroundColor = computedStyle.backgroundColor;

    // 更新当前选中的颜色
    currentColor = backgroundColor;

    // 更新颜色指示器
    updateColorIndicator();

    // 更新列表元素的激活状态
    updateListActiveState(clickedElement);
}

/**
 * 更新颜色指示器显示当前选中的颜色
 * @function updateColorIndicator
 */
function updateColorIndicator() {
    if (cachedElements.colorIndicator) {
        const indicatorStyle = `background-color: ${currentColor} !important; ${STYLES.COLOR_INDICATOR_BASE} ${STYLES.FORCE_COLOR_ADJUST}`;
        cachedElements.colorIndicator.style.cssText = indicatorStyle;
    }
}

/**
 * 更新列表元素的激活状态
 * @function updateListActiveState
 * @param {HTMLElement} activeElement - 需要激活的元素
 */
function updateListActiveState(activeElement) {
    // 移除所有元素的激活状态
    cachedElements.listElements.forEach(element => {
        element.classList.remove('active');
    });

    // 为当前点击的元素添加激活状态
    activeElement.classList.add('active');
}

/**
 * 处理矩阵元素点击事件（填充颜色）
 * @function handleMatrixElementClick
 * @param {Event} event - 点击事件对象
 */
function handleMatrixElementClick(event) {
    // 如果没有选择颜色（当前为白色），则不执行操作
    if (currentColor === 'white') {
        return;
    }

    const clickedElement = event.currentTarget;

    // 为点击的矩阵元素填充当前选中的颜色
    const fillStyle = `background-color: ${currentColor} !important; ${STYLES.FORCE_COLOR_ADJUST}`;
    clickedElement.style.cssText = fillStyle;
}

/**
 * 处理重置按钮点击事件
 * 清空所有矩阵填充并重置颜色选择
 * @function handleResetClick
 */
function handleResetClick() {
    // 重置所有矩阵元素的背景色
    cachedElements.matrixElements.forEach(element => {
        element.style.cssText = STYLES.MATRIX_DEFAULT + STYLES.FORCE_COLOR_ADJUST;
    });

    // 重置当前颜色为白色
    currentColor = 'white';

    // 重置颜色指示器
    if (cachedElements.colorIndicator) {
        const indicatorStyle = `background-color: ${currentColor} !important; ${STYLES.COLOR_INDICATOR_BASE} ${STYLES.FORCE_COLOR_ADJUST}`;
        cachedElements.colorIndicator.style.cssText = indicatorStyle;
    }

    // 移除所有列表元素的激活状态
    cachedElements.listElements.forEach(element => {
        element.classList.remove('active');
    });
}

/**
 * 处理生成图片按钮点击事件
 * 将当前矩阵状态生成并下载为 PNG 图片
 * @function handleGenerateClick
 */
function handleGenerateClick() {
    if (!cachedElements.imgContainer || !generateButton) return;

    // 保存原始按钮文本并更新按钮状态
    const originalText = generateButton.textContent;
    setGenerateButtonState('生成中...', true);

    try {
        // 创建临时容器用于高质量截图
        const tempContainer = createTempContainer();

        // 克隆需要截图的内容
        cloneContainerContent(tempContainer);

        // 执行截图
        performScreenshot(tempContainer)
            .then(() => {
                // 恢复按钮状态
                setGenerateButtonState(originalText, false);
            })
            .catch(error => {
                handleScreenshotError(error, originalText);
            });

    } catch (error) {
        console.error('生成图片时发生错误:', error);
        setGenerateButtonState(originalText, false);
        alert('生成图片失败，请重试');
    }
}

/**
 * 设置生成按钮的状态
 * @function setGenerateButtonState
 * @param {string} text - 按钮显示的文本
 * @param {boolean} disabled - 按钮是否禁用
 */
function setGenerateButtonState(text, disabled) {
    if (generateButton) {
        generateButton.textContent = text;
        generateButton.disabled = disabled;
    }
}

/**
 * 创建用于截图的临时容器
 * 通过缩放和离屏渲染实现高质量截图
 * @function createTempContainer
 * @returns {HTMLElement} 临时容器元素
 */
function createTempContainer() {
    const tempContainer = document.createElement('div');
    const containerStyles = `
        position: fixed;
        top: -9999px;
        left: -9999px;
        width: ${cachedElements.imgContainer.offsetWidth * 2}px;
        height: ${cachedElements.imgContainer.offsetHeight * 2}px;
        transform: scale(2);
        transform-origin: top left;
        background-color: white;
        z-index: 9999;
        ${STYLES.FORCE_COLOR_ADJUST}
    `;

    tempContainer.style.cssText = containerStyles;
    document.body.appendChild(tempContainer);

    return tempContainer;
}

/**
 * 克隆容器内容到临时容器
 * @function cloneContainerContent
 * @param {HTMLElement} tempContainer - 临时容器
 * @returns {HTMLElement} 克隆的容器内容
 */
function cloneContainerContent(tempContainer) {
    const clonedContainer = cachedElements.imgContainer.cloneNode(true);

    // 设置克隆容器的样式
    clonedContainer.style.cssText = `
        width: 100%;
        height: 100%;
        transform: none;
        ${STYLES.FORCE_COLOR_ADJUST}
    `;

    tempContainer.appendChild(clonedContainer);
    return clonedContainer;
}

/**
 * 执行截图操作
 * 使用 html2canvas 库生成图片
 * @function performScreenshot
 * @param {HTMLElement} tempContainer - 临时容器
 * @returns {Promise} 截图完成的 Promise 对象
 */
function performScreenshot(tempContainer) {
    return new Promise((resolve, reject) => {
        // html2canvas 配置选项
        const canvasOptions = {
            backgroundColor: '#ffffff',
            scale: 1,
            useCORS: true,
            logging: false,
            allowTaint: false,
            foreignObjectRendering: false,
            removeContainer: true
        };

        // 执行截图
        html2canvas(tempContainer, canvasOptions)
            .then(canvas => {
                downloadImage(canvas);
                cleanup(tempContainer);
                resolve();
            })
            .catch(error => {
                cleanup(tempContainer);
                reject(error);
            });
    });
}

/**
 * 下载生成的图片
 * @function downloadImage
 * @param {HTMLCanvasElement} canvas - 包含图片数据的画布元素
 */
function downloadImage(canvas) {
    const imageURL = canvas.toDataURL('image/png');

    const downloadLink = document.createElement('a');
    downloadLink.href = imageURL;
    downloadLink.download = `mbti_matrix_${new Date().getTime()}.png`;

    // 创建下载链接并触发点击
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

/**
 * 清理临时元素
 * @function cleanup
 * @param {HTMLElement} tempContainer - 需要清理的临时容器
 */
function cleanup(tempContainer) {
    if (tempContainer && tempContainer.parentNode) {
        document.body.removeChild(tempContainer);
    }
}

/**
 * 处理截图过程中的错误
 * @function handleScreenshotError
 * @param {Error} error - 错误对象
 * @param {string} originalText - 原始按钮文本
 */
function handleScreenshotError(error, originalText) {
    console.error('截图失败:', error);
    alert('生成图片失败，请重试');

    // 确保恢复按钮状态
    setGenerateButtonState(originalText, false);
}