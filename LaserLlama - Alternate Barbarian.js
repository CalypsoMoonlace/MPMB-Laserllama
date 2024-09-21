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
                    "My unarmed strikes deal bludgeoning damage equal to one roll of your Exploit Die",
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
                additional : ['', "d4", "d6", "d6", "d8", "d8", "d8", "d8", "d8", "d8", "d10", "d10", "d10", "d10", "d10", "d10", "d12", "d12", "d12", "d12"],
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