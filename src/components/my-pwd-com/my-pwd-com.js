/**
 * The custom element web component module.
 *
 * @author Tamim Jabr <tj222kg@student.lnu.se>
 * @version 1.0.0
 */

// Photo by César Couto on Unsplash
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
      height: 100vh;
      width:100vw;
      position: relative;
    }
    #desktopBar{
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100vw;
      height: 40px;
      background-color:  #c4b6b6;
    } 
    my-window-com{
      position: absolute;
    	top: 50px;
	    left: 50px;
    }
  </style>
  <div id='desktop'>
   <my-window-com><my-memory-game></my-memory-game></my-window-com>
   <div id='desktopBar'>
   <button id="memoryBtn">Memory</button>
   <button id="chattBtn"> Chatt</button>
   <button id="TicBtn"> TicTacToc</button>
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
      this._memoryBtn=this.shadowRoot.querySelector('#memoryBtn')
      this._chattBtn=this.shadowRoot.querySelector('#chattBtn')
      this._TicBtn=this.shadowRoot.querySelector('#TicBtn')
    }

    /**
     * Watches the attributes "text" and "speed" for changes on the element.
     *
     * @returns {string[]} A string array of attributes to monitor.
     */
    static get observedAttributes () {
      return []
    }

    /**
     * Called by the browser engine when an attribute changes.
     *
     * @param {string} name of the attribute.
     * @param {any} oldValue the old attribute value.
     * @param {any} newValue the new attribute value.
     */
    attributeChangedCallback (name, oldValue, newValue) {

    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this._memoryBtn.addEventListener('click', this._memoryBtnClick.bind(this))
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {

    }
    _memoryBtnClick(){
      const memory=document.createElement('my-memory-game')
      const myWindow=document.createElement('my-window-com')
      myWindow.appendChild(memory)
      this._desktop.appendChild(myWindow)
    }
  }
)
