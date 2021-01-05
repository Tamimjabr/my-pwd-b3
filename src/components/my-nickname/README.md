# &lt;my-nickname&gt;
A webcomponent that enable the user to choose a nickname (to use for chat app in our case), the nickname will be reused between sessions and will be stored in the localStorage in the browser until the user choose to change it.

## Attributes

### `username`
An attribute that represent the user nickname in the quiz.

Default value: ''

## Styling with CSS
The submit input (button) is styleable using the part `nickNameBtn`


## Examples

To use:

## In HTML
Add the module using the script tag in the head-element:
```HTML
<script type="module" src="js/components/my-nickname/index.js"></script>
```

Add the element to the html:
```HTML
<my-nickname></my-nickname>
```

## In Javascript
Load the module
```Javascript
import './components/my-nickname'
```
Create a component using the standard DOM-api:
```Javascript
const myNickname = document.createElement('my-nickname')