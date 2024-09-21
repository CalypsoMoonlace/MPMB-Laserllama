/*  -WHAT IS THIS?-
    This file adds optional material to "MPMB's Character Record Sheet" found at https://www.flapkan.com/download#charactersheets
    Import this file using the "Add Extra Materials" bookmark.

    -KEEP IN MIND-
    It is recommended to enter the code in a fresh sheet before adding any other information (i.e. before making your character with it).
    This script requires importing the Common attributes first!
	
    -INFORMATION-
    Subject:    Alternate Monk

    Effect:     This script adds the Alternate Monk class (Version 3.0.1) published by Laserllama in GM Binder under the Fan Content policy.
    			Laserllama: https://www.gmbinder.com/profile/laserllama
    			Alternate Monk: https://www.gmbinder.com/share/-MhGHvc1sNLoUrISINrV
    			Alternate Monk expanded: https://www.gmbinder.com/share/-MyVERQKKbawlJLVjpyo

    Sheet:      v13.0.06 and newer
 
    Code by:    Original script by CalypsoMoonlace
*/


// Meta information
var iFileName = "LaserLlama - Monk.js";
RequiredSheetVersion("13.0.6");

// Check that exploits are properly imported
try {
    var test = SpellsList["disarm"].isExploit
} catch (error) {
    throw new Error("Please import the 'Laserllama - Common attributes.js' file before importing this file as otherwise it cannot function properly. You can get it on the github repository.");
}

// Utility functions
function GetSubclassTechniques(subclass_name, techniques_list) {
	/* pre: subclass_name is a string
			techniques_list is an array of length 3
			1st technique is unlocked at lvl 3
			2nd technique is unlocked at lvl 5
			3rd technique is unlocked at lvl 9

		post: returns the subclassfeature that contains all the subclass techniques
	*/		

	// Create subclassfeature
	SubclassTechniques = {
		name : subclass_name +  " Techniques",
		source : [["GMB:LL", 0]],
		minlevel : 3,
		description : desc(["I learn additional Techniques who don't count against my total and can't be switched"]),
		autoSelectExtrachoices : [{
			extrachoice : techniques_list[0],
			minlevel : 3
		}, {
			extrachoice : techniques_list[1],
			minlevel : 5
		}, {
			extrachoice : techniques_list[2],
			minlevel : 9
		}]
	};

	// Copy techniques from the main class
	SubclassTechniques[techniques_list[0]] = newObj(ClassList["monk(laserllama)"].features["ki"][techniques_list[0]]);
	SubclassTechniques[techniques_list[1]] = newObj(ClassList["monk(laserllama)"].features["ki"][techniques_list[1]]);
	SubclassTechniques[techniques_list[2]] = newObj(ClassList["monk(laserllama)"].features["ki"][techniques_list[2]]);

	return SubclassTechniques;
}

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

// IMPORTANT NOTE: This is the same function as ExploitPrereqFactory BUT DegreeToMinLevel is different because it is for the BRAWLER SUBCLASS
function ExploitPrereqFactoryHalf(tempSpell, class_name) {
    // pre: tempSpell is the key of an item from SpellsList, class_name is a class name (daring today aren't we) eg "monk(laserllama)"
    // post: returns a prereqeval() function

    // spell has its own prereq
    if (SpellsList[tempSpell].prereqeval) {
        return function(v) {
            const DegreeToMinLevel = [0,3,7,15];
            return (classes.known[class_name].level >= DegreeToMinLevel[SpellsList[tempSpell].level]) && SpellsList[tempSpell].prereqeval(v);
        }
    }

    return function(v) {
        const DegreeToMinLevel = [0,3,7,15];
        return classes.known[class_name].level >= DegreeToMinLevel[SpellsList[tempSpell].level];
    }

}

// Main class
ClassList["monk(laserllama)"] = {
    name : "Monk(Laserllama)",
    regExpSearch : /^(?=.*monk)(?=.*laserllama).*$/i,
    source : ["GMB:LL", 0],
	primaryAbility : "Dexterity and Wisdom",
	abilitySave : 5,
	prereqs : "Dexterity 13 and Wisdom 13",
	die : 10,
	improvements : [0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 5, 5],
	saves : ["Str", "Dex"],
	toolProfs : {
		primary : [["Artisan's tool or musical instrument", 1]]
	},
	skillstxt : {
		primary : "Choose two from Acrobatics, Athletics, History, Insight, Nature, Religion, and Stealth"
	},
	armorProfs : {
		primary : [false, false, false, false]
	},
	weaponProfs : {
		primary : [true, false, ["shortsword"]],
		secondary : [true, false, ["shortsword"]]
	},
	equipment : "Monk starting equipment:" +
		"\n \u2022 A shortsword -or- any simple weapon;" +
		"\n \u2022 A shortbow and 20 arrows -or- 20 darts;" +
		"\n \u2022 A dungeoneer's pack -or- an explorer's pack;" +
		"\n \u2022 A holy symbol -or- a musical instrument." +
		"\n\nAlternatively, choose 5d4 gp worth of starting equipment instead of both the class' and the background's starting equipment.",
	subclasses : ["Monastic Tradition", []],
	attacks : [1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
	features : {
		"unarmored defense" : {
			name : "Unarmored Defense",
			source : ["GMB:LL"],
			minlevel : 1,
			description : desc("Without armor and no shield, my AC is 10 + Dexterity modifier + Wisdom modifier"),
			armorOptions : [{
				regExpSearch : /justToAddToDropDown/,
				name : "Unarmored Defense (Wis)",
				source : ["GMB:LL"],
				ac : "10+Wis",
				affectsWildShape : true
			}],
			armorAdd : "Unarmored Defense (Wis)"
		},
		"martial arts" : {
			name : "Martial Arts",
			source : ["GMB:LL"],
			minlevel : 1,
			description : desc([
				"Monk weapons: any melee weapon (not special/heavy) or unarmed strike",
				"With monk weapons, I can use Dex instead of Str and use the Martial Arts damage die",
				"When taking an Attack action with these, I get one unarmed strike as a bonus action",
				"I can replace Strength (Athletics) checks to grapple/shove with Dexterity (Athletics) checks"
			]),
			weaponsAdd : ["Unarmed Strike"],
			addMod : [
				{ type : "skill", field : "Athletics", mod : "max(Dex-Str|0)", text : "I can replace Strength (Athletics) checks to grapple/shove with Dexterity (Athletics) checks" }
			],
			additional : levels.map(function (n) {
				return "1d" + (n < 5 ? 6 : n < 11 ? 8 : n < 17 ? 10 : 12);
			}),
			action : [["bonus action", "Unarmed Strike (with Attack action)"]],
			eval : function() {
				AddString('Extra.Notes', 'Monk features:\n\u25C6 If I wear armor/shield, I lose Unarmored Defense, Martial Arts, and Unarmored Movement');
				show3rdPageNotes();
			},
			removeeval : function() {
				RemoveString('Extra.Notes', 'Monk features:\n\u25C6 If I wear armor/shield, I lose Unarmored Defense, Martial Arts, and Unarmored Movement');
			},
			calcChanges : {
				atkAdd : [
					function (fields, v) {
						if (classes.known["monk(laserllama)"] && classes.known["monk(laserllama)"].level && (v.theWea.monkweapon || v.baseWeaponName == "unarmed strike" || (v.isMeleeWeapon && (/simple|martial/i).test(v.theWea.type) && !(/heavy|special/i).test(fields.Description)))) {
							v.theWea.monkweapon = true;
							var aMonkDie = function (n) { return n < 5 ? 6 : n < 11 ? 8 : n < 17 ? 10 : 12; }(classes.known["monk(laserllama)"].level);
							try {
								var curDie = eval_ish(fields.Damage_Die.replace('d', '*'));
							} catch (e) {
								var curDie = 'x';
							};
							if (isNaN(curDie) || curDie < aMonkDie) {
								fields.Damage_Die = '1d' + aMonkDie;
							};
							if (fields.Mod === 1 || fields.Mod === 2 || What(AbilityScores.abbreviations[fields.Mod - 1] + " Mod") < What(AbilityScores.abbreviations[v.StrDex - 1] + " Mod")) {
								fields.Mod = v.StrDex;
							}
						};
					},
					"I can use either Strength or Dexterity and my Martial Arts damage die in place of the normal damage die for any 'Monk Weapons', which include unarmed strikes and any melee weapon that is not heavy or has the 'special' property.",
					5
				]
			}
		},
		"ki" : {
			name : "Ki",
			source : ["GMB:LL"],
			minlevel : 2,
			description : desc([
				"I can spend ki points to fuel special actions (see third page)",
				"I need to meditate for at least 30 min of a short rest for that short rest to restore ki",
				"I also learn techniques and can replace them when I gain a monk level (use \"Choose Feature\")",
				"I can only use one Technique per each attack, ability check, or saving throw"
			]),
			extraname : "Monk Techniques",
			extraTimes : ['', 3, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 9, 10, 10, 10],
			extrachoices : ["Arresting Strike","Crippling Strike","Empowered Strike","Mystic Healing", // no prereq
				"Patient Defense","Slow Fall","Step of the Wind","Improvised Strikes", "Spiritual Armor", "Whirling Strike", // no prereq
				"Deflect Missile", "Gentling Touch", "Seeking Strike", "Slowing Strike", "Stunning Strike", // prereq: lvl 5
				"Adept Fighting Style (Archery)", "Adept Fighting Style (Blind Warrior)", "Adept Fighting Style (Defense)", "Adept Fighting Style (Dueling)", "Adept Fighting Style (Featherweight)", "Adept Fighting Style (Thrown)", "Adept Fighting Style (Wrestler)", // prereq: lvl 5 & max one from this list
				"Crushing Strike", "Divine Light", "Unyielding Perseverance", // prereq: lvl 5
				"Aura Sight", "Heavenly Step", "Indomitable Spirit", "Mantle of Courtesy", // prereq: lvl 9
				"Commune with Self", "Friend of Beast and Leaf", "Monastic Fortitude", // prereq: lvl 9
				"Armor of the Ascetic", "Mystical Integrity", "Tongue of Sun and Moon", "Banishing Strike","Conjure Previous Life", // prereq: lvl 13
				"Empty Body", "Quivering Palm", "Awaken the Third Eye", "Word of Creation"], // prereq: lvl 18
			limfeaname : "Ki Points",
			usages : "Monk level + Wisdom modifier per ",
			// kiwarriorfeat = CurrentFeats.known.includes("ki warrior") ? 2 : 0
			// See for reference: https://canary.discord.com/channels/533350585706217494/863810547584467004/1267406407364509737 
			usagescalc : "kiwarriorfeat = 0;"
			+ "for (var i = 0; i < CurrentFeats.known.length; i++) { if (CurrentFeats.known[i] == 'ki warrior') kiwarriorfeat = 2 }"
			+ "event.value = Number(classes.known['monk(laserllama)'].level) + Number(What('Wis Mod')) + Number(kiwarriorfeat);",
			recovery : "short rest",
			"flurry of blows" : {
				name : "Flurry of Blows",
				extraname : "Ki Feature",
				source : ["GMB:LL"],
				description : desc("After taking the Attack action, I can make 2 unarmed attacks as a bonus action"),
				additional : "1 ki point",
				action : ["bonus action", " (after Attack action)"]
			},
			"arresting strike" : {
				name : "Arresting Strike",
				extraname : "Monk Technique",
				source : ["GMB:LL"],
				description : desc("On hit with melee Martial Arts attack, target makes Dex save or has speed reduced to 0"),
				additional : "1 ki point"
			},
			"crippling strike" : {
				name : "Crippling Strike",
				extraname : "Monk Technique",
				source : ["GMB:LL"],
				description : desc("On hit with melee Martial Arts attack, target makes Con save or is blinded, deafened or unable to speak (my choice)"),
				additional : "1 ki point"
			},
			"empowered strike" : {
				name : "Empowered Strike",
				extraname : "Monk Technique",
				source : ["GMB:LL"],
				description : desc("On hit with melee Martial Arts attack, target makes Str save (adv. if larger than me) or is pushed in a straight line by 5 ft times my Wis mod (min 5ft) and falls prone"),
				additional : "1 ki point"
			},
			"mystic healing" : {
				name : "Mystic Healing",
				extraname : "Monk Technique",
				source : ["GMB:LL"],
				description : levels.map(function (n) {
					var MartArtDie = (n < 5 ? 6 : n < 11 ? 8 : n < 17 ? 10 : 12);

					return desc("As an action, I regain HP equal to 1d"+MartArtDie+" + my Wis mod")
				}),
				additional : "2 ki points",
				action : ["action", ""],
				prereqeval : function(v) { return classes.known["monk(laserllama)"].level >= 1 } // For the Ki Warrior feat
			},
			"patient defense" : {
				name : "Patient Defense",
				extraname : "Monk Technique",
				source : ["GMB:LL"],
				description : desc("As a bonus action, I can take the Dodge action"),
				action : ["bonus action", ""],
				additional : "1 ki point",
			},
			"slow fall" : {
				name : "Slow Fall",
				extraname : "Monk Technique",
				source : ["GMB:LL"],
				description : desc("As long as I am conscious, I can reduce any falling damage I would take by five times my level")
			},
			"step of the wind" : {
				name : "Step of the Wind",
				extraname : "Monk Technique",
				source : ["GMB:LL"],
				description : desc("As a bonus action, I can either Dash or Disengage; My jump distance doubles when I do so"),
				action : ["bonus action", ""]
			},
			"improvised strikes" : {
				name : "Improvised Strikes",
				extraname : "Monk Technique",
				source : ["GMB:LL"],
				description : desc("I gain proficiency with improvised weapons, they count as Martial Arts attacks for me"),
				weaponProfs : [false, false, ["Improvised weapons"]],
				calcChanges : {
					atkAdd : [
						function (fields, v) {
							if (((/improvised/i).test(v.WeaponName + v.baseWeaponName) || (/improvised weapon/i).test(v.theWea.type))) {
								v.theWea.monkweapon = true; // The lvl 1 feature eval handles the rest
							};
						},
						"I gain proficiency with improvised weapons, they count as Martial Arts attacks for me",
						1
					]
				}
			},
			"spiritual armor" : {
				name : "Spiritual Armor",
				extraname : "Monk Technique",
				source : ["GMB:LL"],
				description : levels.map(function (n) {
					descr = ["As a bonus action, I gain temp HP equal to my Wis mod", 
						"The first time a crea reduces those temp HP, I can use my reaction to deal it 1d"+(n < 5 ? 6 : n < 11 ? 8 : n < 17 ? 10 : 12)+" force dmg"]
					return desc(descr);
				}),
				additional : "1 ki point",
				action : ["bonus action", ""],
				prereqeval : function(v) { return classes.known["monk(laserllama)"].level >= 1 } // For the Ki Warrior feat
			},
			"whirling strike" : {
				name : "Whirling Strike",
				extraname : "Monk Technique",
				source : ["GMB:LL"],
				description : levels.map(function (n) {
					descr = ["As an action, every crea within reach Dex save or 1d"+(n < 5 ? 6 : n < 11 ? 8 : n < 17 ? 10 : 12)+" + Dex mod bludgeoning dmg"]
					return desc(descr);
				}),
				additional : "1 ki point",
				action : ["action", ""],
				prereqeval : function(v) { return classes.known["monk(laserllama)"].level >= 1 } // For the Ki Warrior feat
			},
			"deflect missile" : {
				name : "Deflect Missile",
				source : ["GMB:LL"],
				description : levels.map(function (n) {
					if (n < 11) {
						return desc([
							"As a reaction, I can reduce ranged weapon attack damage done to me",
							"If the damage is negated, I catch and may throw it back (20/60 ft) as a monk weapon"
						])
					} else {
						return desc([
							"As a reaction, I can reduce ranged weapon attack damage done to me",
							"If the damage is negated, I catch and may throw it back (20/60 ft) as a monk weapon",
							"I can also spend 1 Ki to use this reaction whenever I am hit by a spell attack"
						])
					}
				}),
				action : ["reaction", ""],
				additional : levels.map(function (n) {
					return "1d" + (n < 5 ? 6 : n < 11 ? 8 : n < 17 ? 10 : 12) + " + " + n + " + Dex mod; 1 ki to throw";
				}),
				submenu : "[monk level  5+]",
				prereqeval : function(v) { return classes.known["monk(laserllama)"].level >= 5; },
			},
			"gentling touch" : {
				name : "Gentling Touch",
				source : ["GMB:LL"],
				description : desc(["In place of an attack, touch a creature and roll five times my martial arts die",
					"If the total is more or equal to their current HP, they fall asleep for 10 min or until woken",
					"I can spend more Ki to add one roll of my Martial Die for each additional Ki spent"]),
				additional : "1 to Wis mod ki points",
				submenu : "[monk level  5+]",
				prereqeval : function(v) { return classes.known["monk(laserllama)"].level >= 5; },
			},
			"seeking strike" : {
				name : "Seeking Strike",
				source : ["GMB:LL"],
				description : desc("On miss with a Martial Arts attack, I can reroll the attack roll and must use the new result"),
				additional : "1 ki point",
				submenu : "[monk level  5+]",
				prereqeval : function(v) { return classes.known["monk(laserllama)"].level >= 5; },
			},
			"slowing strike" : {
				name : "Slowing Strike",
				source : ["GMB:LL"],
				description : desc(["On hit with melee Martial Arts attack, target makes Wis save or suffers from Slow spell", "This lasts until the beginning of my next turn and I don't need to concentrate on it"]),
				additional : "1 ki point",
				submenu : "[monk level  5+]",
				prereqeval : function(v) { return classes.known["monk(laserllama)"].level >= 5; },
			},
			"stunning strike" : {
				name : "Stunning Strike",
				source : ["GMB:LL"],
				description : desc(["On hit with melee Martial Arts attack, target makes Con save or is stunned","This lasts until the beginning of my next turn"]),
				additional : "1 ki point",
				submenu : "[monk level  5+]",
				prereqeval : function(v) { return classes.known["monk(laserllama)"].level >= 5; },
			},
			"adept fighting style (archery)" : {
				name : "Adept Fighting Style (Archery)",
				extraname : "Monk Technique",
				source : ["GMB:LL"],
				description : desc("+2 bonus to attack rolls I make with ranged weapons"),
				submenu : "[monk level  5+]",
				prereqeval : function(v) { 
					techniques = GetFeatureChoice('classes', 'monk(laserllama)', 'ki', true);

					if (techniques.indexOf("adept fighting style (blind warrior)") !== -1) return false;
					if (techniques.indexOf("adept fighting style (defense)") !== -1) return false;
					if (techniques.indexOf("adept fighting style (dueling)") !== -1) return false;
					if (techniques.indexOf("adept fighting style (featherweight)") !== -1) return false;
					if (techniques.indexOf("adept fighting style (thrown)") !== -1) return false;
					if (techniques.indexOf("adept fighting style (wrestler)") !== -1) return false;

					return (classes.known["monk(laserllama)"].level >= 5)
				},
				calcChanges : {
					atkCalc : [
						function (fields, v, output) {
							if (v.isRangedWeapon && !v.isNaturalWeapon && !v.isDC) output.extraHit += 2;
						},
						"My ranged weapons get a +2 bonus on the To Hit."
					]
				}
			},
			"adept fighting style (blind warrior)" : {
				name : "Adept Fighting Style (Blind Warrior)",
				extraname : "Monk Technique",
				source : ["GMB:LL"],
				description : desc(["I gain blindsight for a range of 5 times my prof bonus",
							"In that range, I can see invisible creatures and anything that isn't behind total cover or hidden"]),
				submenu : "[monk level  5+]",
				prereqeval : function(v) { 
					techniques = GetFeatureChoice('classes', 'monk(laserllama)', 'ki', true);

					if (techniques.indexOf("adept fighting style (archery)") !== -1) return false;
					if (techniques.indexOf("adept fighting style (defense)") !== -1) return false;
					if (techniques.indexOf("adept fighting style (dueling)") !== -1) return false;
					if (techniques.indexOf("adept fighting style (featherweight)") !== -1) return false;
					if (techniques.indexOf("adept fighting style (thrown)") !== -1) return false;
					if (techniques.indexOf("adept fighting style (wrestler)") !== -1) return false;

					return (classes.known["monk(laserllama)"].level >= 5)
				},
				changeeval : function(lvl, chc) {
				    var srcNm = "Blind Warrior Fighting Style";
				    var curRange = CurrentProfs.vision.blindsight && CurrentProfs.vision.blindsight.ranges[srcNm];
				    var newRange = lvl[1] && Number(How('Proficiency Bonus')) * 5;

				    // Only do something if the range changed
				    if (curRange !== newRange) {
				        // First remove the old range, if any
				        if (curRange) SetProf('vision', false, "Blindsight", srcNm, curRange);
				        // Then set the new range, unless the feature is removed (i.e. lvl[1] === 0)
				        if (newRange) SetProf('vision', true,  "Blindsight", srcNm, newRange);
				    }
				}
			},
			"adept fighting style (defense)" : {
				name : "Adept Fighting Style (Defense)",
				extraname : "Monk Technique",
				source : ["GMB:LL"],
				description : desc("+1 bonus to AC when I'm wearing armor or wielding a shield"),
				submenu : "[monk level  5+]",
				prereqeval : function(v) { 
					techniques = GetFeatureChoice('classes', 'monk(laserllama)', 'ki', true);

					if (techniques.indexOf("adept fighting style (archery)") !== -1) return false;
					if (techniques.indexOf("adept fighting style (blind warrior)") !== -1) return false;
					if (techniques.indexOf("adept fighting style (dueling)") !== -1) return false;
					if (techniques.indexOf("adept fighting style (featherweight)") !== -1) return false;
					if (techniques.indexOf("adept fighting style (thrown)") !== -1) return false;
					if (techniques.indexOf("adept fighting style (wrestler)") !== -1) return false;

					return (classes.known["monk(laserllama)"].level >= 5)
				},
				extraAC : {
					name : "Defense Fighting Style", // necessary for features referring to fighting style properties directly
					mod : 1,
					text : "I gain a +1 bonus to AC while wearing armor or wielding a shield.",
					stopeval : function (v) { return !v.wearingArmor && !v.usingShield; }
				}
			},
			"adept fighting style (dueling)" : {
				name : "Adept Fighting Style (Dueling)",
				extraname : "Monk Technique",
				source : ["GMB:LL"],
				description : desc("+2 to damage rolls when wielding a melee weapon in one hand and no other weapon"),
				submenu : "[monk level  5+]",
				prereqeval : function(v) { 
					techniques = GetFeatureChoice('classes', 'monk(laserllama)', 'ki', true);

					if (techniques.indexOf("adept fighting style (archery)") !== -1) return false;
					if (techniques.indexOf("adept fighting style (blind warrior)") !== -1) return false;
					if (techniques.indexOf("adept fighting style (defense)") !== -1) return false;
					if (techniques.indexOf("adept fighting style (featherweight)") !== -1) return false;
					if (techniques.indexOf("adept fighting style (thrown)") !== -1) return false;
					if (techniques.indexOf("adept fighting style (wrestler)") !== -1) return false;

					return (classes.known["monk(laserllama)"].level >= 5)
				},
				calcChanges : {
					atkCalc : [
						function (fields, v, output) {
							for (var i = 1; i <= FieldNumbers.actions; i++) {
								if ((/off.hand.attack/i).test(What('Bonus Action ' + i))) return;
							};
							if (v.isMeleeWeapon && !v.isNaturalWeapon && !(/((^|[^+-]\b)2|\btwo).?hand(ed)?s?\b/i).test(fields.Description)) output.extraDmg += 2;
						},
						"When I'm wielding a melee weapon in one hand and no weapon in my other hand, I do +2 damage with that melee weapon. This condition will always be false if the bonus action 'Off-hand Attack' exists."
					]
				}
			},
			"adept fighting style (featherweight)" : {
				name : "Adept Fighting Style (Featherweight)",
				extraname : "Monk Technique",
				source : ["GMB:LL"],
				description : desc("+1 bonus to damage rolls and +10 ft to speed when wielding only light weapons and not wearing medium or heavy armor nor shield"),
				submenu : "[monk level  5+]",
				prereqeval : function(v) { 
					techniques = GetFeatureChoice('classes', 'monk(laserllama)', 'ki', true);

					if (techniques.indexOf("adept fighting style (archery)") !== -1) return false;
					if (techniques.indexOf("adept fighting style (blind warrior)") !== -1) return false;
					if (techniques.indexOf("adept fighting style (defense)") !== -1) return false;
					if (techniques.indexOf("adept fighting style (dueling)") !== -1) return false;
					if (techniques.indexOf("adept fighting style (thrown)") !== -1) return false;
					if (techniques.indexOf("adept fighting style (wrestler)") !== -1) return false;

					return (classes.known["monk(laserllama)"].level >= 5)
				},
				calcChanges : {
					atkCalc : [
						function (fields, v, output) {
							if (v.baseWeaponName == "unarmed strike" || (/\blight\b/i).test(fields.Description)) output.extraDmg += 1;
						},
						"When I'm wielding light weapons and not wearing medium or heavy armor nor a shield, I do +1 damage with light weapons and unarmed strikes."
					]
				},
				speed : {
					allModes : "+10"
				}
			},
			"adept fighting style (thrown)" : {
				name : "Adept Fighting Style (Thrown)",
				extraname : "Monk Technique",
				source : ["GMB:LL"],
				description : desc("+2 bonus to damage rolls with thrown weapons as ranged attack"),
				submenu : "[monk level  5+]",
				prereqeval : function(v) { 
					techniques = GetFeatureChoice('classes', 'monk(laserllama)', 'ki', true);

					if (techniques.indexOf("adept fighting style (archery)") !== -1) return false;
					if (techniques.indexOf("adept fighting style (blind warrior)") !== -1) return false;
					if (techniques.indexOf("adept fighting style (defense)") !== -1) return false;
					if (techniques.indexOf("adept fighting style (dueling)") !== -1) return false;
					if (techniques.indexOf("adept fighting style (featherweight)") !== -1) return false;
					if (techniques.indexOf("adept fighting style (wrestler)") !== -1) return false;

					return (classes.known["monk(laserllama)"].level >= 5)
				},
				calcChanges : {
					atkCalc : [
						function (fields, v, output) {
							if (v.isThrownWeapon) output.extraDmg += 2;
						},
						"My thrown weapons get a +2 bonus damage when thrown."
					]
				}
			},
			"adept fighting style (wrestler)" : {
				name : "Adept Fighting Style (Wrestler)",
				extraname : "Monk Technique",
				source : ["GMB:LL"],
				description : desc(["When hitting someone on my turn, I can attempt to grapple or shove them as a bonus action",
						"I can drag grappled creatures up to my full speed"]),
				action : ["bonus action", "Grapple or shove (after hitting with Attack action)"],
				submenu : "[monk level  5+]",
				prereqeval : function(v) { 
					techniques = GetFeatureChoice('classes', 'monk(laserllama)', 'ki', true);

					if (techniques.indexOf("adept fighting style (archery)") !== -1) return false;
					if (techniques.indexOf("adept fighting style (blind warrior)") !== -1) return false;
					if (techniques.indexOf("adept fighting style (defense)") !== -1) return false;
					if (techniques.indexOf("adept fighting style (dueling)") !== -1) return false;
					if (techniques.indexOf("adept fighting style (featherweight)") !== -1) return false;
					if (techniques.indexOf("adept fighting style (thrown)") !== -1) return false;

					return (classes.known["monk(laserllama)"].level >= 5)
				}
			},
			"crushing strike" : {
				name : "Crushing Strike",
				source : ["GMB:LL"],
				description : levels.map(function (n) {
					return desc(["On hit with unarmed strike, add 1d"+(n < 5 ? 6 : n < 11 ? 8 : n < 17 ? 10 : 12)+" bludgeoning dmg for each Ki spent"])
				}),
				additional : "1 to Wis mod ki points",
				submenu : "[monk level  5+]",
				prereqeval : function(v) { return classes.known["monk(laserllama)"].level >= 5; },
			},
			"divine light" : {
				name : "Divine Light",
				source : ["GMB:LL"],
				description : desc(["I learn two cantrips from the Cleric spell list and can cast them using Wisdom"]),
				submenu : "[monk level  5+]",
				spellcastingBonus : {
					name : "Divine Light Monk Technique",
					spellcastingAbility : 5,
					'class' : 'cleric',
					level : [0, 0],
					firstCol : "atwill",
					times : 2
				},
				prereqeval : function(v) { return classes.known["monk(laserllama)"].level >= 5; },
			},
			"unyielding perseverance" : {
				name : "Unyielding Perseverance",
				source : ["GMB:LL"],
				description : desc(["Add +1 to an ability check or saving throw for each Ki spent",
					"I can use this Technique after I roll, but before I know if my roll succeeds or fails"]),
				additional : "1 to Wis mod ki points",
				submenu : "[monk level  5+]",
				prereqeval : function(v) { return classes.known["monk(laserllama)"].level >= 5; },
			},
			"aura sight" : {
				name : "Aura Sight",
				source : ["GMB:LL"],
				description : levels.map(function (n) {
					var newRange = n < 13 ? 20 : n < 18 ? 30 : 60;
					descr = ["I gain "+newRange+" ft blindsight and can see anything that isn't behind total cover within that range",
						"I can see invisible creatures within range unless the creature successfully hides from me"]
					return desc(descr);
				}),
				submenu : "[monk level  9+]",
				prereqeval : function(v) { return classes.known["monk(laserllama)"].level >= 9; },
				changeeval : function(lvl, chc) {
				    var srcNm = "Aura Sight Monk Technique";
				    var curRange = CurrentProfs.vision.blindsight && CurrentProfs.vision.blindsight.ranges[srcNm];
				    var newRange = lvl[1] < 13 ? 20 : lvl[1] < 18 ? 30 : 60; 

				    // Only do something if the range changed
				    if (curRange !== newRange) {
				        // First remove the old range, if any
				        if (curRange) SetProf('vision', false, "Blindsight", srcNm, curRange);
				        // Then set the new range, unless the feature is removed (i.e. lvl[1] === 0)
				        if (newRange) SetProf('vision', true,  "Blindsight", srcNm, newRange);
				    }
				}
			},
			"heavenly step" : {
				name : "Heavenly Step",
				source : ["GMB:LL"],
				description : desc(["I can move along vertical surfaces, across liquids, and upside down on ceilings without falling during the move",
					"If I end my movement on a vertical surface, liquid, or upside down on a ceiling, I can spend 1 Ki Point to remain in place without falling until the start of my next turn"]),
				submenu : "[monk level  9+]",
				prereqeval : function(v) { return classes.known["monk(laserllama)"].level >= 9; },
			},
			"indomitable spirit" : {
				name : "Indomitable Spirit",
				source : ["GMB:LL"],
				description : desc(["Add my Wis mod (min 1) to a Strength (Athletics) or Dexterity (Athletics) check",
					"I can use this Technique after I roll, but before I know if my roll succeeds or fails"]),
				additional : "1 ki point",
				submenu : "[monk level  9+]",
				prereqeval : function(v) { return classes.known["monk(laserllama)"].level >= 9; },
			},
			"mantle of courtesy" : {
				name : "Mantle of Courtesy",
				source : ["GMB:LL"],
				description : desc(["I gain proficiency in Persuasion and can add my Wis mod (min 1) to Cha (Persuasion) checks"]),
				submenu : "[monk level  9+]",
				prereqeval : function(v) { return classes.known["monk(laserllama)"].level >= 9; },
				skills : ["Persuasion"],
				addMod : { type : "skill", field : "Persuasion", mod : "max(Wis|1)", text : "I can add my Wis mod (min 1) to Cha (Persuasion) checks" }
			},
			"commune with self" : {
				name : "Commune with Self",
				source : ["GMB:LL"],
				description : desc(["I can meditate for 10 min to gain the benefits of the commune spell"]),
				additional : "5 ki points",
				submenu : "[monk level  9+]",
				prereqeval : function(v) { return classes.known["monk(laserllama)"].level >= 9; },
				spellcastingBonus : {
					name : "Commune with Self",
					spells : ["commune"],
					selection : ["commune"],
					firstCol : 5
				},
				spellFirstColTitle : "Ki",
				spellChanges : {
					"commune" : {
						time : "10 min",
						changes : "I can meditate for 10 min to gain the benefits of the commune spell"
					}
				}
			},
			"friend of beast and leaf" : { // '&' is an invalid character here
				name : "Friend of Beast and Leaf",
				source : ["GMB:LL"],
				description : desc(["I can meditate for 10 min to gain the benefits of the commune with nature spell"]),
				additional : "5 ki points",
				submenu : "[monk level  9+]",
				prereqeval : function(v) { return classes.known["monk(laserllama)"].level >= 9; },
				spellcastingBonus : {
					name : "Friend of Beast and Leaf",
					spells : ["commune with nature"],
					selection : ["commune with nature"],
					firstCol : 5
				},
				spellFirstColTitle : "Ki",
				spellChanges : {
					"commune with nature" : {
						time : "10 min",
						changes : "I can meditate for 10 min to gain the benefits of the commune with nature spell"
					}
				}
			},
			"monastic fortitude" : {
				name : "Monastic Fortitude",
				source : ["GMB:LL"],
				description : levels.map(function (n) {
					return desc(["As a reaction when taking damage, reduce the damage by 2d"+(n < 5 ? 6 : n < 11 ? 8 : n < 17 ? 10 : 12)+" + my Wis mod"])
				}),
				additional : "2 ki points",
				submenu : "[monk level  9+]",
				action : ["reaction", ""],
				prereqeval : function(v) { return classes.known["monk(laserllama)"].level >= 9; },
			},
			"armor of the ascetic" : {
				name : "Armor of the Ascetic",
				source : ["GMB:LL"],
				description : desc(["At the end of a short or long rest, I gain the effects of sanctuary spell",
					"This lasts until the start of my next short or long rest and can end early as normal"]),
				submenu : "[monk level 13+]",
				prereqeval : function(v) { return classes.known["monk(laserllama)"].level >= 13; },
				recovery : "short rest",
            	usages : 1,
				spellcastingBonus : {
					name : "Armor of the Ascetic",
					spells : ["sanctuary"],
					selection : ["sanctuary"],
					firstCol : "oncesr"
				},
				spellChanges : {
					"sanctuary" : {
						range : "Self",
						time : "-",
						components : "-",
						duration : "Until rest",
						changes : "At the end of a short or long rest, I gain the effects of sanctuary spell; This lasts until the start of my next short or long rest and can end early as normal"
					}
				}
			},
			"mystical integrity" : {
				name : "Mystical Integrity",
				source : ["GMB:LL"],
				description : desc(["I am immune to any spell or effect that would alter my form or force me to teleport, unless I wish to be affected"]),
				submenu : "[monk level 13+]",
				prereqeval : function(v) { return classes.known["monk(laserllama)"].level >= 13; },
				savetxt : { immune : ["forced teleportation", "form alterations"] }
			},
			"tongue of sun and moon" : { // '&' is an invalid character here
				name : "Tongue of Sun and Moon",
				source : ["GMB:LL"],
				description : desc(["I can touch the Ki of other minds and communicate with any creature that speaks a language",
					"Creatures that speak no languages can communicate and understand simple ideas"]),
				submenu : "[monk level 13+]",
				prereqeval : function(v) { return classes.known["monk(laserllama)"].level >= 13; }
			},
			"banishing strike" : {
				name : "Banishing Strike",
				source : ["GMB:LL"],
				description : levels.map(function (n) {
					return desc(["On hit with melee Martial Arts attack, target makes Cha save or takes 3d"+(n < 5 ? 6 : n < 11 ? 8 : n < 17 ? 10 : 12)+" additional force dmg (half on save). If this reduces the target to 50 HP or less, it is shunted to a harmless demiplane where it is incapacitated. The crea reappears in the unoccupied space nearest to the last space it occupied at the end of my next turn."])
				}),
				submenu : "[monk level 13+]",
				additional : "3 ki points",
				prereqeval : function(v) { return classes.known["monk(laserllama)"].level >= 13; }
			},
			"conjure previous life" : {
				name : "Conjure Previous Life",
				source : ["GMB:LL"],
				description : desc(["As an action, I cast a special version of summon celestial (defender) at 5th-level"]),
				submenu : "[monk level 13+]",
				additional : "3 ki points",
				prereqeval : function(v) { return classes.known["monk(laserllama)"].level >= 13; },
				spellcastingBonus : {
					name : "Conjure Previous Life",
					spells : ["summon celestial"],
					selection : ["summon celestial"],
					firstCol : 5
				},
				spellFirstColTitle : "Ki",
				spellChanges : {
					"summon celestial" : {
						components : "-",
						description : "Summon Defender celestial; obeys commands; takes turn after mine; disappears at 0 hp (see book)",
						descriptionFull : "You call forth a celestial spirit. It manifests in an angelic form in an unoccupied space that you can see within range. This corporeal form uses the Defender Celestial Spirit stat block with the changes below:"
							+ "\n\u2022 It is a Medium creature that resembles a humanoid Monk, though it may not be the same race as you are."
							+ "\n\u2022 Its Radiant Mace attacks resemble unarmed strikes"
							+ "\n\u2022 When summoned you can infuse it with a number of Ki Points of your choice, and your Ki Point maximum is reduced by the same amount while it is summoned. It can use the infused Ki to use any Techniques you know, though it cannot use conjure previous life again."
							+ "\n\nThe creature disappears when it drops to 0 hit points or when the spell ends.\n   The creature is an ally to you and your companions. In combat, the creature shares your initiative count, but it takes its turn immediately after yours. It obeys your verbal commands (no action required by you). If you don't issue any, it takes the Dodge action and uses its move to avoid danger.",
						changes : "As an action, I can spend 5 Ki Points and cast summon celestial (defender) at 5th-level, with special changes"
					}
				}
			},
			"empty body" : {
				name : "Empty Body",
				source : ["GMB:LL"],
				description : desc("Be invisible and resist non-force damage for 1 min or cast Astral Projection on self"),
				additional : "Invisible: 4 ki points; Astral Projection: 8 ki points",
				submenu : "[monk level 18+]",
				prereqeval : function(v) { return classes.known["monk(laserllama)"].level >= 18; },
				action : ["bonus action", ""],
				spellcastingBonus : {
					name : "Empty Body",
					spells : ["astral projection"],
					selection : ["astral projection"],
					firstCol : 8
				},
				spellFirstColTitle : "Ki",
				spellChanges : {
					"astral projection" : {
						components : "V,S",
						compMaterial : "",
						description : "I project myself to the Astral Plane with identical statistics, see book",
						changes : "I can spend 8 ki points to cast Astral Projection without requiring material components, although I can't bring other creatures with me."
					}
				}
			},
			"quivering palm" : {
				name : "Quivering Palm",
				source : ["GMB:LL"],
				description : levels.map(function (n) {
					descr = [
						"On hit, infuse target's soul with vibrations that last up to "+n+" days",
						"While me and the target are on the same plane of existence, I can use an action to end the vibrations and force the target to make a Con save",
						"It is reduced to 0 HP on a fail and takes 10d10 necrotic damage on a success",
						"I can only have one target at a time, using it on a second target ends it harmlessly for the first"]
					return desc(descr);
				}),
				additional : "5 ki points",
				action : ["action", " (end vibrations)"],
				submenu : "[monk level 18+]",
				prereqeval : function(v) { return classes.known["monk(laserllama)"].level >= 18; }
			},
			"awaken the third eye" : {
				name : "Awaken the Third Eye",
				source : ["GMB:LL"],
				description : desc("Spend 1 min to cast Foresight on myself; This reduces my max Ki by 8 while active"),
				additional : "8 ki points",
				submenu : "[monk level 18+]",
				prereqeval : function(v) { return classes.known["monk(laserllama)"].level >= 18; },
				spellcastingBonus : {
					name : "Empty Body",
					spells : ["foresight"],
					selection : ["foresight"],
					firstCol : 8
				},
				spellFirstColTitle : "Ki",
				spellChanges : {
					"foresight" : {
						range : "Self",
						components : "-",
						description : "I can end this effect as an action",
						changes : "I can cast Foresight on myself"
					}
				}
			},
			"word of creation" : {
				name : "Word of Creation",
				source : ["GMB:LL"],
				description : desc("As an action, cast Divine Word; I can only do this once per short rest"),
				additional : "7 ki points",
				submenu : "[monk level 18+]",
				prereqeval : function(v) { return classes.known["monk(laserllama)"].level >= 18; },
				spellcastingBonus : {
					name : "Word of Creation",
					spells : ["divine word"],
					selection : ["divine word"],
					firstCol : 7
				},
				spellFirstColTitle : "Ki",
				spellChanges : {
					"divine word" : {
						components : "-",
						time : "1 a",
						changes : "As an action, I can spend 7 Ki Points to cast divine word, using Wisdom as my spellcasting modifier"
					}
				},
				recovery : "short rest",
            	usages : 1
			},
			autoSelectExtrachoices : [{extrachoice : "flurry of blows"}]
		},
		"unarmored movement" : {
			name : "Unarmored Movement",
			source : ["GMB:LL"],
			minlevel : 2,
			description : levels.map(function (n) {
				if (n < 2) return "";
				var spd = "My speed increases by " + (n < 6 ? 10 : n < 10 ? 15 : n < 14 ? 20 : n < 18 ? 25 : 30) + " ft";
				return desc(spd);
			}),
			changeeval : function (v) {
				var monkSpd = '+' + (v[1] < 2 ? 0 : v[1] < 6 ? 10 : v[1] < 10 ? 15 : v[1] < 14 ? 20 : v[1] < 18 ? 25 : 30);
				SetProf('speed', monkSpd !== '+0', {allModes : monkSpd}, "Monk: Unarmored Movement");
			}
		},
		"subclassfeature3" : {
			name : "Monastic Tradition",
			source : ["GMB:LL"],
			minlevel : 3,
			description : desc('Choose a Monastic Tradition to commit to and put it in the "Class" field ')
		},
		"enlightened fist" : {
			name : "Enlightened Fist",
			source : ["GMB:LL"],
			minlevel : 6,
			description : desc("My unarmed strikes count as magical for overcoming resistances and immunities"),
			calcChanges : {
				atkAdd : [
					function (fields, v) {
						if (v.baseWeaponName == "unarmed strike" && !v.thisWeapon[1] && !v.theWea.isMagicWeapon && !(/counts as( a)? magical/i).test(fields.Description)) {
							fields.Description += (fields.Description ? '; ' : '') + 'Counts as magical';
						};
					},
					"My unarmed strikes count as magical for overcoming resistances and immunities."
				]
			}
		},
		"evasion" : {
			name : "Evasion",
			source : ["GMB:LL"],
			minlevel : 7,
			description : desc("My Dexterity saves vs. areas of effect negate damage on success and halve it on failure"),
			savetxt : { text : ["Dex save vs. area effects: fail \u2015 half dmg, success \u2015 no dmg"] }
		},
		"ki adept" : {
			name : "Ki Adept",
			source : ["GMB:LL"],
			minlevel : 11,
			description : desc("Once on my turn, I can use a Technique I know that costs 1 Ki Point, or Flurry of Blows without spending Ki")
		},
		"purity of body" : {
			name : "Purity of Body",
			source : ["GMB:LL"],
			minlevel : 13,
			description : desc("I gain proficiency in Con saving throws; I am immune to the poisoned condition and disease"),
			savetxt : { immune : ["poisoned", "disease"] },
			saves : ["Con"]
		},
		"diamond soul" : {
			name : "Diamond Soul",
			source : ["GMB:LL"],
			minlevel : 14,
			description : desc("On my turn, I can spend 1 Ki to end either the charmed or frightened condition on myself"),
			additional : "1 ki point"
		},
		"timeless body" : {
			name : "Timeless Body",
			source : ["GMB:LL"],
			minlevel : 15,
			description : desc(["I don't require food or water; I don't suffer age penalties","For every 10 years that pass my physical body only ages 1 year"])
		},
		"perfect self" : {
			name : "Perfect Self",
			source : ["GMB:LL"],
			minlevel : 20,
			description : desc("I regain all expended Ki Points by meditating or performing only light activity for 10 minutes")
		}
	}
}

// Way of the Open Hand
AddSubClass("monk(laserllama)", "way of the open hand", {
	regExpSearch : /open hand/i,
	subname : "Way of the Open Hand",
	fullname : "Open Hand",
	source : [["GMB:LL", 0]],
	features : {
		// Override Ki because of the lvl 17 subclass feature
		"ki": function() {
			var kifeature = newObj(ClassList["monk(laserllama)"].features["ki"]);

			kifeature["flurry of blows"].description = levels.map(function (n) {
				if (n < 17) return desc("After taking the Attack action, I can make 2 unarmed attacks as a bonus action");
				return desc("After taking the Attack action, I can make 3 unarmed attacks as a bonus action")
			});

			return kifeature;
		}(),

		"subclassfeature3" : function() {
			// Fixed attributes
			OpenHandTechniques = {
				name : "Open Hand Techniques",
				source : [["GMB:LL", 0]],
				minlevel : 3,
				description : desc(["I learn additional Techniques who don't count against my total",
					"When I level up, I can change a strike technique from this feature for another strike technique"]),
				extraname : "Open Hand Techniques",
				extrachoices : ["Arresting Strike", "Crippling Strike", "Empowered Strike", "Whirling Strike", "Seeking Strike", "Slowing Strike", 
					"Stunning Strike", "Crushing Strike", "Banishing Strike"],
				extraTimes : levels.map( function(n) {
	                if (n < 3) return 0;
	                if (n < 5) return 1;
	                return 2;
	            }),
	            autoSelectExtrachoices : [{
					extrachoice : "empowered strike",
					minlevel : 3
				}, {
					extrachoice : "stunning strike",
					minlevel : 5
				}, {
					extrachoice : "indomitable spirit",
					minlevel : 9
				}]
			}

			// Copy strike techniques
			StrikeTechniques = ["arresting strike", "crippling strike", "empowered strike", "whirling strike", "seeking strike", "slowing strike", "stunning strike", 
				"crushing strike", "banishing strike", "indomitable spirit"]; // Indomitable spirit is not a strike technique but still needed for lvl 9
			for (var i = 0; i < StrikeTechniques.length; i++) {
				OpenHandTechniques[StrikeTechniques[i]] = newObj(ClassList["monk(laserllama)"].features["ki"][StrikeTechniques[i]]);
			}

			return OpenHandTechniques;
		}(),
		"subclassfeature3.1" : {
			name : "Practiced Strikes",
			source : [["GMB:LL", 0]],
			minlevel : 3,
			description : desc(["Once per turn when I hit with an unarmed strike, I can use a strike Technique I know without spending a Ki Point"]),
			usages : "Wisdom modifier per ",
			usagescalc : "event.value = Math.max(1, What('Wis Mod'));",
			recovery : "long rest",
		},
		"subclassfeature6" : {
			name : "Ebb and Flow",
			source : [["GMB:LL", 0]],
			minlevel : 6,
			description : levels.map(function (n) {
				if (n < 17) return desc(["When a creature I can see misses me with a melee attack, I can use one of the following:",
				"\u2022 The crea has to make a Dex save (adv if larger) or be knocked prone and have a speed of 0",
				"\u2022 I can make one unarmed strike against the creature"])

				return desc(["When a creature I can see misses me with a melee attack, I can use one of the following:",
				"\u2022 The crea has to make a Dex save (adv if larger) or be knocked prone and have a speed of 0",
				"\u2022 I can make two unarmed strikes against the creature"])
			}),
			action : ["reaction", " (after missed in melee)"]
		},
		"subclassfeature10" : {
			name : "Open Hand Strike",
			source : [["GMB:LL", 0]],
			minlevel : 10,
			description : desc(["When I crit with an unarmed strike, the creature has disadvantage on any save that I force it to make as part of that attack"]),
		},
		"subclassfeature10" : {
			name : "Master of Many Forms",
			source : [["GMB:LL", 0]],
			minlevel : 10,
			description : desc(["During a long rest I can spend 10 min practicing to switch my Monk Techniques"]),
		},
		"subclassfeature17" : {
			name : "Master of the Open Hand",
			source : [["GMB:LL", 0]],
			minlevel : 17,
			description : desc(["When I make an opportunity attack, I can make two unarmed strikes instead"])
		}
	}
})

// Way of the Shadow Arts
AddSubClass("monk(laserllama)", "way of the shadow arts", {
	regExpSearch : /shadow arts/i,
	subname : "Way of the Shadow Arts",
	fullname : "Shadow Arts",
	source : [["GMB:LL", 0]],
	features : {
		"subclassfeature3" : GetSubclassTechniques("Shadow",["slow fall","gentling touch","heavenly step"]),
		"subclassfeature3.1" : {
			name : "Eyes of Night",
			source : [["GMB:LL", 0]],
			minlevel : 3,
			description : desc(["I gain 60 ft darkvision, or add 30 ft to darkvision if I already had it",
				"I have advantage on any Dexterity (Stealth) checks I make while in dim light or darkness"]),
			vision : [["Darkvision", "fixed 60"], ["Darkvision", "+30"]]
		},
		"subclassfeature3.2" : {
			name : "Shadow Arts",
			source : [["GMB:LL", 0]],
			minlevel : 3,
			description : levels.map(function (n) {
				if (n < 17) return desc(["I can cast Darkness, Darkvision, Pass Without Trace and Silence once per long rest each",
				"If I have no uses left, I can instead spend 2 ki; I see through magical darkness I create"])

				return desc(["I can cast Darkness, Darkvision, Pass Without Trace and Silence at will",
				"I see through magical darkness I create"])
			}),
			spellFirstColTitle : "Ki",
			spellcastingBonus : {
				name : "Shadow Arts",
				spells : ["darkness", "darkvision", "pass without trace", "silence"],
				selection : ["darkness", "darkvision", "pass without trace", "silence"],
				firstCol : "oncelr",
				times : 4
			}
		},
		"subclassfeature6" : {
			name : "Shadow Step",
			source : [["GMB:LL", 0]],
			minlevel : 6,
			description : levels.map(function (n) {
				shadowstep_range = n < 17 ? "30 ft" : "60 ft";

				return desc(["As a bonus action, I can teleport from and into dim light or darkness within " + shadowstep_range,
				"After I do this, I have adv. on the next Martial Arts attack I make before the end of my turn"])
			}),
			action : ["bonus action", ""]
		},
		"subclassfeature10" : {
			name : "Cloak of Shadows",
			source : [["GMB:LL", 0]],
			minlevel : 10,
			description : levels.map(function (n) {
				cloak_actioncost = n < 17 ? "action" : "action or bonus action";

				return desc(["As an "+cloak_actioncost+", I can become invisible in dim light or darkness until I attack/cast/leave darkness",
				"If a crea enters my reach while I am invisible, I can make an opportunity attack against it",
				"Opportunity attacks only end my invisibility if I hit"])
			}),
			action : ["action", ""]
		},
		"subclassfeature17" : {
			name : "Master of Shadows",
			source : [["GMB:LL", 0]],
			minlevel : 17,
			description : desc(["I can cast Greater Invisibility and Shadow of Moil once per long rest each",
				"If I have no uses left, I can instead spend 4 ki; I don't need material components for those"]),
			action : [["bonus action", "Cloak of Shadows"]],
			spellFirstColTitle : "Ki",
			spellcastingBonus : {
				name : "Master of Shadows",
				spells : ["greater invisibility", "shadow of moil"],
				selection : ["greater invisibility", "shadow of moil"],
				firstCol : "oncelr",
				times : 2
			},
			spellChanges : {
				"greater invisibility" : {
					components : "V",
					compMaterial : "",
					changes : "Spell cast with Master of Shadows don't require material components."
				},
				"shadow of moil" : {
					components : "V,S",
					compMaterial : "",
					changes : "Spell cast with Master of Shadows don't require material components."
				},
				"darkness" : {
					firstCol : "atwill",
					changes : "Spell cast with Shadow Arts can be used at will"
				},
				"darkvision" : {
					firstCol : "atwill",
					changes : "Spell cast with Shadow Arts can be used at will"
				},
				"pass without trace" : {
					firstCol : "atwill",
					changes : "Spell cast with Shadow Arts can be used at will"
				},
				"silence" : {
					firstCol : "atwill",
					changes : "Spell cast with Shadow Arts can be used at will"
				}
			}
		}
	}
})

// Guardian of nature is on the Wu Jen's spell list, but restricted to only tree, so I'm adding a new spell to account for that restriction
// I could theorically instead use spellChanges, but it might affect a ranger or druid multiclass
SpellsList["guardian of nature (tree)"] = {
	name : "Guardian of Nature (tree)",
	classes : [],
	source : [["X", 157]],
	level : 4,
	school : "Trans",
	time : "1 bns",
	range : "Self",
	components : "V",
	duration : "Conc, 1 min",
	description : "I transform into a Great Tree (defensive bonuses); see book",
	descriptionFull : "A nature spirit answers your call and transforms you into a powerful guardian. The transformation lasts until the spell ends." + "\n\n" + toUni("Great Tree") + ": Your skin appears barky, leaves sprout from your hair, and you gain the following benefits:" + "\n \u2022 " + "You gain 10 temporary hit points." + "\n \u2022 " + "You make Constitution saving throws with advantage." + "\n \u2022 " + "You make Dexterity- and Wisdom-based attack rolls with advantage." + "\n \u2022 " + "While you are on the ground, the ground within 15 feet of you is difficult terrain for your enemies."
};

var WuJenList = [
	"blade ward", "control flames", "create bonfire", "druidcraft", "frostbite", "gust", "light", "magic stone", "mold earth", "produce flame", "ray of frost", "shape water", "thorn whip", "thunderclap", // cantrips
	"absorb elements", "armor of agathys", "burning hands", "create or destroy water", "earth tremor", "ensnaring strike", "entangle", "fog cloud", "frost fingers", "hail of thorns", "hellish rebuke", "ice knife", "sanctuary", "thunderwave", "witch bolt", // 1st level
	"barkskin", "continual flame", "dust devil", "earthbind", "maximilian's earthen grasp", "flame blade", "flaming sphere", "gust of wind", "hold person", "levitate", "misty step", "scorching ray", "shatter", "snilloc's snowball swarm", "spike growth", "warding wind", // 2nd level
	"call lightning", "erupting earth", "fireball", "fly", "gaseous form", "lightning bolt", "meld into stone", "melf's minute meteors", "plant growth", "sleet storm", "speak with plants", "thunder step", "tidal wave", "wall of sand", "wall of water", "wind wall", // 3rd level
	"control water", "elemental bane", "fire shield", "freedom of movement", "grasping vine", "guardian of nature (tree)", "ice storm", "otiluke's resilient sphere", "stone shape", "stoneskin", "storm sphere", "wall of fire", "watery sphere" // 4th level
]

for (var i = 0; i < WuJenList.length; i++) {
	try { SpellsList[WuJenList[i]].classes.push("wu jen"); } catch (e) { throw new Error(WuJenList[i]);}
}

// Way of the Wu Jen (four elements)
AddSubClass("monk(laserllama)", "way of the wu jen", {
	regExpSearch : /wu jen/i,
	subname : "Way of the Wu Jen",
	fullname : "Wu Jen",
	source : [["GMB:LL", 0]],
	abilitySave : 5,
	spellcastingList : {
		spells : WuJenList
	},
	spellcastingFactor : "warlock3", // There's no RAW indication on the alt monk document, but it's the same table as Witchblade so it's what makes the most sense
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
	spellcastingKnown : {
		cantrips : [0, 0, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3],
		spells : [0, 0, 2, 2, 3, 3, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7]
	},
	features : {
		"subclassfeature3" : {
			name : "Disciple of the Elements",
			source : [["GMB:LL", 0]],
			minlevel : 3,
			description : desc(["I can cast Wu Jen cantrips/spells that I know, using Wisdom as my spellcasting ability", 
				"I can replace a spell I know with another Wu Jen spell when I gain a level", 
				"I regain these spell slots on a short rest; I don't need material components"]),
			calcChanges : {
				spellAdd : [
					function (spellKey, spellObj, spName) {
						if (spName == "monk(laserllama)") {
							if (spellObj.compMaterial && !(/M[\u0192\u2020]/i).test(spellObj.components)) spellObj.compMaterial = "";
							spellObj.components = spellObj.components.replace(/,?M/ig, '');
							return true;
						};
					},
					"My Wu Jen spells don't require material components."
				]
			},
			additional : ["", "", "1 cantrip \u0026 2 spells known", "1 cantrip \u0026 2 spells known", "1 cantrip \u0026 3 spells known", "1 cantrip \u0026 3 spells known", "1 cantrip \u0026 4 spells known", "1 cantrip \u0026 4 spells known", "1 cantrip \u0026 5 spells known", "2 cantrips \u0026 5 spells known", "2 cantrips \u0026 5 spells known", "2 cantrips \u0026 5 spells known", "2 cantrips \u0026 6 spells known", "2 cantrips \u0026 6 spells known", "2 cantrips \u0026 6 spells known", "2 cantrips \u0026 6 spells known", "3 cantrips \u0026 7 spells known", "3 cantrips \u0026 7 spells known", "3 cantrips \u0026 7 spells known", "3 cantrips \u0026 7 spells known"],
			"ki casting" : {
				name : "Ki casting",
				description : desc(["I can use my bonus action to regain an expended Wu Jen spell slot"]),
				additional : levels.map(function (n) {
					ki_casting_cost = (n < 7 ? 1 : n < 13 ? 2 : n < 19 ? 3 : 4) + 1;

					return ki_casting_cost + " ki points"
				}),
			},
			autoSelectExtrachoices : [{
				extrachoice : "ki casting",
				minlevel : 3
			}],
			action : ["bonus action", "Ki casting"]
		},
		"subclassfeature6" : {
			name : "Fist of the Five Ways",
			source : [["GMB:LL", 0]],
			minlevel : 6,
			description : desc(["When I make an unarmed strike, I can choose for it to deal bludg, cold, fire, poison, or thunder damage and increase my reach by 5 ft",
				"Also, if I use my action to cast a Wu Jen spell, I can make an unarmed strike as a bonus action"]),
			action : [["bonus action", "Unarmed Strike (with Wu Jen casting action)"]],
			"spiritual flow" : {
				name : "Spiritual Flow",
				source : [["P", 80]],
				minlevel : 10,
				description : desc("I can cast a Wu Jen spell with a casting time of 1 action as a bonus action instead"),
				additional : "2 ki points"
			},
			autoSelectExtrachoices : [{
				extrachoice : "spiritual flow",
				minlevel : 10
			}]
		},
		"subclassfeature17" : {
			name : "Master of the Elements",
			source : [["GMB:LL", 0]],
			minlevel : 17,
			description : desc(["As an action, I can take on an Elemental Form for up to 1 min, gaining the following benefits:",
				"\u2022 I gain a flying speed equal to my walking speed",
				"\u2022 I resist bludgeoning, piercing, and slashing damage",
				"\u2022 Critical hits against me become normal hits",
				"\u2022 Opportunity attacks against me have disadvantage",
				"\u2022 I can gain temp HP equal to my Wis mod (min 1) at the start of each of my turns",
				"It ends early if I end it as a bonus action or if I am incapacitated",
				"I can use this once per long rest, I can spend 6 Ki if I have no uses left"]),
			action : [["action", "Elemental Form (start)"], ["bonus action", "Elemental Form (end)"]],
			usages : 1,
			recovery : "long rest",
			dmgres : [["Bludgeoning", "Bludgeon. (in elem. form)"], ["Piercing", "Piercing (in elem. form)"], ["Slashing", "Slashing (in elem. form)"]],
		}
	}
})

// Edit official fighter regex to avoid conflict with astral warrior
if(ClassList["fighter"]) {
    ClassList["fighter"].regExpSearch = /^(?!.*(feral|tribal|dark|green|fey|horned|totem|spiritual|exalted|sacred|holy|divine|nature|odin|thor|nature|natural|green|beast|animal))(?=.*(fighter|militant|warlord|phalanx|gladiator|trooper)).*$/i
};

// Way of the Astral Warrior (astral self)
AddSubClass("monk(laserllama)", "way of the astral warrior", {
	regExpSearch : /astral warrior/i,
	subname : "Way of the Astral Warrior",
	fullname : "Astral Warrior",
	source : [["GMB:LL", 0]],
	features : {
		"subclassfeature3" : GetSubclassTechniques("Astral",["mystic healing","deflect missile","mantle of courtesy"]),
		"subclassfeature3.1" : {
			name : "Astral Self",
			source : [["GMB:LL", 0]],
			minlevel : 3,
			description : ' [2 ki; see 3rd page "Notes"]' + desc([
				"As a bonus action, I can use my ki to summon my astral self for 10 minutes"
			]),
			action : [["bonus action", " (summon/dismiss)"]],
			weaponsAdd : ["Astral Arms"],
			weaponOptions : {
				baseWeapon : "unarmed strike",
				regExpSearch : /^(?=.*\bastral\b)(?=.*\barms?\b).*$/i,
				name : "Astral Arms",
				source : [["T", 50]],
				ability : 5,
				range : "Melee (+5 ft)",
				damage : [1, "", "Force"],
				description : "+5 ft reach; Uses Str, Dex, or Wis",
				isAstralArms : true
			},
			"astral arms" : {
				name : "Astral arms",
				extraname : "Way of the Astral Warrior 3",
				source : [["GMB:LL", 0]],
				description : levels.map(function (n) {
					if (n < 10) { 
						return desc([
						"As a bonus action, I can summon my astral self as a luminescent set of armor",
						"When I summon them, all creatures of my choice I can see in 10 ft must make a Dex save",
						"If failed, they take twice my martial arts die in force damage",
						"I can use use Wisdom instead of Strength for Strength checks, saves and unarmed strikes",
						"I have +5 ft reach on attacks made with my astral self and they deal force damage",
						"This lasts for 10 minutes or until I'm incapacitated, die, or dismiss them"])
					} else {
						return desc([
						"As a bonus action, I can summon my astral self as a luminescent set of armor",
						"When I summon them, all creatures of my choice I can see in 10 ft must make a Dex save",
						"If failed, they take twice my martial arts die in force damage",
						"I can use use Wisdom instead of Strength for Strength checks, saves and unarmed strikes",
						"I have +5 ft reach on attacks made with my astral self and they deal force damage",
						"I can see normally in both magical and mundane darkness in a 120-foot radius",
						"This lasts for 10 minutes or until I'm incapacitated, die, or dismiss them"])
					}
				}),
				additional : levels.map(function (n) {
					return n < 3 ? "" : "2 ki point; 2d" + (n < 5 ? 6 : n < 11 ? 8 : n < 17 ? 10 : 12) + " force damage on summon";
				})
			},
			autoSelectExtrachoices : [{ extrachoice : "astral arms" }]
		},
		"subclassfeature6" : {
			name : "Astral Visage",
			source : [["GMB:LL", 0]],
			minlevel : 6,
			description : levels.map(function (n) {
				return desc(["I learn the thaumaturgy cantrip and Wisdom is my spellcasting modifier for it",
					"Whenever I make a Wis (Insight) or Cha (Intimidation) check, I add 1d"+(n < 5 ? 6 : n < 11 ? 8 : n < 17 ? 10 : 12)+" to my roll"])
			}),
			spellcastingBonus : [{
				name : "Astral Visage",
				spells : ["thaumaturgy"],
				selection : ["thaumaturgy"],
				firstCol : "atwill"
			}],
			vision : [["Astral sight (when summoned)", 120]]
		},
		"subclassfeature10" : {
			name : "Mystical Defense",
			source : [["GMB:LL", 0]],
			minlevel : 10,
			description : desc(["When I take acid, cold, fire, force, thunder, or lighting damage, I can use deflect missile",
				"If I reduce the damage to 0, I can make a ranged Martial Arts attack as part of the same reaction, which deals the triggering damage type on hit",
				"Once per turn when I hit with an unarmed strike with my Astral Self, I do additional damage"]),
			calcChanges : {
				atkAdd : [
					function (fields, v) {
						if (v.theWea.isAstralArms && classes.known["monk(laserllama)"] && classes.known["monk(laserllama)"].level) {
							var aMonkDie = function (n) { return (n < 5 ? 6 : n < 11 ? 8 : n < 17 ? 10 : 12) }(classes.known["monk(laserllama)"].level);
							fields.Description += (fields.Description ? '; ' : '') + 'Once per turn +1d' + aMonkDie + ' damage';
						}
					},
					"Once per turn when I hit a target with my astral self, I can add my martial arts die to the damage dealt."
				]
			}
		},
		"subclassfeature17" : {
			name : "Master Astral Warrior",
			source : [["GMB:LL", 0]],
			minlevel : 17,
			description : desc(["When my Astral Self is manifested, I gain resistance to all damage except force",
				"While summoned, I can unleash a barrage of punches in an adjacent 20 ft cone as an action",
				"Targets in that area must make a Dex save or take 4d12 force dmg (half on save)"]),
			dmgres : [["All -Force", "All -Force (astral self)"]],
			action : ["action", "Barrage of punches"],
			weaponsAdd : ["Barrage of punches"],
			weaponOptions : {
				regExpSearch : /^(?=.*barrage)(?=.*punches).*$/i,
				name : "Barrage of punches",
				source : [["GMB:LL", 0]],
				ability : 5,
				type : "Natural",
				damage : [4, 12, "Force"],
				range : "20-ft cone",
				description : "Hits all in area; Dex save for half damage",
				abilitytodamage : false,
				dc : true,
				useSpellMod : "monk(laserllama)"
			},
		}
	}
})

// Way of the Drunken Fist (drunken master)
AddSubClass("monk(laserllama)", "way of the drunken fist", {
	regExpSearch : /drunken fist/i,
	subname : "Way of the Drunken Fist",
	fullname : "Drunken Fist",
	source : [["GMB:LL", 0]],
	features : {
		"subclassfeature3" : GetSubclassTechniques("Drunken Fist",["step of the wind","deflect missile","heavenly step"]),
		"subclassfeature3.1" : {
			name : "Jovial Performer",
			source : [["GMB:LL", 0]],
			minlevel : 3,
			description : desc(["I gain proficiency in Performance, brewer's supplies, and with improvised weapons", 
				"Also, my attacks with improvised weapons count as Martial Arts attacks"]),
			skills : ["Performance"],
			toolProfs : ["Brewer's supplies"],
			weaponProfs : [false, false, ["Improvised weapons"]],
			calcChanges : {
				atkAdd : [
					function (fields, v) {
						if (((/improvised/i).test(v.WeaponName + v.baseWeaponName) || (/improvised weapon/i).test(v.theWea.type))) {
							v.theWea.monkweapon = true; // The lvl 1 feature eval handles the rest
						};
					},
					"I gain proficiency with improvised weapons, they count as Martial Arts attacks for me",
					1
				]
			}
		},
		"subclassfeature3.2" : {
			name : "Drunken Style",
			source : [["GMB:LL", 0]],
			minlevel : 3,
			description : desc(["For each unique creature I hit during my turn, my speed increases by 5 ft",
				"Creas I hit with Martial Arts have disadv. on opportunity attacks against me until my next turn"])
		},
		"subclassfeature6" : {
			name : "Unpredictable Sway",
			source : [["GMB:LL", 0]],
			minlevel : 6,
			description : desc(["Standing up from prone doesn't cost me any movement"]),
			"unpredictable sway (redirect)" : {
				name : "Unpredictable Sway",
				extraname : "Way of the Drunken Fist 6",
				source : ["GMB:LL"],
				description : desc("When a creature misses me with a melee attack, I can use my reaction to force it to attack a creature of my choice within 5 ft of me, that is also within range of its attack"),
				additional : "1 ki point",
				action : ["reaction", " (after missed in melee)"],
			},
			"chaotic luck" : {
				name : "Chaotic luck",
				extraname : "Way of the Drunken Fist 10",
				source : ["GMB:LL"],
				description : desc("I can cancel the disadvantage on one d20 roll (attack, check or save)"),
				additional : "1 ki point"
			},
			autoSelectExtrachoices : [{
				extrachoice : "unpredictable sway (redirect)"
			}, {
				extrachoice : "chaotic luck",
				minlevel : 10
			}]
		},
		"subclassfeature17" : {
			name : "Master of the Drunken Fist",
			source : [["GMB:LL", 0]],
			minlevel : 17,
			description : desc(["When I take the Attack action, I can make a single Martial Arts attack against each creature I move past that is within range of my unarmed strikes, beyond my normal amount of attacks"])
		}
	}
})

// Way of Radiance (sun soul)
AddSubClass("monk(laserllama)", "way of radiance", {
	regExpSearch : /radiance/i,
	subname : "Way of Radiance",
	fullname : "Radiance",
	source : [["GMB:LL", 0]],
	features : {
		// Override Ki adept because of the lvl 6 subclass feature
		"ki adept" : {
			name : "Ki Adept",
			source : ["GMB:LL"],
			minlevel : 11,
			description : desc("Once on my turn, I can use a Technique I know that costs 1 Ki Point, Flurry of Blows, or Searing Blast without spending Ki")
		},

		"subclassfeature3" : GetSubclassTechniques("Radiant",["step of the wind","deflect missile","indomitable spirit"]),
		"subclassfeature3.1" : {
			name : "Radiant Bolt",
			source : [["GMB:LL", 0]],
			minlevel : 3,
			description : desc(["I can replace any unarmed strike by a Radiant Bolt, which is a ranged martial arts attack",
				"I learn the light cantrip and use Wisdom as my spellcasting ability"]),
			weaponsAdd : ["Radiant Bolt"],
			weaponOptions : {
				regExpSearch : /^(?=.*radiant)(?=.*bolt).*$/i,
				name : "Radiant Bolt",
				source : [["GMB:LL", 0]],
				ability : 2,
				type : "Natural",
				damage : [1, 6, "radiant"],
				range : "30/90 ft",
				description : "Can be used instead of any unarmed strike",
				monkweapon : true,
				abilitytodamage : true
			},
			spellcastingBonus : {
				name : "Radiant Bolt",
				spells : ["light"],
				selection : ["light"]
			},

			"searing blast" : {
				name : "Searing Blast",
				extraname : "Way of Radiance 6",
				source : [["GMB:LL", 0]],
				description : levels.map(function (n) {
					var MartArtDie = (n < 5 ? 6 : n < 11 ? 8 : n < 17 ? 10 : 12);
					return desc(["As a bonus action, I can force all creatures within an adjacent 15 ft cone to make a Dex save or take 3d"+MartArtDie+" radiant damage (half on save)"])
				}),
				additional : "1 ki point",
				action : ["bonus action", ""],
				weaponsAdd : ["Searing Blast"],
				weaponOptions : {
					regExpSearch : /^(?=.*searing)(?=.*blast).*$/i,
					name : "Searing Blast",
					source : [["GMB:LL", 0]],
					ability : 5,
					type : "Natural",
					damage : [3, 8, "Radiant"],
					range : "15-ft cone",
					description : "Hits all in area; Dex save for half damage",
					abilitytodamage : false,
					dc : true,
					useSpellMod : "monk(laserllama)",
					isSearingBlast : true
				},
				calcChanges : {
					atkAdd : [
						function (fields, v) {
							if (v.theWea.isSearingBlast && classes.known["monk(laserllama)"] && classes.known["monk(laserllama)"].level) {
								var aMonkDie = function (n) { return (n < 5 ? 6 : n < 11 ? 8 : n < 17 ? 10 : 12) }(classes.known["monk(laserllama)"].level);
								fields.Damage_Die = "3d" + aMonkDie;
							}
						},
						"My Searing Blast feature uses my Martial Arts die to calculate the damage dealt",
						1
					]
				}
			},
			autoSelectExtrachoices : [{
				extrachoice : "searing blast",
				minlevel : 6
			}]
		},
		"subclassfeature10" : {
			name : "Luminous Burst",
			source : [["GMB:LL", 0]],
			minlevel : 10,
			description : levels.map(function (n) {
				var MartArtDie = (n < 5 ? 6 : n < 11 ? 8 : n < 17 ? 10 : 12);
				return desc(["As an action, I can unleash a blast in a 5 ft wide, 100 ft long line",
				"All creatures in range must make a Dex save or take 6d"+MartArtDie+" radiant damage (half on save)",
				"I can empower it by spending ki, up to my Wis mod: each ki spent adds 1d"+MartArtDie+" to the damage",
				"If I have no uses left, I can spend 3 ki to use it again"])
			}),
			usages : "Wisdom modifier per ",
			usagescalc : "event.value = Math.max(1, What('Wis Mod'));",
			recovery : "long rest",
			action : ["action", ""]
		},
		"subclassfeature17" : {
			name : "Master of Light",
			source : [["GMB:LL", 0]],
			minlevel : 17,
			description : desc(["I gain a flying speed equal to my movement speed",
				"I shed bright sunlight in a 30 ft radius and dim sunlight 30 ft beyond that (can enable/disable as bonus action)",
				"My Radiant Bolt, Searing Blast, and Luminous Burst features all count as true sunlight",
				"I gain resistance to necrotic damage, immunity to all radiant damage and being blinded"]),
			dmgres : ["Necrotic"],
			savetxt : {
				immune : ["Radiant damage", "blinded"]
			},
			speed : { fly : { spd : "walk", enc : "walk" } },
			action: ["bonus action", "Shed sunlight (enable/disable)"],
			calcChanges : {
				atkAdd : [
					function (fields, v) {
						if ((v.theWea.isSearingBlast || ((/radiant bolt/i).test(v.WeaponName + v.baseWeaponName) || (/radiant bolt/i).test(v.theWea.type)))) {
							fields.Description += (fields.Description ? '; ' : '') + "Counts as true sunlight"
						}
					},
					"My Radiant Bolt, Searing Blast, and Luminous Burst features all count as true sunlight",
					1
				]
			}
		}
	}
})

// Way of the Reaper (long death)
AddSubClass("monk(laserllama)", "way of the reaper", {
	regExpSearch : /reaper/i,
	subname : "Way of the Reaper",
	fullname : "Reaper",
	source : [["GMB:LL", 0]],
	features : {
		// Override Ki adept because of the lvl 3 subclass feature
		"ki adept" : {
			name : "Ki Adept",
			source : ["GMB:LL"],
			minlevel : 11,
			description : desc("Once on my turn, I can use a Technique I know that costs 1 Ki Point, Flurry of Blows, or Frightful Touch without spending Ki")
		},

		"subclassfeature3" : GetSubclassTechniques("Reaper",["crippling strike","slowing strike","aura sight"]),
		"subclassfeature3.1" : {
			name : "Necrotic Spirit",
			source : [["GMB:LL", 0]],
			minlevel : 3,
			description : desc(["I can cause my unarmed strikes to deal necrotic damage in place of bludgeoning",
				"I am resistant to necrotic damage and have advantage on saves vs being frightened"]),
			dmgres : ["Necrotic"],
			savetxt : {
				adv_vs : ["frightened"]
			},

			"frightful touch" : {
				name : "Frightful Touch",
				extraname : "Way of the Reaper 3",
				source : [["GMB:LL", 0]],
				description : desc("When I hit a creature with a Martial Arts attack, I can force it to make a Wisdom save or be frightened of me until the start of my next turn"),
				additional : "1 ki point"
			},
			autoSelectExtrachoices : [{
				extrachoice : "frightful touch",
				minlevel : 3
			}]
		},
		"subclassfeature6" : {
			name : "Sinister Vitality",
			source : [["GMB:LL", 0]],
			minlevel : 6,
			description : desc(["As a bonus action, I can grant myself temp HP equal to my Wisdom modifier (min 1)",
				"While those last, I am resistant to non-magical bludgeoning, piercing, and slashing damage"]),
			action : ["bonus action", ""]
		},
		"subclassfeature10" : {
			name : "Armor of the Grave",
			source : [["GMB:LL", 0]],
			minlevel : 10,
			description : desc(["If I am reduced to 0 HP but not killed outright, I can spend 1 Ki Point to fall to 1 HP instead",
				"Each subsequent time I use this before finishing a long rest, I must spend 1 additional Ki"]),
			usages : "-",
			recovery : "long rest"
		},
		"subclassfeature17" : {
			name : "Master of Death",
			source : [["GMB:LL", 0]],
			minlevel : 17,
			description : desc(["When taking the Attack action, I can replace one of my attacks by a special effect",
				"I touch a crea and expend up to 10 ki; It must make a Con save (disadv if frightened of me)",
				"It takes 2d10 necrotic damage for each ki spent (half on save)"]),
		}
	}
})

// Way of the Wuxia (Kensei)
RunFunctionAtEnd(function () { // The RunFunctionAtEnd is there to make sure we take into account all weapon types for the lvl 3 feature
	var theKenseiSubclassName = AddSubClass("monk(laserllama)", "way of the wuxia", {
		regExpSearch : /wuxia/i,
		subname : "Way of the Wuxia",
		source : ["GMB:LL"],
		fullname : "Wuxia",
		features : {
			"subclassfeature3" : GetSubclassTechniques("Wuxia",["patient defense","seeking strike","heavenly step"]),
			"subclassfeature3.1" : {
				name : "Student of Steel",
				source : ["GMB:LL"],
				minlevel : 3,
				description : desc([
					"Some weapons, that don't have the heavy or special property, are Wuxia weapons for me",
					"At least one ranged and one melee weapon, more at higher levels",
					"With these: proficient, count as a monk weapons, special bonuses:",
					"\u2022 Masterful Aim: As a bonus action on my turn, I can focus and for the next Wuxia Weapon attack roll I make before the end of my current turn, I can treat a d20 roll of 7 or lower as an 8",
					"\u2022 Masterful Parry: When hit in melee by a creature I can see while wielding a melee Wuxia weapon, I can use a reaction to add my Wis mod (min of +1) to my AC against that attack"
				]),
				action: [["bonus action", "Masterful Aim"], ["reaction", "Masterful Parry"]],
				additional : levels.map( function(n) { return n < 3 ? "" : (n < 6 ? 2 : n < 11 ? 3 : n < 17 ? 4 : 5) + " wuxia weapons"; }),
				extraname : "Wuxia Weapon",
				extrachoices : [], // add these dynamically, see below
				extraTimes : levels.map( function(n) { return n < 3 ? 0 : n < 6 ? 2 : n < 11 ? 3 : n < 17 ? 4 : 5; }),
				calcChanges : {
					atkAdd : [
						function (fields, v) {
							var theKenseiWeapons = GetFeatureChoice("class", "monk(laserllama)", "subclassfeature3.1", true);
							if (theKenseiWeapons.indexOf(v.baseWeaponName) != -1 || ((/wuxia/i).test(v.WeaponTextName) && !v.theWea.special && (!(/heavy|special/i).test(fields.Description)))) {
								v.theWea.monkweapon = true;
								v.theWea.kenseiweapon = true;
								fields.Proficiency = true;
							};
						},
						"For the weapons that I select using the \"Choose Feature\" button on the second page or when I include the word 'Wuxia' in the name of a weapon that doesn't have the Heavy or Special attribute, that weapon gains the same benefits as any other 'Monk Weapon'",
						1
					]
				}
			},
			"enlightened fist" : {
				name : "Ki-Infused Weapons",
				source : ["GMB:LL"],
				minlevel : 6,
				description : desc(["My unarmed strikes and Wuxia weapon attacks count as magical", "When I use Flurry of Blows, I can replace unarmed strikes with melee Wuxia Weapon attacks"]),
				calcChanges : {
					atkAdd : [
						function (fields, v) {
							if (!v.isSpell && !v.thisWeapon[1] && !v.theWea.isMagicWeapon && !(/counts as( a)? magical/i).test(fields.Description) && (v.baseWeaponName === "unarmed strike" || v.theWea.kenseiweapon)) {
								fields.Description += (fields.Description ? '; ' : '') + 'Counts as magical';
							};
						},
						"My unarmed strikes and any Wuxia Weapons count as magical for overcoming resistances and immunities."
					]
				},
				"deft strike" : {
					name : "Deft Strike",
					extraname : "Way of the Wuxia 6",
					source : ["GMB:LL"],
					description : "\n   " + "Once per turn when I hit with a Wuxia weapon, I can do a martial arts die extra damage",
					additional : "1 ki point"
				},
				"spirit blade" : {
					name : "Spirit Blade",
					extraname : "Way of the Wuxia 10",
					source : ["GMB:LL"],
					description : desc([
						"As a bonus action, I can increase the crit range of my Wuxia weapon",
						"This bonus is equal to the number of ki points I spend and doesn't stack with magic",
						"This lasts only works for me and lasts for 1 minute or until I use this feature again"
					]),
					additional : "1 to 3 ki points",
					action : ["bonus action", ""]
				},
				autoSelectExtrachoices : [{
					extrachoice : "deft strike"
				}, {
					extrachoice : "spirit blade",
					minlevel : 10
				}]
			},
			"subclassfeature17" : {
				name : "Master of Steel",
				source : ["GMB:LL"],
				minlevel : 17,
				description : desc(["Once per short rest, I can use my monk level instead of rolling the d20 for an attack"]),
				recovery : "short rest",
            	usages : 1
			}
		}
	});

	var itsFea = ClassSubList[theKenseiSubclassName].features["subclassfeature3.1"];
	for (var weapon in WeaponsList) {
		var aWea = WeaponsList[weapon];
		// skip attacks that are not simple or martial weapons, that have the heavy or special property, are magic weapons, or those that are spells or cantrips
		if ((aWea.isMagicWeapon || !(/simple|martial/i).test(aWea.type) || (/heavy|special/i).test(aWea.description) || aWea.special || (/spell|cantrip/i).test(aWea.list))) continue;
		itsFea.extrachoices.push(aWea.name);
		itsFea[aWea.name.toLowerCase()] = {
			name : aWea.name,
			description : "",
			source : aWea.source,
			weaponProfs : [false, false, [weapon]],
			weaponsAdd : [aWea.name],
			submenu : ((/simple/i).test(aWea.type) ? "\x1BSimple weapon, " : "Martial weapon, ") + ((/^(?!.*melee).*\d+.*$/i).test(aWea.range) ? "ranged" : "melee"),
			prereqeval : 'testSource("' + weapon + '", WeaponsList["' + weapon + '"], "weapExcl") ? "skip" : true;'
		}
	}
});

// Way of the Rising Dragon (ascendant dragon)
AddSubClass("monk(laserllama)", "way of the rising dragon", {
	regExpSearch : /rising dragon/i,
	subname : "Way of the Rising Dragon",
	fullname : "Rising Dragon",
	source : [["GMB:LL", 0]],
	features : {
		// Override Ki adept because of the lvl 3 subclass feature
		"ki adept" : {
			name : "Ki Adept",
			source : ["GMB:LL"],
			minlevel : 11,
			description : desc("Once on my turn, I can use a Technique I know that costs 1 Ki Point, Flurry of Blows, or Elemental Breath without spending Ki")
		},

		"subclassfeature3" : GetSubclassTechniques("Rising Dragon",["step of the wind","deflect missile","indomitable spirit"]),
		"subclassfeature3.1" : {
			name : "Draconic Disciple",
			source : [["GMB:LL", 0]],
			minlevel : 3,
			description : desc([
				'Choose a Dragon Affinity using the "Choose Feature" button above; I learn Draconic',
			]),
			languageProfs : ["Draconic"],
			choices: ["Black Dragon Affinity", "Blue Dragon Affinity", "Brass Dragon Affinity", "Bronze Dragon Affinity", "Copper Dragon Affinity", 
				"Gold Dragon Affinity", "Green Dragon Affinity", "Red Dragon Affinity", "Silver Dragon Affinity", "White Dragon Affinity",
				"Amethyst Dragon Affinity", "Crystal Dragon Affinity", "Emerald Dragon Affinity", "Sapphire Dragon Affinity", "Steel Dragon Affinity", "Topaz Dragon Affinity"],
			"black dragon affinity" : {
				name : "Black Dragon Affinity",
				submenu : "Chromatic dragons",
				description : desc([
					"I have an affinity with black dragons, which are affiliated with acid and I learn draconic",
					"Whenever I hit with an unarmed strike, I can deal acid damage instead of bludg damage"
				]),
				dependentChoices : "acid"
			},
			"blue dragon affinity" : {
				name : "Blue Dragon Affinity",
				submenu : "Chromatic dragons",
				description : desc([
					"I have an affinity with blue dragons, which are affiliated with lightning and I learn draconic",
					"Whenever I hit with an unarmed strike, I can deal lightning damage instead of bludg damage"
				]),
				dependentChoices : "lightning"
			},
			"brass dragon affinity" : {
				name : "Brass Dragon Affinity",
				submenu : "Metallic dragons",
				description : desc([
					"I have an affinity with brass dragons, which are affiliated with fire and I learn draconic",
					"Whenever I hit with an unarmed strike, I can deal fire damage instead of bludg damage"
				]),
				dependentChoices : "fire"
			},
			"bronze dragon affinity" : {
				name : "Bronze Dragon Affinity",
				submenu : "Metallic dragons",
				description : desc([
					"I have an affinity with bronze dragons, which are affiliated with lightning and I learn draconic",
					"Whenever I hit with an unarmed strike, I can deal lightning damage instead of bludg damage"
				]),
				dependentChoices : "lightning"
			},
			"copper dragon affinity" : {
				name : "Copper Dragon Affinity",
				submenu : "Metallic dragons",
				description : desc([
					"I have an affinity with copper dragons, which are affiliated with acid and I learn draconic",
					"Whenever I hit with an unarmed strike, I can deal acid damage instead of bludg damage"
				]),
				dependentChoices : "acid"
			},
			"gold dragon affinity" : {
				name : "Gold Dragon Affinity",
				submenu : "Metallic dragons",
				description : desc([
					"I have an affinity with gold dragons, which are affiliated with fire and I learn draconic",
					"Whenever I hit with an unarmed strike, I can deal fire damage instead of bludg damage"
				]),
				dependentChoices : "fire"
			},
			"green dragon affinity" : {
				name : "Green Dragon Affinity",
				submenu : "Chromatic dragons",
				description : desc([
					"I have an affinity with green dragons, which are affiliated with poison and I learn draconic",
					"Whenever I hit with an unarmed strike, I can deal poison damage instead of bludg damage"
				]),
				dependentChoices : "poison"
			},
			"red dragon affinity" : {
				name : "Red Dragon Affinity",
				submenu : "Chromatic dragons",
				description : desc([
					"I have an affinity with red dragons, which are affiliated with fire and I learn draconic",
					"Whenever I hit with an unarmed strike, I can deal fire damage instead of bludg damage"
				]),
				dependentChoices : "fire"
			},
			"silver dragon affinity" : {
				name : "Silver Dragon Affinity",
				submenu : "Metallic dragons",
				description : desc([
					"I have an affinity with silver dragons, which are affiliated with cold and I learn draconic",
					"Whenever I hit with an unarmed strike, I can deal cold damage instead of bludg damage"
				]),
				dependentChoices : "cold"
			},
			"white dragon affinity" : {
				name : "White Dragon Affinity",
				submenu : "Chromatic dragons",
				description : desc([
					"I have an affinity with white dragons, which are affiliated with cold and I learn draconic",
					"Whenever I hit with an unarmed strike, I can deal cold damage instead of bludg damage"
				]),
				dependentChoices : "cold"
			},
			"amethyst dragon affinity" : {
				name : "Amethyst Dragon Affinity",
				submenu : "Gem dragons",
				description : desc([
					"I have an affinity with amethyst dragons, which are affiliated with force and I learn draconic",
					"Whenever I hit with an unarmed strike, I can deal force damage instead of bludg damage"
				]),
				dependentChoices : "force"
			},
			"crystal dragon affinity" : {
				name : "Crystal Dragon Affinity",
				submenu : "Gem dragons",
				description : desc([
					"I have an affinity with crystal dragons, which are affiliated with radiance and I learn draconic",
					"Whenever I hit with an unarmed strike, I can deal radiant damage instead of bludg damage"
				]),
				dependentChoices : "radiant"
			},
			"emerald dragon affinity" : {
				name : "Emerald Dragon Affinity",
				submenu : "Gem dragons",
				description : desc([
					"I have an affinity with emerald dragons, which are affiliated with psychic and I learn draconic",
					"Whenever I hit with an unarmed strike, I can deal psychic damage instead of bludg damage"
				]),
				dependentChoices : "psychic"
			},
			"sapphire dragon affinity" : {
				name : "Sapphire Dragon Affinity",
				submenu : "Gem dragons",
				description : desc([
					"I have an affinity with sapphire dragons, which are affiliated with thunder and I learn draconic",
					"Whenever I hit with an unarmed strike, I can deal thunder damage instead of bludg damage"
				]),
				dependentChoices : "thunder"
			},
			"steel dragon affinity" : {
				name : "Steel Dragon Affinity",
				submenu : "Metallic dragons", // Laserllama classified them under Gem dragons, but Steel dragons are Metallic dragons
				// Source: https://forgottenrealms.fandom.com/wiki/Steel_dragon
				description : desc([
					"I have an affinity with sapphire dragons, which are affiliated with acid and I learn draconic",
					"Whenever I hit with an unarmed strike, I can deal acid damage instead of bludg damage"
				]),
				dependentChoices : "acid"
			},
			"topaz dragon affinity" : {
				name : "Topaz Dragon Affinity",
				submenu : "Gem dragons",
				description : desc([
					"I have an affinity with topaz dragons, which are affiliated with necrotic and I learn draconic",
					"Whenever I hit with an unarmed strike, I can deal necrotic damage instead of bludg damage"
				]),
				dependentChoices : "necrotic"
			},
			choiceDependencies : [{
				feature : "subclassfeature3.2", // share the choice with the one for those features
				choiceAttribute : true // means it uses the dependentChoices attribute instead of the same choice (eg "acid" instead of "black dragon affinity")
			}, {
				feature : "subclassfeature10",
				choiceAttribute : true
			}]
		},
		"subclassfeature3.2" : {
			name : "Elemental Breath",
			source : [["GMB:LL", 0]],
			minlevel : 3,
			description : levels.map(function (n) {
				var MartArtDie = (n < 5 ? 6 : n < 11 ? 8 : n < 17 ? 10 : 12);
				var BreathRange = (n < 17 ? "20-foot cone or a 30-foot long, 5-foot wide line" : "30-foot cone or a 60-foot long, 5-foot wide line")

				return desc(["When I take the Attack action, I can spend 1 Ki to replace one attack with a breath weapon",
					"I do so either in an adjacent " + BreathRange,
					"Creatures in the area must make a Dex save or take 2d"+MartArtDie + (n < 10 ? "" : " + my Wis mod") +" Elemental damage (half on save)",
					"I can spend additional ki (up to my Wis mod) to add 1d"+MartArtDie+" to the damage per ki spent"])
			}),

			choices: ["acid", "cold", "fire", "lightning", "poison", 
				"force","radiant","psychic","thunder","necrotic"],
			choicesNotInMenu : true,
			"acid" : {
				name : "Acid Elemental Breath",
				description : levels.map(function (n) {
					var MartArtDie = (n < 5 ? 6 : n < 11 ? 8 : n < 17 ? 10 : 12);
					var BreathRange = (n < 17 ? "20-foot cone or a 30-foot long, 5-foot wide line" : "30-foot cone or a 60-foot long, 5-foot wide line")

					return desc(["When I take the Attack action, I can spend 1 Ki to replace one attack with a breath weapon",
						"I do so either in an adjacent " + BreathRange,
						"Creatures in the area must make a Dex save or take 2d"+MartArtDie + (n < 10 ? "" : " + my Wis mod") +" acid damage (half on save)",
						"I can spend additional ki (up to my Wis mod) to add 1d"+MartArtDie+" to the damage per ki spent"])
				})
			},
			"cold" : {
				name : "Cold Elemental Breath",
				description : levels.map(function (n) {
					var MartArtDie = (n < 5 ? 6 : n < 11 ? 8 : n < 17 ? 10 : 12);
					var BreathRange = (n < 17 ? "20-foot cone or a 30-foot long, 5-foot wide line" : "30-foot cone or a 60-foot long, 5-foot wide line")

					return desc(["When I take the Attack action, I can spend 1 Ki to replace one attack with a breath weapon",
						"I do so either in an adjacent " + BreathRange,
						"Creatures in the area must make a Dex save or take 2d"+MartArtDie + (n < 10 ? "" : " + my Wis mod") +" cold damage (half on save)",
						"I can spend additional ki (up to my Wis mod) to add 1d"+MartArtDie+" to the damage per ki spent"])
				})
			},
			"fire" : {
				name : "Fire Elemental Breath",
				description : levels.map(function (n) {
					var MartArtDie = (n < 5 ? 6 : n < 11 ? 8 : n < 17 ? 10 : 12);
					var BreathRange = (n < 17 ? "20-foot cone or a 30-foot long, 5-foot wide line" : "30-foot cone or a 60-foot long, 5-foot wide line")

					return desc(["When I take the Attack action, I can spend 1 Ki to replace one attack with a breath weapon",
						"I do so either in an adjacent " + BreathRange,
						"Creatures in the area must make a Dex save or take 2d"+MartArtDie + (n < 10 ? "" : " + my Wis mod") +" fire damage (half on save)",
						"I can spend additional ki (up to my Wis mod) to add 1d"+MartArtDie+" to the damage per ki spent"])
				})
			},
			"lightning" : {
				name : "Lightning Elemental Breath",
				description : levels.map(function (n) {
					var MartArtDie = (n < 5 ? 6 : n < 11 ? 8 : n < 17 ? 10 : 12);
					var BreathRange = (n < 17 ? "20-foot cone or a 30-foot long, 5-foot wide line" : "30-foot cone or a 60-foot long, 5-foot wide line")

					return desc(["When I take the Attack action, I can spend 1 Ki to replace one attack with a breath weapon",
						"I do so either in an adjacent " + BreathRange,
						"Creatures in the area must make a Dex save or take 2d"+MartArtDie + (n < 10 ? "" : " + my Wis mod") +" lightning damage (half on save)",
						"I can spend additional ki (up to my Wis mod) to add 1d"+MartArtDie+" to the damage per ki spent"])
				})
			},
			"poison" : {
				name : "Poison Elemental Breath",
				description : levels.map(function (n) {
					var MartArtDie = (n < 5 ? 6 : n < 11 ? 8 : n < 17 ? 10 : 12);
					var BreathRange = (n < 17 ? "20-foot cone or a 30-foot long, 5-foot wide line" : "30-foot cone or a 60-foot long, 5-foot wide line")

					return desc(["When I take the Attack action, I can spend 1 Ki to replace one attack with a breath weapon",
						"I do so either in an adjacent " + BreathRange,
						"Creatures in the area must make a Dex save or take 2d"+MartArtDie + (n < 10 ? "" : " + my Wis mod") +" poison damage (half on save)",
						"I can spend additional ki (up to my Wis mod) to add 1d"+MartArtDie+" to the damage per ki spent"])
				})
			},
			"force" : {
				name : "Force Elemental Breath",
				description : levels.map(function (n) {
					var MartArtDie = (n < 5 ? 6 : n < 11 ? 8 : n < 17 ? 10 : 12);
					var BreathRange = (n < 17 ? "20-foot cone or a 30-foot long, 5-foot wide line" : "30-foot cone or a 60-foot long, 5-foot wide line")

					return desc(["When I take the Attack action, I can spend 1 Ki to replace one attack with a breath weapon",
						"I do so either in an adjacent " + BreathRange,
						"Creatures in the area must make a Dex save or take 2d"+MartArtDie + (n < 10 ? "" : " + my Wis mod") +" force damage (half on save)",
						"I can spend additional ki (up to my Wis mod) to add 1d"+MartArtDie+" to the damage per ki spent"])
				})
			},
			"radiant" : {
				name : "Radiant Elemental Breath",
				description : levels.map(function (n) {
					var MartArtDie = (n < 5 ? 6 : n < 11 ? 8 : n < 17 ? 10 : 12);
					var BreathRange = (n < 17 ? "20-foot cone or a 30-foot long, 5-foot wide line" : "30-foot cone or a 60-foot long, 5-foot wide line")

					return desc(["When I take the Attack action, I can spend 1 Ki to replace one attack with a breath weapon",
						"I do so either in an adjacent " + BreathRange,
						"Creatures in the area must make a Dex save or take 2d"+MartArtDie + (n < 10 ? "" : " + my Wis mod") +" radiant damage (half on save)",
						"I can spend additional ki (up to my Wis mod) to add 1d"+MartArtDie+" to the damage per ki spent"])
				})
			},
			"psychic" : {
				name : "Psychic Elemental Breath",
				description : levels.map(function (n) {
					var MartArtDie = (n < 5 ? 6 : n < 11 ? 8 : n < 17 ? 10 : 12);
					var BreathRange = (n < 17 ? "20-foot cone or a 30-foot long, 5-foot wide line" : "30-foot cone or a 60-foot long, 5-foot wide line")

					return desc(["When I take the Attack action, I can spend 1 Ki to replace one attack with a breath weapon",
						"I do so either in an adjacent " + BreathRange,
						"Creatures in the area must make a Dex save or take 2d"+MartArtDie + (n < 10 ? "" : " + my Wis mod") +" psychic damage (half on save)",
						"I can spend additional ki (up to my Wis mod) to add 1d"+MartArtDie+" to the damage per ki spent"])
				})
			},
			"thunder" : {
				name : "Thunder Elemental Breath",
				description : levels.map(function (n) {
					var MartArtDie = (n < 5 ? 6 : n < 11 ? 8 : n < 17 ? 10 : 12);
					var BreathRange = (n < 17 ? "20-foot cone or a 30-foot long, 5-foot wide line" : "30-foot cone or a 60-foot long, 5-foot wide line")

					return desc(["When I take the Attack action, I can spend 1 Ki to replace one attack with a breath weapon",
						"I do so either in an adjacent " + BreathRange,
						"Creatures in the area must make a Dex save or take 2d"+MartArtDie + (n < 10 ? "" : " + my Wis mod") +" thunder damage (half on save)",
						"I can spend additional ki (up to my Wis mod) to add 1d"+MartArtDie+" to the damage per ki spent"])
				})
			},
			"necrotic" : {
				name : "Thunder Elemental Breath",
				description : levels.map(function (n) {
					var MartArtDie = (n < 5 ? 6 : n < 11 ? 8 : n < 17 ? 10 : 12);
					var BreathRange = (n < 17 ? "20-foot cone or a 30-foot long, 5-foot wide line" : "30-foot cone or a 60-foot long, 5-foot wide line")

					return desc(["When I take the Attack action, I can spend 1 Ki to replace one attack with a breath weapon",
						"I do so either in an adjacent " + BreathRange,
						"Creatures in the area must make a Dex save or take 2d"+MartArtDie + (n < 10 ? "" : " + my Wis mod") +" necrotic damage (half on save)",
						"I can spend additional ki (up to my Wis mod) to add 1d"+MartArtDie+" to the damage per ki spent"])
				})
			}
		},
		"subclassfeature3.3" : {
			name : "Additional proficiency",
			source : [["GMB:LL", 0]],
			minlevel : 3,
			description : desc("I gain an additional proficiency (Intimidation or Persuasion) and add my Wis mod to any Charisma checks using that proficiency"),
			choices : ["Intimidation proficiency", "Persuasion proficiency"],
			"intimidation proficiency" : {
				name : "Additional proficiency",
				description : desc("I am proficient in Intimidation and add my Wis mod to any Charisma (Intimidation) checks"),
				skills : ["Intimidation"],
				addMod : { type : "skill", field : "Intimidation", mod : "Wis", text : "I add my Wisdom modifier to any Charisma (Intimidation) checks I make" }
			},
			"persuasion proficiency" : {
				name : "Additional proficiency",
				description : desc("I am proficient in Persuasion and add my Wis mod to any Charisma (Persuasion) checks"),
				skills : ["Persuasion"],
				addMod : { type : "skill", field : "Persuasion", mod : "Wis", text : "I add my Wisdom modifier to any Charisma (Persuasion) checks I make" }
			},
		},
		"subclassfeature6" : {
			name : "Ascendant Step",
			source : [["GMB:LL", 0]],
			minlevel : 6,
			description : desc(["When I use step of the wind, I gain a fly speed equal to my walk spd until the end of my turn"])
		},
		"subclassfeature10" : {
			name : "Draconic Mantle",
			source : [["GMB:LL", 0]],
			minlevel : 10,
			description : levels.map(function (n) {
				var MantleRange = (n < 17 ? 10 : 30);

				return desc(["Me and creatures of my choice within "+MantleRange+" ft of me have resistance to my Element and adv. on save vs charmed or frightened"])
			}),
			savetxt : { adv_vs : ["charmed", "frightened"] },

			choices: ["acid", "cold", "fire", "lightning", "poison", 
				"force","radiant","psychic","thunder","necrotic"],
			choicesNotInMenu : true,
			"acid" : {
				name : "Acid Draconic Mantle",
				description : levels.map(function (n) {
					var MantleRange = (n < 17 ? 10 : 30);

					return desc(["Me and creatures of my choice within "+MantleRange+" ft of me have resistance to Acid damage and adv. on save vs charmed or frightened"])
				}),
				dmgres : ["Acid"]
			},
			"cold" : {
				name : "Cold Draconic Mantle",
				description : levels.map(function (n) {
					var MantleRange = (n < 17 ? 10 : 30);

					return desc(["Me and creatures of my choice within "+MantleRange+" ft of me have resistance to Cold damage and adv. on save vs charmed or frightened"])
				}),
				dmgres : ["Cold"]
			},
			"fire" : {
				name : "Fire Draconic Mantle",
				description : levels.map(function (n) {
					var MantleRange = (n < 17 ? 10 : 30);

					return desc(["Me and creatures of my choice within "+MantleRange+" ft of me have resistance to Fire damage and adv. on save vs charmed or frightened"])
				}),
				dmgres : ["Fire"]
			},
			"lightning" : {
				name : "Lightning Draconic Mantle",
				description : levels.map(function (n) {
					var MantleRange = (n < 17 ? 10 : 30);

					return desc(["Me and creatures of my choice within "+MantleRange+" ft of me have resistance to Lightning damage and adv. on save vs charmed or frightened"])
				}),
				dmgres : ["Lightning"]
			},
			"poison" : {
				name : "Poison Draconic Mantle",
				description : levels.map(function (n) {
					var MantleRange = (n < 17 ? 10 : 30);

					return desc(["Me and creatures of my choice within "+MantleRange+" ft of me have resistance to Poison damage and adv. on save vs charmed or frightened"])
				}),
				dmgres : ["Poison"]
			},
			"force" : {
				name : "Force Draconic Mantle",
				description : levels.map(function (n) {
					var MantleRange = (n < 17 ? 10 : 30);

					return desc(["Me and creatures of my choice within "+MantleRange+" ft of me have resistance to Force damage and adv. on save vs charmed or frightened"])
				}),
				dmgres : ["Force"]
			},
			"radiant" : {
				name : "Radiant Draconic Mantle",
				description : levels.map(function (n) {
					var MantleRange = (n < 17 ? 10 : 30);

					return desc(["Me and creatures of my choice within "+MantleRange+" ft of me have resistance to Radiant damage and adv. on save vs charmed or frightened"])
				}),
				dmgres : ["Radiant"]
			},
			"psychic" : {
				name : "Psychic Draconic Mantle",
				description : levels.map(function (n) {
					var MantleRange = (n < 17 ? 10 : 30);

					return desc(["Me and creatures of my choice within "+MantleRange+" ft of me have resistance to Psychic damage and adv. on save vs charmed or frightened"])
				}),
				dmgres : ["Psychic"]
			},
			"thunder" : {
				name : "Thunder Draconic Mantle",
				description : levels.map(function (n) {
					var MantleRange = (n < 17 ? 10 : 30);

					return desc(["Me and creatures of my choice within "+MantleRange+" ft of me have resistance to Thunder damage and adv. on save vs charmed or frightened"])
				}),
				dmgres : ["Thunder"]
			},
			"necrotic" : {
				name : "Necrotic Draconic Mantle",
				description : levels.map(function (n) {
					var MantleRange = (n < 17 ? 10 : 30);

					return desc(["Me and creatures of my choice within "+MantleRange+" ft of me have resistance to Necrotic damage and adv. on save vs charmed or frightened"])
				}),
				dmgres : ["Necrotic"]
			},
		},
		"subclassfeature17" : {
			name : "Master of Draconic Might",
			source : [["GMB:LL", 0]],
			minlevel : 17,
			description : desc(["I manifest leathery draconic wings which grant me a fly speed equal to my walking speed"]),
			speed : { fly : { spd : "walk", enc : "walk" } }
		}
	}
})

// Way of Yin & Yang (mercy)
AddSubClass("monk(laserllama)", "way of ying and yang", {
	regExpSearch : /^(?=.*ying)(?=.*yang).*$/i,
	subname : "Way of Ying and Yang",
	fullname : "Ying and Yang",
	source : [["GMB:LL", 0]],
	features : {
		// Override Ki adept because of the lvl 3 subclass feature
		"ki adept" : {
			name : "Ki Adept",
			source : ["GMB:LL"],
			minlevel : 11,
			description : desc("Once on my turn, I can use a Technique I know that costs 1 Ki Point, Flurry of Blows, Touch of Life or Touch of Death without spending Ki")
		},

		"subclassfeature3" : GetSubclassTechniques("Yin and Yang",["mystic healing","gentling touch","mantle of courtesy"]),
		"subclassfeature3.1" : {
			name : "Monastic Healer",
			source : [["GMB:LL", 0]],
			minlevel : 3,
			description : levels.map(function (n) {
				var MartArtDie = (n < 5 ? 6 : n < 11 ? 8 : n < 17 ? 10 : 12);

				return desc("I gain proficiency with Insight, Medicine, and herbalism kit; I add 1d"+MartArtDie+" to those checks")
			}),
			skills : ["Insight", "Medicine"],
			toolProfs : ["Herbalism kit"],

			"touch of life" : {
				name : "Touch of Life",
				extraname : "Way of Ying and Yang 3",
				source : [["GMB:LL", 0]],
				description : levels.map(function (n) {
					var MartArtDie = (n < 5 ? 6 : n < 11 ? 8 : n < 17 ? 10 : 12);

					if (n < 6) {
						return desc("Instead of an unarmed strike, I can heal another creature for 1d"+MartArtDie+" + my Wis mod")
					}

					if (n < 11) {
						return desc(["Instead of an unarmed strike, I can heal another creature for 1d"+MartArtDie+" + my Wis mod",
						"I can also end one of the following: blinded, deafened, paralyzed, poisoned, or stunned"]);
					}

					return desc(["Instead of an unarmed strike, I can heal another creature for 1d"+MartArtDie+" + my Wis mod",
						"I can also end one of the following: blinded, deafened, paralyzed, poisoned, or stunned",
						"If using this feature with Ki Adept, I instead grant temp HP"])
				}),
				additional : "1 ki point"
			},
			"touch of death" : {
				name : "Touch of Death",
				extraname : "Way of Ying and Yang 3",
				source : [["GMB:LL", 0]],
				description : levels.map(function (n) {
					var MartArtDie = (n < 5 ? 6 : n < 11 ? 8 : n < 17 ? 10 : 12);

					if (n < 6) return desc("When hitting a creature with an unarmed strike, deal 1d"+MartArtDie+" additional necrotic damage");
					return desc(["When hitting a creature with an unarmed strike, deal 1d"+MartArtDie+" additional necrotic damage",
						"I can also choose to poison the target until the beginning of my next turn"]);
				}),
				additional : "1 ki point"
			},
			autoSelectExtrachoices : [{
				extrachoice : "touch of life",
				minlevel : 3
			}, {
				extrachoice : "touch of death",
				minlevel : 3
			}]
		},
		"subclassfeature10" : {
			name : "Mystical Touch",
			source : [["GMB:LL", 0]],
			minlevel : 10,
			description : levels.map(function (n) {
				var MartArtDie = (n < 5 ? 6 : n < 11 ? 8 : n < 17 ? 10 : 12);

				return desc(["Whenever I use Touch of Life or Touch of Death, I can expend additional Ki to empower it",
				"Doing so increases the healing/damage by 1d"+MartArtDie+" for each ki expended, up to my Wis mod"])
			})
		},
		"subclassfeature17" : {
			name : "Master of Life and Death",
			source : [["GMB:LL", 0]],
			minlevel : 17,
			description : desc(["As an action, I can spend 6 Ki Points and touch a creature that has died within 24h",
				"I instantly restore it to life with a number of HP equal to my Monk level + my Wis mod",
				"Any conditions afflicting the creature at the time of its death are also ended"]),
			action : ["action", ""]
		}
	}
})

// Way of the Boulder
AddSubClass("monk(laserllama)", "way of the boulder", {
	regExpSearch : /boulder/i,
	subname : "Way of the Boulder",
	fullname : "Boulder",
	source : [["GMB:LL", 0]],
	features : {
		// Override unarmoured defense because of Solid Body
		"unarmored defense" : {
			name : "Unarmored Defense",
			source : ["GMB:LL"],
			minlevel : 1,
			description : levels.map(function (n) {
				if (n < 3) return desc("Without armor and no shield, my AC is 10 + Dexterity modifier + Wisdom modifier");

				return desc("Without armor and no shield, my AC is 10 + Constitution modifier + Wisdom modifier");
			}),
			armorOptions : [{
				regExpSearch : /justToAddToDropDown/,
				name : "Unarmored Defense (Wis)",
				source : ["GMB:LL"],
				ac : "10+Wis",
				affectsWildShape : true
			}],
			armorAdd : "Unarmored Defense (Wis)"
		},

		// Override Ki adept because of Stalwart Strength
		"ki adept" : {
			name : "Ki Adept",
			source : ["GMB:LL"],
			minlevel : 11,
			description : desc("Once on my turn, I can use a Technique I know that costs 1 Ki Point, Flurry of Blows, or Stalwart Strength without spending Ki")
		},

		"subclassfeature3" : GetSubclassTechniques("Boulder",["spiritual armor","crushing strike","friend of beast and leaf"]),
		"subclassfeature3.1" : {
			name : "Solid Body",
			source : [["GMB:LL", 0]],
			minlevel : 3,
			description : desc(["I can use Constitution, in place of Str or Dex for Martial Arts attack and damage rolls"]),
			calcChanges : {
				atkAdd : [
					function (fields, v) {
						if (v.theWea.monkweapon) {

							if (fields.Mod === 1 || fields.Mod === 2 || What(AbilityScores.abbreviations[v.StrDex - 1] + " Mod") <= What("Con Mod")) {
								fields.Mod = 3;
							}
						};
					},
					"I can use either Constitution, Strength or Dexterity for Martial Arts attack and damage rolls",
					10
				]
			},
			extraAC : [{
				name : "Solid Body",
				mod : "max(Con-Dex|0)",
				text : "I can use my Con to calculate my AC instead of Dex while not wearing armor or a shield",
				stopeval : function (v) { 
					return (v.wearingArmor || v.usingShield) // unarmoured only
				}
			}],

			"stalwart strength" : {
				name : "Stalwart Strength",
				extraname : "Way of the Boulder 3",
				source : [["GMB:LL", 0]],
				description : desc(["When I make a Strength-based ability check or a Strength save while touching the ground, I can add my Constitution modifier to the roll"]),
				additional : "1 ki point"
			},
			"rebounding defense" : {
				name : "Rebounding Defense",
				extraname : "Way of the Boulder 6",
				source : [["GMB:LL", 0]],
				description : levels.map(function (n) {
					var MartArtDie = (n < 5 ? 6 : n < 11 ? 8 : n < 17 ? 10 : 12);

					return desc(["When a creature I can see hits me with a melee attack, I can reduce the damage by 1d" + (n < 5 ? 6 : n < 11 ? 8 : n < 17 ? 10 : 12) + " + " + n + " + Con mod",
					"If I reduce it to 0, I can make a melee martial arts attack against the attacker"])
				}),
				additional : "1 ki point",
				action : ["reaction", ""]
			},
			autoSelectExtrachoices : [{
				extrachoice : "stalwart strength",
				minlevel : 3
			}, {
				extrachoice : "rebounding defense",
				minlevel : 6
			}]

		},
		"subclassfeature10" : {
			name : "Ki-Infused Bulk",
			source : [["GMB:LL", 0]],
			minlevel : 10,
			description : desc(["I gain resistance to one of the following damage types: bludgeoning, piercing, slashing, acid, cold, fire, lighting, or thunder",
				"I can replace the chosen resistance through a short rest or by spending 2 ki as a bonus action"]),
			action : ["bonus action", " (change resistance)"]
		},
		"subclassfeature17" : {
			name : "Mighty Form",
			source : [["GMB:LL", 0]],
			minlevel : 17,
			description : desc(["Both my Constitution score, and maximum Constitution score, increase by 2 to a max of 22"]),
			scores : [0,0,2,0,0,0],
			scoresMaximum : [0,0,22,0,0,0],
		},
		"subclassfeature17.1" : {
			name : "Earthshaker",
			source : [["GMB:LL", 0]],
			minlevel : 17,
			description : desc(["As an action, I can expend 5 Ki to crush the ground within 30 ft of me",
				"This turns it into difficult terrain and forces creas of my choice within to make a Strength save",
				"They take 2d12 bludg dmg and fall prone (half on save)",
				"I can spend additional ki (up to my Wis mod) to add 1d12 to the damage per ki expended"]),
			action : ["action", ""]
		}
	}
})

// Way of the Brawler
AddSubClass("monk(laserllama)", "way of the brawler", {
	regExpSearch : /brawler/i,
	subname : "Way of the Brawler",
	fullname : "Brawler",
	source : [["GMB:LL", 0]],
	features : {
		// Override Ki adept because of the lvl 3 subclass feature
		"ki adept" : {
			name : "Ki Adept",
			source : ["GMB:LL"],
			minlevel : 11,
			description : desc("Once on my turn, I can use a Technique I know that costs 1 Ki Point, Flurry of Blows, or Infamous Reputation without spending Ki")
		},

		"savage exploits": function(){
            // Fixed attributes
            SavageExploits = {
				name : "Savage Exploits",
				source : [["GMB:LL", 0]],
				minlevel : 3,
				description : desc(["I gain Exploit Dice, which are used to fuel my Savage Exploits", 
                    "Use the \"Choose Feature\" button above to choose Savage Exploits"]),
				toNotesPage : [{
                    name : "Brawler Exploits",
                    note : desc(["Below are all Brawler Exploits I know. Each 3rd level exploit can only be used per short rest."])
                }],

				// Savage Exploits
				extraname : "Savage Exploits",
				extraTimes : ['', '', 2, 2, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7],
				extrachoices : [],

				// Exploit dice
				limfeaname : "Exploit Dice",
				usages : ['', '', 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4],
				additional : ['', '', "d4", "d4", "d4", "d4", "d6", "d6", "d6", "d6", "d6", "d6", "d6", "d6", "d8", "d8", "d8", "d8", "d8", "d8"],
				recovery : "short rest",
			}

            // Make a filtered spell list that contains only barbarian(laserllama) "spells" of 1st, 2nd and 3rd degree (exclude 4th and 5th degree)
            const BarbarianSpells = Object.keys(SpellsList).filter((key) => SpellsList[key].isExploit && SpellsList[key].level <= 3).filter((key) => {
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
                        amendTo : "Brawler Exploits"
                    }],
                    source: NewSpell.source,
                    addMod: NewSpell.addMod,
                    submenu: NewSpell.submenu,
                    prereqeval: ExploitPrereqFactoryHalf(BarbarianSpells[i], "monk(laserllama)"), // IMPORTANT NOTE: ExploitPrereqFactory**HALF** because progression differs
                    eval: CreateSavageSpellsheet,
                    spellcastingBonusElsewhere : {
                        addTo : "savage exploits",
                        spellcastingBonus : {
                            name : "Brawler Exploits",
                            spellcastingAbility : 1,
                            spells : [BarbarianSpells[i]],
                            selection : [BarbarianSpells[i]]
                        }
                    }
                }
            }

            return SavageExploits
        }(),
		"subclassfeature3.1" : {
			name : "Streetwise",
			source : [["GMB:LL", 0]],
			minlevel : 3,
			description : desc("I gain proficiency in Intimidation and learn Thieves' Cant"),
			skills : ["Intimidation"],
			languageProfs : ["Thieves' Cant"]
		},
		"subclassfeature6" : {
			name : "Spiritual Stamina",
			source : [["GMB:LL", 0]],
			minlevel : 6,
			description : desc(["When I crit on a Martial Arts attack, I can use a savage exploit I know as part of the attack without expending an Exploit Die"]),

			"spiritual stamina (ki)" : {
				name : "Spiritual Stamina",
				source : [["GMB:LL", 0]],
				extraname : "Way of the Brawler 6",
				description : desc(["As a bonus action, I regain one of my expended Exploit Die"]),
				action : ["bonus action", ""],
				additional : "2 ki points"
			},
			autoSelectExtrachoices : [{
				extrachoice : "spiritual stamina (ki)",
				minlevel : 6
			}]
		},
		"subclassfeature10" : {
			name : "Infamous Reputation",
			source : [["GMB:LL", 0]],
			minlevel : 10,
			description : desc(["Creatures frightened of me have disadv. on their saves vs my Savage Exploits"]),

			"infamous reputation (ki)" : {
				name : "Infamous Reputation",
				source : [["GMB:LL", 0]],
				extraname : "Way of the Brawler 10",
				description : desc(["As a bonus action, I can force a creature within 30 ft that can see/hear me to make a Wis save",
					"On a failed save, it is frightened of me until the start of my next turn"]),
				action : ["bonus action", ""],
				additional : "1 ki point"
			},
			autoSelectExtrachoices : [{
				extrachoice : "infamous reputation (ki)",
				minlevel : 10
			}]
		},
		"subclassfeature17" : {
			name : "Underworld Master",
			source : [["GMB:LL", 0]],
			minlevel : 17,
			description : desc(["My Martial Arts attack crit on a 19 or 20",
				"When I crit with a Martial Arts attack, the target fails any save caused by an exploit I would use as part of the attack"]),
			calcChanges : {
				atkAdd : [
					function (fields, v) {
						if (v.theWea.monkweapon && !v.CritChance) {
							fields.Description += (fields.Description ? '; ' : '') + 'Crit on 19-20';
							v.CritChance = 19;
						};
					},
					"My martial arts attacks score a critical hit on 19-20",
					19
				]
			}
		}
	}
})

// Way of Ferocity
AddSubClass("monk(laserllama)", "way of ferocity", {
	regExpSearch : /ferocity/i,
	subname : "Way of Ferocity",
	fullname : "Ferocity",
	source : [["GMB:LL", 0]],
	features : {
		"subclassfeature3" : GetSubclassTechniques("Ferocity",["crippling strike","stunning strike","friend of beast and leaf"]),
		"subclassfeature3.1" : {
			name : "Natural Predator",
			source : [["GMB:LL", 0]],
			minlevel : 3,
			description : desc("Select a discipline using \"Choose feature\". Once chosen, this cannot be changed."),
			choices : ["Bestial Rend", "Natural Defenses", "Savage Charge"],

			"bestial rend" : {
				name : "Bestial Rend",
				source : [["GMB:LL", 0]],
				description : desc(["My unarmed strikes deal slashing damage and reduce the speed of my foes", 
					"Each time you I hit a target with an unarmed strike, its movement speed is reduced by a cumulative 5 feet until the beginning of my next turn",
					"If this reduces a target's speed to 0, it has disadv. on Dex saves until the start of my next turn"]),
				calcChanges : {
					atkAdd : [
						function (fields, v) {
							if (v.baseWeaponName == "unarmed strike") {
								fields.Damage_Type = "Slashing";
								fields.Description += (fields.Description ? '; ' : '') + "Reduce foe's move speed by 5 ft on hit"
							};
						},
						"My unarmed strikes deal slashing damage and reduce the speed of my foes",
						20
					]
				}
			},
			"natural defenses" : {
				name : "Natural Defenses",
				source : [["GMB:LL", 0]],
				description : levels.map(function (n) {
					var MartArtDie = (n < 5 ? 6 : n < 11 ? 8 : n < 17 ? 10 : 12);

					return desc(["When a creature that I can see hits me with an attack, I can use my reaction to add 1d"+MartArtDie+" to my AC against the attack, possibly turning a hit into a miss"]);
				}),
				action : ["reaction", " (when hit)"]
			},
			"savage charge" : {
				name : "Savage Charge",
				source : [["GMB:LL", 0]],
				description : desc(["If I move at least 15 ft in a straight line toward a creature, I have adv. on the first Martial Arts attack against that creature before the end of my current turn"])
			}

		},
		"subclassfeature6" : {
			name : "Primal Intuition",
			source : [["GMB:LL", 0]],
			minlevel : 6,
			description : levels.map(function (n) {
				var MartArtDie = (n < 5 ? 6 : n < 11 ? 8 : n < 17 ? 10 : 12);

				return desc(["I gain proficiency in two skills and add 1d"+MartArtDie+" to any skill check with those skills"]);
			}),
			extraname : "Primal Intuition proficiencies",
			extrachoices : ["Athletics", "Insight", "Intimidation", "Perception", "Stealth", "Survival"],
			extraTimes : levels.map( function(n) {
                if (n < 6) return 0;
                return 2;
            }),
            // NOTE: this levels.map function is just so the user sees how many Profs they can pick
            // If extraTimes = constant, then it never shows the "selected x of y"

			"athletics" : {
				name : "Athletics",
				description : levels.map(function (n) {
					var MartArtDie = (n < 5 ? 6 : n < 11 ? 8 : n < 17 ? 10 : 12);

					return desc(["I gain proficiency in Athletics and add 1d"+MartArtDie+" to any skill check with this skill"]);
				}),
				skills : ["Athletics"]
			},
			"insight" : {
				name : "Insight",
				description : levels.map(function (n) {
					var MartArtDie = (n < 5 ? 6 : n < 11 ? 8 : n < 17 ? 10 : 12);

					return desc(["I gain proficiency in Insight and add 1d"+MartArtDie+" to any skill check with this skill"]);
				}),
				skills : ["Insight"]
			},
			"intimidation" : {
				name : "Intimidation",
				description : levels.map(function (n) {
					var MartArtDie = (n < 5 ? 6 : n < 11 ? 8 : n < 17 ? 10 : 12);

					return desc(["I gain proficiency in Intimidation and add 1d"+MartArtDie+" to any skill check with this skill"]);
				}),
				skills : ["Intimidation"]
			},
			"perception" : {
				name : "Perception",
				description : levels.map(function (n) {
					var MartArtDie = (n < 5 ? 6 : n < 11 ? 8 : n < 17 ? 10 : 12);

					return desc(["I gain proficiency in Perception and add 1d"+MartArtDie+" to any skill check with this skill"]);
				}),
				skills : ["Perception"]
			},
			"stealth" : {
				name : "Stealth",
				description : levels.map(function (n) {
					var MartArtDie = (n < 5 ? 6 : n < 11 ? 8 : n < 17 ? 10 : 12);

					return desc(["I gain proficiency in Stealth and add 1d"+MartArtDie+" to any skill check with this skill"]);
				}),
				skills : ["Stealth"]
			},
			"survival" : {
				name : "Survival",
				description : levels.map(function (n) {
					var MartArtDie = (n < 5 ? 6 : n < 11 ? 8 : n < 17 ? 10 : 12);

					return desc(["I gain proficiency in Survival and add 1d"+MartArtDie+" to any skill check with this skill"]);
				}),
				skills : ["Survival"]
			},

			// level 10 feature
			"power of the wild" : {
				name : "Power of the Wild",
				source : [["GMB:LL", 0]],
				extraname : "Way of Ferocity 10",
				description : desc(["When I hit a creature with an unarmed strike, I can deal an additional 2d6 damage"]),
				additional : "1 ki point"
			},
			autoSelectExtrachoices : [{
				extrachoice : "power of the wild",
				minlevel : 10
			}]

		},
		"subclassfeature17" : {
			name : "Master of Ferocity",
			source : [["GMB:LL", 0]],
			minlevel : 17,
			description : desc("Select a discipline using \"Choose feature\". Once chosen, this cannot be changed."),
			choices : ["Bestial Fury", "Natural Resilience", "Savage Rush"],

			"bestial fury" : {
				name : "Bestial Fury",
				source : [["GMB:LL", 0]],
				description : desc(["When I score a crit against a creature with an unarmed strike, its move speed is reduced to zero, and I have adv. on any unarmed strikes that I make against that creature until the beginning of my next turn"])
			},
			"natural resilience" : {
				name : "Natural Resilience",
				source : [["GMB:LL", 0]],
				description : desc("When a creature that I can see hits me with an attack, I can expend Ki Points (up to my Wis mod) to reduce the damage by 1d12 for each Ki Point spent"),
				action : ["reaction", " (when hit)"]
			},
			"savage rush" : {
				name : "Savage Rush",
				source : [["GMB:LL", 0]],
				description : desc(["As an action, I can spend 4 Ki Points and move up to my full walk speed in a straight line",
					"Any creature I pass through must make a Dex save or take 4d12 bludg dmg and fall prone",
					"On a success, they take half damage and do not fall prone"]),
				action : ["action", ""]
			},
		}
	}
})

// Way of the Flowing River
AddSubClass("monk(laserllama)", "way of the flowing river", {
	regExpSearch : /flowing river/i,
	subname : "Way of the Flowing River",
	fullname : "Flowing River",
	source : [["GMB:LL", 0]],
	features : {
		// Override Ki adept because of the lvl 6 subclass feature
		"ki adept" : {
			name : "Ki Adept",
			source : ["GMB:LL"],
			minlevel : 11,
			description : desc("Once on my turn, I can use a Technique I know that costs 1 Ki Point, Flurry of Blows, or Enchanting Flow without spending Ki")
		},

		"subclassfeature3" : GetSubclassTechniques("Flowing",["patient defense","deflect missile","heavenly step"]),
		"subclassfeature3.1" : {
			name : "Monastic Acrobat",
			source : [["GMB:LL", 0]],
			minlevel : 3,
			description : levels.map(function (n) {
				var MartArtDie = (n < 5 ? 6 : n < 11 ? 8 : n < 17 ? 10 : 12);

				return desc(["I am proficient in Acrobatics and Performance, I add 1d"+MartArtDie+" to any skill checks with those skills",
					"I can make Dexterity (Performance) checks instead of Charisma (Performance)"]);
			}),
			skills : ["Acrobatics", "Performance"],
			addMod : { type : "skill", field : "Performance", mod : "max(Dex-Cha|0)", text : "I can replace Charisma (Performance) checks with Dexterity (Performance)" }
		},
		"subclassfeature3.2" : {
			name : "Flowing River Stance",
			source : [["GMB:LL", 0]],
			minlevel : 3,
			description : levels.map(function (n) {
				if (n < 6) {
					return desc(["As an action, I can enter a Flowing River Stance, which lasts until the start of my next turn",
						"While in this stance, I gain an additional reaction (for a total of 2 reactions)",
						"When a creature that I can see misses me with a melee attack while in this Stance, I can use a reaction to force it to make a Dex save",
						"On a fail, the target is prone and its move speed is reduced to 0 until the start of my next turn"]);
				}

				if (n < 10) {
					return desc(["As an action, I can enter a Flowing River Stance, which lasts until the start of my next turn",
						"While in this stance, I gain two additional reactions (for a total of 3 reactions)",
						"When a creature that I can see misses me with a melee attack while in this Stance, I can use a reaction to force it to make a Dex save",
						"On a fail, the target is prone and its move speed is reduced to 0 until the start of my next turn"]);
				}

				if (n < 17) {
					return desc(["As an action, I can enter a Flowing River Stance, which lasts until the start of my next turn",
						"When doing so, I gain the benefits of patient defense without needing to spend ki",
						"While in this stance, I gain three additional reactions (for a total of 4 reactions)",
						"When a creature that I can see misses me with a melee attack while in this Stance, I can use a reaction to force it to make a Dex save",
						"On a fail, the target is prone and its move speed is reduced to 0 until the start of my next turn"]);
				}

				return desc(["As an action, I can enter a Flowing River Stance, which lasts until the start of my next turn",
						"When doing so, I gain the benefits of patient defense without needing to spend ki",
						"While in this stance, I gain four additional reactions (for a total of 5 reactions)",
						"When a creature that I can see misses me with a melee attack while in this Stance, I can use a reaction to force it to make a Dex save",
						"On a fail, the target is prone and its move speed is reduced to 0 until the start of my next turn",
						"On a fail, I can also knock it back in a straight line in addition to the other effects",
						"Tiny: 60 ft, Small: 40 ft, Medium: 30 ft, Large: 20 ft, Huge: 15 ft, Gargantuan: 10 ft"]);
			}),
			action : [["action", " (start)"], ["reaction", " (when missed in melee)"]],

			"enchanting flow" : {
				name : "Enchanting Flow",
				source : [["GMB:LL", 0]],
				extraname : "Way of the Flowing River 6",
				description : desc(["When I enter my Flowing River Stance, I can mystically allure my foes",
					"Until the start of my next turn, creatures of my choice within 10 ft of me have disadv. on all attacks against targets other than me"]),
				additional : "1 ki point"
			},
			autoSelectExtrachoices : [{
				extrachoice : "enchanting flow",
				minlevel : 6
			}]
		}
	}
})

// Way of the Hurricane
AddSubClass("monk(laserllama)", "way of the hurricane", {
	regExpSearch : /hurricane/i,
	subname : "Way of the Hurricane",
	fullname : "Hurricane",
	source : [["GMB:LL", 0]],
	features : {
		// Override martial arts because of the lvl 3 subclass feature
		"martial arts": function() {
			var martart = newObj(ClassList["monk(laserllama)"].features["martial arts"]);

			martart.description = levels.map(function (n) {
				if (n < 3) {
					return desc([
						"Monk weapons: any melee weapon (not special/heavy) or unarmed strike",
						"With monk weapons, I can use Dex instead of Str and use the Martial Arts damage die",
						"When taking an Attack action with these, I get one unarmed strike as a bonus action",
						"I can replace Strength (Athletics) checks to grapple/shove with Dexterity (Athletics) checks"
					]);
				}

				return desc([
					"Monk weapons: any melee weapon (not special) or unarmed strike",
					"With monk weapons, I can use Dex instead of Str and use the Martial Arts damage die",
					"When taking an Attack action with these, I get one unarmed strike as a bonus action",
					"I can replace Strength (Athletics) checks to grapple/shove with Dexterity (Athletics) checks"
				]);
			});

			return martart;
		}(),

		// Override Ki adept because of the lvl 10 subclass feature
		"ki adept" : {
			name : "Ki Adept",
			source : ["GMB:LL"],
			minlevel : 11,
			description : desc("Once on my turn, I can use a Technique I know that costs 1 Ki Point, Flurry of Blows, Empowered Whirling strike or Buffeting Winds without spending Ki")
		},

		"subclassfeature3" : GetSubclassTechniques("Hurricane",["whirling strike","stunning strike","monastic fortitude"]),
		"subclassfeature3.1" : {
			name : "Heavy Warrior",
			source : [["GMB:LL", 0]],
			minlevel : 3,
			description : desc(["I gain proficiency with all melee heavy weapons and they count as Martial Arts attacks",
				"When wielding a melee heavy weapon, I have adv. on saves to resist being grappled or moved against my will"]),
			calcChanges : {
				atkAdd : [
					function (fields, v) {
						if (classes.known["monk(laserllama)"] && classes.known["monk(laserllama)"].level && v.isMeleeWeapon && (/simple|martial/i).test(v.theWea.type) && (/heavy/i).test(fields.Description)) {
							v.theWea.monkweapon = true;
							fields.Proficiency = true;
						};
					},
					"I am proficient with melee heavy weapons, and those count as monk weapons for me",
					1
				]
			},
			savetxt : { 
				text : ["With melee heavy weapon, adv. on saves vs moved against my will or grappled"]
			},
		},
		"subclassfeature3.2" : {
			name : "Tempestuous Strike",
			source : [["GMB:LL", 0]],
			minlevel : 3,
			description : desc(["When wielding a melee heavy weapon I can use Whirling Strike without expending Ki",
				"I can choose to add my Str mod, instead of my Dex mod, to the damage roll of whirling stike"]),
		},
		"subclassfeature6" : {
			name : "Crushing Counter",
			source : [["GMB:LL", 0]],
			minlevel : 6,
			description : desc(["When wielding a melee heavy weapon and a crea I see hits me with a melee weapon attack, I can use my reaction to make a Martial Arts attack against it",
				"On hit, I can also reduce the creature's speed to 0 until the start of my next turn"]),
			action : ["reaction", " (when hit)"],
		},
		"subclassfeature10" : {
			name : "Empowered Whirling strike",
			source : [["GMB:LL", 0]],
			minlevel : 10,
			description : levels.map(function (n) {
				var MartArtDie = (n < 5 ? 6 : n < 11 ? 8 : n < 17 ? 10 : 12);

				return desc(["When I use whirling strike, I can spend 1 ki to deal 1d"+MartArtDie+" of bonus thunder dmg on failed save"])
			}),

			"buffeting winds" : {
				name : "Buffeting Winds",
				source : [["GMB:LL", 0]],
				extraname : "Way of the Hurricane 10",
				description : desc(["On hit with a heavy melee weapon, the crea makes a Str save or is knocked prone or knocked back in a straight line by 5 ft times my Wis mod (my choice)"]),
				additional : "1 ki point"
			},
			autoSelectExtrachoices : [{
				extrachoice : "buffeting winds",
				minlevel : 10
			}]
		},
		"subclassfeature17" : {
			name : "Master of the Hurricane",
			source : [["GMB:LL", 0]],
			minlevel : 17,
			description : desc(["I can disappear and instantly make a single melee weapon attack against up to five creatures I can see within 60 feet",
				"I then appear next to one of my targets; I must be wielding a melee heavy weapon to use this",
				"I can do this once per short rest or spend 5 ki to do it again"]),
			action : ["action", ""],
			recovery : "short rest",
        	usages : 1,
		}
	}
})

// Way of the Mystic
AddSubClass("monk(laserllama)", "way of the mystic", {
	regExpSearch : /mystic/i,
	subname : "Way of the Mystic",
	fullname : "Mystic",
	source : [["GMB:LL", 0]],
	features : {
		// Override unarmoured defense because of Awakened Mind
		"unarmored defense" : {
			name : "Unarmored Defense",
			source : ["GMB:LL"],
			minlevel : 1,
			description : levels.map(function (n) {
				if (n < 3) return desc("Without armor and no shield, my AC is 10 + Dexterity modifier + Wisdom modifier");

				return desc("Without armor and no shield, my AC is 13 + Wisdom modifier");
			}),
			armorOptions : [{
				regExpSearch : /justToAddToDropDown/,
				name : "Unarmored Defense (Wis)",
				source : ["GMB:LL"],
				ac : "10+Wis",
				affectsWildShape : true
			}],
			armorAdd : "Unarmored Defense (Wis)"
		},
		// Override Ki adept because of the lvl 6 subclass feature
		"ki adept" : {
			name : "Ki Adept",
			source : ["GMB:LL"],
			minlevel : 11,
			description : desc("Once on my turn, I can use a Technique I know that costs 1 Ki Point, Flurry of Blows, or Spiritual Sundering without spending Ki")
		},

		"subclassfeature3" : {
			name : "Mystic Talents",
			source : [["GMB:LL", 0]],
			minlevel : 3,
			description : desc(["I learn talents from the Psion class, using my monk level for prerequesites", 
				"This feature has not been implemented yet (interested in this? shoot me a dm!)"])
		},
		"subclassfeature3.1" : {
			name : "Awakened Mind",
			source : [["GMB:LL", 0]],
			minlevel : 3,
			description : desc(["I can use my Wisdom instead of Dexterity for Martial Arts attack rolls (but not damage)"]),
			calcChanges : {
				atkAdd : [
					function (fields, v) {
						if (classes.known["monk(laserllama)"] && classes.known["monk(laserllama)"].level && v.theWea.monkweapon && What(AbilityScores.abbreviations[fields.Mod - 1] + " Mod") < What("Wis Mod")) {
							fields.To_Hit_Bonus = What("Wis Mod") - What(AbilityScores.abbreviations[fields.Mod - 1] + " Mod");
						};
					},
					"I can use my Wisdom instead of Dexterity for Martial Arts attack rolls (but not damage)",
					6
				]
			},
			extraAC : [{
				name : "Awakened Mind",
				mod : "max(3-Dex|0)",
				text : "Without armor and no shield, my AC is 13 + Wisdom modifier",
				stopeval : function (v) { 
					return (v.wearingArmor || v.usingShield) // unarmoured only
				}
			}],

			"spiritual sundering" : {
				name : "Spiritual Sundering",
				source : [["GMB:LL", 0]],
				extraname : "Way of the Mystic 6",
				description : levels.map(function (n) {
					var MartArtDie = (n < 5 ? 6 : n < 11 ? 8 : n < 17 ? 10 : 12);

					return desc(["One creature I can see within 15 ft makes a Cha save or takes 1d"+MartArtDie+" psychic dmg and has disadv. on the first Int, Wis or Cha save before my next turn"])
				}),
				additional : "1 ki point",
				action : ["bonus action", ""]
			},
			autoSelectExtrachoices : [{
				extrachoice : "spiritual sundering",
				minlevel : 6
			}]
		},
		"subclassfeature10" : {
			name : "Warded Soul",
			source : [["GMB:LL", 0]],
			minlevel : 10,
			description : desc("When I take necrotic, psychic, or radiant damage I can spend 1 Ki to gain resistance to that instance of damage")
		},
		"subclassfeature17" : {
			name : "Master Mystic",
			source : [["GMB:LL", 0]],
			minlevel : 17,
			description : desc(["When I deal psychic damage to a creature I can add my Wis mod (min 1) to the damage roll if I do not do so already",
				"At the end of each long rest, I can replace on Mystic Talent I know with another Talent"])
		}
	}
})

// Way of the Sacred Inks
AddSubClass("monk(laserllama)", "way of the sacred inks", {
	regExpSearch : /sacred inks/i,
	subname : "Way of the Sacred Inks",
	fullname : "Sacred Inks",
	source : [["GMB:LL", 0]],
	features : {
		"subclassfeature3" : GetSubclassTechniques("Sacred Ink",["spiritual armor","divine light","commune with self"]),
		"subclassfeature3.1" : {
			name : "Celestial Artist",
			source : [["GMB:LL", 0]],
			minlevel : 3,
			description : desc(["I gain expertise in Calligrapher's supplies and learn Celestial"]),
			languageProfs : ["Celestial"],
			toolProfs : ["Calligrapher's Supplies"]
		},
		"subclassfeature3.2" : {
			name : "Divine Conduit",
			source : [["GMB:LL", 0]],
			minlevel : 3,
			description : levels.map(function (n) {
				var MartArtDie = (n < 5 ? 6 : n < 11 ? 8 : n < 17 ? 10 : 12);

				return desc(["When I spend Hit Die, I can expend 1 Ki to regain the max roll",
				"When I hit on Martial Arts attack, I can expend ki (up to my Wis mod) to deal 1d"+MartArtDie+" additional radiant damage",
				"As an action I can touch a creature and expend 2 Ki to heal them for 1d"+MartArtDie+" + my Wis mod"])
			}),
			action : ["action", " (heal)"],
		},
		"subclassfeature6" : {
			name : "Heavenly Protection",
			source : [["GMB:LL", 0]],
			minlevel : 6,
			description : desc(["When reduced to 0 HP, I can choose to fall to 1 HP instead"]),
            usages : 1,
            recovery : "long rest",
		},
		"subclassfeature10" : {
			name : "Light of the Heavens",
			source : [["GMB:LL", 0]],
			minlevel : 10,
			description : desc(["As a bonus action, I can reveal my tatoos, which emit bright sunlight in a 10 ft radius for 1 min",
				"While revealed, I add my Wis mod to HP I restore and damage I deal with Divine Conduit",
				"This ends early if I am incapacitated or if I use a bonus action to end it"]),
			action : ["bonus action", " (start/end)"],
			recovery : "short rest",
        	usages : 1,
		},
		"subclassfeature17" : {
			name : "Master of the Sacred Inks",
			source : [["GMB:LL", 0]],
			minlevel : 17,
			description : desc(["As an action, I take on an angelic form for 1 minute granting me:",
				"\u2022 a flying speed equal to my walking speed and I can hover",
				"\u2022 my unarmed strike can deal radiant damage instead of bludgeoning",
				"\u2022 all the benefits of Light of the Heavens",
				"If I have no uses left, I can spend 5 ki to use this feature again"]),
			action : ["action", ""],
			recovery : "long rest",
        	usages : 1,
		}
	}
})

// Way of the Vigilante
AddSubClass("monk(laserllama)", "way of the vigilante", {
	regExpSearch : /vigilante/i,
	subname : "Way of the Vigilante",
	fullname : "Vigilante",
	source : [["GMB:LL", 0]],
	features : {
		"subclassfeature3" : GetSubclassTechniques("Vigilante",["slow fall","crushing strike","heavenly step"]),
		"subclassfeature3.1" : {
			name : "Combat Ready",
			source : [["GMB:LL", 0]],
			minlevel : 3,
			description : desc(["I gain proficiency in light armor, medium armor and shields",
				"When wearing armor/shield I still gain the benefits of Martial Arts and Unarmored Movement"]),
			armorProfs : [true, true, false, true], // light, medium and shield

			removeeval : function() {
				AddString('Extra.Notes', 'Monk features:\n\u25C6 If I wear armor/shield, I lose Unarmored Defense, Martial Arts, and Unarmored Movement');
				show3rdPageNotes();
			},
			eval : function() {
				RemoveString('Extra.Notes', 'Monk features:\n\u25C6 If I wear armor/shield, I lose Unarmored Defense, Martial Arts, and Unarmored Movement');
			},
			// eval and removeeval from martial arts but reversed 
		},
		"subclassfeature3.2" : {
			name : "Heroic Persona",
			source : [["GMB:LL", 0]],
			minlevel : 3,
			description : levels.map(function (n) {
				if (n < 17) {
					return desc(["As a bonus action, so long as I can't be seen, I can don my Heroic Persona for 1 h:",
						"\u2022 This also makes me don/doff an armor and a shield if my persona has it",
						"\u2022 I get "+n+" temp HP and can use my bonus action to gain temp HP equal to my Wis mod",
						"\u2022 On hit with Martial Arts attack, I can spend 1 Ki to add 1d10 to the damage",
						"\u2022 I can use Wisdom, instead of Dexterity, when calculating my AC in light/medium armor",
						"Ability checks and divination spells that would discern my true identity automatically fail",
						"If I have no uses left, I can spend 3 ki to use this feature again"])
				}

				return desc(["As a bonus action, so long as I can't be seen, I can don my Heroic Persona until I doff it:",
					"\u2022 This also makes me don/doff an armor and a shield if my persona has it",
					"\u2022 I get "+n+" temp HP and can use my bonus action to gain temp HP equal to my Wis mod",
					"\u2022 On hit with Martial Arts attack, I can spend 1 Ki to add 1d10 to the damage",
					"\u2022 I can use Wisdom, instead of Dexterity, when calculating my AC in light/medium armor",
					"Ability checks and divination spells that would discern my true identity automatically fail",
					"If I have no uses left, I can spend 3 ki to use this feature again"])
			}),
			// NOTE: AC calculation not included as it depends on whether heroic persona is enabled or not
			action : ["bonus action", " (don/doff)"],
			recovery : "short rest",
        	usages : 1
		},
		"subclassfeature3.3" : {
			name : "Additional proficiency",
			source : [["GMB:LL", 0]],
			minlevel : 3,
			description : levels.map(function (n) {
				var MartArtDie = (n < 5 ? 6 : n < 11 ? 8 : n < 17 ? 10 : 12);

				return desc("I gain an additional proficiency (Intimidation or Performance) and add 1d"+MartArtDie+" to any checks using that proficiency")
			}),
			choices : ["Intimidation proficiency", "Performance proficiency"],
			"intimidation proficiency" : {
				name : "Additional proficiency",
				description : levels.map(function (n) {
					var MartArtDie = (n < 5 ? 6 : n < 11 ? 8 : n < 17 ? 10 : 12);

					return desc("I am proficient in Intimidation and add 1d"+MartArtDie+" to any checks using that proficiency")
				}),
				skills : ["Intimidation"]
			},
			"performance proficiency" : {
				name : "Additional proficiency",
				description : levels.map(function (n) {
					var MartArtDie = (n < 5 ? 6 : n < 11 ? 8 : n < 17 ? 10 : 12);

					return desc("I am proficient in Performance and add 1d"+MartArtDie+" to any checks using that proficiency")
				}),
				skills : ["Performance"]
			},
		},
		"subclassfeature6" : {
			name : "Valiant Action",
			source : [["GMB:LL", 0]],
			minlevel : 6,
			description : desc(["I gain proficiency in either Acrobatics or Athletics",
				"I gain the indomitable spirit Technique and it doesn't count against my total",
				"While my Persona is active, I can use indomitable spirit once per turn without spending Ki"]),
			skillstxt : "Choose one from Acrobatics and Athletics",


			"indomitable spirit" : {
				name : "Indomitable Spirit",
				source : ["GMB:LL"],
				description : desc(["Add my Wis mod (min 1) to a Strength (Athletics) or Dexterity (Athletics) check",
					"I can use this Technique after I roll, but before I know if my roll succeeds or fails"]),
				additional : "1 ki point",
			},
			autoSelectExtrachoices : [{
				extrachoice : "indomitable spirit",
				minlevel : 6
			}]

		},
		"subclassfeature10" : {
			name : "Inspiring Presence",
			source : [["GMB:LL", 0]],
			minlevel : 10,
			description : levels.map(function (n) {
				var AuraSize = (n < 17 ? 15 : 30);

				return desc(["While my Heroic Persona is active, creatures of my choice within "+AuraSize+" ft have adv. on saves vs charmed or frightened"])
			}),
		},
		"subclassfeature17" : {
			name : "Master Vigilante",
			source : [["GMB:LL", 0]],
			minlevel : 17,
			description : desc(["When I use crushing strike, the target must succeed on a Strength save or it is knocked back 10 ft in a straight line per Ki Point I spent"])
		}
	}
})

// Variant Rule: Heroic Personality
// A Vigilante Monk is meant to evoke the archetypal superhero. 
// For the mechanics to match the heroic fantasy, talk to your DM about using your Charisma, in place of Wisdom, for your Monk class features.
// Want this feature? Shoot me a dm!

// Way of the Void
AddSubClass("monk(laserllama)", "way of the void", {
	regExpSearch : /void/i,
	subname : "Way of the Void",
	fullname : "Void",
	source : [["GMB:LL", 0]],
	features : {
		// Override Ki adept because of the lvl 3 subclass feature
		"ki adept" : {
			name : "Ki Adept",
			source : ["GMB:LL"],
			minlevel : 11,
			description : desc("Once on my turn, I can use a Technique I know that costs 1 Ki Point, Flurry of Blows, or Void Strike without spending Ki")
		},

		"subclassfeature3" : GetSubclassTechniques("Entropic",["step of the wind","slowing strike","aura sight"]),
		"subclassfeature3.1" : {
			name : "Entropic Touch",
			source : [["GMB:LL", 0]],
			minlevel : 3,
			description : levels.map(function (n) {
				var SizeLimit = (n < 5 ? "Tiny" : n < 11 ? "Medium or smaller" : n < 17 ? "Large or smaller" : "Huge or smaller");

				return desc(["As an action, I can spend 2 ki points and touch a "+SizeLimit+" non-magical object to instantly reduce it to a pile of dust"])
			}),
			action : ["action", ""],

			"void strike" : {
				name : "Void Strike",
				extraname : "Way of the Void 3",
				source : [["GMB:LL", 0]],
				description : levels.map(function (n) {
					var MartArtDie = (n < 5 ? 6 : n < 11 ? 8 : n < 17 ? 10 : 12);

					return desc(["When hitting a creature with an unarmed strike, deal 1d"+MartArtDie+" additional force damage",
						"If the creature is concentrating, it has disadv. on the concentration saving throw"]);
				}),
				additional : "1 ki point"
			},
			autoSelectExtrachoices : [{
				extrachoice : "void strike",
				minlevel : 3
			}]
		},
		"subclassfeature6" : {
			name : "Vorpal Step",
			source : [["GMB:LL", 0]],
			minlevel : 6,
			description : desc(["When I use Step of the Wind, until the end of my current turn, I can move through solid nonmag objects and crea as if they were difficult terrain", 
				"If I end my movement inside an object or creature, I am instantly shunted to the nearest unoccupied space, taking 1d10 force damage for every 5 feet I am forced to move"])
		},
		"subclassfeature10" : {
			name : "Dispelling Touch",
			source : [["GMB:LL", 0]],
			minlevel : 10,
			description : desc("I can spend 3 ki to cast counterspell or dispel magic using Wisdom as my spellcasting ability"),
			spellFirstColTitle : "Ki",
			spellcastingBonus : {
				name : "Dispelling Touch",
				spells : ["counterspell", "dispel magic"],
				selection : ["counterspell", "dispel magic"],
				firstCol : "3",
				times : 2
			}
		},
		"subclassfeature17" : {
			name : "Master of Entropy",
			source : [["GMB:LL", 0]],
			minlevel : 17,
			description : desc(["As an action, touch a creature who must make a Con save",
				"On a failed save, it suffers the effects of the disintegrate spell",
				"If I have no uses left, I can spend 6 Ki to use it again"]),
			action : ["action", ""],
			recovery : "long rest",
        	usages : 1,
        	spellFirstColTitle : "Ki",
			spellcastingBonus : {
				name : "Master of Entropy",
				spells : ["disintegrate"],
				selection : ["disintegrate"],
				firstCol : "oncelr",
				times : 1
			}
		}
	}
})

FeatsList["martial arts initiate"] = {
	name : "Martial Arts Initiate",
	source : [["GMB:LL"]],
	descriptionFull : "You have some basic martial arts training, giving you some skill in both unarmed combat and unarmed defense. So long as you aren't wearing armor or a shield, your Armor Class equals 13 + your Dexterity modifier. Your unarmed strikes deal bludgeoning damage equal to 1d4 + your Strength or Dexterity modifier on hit. When you take the Attack action on your turn and only make unarmed strikes, you can make a single unarmed strike as a bonus action on that same turn.",
	description : "My AC when unarmoured is 13 + Dex. My unarmoured strikes deal 1d4 + Str or Dex. When I take the Attack action and only make unarmed strikes, I can make a single unarmed strike as a bonus action on that same turn.",
	calcChanges : {
		atkAdd : [
			function (fields, v) {
				if (fields.Mod === 1 || fields.Mod === 2 || What(AbilityScores.abbreviations[fields.Mod - 1] + " Mod") < What(AbilityScores.abbreviations[v.StrDex - 1] + " Mod")) {
					fields.Mod = v.StrDex;
				}

				if (v.baseWeaponName == "unarmed strike") {
					if (fields.Damage_Die == 1) fields.Damage_Die = '1d4';
				};
			},
			"My unarmed strikes deal 1d4 damage + Str or Dex. If I used my action to make only unarmed strikes, I can make a single unarmed strike as bonus action.",
			1
		]
	},
	action : ['bonus action', 'Unarmed Strike (with Attack action)'],
	armorOptions : [{
		regExpSearch : /justToAddToDropDown/,
		name : "Unarmored Defense (+3)",
		source : ["GMB:LL"],
		ac : "13",
		affectsWildShape : true
	}],
	armorAdd : "Unarmored Defense (+3)"
};

FeatsList["ki warrior"] = {
	name : "Ki Warrior",
	source : [["GMB:LL"]],
	descriptionFull : "You have studied and mastered monastic Techniques which allow you to perform supernatural feats of spiritual power. You learn two Techniques from the Alternate Monk class. If the Technique has a prerequisite or mentions a Martial Arts die, you can learn it only if you are a Monk and you meet its prerequisites. If a Technique requires the target to make a saving throw to resist its effects, the DC equals 8 + your proficiency bonus + your Wisdom modifier. You gain 2 Ki Points to spend on Techniques. You regain all of your expended Ki Points when you finish a short or long rest. If you have Ki from another feature, these Ki Points are added to your total pool of Ki Points.",
	description : "I learn two techniques from the Alternate Monk. I can only learn Techniques without prerequesites and that don't use Martial Arts Die unless I'm a monk. Those techniques use my Wis for the DC. I also gain 2 Ki, which are added to my pool if I have any.",
	bonusClassExtrachoices : [{
		"class" : "monk(laserllama)",
		"feature" : "ki",
		"bonus" : 2
	}],
	extraLimitedFeatures : [{
		name : "Ki Points",
		usages : 2,
		recovery : "short rest",
		addToExisting : true
	}]
	// The addToExisting actually doesn't work for alt monk, but I'm keeping it for easier understanding of what the feat does and in case there's another ki pool
	// See for reference: https://canary.discord.com/channels/533350585706217494/863810547584467004/1267406407364509737 
};

// Source information
SourceList["GMB:LL"] = {
	name : "LaserLlama",
	abbreviation : "GMB:LL",
	abbreviationSpellsheet : "LL",
	group : "GM Binder",
	url : "https://www.gmbinder.com/profile/laserllama",
	date : "2018/04/22"
}