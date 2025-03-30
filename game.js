const emojis = ["🤪","🤪","🤬","🤬","🥶","🥶","🙊","🙊","🙀","🙀","🤢","🤢","🤧","🤧","😱","😱"]
let score = 0;
const maxScore = 8;

let moves=0
const movesSpan = document.getElementById("mosse")
movesSpan.innerHTML=moves

var rand_emojis = emojis.sort( () => (Math.random() > .5) ? 2 : -1)

for (var i=0; i<emojis.length; i++) {

    let box = document.createElement('div')
    box.className='item'
    box.innerHTML= rand_emojis[i]
    document.querySelector('.game').appendChild(box)
    box.onclick = function() {

        moves++
        movesSpan.innerHTML=moves

        this.classList.add('boxOpen')
        setTimeout(function() {
            if(document.querySelectorAll('.boxOpen').length > 1) {

                if(document.querySelectorAll('.boxOpen')[0].innerHTML == document.querySelectorAll('.boxOpen')[1].innerHTML) {

                    document.querySelectorAll('.boxOpen')[0].classList.add('boxMatch')
                    document.querySelectorAll('.boxOpen')[1].classList.add('boxMatch')

                    document.querySelectorAll('.boxOpen')[1].classList.remove('boxOpen')
                    document.querySelectorAll('.boxOpen')[0].classList.remove('boxOpen')
                    score=score+1;

                    if (score==8) {
                        alert("YOU WIN!")
                    }
                }

                else {

                    document.querySelectorAll('.boxOpen')[1].classList.remove('boxOpen')
                    document.querySelectorAll('.boxOpen')[0].classList.remove('boxOpen')

                }
            }
        },500)
    }
}