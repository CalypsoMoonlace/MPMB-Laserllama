/*  -WHAT IS THIS?-
    This file adds optional material to "MPMB's Character Record Sheet" found at https://www.flapkan.com/download#charactersheets
    Import this file using the "Add Extra Materials" bookmark.

    -KEEP IN MIND-
    It is recommended to enter the code in a fresh sheet before adding any other information (i.e. before making your character with it).
    This script requires importing the Exploits first!
	
    -INFORMATION-
    Subject:    Alternate Barbarian

    Effect:     This script adds the Alternate Barbarian class (Version 2.1.1) published by Laserllama in GM Binder under the Fan Content policy.
    			Laserllama: https://www.gmbinder.com/profile/laserllama
    			Alternate Barbarian: https://www.gmbinder.com/share/-N2gn3QXALCVqwAFJe5v
    			Alternate Barbarian expanded: https://www.gmbinder.com/share/-N7MhiHnBhzmgxFtkzBO

    Sheet:      v13.0.06 and newer
 
    Code by:    Original script by CalypsoMoonlace
*/

// Meta information
var iFileName = "LaserLlama - Barbarian.js";
RequiredSheetVersion("13.0.6");

// Check that exploits are properly imported
try {
    var test = SpellsList["disarm"].isExploit
} catch (error) {
    throw new Error("Please import the 'Laserllama - Exploits.js' file before importing this file as otherwise it cannot function properly. You can get it on the github repository.");
}

// Utility functions
function CreateSavageSpellsheet() {
    // This function is called by different eval attributes and is required before EACH USE OF spellcastingBonusElsewhere
    // The reason for that is an edge case: if the player has the sheet created by picking exploits, then removes those picks, the spellsheet is entirely removed

    // Defining the Barbarian spell sheet - also known as Savage exploits
    if (!CurrentSpells["savage exploits"]) {
        CurrentSpells["savage exploits"] = {
            name : "Savage Exploits",
            shortname : "Savage Exploits",
            ability: 1,
            bonus : {},
            typeSp:"known",
            refType:"feat"
        }
    }
}

function ExploitPrereqFactory(tempSpell, class_name) {
    // pre: tempSpell is the key of an item from SpellsList, class_name is a class name (daring today aren't we) eg "fighter(laserllama)"
    // post: returns a prereqeval() function

    // spell has its own prereq
    if (SpellsList[tempSpell].prereqeval) {
        return function(v) {
            const DegreeToMinLevel = [0,0,5,9,13,17];
            return (classes.known[class_name].level >= DegreeToMinLevel[SpellsList[tempSpell].level]) && SpellsList[tempSpell].prereqeval(v);
        }
    }

    return function(v) {
        const DegreeToMinLevel = [0,0,5,9,13,17];
        return classes.known[class_name].level >= DegreeToMinLevel[SpellsList[tempSpell].level];
    }

}

ClassList["barbarian(laserllama)"] = {

    name : "Barbarian(LaserLlama)",
    regExpSearch : /^(?=.*barbarian)(?=.*laserllama).*$/i,
    source : ["GMB:LL", 0],
    primaryAbility : "Strength",
    prereqs : "Strength 13",
    die : 12,
    improvements : [0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 5, 5],
    saves : ["Str", "Con"],
    skillstxt : {
        primary : "Choose two from Animal Handling, Athletics, Intimidation, Nature, Perception, and Survival."
    },
    armorProfs : { // the 4 entries are for: ["light", "medium", "heavy", "shields"]
        primary : [true, true, false, true], // the armor proficiencies if this is the first or only class
        secondary : [false, false, false, true] // the armor proficiencies if this class is multiclassed with (so not taken at level 1, but later)
    },
    weaponProfs : {
        primary : [true, true],
        secondary : [true, true]
    },
    equipment : "Barbarian starting equipment:" + 
                "\n \u2022 greataxe -or- greatsword -or- maul;" +
                "\n \u2022 two handaxes -or- any simple weapon;" +
                "\n \u2022 hide armor, an explorer's pack, and four javelins;" + 
                "\n\nAlternatively, choose 2d4 x 10 gp worth of starting equipment instead of both the class' and the background's starting equipment.", 
    subclasses : ["Primal Path", []], 
    attacks : [1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2], 
    abilitySave : 1,
    abilitySaveAlt : 2,
    features : {

        "rage" : {
            name : "Rage",
            source : [["GMB:LL", 0]],
            minlevel : 1,
            description : levels.map(function (n) {
                if (n < 7) {
                    return desc(["Start as bonus action; bonus damage to weapon attacks using Str; lasts up to 10 min",
                            "Adv. on Con checks, Str checks/saves (not attacks); resistance to bludg/piercing/slashing",
                            "I cannot cast spells or concentrate on spells or effects",
                            "Lasts until the end of my next turn unless I extend it by doing one of the following before:",
                            "Attack a creature, make a Strength check, take damage, or use my bonus action"])
                }

                if (n < 15) {
                    return desc(["Start as bonus action; bonus damage to weapon attacks using Str; lasts up to 10 min",
                            "Adv. on Con checks, Str checks/saves (not attacks); resistance to bludg/piercing/slashing",
                            "I cannot cast spells or concentrate on spells or effects",
                            "Stops early if I choose to end it or fall unconscious"])
                }

                return desc(["Start as bonus action; bonus damage to weapon attacks using Str; lasts up to 1 h",
                            "Adv. on Con checks, Str checks/saves (not attacks); resistance to bludg/piercing/slashing",
                            "I cannot cast spells or concentrate on spells or effects",
                            "Stops early if I choose to end it or fall unconscious"])
            }),
            usages : [1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, "\u221E\xD7 per "],
            recovery : "short rest",
            action : ["bonus action", ""],
            dmgres : [["Bludgeoning", "Bludgeon. (in rage)"], ["Piercing", "Piercing (in rage)"], ["Slashing", "Slashing (in rage)"]],
            calcChanges : {
                atkAdd : [
                    function (fields, v) {
                        var ExplDieRange = ["d4", "d4", "d4", "d4", "d6", "d6", "d6", "d6", "d6", "d6", "d8", "d8", "d8", "d8", "d8", "d8", "d10", "d10", "d10", "d10"]
                        
                        if (v.isMeleeWeapon && fields.Mod === 1 && classes.known["barbarian(laserllama)"] && classes.known["barbarian(laserllama)"].level) {
                            var ExplDie = ExplDieRange[classes.known["barbarian(laserllama)"].level - 1]
                            fields.Description += (fields.Description ? '; ' : '') + '+1'+ExplDie+' dmg in Rage';
                        }
                    },
                    "I deal additional damage with Strength based attacks while in Rage",
                    20
                ]
            } 
        },
        
        "unarmored defense" : {
            name : "Unarmored Defense",
            source : [["GMB:LL", 0]],
            minlevel : 1,
            description : desc(["Without armor, my AC is 10 + Dexterity modifier + Constitution modifier + shield"]),
            armorOptions : [{
                regExpSearch : /justToAddToDropDown/,
                name : "Unarmored Defense",
                source : [["GMB:LL", 0]],
                ac : "10+Con",
                affectsWildShape : true
                }],
            armorAdd : "Unarmored Defense (Con)"
        },
        
        "danger sense" : {
            name : "Danger Sense",
            source : [["GMB:LL", 0]],
            minlevel : 2,
            description : desc("I get adv. on Initiative; I can enter rage to act normally on the first turn when surprised"),
            advantages : [["Initiative", true]]
        },
        

        "savage exploits": function(){
            // Fixed attributes
            SavageExploits = {
                name : "Savage Exploits",
                minlevel : 2,
                source : [["GMB:LL", 0]],
                description : desc(["I gain Exploit Dice, which are used to fuel my Savage Exploits", 
                    "Use the \"Choose Feature\" button above to choose Savage Exploits"]),
                toNotesPage : [{
                    name : "Savage Exploits",
                    note : desc(["Below are all Savage Exploits I know. Each 3rd and 4th degree exploits can only be used once per short rest. Each 5th degree exploit can only be used once per long rest."])
                }],
            
                // Savage Exploits
                extraname : "Savage Exploits",
                extrachoices : [],
                extraTimes : ['', 2, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8],

                // Exploit dice
                limfeaname : "Exploit Dice",
                usages : ['', 2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5],
                additional : ['', "d4", "d4", "d4", "d6", "d6", "d6", "d6", "d6", "d6", "d8", "d8", "d8", "d8", "d8", "d8", "d10", "d10", "d10", "d10"],
                recovery : "short rest",
            };

            // Make a filtered spell list that contains only barbarian(laserllama) "spells"
            const BarbarianSpells = Object.keys(SpellsList).filter((key) => SpellsList[key].isExploit).filter((key) => {
                for (var i = 0; i < SpellsList[key].classes.length; i++) {
                    if (SpellsList[key].classes[i] == "barbarian(laserllama)") return true;
                }
                return false;
                // NOTE: this is literally a SpellsList[key].classes.includes("barbarian(laserllama)") but for some cursed reason I can't use that function
            });

            // Iterate over all barbarian(laserllama) "spells"
            for (var i = 0; i < BarbarianSpells.length; i++) {
                var NewSpell = SpellsList[BarbarianSpells[i]];
                var tempSpell = BarbarianSpells[i];

                SavageExploits.extrachoices.push(NewSpell.name); // Add "spell" name to menu options

                SavageExploits[BarbarianSpells[i]] = { // Add "spell" to the main item (when it is picked through the menu)
                    name: NewSpell.name,
                    toNotesPage : [{ // What is added to the notes page
                        name : NewSpell.name + " Exploit [" + (NewSpell.level == 1 ? '1st' : NewSpell.level == 2 ? '2nd' : NewSpell.level == 3 ? '3rd': NewSpell.level + 'th') + " degree]",
                        note : desc(NewSpell.descriptionFull),
                        amendTo : "Savage Exploits"
                    }],
                    source: NewSpell.source,
                    addMod: NewSpell.addMod,
                    submenu: NewSpell.submenu,
                    prereqeval: ExploitPrereqFactory(BarbarianSpells[i], "barbarian(laserllama)"),
                    eval: CreateSavageSpellsheet, // in case the user removes all exploits
                    spellcastingBonusElsewhere : {
                        addTo : "savage exploits",
                        spellcastingBonus : {
                            name : "Savage Exploits",
                            spellcastingAbility : 1,
                            spells : [BarbarianSpells[i]],
                            selection : [BarbarianSpells[i]]
                        }
                    }
                }
            }

            return SavageExploits
        }(),

        "subclassfeature3" : {
            name : "Primal Path",
            source : ["GMB:LL", 0],
            minlevel : 3,
            description : desc(["Choose a path that best represents my combat and rage style and put it in the \"Class\" field",])
        },

        "reckless" : {
            name : "Reckless",
            source : ["GMB:LL", 0],
            minlevel : 5,
            description : desc(["I can choose to have advantage on all Strength-based attacks on my turn",
                "When doing so, other creatures have advantage against me for until my next turn"])
        },

        "feral instincts" : {
            name : "Feral Instincts",
            source : ["GMB:LL", 0],
            minlevel : 7,
            description : desc(["I have adv. on Dex saves against effects I can see unless I'm blinded/deafened/incapacitated"]),
            savetxt : { text : ["Adv. on Dex saves vs. seen effects"] }
        },

        "improved critical" : {
            name : "Improved Critical",
            source : ["GMB:LL", 0],
            minlevel : 9,
            description : levels.map(function(n) {
                var CritRange = n < 9 ? 20 : n < 13 ? 19 : n < 17 ? 18 : 17

                return desc("My Strength-based attacks crit on rolling a "+CritRange+" or higher on the d20");
            }),
            calcChanges : {
                atkAdd : [
                    function (fields, v) {
                        if (!v.isSpell && fields.Mod === 1 && classes.known["barbarian(laserllama)"] && classes.known["barbarian(laserllama)"].level) {
                            if (!v.CritChance && classes.known["barbarian(laserllama)"].level < 13) {
                                fields.Description += (fields.Description ? '; ' : '') + 'Crit on 19-20';
                                v.CritChance = 19;
                            }

                            if ((!v.CritChance || v.CritChance >= 19) && classes.known["barbarian(laserllama)"].level >= 13 && classes.known["barbarian(laserllama)"].level < 17) {
                                fields.Description += (fields.Description ? '; ' : '') + 'Crit on 18-20';
                                v.CritChance = 18;
                            }

                            if ((!v.CritChance || v.CritChance >= 18) && classes.known["barbarian(laserllama)"].level >= 17) {
                                fields.Description += (fields.Description ? '; ' : '') + 'Crit on 17-20';
                                v.CritChance = 17;
                            }
                        }
                    },
                    "My weapon attacks score a critical hit on 19-20 (if barbarian lvl < 13) or 18-20 (if barbarian lvl < 17) or 17-20 (if barbarian lvl >= 17)",
                    17
                ]
            }
        },

        "critical strike" : {
            name : "Critical Strike",
            source : ["GMB:LL", 0],
            minlevel : 11,
            description : desc(["When I crit while raging, I can use an Exploit I know without expending a Die"])
        },

        "relentless rage" : {
            name : "Relentless Rage",
            source : ["GMB:LL", 0],
            minlevel : 11,
            description : desc(["If I drop to 0 HP while raging, I can end my rage to drop to 1 HP instead",
                "Whenever I make an Int, Wis or Cha save, I add my Con mod"]),
            addMod : [
                { type : "save", field : "Int", mod : "Con", text : "Relentless Rage class feature" },
                { type : "save", field : "Wis", mod : "Con", text : "Relentless Rage class feature" },
                { type : "save", field : "Cha", mod : "Con", text : "Relentless Rage class feature" },
            ]
        },

        // Persistent rage is added by modifying the Rage feature

        "indomitable might" : {
            name : "Indomitable Might",
            source : ["GMB:LL", 0],
            minlevel : 18,
            description : desc("If a Str or Con check is lower than my Strength score, I can use my Strength score instead")
        },

        "primal champion" : {
            name : "Primal Champion",
            source : ["GMB:LL", 0],
            minlevel : 20,
            description : desc("I add +4 to both my Strength and Constitution, and their maximums increase to 24"),
            scores : [4,0,4,0,0,0],
            scoresMaximum : [24,0,24,0,0,0]
        }
    }
}