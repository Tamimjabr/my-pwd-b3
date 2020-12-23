/**
 * The custom element web component module.
 *
 * @author Tamim Jabr <tj222kg@student.lnu.se>
 * @version 2.0.0
 */

/**
 * Define template.
 */

import src from './sounds/bling.mp3'

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
    #changeNameBtn{
      background-color:rgb(196, 197, 168);
      padding:0;
      position:absolute;
      top:0;
      z-index: 1;
      font-family: Cursive, Helvetica, sans-serif;
    }
    #messagesArea{
      background:#f0e2d0;
      height:400px;
      overflow: auto;
    }
    #messagesArea div{
      margin:0 10px;
      font-family: Arial, Helvetica, sans-serif;
      background-color:rgb(255, 255, 255);
      border-radius: 20px;
      padding:0 30px;
      width: auto;
      display: block;
    }
    #emojiContainer{
      background-color: rgba(233, 174, 107,0.8);
      position:absolute;
      left:0;
      top:-40px;
      width:100%; 
      height:40px;
      display: flex;
      justify-content: center;
      align-items: center;
      gap:4px;
      flex-wrap: wrap;
      overflow: auto;
    }
    .emoji,#emojiBtn{
      background-color: rgba(233, 174, 107,0.1);
      border:none
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
      word-break: break-word;
    }
    small{
      color:red
    }
    small.hide, div#emojiContainer.hide{
      display: none;
    }
    my-nickname{
      position: absolute;
      top: 22px;
      left: 0; 
      right: 0;
      bottom: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background-color: rgba(0,0,0,0.8);
      z-index: 2;
    }
    my-nickname.hidden{
      display:none;
    }
    #emojiBtn,#submitBtn{
      font-size: 1.2rem;
      padding: 5px;
      background-color: rgba(255, 255, 255,0.0);
      border:none;
    }

  </style>
  <my-nickname id='username'></my-nickname>
  <div id='chatContainer'>
    <button id='changeNameBtn'>Change nickname</button>
    <div id='messagesArea'>
    </div>
      <div id='submitArea'>
        <div id='emojiContainer' class='hide'>
         <button class='emoji'>😂</button>
         <button class='emoji'>😉</button>
         <button class='emoji'>🤪</button>
         <button class='emoji'>😴</button>
         <button class='emoji'>😟</button>
         <button class='emoji'>😨</button>
         <button class='emoji'>👍</button>
         <button class='emoji'>😍</button>
         <button class='emoji'>😑</button>
         <button class='emoji'>🥵</button>
         <button class='emoji'>🤓</button>
         <button class='emoji'>😱</button>
         <button class='emoji'>👿</button>
         <button class='emoji'>💀</button>
         <button class='emoji'>🤏</button>
         <button class='emoji'>👎</button>
         <button class='emoji'>🍪</button>
         <button class='emoji'>🙊</button>
         <button class='emoji'>🎄</button>
         <button class='emoji'>❤️</button>
        </div>
        <button id='emojiBtn'>😍</button>
        <textarea id='typeArea' placeholder="Type your message here"></textarea>
        <button id='submitBtn'>📤</button>
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
      this._usernameComp = this.shadowRoot.querySelector('#username')
      this._changeNameBtn = this.shadowRoot.querySelector('#changeNameBtn')
      this._typeArea = this.shadowRoot.querySelector('#typeArea')
      this._submitBtn = this.shadowRoot.querySelector('#submitBtn')
      this._messagesArea = this.shadowRoot.querySelector('#messagesArea')
      this._notConnectedMessage = this.shadowRoot.querySelector('#notConnectedMessage')
      this._emojiBtn = this.shadowRoot.querySelector('#emojiBtn')
      this._emojiContainer = this.shadowRoot.querySelector('#emojiContainer')
      this._emojis = this.shadowRoot.querySelectorAll('.emoji')
      this._webSocket = null
      this._randomId = null
      this._timeoutId = null
      this._messageSound = null
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
      // random a number between 0 and 100
      this._randomId = Math.floor(Math.random() * (100 - 0 + 1)) + 0
      this._emojiBtn.addEventListener('click', this._toggleShowEmojis.bind(this))
      Array.from(this._emojis).map(emoji => {
        return emoji.addEventListener('click', this._enterEmoji.bind(this))
      })
      this._changeNameBtn.addEventListener('click', this._changeUsername.bind(this))

      this._messageSound = document.createElement('audio')
      this._messageSound.src = src
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {
      this._typeArea.removeEventListener('keydown', this._sendMessage)
      this._submitBtn.removeEventListener('click', this._sendMessage)
      // closing the websocket when removing the component
      this._webSocket.close()
      clearTimeout(this._timeoutId)
      this._emojiBtn.removeEventListener('click', this._toggleShowEmojis.bind(this))
      Array.from(this._emojis).map(emoji => {
        return emoji.removeEventListener('click', this._enterEmoji)
      })
      this._changeNameBtn.removeEventListener('click', this._changeUsername)
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
        if (this._typeArea.value !== '') {
        // the data to send
          const data = {
            type: 'message',
            data: this._typeArea.value,
            username: localStorage.getItem('chat_app_username'),
            channel: 'my, not so secret, channel',
            key: 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd',
            userIdentifier: this._randomId
          }
          this._webSocket.send(JSON.stringify(data))
          // empty the textarea
          this._typeArea.value = ''
        }
      }
    }

    /**
     * @param event
     */
    _displayReceivedMessage (event) {
      console.log(event)
      const data = JSON.parse(event.data)
      // todo check if the data.type is message and not heartbeat
      const fragment = document.createDocumentFragment()
      const messageContainer = document.createElement('div')
      const message = document.createElement('p')
      if (data.userIdentifier === this._randomId) {
        data.username = 'You'
        message.style.color = 'green'
        messageContainer.style.textAlign = 'right'
      } else {
        //! remove comment to activate
        // this._messageSound.play()
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
     * Handle errors related to websocket.
     */
    _handleError () {
      console.error('Faild connecting to the server using websocket!,try to connect in 10sec')
      this._notConnectedMessage.classList.remove('hide')
      this._typeArea.setAttribute('disabled', '')
      // when we are offline or an error occured while connecting to the server try to connect to the server every 10sec
      this._timeoutId = setTimeout(() => {
        this._connect()
      }, 10000)
    }

    /**
     * Toggle showing the emojis.
     */
    _toggleShowEmojis () {
      this._emojiContainer.classList.toggle('hide')
    }

    /**
     *  Handle clicking on an emoji by adding it to the value of the textarea.
     *
     * @param {MouseEvent} event - click event fired when clicking on an emoji.
     */
    _enterEmoji (event) {
      this._typeArea.value += event.target.textContent
    }

    /**
     * Handle clicking on the change nickname button
     * by displaying my-nickname component enabling the user to enter a new nickname.
     *
     */
    _changeUsername () {
      this._usernameComp.classList.remove('hidden')
    }
  })
