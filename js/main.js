

$(function() {
    
    if (window.location.hash != '') {
        const nav_link = $(`a.nav-link[href='${window.location.hash}']`);

        if (nav_link.length > 0) {
            navLinkActive(nav_link);
            pageActiveFromNavLink(nav_link);

            updateOnTabChange(); 
        }
    }
    
    $('a.nav-link').click(function() {
        navLinkActive($(this));
        pageActiveFromNavLink($(this));
    });

    $('button.next-step').click(function() {
        const href = $(this).attr('data-step');
        const nav_link = $(`a.nav-link[href='${href}']`);

        navLinkActive(nav_link);
        pageActiveFromNavLink(nav_link);
    });

    $('#link_datapackage').click(updateScenarioFromDatapackageDropdown);
    $("select[name='datapackage_scenario']").change(updateScenarioFromDatapackageDropdown);
    $("select[name='cross_scenario_weapons']").change(updateWeaponRandoExplanation);
    $("select[name='ammo_pack_modifier']").change(updateAmmoPackExplanation);

    $('img').on('click', function(e) {
        $('#imgViewer').empty().append( $(e.currentTarget).clone().removeClass('img-responsive').removeClass('img-thumbnail') );
        $('#viewImg').modal('show');
    });
});

function navLinkActive(obj) {
    $('a.nav-link').removeClass('active');
    $(obj).addClass('active');
}

function pageActiveFromNavLink(obj) {
    const targetPage = $(obj).attr('href');
    
    $('div.page').removeClass('active');
    $(targetPage).addClass('active');

    history.pushState({}, "", targetPage);

    updateOnTabChange();
}

function loadDatapackage(character, scenario) {
    const item_data = $.get(`data/${character}/items.json`).done(function (data) { return data; });
    const location_data = $.get(`data/${character}/${scenario}/locations.json`).done(function (data) { return data; });
    const location_hardcore_data = $.get(`data/${character}/${scenario}/locations_hardcore.json`).done(function (data) { return data; });

    Promise.all([item_data, location_data, location_hardcore_data]).then(
        function (combined_data) {
            const [items, locations, locations_hardcore] = combined_data;

            const panel_items = $('#datapackage div.panel-items');
            const panel_locations = $('#datapackage div.panel-locations');

            panel_items.empty();
            panel_locations.empty();

            $('<h4 />').html('Items:').prependTo(panel_items);
            $('<em />').html('Names in parentheses are item groups that can be hinted for.').appendTo(panel_items);
            $('<h4 />').html('Locations:').prependTo(panel_locations);

            const list_items = $('<ul />').appendTo(panel_items);
            const list_locations = $('<ul />').appendTo(panel_locations);
            $('<h4 />').html('Hardcore Locations:').appendTo(panel_locations);
            const list_locations_hardcore = $('<ul />').appendTo(panel_locations);

            items.forEach(function (item) {
                const groups = ('groups' in item ? item['groups'] : null);

                $('<li />').html(item['name'] + (groups ? ' (' + groups.join(', ') + ')' : '')).appendTo(list_items);
            });

            locations.forEach(function (location) {
                $('<li />').html(`${location['region']}: ${location['name']}`).appendTo(list_locations);
            });

            locations_hardcore.forEach(function (location) {
                $('<li />').html(`${location['region']}: ${location['name']}`).appendTo(list_locations_hardcore);
            });
        }
    );
}

function exportYAML() {
    const form_object = $('#form_yaml');
    const tab = '    '; // tab = 4 spaces, since \t doesn't work on export
    let form_data = {};

    for (const item of form_object.serializeArray()) {
        form_data[item['name']] = item['value'];
    }

    const player_name = (form_data['player_name'] != '' ? form_data['player_name'] : 'Player');

    let fileContents = `name: ${player_name}\n` +
        "game: Resident Evil 2 Remake\n" +
        "requires:\n" + 
        `${tab}version: 0.6.4\n\n` +
        "Resident Evil 2 Remake:\n" +
        `${tab}progression_balancing: 50\n` +
        `${tab}accessibility: items\n`;

    fileContents += `${tab}character: ${form_data['character']}\n` +
        `${tab}scenario: ${form_data['scenario']}\n` +
        `${tab}difficulty: ${form_data['difficulty']}\n`;

    fileContents += `${tab}starting_hip_pouches: ${form_data['starting_hip_pouches']}\n` +
        `${tab}bonus_start: ${form_data['bonus_start'] == 'on'}\n` +
        `${tab}extra_clock_tower_items: ${form_data['extra_clock_tower_items'] == 'on'}\n` +
        `${tab}extra_medallions: ${form_data['extra_medallions'] == 'on'}\n` +
        `${tab}early_medallions: ${form_data['early_medallions'] == 'on'}\n` +
        `${tab}starting_ink_ribbons: ${form_data['starting_ink_ribbons']}\n`;

    fileContents += `${tab}cross_scenario_weapons: ${form_data['cross_scenario_weapons']}\n`;

    fileContents += `${tab}oops_all_rockets: ${form_data['oops_all'] == 'rockets' }\n` +
        `${tab}oops_all_miniguns: ${form_data['oops_all'] == 'miniguns' }\n` +
        `${tab}oops_all_grenades: ${form_data['oops_all'] == 'grenades' }\n` +
        `${tab}oops_all_knives: ${form_data['oops_all'] == 'knives' }\n`;

    fileContents += `${tab}ammo_pack_modifier: ${form_data['ammo_pack_modifier']}\n`;

    const file = new Blob([fileContents], { type: 'text/yaml' });
    saveAs(file, `RE2R_${player_name}.yaml`);
}
