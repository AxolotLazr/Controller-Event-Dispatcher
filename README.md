# Controller Event Dispatcher
Dispatches events for your controller following the principles used for the built in keyboard \& mouse dispatching.


If you want to download the file for use in your own projects, you can find it at Modules/gamepadDispatcher.js

Please note that the script uses the "gamepadconnected" \& "gamepaddisconnected" events from the window,
in case that's an issue for you I provided an equivalent event "gamepadConnection"


### Events
* GamepadButtonInputEvent
  
	This provides button press events, mimicking how keyboard inputs are dispatched

* GamepadTriggerInputEvent
  
  This gives the triggers their own output category, since they don't function as buttons

* GamepadStickInputEvent
  
  This passes the separated axis values of the joysticks as value pairs

* GamepadConnectionEvent
  
  This takes the place of "gamepadconnected" \& "gamepaddisconnected" which the rest of my system is supposed to replace... you shouldn't need it

### Support
Currently there's only support for PlayStation & XBox controllers since they are the only ones I own
