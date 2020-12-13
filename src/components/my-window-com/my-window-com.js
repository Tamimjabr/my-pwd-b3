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
    position: absolute; 
  }
#window{
  width: 500px;
  height: 400px;
  border: 2px solid balck;
  border-radius: 5px;
  background-color: rgb(241, 202, 165);
  resize: both;
  overflow: auto;
  position: absolute; 
}
#window:focus{
  background-color: gray;
    }
#toolBar{
  background-color: gray;
  border: 1px solid balck;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-end;
  align-items: center;
}
#content{
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

<div id="window">
  <div id='toolBar'>
  <button id="minimize">-</button>
   <button id="fullscreenToggle">+</button>
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
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {
      // todo remove eventlistener
    }

    /**
     * Handle click on the close button.
     */
    _handleCloseBtn () {
      this.remove()
    }
  }
)
