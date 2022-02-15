function toggle_nav_menu() {
    console.log("toggle nav menu");
    let menu = document.getElementById("nav-menu");
    let toggle = document.getElementById("nav-toggle");
    if (menu.classList.contains("open")) {
        for (let div of menu.getElementsByTagName("a")) {
            div.classList.remove("open");
            div.classList.add("close");
        }
        menu.classList.remove("open");
        menu.classList.add("close");
        toggle.classList.remove("open");
    } else {
        for (let div of menu.getElementsByTagName("a")) {
            div.classList.add("open");
            div.classList.remove("close");
        }
        menu.classList.add("open");
        menu.classList.remove("close");
        toggle.classList.add("open");
    }
}

console.log('index.js loaded');
// ---- SIMULATION INPUTS
// -- this section includes the code for the functionality of the simulation inputs


// ---- TERMS
// id = javascript id, as per document.getElementById(id).
// pid = partial id, corresponding to the name of the input lists


// ---- FUNCTIONS GUIDE
// clear_warnings(pid)
// -- clear all warning related to an input pid
// async function check_input(pid, transform, conditions)
// -- input validation
// input_help(pid)
// -- toggle help/info for input pid
// hide_ids(ids), hide_pids(pids), hide_elements(elements)
// -- hide all ids/pids/elements in the list
// unhide_ids(ids), unhide_pids(pids), unhide_elements(elements)
// -- unhide all ids/pids/elements in the list
// clear_value(pid), set_value(pid, value)
// -- clear/set the value of a pid
// validate_element(element), invalidate_element(element), clear_element_validation(element)
// -- add and remove valid and invalid class to element
// async onchange_address()
// -- update warning, epc_calling ... upon selection address change
// check_submit()
// -- check if all inputs are valid so simulation can be submitted
// toggle_advanced_inputs()
// -- toggle advanced inputs but dont reset them
// click_dismiss()
// -- any element with click-dismiss class automatically has click event applied with pointer styling
// set_run_location()
// -- set where simulation will run, client or server-side
// toggle_optimisation()
// -- toggle the checkbox for optimisation
// async get_epc_data()
// -- call the EPC API to get the epc_space_heating and floor_area for a given EPC certificate
// get_check_input_fnc(pid, apply_transform)
// -- returns a function that builds the check_input function, with option of including the transform function
// hide_postcode_related_inputs()
// -- if postcode is not valid then hide address, floor area and epc space heating inputs
// check_postcode_format(postcode)
// -- only call postcodes.io if outcode is of valid format
// async validate_postcode(postcode)
// -- call postcodes.io to get longitude and latitude data for postcode
// async get_address_certificates(postcode)
// -- get a list of addresses and their respective certificate codes for postcode
// show_manual_epc_input()
// -- if postcode is located in scotland or api request failed then fallback to manual floor area and space heating input
// submit_simulation()
// -- ran when submit button clicks. Will submit if all inputs valid.
// async submit_simulation_server()
// -- submit inputs to server to run simulation

// ---- GLOBALS
//let api_url = 'http://localhost:3000';
let api_url = 'https://customapi.heatmyhome.ninja';
let epc_api_url = api_url + '/epc';
let simulate_api_url = api_url + '/simulate';
let submit_status = false;

const input_ranges = { // MIN, MAX, MULTIPLIER
    'temperature': [0, 35, 10],
    'occupants': [1, 20, 1],
    'tes-volume': [0.1, 3.0, 10],
    'epc-space-heating': [0, 999999, 1],
    'floor-area': [25, 500, 1],
}

let input_values = {
    'postcode': undefined,
    'longitude': undefined,
    'latitude': undefined,
    'epc-space-heating': undefined,
    'floor-area': undefined,
    'temperature': undefined,
    'occupants': undefined,
    'tes-volume': undefined,
    'run-on': 'server-rust',
    'enable-optimisation': true,
}

let scottish_postcode = false;
let epc_api_connection = true;
let epc_api_error = false;
let certificate = undefined;
const input_id_list = ['postcode', 'epc-space-heating', 'floor-area', 'temperature', 'occupants', 'tes-volume'];

// ---- INITIALISATION
// apply validation functions to oninput and onchange events for each input (excluding selections and checkboxes)
// run validation incase page was reloaded
for (let input_id of input_id_list) {
    let element = document.getElementById('input-' + input_id);
    if (input_id != 'postcode') {
        element.addEventListener('change', get_check_input_fnc(input_id, true));
    }
    element.addEventListener('input', get_check_input_fnc(input_id, false));
}

// apply onclick events to all elements with the click-dismiss class
click_dismiss();

// update epc url links
update_epc_urls();

// reset run-on select, must add delay otherwise autofill fills old value after reset.
setTimeout(() => {
    console.log('reset');
    document.getElementById('run-location').value = 'server-rust';
}, 10);

// ---- FUNCTIONS

function clear_warnings(pid) {
    let input_box_element = document.getElementById("input-box-" + pid);
    let warn_elements = input_box_element.getElementsByClassName("warn");
    for (let warn_element of warn_elements) {
        warn_element.classList.add("hide");
    }
}

async function check_input(pid, transform, conditions) {
    let input_element = document.getElementById("input-" + pid);
    let help_element = document.getElementById("help-" + pid);
    help_element.classList.add("hide");
    // console.log('check_input: ', pid, 'value: ', input_element.value);

    if (input_element.value == "") {
        clear_element_validation(input_element);
        clear_warnings(pid);
    } else {
        if (transform != undefined) {
            input_element.value = transform(input_element.value);
        }

        let is_valid = true;
        for (let condition of conditions) {
            let warn_pid = await condition(input_element.value);
            if (warn_pid != "") {
                is_valid = false;
                clear_warnings(pid);
                if (warn_pid != "none") {
                    console.log("pid: ", pid, ", warn_pid: ", warn_pid, "condition", condition);
                    let warn_element = document.getElementById("warn-" + pid + '-' + warn_pid);
                    warn_element.classList.remove("hide");
                }
                break;
            }
        }

        if (is_valid) {
            validate_element(input_element);
            if (/[a-z]/i.test(input_element.value)) {
                input_values[pid] = input_element.value;
            } else { // if parameter does not contain letters assume number
                input_values[pid] = Number(input_element.value);
            }
            clear_warnings(pid);
        } else {
            invalidate_element(input_element);
        }
    }
    check_submit();
}

function input_help(pid) {
    let help_button = document.getElementById("input-box-" + pid).getElementsByClassName("input-side-button")[0];

    let help_msg = document.getElementById("help-" + pid);
    if (help_msg.classList.contains("hide")) {
        help_msg.classList.remove("hide");
        help_button.classList.add("active");
    } else {
        help_msg.classList.add("hide");
        help_button.classList.remove("active");
    }
}

function hide_ids(ids) {
    for (let id of ids) {
        document.getElementById(id).classList.add("hide");
    }
}

function unhide_ids(ids) {
    for (let id of ids) {
        document.getElementById(id).classList.remove("hide");
    }
}

function hide_pids(pids) {
    for (let pid of pids) {
        document.getElementById('input-' + pid).classList.add("hide");
    }
}

function unhide_pids(pids) {
    for (let pid of pids) {
        document.getElementById('input-' + pid).classList.remove("hide");
    }
}

function hide_elements(elements) {
    for (let element of elements) {
        element.classList.add("hide");
    }
}

function unhide_elements(elements) {
    for (let element of elements) {
        element.classList.remove("hide");
    }
}

function clear_value(pid) {
    document.getElementById('input-' + pid).value = "";
}

function set_value(pid, value) {
    document.getElementById('input-' + pid).value = value;
}

function validate_element(element) {
    element.classList.add("valid");
    element.classList.remove("invalid");
}

function invalidate_element(element) {
    element.classList.remove("valid");
    element.classList.add("invalid");
}

function clear_element_validation(element) {
    element.classList.remove("valid", "invalid");
}

async function onchange_address() {
    let address_element = document.getElementById("input-address");
    let warn_element = document.getElementById("warn-address-not-listed");
    let epc_box_element = document.getElementById("input-box-epc-space-heating");
    let floor_area_box_element = document.getElementById("input-box-floor-area");
    let searching = document.getElementById("epc-searching");

    let epc_input = document.getElementById("input-epc-space-heating");
    epc_input.value = "";

    clear_value('epc-space-heating');
    get_check_input_fnc('epc-space-heating', false)();
    clear_value('floor-area');
    get_check_input_fnc('floor-area', false)();
    clear_warnings("address");
    hide_ids(['help-address']);

    switch (address_element.value) {
        case "Select Address":
            clear_element_validation(address_element);
            hide_elements([warn_element, epc_box_element, floor_area_box_element]);
            break;
        case "Address Not Listed":
            invalidate_element(address_element);
            unhide_elements([warn_element, epc_box_element, floor_area_box_element]);
            break;
        default:
            validate_element(address_element);
            hide_elements([warn_element, epc_box_element, floor_area_box_element]);
            unhide_elements([searching]);
            await get_epc_data();
            unhide_elements([epc_box_element, floor_area_box_element]);
            hide_elements([searching, warn_element]);
    }
    update_epc_urls();
}

function submit_simulation() {
    let submit_input = document.getElementById("input-submit");
    if (!submit_input.classList.contains('invalid')) {
        submit_input.classList.add('active');
        hide_ids(['warn-sim-api-connection', 'warn-sim-api-error']);
        console.log("submit-simulation: ", input_values);
        submit_simulation_server();
    } else {
        unhide_ids(['warn-submit']);
    }
}

async function submit_simulation_server() {
    let submit_input = document.getElementById("input-submit");
    unhide_ids(['submit-waiting']);
    hide_ids(['submit-complete']);
    let input_names = {
        'postcode': 'postcode',
        'longitude': 'longitude',
        'latitude': 'latitude',
        'epc-space-heating': 'space_heating',
        'floor-area': 'floor_area',
        'temperature': 'temperature',
        'occupants': 'occupants',
        'tes-volume': 'tes_max',
    }

    search = Array();
    for (const [key, value] of Object.entries(input_names)) {
        console.log(key, value, input_values[key]);
        search.push(`${value}=${input_values[key]}`);
    }

    const simulator_url = simulate_api_url + `?${search.join('&')}`;
    console.log('simulator-api-url: ', simulator_url);

    try {
        const response = await fetch(simulator_url);
        const json = await response.json();
        if (json['status'] == 200) {
            console.log('simulator-api-json:', json);
            unhide_ids(['submit-complete']);
        } else {
            throw new Error(json['error']);
        }
    } catch (error) {
        console.error('simulator-api-error: ', error);
        if (error.message == 'Failed to fetch' || error.message == 'Load failed') {
            unhide_ids(['warn-sim-api-connection']);
        } else {
            unhide_ids(['warn-sim-api-error']);
        }
    }
    hide_ids(['submit-waiting']);
    submit_input.classList.remove('active');
}

function check_submit() {
    let submit = true;
    for (let pid of input_id_list) {
        let element = document.getElementById('input-' + pid);
        if (!element.classList.contains("valid")) {
            submit = false;
        }
    }
    if (submit != submit_status) {
        submit_status = submit;
        // let submit_element = document.getElementById('submit-group');
        // let advanced_element = submit_element.getElementsByClassName("input-side-button")[0];
        let submit_input = document.getElementById("input-submit");

        if (submit) {
            submit_input.classList.remove('invalid');
            hide_ids(['warn-submit']);
        } else {
            submit_input.classList.add('invalid');
        }
    }
}

function toggle_advanced_inputs() {
    let run_location = document.getElementById('run-location');
    let submit_element = document.getElementById('submit-group');
    let button = submit_element.getElementsByClassName("input-side-button")[0];
    if (run_location.classList.contains("hide")) {
        unhide_elements([run_location]);
        button.classList.add("active");
        unhide_ids(['run-location', 'help-advanced']);
        set_run_location();
    } else {
        button.classList.remove("active");
        hide_ids(['run-location', 'help-advanced', 'input-box-optimisation']);
    }
}

function click_dismiss() {
    let elements = document.getElementsByClassName('click-dismiss');
    for (let element of elements) {
        element.addEventListener('click', () => { document.getElementById(element.id).classList.add('hide') });
    }
}

function set_run_location() {
    let element = document.getElementById("run-location");
    let optimisation_element = document.getElementById("input-box-optimisation");
    let value = element.getElementsByTagName("option")[element.selectedIndex].value;
    input_values["run-on"] = value;

    switch (value) {
        case 'server-rust':
            hide_elements([optimisation_element]);
            break;
        default:
            unhide_elements([optimisation_element]);
    }
}

function toggle_optimisation() {
    let element = document.getElementById("input-optimisation");
    let box = document.getElementById("input-box-optimisation");
    let divs = element.getElementsByTagName('div');

    if (box.classList.contains("ticked")) {
        box.classList.remove("ticked");
        input_values["enable-optimisation"] = false;
    } else {
        box.classList.add("ticked");
        input_values["enable-optimisation"] = true;
    }

    for (let div of divs) {
        if (div.classList.contains("checkmark")) {
            div.classList.add("crossmark");
            div.classList.remove("checkmark");
        } else {
            div.classList.remove("crossmark");
            div.classList.add("checkmark");
        }
    }
}

async function get_epc_data() {
    let select = document.getElementById('input-address');
    certificate = select.options[select.selectedIndex].value;
    const full_url = `${epc_api_url}?certificate=${certificate}`;

    try {
        const response = await fetch(full_url);
        const json = await response.json();
        if (json['status'] == 200) {
            console.log('epc-certificate-json: ', json);
            const result = json['result'];

            if (result['space-heating']) {
                set_value('epc-space-heating', result['space-heating'].match(/\d+/)[0]);
                get_check_input_fnc('epc-space-heating', false)();
            } else {
                clear_value('epc-space-heating');
                unhide_ids(['warn-epc-space-heating-none']);
            }

            if (result['floor-area']) {
                set_value('floor-area', result['floor-area'].match(/\d+/)[0]);
                get_check_input_fnc('floor-area', false)();
            } else {
                clear_value('floor-area');
                unhide_ids(['warn-floor-area-none']);
            }

            unhide_ids(['help-address']);
        } else {
            throw new Error(json['error']);
        }
    }
    catch (error) {
        console.error('epc-certificate-json-error: ', error);
        if (error.message == "Failed to fetch") {
            unhide_elements(['warn-address-connection']);
        } else {
            unhide_elements(['warn-address-unknown']);
        }
    }
}

function get_check_input_fnc(pid, apply_transform) {
    switch (pid) {
        case 'postcode':
            return async () => {
                let searching = document.getElementById("postcode-searching");
                unhide_elements([searching]);
                await check_input("postcode",
                    (postcode) => { return postcode.toUpperCase().replace(/\s/g, '').substring(0, 7); },
                    [
                        hide_postcode_related_inputs,
                        (postcode) => { return check_postcode_format(postcode); },
                        async (postcode) => { return validate_postcode(postcode); },
                        async (postcode) => { return get_address_certificates(postcode); },
                        show_manual_epc_input,
                    ]
                );
                hide_elements([searching]);
                if (!epc_api_connection) {
                    unhide_ids(['warn-postcode-epc-connection']);
                } else if (epc_api_error) {
                    unhide_ids(['warn-postcode-epc-api']);
                }
                update_epc_urls();
            };
            break;
        default:
            const [min_input, max_input, multipler] = input_ranges[pid];
            return () =>
                check_input(pid,
                    apply_transform ? (value) => { return Math.round(Math.min(Math.max(value, min_input), max_input) * multipler) / multipler; } : undefined,
                    [
                        (value) => { if (value >= min_input && value <= max_input) { return ""; } else { return "range" } },
                    ]
                );
    }
}

function hide_postcode_related_inputs() {
    scottish_postcode = false;
    epc_api_connection = true;
    epc_api_error = false;
    certificate = undefined;
    hide_ids(['input-address', 'help-scottish-postcode', 'input-box-epc-space-heating', 'input-box-floor-area', 'epc-searching', 'help-address']);
    clear_warnings('address');
    clear_value('epc-space-heating');
    get_check_input_fnc('epc-space-heating', false)();
    clear_value('floor-area');
    get_check_input_fnc('floor-area', false)();
    return "";
}

async function validate_postcode(postcode) {
    const postcode_url = 'https://api.postcodes.io/postcodes/' + postcode;
    try {
        const response = await fetch(postcode_url);
        const json = await response.json();
        if (json['status'] == 200) {
            console.log('postcode-api-json:', json);
            if (json.result.latitude != null && json.result.longitude != null) {
                if (json.result.country == "Scotland") {
                    scottish_postcode = true;
                    unhide_ids(['help-scottish-postcode']);
                }
                input_values.latitude = Number(json.result.latitude);
                input_values.longitude = Number(json.result.longitude);
                return "";
            } else {
                throw new Error('Postcode found on API, but does not have an associated latitude and longitude.');
            }
        } else {
            throw new Error(json['error']);
        }
    } catch (error) {
        console.error('postcode-api-error: ', error);
        if (error.message == 'Failed to fetch' || error.message == 'Load failed') {
            return 'io-connection';
        }
        return 'postcodes-io';
    }
}

async function get_address_certificates(postcode) {
    if (!scottish_postcode) {
        const full_url = `${epc_api_url}?postcode=${postcode}`;

        try {
            const response = await fetch(full_url);
            const json = await response.json();
            if (json['status'] == 200) {
                console.log('api-address-certificate-json: ', json);
                let address_element = document.getElementById('input-address');
                while (address_element.getElementsByTagName('option').length > 0) {
                    address_element.removeChild(address_element.lastChild);
                }
                clear_element_validation(address_element);

                let opt1 = document.createElement('option');
                opt1.text = "Select Address";
                opt1.classList.add("color-neutral");
                address_element.appendChild(opt1);
                let opt2 = document.createElement('option');
                opt2.text = "Address Not Listed";
                opt2.classList.add("color-warn");
                address_element.appendChild(opt2);

                for (let [address, certificate] of json.result) {
                    //console.log(address, certificate);
                    let option_element = document.createElement('option');
                    option_element.value = certificate;
                    option_element.classList.add("color-neutral");

                    // capitalise each word
                    address = address.toLowerCase().replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());

                    option_element.text = address.substring(0, 45);
                    address_element.appendChild(option_element);
                }
                unhide_elements([address_element]);
                return "";
            } else {
                throw new Error(json['error']);
            }
        } catch (error) {
            console.error('api-address-certificate-error: ', error);
            if (error.message == 'Failed to fetch' || error.message == 'Load failed') {
                epc_api_connection = false;
                return "";
            }
            epc_api_error = true;
            return "";
        }
    }
    return "";
}

function show_manual_epc_input() {
    if (scottish_postcode || !epc_api_connection || epc_api_error) {
        unhide_ids(['input-box-epc-space-heating', 'input-box-floor-area']);
    } return "";
}

// https://ideal-postcodes.co.uk/guides/uk-postcode-format
const postcode_formats = ["AA9A9AA", "A9A9AA", "A99AA", "A999AA", "AA99AA", "AA999AA"]

function check_postcode_format(postcode) {
    const valid_formats = [0, 1, 2, 3, 4, 5];
    for (let format of postcode_formats) {
        // console.log("format: ", format);

        if (format.length == postcode.length) {
            let valid_format = true;
            for (let i in postcode) {
                if (format[i] == "A" && postcode[i].match(/[a-z]/i)) {
                    // console.log("i", i, "letter: ", postcode[i]);
                } else if (format[i] == "9" && !isNaN(postcode[i])) {
                    // console.log("i", i, "number: ", postcode[i]);
                } else {
                    // console.log("i", i, "wrong: ", postcode[i]);
                    valid_format = false;
                    break;
                }
            }
            if (valid_format) {
                console.log("valid format: ", format);
                return ""
            }
        }
    }
    console.log("no valid format");
    return "none";
}

function update_epc_urls() {
    // GOV EPC, scotland EPC, postcode-specific EPC, address-specific EPC
    if (scottish_postcode) {
        for (let url of epc_urls) {
            url.href = 'https://www.gov.uk/find-energy-certificate';
            // https://www.scottishepcregister.org.uk
        }
    } else {
        let epc_urls = document.getElementsByClassName('epc-url');
        let postcode_element = document.getElementById('input-postcode');
        if (certificate != undefined) {
            for (let url of epc_urls) {
                url.href = 'https://find-energy-certificate.service.gov.uk/energy-certificate/' + certificate;
            }
        } else if (postcode_element.classList.contains("valid")) {
            for (let url of epc_urls) {
                url.href = 'https://find-energy-certificate.service.gov.uk/find-a-certificate/search-by-postcode?postcode=' + postcode_element.value;
            }
        } else {
            for (let url of epc_urls) {
                url.href = 'https://www.gov.uk/find-energy-certificate';
            }
        }
    }
}