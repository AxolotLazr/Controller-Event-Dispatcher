# Controller Event Dispatcher

Dispatches events for your controller following the principles used for the built in keyboard \& mouse dispatching.



If you want to download the file for use in your own projects, you can find it at Modules/gamepadDispatcher.js

Please note that the script uses the "gamepadconnected" \& "gamepaddisconnected" events from the window,

in case that's an issue for you I provided an equivalent event "gamepadConnection"



### Events

* GamepadButtonInputEvent

&#x09;This provides button press events, mimicking how keyboard inputs are dispatched

* GamepadTriggerInputEvent

&#x09;This gives the triggers their own output category, since they don't function as buttons

* GamepadStickInputEvent

&#x09;This passes the separated axis values of the joysticks as value pairs

* GamepadConnectionEvent

&#x09;This takes the place of "gamepadconnected" \& "gamepaddisconnected" which the rest of my system is supposed to replace... you shouldn't need it



