# Controller Event Dispatcher
Dispatches events for your controller following the principles used for the built in keyboard \& mouse dispatching.

## Convenient Links
Peep the [demo project](https://axolotlazr.github.io/Controller-Event-Dispatcher/)

If you want to use this in your own projects, you can import the module from <https://axolotlazr.github.io/Controller-Event-Dispatcher/Modules/gamepadDispatcher.js>


## Features
### Events
* GamepadButtonInputEvent
  
	This provides button press events, mimicking how keyboard inputs are dispatched

* GamepadTriggerInputEvent
  
	This gives triggers their own output category that supports a value range from 0.0 to 1.0

* GamepadStickInputEvent
  
	This converts the separated axis values of the joysticks into value pairs

* GamepadConnectionEvent
  
	This fills in for the "gamepadconnected" \& "gamepaddisconnected" events which the rest of my system is supposed to replace... you shouldn't need it

### Support
Currently there's only support for PlayStation & XBox controllers since they are the only ones I own
