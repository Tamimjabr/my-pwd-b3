# &lt;my-window-com&gt;
A web component that represents a closable, reizable and draggable window.

## Examples

To use:

## In HTML
Add the module using the script tag in the head-element:
```HTML
<script type="module" src="js/components/my-window-com/my-window-com.js"></script>
```

Add the element to the html:
```HTML
<my-window-com></my-window-com>
```

## In Javascript
Load the module
```Javascript
import './components/my-window-com'
```
Create a component using the standard DOM-api:
```Javascript
const myWindow = document.createElement('my-window-com')