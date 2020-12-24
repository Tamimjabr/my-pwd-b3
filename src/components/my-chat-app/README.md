# &lt;my-chat-app&gt;
A web component that represents a chat app using websocket. Enabling users to send emojis, the user's current location as text.

## Examples

To use:

## In HTML
Add the module using the script tag in the head-element:
```HTML
<script type="module" src="js/components/my-chat-app/my-chat-app.js"></script>
```

Add the element to the html:
```HTML
<my-chat-app></my-chat-app>
```

## In Javascript
Load the module
```Javascript
import './components/my-chat-app'
```
Create a component using the standard DOM-api:
```Javascript
const myChatApp = document.createElement('my-chat-app')
