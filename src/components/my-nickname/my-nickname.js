/**
 * my-nickname component.
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
}
.hidden{
  display:none;
}
h2{
  color:green;
  text-decoration: underline;
}
form > input:focus{
  background-color: rgb(233, 174, 107);
  color:white
}
</style>
<form>
    <input type="text" id="textName" placeholder="Type your nickname" autofocus required>
    <input type="submit" value="Submit" part='nickNameBtn'>
</form>
`
/**
 * Define custom element.
 */
customElements.define('my-nickname',
  /**
   * Represents a nickname.
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

      this._nameInput = this.shadowRoot.querySelector('#textName')
      this._formElement = this.shadowRoot.querySelector('form')

      this._onSubmit = this._onSubmit.bind(this)
    }

    /**
     *
     */
    static get observedAttributes () {
      return ['username', 'changer']
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this._formElement.addEventListener('submit', this._onSubmit)
      if (localStorage.getItem('chat_app_username')) {
        this.classList.add('hidden')
      }
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {
      this._formElement.removeEventListener('submit', this._onSubmit)
    }

    /**
     * Called when observed attribute(s) changes.
     *
     * @param {string} name - The attribute's name.
     * @param {*} oldValue - The old value.
     * @param {*} newValue - The new value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'username') {
        this._formElement.classList.add('hidden')
      }
      //! check if it will a boolean
      if (name === 'changer') {
        this._formElement.classList.remove('hidden')
      }
    }

    /**
     * To handle submitting the form by removing the input and display the nickname.
     *
     * @param {Event} event - The submit event.
     */
    _onSubmit (event) {
      event.preventDefault()
      if (this._nameInput.value.trim()) {
        this._formElement.classList.add('hidden')
        this.setAttribute('username', this._nameInput.value.trim())
        localStorage.setItem('chat_app_username', this._nameInput.value)
        this.classList.add('hidden')
      }
    }
  })
