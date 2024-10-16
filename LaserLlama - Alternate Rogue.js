/*  -WHAT IS THIS?-
    This file adds optional material to "MPMB's Character Record Sheet" found at https://www.flapkan.com/download#charactersheets
    Import this file using the "Add Extra Materials" bookmark.

    -KEEP IN MIND-
    It is recommended to enter the code in a fresh sheet before adding any other information (i.e. before making your character with it).
    This script requires importing the Common attributes first!
	
    -INFORMATION-
    Subject:    Alternate Rogue

    Effect:     This script adds the Alternate Rogue class (Version 2.1.1) published by Laserllama in GM Binder under the Fan Content policy.
    			Laserllama: https://www.gmbinder.com/profile/laserllama
    			Alternate Rogue: https://www.gmbinder.com/share/-N8o6KduyOA2qhUGBQqA
    			Alternate Rogue expanded: https://www.gmbinder.com/share/-NJ8-9uVQcpeQLxLx5RS

    Sheet:      v13.0.06 and newer
 
    Code by:    Original script by CalypsoMoonlace
*/


// Meta information
var iFileName = "LaserLlama - Rogue.js";
RequiredSheetVersion("13.0.6");

// Check that exploits are properly imported
try {
    var test = SpellsList["disarm"].isExploit
} catch (error) {
    throw new Error("Please import the 'Laserllama - Common attributes.js' file before importing this file as otherwise it cannot function properly. You can get it on the github repository.");
}

// Edit official rogue regex to avoid conflict with laserllama rogue
if(ClassList["rogue"]) {
    ClassList["rogue"].regExpSearch = /^(?=.*rogue)(?!.*laserllama).*$/i
};

// Utility function
function CreateDeviousSpellsheet() {
    // This function is called by different eval attributes and is required before EACH USE OF spellcastingBonusElsewhere
    // The reason for that is an edge case: if the player has the sheet created by picking exploits, then removes those picks, the spellsheet is entirely removed

    // Defining the Rogue spell sheet - also known as Devious exploits
    if (!CurrentSpells["devious exploits"]) {
        CurrentSpells["devious exploits"] = {
            name : "Devious Exploits",
            shortname : "Devious Exploits",
            ability: 2,
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
            eval: CreateDeviousSpellsheet,
            spellcastingBonusElsewhere : {
                addTo : "devious exploits",
                spellcastingBonus : {
                    name : subclass_name +  " Exploits",
                    spellcastingAbility : 4,
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
    // pre: tempSpell is the key of an item from SpellsList, class_name is a class name (daring today aren't we) eg "fighter"
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

// Main class
ClassList["rogue(laserllama)"] = {
    name : "Rogue(Laserllama)",
    regExpSearch : /^(?=.*rogue)(?=.*laserllama).*$/i,
    source : ["GMB:LL", 0],
    primaryAbility : "Rogue: Dexterity",
    prereqs : "Dexterity 13",
    improvements : [0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 5, 5],
    die : 8,
    abilitySave : 2, // for devious exploits
    abilitySaveAlt : 1,
    spellcastingFactor : "warlock99", // Required for the "create a complete spell sheet" option; using the warlock option ensures it doesn't clash with multiclassing
    saves : ["Int", "Dex"],
    skillstxt :{
        primary : "Choose four from Acrobatics, Athletics, Deception, Insight, Intimidation, Investigation, Perception, Performance, Persuasion, Sleight of Hand, and Stealth",
        secondary : "Choose one from Acrobatics, Athletics, Deception, Insight, Intimidation, Investigation, Perception, Performance, Persuasion, Sleight of Hand, or Stealth"
    },
    toolProfs : {
        primary : [["Any tool", 1]],
        secondary : [["Any tool", 1]],
    },
    armorProfs : {
        primary : [true, false, false, false],
        secondary : [true, false, false, false]
    },
    weaponProfs : {
        // Simple weapons, blowguns, hand crossbows, scimitars, shortswords, rapiers, and whips
        primary : [true, false, ["blowgun", "hand crossbow", "scimitar", "shortsword", "rapier", "shortsword", "whip"]]
    },
    equipment : "Rogue starting equipment:" +
        "\n \u2022 A rapier -or- a scimitar -or- a shortsword;" +
        "\n \u2022 A shortbow and a quiver of 20 arrows -or- a shortsword;" +
        "\n \u2022 A burglar's pack -or- dungeoneer's pack" +
        "\n \u2022 Leather armor, two daggers, and a set of tools of your choice." +
        "\n\nAlternatively, choose 4d4 \xD7 10 gp worth of starting equipment instead of both the class' and the background's starting equipment.",
    subclasses : ["Roguish Archetype", []],
    attacks : [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    features : {
        "expertise" : function() {
            var a = {
                name : "Expertise",
                source : ["GMB:LL", 0],
                minlevel : 1,
                description : desc("I gain expertise with skills/tools I am proficient with"),
                skillstxt : "Expertise with any skill proficiencies and/or tools (see lvl1 rogue feature)",
                additional : levels.map(function (n) {
                    return "with " + (n < 6 ? 2 : n < 11 ? 3 : n < 15 ? 4 : n < 20 ? 5 : 6) + " skills";
                }),
                extraname : "Expertise",
                extrachoices : ["Acrobatics", "Animal Handling", "Arcana", "Athletics", "Deception", "History", "Insight", "Intimidation", "Investigation", "Medicine", "Nature", "Perception", "Performance", "Persuasion", "Religion", "Sleight of Hand", "Stealth", "Survival", "Thieves' Tools"],
                extraTimes : levels.map(function (n) { return (n < 6 ? 2 : n < 11 ? 3 : n < 15 ? 4 : n < 20 ? 5 : 6); }),
                "thieves' tools" : {
                    name : "Thieves' Tools Expertise", description : "",
                    source : [["SRD", 39], ["P", 96]],
                    prereqeval : function(v) {
                        if ((/thieve.?s.*tools/i).test(What('Too Text')) && tDoc.getField("Too Prof").isBoxChecked(0)) {
                            return tDoc.getField("Too Exp").isBoxChecked(0) ? "markButDisable" : true;
                        } else {
                            return CurrentProfs.tool["thieves' tools"] || (/thieve.?s.{1,3}tools/i).test(v.toolProfs.toString());
                        }
                    },
                    eval : function () {
                        if ((/thieve.?s.*tools/i).test(What('Too Text'))) {
                            Checkbox('Too Exp', true);
                        };
                    },
                    removeeval : function () {
                        if ((/thieve.?s.*tools/i).test(What('Too Text'))) {
                            Checkbox('Too Exp', false);
                        };
                    }
                }
            }
            for (var i = 0; i < a.extrachoices.length; i++) {
                var attr = a.extrachoices[i].toLowerCase();
                if (a[attr]) continue;
                a[attr] = {
                    name : a.extrachoices[i] + " Expertise",
                    description : "",
                    source : a.source,
                    skills : [[a.extrachoices[i], "only"]],
                    prereqeval : function(v) {
                        return v.skillProfsLC.indexOf(v.choice) === -1 ? false : v.skillExpertiseLC.indexOf(v.choice) === -1 ? true : "markButDisable";
                    }
                }
            }
            return a;
        }(),
        "sneak attack" : {
            name : "Sneak Attack",
            source : ["GMB:LL", 0],
            minlevel : 1,
            description : desc([
                "Once per turn, I can add damage to a finesse/ranged weapon attack if I have advantage",
                "I don't need adv. if the target has a conscious enemy within 5 ft and I don't have disadv."
            ]),
            additional : levels.map(function (n) {
                return Math.ceil(n / 2) + "d6";
            }),
            calcChanges : {
                atkAdd : [
                    function (fields, v) {
                        if (classes.known["rogue(laserllama)"] && classes.known["rogue(laserllama)"].level && !v.isSpell && !v.isDC && (v.isRangedWeapon || (/\bfinesse\b/i).test(fields.Description))) {
                            v.sneakAtk = Math.ceil(classes.known["rogue(laserllama)"].level / 2);
                            fields.Description += (fields.Description ? '; ' : '') + 'Sneak attack ' + v.sneakAtk + 'd6';
                        };
                    },
                    "Once per turn, when I attack with a ranged or finesse weapon while I have advantage or an conscious ally is within 5 ft of the target, I can add my sneak attack damage to the attack.",
                    700
                ]
            }
        },
        "thieves cant" : {
            name : "Thieves' Cant",
            source : ["GMB:LL", 0],
            minlevel : 1,
            description : desc("I know the secret rogue language that I can use to convey messages inconspicuously"),
            languageProfs : ["Thieves' Cant"]
        },
        "cunning action" : {
            name : "Cunning Action",
            source : ["GMB:LL", 0],
            minlevel : 2,
            description : desc("I can use a bonus action to take the Dash, Disengage, Hide or Use an Object action"),
            additional : levels.map(function (n) {
                return n < 2 ? "" : n < 6 ? "2 options" : "4 options";
            }),
            extraname : "Cunning Action",
            extrachoices : ["Dash","Disengage","Hide","Use an Object"],
            extraTimes : levels.map(function (n) {
                return n < 2 ? 0 : n < 6 ? 2 : 4;
            }),
            "dash" : {
                name: "Dash",
                description : desc("I can use a bonus action to take the Dash action"),
                action : [["bonus action", ""]]
            },
            "disengage" : {
                name: "Disengage",
                description : desc("I can use a bonus action to take the Disengage action"),
                action : [["bonus action", ""]]
            },
            "hide" : {
                name: "Hide",
                description : desc("I can use a bonus action to take the Hide action"),
                action : [["bonus action", ""]]
            },
            "use an object" : {
                name: "Use an Object",
                description : desc("I can use a bonus action to take the Use an Object action"),
                action : [["bonus action", ""]]
            }
        },
        "devious exploits": function(){

            // Fixed attributes
            ClassExploitFeature = {
                name : "Devious Exploits",
                minlevel : 2,
                source : [["GMB:LL", 0]],
                description : desc(["I gain Exploit Dice, which are used to fuel my Devious Exploits", "Use the \"Choose Feature\" button above to choose Devious Exploits"]),
                toNotesPage : [{
                    name : "Devious Exploits",
                    note : desc(["Below are all Devious Exploits I know. Each 3rd and 4th degree exploits can only be used once per short rest. Each 5th degree exploit can only be used once per long rest."])
                }],

                // Devious Exploits
                extraname : "Devious Exploits",
                extraTimes : ['', 2, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8],
                extrachoices : [],
                limfeaname : "Exploit Dice",

                // Exploit dice
                usages : ['', 2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5],
                additional : ['', "d4", "d4", "d4", "d6", "d6", "d6", "d6", "d6", "d6", "d8", "d8", "d8", "d8", "d8", "d8", "d10", "d10", "d10", "d10"],
                recovery : "short rest",

                // Eval
                eval: CreateDeviousSpellsheet
            }

            // Make a filtered spell list that contains only "spells" for this class
            const ClassExploits = Object.keys(SpellsList).filter((key) => SpellsList[key].isExploit).filter((key) => {
                for (var i = 0; i < SpellsList[key].classes.length; i++) {
                    if (SpellsList[key].classes[i] == "rogue(laserllama)") return true;
                }
                return false;
                // NOTE: this is literally a SpellsList[key].classes.includes(...) but for some cursed reason I can't use that function
            });
            
            // Iterate over all exploits available to this class
            for (var i = 0; i < ClassExploits.length; i++) {
                var NewSpell = SpellsList[ClassExploits[i]];

                ClassExploitFeature.extrachoices.push(NewSpell.name); // Add "spell" name to menu options

                ClassExploitFeature[ClassExploits[i]] = { // Add "spell" to the main item (when it is picked through the menu)
                    name: NewSpell.name,
                    toNotesPage : [{ // What is added to the notes page
                        name : NewSpell.name + " Exploit [" + (NewSpell.level == 1 ? '1st' : NewSpell.level == 2 ? '2nd' : NewSpell.level == 3 ? '3rd': NewSpell.level + 'th') + " degree]",
                        note : desc(NewSpell.descriptionFull),
                        amendTo : "Devious Exploits"
                    }],
                    source: NewSpell.source,
                    addMod: NewSpell.addMod,
                    submenu: NewSpell.submenu,
                    prereqeval: ExploitPrereqFactory(ClassExploits[i], "rogue(laserllama)"),
                    eval: CreateDeviousSpellsheet,
                    spellcastingBonusElsewhere : {
                        addTo : "devious exploits",
                        spellcastingBonus : {
                            name : "Devious Exploits",
                            spellcastingAbility : 4,
                            spells : [ClassExploits[i]],
                            selection : [ClassExploits[i]]
                        }
                    }
                }
            }

            return ClassExploitFeature;
        }(),
        "subclassfeature3" : {
            name : "Roguish Archetype",
            source : ["GMB:LL", 0],
            minlevel : 3,
            description : desc('Choose a Roguish Archetype you strive to emulate and put it in the "Class" field ')
        },
        "uncanny dodge" : {
            name : "Uncanny Dodge",
            source : ["GMB:LL", 0],
            minlevel : 5,
            description : desc("As a reaction, I can halve the damage of an attack from an attacker that I can see"),
            action : ["reaction", ""]
        },
        "cunning strike" : {
            name : "Cunning Strike",
            source : ["GMB:LL", 0],
            minlevel : 5,
            description : desc([
                "When I add my Sneak Attack bonus to a damage roll, I can forgo some of the bonus to use a Devious Exploit I know without expending an Exploit Die, with the following rules:",
                "\u2022 It must be a Devious Exploit that I know that can be used as part of a weapon attack",
                "\u2022 I reduce my Sneak Attack bonus damage by a number of d6s equal to the Exploit's degree",
                "\u2022 If the Exploit normally deals additional damage, it does not deal any additional damage when used in this way"
                ])
        },
        "evasion" : {
            name : "Evasion",
            source : ["GMB:LL", 0],
            minlevel : 9,
            description : desc("My Dexterity saves negate damage on success and halve it on failure"),
            savetxt : { text : ["Dex save: fail \u2015 half dmg, success \u2015 no dmg"] }
        },
        "reliable talent" : {
            name : "Reliable Talent",
            source : ["GMB:LL", 0],
            minlevel : 10,
            description : desc("If I make an ability check where I add my Proficiency Bonus or add my Exploit Die, I can treat a roll of 9 or lower on the d20 as a 10")
        },
        "blindsense" : {
            name : "Blindsense",
            source : ["GMB:LL", 0],
            minlevel : 14,
            description : levels.map(function (n) {
                    if (n < 14) return "";
                    if (n < 20) return desc("With my hearing, I can locate hidden or invisible creatures that are within 10 ft of me");
                    return desc("With my hearing, I can locate hidden or invisible creatures that are within 30 ft of me");
                }),
            vision : [["Blindsense", 10]]
        },
        "slippery mind" : {
            name : "Slippery Mind",
            source : ["GMB:LL", 0],
            minlevel : 15,
            description : desc("I can add one roll of my Exploit Die to any Intelligence, Wisdom or Charisma saving throw"),
            savetxt : { text : ["Add Expl Die to Int, Wis, and Cha saves"] }
        },
        "elusive" : {
            name : "Elusive",
            source : ["GMB:LL", 0],
            minlevel : 18,
            description : desc("Attackers cannot gain advantage on attacks vs. me, unless I am incapacitated")
        },
        "stroke of luck" : {
            name : "Stroke of Luck",
            source : ["GMB:LL", 0],
            minlevel : 20,
            description : desc("I can turn any roll on the d20 into a natural 20. I can do so after I know the result of my roll and whether I succeed or fail."),
            recovery : "short rest",
            usages : 1,
            vision : [["Blindsense", 30]]
        }
    }
}

// Add part of the linguist feat as variant from thieves cant
var Linguist_variant = {
    name : "Secret Ciphers",
    source : [["GMB:LL", 0]],
    description : desc("I can create written ciphers. Others can't decipher a code I create unless I teach them, they succeed on an Intelligence check (DC equal to my Intelligence score + my proficiency bonus), or they use magic to decipher it.")
}
CreateClassFeatureVariant("rogue(laserllama)","thieves cant","Secret Ciphers", Linguist_variant);


// Inquisitive
AddSubClass("rogue(laserllama)", "inquisitive", {
    regExpSearch : /inquisitive/i,
    subname : "Inquisitive",
    fullname : "Inquisitive",
    source : [["GMB:LL", 0]],
    abilitySaveAlt : 4,
    features : { 
        "subclassfeature3" : GetSubclassExploits("Inquisitive", ["inquisitive eye", "precision strike", "exposing strike", "survey dungeon", "survey settlement"]),
        "subclassfeature3.1" : {
            name : "Eye for Detail",
            source : [["GMB:LL", 0]],
            minlevel : 3,
            description : desc(["I can make Insight and Perception checks using Intelligence instead of Wisdom",
                "When I take the Search action, I gain information as if I had spent 10 minutes searching",
                "I can take the Search action as a bonus action"]),
            addMod : [
                { type : "skill", field : "Insight", mod : "max(Int-Wis|0)", text : "I can replace Wisdom (Insight) checks with Intelligence (Insight)" },
                { type : "skill", field : "Perception", mod : "max(Int-Wis|0)", text : "I can replace Wisdom (Perception) checks with Intelligence (Perception)" }
            ],
            action : [["bonus action", "Search"]]
        },
        "subclassfeature3.2" : {
            name : "Predictive Fighting",
            source : [["GMB:LL", 0]],
            minlevel : 3,
            description : levels.map(function (n) {
                if (n < 17) {
                    return desc([
                        "As a bonus action, I can observe the tactics of another within 30 ft",
                        "I have to make a Wisdom (Insight) check vs. the target's Charisma (Deception) check",
                        "If I succeed, I can use my sneak attack on it even if I don't have adv. (but not if disadv.)",
                        "This benefit lasts for 1 minute or until I successfully use Insightful Fighting again"
                    ])
                }

                return desc([
                    "As a bonus action, I can observe the tactics of another within 30 ft",
                    "I have to make a Wisdom (Insight) check vs. the target's Charisma (Deception) check",
                    "If I succeed, I can use my sneak attack on it even if I don't have adv. (but not if disadv.)",
                    "Additionally, I roll d8s instead of d6s for my Sneak Attack on this target",
                    "This benefit lasts for 1 minute or until I successfully use Insightful Fighting again"
                ])
            }),
            action : ["bonus action", ""]
        },
        "subclassfeature7" : {
            name : "Insightful Strike",
            source : [["GMB:LL", 0]],
            minlevel : 7,
            description : desc(["I can use Cunning Strike to reduce my Sneak attack damage by 2d6", 
                "When I do so, the DM tells me one of: its highest ability score, its lowest ability score, Armor Class, one of its movement speeds, or one of its special senses."])
        },
        "subclassfeature13" : {
            name : "Adept Investigator",
            source : [["GMB:LL", 0]],
            minlevel : 13,
            description : desc(["I can use Survey Dungeon and Survey Settlement a certain amount of times without expending an Exploit Die",
                "Also, it takes me less time to use those and I learn more information equal to my Int mod"]),
            usages : "Int mod per ",
            usagescalc : "event.value = Math.max(1, What('Int Mod'));",
            recovery : "long rest",
            calcChanges : {
                spellAdd : [
                    function (spellKey, spellObj, spName) {
                        if (spellKey == "survey dungeon") {
                            spellObj.time = "1 min";
                            return true;
                        };

                        if (spellKey == "survey settlement") {
                            spellObj.time = "10 min";
                            return true;
                        };
                    },
                    "It only takes you 1 minute to use survey dungeon and 10 minutes to use survey settlement, and whenever you use these Exploits you learn a number of additional pieces of information equal to your Intelligence modifier (minimum of 1)."
                ]
            },
        },
        "subclassfeature13.1" : {
            name : "Unerring Sight",
            source : [["GMB:LL", 0]],
            minlevel : 13,
            description : levels.map(function (n) {
                var UnerringSightRange = (n < 14 ? 10 : n < 20 ? 20 : 30);

                return desc(["I gain "+UnerringSightRange+" ft Truesight and have adv. on Insight and Investigation checks within that radius"])
            }),
            changeeval : function(lvl, chc) {
                var srcNm = "Unerring Sight";
                var curRange = CurrentProfs.vision.truesight && CurrentProfs.vision.truesight.ranges[srcNm];
                var newRange = (lvl[1] < 13 ? 0 : lvl[1] < 14 ? 10 : lvl[1] < 20 ? 20 : 30);

                // Only do something if the range changed
                if (curRange !== newRange) {
                    // First remove the old range, if any
                    if (curRange) SetProf('vision', false, "Truesight", srcNm, curRange);
                    // Then set the new range, unless the feature is removed (i.e. lvl[1] === 0)
                    if (newRange) SetProf('vision', true,  "Truesight", srcNm, newRange);
                }
            }
        }
    }
})

// Seeker
AddSubClass("rogue(laserllama)", "seeker", {
    regExpSearch : /seeker/i,
    subname : "Seeker",
    fullname : "Seeker",
    source : [["GMB:LL", 0]],
    abilitySaveAlt : 4,
    features : { 
        "subclassfeature3" : GetSubclassExploits("Seeker", ["modify device", "scholarly recall", "exposing strike", "survey dungeon", "forgotten knowledge"]),
        "subclassfeature3.1" : {
            name : "Relic Hunter",
            source : [["GMB:LL", 0]],
            minlevel : 3,
            description : desc(["I learn two languages and gain proficiency in History. If I spend at least 10 minutes touching and examining an object, I can ascertain its civilization of origin and its approximate age."]),
            skills : ["History"],
            languageProfs : [2]
        },
        "subclassfeature3.2" : {
            name : "Relic Magic",
            source : [["GMB:LL", 0]],
            minlevel : 3,
            description : desc([
                "I gain an amount of relics (Tiny objects) who contain a cantrip or ritual of 2nd level or lower", 
                "While I have a Relic on me, I can cast the cantrip or the ritual version of the spell within",
                "Those spells cannot be changed and I cast those spell with my Intelligence stat"
            ]),
            additional : "1 + Intelligence modifier",
            eval : function () {
                var rSpells = CreateSpellList({"class" : "any", level : [1,2], ritual : true}); // an array of ritual spells 1-2 lvl
                var oCantrips = CreateSpellList({"class" : "any", level : [0,0]}); // an array of cantrips
                var cSpellsCantrips = rSpells.concat(oCantrips); // combines both arrays
                
                // name of your feature
                CurrentSpells['relic magic'] = {
                    name : 'Relic Magic',
                    ability : 4, 
                    list : { spells : cSpellsCantrips }, 
                    typeList : 4,
                    refType : "class",
                    allowUpCasting : false,
                    firstCol : "", // allows to have a spell "prepared"
                    bonus : {}
                };
                SetStringifieds('spells'); CurrentUpdates.types.push('spells');
            },
            removeeval : function () { 
                // Delete and remove the CurrentSpells object
                delete CurrentSpells['relic magic'];
                SetStringifieds('spells'); CurrentUpdates.types.push('spells');
            }
        },
        "subclassfeature7" : function(){

            // Fixed attributes
            ElderRelics = { 
                name : "Elder Relics",
                source : [["GMB:LL", 0]],
                minlevel : 7,
                description : desc(["I gain an Elder Relic, who has stronger effects than a regular Relic"]),
                extraname : "Elder Relics",
                extraTimes : levels.map( function(n) {
                    if (n < 7) return 0;
                    return 1;
                }),
                // NOTE: this levels.map function is just so the user sees how many Elder Relics they can pick
                // If extraTimes = 1, then it never shows the "selected x of y"
                // This is relevant because of the lvl 13 subclass feature
                extrachoices : []
            }

            // Add channel divinities
            ClericSubclasses = ClassList.cleric.subclasses[1];
            
            for (var i = 0; i < ClericSubclasses.length; i++) {
                subclass = ClericSubclasses[i];
                NewChanDiv = ClassSubList[subclass].features["subclassfeature2"];

                if (ElderRelics[NewChanDiv.name.toLowerCase()]) {
                    continue; // ChanDiv is already added, adding duplicates causes bugs
                }

                ElderRelics.extrachoices.push(NewChanDiv.name)
                ElderRelics[NewChanDiv.name.toLowerCase()] = { // notice the lowercase
                    name: NewChanDiv.name,
                    source: NewChanDiv.source,
                    description: NewChanDiv.description.replace("cleric level","rogue level"),
                    action: NewChanDiv.action,
                    additional: NewChanDiv.additional,
                    usages: 1,
                    recovery: "short rest",
                    submenu: "Channel Divinity"
                }
            }

            // Add Eldritch Invocations
            ElderRelics.extrachoices.push("Eldritch Invocation");
            ElderRelics["eldritch invocation"] = {
                name: "Eldritch Invocation",
                source: [["GMB:LL", 0]],
                description: desc("I learn one Eldritch Invocation of my choice, using my rogue level for prerequesites (TODO)"),
                bonusClassExtrachoices : [{
                    "class" : "warlock",
                    feature : "eldritch invocations",
                    bonus : 1
                }]
            }

            // Add 2 < x <= 5th level rituals
            var GreaterRituals = CreateSpellList({"class" : "any", level : [3,5], ritual : true}); // an array of ritual spells 3-5 lvl
            for (var i = 0; i < GreaterRituals.length; i++) {
                NewSpell = SpellsList[GreaterRituals[i]];

                ElderRelics.extrachoices.push(NewSpell.name)
                ElderRelics[NewSpell.name.toLowerCase()] = { // notice the lowercase
                    name: NewSpell.name,
                    source: NewSpell.source,
                    description: desc("I learn the " + NewSpell.name + " spell but can only cast it as ritual with the Elder Relic"),
                    spellcastingBonusElsewhere : {
                        addTo : "relic magic",
                        spellcastingBonus : {
                            name : "Elder Relic",
                            spellcastingAbility : 4,
                            spells : [GreaterRituals[i]],
                            selection : [GreaterRituals[i]],
                            prepared : true
                        }
                    },
                    submenu: "Greater Ritual"
                }
            }

            return ElderRelics;
        }(),
        "subclassfeature7.1" : {
            name : "Expert Archaeologist",
            source : [["GMB:LL", 0]],
            minlevel : 7,
            description : desc(["I have adv. on any saving throw on traps; I can use modify device at will, if I have the tools", 
                "I have adv. on thieves' tools or tinker's tools checks I make to investigate or disarm a trap"]),
            savetxt : { adv_vs : ["traps"] },
            calcChanges : {
                spellAdd : [
                    function (spellKey, spellObj, spName) {
                        if (spellKey == "modify device") {
                            spellObj.firstCol = "atwill";
                            return true;
                        };
                    },
                    "I can use the Modify Device exploit at will without expending an Exploit Die"
                ]
            }
        },
        "subclassfeature13" : {
            name : "Greater Lore",
            source : [["GMB:LL", 0]],
            minlevel : 13,
            description : desc(["I gain more Elder Relics or Relics of my choice","I add my Intelligence modifier to any damaging cantrip I cast with a Relic"]),
            calcChanges: {
                atkCalc : [
                    function (fields, v, output) {
                        if (v.isSpell && (/\brelic\b/i).test(v.WeaponTextName)) output.modToDmg = true;
                    },
                    "I add my Intelligence modifier to any damaging cantrip I cast with a Relic"
                ]
            },
            choices: ["Greater Lore: 3 Elder Relics", "Greater Lore: 2 Elder Relics + 2 Relics","Greater Lore: 1 Elder Relic + 4 Relics",
                "Greater Lore: 0 Elder Relic + 6 Relics"],
            "greater lore: 3 elder relics": {
                name: "Greater Lore: 3 Elder Relics",
                description: desc(["I gain three additional Elder Relics of my choice","I add my Intelligence modifier to any damaging cantrip I cast with a Relic"]),
                bonusClassExtrachoices : [{
                    "class" : "rogue(laserllama)",
                    "subclass" : "rogue(laserllama)-seeker",
                    feature : "subclassfeature7",
                    bonus : 3
                }]
            },
            "greater lore: 2 elder relics + 2 relics": {
                name: "Greater Lore: 2 Elder Relics + 2 Relics",
                description: desc(["I gain two additional Elder Relics and two Relics of my choice","I add my Intelligence modifier to any damaging cantrip I cast with a Relic"]),
                bonusClassExtrachoices : [{
                    "class" : "rogue(laserllama)",
                    "subclass" : "rogue(laserllama)-seeker",
                    feature : "subclassfeature7",
                    bonus : 2
                }]
            },
            "greater lore: 1 elder relic + 4 relics": {
                name: "Greater Lore: 1 Elder Relic + 4 Relics",
                description: desc(["I gain one additional Elder Relic and four Relics of my choice","I add my Intelligence modifier to any damaging cantrip I cast with a Relic"]),
                bonusClassExtrachoices : [{
                    "class" : "rogue(laserllama)",
                    "subclass" : "rogue(laserllama)-seeker",
                    feature : "subclassfeature7",
                    bonus : 1
                }]
            },
           "greater lore: 0 elder relic + 6 relics": {
                name: "Greater Lore: 0 Elder Relic + 6 Relics",
                description: desc(["I gain six Relics of my choice","I add my Intelligence modifier to any damaging cantrip I cast with a Relic"])
            }
        },
        "subclassfeature17" : {
            name : "Ancient Lore",
            source : [["GMB:LL", 0]],
            minlevel : 17,
            description : desc(["I have adv. on saving throws I make to resist the effects of spells", 
                "I can change one of my Relic and Elder Relic by performing a 1h ritual (can be part of a rest)"]),
            savetxt : { adv_vs : ["spells"] }
        }
    }
})