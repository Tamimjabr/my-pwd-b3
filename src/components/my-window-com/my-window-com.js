/**
 * The custom element web component module.
 *
 * @author Tamim Jabr <tj222kg@student.lnu.se>
 * @version 1.0.0
 */

/**
 * Define template.
 */
const template = document.createElement('template')
template.innerHTML = `
<style>
#window{
  width: 350px;
  height: 500px;
  border: 2px solid balck;
  border-radius: 5px;
  background-color: rgb(241, 202, 165);
  resize: both;
  overflow: auto;
  position: absolute; 
}
#toolBar{
  background-color: gray;
  border: 1px solid balck;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-end;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 1;
}
#content{
  display: flex;
  justify-content: center;
  align-items: center;
}
#close{
  color:red;
  font-weight: bolder; 
}
</style>

<div id="window">
  <div id='toolBar'>
   <button id="close">X</button>
  </div>
  <div id="content">
      <slot></slot>
  </div>
</div>
`

/**
 * Define custom element.
 */
customElements.define(
  'my-window-com',
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
      this.attachShadow({ mode: 'open' }).appendChild(
        template.content.cloneNode(true)
      )
      this._closeBtn = this.shadowRoot.querySelector('#close')
      this._window = this.shadowRoot.querySelector('#window')
      this._toolBar = this.shadowRoot.querySelector('#toolBar')
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
      this._closeBtn.addEventListener('click', this._handleCloseBtn.bind(this))
      this._dragElement(this)
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {
      this._closeBtn.removeEventListener('click', this._handleCloseBtn)
    }

    /**
     * Handle click on the close button.
     */
    _handleCloseBtn () {
      const myCustomEventListner = new CustomEvent('closewindow', {
        bubbles: true
      })
      // trigger the event
      this.dispatchEvent(myCustomEventListner)
      this.remove()
    }

    /**
     * @param elmnt
     * @param e
     */
    _dragElement (elmnt) {
      /**
       * @param e
       */
      const dragMouseDown = (e) => {
        e = e || window.event
        e.preventDefault()
        // get the mouse cursor position at startup:
        pos3 = e.clientX
        pos4 = e.clientY
        document.body.style.cursor = 'none'

        document.addEventListener('mouseup', closeDragElement)
        // call a function whenever the cursor moves:
        document.addEventListener('mousemove', elementDrag)
      }

      /**
       * @param e
       */
      const elementDrag = (e) => {
        e.preventDefault()
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX
        pos2 = pos4 - e.clientY
        pos3 = e.clientX
        pos4 = e.clientY

        if ((elmnt.offsetTop - pos2) < 0 || (elmnt.offsetTop - pos2) > document.documentElement.clientHeight) {
          // prevent the element from going down outside the desktop
          elmnt.style.top = (elmnt.offsetTop - pos2) > document.documentElement.clientHeight ? (document.documentElement.clientHeight - 500) + 'px' : '0'
          elmnt.style.left = (elmnt.offsetLeft - pos1) + 'px'
        } else {
          elmnt.style.top = (elmnt.offsetTop - pos2) + 'px'
          elmnt.style.left = (elmnt.offsetLeft - pos1) + 'px'
        }
        if ((elmnt.offsetLeft - pos1) < 0 || (elmnt.offsetLeft - pos1) > document.documentElement.clientWidth) {
          elmnt.style.top = (elmnt.offsetTop - pos2) + 'px'
          // prevent the element from going right outside the desktop
          elmnt.style.left = (elmnt.offsetLeft - pos1) > document.documentElement.clientHeight ? (document.documentElement.clientWidth - 400) + 'px' : '0'
        } else {
          elmnt.style.top = (elmnt.offsetTop - pos2) + 'px'
          elmnt.style.left = (elmnt.offsetLeft - pos1) + 'px'
        }
      }

      /**
       * @param e
       */
      const closeDragElement = (e) => {
        // stop moving when mouse button is released:
        document.body.style.cursor = 'default'
        document.removeEventListener('mouseup', closeDragElement)
        document.removeEventListener('mousemove', elementDrag)
      }
      let pos1 = 0
      let pos2 = 0
      let pos3 = 0
      let pos4 = 0
      // todo has changed
      if (elmnt.shadowRoot.querySelector('#toolBar')) {
        // if present, the header is where you move the DIV from:
        elmnt.shadowRoot.querySelector('#toolBar').addEventListener('mousedown', dragMouseDown.bind(this))
      } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.addEventListener('mousedown', dragMouseDown.bind(this))
      }
    }
  }
)
