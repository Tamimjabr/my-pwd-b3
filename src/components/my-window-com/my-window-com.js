/**
 * The custom element web component module.
 *
 * @author Tamim Jabr <tj222kg@student.lnu.se>
 * @version 1.0.0
 */

import { dragElement } from './lib/make-things-draggable.js'

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
  border-radius: 7px;
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
      dragElement(this)
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
  }
)
