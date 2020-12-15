# &lt;my-tic-tac-toee&gt;
A webcomponent that represent a tic-tac-toe game.

## slots
the component  doesn't accept slots 


## Examples

To use:

## In HTML
Add the module using the script tag in the head-element:
```HTML
<script type="module" src="js/components/my-tic-tac-toe/my-tic-tac-toe.js"></script>

```

Add the element to the html:
```HTML
<my-tic-tac-toe></my-tic-tac-toe>
```

## In Javascript
Load the module
```Javascript
import './components/my-tic-tac-toe'
```
Create a component using the standard DOM-api:
```Javascript
const ticTacToeGame = document.createElement('my-tic-tac-toe')