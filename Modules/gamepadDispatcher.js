// Classes
    class GamepadInputEvent extends CustomEvent {
        constructor (gamepad, id, input, type = '') {
            super('gamepad' + type + 'Input');

            this.gamepad = gamepad;
            this.id = id;
            this.name = input.name;
            this.name_local = input.name_local;
            this.value = input.value;
            this.value_secondary = input.value_secondary;
        };
    };
    class GamepadButtonInputEvent extends GamepadInputEvent {
        constructor (gamepad, id, button) {
            super(gamepad, id, button, 'Button');
        };
    };
    class GamepadAxisInputEvent extends GamepadInputEvent {
        constructor (gamepad, id, axis) {
            super(gamepad, id, axis, 'Axis');
        };
    };
    class GamepadStickInputEvent extends GamepadInputEvent {
        constructor (gamepad, id, stick) {
            super(gamepad, id, stick, 'Stick');
        };
    };
    class GamepadConnectionEvent extends CustomEvent {
        constructor (gamepad, connection) {
            super('gamepadConnection');

            this.gamepad = gamepad;
            this.connection = connection;
        };
    };

    class FormattedGamepad {
        constructor (input_gamepad) {
            let tempTypeReturn = getGamepadType(inputGamepad.id);

            this.properties = {
                'system': {
                    'slot': inputGamepad.index,
                    'mapping': inputGamepad.mapping,
                },
                'device': {
                    'id': inputGamepad.id,
                    'vendor': getGamepadVendorID(inputGamepad.id),
                    'product': getGamepadProductID(inputGamepad.id),
                },
                'identification': {
                    'type': tempTypeReturn.type,
                    'type_reason': tempTypeReturn.reason,

                    'formatting': tempTypeReturn.formatting,
                    'name_set': tempTypeReturn.name_set,
                    'local_name_set': tempTypeReturn.local_name_set,
                },
            };
            this.inputs = {
                'buttons': [],
                'axes': [],
                'sticks': [],
            };
        };
    };

// Variables
    let gamepads = [];

    let gamepads_previous_state = {};

    let button_threshold = 1/3;


    let gamepad_lookups = {
        search_terms: [
            {   includes: '',

                type: 'Unknown',
                reason: "Well I uhh, I don't know, that's why.",

                formatting: 'Fallback',
                name_set: 'Fallback',
                local_name_set: null,
            },

            // Controllers
                {   includes: 'STANDARD GAMEPAD',

                    type: 'Standard Controller',
                    reason: 'Identified',

                    formatting: 'Standard Controller',
                    name_set: 'Standard Controller',
                    local_name_set: null,
                },
                {   includes: 'XInput',

                    type: 'XBox Controller',
                    reason: 'Supported',

                    local_name_set: 'XBox Controller',
                },
                {   includes: 'DualSense Wireless Controller',

                    type: 'DualSense Controller',
                    reason: 'Supported',

                    local_name_set: 'PlayStation Controller',
                },
                {   includes: 'Vendor: 054c Product: 09cc',

                    type: 'DualShock Controller',
                    reason: 'Supported',

                    local_name_set: 'PlayStation Controller',
                },
            // Flight-sim sticks
                // {   includes: 'Vendor: 046d Product: c215',

                //     type: 'Logitech Extreme 3D Pro',
                //     reason: 'Supported',

                //     formatting: 'Logitech Extreme 3D Pro',
                //     name_set: 'Fallback',
                //     local_name_set: null,
                // }
        ],
        input: {
            formatting: {
                'Fallback': {
                    button_to_axis_indexes: [],
                    axis_to_stick_indexes: [],
                },
                'Standard Controller': {
                    button_to_axis_indexes: [6, 7],
                    axis_to_stick_indexes: [[0, 1], [2, 3]],
                },
                // 'Logitech Extreme 3D Pro': {
                //     button_to_axis_indexes: [],
                //     axis_to_stick_indexes: [[0, 1]],
                // },
            },
            naming: {
                'Fallback': {
                    buttons: [
                        'button1',
                        'button2',
                        'button3',
                        'button4',
                        'button5',
                        'button6',
                        'button7',
                        'button8',
                        'button9',
                        'button10',
                        'button11',
                        'button12',
                        'button13',
                        'button14',
                        'button15',
                        'button16',
                        'button17',
                        'button18',
                        'button19',
                        'button20',
                    ],
                    axes: [
                        'range1',
                        'range2',
                        'range3',
                        'range4',
                        'range5',
                        'range6',
                        'range7',
                        'range8',
                        'range9',
                        'range10',
                        'range11',
                        'range12',
                        'range13',
                        'range14',
                        'range15',
                        'range16',
                        'range17',
                        'range18',
                        'range19',
                        'range20',
                    ],
                    sticks: [
                        'stick1',
                        'stick2',
                        'stick3',
                        'stick4',
                        'stick5',
                        'stick6',
                        'stick7',
                        'stick8',
                        'stick9',
                        'stick10',
                    ],
                },

                'Standard Controller': {
                    buttons: [
                        // face buttons
                            'faceButtonBottom',
                            'faceButtonRight',
                            'faceButtonLeft',
                            'faceButtonTop',
                        // bumpers
                            'leftBumper',
                            'rightBumper',
                        // menu buttons
                            'leftMenuButton',
                            'rightMenuButton',
                        // stick buttons
                            'leftStickButton',
                            'rightStickButton',
                        // directional pad
                            'directionalPadUp',
                            'directionalPadDown',
                            'directionalPadLeft',
                            'directionalPadRight',
                        // special buttons
                            'homeButton',
                            'touchpadButton',

                    ],
                    axes: [
                        // triggers
                            'leftTrigger',
                            'rightTrigger',
                    ],
                    sticks: [
                        'leftStick',
                        'rightStick',
                    ],
                },
                'XBox Controller': {
                    buttons: [
                        // face buttons
                            'aButton',
                            'bButton',
                            'xButton',
                            'yButton',
                        // bumpers
                            'leftBumper',
                            'rightBumper',
                        // menu buttons
                            'viewButton',
                            'menuButton',
                        // stick buttons
                            'leftStickButton',
                            'rightStickButton',
                        // directional pad
                            'dPadUp',
                            'dPadDown',
                            'dPadLeft',
                            'dPadRight',
                        // special buttons
                            'guideButton',
                    ],
                    axes: [
                        // triggers
                            'leftTrigger',
                            'rightTrigger',
                    ],
                    sticks: [
                        'leftStick',
                        'rightStick',
                    ],
                },
                'PlayStation Controller': {
                    buttons: [
                        // face buttons
                            'crossButton',
                            'circleButton',
                            'squareButton',
                            'triangleButton',
                        // bumpers
                            'L1',
                            'R1',
                        // menu buttons
                            'shareButton',
                            'optionsButton',
                        // stick buttons
                            'L3',
                            'R3',
                        // directional pad
                            'upButton',
                            'downButton',
                            'leftButton',
                            'rightButton',
                        // special buttons
                            'playstationButton',
                            'touchPadButton',
                    ],
                    axes: [
                        // triggers
                            'L2',
                            'R2',
                    ],
                    sticks: [
                        'leftStick',
                        'rightStick',
                    ],
                },

                // 'Logitech Extreme 3D Pro': {
                //     buttons: [

                //     ],
                // },
            },
        },
    };
        let gamepad_search_terms = gamepad_lookups.search_terms;
        let gamepad_input_formatting = gamepad_lookups.input.formatting;
        let gamepad_input_naming = gamepad_lookups.input.naming;
            let standardGamepadLookup = gamepad_input_naming["Standard Controller"];
                let standardButtonLookup = standardGamepadLookup.buttons;
            let xBoxControllerLookup = gamepad_input_naming['XBox Controller'];

// Contents
    // Console Warning
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

    // Dispatch Loop
        setInterval(function () {
            dispatchGamepadEvents();
        }, 1);

    // Connection Listeners
        window.addEventListener('gamepadconnected', function (e) {
            let formattedGamepad = formatGamepad(e.gamepad);

            gamepads.push(formattedGamepad);

            let gamepadConnectionEvent = new GamepadConnectionEvent (
                formattedGamepad,
                'connected'
            );
            document.dispatchEvent(gamepadConnectionEvent);

            dispatchGamepadEvents();
        });
        window.addEventListener('gamepaddisconnected', function (e) {
            let formattedGamepad = formatGamepad(e.gamepad);

            for (let i = 0; i < gamepads.length; i++) {
                if (formattedGamepad.index === gamepads[i].index) {
                    gamepads.splice(i, 1);
                };
            };

            let gamepadConnectionEvent = new GamepadConnectionEvent (
                formattedGamepad,
                'disconnected'
            );
            document.dispatchEvent(gamepadConnectionEvent);
        });


// Functions
    function getGamepadVendorID (id) {
        if (id.includes('Vendor: ')) {
            return (id.split('Vendor: ')[1].split(' ')[0]);
        } else {
            return undefined;
        };
    };
    function getGamepadProductID (id) {
        if (id.includes('Product: ')) {
            return (id.split('Product: ')[1].split(')')[0]);
        } else {
            return undefined;
        };
    };
    function getGamepadType (id) {
        let type = null;
        let reason = null;

        let formatting = null;
        let name_set = null;
        let local_name_set = null;

        for (let search_num = 0; search_num < gamepad_search_terms.length; search_num++) {
            let current_search = gamepad_search_terms[search_num];

            if (id.includes(current_search.includes)) {
                type = current_search.type;
                reason = current_search.reason;

                if (current_search.formatting != null) {
                    formatting = current_search.formatting;
                };
                if (current_search.name_set != null) {
                    name_set = current_search.name_set;
                };
                if (current_search.local_name_set != null) {
                    local_name_set = current_search.local_name_set;
                };
            };
        };

        return {
            'type': type,
            'reason': reason,

            'formatting': formatting,
            'name_set': name_set,
            'local_name_set': local_name_set,
        };
    };



    function weightedAvg (a, b, a_weight = 1, b_weight = 1) {
        return (((a * a_weight) + (b * b_weight)) / (a_weight + b_weight))
    };

    function getLocalButtonName (name_set, button_index) {
        return gamepad_input_formatting_lookups[(name_set === null ? 'Standard Gamepad' : name_set)].buttonNames[button_index];
    };
    function getLocalStickName (name_set, stick_index) {
        return gamepad_input_formatting_lookups[(name_set === null ? 'Standard Gamepad' : name_set)].stickNames[stick_index];
    };

    function normalizeButton (value) {
        return (value >= button_threshold);
    };
    function normalizeJoystick (x, y) {
        let magnitude = (Math.abs(x) + Math.abs(y));

        let clamped = Math.min(1, magnitude);

        let accuracy = (2 - (magnitude / clamped));

        return [
            weightedAvg(x, x * accuracy, 7, 2),
            weightedAvg(y, y * accuracy, 7, 2)
        ];
    };

    function formatGamepad (inputGamepad) {
        if (inputGamepad != null) {
            let gamepad_type = getGamepadType(inputGamepad.id);

            let formattedGamepad = {
                'raw': inputGamepad,

                'info': {
                    'slot': inputGamepad.index,
                    'id': inputGamepad.id,
                    'mapping': inputGamepad.mapping,

                    'type': gamepad_type.type,
                    'type_reason': gamepad_type.reason,

                    'formatting': gamepad_type.formatting,
                    'name_set': gamepad_type.name_set,
                    'local_name_set': gamepad_type.local_name_set,
                },

                'inputs': {
                    'buttons': [],
                    'axes': [],
                    'sticks': [],
                },

                'timestamp': inputGamepad.timestamp,
            };

            // format inputs
                // handle buttons
                    for (let button_num = 0; button_num < inputGamepad.buttons.length; button_num++) {
                        if (!gamepad_input_formatting[gamepad_type.formatting].button_to_axis_indexes.includes(button_num)) {
                            formattedGamepad.inputs.buttons.push({
                                name: gamepad_input_naming[gamepad_type.name_set].buttons[formattedGamepad.inputs.buttons.length],
                                name_local: gamepad_input_naming[gamepad_type.local_name_set].buttons[formattedGamepad.inputs.buttons.length],

                                value: normalizeButton(inputGamepad.buttons[button_num].value),
                                value_secondary: inputGamepad.buttons[button_num].value,
                            });
                        } else {
                            formattedGamepad.inputs.axes.push({
                                name: gamepad_input_naming[gamepad_type.name_set].axes[formattedGamepad.inputs.axes.length],
                                name_local: gamepad_input_naming[gamepad_type.local_name_set].axes[formattedGamepad.inputs.axes.length],

                                value: inputGamepad.buttons[button_num].value,
                            });
                        };
                    };
                // handle sticks
                    let used_axes = [];
                    for (let stick_num = 0; stick_num < gamepad_input_formatting[gamepad_type.formatting].axis_to_stick_indexes.length; stick_num++) {
                        let axis_to_stick_index = gamepad_input_formatting[gamepad_type.formatting].axis_to_stick_indexes[stick_num];

                        formattedGamepad.inputs.sticks.push({
                            name: gamepad_input_naming[gamepad_type.name_set].sticks[formattedGamepad.inputs.sticks.length],
                            name_local: gamepad_input_naming[gamepad_type.local_name_set].sticks[formattedGamepad.inputs.sticks.length],

                            value: [inputGamepad.axes[axis_to_stick_index[0]], inputGamepad.axes[axis_to_stick_index[1]]],
                            value_secondary: normalizeJoystick(inputGamepad.axes[axis_to_stick_index[0]], inputGamepad.axes[axis_to_stick_index[1]]),
                        });

                        used_axes.push(axis_to_stick_index[0], axis_to_stick_index[1]);
                    };
                // handle axes
                    for (let axis_num = 0; axis_num < inputGamepad.axes.length; axis_num++) {
                        if (!used_axes.includes(axis_num)) {
                            formattedGamepad.inputs.axes.push({
                                name: gamepad_input_naming[gamepad_type.name_set].axes[formattedGamepad.inputs.axes.length],
                                name_local: gamepad_input_naming[gamepad_type.local_name_set].axes[formattedGamepad.inputs.axes.length],

                                value: inputGamepad.axes[axis_num],
                            });
                        };
                    };


            // return
                return formattedGamepad;
        };
    };

    function dispatchGamepadEvents () {
        for (let i = 0; i < gamepads.length; i++) {
            let current_index = gamepads[i].info.slot;

            let previous_state = gamepads_previous_state[current_index];
            let current_state = formatGamepad(navigator.getGamepads()[current_index]);

            if (previous_state != null && current_state != null && (
                previous_state.inputs.buttons.length == current_state.inputs.buttons.length
                &&
                previous_state.inputs.axes.length == current_state.inputs.axes.length
                &&
                previous_state.inputs.sticks.length == current_state.inputs.sticks.length
            )) {
                let previous_inputs = previous_state.inputs;
                let current_inputs = current_state.inputs;

                // Buttons
                    if (current_inputs.buttons != []) {
                        for (let input_num = 0; input_num < current_inputs.buttons.length; input_num++) {
                            let previous_input = previous_inputs.buttons[input_num];
                            let current_input = current_inputs.buttons[input_num];

                            if (previous_input.value != current_input.value) {
                                let event = new GamepadButtonInputEvent(current_state, input_num, current_input);

                                document.dispatchEvent(event);
                            };
                        };
                    };
                // Axes
                    if (current_inputs.axes != []) {
                        for (let input_num = 0; input_num < current_inputs.axes.length; input_num++) {
                            let previous_input = previous_inputs.axes[input_num];
                            let current_input = current_inputs.axes[input_num];

                            if (previous_input.value != current_input.value) {
                                let event = new GamepadAxisInputEvent(current_state, input_num, current_input);

                                document.dispatchEvent(event);
                            };
                        };
                    };
                // Sticks
                    if (current_inputs.sticks != []) {
                        for (let input_num = 0; input_num < current_inputs.sticks.length; input_num++) {
                            let previous_input = previous_inputs.sticks[input_num];
                            let current_input = current_inputs.sticks[input_num];

                            if (previous_input.value[0] != current_input.value[0] || previous_input.value[1] != current_input.value[1]) {
                                let event = new GamepadStickInputEvent(current_state, input_num, current_input);

                                document.dispatchEvent(event);
                            };
                        };
                    };
            };

            if (current_state != null) {
                gamepads_previous_state[current_index] = current_state;
            };
        };
    };

// Exports
