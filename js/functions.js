function updateScenarioFromDatapackageDropdown() {
    let character = 'leon';
    let scenario = 'a';
    let dropdown_value = $("select[name='datapackage_scenario']").val();

    if (dropdown_value) {
        [character, scenario] = dropdown_value.split('_');
    }

    loadDatapackage(character, scenario);
};

function updateWeaponRandoExplanation() {
    let dropdown_value = $("select[name='cross_scenario_weapons']").val();
    let explanation = "";

    switch (dropdown_value) {
        case "starting":
            explanation = "Only your starting weapon is rando'd. It can be rando'd to any other weapon.";
            break;

        case "match":
            explanation = "Weapon rando will match weapons by strength. Includes their upgrades and ammo.";
            break;

        case "full":
            explanation = "Weapon rando will pick weapons randomly. Can pick all weak/strong weapons, or something in between. Includes their upgrades. Ammo is matched and split by type.";
            break;

        case "all":
            explanation = "Weapon rando will add every available weapon and their upgrades. Ammo is matched and split by type.";
            break;

        case "full_ammo":
            explanation = "Same as Full (picks weapons at random), and will also randomize how much ammo is placed for each in the world.";
            break;

        case "all_ammo":
            explanation = "Same as All (adds every weapon from all 4 scenarios), and randomizes how much ammo is placed for each in the world.";
            break;

        case "troll":
            explanation = "This option is pain. Don't do this if you're new to RE2R or this rando.";
            break;

        case "none":
        default:
            explanation = "Scenario has normal weapons, and they are randomized.";
            break;
    }

    $('#csw_explanation').html(explanation);

    if (dropdown_value == "none") {
        $('#recommend_bonus_start').hide();
    }
    else {
        $('#recommend_bonus_start').show();
    }
};

const updateAmmoPackExplanation = function() {
    let dropdown_value = $("select[name='ammo_pack_modifier']").val();
    let explanation = "";

    switch (dropdown_value) {
        case "max":
            explanation = "Each ammo pack will contain the maximum amount of ammo that the game allows.";
            break;

        case "double":
            explanation = "Each ammo pack will contain twice as much ammo as it normally contains.";
            break;

        case "half":
            explanation = "Each ammo pack will contain half as much ammo as it normally contains.";
            break;

        case "only_three":
            explanation = "Each ammo pack will have an ammo count of 3.";
            break;

        case "only_two":
            explanation = "Each ammo pack will have an ammo count of 2.";
            break;

        case "only_one":
            explanation = "Each ammo pack will have an ammo count of 1. (Yes, your Handgun Ammo pack will have a single bullet in it.)";
            break;

        case "random_by_type":
            explanation = "Each ammo type's pack will have a random quantity of ammo, and you will get that same quantity of ammo from every pack for that ammo type.";
            break;

        case "random_always":
            explanation = "Each ammo pack will have a random quantity of ammo, and that quantity will be randomized every time.";
            break;

        case "none":
        default:
            explanation = "Ammo packs have normal quantities of ammo.";
            break;
    }

    $('#apm_explanation').html(explanation);
};

const updateOnTabChange = function() {
    if (window.location.hash == '#datapackage') {
        updateScenarioFromDatapackageDropdown();
    }

    if (window.location.hash == '#yamloptions') {
        updateWeaponRandoExplanation();
        updateAmmoPackExplanation();
    }
};

