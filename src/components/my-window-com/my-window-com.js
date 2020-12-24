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
:host{
  width: 350px;
  height: 500px;
}
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
     * Make the elmnt draggable.
     *
     * @param {object} elmnt - the object representing the element that we want to be draggable.
     */
    _dragElement (elmnt) {
      let aX = 0
      let aY = 0
      let posX = 0
      let posY = 0
      /**
       * Adding the event on mousemove and mouseup.
       *
       * @param {MouseEvent} event - event fired on mouse down.
       */
      const dragMouseDown = (event) => {
        event = event || window.event
        event.preventDefault()
        // get the mouse cursor position at startup:
        posX = event.clientX
        posY = event.clientY
        document.body.style.cursor = 'move'

        document.addEventListener('mouseup', closeDragElement)
        // call a function whenever the cursor moves:
        document.addEventListener('mousemove', elementDrag)
      }

      /**
       * Handle moving the mouse while the mouse button is down after clicking on the draggable element.
       *
       * @param {MouseEvent} event - event fired on mouse move.
       */
      const elementDrag = (event) => {
        event.preventDefault()
        // calculate the new cursor position:
        aX = posX - event.clientX
        aY = posY - event.clientY
        posX = event.clientX
        posY = event.clientY

        // prevent dragging the window outside the desktop to the left
        if (elmnt.offsetLeft < 0) {
          elmnt.style.top = (elmnt.offsetTop - aY) + 'px'
          elmnt.style.left = 0 + 'px'
        } else if (elmnt.offsetTop < 0) {
          // prevent dragging the window outside the desktop to the top
          elmnt.style.top = 0 + 'px'
          elmnt.style.left = (elmnt.offsetLeft - aX) + 'px'
        } else if (elmnt.offsetLeft + elmnt.offsetWidth > document.documentElement.clientWidth) {
          // prevent dragging the window outside the desktop to the right
          elmnt.style.top = (elmnt.offsetTop - aY) + 'px'
          elmnt.style.left = (document.documentElement.clientWidth - elmnt.offsetWidth) + 'px'
        } else if (elmnt.offsetTop + elmnt.offsetHeight > document.documentElement.clientHeight) {
          // prevent dragging the window outside the desktop to the down
          elmnt.style.top = (document.documentElement.clientHeight - elmnt.offsetHeight) + 'px'
          elmnt.style.left = (elmnt.offsetLeft - aX) + 'px'
        } else {
          elmnt.style.top = (elmnt.offsetTop - aY) + 'px'
          elmnt.style.left = (elmnt.offsetLeft - aX) + 'px'
        }
      }

      /**
       * Handle mouse up by removing the eventlisteners.
       *
       * @param {MouseEvent} event - event fired on mouse up.
       */
      const closeDragElement = (event) => {
        // stop moving when mouse button is released:
        document.body.style.cursor = 'default'
        document.removeEventListener('mouseup', closeDragElement)
        document.removeEventListener('mousemove', elementDrag)
      }

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
