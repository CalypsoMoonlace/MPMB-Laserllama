/*  -WHAT IS THIS?-
    This file adds optional material to "MPMB's Character Record Sheet" found at https://www.flapkan.com/download#charactersheets
    Import this file using the "Add Extra Materials" bookmark.

    -KEEP IN MIND-
    It is recommended to enter the code in a fresh sheet before adding any other information (i.e. before making your character with it).
    This script requires importing the Common attributes first!
	
    -INFORMATION-
    Subject:    Alternate Barbarian

    Effect:     This script adds the Alternate Barbarian class (Version 2.1.1) published by Laserllama in GM Binder under the Fan Content policy.
    			Laserllama: https://www.gmbinder.com/profile/laserllama
    			Alternate Barbarian: https://www.gmbinder.com/share/-N2gn3QXALCVqwAFJe5v
    			Alternate Barbarian expanded: https://www.gmbinder.com/share/-N7MhiHnBhzmgxFtkzBO

    Sheet:      v13.0.06 and newer
 
    Code by:    Original script by CalypsoMoonlace
                With contributions from Mastersskull
*/

// Meta information
var iFileName = "LaserLlama - Barbarian.js";
RequiredSheetVersion("13.0.6");

// Check that exploits are properly imported
try {
    var test = SpellsList["disarm"].isExploit
} catch (error) {
    throw new Error("Please import the 'Laserllama - Common attributes.js' file before importing this file as otherwise it cannot function properly. You can get it on the github repository.");
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

function GetSubclassExploits(subclass_name, exploit_list) {
    /* pre: subclass_name is a string
            exploit_list is an array of length 5
            1st and 2nd elements are the 1st degree exploits
            3rd and 4th elements are the 2nd degree exploits
            5th element is the 3rd degree exploit

        post: returns the subclassfeature that contains all the subclass exploits

        note: All exploits have to first be defined through SpellsList, otherwise it *will* crash
    */      
    SubclassExploits = {
        name : subclass_name +  " Exploits",
        source : [["GMB:LL", 0]],
        minlevel : 3,
        description : desc(["I learn additional Exploits who don't count against my total and can't be switched"]),
        toNotesPage : [{
                name : subclass_name +  " Exploits",
                note : desc(["Below are my " + subclass_name + " exploits. The 3rd level exploit can only be used per short rest."])
            }],
        autoSelectExtrachoices : [{
            extrachoice : exploit_list[0],
            minlevel : 3
        }, {
            extrachoice : exploit_list[1],
            minlevel : 3
        }, {
            extrachoice : exploit_list[2],
            minlevel : 5
        }, {
            extrachoice : exploit_list[3],
            minlevel : 5
        }, {
            extrachoice : exploit_list[4],
            minlevel : 9
        }]
    };

    for (var i = 0; i < SubclassExploits.autoSelectExtrachoices.length; i++) {
        var NewSpellKey = SubclassExploits.autoSelectExtrachoices[i].extrachoice;

        SubclassExploits[NewSpellKey] = {
            name: SpellsList[NewSpellKey].name,
            toNotesPage : [{ // What is added to the notes page
                name : SpellsList[NewSpellKey].name + " Exploit [" + (SpellsList[NewSpellKey].level == 1 ? '1st' : SpellsList[NewSpellKey].level == 2 ? '2nd' : SpellsList[NewSpellKey].level == 3 ? '3rd': SpellsList[NewSpellKey].level + 'th') + " degree]",
                note : desc(SpellsList[NewSpellKey].descriptionFull),
                amendTo : SubclassExploits.name
            }],
            source: SpellsList[NewSpellKey].source,
            addMod: SpellsList[NewSpellKey].addMod,
            submenu: SpellsList[NewSpellKey].submenu,
            eval: CreateSavageSpellsheet,
            spellcastingBonusElsewhere : {
                addTo : "savage exploits",
                spellcastingBonus : {
                    name : subclass_name +  " Exploits",
                    spellcastingAbility : 1,
                    spells : [NewSpellKey],
                    selection : [NewSpellKey]
                    //prepared : true // enabling this puts a star on the column, which, while it is cool, is incompatible with stuff that edits it to "at will"
                }
            }
        };
    }

    return SubclassExploits;
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

function ExploitPrereqFactoryReaver(tempSpell, class_name) {
    // NOTE: Same as ExploitPrereqFactory but for the Reaver subclass with an additional check for barb lvl > 3 

    // spell has its own prereq
    if (SpellsList[tempSpell].prereqeval) {
        return function(v) {
            const DegreeToMinLevel = [0,0,5,9,13,17];
            return (classes.known[class_name].level >= DegreeToMinLevel[SpellsList[tempSpell].level]  && classes.known[class_name].level >= 3) 
                        && SpellsList[tempSpell].prereqeval(v);
        }
    }

    return function(v) {
        const DegreeToMinLevel = [0,0,5,9,13,17];
        return (classes.known[class_name].level >= DegreeToMinLevel[SpellsList[tempSpell].level] && classes.known[class_name].level >= 3);
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
    abilitySave : 1, // Alt Barbarian uses Strength or Dex for foes' saving throws
    abilitySaveAlt : 2,
    spellcastingFactor : "warlock99", // Required for the "create a complete spell sheet" option; using the warlock option ensures it doesn't clash with multiclassing
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
                            "Attack a creature, make a Strength check, take damage, or use my bonus action to extend it"])
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
            savetxt : { text : ["Adv. on Str saves in rage"] },
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
            description : desc("Without armor, my AC is 10 + Dexterity modifier + Constitution modifier + shield"),
            armorOptions : [{
                regExpSearch : /justToAddToDropDown/,
                name : "Unarmored Defense (Con)",
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


// Create warden spell list
var WardenList = [
    "control flames", "create bonfire", "druidcraft", "frostbite", "guidance", "gust", "magic stone", "mold earth", "primal savagery", "shape water", "shillelagh", "thorn whip", "thunderclap",
    "absorb elements", "armor of agathys", "compelled duel", "cure wounds", "earth tremor", "ensnaring strike", "entangle", "fog cloud", "hellish rebuke", "inflict wounds", "searing smite", "thunderous smite", "thunderwave",
    "dust devil", "earthbind", "chromatic blade", "gust of wind", "magic weapon", "shatter", "spike growth", "warding wind",
    "elemental weapon", "plant growth", "sleet storm", "thunder step", "tidal wave", "wall of sand", "wall of water", "wind wall",
    "control water", "elemental bane", "fire shield", "grasping vine", "guardian of nature", "ice storm", "staggering smite", "storm sphere"
];

for (var i = 0; i < WardenList.length; i++) {
    try {
        SpellsList[WardenList[i]].classes.push("warden");
    } catch (error) {
        throw new Error(WardenList[i]) 
    }   
}


// Subclasses
// Path of the Berserker
AddSubClass("barbarian(laserllama)", "berserker", {
    regExpSearch : /berserker/i,
    subname : "Path of the Berserker",
    fullname : "Berserker",
    source : [["GMB:LL", 0]],
    abilitySave : 1,
    abilitySaveAlt : 2,
    features : {
        "subclassfeature3" : GetSubclassExploits("Berserker", ["cunning instinct","savage rebuke","bloodthirsty critical","menacing shout","roar of triumph"]),
        "subclassfeature3.1" : {
            name : "Frenzy",
            source : [["GMB:LL", 0]],
            minlevel : 3,
            description : desc(["The first time I hit with a Strength-based weapon attack on my turn, I deal bonus damage equal to two rolls of my Exploit Die",
                "While Raging, my walking speed increases by 10 feet"]),
        },

        "subclassfeature6" : {
            name : "Mindless Rage",
            source : [["GMB:LL", 0]],
            minlevel : 6,
            description : desc(["While raging, I can't be charmed or frightened, and such effects are suspended",
                "Also, while raging I can ignore the effects of the first five levels of exhaustion"]),
            savetxt : { text : ["Immune to being charmed/frightened and exhaustion in rage"] }
        },
        "subclassfeature10" : {
            name : "Intimidating Presence",
            source : [["GMB:LL", 0]],
            minlevel : 10,
            description : desc(["I can use menacing shout without expending an Exploit Die",
                "Also, when I use menacing shout after hitting with a melee weapon attack, the crea has disadv. on the save"]),
            
            limfeaname : "Menacing Shout",
            usages : "Con mod per ",
            usagescalc : "event.value = Math.max(1, What('Con Mod'));",
            recovery : "long rest",
        },
        "subclassfeature14" : {
            name : "Unrivaled Fury",
            source : [["GMB:LL", 0]],
            minlevel : 14,
            description : desc(["I can use savage rebuke at will, without expending an Exploit Die"]),
            calcChanges : {
                spellAdd : [
                    function (spellKey, spellObj, spName) {
                        if (spellKey == "savage rebuke") {
                            spellObj.firstCol = "atwill";
                            return true;
                        };
                    },
                    "I can use the Savage Rebuke exploit at will without expending an Exploit Die"
                ]
            },
        }
    }
})

// Path of the Brute
AddSubClass("barbarian(laserllama)", "brute", {
    regExpSearch : /brute/i,
    subname : "Path of the Brute",
    fullname : "Brute",
    source : [["GMB:LL", 0]],
    abilitySave : 1,
    abilitySaveAlt : 2,
    features : {
        "subclassfeature3" : GetSubclassExploits("Brutish", ["commanding presence","crushing grip","concussive blow","greater hurl","confounding critical"]),
        "subclassfeature3.1" : {
            name : "The Wrong Crowd",
            source : [["GMB:LL", 0]],
            minlevel : 3,
            description : desc("When I spend a night carousing in a settlement of any size, I have adv. on all checks to gather info on that settlement, its culture, factions, and any important, infamous, or influential figures"),
        },
        "subclassfeature3.2" : {
            name : "Unarmed & Dangerous", 
            source : [["GMB:LL", 0]],
            minlevel : 3,
            description : levels.map(function (n) {
                var ExplDie = (n < 5 ? 4 : n < 11 ? 6 : n < 17 ? 8 : 10);

                return desc(["My unarmed strikes deal 1d"+ExplDie+" bludgeoning damage",
                    "When raging, if I use my action to only make unarmed attacks/shove/grapple, I can make another as bonus action"])
            }),
            weaponsAdd : ["Unarmed Strike"],
            action : ["bonus action", ""],
            calcChanges : {
                atkAdd : [
                    function (fields, v) {
                        if (v.baseWeaponName == "unarmed strike" && classes.known["barbarian(laserllama)"] && classes.known["barbarian(laserllama)"].level) {
                            try {
                                var curDie = eval_ish(fields.Damage_Die.replace('d', '*'));
                            } catch (e) {
                                var curDie = 'x';
                            };

                            var aBruteDie = function (n) {return  (n < 5 ? 4 : n < 11 ? 6 : n < 17 ? 8 : 10);}(classes.known["barbarian(laserllama)"].level)
                        
                            if (isNaN(curDie) || curDie < aBruteDie) {
                                fields.Damage_Die = '1d' + aBruteDie;
                            };
                        }
                    },
                    "My unarmed strikes deal bludgeoning damage equal to one roll of my Exploit Die",
                    6 // Evaluated after Monk's martial arts atkAdd
                ]
            }
        },

        "subclassfeature6" : {
            name : "Brutal Strikes",
            source : [["GMB:LL", 0]],
            minlevel : 6,
            description : desc(["While Raging, my unarmed strikes count as magical for overcoming resistances & immunities",
                "On hit with an unarmed strike, I can use concussive blow without expending an Exploit Die"]),
            calcChanges : {
                atkAdd : [
                    function (fields, v) {
                        if (v.baseWeaponName == "unarmed strike" && !v.thisWeapon[1] && !v.theWea.isMagicWeapon && !(/counts as( a)? magical/i).test(fields.Description)) {
                            fields.Description += (fields.Description ? '; ' : '') + 'Counts as magical in rage';
                        };
                    },
                    "My unarmed strikes count as magical for overcoming resistances and immunities, but only during my rage."
                ]
            },
            limfeaname : "Concussive blows",
            usages : "Con mod per ",
            usagescalc : "event.value = Math.max(1, What('Con Mod'));",
            recovery : "long rest",
        },
        "subclassfeature10" : {
            name : "Iron Grip",
            source : [["GMB:LL", 0]],
            minlevel : 10,
            description : desc(["While Raging, I can grapple creatures up to two sizes larger than me and my walk speed is no longer halved when dragging a grappled creature",
                "I also gain a climb speed equal to my walking speed"]),
            speed : {
                climb : { spd : "walk", enc : 0 }
            },
        },
        "subclassfeature14" : {
            name : "Brutish Determination",
            source : [["GMB:LL", 0]],
            minlevel : 14,
            description : desc(["When I make a Strength, Dexterity, Constitution, or death save, I add a d4 to my roll",
                "If I roll a total of ≥20 on a death save, I instantly regain consciousness and stand up with 1 HP"])
        }
    }
})

// Path of the Champion
AddSubClass("barbarian(laserllama)", "champion", {
    regExpSearch : /champion/i,
    subname : "Path of the Champion",
    fullname : "Champion", // same name as fighter subclass; it will break the regex (only one of those two can work at the same time) // let me know if this is something you want to be fixed
    source : [["GMB:LL", 0]],
    abilitySave : 1,
    abilitySaveAlt : 2,
    features : {
        // Override martial exploits because size of die increases
        // NOTE: This has been copy pasted from the main class. IT WON'T WORK IF YOU TRY TO USE newObj ! (it will cause a crash because of some variable's scope)
        // I do not know how to fix that scoping bug, so I went for the more brute force approach. If it works, it aint stupid ;)
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
                usages : ['', 2, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6],
                additional : ['', "d4", "d4 (d6 in rage)", "d4 (d6 in rage)", "d6 (d8 in rage)", "d6 (d8 in rage)", "d6 (d8 in rage)", "d6 (d8 in rage)", "d6 (d8 in rage)", "d6 (d8 in rage)", "d8 (d10 in rage)", "d8 (d10 in rage)", "d8 (d10 in rage)", "d8 (d10 in rage)", "d8 (d10 in rage)", "d8 (d10 in rage)", "d10 (d12 in rage)", "d10 (d12 in rage)", "d10 (d12 in rage)", "d10 (d12 in rage)"],
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

        "subclassfeature3" : GetSubclassExploits("Champion", ["feat of strength","mighty leap","honor duel","thunderous blow","mythic resilience"]),
        "subclassfeature3.1" : {
            name : "Fighting Style",
            source : [["GMB:LL", 0]],
            minlevel : 3,
            description : desc('Choose a Fighting Style for your character using the "Choose Feature" button above'),
            choices : ["Dual Wielding", "Great Weapon Fighting", "Improvised Fighting", "Strongbow", "Thrown Weapon Fighting", "Versatile Fighting"],
            "dual wielding" : FightingStylesLL.dual_wielding,
            "great weapon fighting" : FightingStylesLL.great_weapon,
            "improvised fighting" : FightingStylesLL.improvised,
            "strongbow" : FightingStylesLL.strongbow,
            "thrown weapon fighting" : FightingStylesLL.thrown,
            "versatile fighting" : FightingStylesLL.versatile
        },
        "subclassfeature6" : {
            name : "Mighty Blow",
            source : [["GMB:LL", 0]],
            minlevel : 6,
            description : desc(["While raging, I can choose to end my rage after hitting with a Strength-based weapon attack to turn the hit into a crit"]),
            usages : 1,
            recovery : "short rest"
        },
        "subclassfeature6.1" : {
            name : "Peak Athlete",
            source : [["GMB:LL", 0]],
            minlevel : 6,
            description : desc(["I gain a climbing and swimming speed equal to my walking speed", 
                "When I enter my Rage, I gain the benefits of the Dash action"]),
            speed : {
                swim : { spd : "walk", enc : 0 },
                climb : { spd : "walk", enc : 0 }
            }
        },
        "subclassfeature10" : {
            name : "Invigorating Critical",
            source : [["GMB:LL", 0]],
            minlevel : 10,
            description : levels.map(function (n) {
                var ExplDie = (n < 5 ? 6 : n < 11 ? 8 : n < 17 ? 10 : 12);

                return desc(["When I crit with a Strength-based weapon attack, I regain HP equal to 1d"+ExplDie+" + my Con mod (min 1)"])
            })
        },
        "subclassfeature14" : {
            name : "Survivor",
            source : [["GMB:LL", 0]],
            minlevel : 14,
            description : desc(["At the start of my turn, if I'm not at 0 HP I gain temp HP equal to my Con mod"])
        }
    }
})

// Path of the Totem Warrior
AddSubClass("barbarian(laserllama)", "totem warrior", { 
    regExpSearch : /^(?=.*totem)(?=.*warrior).*$/i,
    subname : "Path of the Totem Warrior",
    fullname : "Totem Warrior",
    source : ["GMB:LL", 0],
    features : {
        "subclassfeature3" : GetSubclassExploits("Totemic", ["mighty leap", "rustic intuition","arresting critical", "greater hurl","savage defiance"]),
        "subclassfeature3.1" : {
            name : "Spirit Guide",
            source : [["GMB:LL", 0]],
            minlevel : 3,
            description : desc(["I can cast Beast Sense and Speak with Animals as rituals"]),
            spellcastingBonus : {
                name : "Spirit Guide",
                spells : ["beast sense", "speak with animals"],
                selection : ["beast sense", "speak with animals"],
                firstCol : "(R)",
                times : 2
            },
            spellChanges : {
                "beast sense" : {
                    time : "10 min",
                    changes : "I can cast this spell only as a ritual, thus its casting time is 10 minutes longer."
                },
                "speak with animals" : {
                    time : "10 min",
                    changes : "I can cast this spell only as a ritual, thus its casting time is 10 minutes longer."
                }
            }
        },

        "subclassfeature3.2" : {
            name : "Totemic Spirit",
            source : [["GMB:LL", 0]],
            minlevel : 3,
            description : desc(['Choose Bear, Eagle, Elk, Wolf, or Tiger Spirit using the "Choose Feature" button above']),
            choices : ["Bear", "Eagle", "Elk", "Tiger", "Wolf"],
            "bear" : {
                name : "Bear Spirit",
                description : "\n   " + "While raging, I have resistance to all damage types except psychic and force",
                dmgres : [["All -Psy/For", "All -Psy/For (rage)"]], // have to keep this as short as possible
                eval : function() {
                    processResistance(false, 'Barbarian(LaserLlama): Rage', ClassList["barbarian(laserllama)"].features.rage.dmgres);
                },
                removeeval : function() {
                    processResistance(true, 'Barbarian(LaserLlama): Rage', ClassList["barbarian(laserllama)"].features.rage.dmgres);
                }
            },
            "eagle" : {
                name : "Eagle Spirit",
                description : desc(["While Raging, I can use a bonus action to gain the benefits of the Dash and Disengage action, including the bonus action that I use to enter a Rage"]),
                action : ["bonus action", " (Dash & Disengage)"]
            },
            "elk" : {
                name : "Elk Spirit",
                description : desc(["While Raging, my walking speed increases by 15 ft"])
            },
            "tiger" : {
                name : "Tiger Spirit",
                description : desc(["Once per turn while Raging, I can use mighty leap at its lowest level without expending an Exploit Die"])
            },
            "wolf" : {
                name : "Wolf Spirit",
                description : desc(["While raging, friends have advantage on melee attacks vs. hostiles creatures within 10 ft of me"])
            }
        },
        "subclassfeature6" : {
            name : "Totemic Aspect",
            source : [["GMB:LL", 0]],
            minlevel : 6,
            description : desc('Choose Elephant, Owl or Panther using the "Choose Feature" button above'),
            choices : ["Elephant", "Owl", "Panther"],
            "elephant" : {
                name : "Aspect of the Elephant",
                description : desc("I add my Con mod to Strength (Athletics) and Wisdom (Insight) checks"),
                addMod : [
                    { type : "skill", field : "Athletics", mod : "max(Con|0)", text : "I add my Con mod to Strength (Athletics) and Wisdom (Insight) checks" },
                    { type : "skill", field : "Insight", mod : "max(Con|0)", text : "I add my Con mod to Strength (Athletics) and Wisdom (Insight) checks" }
                ],
            },
            "owl" : {
                name : "Aspect of the Owl",
                description : desc("I add my Con mod to Intelligence (Investigation) and Wisdom (Perception) checks"),
                addMod : [
                    { type : "skill", field : "Investigation", mod : "max(Con|0)", text : "I add my Con mod to Intelligence (Investigation) and Wisdom (Perception) checks" },
                    { type : "skill", field : "Perception", mod : "max(Con|0)", text : "I add my Con mod to Intelligence (Investigation) and Wisdom (Perception) checks" }
                ],
            },
            "panther" : {
                name : "Aspect of the Panther",
                description : desc("I add my Con mod to Dexterity (Stealth) and Wisdom (Survival) checks"),
                addMod : [
                    { type : "skill", field : "Stealth", mod : "max(Con|0)", text : "I add my Con mod to Dexterity (Stealth) and Wisdom (Survival) checks" },
                    { type : "skill", field : "Survival", mod : "max(Con|0)", text : "I add my Con mod to Dexterity (Stealth) and Wisdom (Survival) checks" }
                ],
            }
        },
        "subclassfeature10" : {
            name : "Spirit Walker",
            source : [["GMB:LL", 0]],
            minlevel : 10,
            description : desc(["I can cast Commune with Nature as a ritual",
                "Once per long rest I can cast it to change one of my totems with another of the same level"]),
            spellcastingBonus : {
                name : "Spirit Walker",
                spells : ["commune with nature"],
                selection : ["commune with nature"],
                firstCol : "(R)"
            },
            spellChanges : {
                "commune with nature" : {
                    time : "11 min",
                    changes : "I can cast this spell only as a ritual, thus its casting time is 10 minutes longer."
                }
            },
            additional: "change totem",
            usages : 1,
            recovery : "long rest"
        },

        "subclassfeature14" : {
            name : "Totemic Attunement",
            source : [["GMB:LL", 0]],
            minlevel : 14,
            description : desc(['Choose Lion, Falcon or Rhino using the "Choose Feature" button']),
            choices : ["Lion", "Falcon", "Rhino"],
            "lion" : {
                name : "Lion Attunement",
                description : desc(["While raging, any hostile creatures within 5 feet of me has disadv. on attacks vs. others"])
            },
            "falcon" : {
                name : "Falcon Attunement",
                description : desc(["While raging, I gain a flying speed equal to my walk speed"])
            },
            "rhino" : {
                name : "Rhino Attunement",
                description : desc(["While Raging, if I hit a creature that is one size larger than me or smaller with a Strength melee weapon attack, it must succeed on a Strength save or be knocked prone"])
            }
        }
    }
});

// Path of Blood & Iron (battlerager)
AddSubClass("barbarian(laserllama)", "blood and iron", {
    regExpSearch : /blood and iron/i,
    subname : "Path of Blood and Iron",
    fullname : "Blood and Iron",
    source : [["GMB:LL", 0]],
    abilitySave : 1,
    abilitySaveAlt : 2,
    features : {
        "subclassfeature3" : GetSubclassExploits("Blood & Iron", ["crushing grip","mighty leap","aggressive sprint","bloodthirsty critical","savage defiance"]),
        "subclassfeature3.1" : {
            name : "Savage Smith",
            source : [["GMB:LL", 0]],
            minlevel : 3,
            description : desc([
                "I gain proficiency with smith's tools and heavy armor; I can rage in heavy armor"
            ]),
            armorProfs : [false, false, true, false],
            toolProfs : ["Smith's tools"],
            armorOptions : {
                regExpSearch : /^(?!.*(dragon|draconic|beast))(?=.*spike(d|s))(?=.*armou?r).*$/i,
                name : "Spiked armor",
                source : [["S", 121]],
                type : "medium",
                ac : 14,
                stealthdis : true,
                weight : 45
            }
        },
        "subclassfeature3.2" : {
            name : "Spiked Armor",
            source : [["GMB:LL", 0]],
            minlevel : 3,
            description : levels.map(function (n) {
                var ExplDie = (n < 5 ? 4 : n < 11 ? 6 : n < 17 ? 8 : 10);
                var ArmorLimit = (n < 6 ? "a set of non-magical armor" : "any set of armor")

                return desc([
                    "I can spend 1 h (can be during a rest) to use smith's tools and affix spikes to "+ArmorLimit+", turning it into Spiked Armor. It gains those properties when I wear it:",
                    "\u2022 It is a martial melee weapon with 5 ft reach and deals 1d"+ExplDie+" + Str mod on hit",
                    "\u2022 While Raging, I can use a bonus action on my turn to make a single Spiked Armor attack",
                    "\u2022 If I successfully grapple a creature, it takes 1d"+ExplDie+" piercing damage"
                ])
            }),
            action : ["bonus action", "Armor Spikes attack (in rage)"],
            weaponOptions : {
                regExpSearch : /^(?=.*armou?r)(?=.*spike).*$/i,
                name : "Armor spikes",
                source : [["S", 121]],
                ability : 1,
                type : "armor spikes",
                damage : [1, 4, "piercing"],
                range : "Melee",
                description : "Does an exploit die of piercing damage if I successfully grapple a creature",
                abilitytodamage : true
            },
            weaponProfs : [false, false, ["armor spikes"]],
            weaponsAdd : ['Armor Spikes'],
            calcChanges : {
                atkAdd : [
                    function (fields, v) {
                        if ((/armor spikes/i).test(v.WeaponName + v.baseWeaponName) && classes.known["barbarian(laserllama)"] && classes.known["barbarian(laserllama)"].level) {
                            try {
                                var curDie = eval_ish(fields.Damage_Die.replace('d', '*'));
                            } catch (e) {
                                var curDie = 'x';
                            };

                            var aExplDie = function (n) {return  (n < 5 ? 4 : n < 11 ? 6 : n < 17 ? 8 : 10);}(classes.known["barbarian(laserllama)"].level)
                        
                            if (isNaN(curDie) || curDie < aExplDie) {
                                fields.Damage_Die = '1d' + aExplDie;
                            };
                        }
                    },
                    "My armor spikes deal piercing damage equal to one roll of my Exploit Die",
                    6 // Evaluated after Monk's martial arts atkAdd
                ]
            }
        },
        "subclassfeature6" : {
            name : "Reckless Abandon",
            source : [["GMB:LL", 0]],
            minlevel : 6,
            description : desc(["While Raging, once per turn, the first time I attack Recklessly I gain temporary hit points equal to my Con mod. These temporary hit points vanish when my Rage ends."])
        },
        "subclassfeature10" : {
            name : "Wild Charge",
            source : [["GMB:LL", 0]],
            minlevel : 10,
            description : desc([
                "While Raging, I can use aggressive sprint without expending an Exploit Die",
                "However, the attack that I make as part of this Exploit must be a Spiked Armor attack"
            ]),
            calcChanges : {
                spellAdd : [
                    function (spellKey, spellObj, spName) {
                        if (spellKey == "aggressive sprint") {
                            spellObj.firstCol = "atwill";
                            return true;
                        };
                    },
                    "While raging, I can use the Aggressive Sprint exploit at will without expending an Exploit Die. However, the attack that I make as part of this Exploit must be a Spiked Armor attack."
                ]
            }
        },
        "subclassfeature14" : {
            name : "Spiked Retribution",
            source : [["GMB:LL", 0]],
            minlevel : 14,
            description : desc(["While Raging and wearing Spiked Armor:", 
            "When I'm hit with a melee attack, the attacker takes piercing damage equal to my Str mod",
            "If conscious, I can use my reaction to replace the dmg with my spiked armor attack dmg"]),
            action : ["reaction",""]
        }
    }
})

// Path of the Conduit (ancestral guardian)
AddSubClass("barbarian(laserllama)", "conduit", {
    regExpSearch : /conduit/i,
    subname : "Path of the Conduit",
    fullname : "Conduit",
    source : [["GMB:LL", 0]],
    abilitySave : 1,
    abilitySaveAlt : 2,
    features : {
        "subclassfeature3" : GetSubclassExploits("Conduit", ["heroic fortitude","rustic intuition","arresting critical","thunderous blow","mythic resilience"]),
        "subclassfeature3.1" : {
            name : "Conduit of Spirits",
            source : [["GMB:LL", 0]],
            minlevel : 3,
            description : desc([
                "As a bonus action, I can expend a use of Rage to enter into a state of spiritual ecstasy",
                "For the next 10 minutes, I add my Con mod (min +1) to all Intelligence and Wisdom checks",
                "This ends early if I end it as a bonus action, start to rage or fall unconscious"
            ]),
            action : ["bonus action", "Spiritual ecstasy (start/end)"],
        },
        "subclassfeature3.2" : {
            name : "Spectral Warriors",
            source : [["GMB:LL", 0]],
            minlevel : 3,
            description : levels.map(function (n) {
                var ExplDie = (n < 5 ? 4 : n < 11 ? 6 : n < 17 ? 8 : 10);
                var EndsEarlyIf = (n < 6 ? "if the creature is dead or my rage ends" : "if the creature is dead, my rage ends or I use Spiritual Ward")

                return desc([
                "While Raging, once per turn after hitting with a melee weapon attacks, I can harry a creature",
                "Until the start of my next turn, it has disadv. on attacks vs other targets than me",
                "If that creature attacks someone else, the target has resistance",
                "The effect ends early " + EndsEarlyIf])
            }),
        },
        "subclassfeature6" : {
            name : "Spiritual Ward",
            source : [["GMB:LL", 0]],
            minlevel : 6,
            description : levels.map(function (n) {
                var ExplDie = (n < 5 ? 4 : n < 11 ? 6 : n < 17 ? 8 : 10);

                if (n < 14) {
                    return desc([
                        "As a reaction while Raging, when an ally I see within 30 ft is damaged, I can reduce it",
                        "My guardian spirits reduce the damage by 3d"+ExplDie + "; If I harried a creature, the effect ends early",
                    ])
                } else {
                    return desc([
                        "As a reaction while Raging, when an ally I see within 30 ft is damaged, I can reduce it",
                        "My guardian spirits reduce the damage by 3d"+ExplDie + "; If I harried a creature, the effect ends early",
                        "The attacker takes an amount of force damage equal to the damage reduction"
                    ])
                }
            }),
            action : ["reaction", ""]
        },
        "subclassfeature10" : {
            name : "Greater Conduit",
            source : [["GMB:LL", 0]],
            minlevel : 10,
            description : desc([
                "I can cast either Clairvoyance or Commune, without a spell slot or material components",
                "I can only do that while in a state of ecstasy, and doing so ends it earlier",
                "Commune consults ancestral spirits; Clairvoyance summons an invisible ancestral spirit",
                "Wisdom is my spellcasting ability for these spells" // not included in LL's document, but is included as such in the official version
            ]),
            spellcastingAbility : 5,
            spellcastingBonus : [{
                name : "Greater Conduit",
                spells : ["commune", "clairvoyance"],
                selection : ["commune", "clairvoyance"],
                firstCol : 'R',
                times : 2
            }],
            spellChanges : {
                "commune" : {
                    components : "V,S",
                    compMaterial : "",
                    description : "Ask up to three yes/no questions to my ancestral spirits", // removing component price from short description
                    changes : "My casting of Augury is a practice of consulting my ancestral spirits, thus requiring no material components."
                },
                "clairvoyance" : {
                    components : "V,S",
                    compMaterial : "",
                    description : "See or hear a familiar place; 1 a to switch between seeing and hearing",
                    changes : "My casting of Clairvoyance is a practice of consulting an ancestral spirit of mine, thus requiring no material components."
                }
            }
        }
        // Level 14 feature is added by scaling the lvl 3 feature
    }
})

// Path of the Lycan (beast)
AddSubClass("barbarian(laserllama)", "lycan", {
    regExpSearch : /lycan/i,
    subname : "Path of the Lycan",
    fullname : "Lycan",
    source : [["GMB:LL", 0]],
    abilitySave : 1,
    abilitySaveAlt : 2,
    features : {
        "subclassfeature3" : GetSubclassExploits("Lycan", ["cunning instinct","mighty leap","aggressive sprint","bloodthirsty critical","roar of triumph"]),
        "subclassfeature3.1" : {
            name : "Bestial Rage",
            source : [["GMB:LL", 0]],
            minlevel : 3,
            description : levels.map(function (n) {
                var ExplDie = (n < 5 ? 4 : n < 11 ? 6 : n < 17 ? 8 : 10);

                return desc([
                    "When I enter my rage, I can transform to gain a bite, tail, or claws attack for that rage",
                    "On a hit with the bite attack once on each of my turns, I can gain Con mod of temp HP",
                    "With the claws I can make one extra attack when I attack with it in my Attack action",
                    "As a reaction with the tail when I'm hit, I can add 1d"+ExplDie+" to my AC for that attack",
                    "This only works if the hit is from an attack roll made a creature I can see within 10 ft"
                ])
            }),
            weaponOptions : [{
                regExpSearch : /^(?=.*(bestial|beast))(?=.*bite).*$/i,
                name : "Bestial Bite",
                source : [["T", 24]],
                ability : 1,
                type : "Natural",
                damage : [1, 8, "piercing"],
                range : "Melee",
                description : "Only in rage; On a hit once on my turn, gain Con mod temp HP",
                abilitytodamage : true,
                bestialNaturalWeapon : true
            }, {
                regExpSearch : /^(?=.*(bestial|beast))(?=.*claws?).*$/i,
                name : "Bestial Claws",
                source : [["T", 24]],
                ability : 1,
                type : "Natural",
                damage : [1, 6, "slashing"],
                range : "Melee",
                description : "Only in rage; Extra attack if used as part of Attack action",
                abilitytodamage : true,
                bestialNaturalWeapon : true
            }, {
                regExpSearch : /^(?=.*(bestial|beast))(?=.*tail).*$/i,
                name : "Bestial Tail",
                source : [["T", 25]],
                ability : 1,
                type : "Natural",
                damage : [1, 8, "piercing"],
                range : "Melee",
                description : "Reach; Only in rage",
                abilitytodamage : true,
                bestialNaturalWeapon : true
            }],
            weaponsAdd : ["Bestial Bite", "Bestial Claws", "Bestial Tail"],
            additional : levels.map(function(n) {
                return n < 6 ? "" : "chosen weapon counts as magical";
            }),
            action : [["reaction", "Bestial Tail"]],

            // Putting Animal Form on the third page because it's a wall of text; the subclass is already overflowing
            "animal form.wild shape" : {
                name : "Animal Form",
                source : [["SRD", 20], ["P", 66], ["GMB:LL", 0]],
                minlevel : 3,
                description : desc([
                    "I must make the permanent choice of a beast of CR 1 or lower to represent the animal that my curse is based on. I can expend a use of my Rage to transform into this Animal Form:",
                    " \u2022 I gain all its game statistics except Intelligence, Wisdom, or Charisma",
                    " \u2022 I get its skill/saving throw prof. while keeping my own, using whichever is higher",
                    " \u2022 I assume the beast's HP and HD; I get mine back when I revert back",
                    " \u2022 I can't cast spells in beast form, but transforming doesn't break concentration",
                    " \u2022 I retain features from class, race, etc., but I don't retain special senses",
                    " \u2022 I can choose whether equipment falls to the ground, merges, or stays worn",
                    " \u2022 I revert if out of time or unconscious; if KOd by damage, excess damage carries over",
                    "This transformation lasts for max 1 h, I can extend it as a bonus action by expending a Rage"
                ]),
                action : [["action", " (start/end)"], ["bonus action", " (extend)"]],
                additional : levels.map(function (n) {
                    if (n < 3) return "";
                    var cr = 1
                    var hr = 1;
                    var restr = "";
                    return "CR " + cr + restr + "; " + hr + (restr.length ? " h" : " hour");
                }),
            },
            autoSelectExtrachoices : [{ extrachoice : "animal form.wild shape" }]
        },
        "subclassfeature6" : {
            name : "Savage Prowess",
            source : [["GMB:LL", 0]],
            minlevel : 6,
            description : desc(["I gain a climbing speed equal to my walking speed",
                "I can use cunning instinct and mighty leap at will without expending an Exploit Die (as if I spent 1 Die)",
                "My natural weapons count as magical for overcoming resistances and immunities"]),
            speed : {
                climb : { spd : "walk", enc : 0 }
            },
            calcChanges : {
                atkAdd : [
                    function (fields, v) {
                        if (v.theWea.bestialNaturalWeapon && !v.thisWeapon[1] && !v.theWea.isMagicWeapon && !(/counts as( a)? magical/i).test(fields.Description)) {
                            fields.Description += (fields.Description ? '; ' : '') + 'Counts as magical';
                        };
                    },
                    "The natural melee weapon that I gain from Form of the Beast count as magical for the purpose of overcoming resistance and immunity to nonmagical attacks and damage."
                ],

                spellAdd : [
                    function (spellKey, spellObj, spName) {
                        if (spellKey == "cunning instinct" || spellKey == "mighty leap") {
                            spellObj.firstCol = "atwill";
                            return true;
                        };
                    },
                    "I can use cunning instinct and mighty leap at will without expending an Exploit Die (as if I spent 1 Die)"
                ]
            }
        },
        "subclassfeature10" : {
            name : "Infectious Fury",
            source : [["GMB:LL", 0]],
            minlevel : 10,
            description : desc([
                "In rage, when I hit a creature with my natural weapon, I can have it make a Wis save.",
                "If it fails it suffers one effect of my choice:",
                "\u2022 It uses its reaction to make a melee attack against one creature I can see of my choice -or-",
                "\u2022 It takes 2d12 psychic damage.",
                "If I'm out of uses of this feature, I can expend an Exploit Die to use it."
            ]),
            usages : "Con mod per ",
            usagescalc : "event.value = Math.max(1, What('Con Mod'));",
            recovery : "long rest"
        },
        "subclassfeature14" : {
            name : "Primal Roar",
            source : [["GMB:LL", 0]],
            minlevel : 14,
            description : desc([
                "The limit of once per short rest does not apply to roar of triumph for me",
                "While a creature has the temp HP from this exploit, it also has adv. on the first attack on each of its turns"
            ])
        }
    }
})

// Path of the Storm (storm herald)
AddSubClass("barbarian(laserllama)", "storm", {
    regExpSearch : /storm/i,
    subname : "Path of the Storm",
    source : [["GMB:LL", 0]],
    fullname : "Storm",
    abilitySave : 1,
    abilitySaveAlt : 2,
    features : {
        "subclassfeature3" : GetSubclassExploits("Storm", ["hurl","destructive strike","shattering slam","thunderous blow","destructive slam"]),
        "subclassfeature3.1" : {
            name : "Storm Aura",
            source : [["GMB:LL", 0]],
            minlevel : 3,
            description : desc([
                "While raging, I emanate a 10-ft radius aura, but not through total cover",
                'Use the "Choose Feature" button above to select the type of aura'
            ]),
            choices : ["Blizzard", "Drought", "Hurricane"],
            "blizzard" : {
                name : "Storm Aura: Blizzard",
                description : desc([
                    "While raging, I emanate a 10-ft radius aura, but not through total cover",
                    "Any creature of my choice that starts its turn within range has its speed halved until start of its next turn"
                ])
            },
            "drought" : {
                name : "Storm Aura: Drought",
                description : desc([
                    "While raging, I emanate a 10-ft radius aura, but not through total cover",
                    "At the end of each of my turns, creatures of my choice within range take fire damage equal to my Con mod (min 1)."
                ])
            },
            "hurricane" : {
                name : "Storm Aura: Hurricane",
                description : levels.map(function (n) {
                    var ExplDie = (n < 5 ? 4 : n < 11 ? 6 : n < 17 ? 8 : 10);

                    return desc([
                        "While raging, I emanate a 10-ft radius aura, but not through total cover",
                        "At the end of each of my turns I can force one creature within range to make a Dex save against my Exploit DC; It takes 2d"+ExplDie+" lightning damage (half on save)"
                    ])
                }),
                additional : levels.map(function (n) { return n < 3 ? "" : "2d" + (n < 5 ? 4 : n < 11 ? 6 : n < 17 ? 8 : 10) + " lightning damage"; })
            },
            choiceDependencies : [{
                feature : "subclassfeature6"
            }, {
                feature : "subclassfeature14"
            }]
        },
        "subclassfeature6" : {
            name : "Elemental Body",
            source : [["GMB:LL", 0]],
            minlevel : 6,
            description : desc('Use the "Choose Feature" button above to select the effect'),
            choices : ["blizzard", "drought", "hurricane"],
            choicesNotInMenu : true,
            "blizzard" : {
                name : "Elemental Body: Blizzard",
                description : desc([
                    "I have resistance to cold damage",
                    "When I deal damage with a Savage Exploit, I can change the damage type to cold",
                ]),
                dmgres : ["Cold"]
            },
            "drought" : {
                name : "Elemental Body: Drought",
                description : desc([
                    "I have resistance to fire damage; I learn the produce flame cantrip",
                    "Constitution is my spellcasting mod for it, and I can cast it even while Raging"
                ]),
                dmgres : ["Fire"],
                spellcastingBonus : {
                    name : "Elemental Body: Drought",
                    spells : ["produce flame"],
                    selection : ["produce flame"],
                    firstCol : "atwill",
                    spellcastingAbility : 3
                }
            },
            "hurricane" : {
                name : "Elemental Body: Hurricane",
                description : desc([
                    "I can breathe underwater and I have a swim speed equal to my walking speed",
                    "In addition, I have resistance to lightning and thunder damage"
                ]),
                dmgres : ["Lightning","Thunder"],
                speed : { swim : { spd : "walk", enc : 0 } }
            }
        },
        "subclassfeature10" : {
            name : "Storm Ward",
            source : [["GMB:LL", 0]],
            minlevel : 10,
            description : desc("While Raging, creatures of my choice within my Storm Aura gain the benefits of my Elemental Body feature")
            // not limited to resistance but I don't see the use in copying the content of elemental body here again
        },
        "subclassfeature14" : {
            name : "Primal Destruction",
            source : [["GMB:LL", 0]],
            minlevel : 14,
            description : desc('Use the "Choose Feature" button above to select the effect'),
            choices : ["blizzard", "drought", "hurricane"],
            choicesNotInMenu : true,
            "blizzard" : {
                name : "Raging Storm: Blizzard",
                description : desc([
                    "When a creature begins begins its turn within my Storm Aura, I can use my reaction to force it to make a Strength save against my Exploit DC",
                    "On a failed save, the creature's speed is reduced to 0 until the beginning of its next turn"
                ]),
                action : ["reaction", ""]
            },
            "drought" : {
                name : "Raging Storm: Drought",
                description : levels.map(function (n) {
                    var ExplDie = (n < 5 ? 4 : n < 11 ? 6 : n < 17 ? 8 : 10);

                    return desc([
                        "As a reaction when hit by a creature in my Storm Aura, I can have it make a Dex save",
                        "The DC for this save is my Exploit DC; On a failed save, the attacker takes 2d"+ExplDie+" fire damage",
                    ])
                }),
                action : ["reaction", " (if hit)"],
                additional : levels.map(function (n) { return n < 14 ? "" : "2d" + (n < 5 ? 4 : n < 11 ? 6 : n < 17 ? 8 : 10) + " fire damage"; })
            },
            "hurricane" : {
                name : "Raging Storm: Hurricane",
                description : desc([
                    "As a reaction when hit by a creature in my Storm Aura, I can have it make a Str save",
                    "The DC for this save is my Exploit DC",
                    "On a failed save, it is knocked back from me 10 feet in a straight line and falls prone"
                ]),
                action : ["reaction", " (if hit)"],
            }
        }
    }
});

// Path of Wild Sorcery (wild magic)
AddSubClass("barbarian(laserllama)", "wild sorcery", {
    regExpSearch : /^(?=.*wild)(?=.*sorcery).*$/i,
    subname : "Path of Wild Sorcery",
    source : [["GMB:LL", 0]],
    fullname : "Wild Sorcery",
    abilitySave : 1,
    abilitySaveAlt : 2,
    features : {
        "subclassfeature3" : GetSubclassExploits("Sorcerous", ["heroic fortitude","mighty leap","immovable stance","thunderous blow","savage defiance"]),
        "subclassfeature3.1" : {
            name : "Magic Awareness",
            source : [["GMB:LL", 0]],
            minlevel : 3,
            description : desc(["As an action, until my next turn I can detect magic items or spells within 60 feet that aren't behind total cover. When I sense a spell, I learn its school of magic.",
                "I can use this feature once per short rest; I can use it again by expending an Exploit Die"]),
            action : [["action", ""]],
            usages : 1,
            recovery : "short rest",
            altResource : "ED"
        },

        "subclassfeature3.2" : {
            name : "Wild Sorcery",
            source : [["GMB:LL", 0]],
            minlevel : 3,
            description :  desc(["When I rage, I roll on this class' Wild Magic Table (d20, see notes)",
            "If the rolled effect requires a saving throw, it uses my Exploit Die DC."]),
            toNotesPage : [{
                name : "Wild Magic Table",
                source : [["GMB:LL", ]],
                note : ["If an effect calls for a saving throw, the DC is my Exploit DC.",
            "d20\tEFFECT",
            "1\tCreatures of your choice that you can see within 30 feet of you must succeed on a Constitution saving throw or take necrotic damage equal to two rolls of your Exploit Die. You then gain temporary hit points equal to two rolls of your Exploit Die + your level",
            "2\tYou teleport up to 30 feet to an unoccupied space you can see. Until the end of your current Rage, you can use this effect again on each of your turns as a bonus action.",
            "3\tAn orb of wild magic explodes at a point that you can see within 30 feet. Creatures within 5 feet must succeed on a Dexterity saving throw or take force damage equal to your Exploit Die. Until the end of your current Rage, you can use a bonus action to cause this effect to happen again.",
            "4\tMagic infuses one weapon of your choice that you are holding. Until your current Rage, the weapon's damage type changes to force, and it gains the light and thrown properties, with a normal range of 20 feet and a long range of 60 feet. If the magic weapon leaves your hand, it appears in your hand at the end of your turn.",
            "5\tWhenever a creature hits you with an attack roll before the end of your current Rage, it takes force damage equal to your Exploit Die, as magic lashes out in retribution.",
            "6\tUntil the end of your current Rage, you are surrounded by multicolored, protective lights; you, and allied creatures within 10 feet of you, all gain a +1 bonus to your Armor Class.",
            "7\tFlowers and vines temporarily grow around you; until the end of your current Rage, the ground within 15 feet of you is considered difficult terrain for creatures of your choice.",
            "8\tRoll another d20. On an even roll, your size grows by one category as if by the enlarge part of the enlarge/reduce spell. On an odd roll, your size is reduced by one category as if by the reduce part of the enlarge/reduce spell.",
            "9\tYou can't speak for duration of your current Rage. Whenever you try, a small bird flies out of your mouth and flies toward the sun.",
            "10\tYou are transported to the Astral Plane until the end of your next turn, after which time you return to the space you previously occupied or the nearest unoccupied space.",
            "11\tFor the duration of your current Rage, you gain resistance to the last instance of damage you took, until you take another instance of damage. For example, if you take fire damage from a red dragon's fire breath, you are resistant to fire damage until you take another type of damage.",
            "12\tFor the duration of your current Rage, every hair on your body grows by one foot at the end of each of your turns. When your current Rage ends, all of your hair falls out.",
            "13\tA bolt of radiant light shoots from your chest. A creature of your choice that you can see within 30 feet must succeed on a Constitution saving throw or take radiant damage equal to your Exploit Die and be blinded until the start of your next turn. Until the end of your current Rage, you can use this effect again on each of your turns as a bonus action.",
            "14\tFor the duration of your current Rage, you can walk through solid objects and creatures as if they were difficult terrain. If you end your movement inside a creature or object, you are instantly shunted to the nearest unoccupied space, taking 1d10 force damage for each 5 feet that you were forced to travel.",
            "15\tRoll a d10. Your age changes by a number of years equal to the roll. If the roll is odd, you get younger (minimum 1 year old). If the roll is even, you get older.",
            "16\tFor the duration of your current Rage, any flammable object you touch that isn't being worn or carried, instantly bursts into flame.",
            "17\tYour limbs grow strangely long. For the duration of your current Rage, the reach of your melee attacks increases by 5 feet.",
            "18\tYour muscles are engorged with wild magic. For the duration of your current Rage, all creatures have disadvantage on any saving throws to resist the effects of your Exploits.",
            "19\tFor the duration of your current Rage, the distance of your long and high jumps is tripled, even if this extra distance would exceed your remaining movement.",
            "20\tYou instantly regain all expended uses of your Rage."],
            }]
        },
        "subclassfeature6" : {
            name : "Sorcerous Infusion",
            source : [["T", 26]],
            minlevel : 6,
            description : levels.map(function (n) { 
                var ExplDie = (n < 5 ? 4 : n < 11 ? 6 : n < 17 ? 8 : 10);

                return desc(["As an action, I can touch a creature or myself and confer one of the following benefits:",
                "\u2022 For 10 min, they can add 1d"+ExplDie+" to ability checks and saving throws of a stat I choose",
                "\u2022 They gain "+n+"+1d"+ExplDie+" temp HP. While those temp HP last, they are immune to my Wild Magic",
                "\u2022 The target regains a spell slot whose level equals my Exploit Die expended for this",
                "I can use this feature a number of times equal to my Con mod"])
            }),
            usages: "Con mod per ",
            usagescalc : "event.value = Math.max(1, What('Con Mod'));",
            recovery: "long rest",
            action : [["action", ""]]
        },
        "subclassfeature10" : {
            name : "Unstable Sorcery",
            source : [["T", 26]],
            minlevel : 10,
            description : desc([
                "As a reaction in rage when taking damage or failing a save, I can lash out with magic",
                "I roll on the Wild Magic table and immediately apply the roll, replacing my current effect" // unsure if it does replace the old effect 
            ]),
            action : [["reaction", " (in rage on damage/save fail)"]]
        },

        "subclassfeature14" : {
            name : "Controlled Surge",
            source : [["T", 26]],
            minlevel : 14,
            description : desc([
                "Whenever I roll on the Wild Magic table, I can roll two dice and choose which to use"
            ])
        }
    }
});

// Path of the Zealot
AddSubClass("barbarian(laserllama)", "zealot", {
    regExpSearch : /zealot/i,
    subname : "Path of the Zealot",
    fullname : "Zealot",
    source : [["GMB:LL", 0]],
    abilitySave : 1,
    abilitySaveAlt : 2,
    features : {
        "subclassfeature3" : GetSubclassExploits("Zealous", ["feat of strength","savage rebuke","honor duel","menacing shout","mythic resilience"]),
        "subclassfeature3.1" : {
            name : "Warrior of the Gods",
            source : [["GMB:LL", 0]],
            minlevel : 3,
            description : desc("Spells restoring me to life (not undeath or anything else) don't require material comp.")
        },
        "subclassfeature3.2" : {
            name : "Divine Fury", 
            source : [["GMB:LL", 0]],
            minlevel : 3,
            description : levels.map(function (n) {
                var ExplDie = (n < 5 ? 4 : n < 11 ? 6 : n < 17 ? 8 : 10);

                return desc([
                    "While raging, the first creature I hit with a weapon attack in my turn takes extra damage",
                    "This is necrotic, thunder or radiant damage equal to 1d"+ExplDie+" + my Constitution modifier",
                    'Choose a damage type using the "Choose Feature" button above'
                ])
            }),
            choices : ["Evil", "Neutral" ,"Good"],
            "evil" : {
                name : "Divine Fury",
                description : levels.map(function (n) {
                    var ExplDie = (n < 5 ? 4 : n < 11 ? 6 : n < 17 ? 8 : 10);

                    return desc([
                        "While raging, the first creature I hit with a weapon attack in my turn takes extra damage",
                        "This is necrotic damage equal to 1d"+ExplDie+" + my Constitution modifier"
                    ])
                }),
            },
            "neutral" : {
                name : "Divine Fury",
                description : levels.map(function (n) {
                    var ExplDie = (n < 5 ? 4 : n < 11 ? 6 : n < 17 ? 8 : 10);

                    return desc([
                        "While raging, the first creature I hit with a weapon attack in my turn takes extra damage",
                        "This is thunder damage equal to 1d"+ExplDie+" + my Constitution modifier"
                    ])
                }),
            },
            "good" : {
                name : "Divine Fury",
                description : levels.map(function (n) {
                    var ExplDie = (n < 5 ? 4 : n < 11 ? 6 : n < 17 ? 8 : 10);

                    return desc([
                        "While raging, the first creature I hit with a weapon attack in my turn takes extra damage",
                        "This is radiant damage equal to 1d"+ExplDie+" + my Constitution modifier"
                    ])
                }),
            }
        },

        "subclassfeature6" : {
            name : "Fanatical Focus",
            source : [["GMB:LL", 0]],
            minlevel : 6,
            description : desc(["When I fail a saving throw while raging, I can expend an Exploit Die to add it to the roll"])
        },
        "subclassfeature10" : {
            name : "Zealous Presence",
            source : [["GMB:LL", 0]],
            minlevel : 10,
            description : desc([
                "As a bonus action, I choose up to 10 creatures within 60 ft that can hear my battle cry",
                "These creatures gain adv. on attacks and saves until the start of my next turn"
            ]),
            usages : 1,
            recovery : "long rest",
            action : ["bonus action", ""]
        },
        "subclassfeature14" : {
            name : "Rage Beyond Death",
            source : [["GMB:LL", 0]],
            minlevel : 14,
            description : desc([
                "While raging, having 0 hit points doesn't knock me unconscious",
                "I still must make death saves, and I suffer the normal effects of taking damage",
                "If I start my turn with 3 failed death saves, I must make a DC 10 Con save to maintain my rage",
                "I only die due to failed death saves if my rage ends while I'm at 0 HP"
            ])
        }
    }
})

// Path of the Deep
AddSubClass("barbarian(laserllama)", "deep", {
    regExpSearch : /deep/i,
    subname : "Path of the Deep",
    fullname : "Deep",
    source : [["GMB:LL", 0]],
    abilitySave : 1,
    abilitySaveAlt : 2,
    features : {
        "subclassfeature3" : GetSubclassExploits("Deep", ["crushing grip", "cunning instinct","immovable stance", "rending strike","primal terror"]),
        "subclassfeature3.1" : {
            name : "Gift of the Depths",
            source : [["GMB:LL", 0]],
            minlevel : 3,
            description : desc("I gain a swim speed equal to my walk speed and can breathe both air and water"),
            speed : {
                swim : { spd : "walk", enc : 0 }
            }
        },
        "subclassfeature3.2" : {
            name : "Otherworldly Grasp", 
            source : [["GMB:LL", 0]],
            minlevel : 3,
            description : levels.map(function (n) {
                if (n < 10) {
                    return desc([
                        "While raging, I manifest an extra eldritch appendage (can be attacked as part of me)",
                        "As a bonus action, I can force one crea within 15 ft to make a Str save (adv. if larger than me) or be pulled 15 ft towards me",
                    ])
                }
                var OtherwordlyRange = (n < 14 ? 15 : 20);

                return desc([
                    "While raging, I manifest two extra eldritch appendages (can be attacked as part of me)",
                    "As a bonus action, I can control both appendages at once, each of which can do either:",
                    "\u2022 Force one crea within "+OtherwordlyRange+" ft to make a Str save (adv. if larger than me) or be pulled 15 ft towards me",
                    "\u2022 Grapple one crea within "+OtherwordlyRange+" ft",
                    "If they target the same creature, the target makes only one save/check with disadvantage" // clarified by LL here: https://discord.com/channels/946069855763845190/984467565738872893/1330746639262158868
                ])
            }),
            action : ["bonus action", ""]
        },

        "subclassfeature6" : {
            name : "Reality Warp",
            source : [["GMB:LL", 0]],
            minlevel : 6,
            description : levels.map(function (n) {
                if (n < 14) {
                    return desc([
                        "As an action, I can teleport (with any equipment I are wearing/carrying), to an unoccupied space within 30 ft",
                        "Immediately before, or after, I can make one attack as part of the same action",
                        "If I have no uses left, I can expend an Exploit Die to use it again",
                    ])
                }

                return desc([
                    "As an action, I can teleport (with any equipment I are wearing/carrying), to an unoccupied space within 30 ft",
                    "Immediately before, or after, I can make one attack as part of the same action",
                    "I can use this as part of the bonus action to enter my rage",
                    "If I have no uses left, I can expend an Exploit Die to use it again",
                ])
            }),
            usages : "Con mod per ",
            usagescalc : "event.value = Math.max(1, What('Con Mod'));",
            altResource : "ED",
            recovery : "long rest",
            action : ["action", ""]
        },
        "subclassfeature14" : {
            name : "The Horrors Below",
            source : [["GMB:LL", 0]],
            minlevel : 14,
            description : levels.map(function (n) {
                var ExplDie = (n < 5 ? 4 : n < 11 ? 6 : n < 17 ? 8 : 10);

                return desc([
                    "When I use Reality Warp, I can force crea within 10 ft of the destination to make a Wis save or take 2d" + ExplDie + 
                    " psychic damage (half on save) and be frightened of me until the start of my next turn",
                    "Creatures immune to fear automatically succeed and take no damage"
                ])
            }),
        }
    }
})

// Path of the Favored
AddSubClass("barbarian(laserllama)", "favored", {
    regExpSearch : /favored/i,
    subname : "Path of the Favored",
    fullname : "Favored",
    source : [["GMB:LL", 0]],
    abilitySave : 1,
    abilitySaveAlt : 2,
    features : {
        "subclassfeature3" : GetSubclassExploits("Favored", ["feat of strength", "heroic fortitude","ringing critical", "thunderous blow", "mythic athleticism"]),
        "subclassfeature3.1" : {
            name : "Favored Presence",
            source : [["GMB:LL", 0]],
            minlevel : 3,
            description : desc([
                    "When I meet a creature for the first time, its starting attitude is one level higher than normal (hostile -> indifferent -> friendly). This feature has no effect on those I travel with."
                ])
        },
        "subclassfeature3.2" : {
            name : "Touched by Fate", 
            source : [["GMB:LL", 0]],
            minlevel : 3,
            description : desc([
                    "When I Rage, I gain the following benefits:",
                    "\u2022 I can reroll a roll of 1 on any Exploit Die (but must keep the new result)",
                    "\u2022 When hit by an attack, I can expend an Exploit Die to add it to my AC against that attack",
                    "\u2022 When I miss a Str-based attack, I can expend an Exploit Die to add it to the roll"
                ])
        },
        "subclassfeature6" : {
            name : "Glorious Cause",
            source : [["GMB:LL", 0]],
            minlevel : 6,
            description : levels.map(function (n) {
                var ExplDie = (n < 5 ? 4 : n < 11 ? 6 : n < 17 ? 8 : 10);

                return desc([
                    "When I Rage, me and a number of creatures of my choice within 30 ft, up to my Con mod (minimum of 1 creature) gain 1d"+ExplDie+"+1 temporary HP"
                ])
            }),
        },
        "subclassfeature6.1" : {
            name : "Tireless Hero",
            source : [["GMB:LL", 0]],
            minlevel : 6,
            description : levels.map(function (n) {
                var TirelessDie = (n < 14 ? 4 : 6);

                return desc([
                    "When I use Feat of Strength, I can use a d"+4+" instead of expending an Exploit Die"
                ])
            }),
            calcChanges : {
                spellAdd : [
                    function (spellKey, spellObj, spName) {
                        if (spellKey == "feat of strength") {
                            spellObj.firstCol = "atwill";
                            return true;
                        };
                    },
                    "I can use the Feat of Strength exploit using a d4 (or d6 if level >14) instead of expending an Exploit Die"
                ]
            },
        },
        "subclassfeature10" : {
            name : "Wondrous Success",
            source : ["GMB:LL"],
            minlevel : 10,
            description : desc(["Once per short rest, I can use my barbarian level instead of rolling the d20",
                "I can use this after rolling, but before knowing if the check, attack, or save succeeds or fails"]),
            recovery : "short rest",
            usages : 1
        },
        "subclassfeature14" : {
            name : "Strength Overwhelming",
            source : [["GMB:LL", 0]],
            minlevel : 14,
            description : desc(["I learn Strength of the Colossus, but it doesn't count against my total",
                "When I use Strength of the Colossus, I calculate the base amount of weight I can push, drag, pull, or lift as if I had spent one additional Exploit Die (maximum of 6)"]),
            spellcastingBonusElsewhere : {
                addTo : "savage exploits",
                spellcastingBonus : {
                    name : "Strength Overwhelming",
                    spellcastingAbility : 1,
                    spells : ["strength of the colossus"],
                    selection : ["strength of the colossus"],
                    prepared : true
                }
            },
            toNotesPage : [{ // What is added to the notes page
                name : "Strength of the Colossus [4th degree]",
                note : desc(SpellsList["strength of the colossus"].descriptionFull),
                amendTo : "Favored"
            }],
            spellChanges : {
                "strength of the colossus" : {
                    description : "My push/drag/lift capacity increases greatly; when it ends, DC17 Con save or exhaustion (see book)",
                    changes : "When I use Strength of the Colossus, I calculate the base amount of weight I can push, drag, pull, or lift as if I had spent one additional Exploit Die (maximum of 6)"
                }
            }
        }
    }
})

// Path of the Inferno
AddSubClass("barbarian(laserllama)", "inferno", {
    regExpSearch : /inferno/i,
    subname : "Path of the Inferno",
    fullname : "Inferno",
    source : [["GMB:LL", 0]],
    abilitySave : 1,
    abilitySaveAlt : 2,
    features : {
        "subclassfeature3" : GetSubclassExploits("Infernal", ["commanding presence", "trampling rush","bloodthirsty critical", "menacing shout", "primal terror"]),
        "subclassfeature3.1" : {
            name : "Abyssal Hide",
            source : [["GMB:LL", 0]],
            minlevel : 3,
            description : desc([
                    "When I am Raging I gain the following benefits:",
                    "\u2022 As a bonus action, I can move up to my full speed toward a hostile creature that I can see",
                    "\u2022 When a creature hits me with an opportunity attack, I can reduce the damage by my Con mod"
                ]),
            action : ["bonus action", " (move in rage)"]
        },
        "subclassfeature3.2" : {
            name : "Hellish Presence", 
            source : [["GMB:LL", 0]],
            minlevel : 3,
            description : desc("I learn Abyssal and when I use Commanding Presence, I can use a d6 instead of expending an Exploit Die"),
            languageProfs : ["Abyssal"],
            calcChanges : {
                spellAdd : [
                    function (spellKey, spellObj, spName) {
                        if (spellKey == "commanding presence") {
                            spellObj.firstCol = "atwill";
                            return true;
                        };
                    },
                    "I can use the Commanding Presence exploit using a d6 instead of expending an Exploit Die"
                ]
            },
        },
        "subclassfeature6" : {
            name : "Unbridled Fury",
            source : [["GMB:LL", 0]],
            minlevel : 6,
            description : desc("The first time I make a Reckless attack on my turn while Raging, I gain temp HP equal to my Con mod. These temp HP vanish when my Rage ends."),
        },
        "subclassfeature10" : {
            name : "Corrupt Resilience",
            source : ["GMB:LL"],
            minlevel : 10,
            description : desc(["I gain resistance to both fire and poison damage",
                "When I make a save vs charm or fear, I can add a roll of my Exploit Die"]),
            savetxt : { text : ["Add Expl Die to saves vs charm and fear"] },
            dmgres : ["Fire", "Poison"],
        },
        "subclassfeature14" : {
            name : "Chaos Overwhelming",
            source : [["GMB:LL", 0]],
            minlevel : 14,
            description : desc([
                    "When I Rage, I gain one of the abilities below for the duration of that Rage:",
                    "\u2022 My walk speed increases by 10 feet, I can take the Dash action as a bonus action, and the reach of my melee attacks and grapples increases by 5 ft",
                    "\u2022 I gain immunity to all bludgeoning, piercing, and slashing damage from weapons that are non-magical and not silvered",
                    "\u2022 I grow by one size category as if by an enlarge/reduce spell. While enlarged in this way, I add my Con mod to Str checks",
                    "\u2022 I gain a flying speed equal to my walking speed",
                    "As a bonus action while Raging, I can expend an Exploit Die to switch feature"
                ])
        }
    }
})

// Path of the Mutant
AddSubClass("barbarian(laserllama)", "mutant", {
    regExpSearch : /mutant/i,
    subname : "Path of the Mutant",
    fullname : "Mutant",
    source : [["GMB:LL", 0]],
    abilitySave : 1,
    abilitySaveAlt : 2,
    spellcastingAbility : 3, // for the Acidic Bile mutation
    features : {
        "subclassfeature3" : GetSubclassExploits("Mutagenic", ["crushing grip", "feat of strength","rending strike", "whirlwind strike", "confounding critical"]),
        "subclassfeature3.1" : {
            name : "Aberrant Alchemy",
            source : [["GMB:LL", 0]],
            minlevel : 3,
            description : desc([
                    "I gain proficiency in Nature and with alchemist's supplies; I learn mutations",
                    "With a long rest, I can use my alchemist's supplies to replace a mutation I know",
                    "During my rage, I manifest a number of Mutations equal to my Con mod"
                ]),
            toolProfs : ["Alchemist's supplies"],
            skills : ["Nature"],
            extraname : "Mutations Known",
            extraTimes : ['', '', 3, 3, 3, 5, 5, 5, 5, 7, 7, 7, 7, 9, 9, 9, 9, 9, 9, 9],
            extrachoices : ["Aberrant Sight", 
                "Alchemical Resistance (Acid)", "Alchemical Resistance (Cold)", "Alchemical Resistance (Fire)", "Alchemical Resistance (Poison)", "Alchemical Resistance (Lightning)",
                "Aquatic Adaptation", "Deviant Glide", "Enhanced Movement", "Oozing Form", "Synthetic Carapace", "Unnatural Physicality",
                "Corrosive Secretions", "Inoculated Vigor", "Toxic Vitality", "Viscous Grip",
                "Acidic Bile", "Grappling Appendages", "Perverted Flight"
            ],
            "aberrant sight" : {
                name : "Aberrant Sight",
                source : ["GMB:LL"],
                description : desc([
                    "I gain 60 ft darkvision. If I already have darkvision, its range increases by 60 ft.",
                    "I have advantage on Wisdom (Perception) checks that rely on sight"
                ])
            },
            // acid, cold, fire, poison, or lightning
            "alchemical resistance (acid)" : {
                name : "Alchemical Resistance (Acid)",
                source : ["GMB:LL"],
                description : desc(["I gain resistance to Acid damage"]),
                submenu : "Alchemical Resistance",
                prereqeval : function(v) { 
                    techniques = GetFeatureChoice('classes', 'barbarian(laserllama)', 'subclassfeature3.1', true);

                    if (techniques.indexOf("alchemical resistance (cold)") !== -1) return false;
                    if (techniques.indexOf("alchemical resistance (fire)") !== -1) return false;
                    if (techniques.indexOf("alchemical resistance (poison)") !== -1) return false;
                    if (techniques.indexOf("alchemical resistance (lightning)") !== -1) return false;

                    return true;
                },
            },
            "alchemical resistance (cold)" : {
                name : "Alchemical Resistance (Cold)",
                source : ["GMB:LL"],
                description : desc(["I gain resistance to Cold damage"]),
                submenu : "Alchemical Resistance",
                prereqeval : function(v) { 
                    techniques = GetFeatureChoice('classes', 'barbarian(laserllama)', 'subclassfeature3.1', true);

                    if (techniques.indexOf("alchemical resistance (acid)") !== -1) return false;
                    if (techniques.indexOf("alchemical resistance (fire)") !== -1) return false;
                    if (techniques.indexOf("alchemical resistance (poison)") !== -1) return false;
                    if (techniques.indexOf("alchemical resistance (lightning)") !== -1) return false;

                    return true;
                },
            },
            "alchemical resistance (fire)" : {
                name : "Alchemical Resistance (Fire)",
                source : ["GMB:LL"],
                description : desc(["I gain resistance to Fire damage"]),
                submenu : "Alchemical Resistance",
                prereqeval : function(v) { 
                    techniques = GetFeatureChoice('classes', 'barbarian(laserllama)', 'subclassfeature3.1', true);

                    if (techniques.indexOf("alchemical resistance (acid)") !== -1) return false;
                    if (techniques.indexOf("alchemical resistance (cold)") !== -1) return false;
                    if (techniques.indexOf("alchemical resistance (fire)") !== -1) return false;
                    if (techniques.indexOf("alchemical resistance (poison)") !== -1) return false;
                    if (techniques.indexOf("alchemical resistance (lightning)") !== -1) return false;

                    return true;
                },
            },
            "alchemical resistance (poison)" : {
                name : "Alchemical Resistance (Poison)",
                source : ["GMB:LL"],
                description : desc(["I gain resistance to Poison damage"]),
                submenu : "Alchemical Resistance",
                prereqeval : function(v) { 
                    techniques = GetFeatureChoice('classes', 'barbarian(laserllama)', 'subclassfeature3.1', true);

                    if (techniques.indexOf("alchemical resistance (acid)") !== -1) return false;
                    if (techniques.indexOf("alchemical resistance (cold)") !== -1) return false;
                    if (techniques.indexOf("alchemical resistance (fire)") !== -1) return false;
                    if (techniques.indexOf("alchemical resistance (lightning)") !== -1) return false;

                    return true;
                },
            },
            "alchemical resistance (lightning)" : {
                name : "Alchemical Resistance (Lightning)",
                source : ["GMB:LL"],
                description : desc(["I gain resistance to Lightning damage"]),
                submenu : "Alchemical Resistance",
                prereqeval : function(v) { 
                    techniques = GetFeatureChoice('classes', 'barbarian(laserllama)', 'subclassfeature3.1', true);

                    if (techniques.indexOf("alchemical resistance (acid)") !== -1) return false;
                    if (techniques.indexOf("alchemical resistance (cold)") !== -1) return false;
                    if (techniques.indexOf("alchemical resistance (fire)") !== -1) return false;
                    if (techniques.indexOf("alchemical resistance (poison)") !== -1) return false;

                    return true;
                },
            },
            "aquatic adaptation" : {
                name : "Aquatic Adaptation",
                source : ["GMB:LL"],
                description : desc([
                    "I gain a swim speed equal to my walk speed, and can breathe both air and water"
                ])
            },
            "deviant glide" : {
                name : "Deviant Glide",
                source : ["GMB:LL"],
                description : desc([
                    "When I fall and am not incapacitated, I can subtract up to 100 ft from the fall when calculating fall damage, and I can move horizontally 2 ft for every 1 ft I fall"
                ])
            },
            "enhanced movement" : {
                name : "Enhanced Movement",
                source : ["GMB:LL"],
                description : desc([
                    "My walk speed increases by 5 ft times my Con mod (min 5)",
                    "I add my Con mod (min 1) to the distance of any long jump or high jump I make"
                ])
            },
            "oozing form" : {
                name : "Oozing Form",
                source : ["GMB:LL"],
                description : desc([
                    "As a bonus action, I can automatically escape a grapple or nonmagical restraints",
                    "My body, along with any equipment I am wearing/carrying, can squeeze through spaces as narrow as 1 inch"
                ]),
                action : [["bonus action", " (escape restraints)"]],
            },
            "synthetic carapace" : {
                name : "Synthetic Carapace",
                source : ["GMB:LL"],
                description : desc([
                    "I gain a bonus to my AC equal to half my Con mod (rounded down)"
                ]),
                extraAC : [{
                    name : "Synthetic Carapace (if manifested)",
                    mod : "max(Con|0)/2",
                    text : "I gain a bonus to my AC equal to half my Con mod (rounded down)"
                }] 
            },
            "unnatural physicality" : {
                name : "Unnatural Physicality",
                source : ["GMB:LL"],
                description : desc([
                    "I gain a bonus to any Strength (Athletics) and Dexterity (Acrobatics) checks equal to one roll of my Exploit Die"
                ])
            },
            "corrosive secretions" : {
                name : "Corrosive Secretions",
                source : ["GMB:LL"],
                description : levels.map(function (n) {
                    var ExplDie = (n < 5 ? 4 : n < 11 ? 6 : n < 17 ? 8 : 10);

                    return desc([
                        "When hit by an attack and the attacker is within 30 ft, I can use my reaction to deal acid damage to the attacker equal to 1d"+ExplDie+" + my Con mod"
                    ])
                }),
                prereqeval : function(v) { return classes.known["barbarian(laserllama)"].level >= 6; },
                action : [["reaction", " (when hit)"]],
            },
            "inoculated vigor" : {
                name : "Inoculated Vigor",
                source : ["GMB:LL"],
                description : desc([
                    "I gain resistance to acid and poison damage, and I have advantage on saves vs poisoned"
                ]),
                prereqeval : function(v) { return classes.known["barbarian(laserllama)"].level >= 6; },
            },
            "toxic vitality" : {
                name : "Toxic Vitality",
                source : ["GMB:LL"],
                description : desc([
                    "At the start of my turn while Raging, I gain temp HP equal to my Con mod (min 1 THP)"
                ]),
                prereqeval : function(v) { return classes.known["barbarian(laserllama)"].level >= 6; },
            },
            "viscous grip" : {
                name : "Viscous Grip",
                source : ["GMB:LL"],
                description : desc([
                    "I gain a climb speed equal to my walk speed, and can climb difficult surfaces without making a check"
                ]),
                prereqeval : function(v) { return classes.known["barbarian(laserllama)"].level >= 6; },
            },
            "acidic bile" : {
                name : "Acidic Bile",
                source : ["GMB:LL"],
                description : desc([
                    "I learn the acid splash cantrip, using Constitution as my spellcasting modifier. I can cast this cantrip while Raging, and when so, it deals additional damage equal to my Con mod (min of +1)."
                ]),
                spellcastingBonus : {
                    name : "Acidic Bile",
                    spells : ["acid splash"],
                    selection : ["acid splash"],
                    firstCol : "R",
                    times : 1
                },
                spellChanges : {
                    "acid splash" : {     
                        description : "1 crea or 2 crea within 5 ft of each other save or 1d6 Acid dmg; +1d6 at CL 5, 11, and 17",
                        descriptionCantripDie : "1 crea or 2 crea within 5 ft of each other save or `CD`d6 Acid dmg; Can cast in rage, add Con mod to dmg",
                        changes : "If the Acidic Bile mutation is manifested: I can cast this cantrip while Raging, and when so, it deals additional damage equal to my Con mod (min of +1)."
                    }
                },
                prereqeval : function(v) { return classes.known["barbarian(laserllama)"].level >= 10; },
            },
            "grappling appendages" : {
                name : "Grappling Appendages",
                source : ["GMB:LL"],
                description : levels.map(function (n) {
                    var ExplDie = (n < 5 ? 4 : n < 11 ? 6 : n < 17 ? 8 : 10);

                    return desc([
                        "I grow two appendages alongside my arms that resemble tentacles",
                        "They are natural weapons, which deal 1d"+ExplDie+" bludgeoning damage on hit.",
                        "If I hit a creature with a melee attack, I can attempt to grapple it with these appendages as a bonus action.",
                        "These appendages are not dexterous enough to use weapons or specialized tools."
                    ])
                }),
                weaponOptions : [{
                    regExpSearch : /^(?=.*(grappling))(?=.*appendages?).*$/i,
                    name : "Grappling Appendages",
                    source : ["GMB:LL"],
                    ability : 1,
                    type : "Natural",
                    damage : [1, 8, "slashing"],
                    range : "Melee",
                    description : "Only when manifested",
                    abilitytodamage : true,
                    grapplingAppendage : true
                }],
                weaponsAdd : ["Grappling Appendages"],
                calcChanges : {
                    atkAdd : [
                        function (fields, v) {
                            if (v.theWea.grapplingAppendage) {
                                var aExplDie = function (n) { return n < 5 ? 4 : n < 11 ? 6 : n < 17 ? 8 : 10; }(classes.known["barbarian(laserllama)"].level);
                                fields.Damage_Die = '1d' + aExplDie;
                            };
                        },
                        "My Grappling Appendages are natural weapons which deal bludgeoning damage equal to my Exploit Die on hit"
                    ]
                },
                prereqeval : function(v) { return classes.known["barbarian(laserllama)"].level >= 10; },
            },
            "perverted flight" : {
                name : "Perverted Flight",
                source : ["GMB:LL"],
                description : desc([
                    "I gain a fly speed equal to my walk speed"
                ]),
                prereqeval : function(v) { return classes.known["barbarian(laserllama)"].level >= 14; },
            },
        },
        "subclassfeature6" : {
            name : "Enduring Mutation",
            source : [["GMB:LL", 0]],
            minlevel : 6,
            description : desc(["At the end of a long rest, I can choose one of my mutations to benefit from outside of my Rage, though it still counts against my total of manifested mutations",
                'Choose which one should be applied using the "Choose Feature" button above']),
            choices : ["Enduring Mutation: Aberrant Sight", 
                "Enduring Mutation: Alchemical Resistance (Acid)", "Enduring Mutation: Alchemical Resistance (Cold)", "Enduring Mutation: Alchemical Resistance (Fire)", "Enduring Mutation: Alchemical Resistance (Poison)", "Enduring Mutation: Alchemical Resistance (Lightning)",
                "Enduring Mutation: Aquatic Adaptation", "Enduring Mutation: Deviant Glide", "Enduring Mutation: Enhanced Movement", "Enduring Mutation: Oozing Form", "Enduring Mutation: Synthetic Carapace", "Enduring Mutation: Unnatural Physicality",
                "Enduring Mutation: Corrosive Secretions", "Enduring Mutation: Inoculated Vigor", "Enduring Mutation: Toxic Vitality", "Enduring Mutation: Viscous Grip",
                "Enduring Mutation: Acidic Bile", "Enduring Mutation: Grappling Appendages", "Enduring Mutation: Perverted Flight"
            ],
            "enduring mutation: aberrant sight" : {
                name : "Enduring Mutation: Aberrant Sight",
                source : ["GMB:LL"],
                description : desc(["I gain the benefits of Abberant Sight even outside of my Rage, though it still counts against my total of manifested mutations. I can change this choice at the end of a long rest."]),
                prereqeval : function(v) { 
                    // Must first select it as a known mutation before selecting it as an endured mutation
                    techniques = GetFeatureChoice('classes', 'barbarian(laserllama)', 'subclassfeature3.1', true);

                    if (techniques.indexOf("aberrant sight") == -1) return false;

                    return true;
                },
                advantages : [["Perception", true]],
                vision : [["Darkvision", "fixed 60"], ["Darkvision", "+60"], ["Adv. on Perception checks relying on sight", 0]]
            },
            // acid, cold, fire, poison, or lightning
            "enduring mutation: alchemical resistance (acid)" : {
                name : "Enduring Mutation: Alchemical Resistance (Acid)",
                source : ["GMB:LL"],
                description : desc(["I gain the benefits of Alchemical Resistance even outside of my Rage, though it still counts against my total of manifested mutations. I can change this choice at the end of a long rest."]),
                submenu : "Enduring Mutation: Alchemical Resistance",
                prereqeval : function(v) { 
                    techniques = GetFeatureChoice('classes', 'barbarian(laserllama)', 'subclassfeature3.1', true);

                    if (techniques.indexOf("alchemical resistance (acid)") == -1) return false;

                    return true;
                },
                dmgres : ["Acid"],
            },
            "enduring mutation: alchemical resistance (cold)" : {
                name : "Enduring Mutation: Alchemical Resistance (Cold)",
                source : ["GMB:LL"],
                description : desc(["I gain the benefits of Alchemical Resistance even outside of my Rage, though it still counts against my total of manifested mutations. I can change this choice at the end of a long rest."]),
                submenu : "Enduring Mutation: Alchemical Resistance",
                prereqeval : function(v) { 
                    techniques = GetFeatureChoice('classes', 'barbarian(laserllama)', 'subclassfeature3.1', true);

                    if (techniques.indexOf("alchemical resistance (cold)") == -1) return false;

                    return true;
                },
                dmgres : ["Cold"],
            },
            "enduring mutation: alchemical resistance (fire)" : {
                name : "Enduring Mutation: Alchemical Resistance (Fire)",
                source : ["GMB:LL"],
                description : desc(["I gain the benefits of Alchemical Resistance even outside of my Rage, though it still counts against my total of manifested mutations. I can change this choice at the end of a long rest."]),
                submenu : "Enduring Mutation: Alchemical Resistance",
                prereqeval : function(v) { 
                    techniques = GetFeatureChoice('classes', 'barbarian(laserllama)', 'subclassfeature3.1', true);

                    if (techniques.indexOf("alchemical resistance (fire)") == -1) return false;

                    return true;
                },
                dmgres : ["Fire"],
            },
            "enduring mutation: alchemical resistance (poison)" : {
                name : "Enduring Mutation: Alchemical Resistance (Poison)",
                source : ["GMB:LL"],
                description : desc(["I gain the benefits of Alchemical Resistance even outside of my Rage, though it still counts against my total of manifested mutations. I can change this choice at the end of a long rest."]),
                submenu : "Enduring Mutation: Alchemical Resistance",
                prereqeval : function(v) { 
                    techniques = GetFeatureChoice('classes', 'barbarian(laserllama)', 'subclassfeature3.1', true);

                    if (techniques.indexOf("alchemical resistance (poison)") == -1) return false;

                    return true;
                },
                dmgres : ["Poison"],
            },
            "enduring mutation: alchemical resistance (lightning)" : {
                name : "Enduring Mutation: Alchemical Resistance (Lightning)",
                source : ["GMB:LL"],
                description : desc(["I gain the benefits of Alchemical Resistance even outside of my Rage, though it still counts against my total of manifested mutations. I can change this choice at the end of a long rest."]),
                submenu : "Enduring Mutation: Alchemical Resistance",
                prereqeval : function(v) { 
                    techniques = GetFeatureChoice('classes', 'barbarian(laserllama)', 'subclassfeature3.1', true);

                    if (techniques.indexOf("alchemical resistance (lightning)") == -1) return false;

                    return true;
                },
                dmgres : ["Lightning"],
            },
            "enduring mutation: aquatic adaptation" : {
                name : "Enduring Mutation: Aquatic Adaptation",
                source : ["GMB:LL"],
                description : desc(["I gain the benefits of Aquatic Adaptation even outside of my Rage, though it still counts against my total of manifested mutations. I can change this choice at the end of a long rest."]),
                prereqeval : function(v) { 
                    techniques = GetFeatureChoice('classes', 'barbarian(laserllama)', 'subclassfeature3.1', true);

                    if (techniques.indexOf("aquatic adaptation") == -1) return false;

                    return true;
                },
                speed : {
                    swim : { spd : "walk", enc : 0 }
                },
            },
            "enduring mutation: deviant glide" : {
                name : "Enduring Mutation: Deviant Glide",
                source : ["GMB:LL"],
                description : desc(["I gain the benefits of Deviant Glide even outside of my Rage, though it still counts against my total of manifested mutations. I can change this choice at the end of a long rest."]),
                prereqeval : function(v) { 
                    techniques = GetFeatureChoice('classes', 'barbarian(laserllama)', 'subclassfeature3.1', true);

                    if (techniques.indexOf("deviant glide") == -1) return false;

                    return true;
                },
            },
            "enduring mutation: enhanced movement" : {
                name : "Enduring Mutation: Enhanced Movement",
                source : ["GMB:LL"],
                description : desc(["I gain the benefits of Enhanced Movement even outside of my Rage, though it still counts against my total of manifested mutations. I can change this choice at the end of a long rest."]),
                prereqeval : function(v) { 
                    techniques = GetFeatureChoice('classes', 'barbarian(laserllama)', 'subclassfeature3.1', true);

                    if (techniques.indexOf("enhanced movement") == -1) return false;

                    return true;
                },
                changeeval : function (v) {
                    // This will change it at every level up, but not necessarily when the con mod changes, see for reference: https://discord.com/channels/533350585706217494/1377748293945266430/1378050440284999730
                    techniques = GetFeatureChoice('classes', 'barbarian(laserllama)', 'subclassfeature6', false);

                    var monkSpd;
                    if (techniques == "enduring mutation: enhanced movement") {
                        // Add speed bonus
                        monkSpd = '+' + (What('Con Mod') * 5);
                        SetProf('speed', monkSpd !== '+0', {walk : monkSpd}, "Enduring Mutation: Enhanced Movement");
                    } else {
                        // Remove speed bonus; choice was changed
                        monkSpd = 0;
                        SetProf('speed', monkSpd !== '+0', {walk : monkSpd}, "Enduring Mutation: Enhanced Movement");
                    }
                }
            },
            "enduring mutation: oozing form" : {
                name : "Enduring Mutation: Oozing Form",
                source : ["GMB:LL"],
                description : desc(["I gain the benefits of Oozing Form even outside of my Rage, though it still counts against my total of manifested mutations. I can change this choice at the end of a long rest."]),
                prereqeval : function(v) { 
                    techniques = GetFeatureChoice('classes', 'barbarian(laserllama)', 'subclassfeature3.1', true);

                    if (techniques.indexOf("oozing form") == -1) return false;

                    return true;
                },
            },
            "enduring mutation: synthetic carapace" : {
                name : "Enduring Mutation: Synthetic Carapace",
                source : ["GMB:LL"],
                description : desc(["I gain the benefits of Synthetic Carapace even outside of my Rage, though it still counts against my total of manifested mutations. I can change this choice at the end of a long rest."]),
                prereqeval : function(v) { 
                    techniques = GetFeatureChoice('classes', 'barbarian(laserllama)', 'subclassfeature3.1', true);

                    if (techniques.indexOf("synthetic carapace") == -1) return false;

                    return true;
                },
            },
            "enduring mutation: unnatural physicality" : {
                name : "Enduring Mutation: Unnatural Physicality",
                source : ["GMB:LL"],
                description : desc(["I gain the benefits of Unnatural Physicality even outside of my Rage, though it still counts against my total of manifested mutations. I can change this choice at the end of a long rest."]),
                prereqeval : function(v) { 
                    techniques = GetFeatureChoice('classes', 'barbarian(laserllama)', 'subclassfeature3.1', true);

                    if (techniques.indexOf("unnatural physicality") == -1) return false;

                    return true;
                },
            },
            "enduring mutation: corrosive secretions" : {
                name : "Enduring Mutation: Corrosive Secretions",
                source : ["GMB:LL"],
                description : desc(["I gain the benefits of Corrosive Secretions even outside of my Rage, though it still counts against my total of manifested mutations. I can change this choice at the end of a long rest."]),
                prereqeval : function(v) { 
                    techniques = GetFeatureChoice('classes', 'barbarian(laserllama)', 'subclassfeature3.1', true);

                    if (techniques.indexOf("corrosive secretions") == -1) return false;

                    return true;
                },
            },
            "enduring mutation: inoculated vigor" : {
                name : "Enduring Mutation: Inoculated Vigor",
                source : ["GMB:LL"],
                description : desc(["I gain the benefits of Inoculated Vigor even outside of my Rage, though it still counts against my total of manifested mutations. I can change this choice at the end of a long rest."]),
                prereqeval : function(v) { 
                    techniques = GetFeatureChoice('classes', 'barbarian(laserllama)', 'subclassfeature3.1', true);

                    if (techniques.indexOf("inoculated vigor") == -1) return false;

                    return true;
                },
                dmgres : ["Acid", "Poison"],
                savetxt : { adv_vs : ["poisoned"] }
            },
            "enduring mutation: toxic vitality" : {
                name : "Enduring Mutation: Toxic Vitality",
                source : ["GMB:LL"],
                description : desc(["I gain the benefits of Toxic Vitality even outside of my Rage, though it still counts against my total of manifested mutations. I can change this choice at the end of a long rest."]),
                prereqeval : function(v) { 
                    techniques = GetFeatureChoice('classes', 'barbarian(laserllama)', 'subclassfeature3.1', true);

                    if (techniques.indexOf("toxic vitality") == -1) return false;

                    return true;
                },
            },
            "enduring mutation: viscous grip" : {
                name : "Enduring Mutation: Viscous Grip",
                source : ["GMB:LL"],
                description : desc(["I gain the benefits of Viscous Grip even outside of my Rage, though it still counts against my total of manifested mutations. I can change this choice at the end of a long rest."]),
                prereqeval : function(v) { 
                    techniques = GetFeatureChoice('classes', 'barbarian(laserllama)', 'subclassfeature3.1', true);

                    if (techniques.indexOf("viscous grip") == -1) return false;

                    return true;
                },
                speed : {
                    climb : { spd : "walk", enc : 0 }
                },
            },
            "enduring mutation: acidic bile" : {
                name : "Enduring Mutation: Acidic Bile",
                source : ["GMB:LL"],
                description : desc(["I gain the benefits of Acidic Bile even outside of my Rage, though it still counts against my total of manifested mutations. I can change this choice at the end of a long rest."]),
                prereqeval : function(v) { 
                    techniques = GetFeatureChoice('classes', 'barbarian(laserllama)', 'subclassfeature3.1', true);

                    if (techniques.indexOf("acidic bile") == -1) return false;

                    return true;
                },
            },
            "enduring mutation: grappling appendages" : {
                name : "Enduring Mutation: Grappling Appendages",
                source : ["GMB:LL"],
                description : desc(["I gain the benefits of Grappling Appendages even outside of my Rage, though it still counts against my total of manifested mutations. I can change this choice at the end of a long rest."]),
                prereqeval : function(v) { 
                    techniques = GetFeatureChoice('classes', 'barbarian(laserllama)', 'subclassfeature3.1', true);

                    if (techniques.indexOf("grappling appendages") == -1) return false;

                    return true;
                },
            },
            "enduring mutation: perverted flight" : {
                name : "Enduring Mutation: Perverted Flight",
                source : ["GMB:LL"],
                description : desc(["I gain the benefits of Perverted Flight even outside of my Rage, though it still counts against my total of manifested mutations. I can change this choice at the end of a long rest."]),
                prereqeval : function(v) { 
                    techniques = GetFeatureChoice('classes', 'barbarian(laserllama)', 'subclassfeature3.1', true);

                    if (techniques.indexOf("perverted flight") == -1) return false;

                    return true;
                },
                speed : {
                    fly : { spd : "walk", enc : 0 }
                },
            },
        },
        "subclassfeature10" : {
            name : "Noxious Strike",
            source : ["GMB:LL"],
            minlevel : 10,
            description : desc(["When I hit a creature with a melee attack, I can expend an Exploit Die and force it to make a Con save against my Exploit save DC",
                "On a failed save, roll a d6, and the creature suffers the corresponding condition:",
                "1 - blinded, 2 - charmed, 3 - deafened, 4 - frightened, 5 - paralyzed, 6 - poisoned",
                "This effect lasts for 1 minute. The creature can repeat the save at the end of each of its turns, ending the effect on a success.",
                "A creature that succeeds on its save is immune to this ability for the next 24h."]),
        },
        "subclassfeature14" : {
            name : "Rapid Mutation",
            source : [["GMB:LL", 0]],
            minlevel : 14,
            description : desc(["While Raging, I can use a bonus action to end one Mutation and replace it with another Mutation that I know"]),
            usages : "Con mod per ",
            usagescalc : "event.value = Math.max(1, What('Con Mod'));",
            recovery : "long rest",
            action : ["bonus action", ""]
        }
    }
})

// Path of the Packleader
AddSubClass("barbarian(laserllama)", "packleader", {
    regExpSearch : /packleader/i,
    subname : "Path of the Packleader",
    fullname : "Packleader",
    source : [["GMB:LL", 0]],
    abilitySave : 1,
    abilitySaveAlt : 2,
    features : {
        "subclassfeature3" : GetSubclassExploits("Packleader", ["cunning instinct","trampling rush","bloodthirsty critical","feral senses","pack tactics"]),

        "subclassfeature3.1" : {
            name : "Beast Whisperer",
            source : [["GMB:LL", 0]],
            minlevel : 3,
            description : levels.map(function (n) {
                var ExplDie = (n < 5 ? 4 : n < 11 ? 6 : n < 17 ? 8 : 10);

                return desc(["I gain proficiency with Animal Handling and add 1d"+ExplDie+" to Wisdom (Animal Handling) checks"])
            }),
            skills : ["Animal Handling"]
        },
        "subclassfeature3.2" : {
            name : "Savage Companion",
            source : ["GMB:LL", 0],
            minlevel : 3,
            description : desc([
                "I have forged a primal bond with a wild beast",
                'Select a "Savage Companion" on the companion page for its stats and rules',
                "If it dies, I can spend time during a long rest to find another worthy beast"
            ]),
            action : [["action", " (forgo attack)"], ["bonus action", " (command)"]],
            creaturesAdd : [["Savage Companion", true]],
            creatureOptions : [{
                name : "Savage Companion",
                source : ["GMB:LL", 0],
                size : 3,
                type : "Beast",
                alignment : "Unaligned",
                ac : "13+Prof",
                hp : 20,
                hd : [3, 8],
                hdLinked : ["barbarian(laserllama)", "barbarian"],
                minlevelLinked : ["barbarian(laserllama)", "barbarian"],
                speed : "40 ft, swim 20 ft",
                scores : [14, 14, 15, 8, 14, 11],
                saves : ["", "", "", "", "", ""],
                senses : "Adv. on Wis (Perception) checks using hearing/sight/smell",
                passivePerception : 12,
                languages : "Understands the languages you speak",
                challengeRating : "0",
                proficiencyBonus : 2,
                proficiencyBonusLinked : true,
                attacksAction : 1,
                attacks : [{
                    name : "Bite",
                    ability : 1,
                    damage : [1, 6, "piercing"],
                    modifiers : ["", "Prof"],
                    range : "Melee (5 ft)",
                    description : "On hit, Strength saving throw against Exploit save DC or target is grappled. Max one target grappled.",
                    abilitytodamage : true
                }, {
                    name : "Maul",
                    ability : 1,
                    damage : [1, 8, "slashing"],
                    modifiers : ["", "Prof"],
                    range : "Melee (5 ft)",
                    description : "",
                    abilitytodamage : true
                }],
                features : [{
                    name : "Primal Bond",
                    description : "I add my PB to any ability check or saving throw my Companion makes (already included)."
                }, {
                    name : "Keen Senses",
                    description : "The companion has advantage on Wisdom (Perception) checks that rely on sight, hearing, or smell."
                }, /*{
                    name : "Leader",
                    description : "It takes its turn during that of its leader, on the same initiative count. It can move and take reactions on its own, but only takes the Dodge action on its turn unless its leader takes a bonus action to command it to take another action. Its leader can also forgo one attack during their Attack action to command the companion to take the Attack action. If its leader is incapacitated, the companion can take any action, not just Dodge. If the companion is reduced to 0 hit points, it makes death saving throws like a player character would."
                }*/],
                traits : [{
                    name : "Wild Fury (Packleader 6)",
                    minlevel : 6,
                    description : "When I Rage, my Companion also gains resistance to bludgeoning, piercing, and slashing damage for the duration."
                    
                }, {
                    name : "Leader of the Pack (Packleader 10)",
                    minlevel : 10,
                    description : "Both me and my Savage Companion have advantage on attack rolls against a creature if the other is within 5 feet of the target creature and not incapacitated."
                }],
                notes: [{
                    name : "The companion obeys the commands of its leader",
                    description : "and shares its proficiency bonus.",
                    joinString: " "
                }, {
                    name: "It takes its turn during that of its leader,",
                    description: "on the same initiative count.",
                    joinString: " "
                }, {
                    name: "It can move and take reactions on its own,",
                    description: "but only takes the Dodge action on its turn unless its leader takes a bonus action to command it to take another action.",
                    joinString: " "
                }, {
                    name: "Its leader can also forgo one attack during their Attack action",
                    description: "to command the companion to take the Attack action.",
                    joinString: " "
                }, {
                    name: "If its leader is incapacitated,",
                    description: "the companion can take any action, not just Dodge.",
                    joinString: " "
                }, {
                    name: "If the companion is reduced to 0 hit points,",
                    description: "it makes death saving throws like a player character would.",
                    joinString: " "
                }],
                addMod : [
                    { type : "skill", field : "All", mod : "Prof", text : "The savage companion adds my proficiency bonus to all its ability check and saving throws." },
                    { type : "skill", field : "Init", mod : "Prof", text : "The savage companion adds my proficiency bonus to all its ability check and saving throws." },
                    { type : "save", field : "All", mod : "Prof", text : "The savage companion adds my proficiency bonus to all its ability check and saving throws." }
                ],
                calcChanges : {
                    hp : function (totalHD, HDobj, prefix) {
                        //if (!classes.known.ranger && !classes.known.rangerua) return;
                        var rngrLvl = classes.known["barbarian(laserllama)"] ? classes.known["barbarian(laserllama)"].level : classes.known.barbarian.level;
                        var rngrLvlM = 5 * rngrLvl;
                        HDobj.alt.push(5 + rngrLvlM);
                        HDobj.altStr.push(" = 5 as a base\n + 5 \xD7 " + rngrLvl + " from five times its leader's barbarian level (" + rngrLvlM + ")");
                    },
                    setAltHp : true
                }
            }]
        },

        "subclassfeature6" : {
            name : "Wild Fury",
            description : desc(["When I Rage, my Companion also gains resistance to bludg, piercing, and slashing damage"]),
            minlevel : 6,
            source : [["GMB:LL", 0]]
        },
        "subclassfeature10" : {
            name : "Leader of the Pack",
            description : desc(["Both me and my Savage Companion have advantage on attack rolls against a creature if the other is within 5 feet of the target creature and not incapacitated"]),
            minlevel : 10,
            source : [["GMB:LL", 0]],
        },
        "subclassfeature14" : {
            name : "Primal Howl",
            description : desc(["When I Rage, me or my Savage Companion can howl and force creatures of my choice that can hear me within 30 ft to make a Wis save against my Exploit save DC. On a failed save, it is frightened of whoever howled for 1 minute.",
                                "A creature can repeat this save at the start of each turn, ending the effect on a success. A target that succeeds on its save is immune to the effects of this howl for the next 24 hours."]),
            minlevel : 14,
            source : [["GMB:LL", 0]]
        }
    }
})

// Path of the Reaver
AddSubClass("barbarian(laserllama)", "reaver", {
    regExpSearch : /reaver/i,
    subname : "Path of the Reaver",
    fullname : "Reaver",
    source : [["GMB:LL", 0]],
    abilitySave : 1,
    abilitySaveAlt : 2,
    features : {
        // Override martial exploits because size of die increases
        // NOTE: This has been copy pasted from the main class. IT WON'T WORK IF YOU TRY TO USE newObj ! (it will cause a crash because of some variable's scope)
        // I do not know how to fix that scoping bug, so I went for the more brute force approach. If it works, it aint stupid ;)
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

            // Make a filtered spell list that contains only fighter(laserllama) "spells" BUT that aren't also barbarian(laserllama) "spells" (since we already included them above)
            const ReaverSpells = Object.keys(SpellsList).filter((key) => SpellsList[key].isExploit).filter((key) => {
                for (var i = 0; i < SpellsList[key].classes.length; i++) {
                    if (SpellsList[key].classes[i] == "barbarian(laserllama)") return false;
                }
                for (var i = 0; i < SpellsList[key].classes.length; i++) {
                    if (SpellsList[key].classes[i] == "fighter(laserllama)") return true;
                }
                return false;
            });

            // Iterate over all fighter(laserllama) "spells"
            for (var i = 0; i < ReaverSpells.length; i++) {
                var NewSpell = SpellsList[ReaverSpells[i]];
                var tempSpell = ReaverSpells[i];

                SavageExploits.extrachoices.push(NewSpell.name); // Add "spell" name to menu options

                SavageExploits[ReaverSpells[i]] = { // Add "spell" to the main item (when it is picked through the menu)
                    name: NewSpell.name,
                    toNotesPage : [{ // What is added to the notes page
                        name : NewSpell.name + " Exploit [" + (NewSpell.level == 1 ? '1st' : NewSpell.level == 2 ? '2nd' : NewSpell.level == 3 ? '3rd': NewSpell.level + 'th') + " degree]",
                        note : desc(NewSpell.descriptionFull),
                        amendTo : "Savage Exploits"
                    }],
                    source: NewSpell.source,
                    addMod: NewSpell.addMod,
                    submenu: NewSpell.submenu,
                    prereqeval: ExploitPrereqFactoryReaver(ReaverSpells[i], "barbarian(laserllama)"),
                    eval: CreateSavageSpellsheet, // in case the user removes all exploits
                    spellcastingBonusElsewhere : {
                        addTo : "savage exploits",
                        spellcastingBonus : {
                            name : "Savage Exploits",
                            spellcastingAbility : 1,
                            spells : [ReaverSpells[i]],
                            selection : [ReaverSpells[i]]
                        }
                    }
                }
            }

            return SavageExploits
        }(),

        "subclassfeature3" : GetSubclassExploits("Reaver", ["lightstep", "savage rebuke","aggressive sprint","glancing blow", "adrenaline rush"]),
        "subclassfeature3.1" : {
            name : "Reaver Superiority",
            source : [["GMB:LL", 0]],
            minlevel : 3,
            description : levels.map(function (n) {
                var ExtraExploits = (n < 10 ? "one Exploit known." : "two Exploits known.");

                return desc([
                    "When I learn an Exploit, I can learn it from the Fighter list, using my Barbarian level for the prerequisite. Also, I get one extra Exploit Die and " + ExtraExploits
                ])
            }),
            bonusClassExtrachoices : [{
                "class" : "barbarian(laserllama)",
                "feature" : "savage exploits",
                "bonus" : 1
            }],
            extraLimitedFeatures : [{
                name : "Exploit Dice",
                usages : 1,
                recovery : "short rest",
                addToExisting : true
            }]
        },
        "subclassfeature3.2" : {
            name : "Swift Strides", 
            source : [["GMB:LL", 0]],
            minlevel : 3,
            description : desc("When Raging, opportunity attacks against me are made at disadvantage")
        },
        "subclassfeature6" : {
            name : "Unbridled Fury",
            source : [["GMB:LL", 0]],
            minlevel : 6,
            description : levels.map(function (n) {
                var ExplDie = (n < 5 ? 4 : n < 11 ? 6 : n < 17 ? 8 : 10);

                return desc(["When I Rage, I gain one of the following benefits:",
                    "\u2022 I regain one of my expended Exploit Dice",
                    "\u2022 I gain 1d"+ExplDie+" temporary hit points",
                    "\u2022 My walking speed is doubled for my current turn"
                ])
            }),
        },
        "subclassfeature10" : {
            name : "Unstoppable Warrior",
            source : ["GMB:LL"],
            minlevel : 10,
            description : desc(["While Raging, I am under the effects of freedom of movement (in spell list for reference)"]),
            spellcastingBonus : {
                name : "Unstoppable Warrior",
                spells : ["freedom of movement"],
                selection : ["freedom of movement"],
                firstCol : "R",
                times : 1
            },
            spellChanges : {
                "freedom of movement" : {
                    range : "Self",
                    time : "-",
                    components : "-",
                    duration : "Rage",
                    changes : "While Raging, I am under the effects of freedom of movement (in spell list for reference)"
                }
            },
            bonusClassExtrachoices : [{
                "class" : "barbarian(laserllama)",
                "feature" : "savage exploits",
                "bonus" : 1
            }],
        },
        "subclassfeature14" : {
            name : "Storm of Flesh & Steel",
            source : [["GMB:LL", 0]],
            minlevel : 14,
            description : desc(["Once per turn when I use an Exploit while Raging, I can roll a d4 in place of expending an Exploit Dice"])
        }
    }
})

// Path of the Titan
AddSubClass("barbarian(laserllama)", "titan", { 
    regExpSearch : /titan/i,
    subname : "Path of the Titan",
    fullname : "Titan",
    source : ["GMB:LL", 0],
    features : {
        "subclassfeature3" : GetSubclassExploits("Titanic", ["feat of strength", "hurl","greater hurl", "shattering slam","destructive slam"]),
        "subclassfeature3.1" : {
            name : "Giant Bloodline",
            source : [["GMB:LL", 0]],
            minlevel : 3,
            description : desc([
                    'Choose the option that best fits the type of giant whose power resides in you using the "Choose Feature" button above',
                    "This choice is permanent and can't be changed short of a wish spell or the magic of elder giants"
                ]),
            choices : ["Lesser Giant", "Hill Giant", "Stone Giant", "Frost Giant", "Fire Giant", "Cloud Giant", "Storm Giant"],
            "lesser giant" : {
                name : "Lesser Giant Bloodline",
                description : desc(["The power of Lesser Giants reside in me, I gain resistance to Poison damage"]),
                dmgres : ["Poison"],
            },
            "hill giant" : {
                name : "Hill Giant Bloodline",
                description : desc(["The power of Hill Giants reside in me, I gain resistance to Bludgeoning damage"]),
                dmgres : ["Bludgeoning"],
            },
            "stone giant" : {
                name : "Stone Giant Bloodline",
                description : desc(["The power of Stone Giants reside in me, I gain resistance to Psychic damage"]),
                dmgres : ["Psychic"],
            },
            "frost giant" : {
                name : "Frost Giant Bloodline",
                description : desc(["The power of Frost Giants reside in me, I gain resistance to Cold damage"]),
                dmgres : ["Cold"],
            },
            "fire giant" : {
                name : "Fire Giant Bloodline",
                description : desc(["The power of Fire Giants reside in me, I gain resistance to Fire damage"]),
                dmgres : ["Fire"],
            },
            "cloud giant" : {
                name : "Cloud Giant Bloodline",
                description : desc(["The power of Cloud Giants reside in me, I gain resistance to Thunder damage"]),
                dmgres : ["Thunder"],
            },
            "storm giant" : {
                name : "Storm Giant Bloodline",
                description : desc(["The power of Storm Giants reside in me, I gain resistance to Lightning damage"]),
                dmgres : ["Lightning"],
            },
            // Create the dependency for the level 10 feature
            choiceDependencies : [{
                feature : "subclassfeature10",
                choiceAttribute : false
            }]
        },
        "subclassfeature3.2" : {
            name : "Fury of the Titans",
            source : [["GMB:LL", 0]],
            minlevel : 3,
            description : levels.map(function (n) {
                if (n < 6) {
                    return desc([
                        "When I Rage, I gain the following benefits:",
                        "\u2022 If there is room, I can choose to grow by one size category. My physical size doubles in all dimensions, and my weight is multiplied by eight.",
                        "\u2022 My Strength-based weapon attacks deal bonus damage depending on my current size: Medium (1d4), Large(1d6), Huge (1d12), and Gargantuan (2d12).",
                        "\u2022 I can use hurl without expending an Exploit Die."
                    ])
                }

                return desc([
                    "When I Rage, I gain the following benefits:",
                    "\u2022 If there is room, I can choose to grow by one size category. My physical size doubles in all dimensions, and my weight is multiplied by eight.",
                    "\u2022 My Strength-based weapon attacks deal bonus damage depending on my current size: Medium (1d4), Large(1d6), Huge (1d12), and Gargantuan (2d12).",
                    "\u2022 I can use hurl without expending an Exploit Die.",
                    "\u2022 I gain " + n + " temporary HP"
                ])
            })
        },
        "subclassfeature10" : {
            name : "Awakened Bloodline",
            source : [["GMB:LL", 0]],
            minlevel : 10,
            description : desc(["I manifest more specific traits dependent upon my Giant Bloodline"]),
            choices : ["Lesser Giant", "Hill Giant", "Stone Giant", "Frost Giant", "Fire Giant", "Cloud Giant", "Storm Giant"],
            choicesNotInMenu : true,
            "lesser giant" : {
                name : "Awakened Lesser Giant Bloodline",
                description : levels.map(function (n) {
                    var ExplDie = (n < 5 ? 4 : n < 11 ? 6 : n < 17 ? 8 : 10);

                    return desc([
                        "I can add 1d"+ExplDie+" to Strength (Intimidation) and Charisma (Intimidation) checks",
                        "My strange knotted flesh grants me a +1 bonus to my Armor Class while Raging"
                    ])
                }),
                extraAC : [{
                    name : "Awakened Bloodline (in Rage)",
                    mod : "1",
                    text : "My strange knotted flesh grants me a +1 bonus to my Armor Class while Raging"
                }]
            },
            "hill giant" : {
                name : "Awakened Hill Giant Bloodline",
                description : desc(["I have advantage on Constitution saving throws",
                    "When I take damage while Raging, I can use a reaction to reduce the damage I take by my Con mod (min 1)"]),
                action: [["reaction", " (when damaged in rage)"]],
                savetxt : { 
                    text : ["Adv. on Con saves"]
                }
            },
            "stone giant" : {
                name : "Awakened Stone Giant Bloodline",
                description : levels.map(function (n) {
                    var ExplDie = (n < 5 ? 4 : n < 11 ? 6 : n < 17 ? 8 : 10);

                    return desc([
                        "I gain proficiency in Insight, and I can add 1d"+ExplDie+" to my Wisdom (Insight) checks", 
                        "When forced to make a Wis save while Raging, I can add 1d" + ExplDie
                    ])
                }),
                skills : ["Insight"],
                savetxt : { 
                    text : ["Add Expl Die to Wis saves in rage"]
                },
            },
            "frost giant" : {
                name : "Awakened Frost Giant Bloodline",
                description : desc(["When using an Exploit that deals damage, I can cause it to deal cold damage", 
                    "Each time I hit a target with an attack while Raging, its speed is reduced by 10 ft until the start of my next turn"]),
            },
            "fire giant" : {
                name : "Awakened Fire Giant Bloodline",
                description : levels.map(function (n) {
                    var ExplDie = (n < 5 ? 4 : n < 11 ? 6 : n < 17 ? 8 : 10);

                    return desc([
                        "While wearing armor, I can use my Con mod, in place of Dex, to calculate my AC", // here we go again... this is impossible to add
                        "When a creature hits me with a melee attack while Raging, I can use my reaction to deal 1d"+ExplDie+" fire damage to the attacker"
                    ])
                }),
                action: [["reaction", "Awakened Bloodline (when hit in melee in rage)"]],
                extraAC : [{
                    name : "Awakened Fire Bloodline (light armor)",
                    mod : "max(Con-Dex|0)",
                    text : "I can use my Con to calculate my AC instead of Dex while wearing light armor",
                    stopeval : function (v) { 
                        return (!v.wearingArmor || v.mediumArmor || v.heavyArmor) // light armor only
                    }
                }/*, {
                    name : "Awakened Fire Bloodline (medium armor)",
                    mod : "min(max(Con-Dex|0)|2)",
                    text : "I can use my Con to calculate my AC instead of Dex while wearing medium armor",
                    stopeval : function (v) { 
                        return !v.mediumArmor // medium armor only
                    }
                }*/] 
                // NOTE: It is impossible to put a nested min/max expression (the sheet can't handle it)
                // It is mathematically impossible to formulate this expression without it, so there's nothing I can do
            },
            "cloud giant" : {
                name : "Awakened Cloud Giant Bloodline",
                description : desc(["I gain resistance to falling damage, and while Raging, I can take the Dash or Disengage action as a bonus action"]),
                action: [["bonus action", "Dash (in rage)"], ["bonus action", "Disengage (in rage)"]],
                dmgres: ["Falling damage"]

            },
            "storm giant" : {
                name : "Awakened Storm Giant Bloodline",
                description : desc(["I gain a swim speed equal to my walk speed, and can breathe both air and water",
                    "Also, while Raging, I can cause my thrown weapon attacks, both hurl and greater hurl to deal lightning damage in place of their normal damage"]),
                speed : {
                    swim : { spd : "walk", enc : 0 }
                }
            }
        },
        "subclassfeature14" : {
            name : "Titanic Wrath",
            source : [["GMB:LL", 0]],
            minlevel : 14,
            description : desc([
                "When I take the Attack action while Raging, I can focus all my power into one strike",
                "I make one attack for this action, even if I have a feature that lets me do more than one attack",
                "On hit, it becomes a critical hit, regardless of my attack roll"
            ]),
            action : [["action", ""]],
            usages : "Con mod per ",
            usagescalc : "event.value = Math.max(1, What('Con Mod'));",
            recovery : "long rest",
        }
    }
});

// Path of the Warden
AddSubClass("barbarian(laserllama)", "warden", {
    regExpSearch : /warden/i,
    subname : "Path of the Warden",
    fullname : "Warden",
    source : [["GMB:LL", 0]],
    abilitySave : 5,
    spellcastingFactor : "warlock3",
    spellcastingTable : [
        [0, 0, 0, 0, 0, 0, 0, 0, 0], //lvl 0
        [0, 0, 0, 0, 0, 0, 0, 0, 0], //lvl 1
        [0, 0, 0, 0, 0, 0, 0, 0, 0], //lvl 2
        [1, 0, 0, 0, 0, 0, 0, 0, 0], //lvl 3
        [2, 0, 0, 0, 0, 0, 0, 0, 0], //lvl 4
        [2, 0, 0, 0, 0, 0, 0, 0, 0], //lvl 5
        [2, 0, 0, 0, 0, 0, 0, 0, 0], //lvl 6
        [0, 2, 0, 0, 0, 0, 0, 0, 0], //lvl 7
        [0, 2, 0, 0, 0, 0, 0, 0, 0], //lvl 8
        [0, 2, 0, 0, 0, 0, 0, 0, 0], //lvl 9
        [0, 2, 0, 0, 0, 0, 0, 0, 0], //lvl10
        [0, 2, 0, 0, 0, 0, 0, 0, 0], //lvl11
        [0, 2, 0, 0, 0, 0, 0, 0, 0], //lvl12
        [0, 0, 2, 0, 0, 0, 0, 0, 0], //lvl13
        [0, 0, 2, 0, 0, 0, 0, 0, 0], //lvl14
        [0, 0, 2, 0, 0, 0, 0, 0, 0], //lvl15
        [0, 0, 2, 0, 0, 0, 0, 0, 0], //lvl16
        [0, 0, 2, 0, 0, 0, 0, 0, 0], //lvl17
        [0, 0, 2, 0, 0, 0, 0, 0, 0], //lvl18
        [0, 0, 0, 2, 0, 0, 0, 0, 0], //lvl19
        [0, 0, 0, 2, 0, 0, 0, 0, 0] //lvl20
    ],
    spellcastingList : {
        spells : WardenList
    },
    spellcastingKnown : {
        cantrips : [0, 0, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        spells : [0, 0, 2, 2, 3, 3, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7]
    },
    features : {
        "subclassfeature3" : {
            name : "Spellcasting",
            source : [["GMB:LL", 0]],
            minlevel : 3,
            description : desc([
                "I can cast known Warden spells, using Wisdom as my spellcasting ability", 
                "I can replace a spell I know with another I have spell slots for when I gain a level",
                "I regain these spell slots on a short rest"
            ]),
            additional : ["", "", "1 cantrip \u0026 2 spells known", "1 cantrip \u0026 2 spells known", "1 cantrip \u0026 3 spells known", "1 cantrip \u0026 3 spells known", "1 cantrip \u0026 4 spells known", "1 cantrip \u0026 4 spells known", "1 cantrip \u0026 5 spells known", "2 cantrips \u0026 5 spells known", "2 cantrips \u0026 5 spells known", "2 cantrips \u0026 5 spells known", "2 cantrips \u0026 6 spells known", "2 cantrips \u0026 6 spells known", "2 cantrips \u0026 6 spells known", "2 cantrips \u0026 6 spells known", "2 cantrips \u0026 7 spells known", "2 cantrips \u0026 7 spells known", "2 cantrips \u0026 7 spells known", "2 cantrips \u0026 7 spells known"],
        },
        "subclassfeature3.1" : {
            name : "Primal Rage",
            source : [["GMB:LL", 0]],
            minlevel : 3,
            description : levels.map(function (n) {
                if (n < 7) {
                    return desc([
                        "I can cast Warden spells while Raging, but I have disadvantage on any Con save to maintain concentration on my Warden spells while Raging",
                        "Casting a Warden spell of 1st-level or higher allows my Rage to continue until the end of my next turn, even if I don't meet the other requirements to extend my Rage"
                    ])
                }

                if (n < 14) {
                    return desc([
                        "I can cast Warden spells while Raging, but I have disadvantage on any Con save to maintain concentration on my Warden spells while Raging",
                    ])
                }

                return desc([
                    "I can cast Warden spells while Raging"
                ])
            })
        },
        "subclassfeature6" : {
            name : "Guardian's Fury",
            source : [["GMB:LL", 0]],
            minlevel : 6,
            description : desc([
                "When I use my action to cast a Warden spell, I can make a weapon attack as a bonus action",
                "Also, I can use Reckless Attack when I cast a Warden spell that requires a spell attack roll"
            ]),
            action : ["bonus action", " (attack)"]
        },
        "subclassfeature10" : {
            name : "Ward of the Ancients",
            source : ["GMB:LL"],
            minlevel : 10,
            description : desc(["As a reaction when I take damage from a spell, I can expend a Primal Magic spell slot to grant myself resistance to all damage from the triggering spell"]),
            action : ["reaction", ""]
        },
        "subclassfeature14" : {
            name : "Improved Guardian's Fury",
            source : [["GMB:LL", 0]],
            minlevel : 14,
            description : desc(["When I take the Attack action while Raging, I can cast a Warden spell in place of one of my attacks"])
        }
    }
})

// Path of the Wyrmblood
AddSubClass("barbarian(laserllama)", "wyrmblood", { 
    regExpSearch : /wyrmblood/i,
    subname : "Path of the Wyrmblood",
    fullname : "Wyrmblood",
    source : ["GMB:LL", 0],
    features : {
        "subclassfeature3" : GetSubclassExploits("Wyrmblood", ["commanding presence", "ruthless strike","feral senses", "intimidating command","roar of triumph"]),
        "subclassfeature3.1" : {
            name : "Draconic Ancestry",
            source : [["GMB:LL", 0]],
            minlevel : 3,
            description : desc([
                'Choose the option that best fits the type of dragon whose power resides in you using the "Choose Feature" button above',
                "I gain resistance to my Dragon's associated Element. I also learn Draconic."
            ]),
            languageProfs : ["Draconic"],
            choices : ["Amethyst Dragon", "Black Dragon", "Blue Dragon", "Brass Dragon", "Bronze Dragon", "Copper Dragon", "Crystal Dragon", "Emerald Dragon",
                "Gold Dragon", "Green Dragon", "Red Dragon", "Sapphire Dragon", "Silver Dragon", "Steel Dragon", "Topaz Dragon", "White Dragon"],
            "amethyst dragon" : {
                name : "Amethyst Draconic Ancestry",
                description : desc([
                    "The power of Amethyst dragons reside in me, which are affiliated with Force damage",
                    "I gain resistance to Force damage and learn Draconic"
                ]),
                dmgres : ["Force"],
                dependentChoices : "force"
            },
            "black dragon" : {
                name : "Black Draconic Ancestry",
                description : desc([
                    "The power of Black dragons reside in me, which are affiliated with Acid damage",
                    "I gain resistance to Acid damage and learn Draconic"
                ]),
                dmgres : ["Acid"],
                dependentChoices : "acid"
            },
            "blue dragon" : {
                name : "Blue Draconic Ancestry",
                description : desc([
                    "The power of Blue dragons reside in me, which are affiliated with Lightning damage",
                    "I gain resistance to Lightning damage and learn Draconic"
                ]),
                dmgres : ["Lightning"],
                dependentChoices : "lightning"
            },
            "brass dragon" : {
                name : "Brass Draconic Ancestry",
                description : desc([
                    "The power of Brass dragons reside in me, which are affiliated with Fire damage",
                    "I gain resistance to Fire damage and learn Draconic"
                ]),
                dmgres : ["Fire"],
                dependentChoices : "fire"
            },
            "bronze dragon" : {
                name : "Bronze Draconic Ancestry",
                description : desc([
                    "The power of Bronze dragons reside in me, which are affiliated with Lightning damage",
                    "I gain resistance to Lightning damage and learn Draconic"
                ]),
                dmgres : ["Lightning"],
                dependentChoices : "lightning"
            },
            "copper dragon" : {
                name : "Copper Draconic Ancestry",
                description : desc([
                    "The power of Copper dragons reside in me, which are affiliated with Acid damage",
                    "I gain resistance to Acid damage and learn Draconic"
                ]),
                dmgres : ["Acid"],
                dependentChoices : "acid"
            },
            "crystal dragon" : {
                name : "Crystal Draconic Ancestry",
                description : desc([
                    "The power of Crystal dragons reside in me, which are affiliated with Radiant damage",
                    "I gain resistance to Radiant damage and learn Draconic"
                ]),
                dmgres : ["Radiant"],
                dependentChoices : "radiant"
            },
            "emerald dragon" : {
                name : "Emerald Draconic Ancestry",
                description : desc([
                    "The power of Emerald dragons reside in me, which are affiliated with Psychic damage",
                    "I gain resistance to Psychic damage and learn Draconic"
                ]),
                dmgres : ["Psychic"],
                dependentChoices : "psychic"
            },
            "gold dragon" : {
                name : "Gold Draconic Ancestry",
                description : desc([
                    "The power of Gold dragons reside in me, which are affiliated with Fire damage",
                    "I gain resistance to Fire damage and learn Draconic"
                ]),
                dmgres : ["Fire"],
                dependentChoices : "fire"
            },
            "green dragon" : {
                name : "Green Draconic Ancestry",
                description : desc([
                    "The power of Green dragons reside in me, which are affiliated with Poison damage",
                    "I gain resistance to Poison damage and learn Draconic"
                ]),
                dmgres : ["Poison"],
                dependentChoices : "poison"
            },
            "red dragon" : {
                name : "Red Draconic Ancestry",
                description : desc([
                    "The power of Red dragons reside in me, which are affiliated with Fire damage",
                    "I gain resistance to Fire damage and learn Draconic"
                ]),
                dmgres : ["Fire"],
                dependentChoices : "fire"
            },
            "sapphire dragon" : {
                name : "Sapphire Draconic Ancestry",
                description : desc([
                    "The power of Sapphire dragons reside in me, which are affiliated with Thunder damage",
                    "I gain resistance to Thunder damage and learn Draconic"
                ]),
                dmgres : ["Thunder"],
                dependentChoices : "thunder"
            },
            "silver dragon" : {
                name : "Silver Draconic Ancestry",
                description : desc([
                    "The power of Silver dragons reside in me, which are affiliated with Cold damage",
                    "I gain resistance to Cold damage and learn Draconic"
                ]),
                dmgres : ["Cold"],
                dependentChoices : "cold"
            },
            "steel dragon" : {
                name : "Steel Draconic Ancestry",
                description : desc([
                    "The power of Steel dragons reside in me, which are affiliated with Acid damage",
                    "I gain resistance to Acid damage and learn Draconic"
                ]),
                dmgres : ["Acid"],
                dependentChoices : "acid"
            },
            "topaz dragon" : {
                name : "Topaz Draconic Ancestry",
                description : desc([
                    "The power of Topaz dragons reside in me, which are affiliated with Necrotic damage",
                    "I gain resistance to Necrotic damage and learn Draconic"
                ]),
                dmgres : ["Necrotic"],
                dependentChoices : "necrotic"
            },
            "white dragon" : {
                name : "White Draconic Ancestry",
                description : desc([
                    "The power of White dragons reside in me, which are affiliated with Cold damage",
                    "I gain resistance to Cold damage and learn Draconic"
                ]),
                dmgres : ["Cold"],
                dependentChoices : "cold"
            },

            // Create the dependency for the other features
            choiceDependencies : [{
                feature : "subclassfeature3.2",
                choiceAttribute : true
            }, {
                feature : "subclassfeature10",
                choiceAttribute : true
            }]
        },
        "subclassfeature3.2" : {
            name : "Draconic Fury",
            source : [["GMB:LL", 0]],
            minlevel : 3,
            description : desc([
                "When I Rage, I gain the following benefits:",
                "\u2022 Draconic scales give me a +2 bonus to my AC while using Unarmored Defense",
                "\u2022 My Rage damage bonus and Savage Exploits deal my Element damage in place of their normal damage",
                "\u2022 Once per turn when I hit with a Strength-based weapon attack, I can roll two dice for my Rage damage bonus"
            ]),
            extraAC : [{
                mod : 2,
                magic : true,
                text : "I gain a +2 bonus to AC while using Unarmored Defense",
                stopeval : function (v) { return v.wearingArmor || v.theArmor.name == "Mage Armor"; }
            }],

            choices : ["fire", "cold", "poison", "acid", "thunder", "lightning", "radiant", "necrotic", "psychic", "force"],
            choicesNotInMenu : true, // inherit attribute from subclassfeature3.1
            "fire" : {
                name : "Draconic Fury",
                description : desc([
                    "When I Rage, I gain the following benefits:",
                    "\u2022 Draconic scales give me a +2 bonus to my AC while using Unarmored Defense",
                    "\u2022 My Rage damage bonus and Savage Exploits deal Fire damage in place of their normal damage",
                    "\u2022 Once per turn when I hit with a Strength-based weapon attack, I can roll two dice for my Rage damage bonus"
                ]),
            },
            "cold" : {
                name : "Draconic Fury",
                description : desc([
                    "When I Rage, I gain the following benefits:",
                    "\u2022 Draconic scales give me a +2 bonus to my AC while using Unarmored Defense",
                    "\u2022 My Rage damage bonus and Savage Exploits deal Cold damage in place of their normal damage",
                    "\u2022 Once per turn when I hit with a Strength-based weapon attack, I can roll two dice for my Rage damage bonus"
                ]),
            },
            "poison" : {
                name : "Draconic Fury",
                description : desc([
                    "When I Rage, I gain the following benefits:",
                    "\u2022 Draconic scales give me a +2 bonus to my AC while using Unarmored Defense",
                    "\u2022 My Rage damage bonus and Savage Exploits deal Poison damage in place of their normal damage",
                    "\u2022 Once per turn when I hit with a Strength-based weapon attack, I can roll two dice for my Rage damage bonus"
                ]),
            },
            "acid" : {
                name : "Draconic Fury",
                description : desc([
                    "When I Rage, I gain the following benefits:",
                    "\u2022 Draconic scales give me a +2 bonus to my AC while using Unarmored Defense",
                    "\u2022 My Rage damage bonus and Savage Exploits deal Acid damage in place of their normal damage",
                    "\u2022 Once per turn when I hit with a Strength-based weapon attack, I can roll two dice for my Rage damage bonus"
                ]),
            },
            "thunder" : {
                name : "Draconic Fury",
                description : desc([
                    "When I Rage, I gain the following benefits:",
                    "\u2022 Draconic scales give me a +2 bonus to my AC while using Unarmored Defense",
                    "\u2022 My Rage damage bonus and Savage Exploits deal Thunder damage in place of their normal damage",
                    "\u2022 Once per turn when I hit with a Strength-based weapon attack, I can roll two dice for my Rage damage bonus"
                ]),
            },
            "lightning" : {
                name : "Draconic Fury",
                description : desc([
                    "When I Rage, I gain the following benefits:",
                    "\u2022 Draconic scales give me a +2 bonus to my AC while using Unarmored Defense",
                    "\u2022 My Rage damage bonus and Savage Exploits deal Lightning damage in place of their normal damage",
                    "\u2022 Once per turn when I hit with a Strength-based weapon attack, I can roll two dice for my Rage damage bonus"
                ]),
            },
            "radiant" : {
                name : "Draconic Fury",
                description : desc([
                    "When I Rage, I gain the following benefits:",
                    "\u2022 Draconic scales give me a +2 bonus to my AC while using Unarmored Defense",
                    "\u2022 My Rage damage bonus and Savage Exploits deal Radiant damage in place of their normal damage",
                    "\u2022 Once per turn when I hit with a Strength-based weapon attack, I can roll two dice for my Rage damage bonus"
                ]),
            },
            "necrotic" : {
                name : "Draconic Fury",
                description : desc([
                    "When I Rage, I gain the following benefits:",
                    "\u2022 Draconic scales give me a +2 bonus to my AC while using Unarmored Defense",
                    "\u2022 My Rage damage bonus and Savage Exploits deal Necrotic damage in place of their normal damage",
                    "\u2022 Once per turn when I hit with a Strength-based weapon attack, I can roll two dice for my Rage damage bonus"
                ]),
            },
            "psychic" : {
                name : "Draconic Fury",
                description : desc([
                    "When I Rage, I gain the following benefits:",
                    "\u2022 Draconic scales give me a +2 bonus to my AC while using Unarmored Defense",
                    "\u2022 My Rage damage bonus and Savage Exploits deal Psychic damage in place of their normal damage",
                    "\u2022 Once per turn when I hit with a Strength-based weapon attack, I can roll two dice for my Rage damage bonus"
                ]),
            },
            "force" : {
                name : "Draconic Fury",
                description : desc([
                    "When I Rage, I gain the following benefits:",
                    "\u2022 Draconic scales give me a +2 bonus to my AC while using Unarmored Defense",
                    "\u2022 My Rage damage bonus and Savage Exploits deal Force damage in place of their normal damage",
                    "\u2022 Once per turn when I hit with a Strength-based weapon attack, I can roll two dice for my Rage damage bonus"
                ]),
            },
        },
        "subclassfeature6" : {
            name : "Tyrannical Resilience",
            source : [["GMB:LL", 0]],
            minlevel : 6,
            description : levels.map(function (n) {
                var ExplDie = (n < 5 ? 4 : n < 11 ? 6 : n < 17 ? 8 : 10);

                return desc(["While Raging, I can add 1d"+ExplDie+" to all Int, Wis, and Cha saves against magic"])
            }),
            savetxt : { 
                text : ["Add Expl Die to Int/Wis/Cha vs. magic in rage"]
            },
            // In theory, I could merge this feature with the lvl 3 rage improvements, but it would mean that there is no text added to the saves field
        },
        "subclassfeature10" : {
            name : "Breath of the Dragon",
            source : [["GMB:LL", 0]],
            minlevel : 10,
            description : desc([
                "As an action, I can force creatures in an adjacent 30-foot cone to make a Dex save against my Exploit DC. On a fail, creatures take 8d6 damage of my Element damage type (half on save).",
                "When I have no uses left, I can expend a use of Rage to use this feature again"
            ]),
            action : [["action", ""]],
            usages : 1,
            recovery : "short rest",
            altResource : "Rage",

            choices : ["fire", "cold", "poison", "acid", "thunder", "lightning", "radiant", "necrotic", "psychic", "force"],
            choicesNotInMenu : true, // inherit attribute from subclassfeature3.1
            "fire" : {
                name : "Breath of the Dragon",
                description : desc([
                    "As an action, I can force creatures in an adjacent 30-foot cone to make a Dex save against my Exploit DC. On a fail, creatures take 8d6 fire damage (half on save).",
                    "When I have no uses left, I can expend a use of Rage to use this feature again"
                ])
            },
            "cold" : {
                name : "Breath of the Dragon",
                description : desc([
                    "As an action, I can force creatures in an adjacent 30-foot cone to make a Dex save against my Exploit DC. On a fail, creatures take 8d6 cold damage (half on save).",
                    "When I have no uses left, I can expend a use of Rage to use this feature again"
                ])
            },
            "poison" : {
                name : "Breath of the Dragon",
                description : desc([
                    "As an action, I can force creatures in an adjacent 30-foot cone to make a Dex save against my Exploit DC. On a fail, creatures take 8d6 poison damage (half on save).",
                    "When I have no uses left, I can expend a use of Rage to use this feature again"
                ])
            },
            "acid" : {
                name : "Breath of the Dragon",
                description : desc([
                    "As an action, I can force creatures in an adjacent 30-foot cone to make a Dex save against my Exploit DC. On a fail, creatures take 8d6 acid damage (half on save).",
                    "When I have no uses left, I can expend a use of Rage to use this feature again"
                ]),
            },
            "thunder" : {
                name : "Breath of the Dragon",
                description : desc([
                    "As an action, I can force creatures in an adjacent 30-foot cone to make a Dex save against my Exploit DC. On a fail, creatures take 8d6 thunder damage (half on save).",
                    "When I have no uses left, I can expend a use of Rage to use this feature again"
                ]),
            },
            "lightning" : {
                name : "Breath of the Dragon",
                description : desc([
                    "As an action, I can force creatures in an adjacent 30-foot cone to make a Dex save against my Exploit DC. On a fail, creatures take 8d6 lightning damage (half on save).",
                    "When I have no uses left, I can expend a use of Rage to use this feature again"
                ]),
            },
            "radiant" : {
                name : "Breath of the Dragon",
                description : desc([
                    "As an action, I can force creatures in an adjacent 30-foot cone to make a Dex save against my Exploit DC. On a fail, creatures take 8d6 radiant damage (half on save).",
                    "When I have no uses left, I can expend a use of Rage to use this feature again"
                ]),
            },
            "necrotic" : {
                name : "Breath of the Dragon",
                description : desc([
                    "As an action, I can force creatures in an adjacent 30-foot cone to make a Dex save against my Exploit DC. On a fail, creatures take 8d6 necrotic damage (half on save).",
                    "When I have no uses left, I can expend a use of Rage to use this feature again"
                ]),
            },
            "psychic" : {
                name : "Breath of the Dragon",
                description : desc([
                    "As an action, I can force creatures in an adjacent 30-foot cone to make a Dex save against my Exploit DC. On a fail, creatures take 8d6 psychic damage (half on save).",
                    "When I have no uses left, I can expend a use of Rage to use this feature again"
                ]),
            },
            "force" : {
                name : "Breath of the Dragon",
                description : desc([
                    "As an action, I can force creatures in an adjacent 30-foot cone to make a Dex save against my Exploit DC. On a fail, creatures take 8d6 force damage (half on save).",
                    "When I have no uses left, I can expend a use of Rage to use this feature again"
                ])
            },
        },
        "subclassfeature14" : {
            name : "Draconic Wings",
            source : [["GMB:LL", 0]],
            minlevel : 14,
            description : desc([
                "As a bonus action, I can manifest or dismiss a pair of draconic wings",
                "These wings grant me a fly speed equal to my walk speed",
                "Clothing that is not made to accommodate my wings is destroyed when I manifest them"
            ]),
            action : [["bonus action", " (manifest/dismiss)"]],
            speed : {
                fly : { spd : "walk", enc : 0 }
            },
        }
    }
});

FeatsList["alternate savage attacker"] = {
    name : "Alternate Savage Attacker",
    source : [["GMB:LL", 0]],
    descriptionFull : "Your savage battle instincts let you exploit even the smallest weakness. You gain the following benefits:\nOnce per turn when you roll damage for a melee weapon attack, you can reroll the weapon's damage dice and use either total.\nWhen you score a critical hit with a melee weapon attack you roll one additional weapon damage die.",
    description : "Once per turn, when I roll damage for a melee weapon attack, I can reroll the weapon's damage dice and use either total. When I score a critical hit with a melee weapon attack I roll one additional weapon damage die.",
    calcChanges : {
        atkAdd : [
            function (fields, v) {
                if (v.isMeleeWeapon) {
                    var pExtraCritM = 1;
                    var extraCritRegex = /\d+(d\d+ extra on a crit(ical)?( hit)? in melee)/i;
                    v.extraCritM = (v.extraCritM ? v.extraCritM : 0) + pExtraCritM;

                    if (extraCritRegex.test(fields.Description)) {
                        fields.Description = fields.Description.replace(extraCritRegex, v.extraCritM + '$1');
                    } else if ((/d\d/).test(fields.Damage_Die)) {
                        fields.Description += (fields.Description ? '; ' : '') + v.extraCritM + fields.Damage_Die.replace(/.*(d\d+).*/, '$1') + ' extra on a crit in melee';
                    }
                }
            },
            "When I score a critical hit with a melee weapon attack I roll one additional weapon damage die.",
            900
        ]
    }
};

FeatsList["intimidating leader"] = {
    name : "Intimidating Leader",
    source : [["GMB:LL", 0]],
    descriptionFull : "You use fear and intimidation to rally those who follow you into battle. You gain the following benefits:\nYou can increase your Strength, Constitution, or Charisma score by 1, up to a maximum of 20.\nWhen a creature other than yourself, that can see or hear you within 30 feet, fails a saving throw to resist being charmed or frightened, you can use a reaction to make a Charisma (Intimidation) check against the save DC of the effect that caused the creature to be charmed or frightened. On a successful check, the target is no longer charmed or frightened.",
    description : "When a creature other than me within 30 ft fails a save against charmed/frightened, I can use my reaction to make a Charisma (Intimidation) check against the DC of that save. On a success, the target is no longer charmed or frightened. " + "[+1 " + (typePF ? "Str, Con or Cha" : "Strength, Constitution or Charisma") + "]",
    prerequisite : "Proficiency in Intimidation",
    prereqeval : function(v) {
        return v.skillProfs.indexOf("Intimidation") !== -1;
    },
    action: [["reaction", ""]],
    scorestxt : "+1 Strength, Constitution or Charisma"
};

FeatsList["overwhelming strength"] = {
    name : "Overwhelming Strength",
    source : [["GMB:LL", 0]],
    descriptionFull : "Your sheer physical might dwarfs that of nearly all other mortal creatures. You gain the following benefits: \nIncrease your Strength by 1, to a maximum of 20.\nWhenever you make a Strength-based ability check, you can treat a roll of 7 or lower on the d20 as an 8.\nYou count as one size larger for the purposes of your carrying capacity, the weight you can push, pull, lift, or drag, and for the size of creatures you can attempt to grapple.",
    description : "When I make a Strength-based check, I can treat a roll of 7 or lower on the d20 as an 8. I count as one size larger for the purposes of carrying capacity, the weight I can push, pull, lift, or drag, and for the size of creatures I can attempt to grapple. " + "[+1 Strength]",
    scores : [1, 0, 0, 0, 0, 0]
};

FeatsList["savage training"] = {
    name : "Savage Training",
    source : [["GMB:LL"]],
    descriptionFull : "You have studied combat techniques that allow you to perform Savage Exploits. You gain the following benefits: You learn two 1st-degree Savage Exploits of your choice from those available to the Alternate Barbarian. If an Exploit you use requires the target to make a saving throw to resist the effects, the DC is equal to 8 + your proficiency bonus + your Strength or Dexterity modifier (your choice). You gain two d4 Exploit Dice to fuel your Exploits. An Exploit Die is expended when you use it. You regain all of your Exploit Dice when you finish a short or long rest. If you already have Exploit Dice from another source, you only gain one Exploit Die equal to your other Exploit Dice.",
    description : "",
    calculate : "event.value = 'I learn two maneuvers of my choice from those available to the Barbarian (2nd page \"Choose Feature\" button). The saving throw DC for this is ' + (8 + Number(How('Proficiency Bonus')) + Math.max(Number(What('Str Mod')), Number(What('Dex Mod')))) + ' (8 + proficiency bonus + Str/Dex mod). I gain two (only one if already have Exploit Die) Exploit dice (d4), which I regain when I finish a short rest.';",
    bonusClassExtrachoices : [{
        "class" : "barbarian(laserllama)",
        "feature" : "savage exploits",
        "bonus" : 2
    }],
    choices : ["Barbarian", "Not a barbarian"],
    selfChoosing : function () { // This function does not take into account other sources of exploit die, since this sheet is only about alt Barbarian
        if (classes.known["barbarian(laserllama)"] && classes.known["barbarian(laserllama)"].level >= 2) { 
            return "barbarian" 
        } else { 
            return "not a barbarian"
        };
    },
    "barbarian" : {
        name : "Savage\u200A Training", // The special character is there to differentiate the feat versions
        description : "",
        calculate : "event.value = 'I learn two maneuvers of my choice from those available to the Barbarian (2nd page \"Choose Feature\" button). The saving throw DC for this is ' + (8 + Number(How('Proficiency Bonus')) + Math.max(Number(What('Str Mod')), Number(What('Dex Mod')))) + ' (8 + proficiency bonus + Str/Dex mod). I gain one more Exploit die, which I regain when I finish a short rest.';",
        extraLimitedFeatures : [{
            name : "Exploit Dice",
            usages : 1,
            recovery : "short rest",
            addToExisting : true
        }]
    },
    "not a barbarian" : {
        name : "Savage\u200A\u200A Training",
        description : "",
        calculate : "event.value = 'I learn two maneuvers of my choice from those available to the Barbarian (2nd page \"Choose Feature\" button). The saving throw DC for this is ' + (8 + Number(How('Proficiency Bonus')) + Math.max(Number(What('Str Mod')), Number(What('Dex Mod')))) + ' (8 + proficiency bonus + Str/Dex mod). I gain two Exploit dice (d4), which I regain when I finish a short rest.';",
        extraLimitedFeatures : [{
            name : "Exploit Dice",
            usages : 2,
            additional : 'd4',
            recovery : "short rest",
            addToExisting : true
        }]
    },
};