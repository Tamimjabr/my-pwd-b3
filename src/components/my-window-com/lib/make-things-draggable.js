/**
 * Make the elmnt draggable.
 *
 * @param {object} elmnt - the object representing the element that we want to be draggable.
 */
export function dragElement (elmnt) {
  let aX = 0
  let aY = 0
  let posX = 0
  let posY = 0
  /**
   * Adding the event on mousemove and mouseup.
   *
   * @param {MouseEvent} event - event fired on mouse down.
   */
  const dragMouseDown = (event) => {
    event = event || window.event
    event.preventDefault()
    // get the mouse cursor position at startup:
    posX = event.clientX
    posY = event.clientY
    document.body.style.cursor = 'move'

    document.addEventListener('mouseup', closeDragElement)
    // call a function whenever the cursor moves:
    document.addEventListener('mousemove', elementDrag)
  }

  /**
   * Handle moving the mouse while the mouse button is down after clicking on the draggable element.
   *
   * @param {MouseEvent} event - event fired on mouse move.
   */
  const elementDrag = (event) => {
    event.preventDefault()
    // calculate the new cursor position:
    aX = posX - event.clientX
    aY = posY - event.clientY
    posX = event.clientX
    posY = event.clientY

    // prevent dragging the window outside the desktop to the left
    if (elmnt.offsetLeft < 0) {
      elmnt.style.top = (elmnt.offsetTop - aY) + 'px'
      elmnt.style.left = 0 + 'px'
    } else if (elmnt.offsetTop < 0) {
      // prevent dragging the window outside the desktop to the top
      elmnt.style.top = 0 + 'px'
      elmnt.style.left = (elmnt.offsetLeft - aX) + 'px'
    } else if (elmnt.offsetLeft + elmnt.offsetWidth > document.documentElement.clientWidth) {
      // prevent dragging the window outside the desktop to the right
      elmnt.style.top = (elmnt.offsetTop - aY) + 'px'
      elmnt.style.left = (document.documentElement.clientWidth - elmnt.offsetWidth) + 'px'
    } else if (elmnt.offsetTop + elmnt.offsetHeight > document.documentElement.clientHeight) {
      // prevent dragging the window outside the desktop to the down
      elmnt.style.top = (document.documentElement.clientHeight - elmnt.offsetHeight) + 'px'
      elmnt.style.left = (elmnt.offsetLeft - aX) + 'px'
    } else {
      elmnt.style.top = (elmnt.offsetTop - aY) + 'px'
      elmnt.style.left = (elmnt.offsetLeft - aX) + 'px'
    }
  }

  /**
   * Handle mouse up by removing the eventlisteners.
   *
   * @param {MouseEvent} event - event fired on mouse up.
   */
  const closeDragElement = (event) => {
    // stop moving when mouse button is released:
    document.body.style.cursor = 'default'
    document.removeEventListener('mouseup', closeDragElement)
    document.removeEventListener('mousemove', elementDrag)
  }

  if (elmnt.shadowRoot.querySelector('#toolBar')) {
    // if present, the header is where you move the DIV from:
    elmnt.shadowRoot.querySelector('#toolBar').addEventListener('mousedown', dragMouseDown)
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.addEventListener('mousedown', dragMouseDown)
  }
}
