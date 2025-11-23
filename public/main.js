let currentColor = 'white';
let generateButton;

document.addEventListener('DOMContentLoaded', function() {
    const mainCard = document.getElementById('main-card');
    if (mainCard) {
        mainCard.style.cssText = 'background-color: #ffffff !important;';
    }
    
    const listElements = document.querySelectorAll('.list-element');
    const listColors = [
        '#ff3e3e',
        '#ff9100',
        '#ffff00',
        '#4dff00',
        '#0099ff',
        '#b700ff'
    ];
    
    listElements.forEach((element, index) => {
        if (listColors[index]) {
            // 为x5内核添加额外的保护措施
            element.style.cssText = 'background-color: ' + listColors[index] + ' !important; forced-color-adjust: none !important; -webkit-forced-color-adjust: none !important;';
        }
        element.addEventListener('click', handleListElementClick);
    });
    
    const resetButton = document.getElementById('reset-button');
    generateButton = document.getElementById('generate-button');
    if (resetButton) {
        resetButton.style.cssText = 'background-color: rgba(254, 65, 141, 0.91) !important; color: rgb(255, 255, 255) !important;';
        resetButton.addEventListener('click', handleResetClick);
    }
    if (generateButton) {
        generateButton.style.cssText = 'background-color: rgba(254, 65, 141, 0.91) !important; color: rgb(255, 255, 255) !important;';
        generateButton.addEventListener('click', handleGenerateClick);
    }
    
    const colorIndicator = document.getElementById('color-indication');
    // 使用内联样式保护，防止x5内核深色模式强制更改颜色
    colorIndicator.style.cssText = 'background-color: ' + currentColor + ' !important; border: 2px solid #5a684a !important; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15) !important;';
    
    const matrixElements = document.querySelectorAll('.matrix-element');
    matrixElements.forEach(element => {
        element.addEventListener('click', handleMatrixElementClick);
    });
});

function handleListElementClick(event) {
    const clickedElement = event.currentTarget;
    
    const computedStyle = window.getComputedStyle(clickedElement);
    const backgroundColor = computedStyle.backgroundColor;
    
    currentColor = backgroundColor;
    
    const colorIndicator = document.getElementById('color-indication');
    colorIndicator.style.cssText = 'background-color: ' + currentColor + ' !important;';
    
    const listElements = document.querySelectorAll('.list-element');
    listElements.forEach(element => {
        element.classList.remove('active');
    });
    
    clickedElement.classList.add('active');
}

function handleMatrixElementClick(event) {
    if (currentColor === 'white') {
        return;
    }
    
    const clickedElement = event.currentTarget;
    
    clickedElement.style.cssText = 'background-color: ' + currentColor + ' !important;';
}

function handleResetClick() {
    const matrixElements = document.querySelectorAll('.matrix-element');
    matrixElements.forEach(element => {
        element.style.cssText = 'background-color: rgba(135, 12, 12, 0.05) !important;';
    });
    
    currentColor = 'white';
    
    const colorIndicator = document.getElementById('color-indication');
    colorIndicator.style.cssText = 'background-color: ' + currentColor + ' !important; border: 2px solid #5a684a !important; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15) !important;';
    
    const listElements = document.querySelectorAll('.list-element');
    listElements.forEach(element => {
        element.classList.remove('active');
    });
}

function handleGenerateClick() {
    const imgContainer = document.getElementById('img-container');
    
    const originalText = generateButton.textContent;
    generateButton.textContent = '生成中...';
    generateButton.disabled = true;
    
    const tempContainer = document.createElement('div');
    tempContainer.style.cssText = `
        position: fixed;
        top: -9999px;
        left: -9999px;
        width: ${imgContainer.offsetWidth * 2}px;
        height: ${imgContainer.offsetHeight * 2}px;
        transform: scale(2);
        transform-origin: top left;
        background-color: white;
        z-index: 9999;
    `;
    
    const clonedContainer = imgContainer.cloneNode(true);
    clonedContainer.style.width = '100%';
    clonedContainer.style.height = '100%';
    clonedContainer.style.transform = 'none';
    
    tempContainer.appendChild(clonedContainer);
    document.body.appendChild(tempContainer);
    
    html2canvas(tempContainer, {
        backgroundColor: '#ffffff',
        scale: 1,
        useCORS: true,
        logging: false,
        allowTaint: false,
        foreignObjectRendering: false,
        removeContainer: true
    }).then(canvas => {
        const imageURL = canvas.toDataURL('image/png');
        
        const downloadLink = document.createElement('a');
        downloadLink.href = imageURL;
        downloadLink.download = 'mbti_matrix_' + new Date().getTime() + '.png';
        
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        document.body.removeChild(tempContainer);
        
        generateButton.textContent = originalText;
        generateButton.disabled = false;
        
    }).catch(error => {
        console.error('截图失败:', error);
        alert('生成图片失败，请重试 QwQ ');
        
        if (tempContainer.parentNode) {
            document.body.removeChild(tempContainer);
        }
        
        generateButton.textContent = originalText;
        generateButton.disabled = false;
    });
}