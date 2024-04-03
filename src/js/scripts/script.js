let bg = document.querySelector('.hero__bg')


bg.addEventListener('resize', function (e) {
   let bgTop = getComputedStyle(bg).top

})
function bgAdupt() {
   let block = document.querySelector('.hero__block')
   let bg = document.querySelector('.hero__bg')
   let bgTop = parseFloat(getComputedStyle(bg).top)
   let blockSize = block.offsetHeight
   let amount = bgTop / blockSize * -100
   bg.style.height = 100 + amount + '%'
}
window.addEventListener('load', function (e) {
   bgAdupt()
   window.addEventListener('resize', bgAdupt)
})
