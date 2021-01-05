/**
 * The custom element web component module.
 *
 * @author Tamim Jabr <tj222kg@student.lnu.se>
 * @version 1.0.0
 */

import moment from 'moment'

moment.locale('sv')
// Photo by RetroSupply on Unsplash
const backgroundURL = (new URL('images/background.jpg', import.meta.url)).href

/**
 * Define template.
 */
const template = document.createElement('template')
template.innerHTML = `
  <style>
    #desktop{
      background-color: #ffdd93;
      background-image: url("${backgroundURL}");
      background-repeat: no-repeat;
      background-position: center center;
      background-size:cover;
      height: 100vh;
      width:100vw;
      overflow: hidden;
      position: relative;
    }
    #desktopBar{
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100vw;
      height: 40px;
      background-color:  rgba(196, 182, 182,0.8);     
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      gap: 15px;
    } 
    my-window-com{
      position: absolute;
      top: 50px;
      left: 50px;
    }
    my-window-com:focus{
    z-index:200;
    }
    button{
      height: 100%;
      margin-left: 10px;
      border:none;
      user-select: none;
      background-color:rgba(196, 182, 182,0.8);  
      font-size: 1.4rem;
    }
    #timeDiv{
      color: white;
      background-color: rgb(97, 91, 91);
      padding:0 10px;
      margin-left: auto;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
  </style>
  <div id='desktop'>
    <div id='desktopBar'>
     <button id="memoryBtn">🧠</button>
     <button id="chattBtn">💬</button>
     <button id="TicBtn">❌⭕</button>
     <div id='timeDiv'>
      <time id='time'></time>
      <time id='date'></time>
     </div>
    </div>
  </div>
`

/**
 * Define custom element.
 */
customElements.define('my-pwd-com',
  /**
   *
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
      this._desktop = this.shadowRoot.querySelector('#desktop')
      this._memoryBtn = this.shadowRoot.querySelector('#memoryBtn')
      this._chattBtn = this.shadowRoot.querySelector('#chattBtn')
      this._ticBtn = this.shadowRoot.querySelector('#TicBtn')
      this._time = this.shadowRoot.querySelector('#time')
      this._date = this.shadowRoot.querySelector('#date')

      this._topWindowZ = 2
      this._top = 50
      this._left = 50
      this._timeoutId = null
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this._memoryBtn.addEventListener('click', this._memoryBtnClick.bind(this))
      this._desktop.addEventListener('closewindow', this._handleClosingWindow.bind(this))
      this._ticBtn.addEventListener('click', this._ticBtnClick.bind(this))
      this._chattBtn.addEventListener('click', this._chattBtnClick.bind(this))
      this._timeUpdate()
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {
      this._memoryBtn.removeEventListener('click', this._memoryBtnClick)
      this._desktop.removeEventListener('closewindow', this._handleClosingWindow)
      this._ticBtn.removeEventListener('click', this._ticBtnClick)
      this._chattBtn.removeEventListener('click', this._chattBtnClick)
      clearTimeout(this._timeoutId)
    }

    /**
     * Create a new window that contains the passed parameter as slot.
     *
     * @param {string} component - the type of the component to create inside the window.
     */
    _createWindow (component) {
      const myWindows = Array.from(this.shadowRoot.querySelectorAll('my-window-com'))
      // if there is no window in the desktop so start adding new ones from
      if (myWindows.length === 0) {
        this._top = 50
        this._left = 50
      }
      const componentElement = document.createElement(component)
      const myWindow = document.createElement('my-window-com')
      // prevent creating windows exakt on eachother
      myWindow.style.top = (this._top + 10) + 'px'
      myWindow.style.left = (this._left + 10) + 'px'
      myWindow.style.zIndex = this._topWindowZ

      myWindow.addEventListener('click', this._handleFocus.bind(this))

      myWindow.appendChild(componentElement)
      this._desktop.appendChild(myWindow)

      // increase the top and left for the next created window
      this._top = this._top + 10
      this._left = this._left + 15
    }

    /**
     * Handling click on a window by bringing it to the top.
     *
     * @param {MouseEvent} event - click event.
     */
    _handleFocus (event) {
      // Bring the window to the top regardless if we click on it or on another element in it.
      event.target.closest('my-window-com').style.zIndex = this._topWindowZ
      this._topWindowZ++
    }

    /**
     * Handle Closing a window by removing the event listener.
     *
     * @param {CustomEvent} event - fired when closing a window
     */
    _handleClosingWindow (event) {
      // removing the event listner from the closed window
      event.target.removeEventListener('click', this._handleFocus)
    }

    /**
     * Handle click on the tictactoe game Icon.
     */
    _ticBtnClick () {
      this._createWindow('my-tic-tac-toe')
    }

    /**
     * Handle click on the memory game Icon.
     */
    _memoryBtnClick () {
      this._createWindow('my-memory-game')
    }

    /**
     * Handle click on the chat app Icon.
     */
    _chattBtnClick () {
      this._createWindow('my-chat-app')
    }

    /**
     * Update the time and date on the desktop.
     */
    _timeUpdate () {
      this._timeoutId = setTimeout(() => {
        this._time.textContent = moment().format('HH:mm:ss')
        this._date.textContent = moment().format('YYYY/M/D')
        this._timeUpdate()
      }, 1000)
    }
  }
)
