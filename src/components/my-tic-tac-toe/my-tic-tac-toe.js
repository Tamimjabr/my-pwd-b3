/**
 * my-cookie-policy component.
 *
 * @author Tamim Jabr <tj222k@student.lnu.se>
 * @version 1.0.0
 */
/**
 * Define template.
 */
const template = document.createElement('template')
template.innerHTML = `
<style>
:host{  
    width:100%;
    height:100%; 
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align:center;
    box-sizing: border-box;
}
#game-board{
  width:300px;
  height:300px;
  background-color: teal;
  display: grid;
  grid-template-columns: repeat(3,100px);
  grid-template-rows: repeat(3,100px);
}
h1{
  color:green;
}
.cell{
  width:auto;
  height:auto;
  background-color: #ffffff;
  border: 1px solid black;
  display:flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
}

.cell:first-child,
.cell:nth-child(2),
.cell:nth-child(3){
border-top: none;
}
.cell:nth-child(1),
.cell:nth-child(4),
.cell:nth-child(7){
border-left: none;
}
.cell:nth-child(7),
.cell:nth-child(8),
.cell:nth-child(9){
border-bottom: none;
}
.cell:nth-child(3),
.cell:nth-child(6),
.cell:nth-child(9){
border-right:  none;
}
.cell.x, .cell.o{
cursor: not-allowed;
}
.cell.x::before,.cell.x::after{
content: '';
width: 15px ;
height: 90px;
background-color: #ac3501;
border-radius: 10px;
position:absolute;
}
.cell.x::before{
  transform: rotate(45deg);
}
.cell.x::after{
  transform: rotate(-45deg);
}
.cell.o::before{
content: '';
width: 90px ;
height: 90px;
background-color: #8ab446;
border-radius: 50%;
}
.cell:not(.x):not(.o):hover{
background-color: #e2e0d0;
}
div#result{
  display: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 22px;
  left: 0; 
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  color:white;
  text-align: center;
}
div#result.show{
  display: flex;
}
button{
    margin: 10px;
    padding:10px;
    background-color: green;
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    font-size:1.2rem;
    border-radius:10px;
    outline: none;
    color:white
  }
</style>
<h1 id='turn'>It is X turn!</h1>
<div id='game-board'>
  <div class="cell"></div>
  <div class="cell"></div>
  <div class="cell"></div>
  <div class="cell"></div>
  <div class="cell"></div>
  <div class="cell"></div>
  <div class="cell"></div>
  <div class="cell"></div>
  <div class="cell"></div>
</div>
<div id='result'>
<h2>tamim</h2>
<button id='restartBtn'>Restart</button>
</div>
`
/**
 * Define custom element.
 */
customElements.define('my-tic-tac-toe',
  /**
   * Represents a tic-tac-toe game.
   */
  class extends HTMLElement {
    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      // Attach a shadow DOM tree to this element and
      // append the template to the shadow root.
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))
      this._gameBoard = this.shadowRoot.querySelector('#game-board')
      this._resultDiv = this.shadowRoot.querySelector('#result')
      this._resultText = this.shadowRoot.querySelector('#result>h2')
      this._restartBtn = this.shadowRoot.querySelector('#restartBtn')
      this._whoseTurn = this.shadowRoot.querySelector('#turn')
      this._turn = 'x'

      this._handleClick = this._handleClick.bind(this)
      this._handleRestart = this._handleRestart.bind(this)
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this._startGame()
      this._restartBtn.addEventListener('click', this._handleRestart)
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {
      this._restartBtn.removeEventListener('click', this._handleRestart)
      // remove the event listner from cells when removing the component
      const cells = this.shadowRoot.querySelectorAll('.cell')
      cells.forEach(cell => {
        cell.removeEventListener('click', this._handleClick, { once: true })
      })
    }

    /**
     * Starts the game by removing class x/o and adding event listner for every cell.
     */
    _startGame () {
      // this._resultText.textContent = ''
      const cells = this.shadowRoot.querySelectorAll('.cell')
      // remove x, o class from all cells
      Array.from(cells).forEach(cell => {
        cell.classList.remove('x')
        cell.classList.remove('o')
        cell.addEventListener('click', this._handleClick, { once: true })
      })
    }

    /**
     * Handles click on a cell by adding the class that belongs to the current player, check for wining/draw and switch players.
     *
     * @param {MouseEvent} event - The click event.
     */
    _handleClick (event) {
      const cells = this.shadowRoot.querySelectorAll('.cell')
      // add the class that belongs to the current player
      if (this._turn === 'x') {
        event.target.classList.add('x')
      } else if (this._turn === 'o') {
        event.target.classList.add('o')
      }
      // check if there is no cell left to choose
      const draw = Array.from(cells).every(cell => {
        return cell.classList.contains('x') || cell.classList.contains('o')
      })

      if (this._checkWinning()) {
        this._resultText.textContent = `The winner is : ${this._turn.toUpperCase()}`
        cells.forEach(cell => {
          cell.removeEventListener('click', this._handleClick, { once: true })
        })
        this._resultDiv.classList.add('show')
      } else if (draw) {
        this._resultText.textContent = 'It\'s a draw'
        cells.forEach(cell => {
          cell.removeEventListener('click', this._handleClick, { once: true })
        })
        this._resultDiv.classList.add('show')
      } else {
        this._swapPlayers()
      }
    }

    /**
     * Swaps turns between the two players.
     */
    _swapPlayers () {
      if (this._turn === 'x') {
        this._turn = 'o'
        this._whoseTurn.textContent = 'It is O turn!'
      } else if (this._turn === 'o') {
        this._turn = 'x'
        this._whoseTurn.textContent = 'It is X turn!'
      }
    }

    /**
     * Checks for winning.
     *
     * @returns {boolean} true/ false - true if the current player win and false if not.
     */
    _checkWinning () {
      // the array with all winning possiblities
      const winningPossibilities = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
      ]
      const cells = this.shadowRoot.querySelectorAll('.cell')
      // .some because it's enough to just have one to win
      return winningPossibilities.some(possibilty => {
        return possibilty.every(index => {
          // check if the three cells with indexes in possibility contains the same class name.
          return cells[index].classList.contains(this._turn)
        })
      })
    }

    /**
     * Handles clicking on the Restart button by removing the result container and start the game again.
     *
     * @param {MouseEvent} event - The click event.
     */
    _handleRestart (event) {
      // hide the result container
      this._resultDiv.classList.remove('show')
      this._startGame()
    }
  })
