# Controller Event Dispatcher
Dispatches events for your controller following the principles used for the built in keyboard \& mouse dispatching.

## Convenient Links
Peep the [demo project](https://axolotlazr.github.io/Controller-Event-Dispatcher/)

If you want to use this in your own projects, you can import the module from <https://axolotlazr.github.io/Controller-Event-Dispatcher/Modules/gamepadDispatcher.js>


## Features
### Events
* GamepadButtonInputEvent
  
	This provides button press events

* GamepadAxisInputEvent
  
	This is used for identified triggers, & any axes that aren't translated into sticks, this supports a value range from -1.0 to 1.0

* GamepadStickInputEvent
  
	This converts the separated axis values of the joysticks into value pairs

* GamepadConnectionEvent
  
	This fills in for the "gamepadconnected" \& "gamepaddisconnected" events, may be useful for splitscreen detection

### Support
Currently there's direct support for PS4, PS5, & XBox controllers, which includes console specific input naming

There's also automated support for standard gamepads

If you use an unknown gamepad the system will skip formatting & fallback to simply buttons & axes