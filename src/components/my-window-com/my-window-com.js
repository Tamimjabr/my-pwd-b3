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
  width: 400px;
  height: 400px;
  border: 2px solid balck;
  border-radius: 5px;
  background-color: white;
  resize: both;
  overflow: auto;
}
#toolBar{
  background-color: gray;
  border: 1px solid balck;
  border-radius: 5px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-end;
  align-items: center;
}

</style>

<div id="window">
  <div id='toolBar'>
  <button id="memoryBtn">-</button>
   <button id="chattBtn">+</button>
   <button id="TicBtn">X</button>
  </div>
  <div id="content">
    <h1>Here it is</h1>
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
    attributeChangedCallback (name, oldValue, newValue) {}

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {}

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {}
  }
)
