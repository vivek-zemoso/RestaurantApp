const rightColumn = document.getElementById('menu');
rightColumn.style.height = `${window.innerHeight}`;

const closeBtn = document.getElementsByClassName('close-btn')[0];
console.log(closeBtn);
closeBtn.addEventListener('mouseover', () => {
    closeBtn.classList.add('shadow');
});

closeBtn.addEventListener('mouseout', () => {
    closeBtn.classList.remove('shadow');
});