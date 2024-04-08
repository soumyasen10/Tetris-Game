document.addEventListener('DOMContentLoaded',()=>{
    const grid=document.querySelector(".grid")
    let squares=Array.from(document.querySelectorAll('.grid div'))

   const scoreDisplay= document.querySelector('#score')
   const startBtn=document.querySelector('#start-button')
   let timerId
   const width=10
  let nextRandom=0
  let score=0
  const colors=[
    'orange',
    'red',
    'purple',
    'green',
    'blue'
  ]


//    The Tetrominoes
const lTetromino = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
  ]

  const zTetromino = [
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1],
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1]
  ]

  const tTetromino = [
    [1,width,width+1,width+2],
    [1,width+1,width+2,width*2+1],
    [width,width+1,width+2,width*2+1],
    [1,width,width+1,width*2+1]
  ]

  const oTetromino = [
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1]
  ]

  const iTetromino = [
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3],
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3]
  ]


  const theTetrominoes=[lTetromino,zTetromino,tTetromino,oTetromino,iTetromino]

let currentPosition=4
let currentRotation=0

// randomly select a tetrimino and its rotation
let random=Math.floor(Math.random()*theTetrominoes.length)

let current=theTetrominoes[random][currentRotation]


// draw the  rotation in the tetromino
function draw(){
    current.forEach(index=>{
        squares[currentPosition+index].classList.add('tetromino')
        squares[currentPosition+index].style.backgroundColor=colors[random] 
    })
}

// undraw the tetrimino
function undraw(){
    current.forEach(index=>{
        squares[currentPosition+index].classList.remove('tetromino')
        squares[currentPosition+index].style.backgroundColor=''
    })
}

// make the tetrimino move down every second
// timerId=setInterval(movedown,1000)

// assign function to keywords
function control(e){
  if(e.keyCode===37){
    moveleft()
  }else if(e.keyCode===38){
    rotate()
  }else if(e.keyCode===39){
    moveRight()
  }else if(e.keyCode===40){
    movedown()
  }
}
document.addEventListener('keydown',control)


// move-down function
function movedown(){
    undraw()
    currentPosition+=width
    draw()
    freez()
}


// freez tetrimino
function freez(){
    if(current.some(index=> squares[currentPosition+index+width].classList.contains('taken'))){
        current.forEach(index=>squares[currentPosition+index].classList.add('taken'))


// start a new tetrimino falling
random=nextRandom
nextRandom=Math.floor(Math.random()*theTetrominoes.length)
current=theTetrominoes[random][currentRotation]
currentPosition=4
draw()
displayShape()
addscore()
gameover()
    }
}

// move the tetrinimo left, unless is at the edge or there is a blockage
function moveleft(){
  undraw()
  const isAtLeftEdge=current.some(index=>(currentPosition+index)%width===0)

  if(!isAtLeftEdge) currentPosition -=1
  if(current.some(index=>squares[currentPosition+index].classList.contains('taken'))){
    currentPosition+=1
  }

  draw()

}

// move the tetrimino right,unless is at the edge or there is a blockage
function moveRight(){
  undraw()
  const isAtRightEdge= current.some(index=>(currentPosition+index)%width===width-1)

  if(!isAtRightEdge) currentPosition+=1

  if(current.some(index=>squares[currentPosition+index].classList.contains('taken'))){
    currentPosition -=1
  }

draw()
}


// rotate the teromino
function rotate(){
  undraw()
  currentRotation++
  if(currentRotation===current.length){
    currentRotation=0
  }

  current=theTetrominoes[random][currentRotation]
  draw()
}

// show up-next teromino in mini-grid display
const displaySquares=document.querySelectorAll('.mini-grid div')
const displayWidth=4
let displayIndex=0

// the teromino without rotation
const upNextTetrominos=[
  [1,displayWidth+1,displayWidth*2+1,2],  //ltetromino
  [0,displayWidth,displayWidth+1,displayWidth*2+1], //z
  [1,displayWidth,displayWidth+1,displayWidth+2],    //t
  [0,1,displayWidth,displayWidth+1],             //o
  [1,displayWidth+1,displayWidth*2+1,displayWidth*3+1]   //i
]
// display the shape of the tetromino in mini grid
function displayShape(){
  displaySquares.forEach(square=>{
    square.classList.remove('tetromino')
    square.style.backgroundColor=''

  })
  upNextTetrominos[nextRandom].forEach(index=>{
    displaySquares[displayIndex+index].classList.add('tetromino')
    displaySquares[displayIndex+index].style.backgroundColor=colors[nextRandom]
  })
}


// add function to the button
startBtn.addEventListener('click',()=>{
  if(timerId){
    clearInterval(timerId)
    timerId=null
  }else{
    timerId=setInterval(movedown,1000)
    nextRandom=Math.floor(Math.random()*theTetrominoes.length)
    displayShape()
  }
})


// add score
function addscore(){
  for(let i=0;i<199;i+=width){
    const row=[i,i+1,i+2,i+3,i+4,i+5,i+6,i+7,i+8,i+9]

    if (row.every(index=>squares[index].classList.contains('taken'))){
      score+=10
      scoreDisplay.innerHTML=score
      row.forEach(index=>{
        squares[index].classList.remove('taken')
        squares[index].classList.remove('tetromino')
        squares[index].style.backgroundColor=''
      })
      const squaresRemoved=squares.splice(i,width)
    squares=squaresRemoved.concat(squares)
    squares.forEach(cell=>grid.appendChild(cell))
    }
  }
}


// game-over function
function gameover(){
  if (current.some(index=>squares[currentPosition+index].classList.contains('taken'))){
    scoreDisplay.innerHTML="END"
    clearInterval(timerId)
  }
}


})