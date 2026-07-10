// Classes
    class GamepadButtonInputEvent extends CustomEvent {
        constructor (gamepad, id, name, value) {
            super('gamepadButtonInput');

            this.gamepad = gamepad;
            this.id = id;
            this.name = name;
            this.value = value;
        };
    };
    class GamepadTriggerInputEvent extends CustomEvent {
        constructor (gamepad, id, name, value) {
            super('gamepadTriggerInput');

            this.gamepad = gamepad;
            this.id = id;
            this.name = name;
            this.value = value;
        };
    };
    class GamepadStickInputEvent extends CustomEvent {
        constructor (gamepad, id, name, value) {
            super('gamepadStickInput');

            this.gamepad = gamepad;
            this.id = id;
            this.name = name;
            this.value = value;
        };
    };
    class GamepadConnectionEvent extends CustomEvent {
        constructor (gamepad, connection) {
            super('gamepadConnection');

            this.gamepad = gamepad;
            this.connection = connection;
        };
    };

// Variables
    let gamepads = [];

    let gamepads_previous_state = {};

    let gamepadButtonLookup = [
        'faceButtonBottom',
        'faceButtonRight',
        'faceButtonLeft',
        'faceButtonTop',

        'leftBumper',
        'rightBumper',

        'leftTrigger',
        'rightTrigger',

        'leftMenuButton',
        'rightMenuButton',

        'leftStickButton',
        'rightStickButton',

        'directionalPadUp',
        'directionalPadDown',
        'directionalPadLeft',
        'directionalPadRight',

        'guideButton',
        'touchpadButton',
    ];

// Contents
    window.addEventListener('gamepadconnected', function (e) {
        gamepads.push(e.gamepad);

        let gamepadConnectionEvent = new GamepadConnectionEvent (
            e.gamepad,
            'connected'
        );
        document.dispatchEvent(gamepadConnectionEvent);

        dispatchGamepadEvents();
    });
    window.addEventListener('gamepaddisconnected', function (e) {
        console.log(e.gamepad);

        for (let i = 0; i < gamepads.length; i++) {
            if (e.gamepad.index === gamepads[i].index) {
                gamepads.splice(i, 1);
            };
        };

        let gamepadConnectionEvent = new GamepadConnectionEvent (
            e.gamepad,
            'disconnected'
        );
        document.dispatchEvent(gamepadConnectionEvent);
    });

    setInterval(function () {
        dispatchGamepadEvents();
    }, 1);

    console.log(
                 '---------------------------------------------------'
        + '\n' + 'gamepadDispatcher.js consumes the following events:'
        + '\n' + '- "gamepadconnected" on the window element'
        + '\n' + '- "gamepaddisconnected" on the window element'
        + '\n'
        + '\n' + 'please use the following instead:'
        + '\n' + '- "gamepadConnection" on the document'
        + '\n' + '---------------------------------------------------'
    );

// Functions
    function dispatchGamepadEvents () {
        for (let i = 0; i < gamepads.length; i++) {
            let current_index = gamepads[i].index;

            let previous_state = gamepads_previous_state[current_index];
            let current_state = navigator.getGamepads()[current_index];

            if (previous_state != null && current_state != null) {
                let previous_buttons = previous_state.buttons;
                let current_buttons = current_state.buttons;

                if (current_state.id.includes('STANDARD GAMEPAD')) {
                    for (let buttonID = 0; buttonID < current_buttons.length; buttonID++) {
                        if (gamepadButtonLookup[buttonID].includes('Trigger')) {
                            if (previous_buttons[buttonID].value != current_buttons[buttonID].value) {
                                let gamepadButtonInputEvent = new GamepadTriggerInputEvent (
                                    current_state,
                                    buttonID, 
                                    gamepadButtonLookup[buttonID],
                                    current_buttons[buttonID].value
                                );

                                document.dispatchEvent(gamepadButtonInputEvent);
                            };
                        } else {
                            if (previous_buttons[buttonID].pressed != current_buttons[buttonID].pressed) {
                                let gamepadButtonInputEvent = new GamepadButtonInputEvent (
                                    current_state,
                                    buttonID, 
                                    gamepadButtonLookup[buttonID],
                                    (current_buttons[buttonID].value == 1 ? true : false)
                                );

                                document.dispatchEvent(gamepadButtonInputEvent);
                            };
                        };
                    };

                    if (previous_state.axes[0] != current_state.axes[0] || previous_state.axes[1] != current_state.axes[1]) {
                        let gamepadStickInputEvent = new GamepadStickInputEvent (
                            current_state,
                            0,
                            'leftStick',
                            [current_state.axes[0], current_state.axes[1]]
                        );
                        
                        document.dispatchEvent(gamepadStickInputEvent);
                    };
                    if (previous_state.axes[2] != current_state.axes[2] || previous_state.axes[3] != current_state.axes[3]) {
                        let gamepadStickInputEvent = new GamepadStickInputEvent (
                            current_state,
                            1,
                            'rightStick',
                            [current_state.axes[2], current_state.axes[3]]
                        );

                        document.dispatchEvent(gamepadStickInputEvent);
                    };
                };
            } else if (current_state != null) {
                let current_buttons = current_state.buttons;

                if (current_state.id.includes('STANDARD GAMEPAD')) {
                    for (let buttonID = 0; buttonID < current_buttons.length; buttonID++) {
                        if (!gamepadButtonLookup[buttonID].includes('Trigger')) {
                        } else {
                            let gamepadButtonInputEvent = new GamepadButtonInputEvent (
                                current_state,
                                buttonID, 
                                gamepadButtonLookup[buttonID],
                                (current_buttons[buttonID].value == 1 ? true : false)
                            );

                            document.dispatchEvent(gamepadButtonInputEvent);
                        };
                    };
                };

            };

            if (current_state != null) {
                gamepads_previous_state[current_state.index] = current_state;
            };
        };
    };

// Exports
