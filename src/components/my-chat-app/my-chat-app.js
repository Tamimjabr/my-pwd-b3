/**
 * The custom element web component module.
 *
 * @author Tamim Jabr <tj222kg@student.lnu.se>
 * @version 2.0.0
 */

/**
 * Define template.
 */
const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host {
      width:100%;
      height:100%;
      background:white;
    }
    #chattContainer{
      height:100%;
      width:100%; 
      position: relative; 
    }
    #messagesArea{
      background:#f0e2d0;
      height:400px;
      overflow: auto;
    }
    #submitArea{
      position:sticky;
      left:0;
      bottom:0;
      width:100%; 
      display: flex;
      justify-content: center;
      align-items: center;
      clear: both;
    }
    textarea{
      height:30px;
      width:90%; 
    }
    p{
      margin-top: 0;
      word-break: break-all;
    }
    small{
      color:red
    }
    small.hide{
      display: none;
    }

  </style>
  <div id='chatContainer'>
    <div id='messagesArea'>
    </div>
      <div id='submitArea'>
         <textarea id='typeArea'></textarea>
         <button id='submitBtn'>send</button>
      </div>
      <small id='notConnectedMessage' class='hide'>You will be able to send messages again as soon as you are connected to the server!</small>
  </div>
`

/**
 * Define custom element.
 */
customElements.define('my-chat-app',
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

      this._typeArea = this.shadowRoot.querySelector('#typeArea')
      this._submitBtn = this.shadowRoot.querySelector('#submitBtn')
      this._messagesArea = this.shadowRoot.querySelector('#messagesArea')
      this._notConnectedMessage = this.shadowRoot.querySelector('#notConnectedMessage')
      this._webSocket = null
    }

    /**
     * Watches the attributes "text" and "speed" for changes on the element.
     *
     * @returns {string[]} A string array of attributes to monitor.
     */

    /**
     *
     */
    static get observedAttributes () {

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
      this._connect()
      this._typeArea.addEventListener('keydown', this._sendMessage.bind(this))
      this._submitBtn.addEventListener('click', this._sendMessage.bind(this))
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {
      this._typeArea.removeEventListener('keydown', this._sendMessage)
      this._submitBtn.removeEventListener('click', this._sendMessage)
      // closing the websocket when removing the component
      this._webSocket.close()
    }

    /**
     *
     */
    async _connect () {
      // check if we already have a webSocket connection before creating a new one
      if (this._webSocket && this._webSocket.readyState === 1) {
        console.log('#########', this._webSocket.readyState)
        console.log('a websocket is already existed')
      } else {
        this._webSocket = await new WebSocket('wss://cscloud6-127.lnu.se/socket/')

        // make sure that we are connected before sending or recieving messages or
        this._webSocket.addEventListener('open', this._listenToMessages.bind(this))
        this._webSocket.addEventListener('error', this._handleError.bind(this))
        console.log('creating a new one')
      }
    }

    /**
     * @param event
     */
    _sendMessage (event) {
      // enable user to send message by clicking on send button or pressing Enter
      if (event.code === 'Enter' || event.type === 'click') {
        // preventing the Enter button from creating a blank row in the textarea
        event.preventDefault()
        // try to connect if not connected
        this._connect()
        // the data to send
        const data = {
          type: 'message',
          data: this._typeArea.value,
          username: 'It is me',
          channel: 'my, not so secret, channel',
          key: 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd',
          userIdentifier: '1'
        }
        this._webSocket.send(JSON.stringify(data))
        // empty the textarea
        this._typeArea.value = ''
      }
    }

    /**
     * @param event
     */
    _displayReceivedMessage (event) {
      console.log(event)
      const data = JSON.parse(event.data)
      console.log(data.data)
      console.log(data.username)

      const fragment = document.createDocumentFragment()
      const messageContainer = document.createElement('div')
      const message = document.createElement('p')
      if (data.userIdentifier == '1') {
        data.username = 'You'
        message.style.color = 'green'
      }
      message.textContent = data.username + ' : ' + data.data

      messageContainer.appendChild(message)
      fragment.appendChild(messageContainer)
      this._messagesArea.appendChild(fragment)

      // scroll to the last message
      this._messagesArea.scrollTop = this._messagesArea.scrollHeight
    }

    /**
     *
     */
    _listenToMessages () {
      console.log('You are connected to the server using websocket!, now you can send and recieve messages.')
      this._webSocket.addEventListener('message', this._displayReceivedMessage.bind(this))
      this._notConnectedMessage.classList.add('hide')
      this._typeArea.removeAttribute('disabled')
    }

    /**
     *
     */
    _handleError () {
      console.error('Faild connecting to the server using websocket!')
      this._notConnectedMessage.classList.remove('hide')
      this._typeArea.setAttribute('disabled', '')
      console.log('try to connect')
      // when we are offline or an error occured while connecting to the server try to connect to the server every 10sec
      setTimeout(() => {
        this._connect()
      }, 10000)
      // todo display a message to the user that user is not connected and we will try to send the message soon
    }
  })
