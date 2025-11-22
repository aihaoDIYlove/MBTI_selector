let currentColor = 'white';
let generateButton;

document.addEventListener('DOMContentLoaded', function() {
    const colorIndicator = document.getElementById('color-indication');
    colorIndicator.style.backgroundColor = currentColor;
    
    const listElements = document.querySelectorAll('.list-element');
    listElements.forEach(element => {
        element.addEventListener('click', handleListElementClick);
    });
    
    const matrixElements = document.querySelectorAll('.matrix-element');
    matrixElements.forEach(element => {
        element.addEventListener('click', handleMatrixElementClick);
    });
    
    const resetButton = document.getElementById('reset-button');
    resetButton.addEventListener('click', handleResetClick);
    
    generateButton = document.getElementById('generate-button');
    generateButton.addEventListener('click', handleGenerateClick);
});

function handleListElementClick(event) {
    const clickedElement = event.currentTarget;
    
    const computedStyle = window.getComputedStyle(clickedElement);
    const backgroundColor = computedStyle.backgroundColor;
    
    currentColor = backgroundColor;
    
    const colorIndicator = document.getElementById('color-indication');
    colorIndicator.style.backgroundColor = currentColor;
    
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
    
    clickedElement.style.backgroundColor = currentColor;
}

function handleResetClick() {
    const matrixElements = document.querySelectorAll('.matrix-element');
    matrixElements.forEach(element => {
        element.style.backgroundColor = 'rgba(135, 12, 12, 0.05)';
    });
    
    currentColor = 'white';
    
    const colorIndicator = document.getElementById('color-indication');
    colorIndicator.style.backgroundColor = currentColor;
    
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