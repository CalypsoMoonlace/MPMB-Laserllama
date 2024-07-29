/*  -WHAT IS THIS?-
    This file adds optional material to "MPMB's Character Record Sheet" found at https://www.flapkan.com/download#charactersheets
    Import this file using the "Add Extra Materials" bookmark.

    -KEEP IN MIND-
    It is recommended to enter the code in a fresh sheet before adding any other information (i.e. before making your character with it).
	
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
				"Deflect Missiles", "Gentling Touch", "Seeking Strike", "Slowing Strike", "Stunning Strike", // prereq: lvl 5
				"Adept Fighting Style (Archery)", "Adept Fighting Style (Blind Warrior)", "Adept Fighting Style (Defense)", "Adept Fighting Style (Dueling)", "Adept Fighting Style (Featherweight)", "Adept Fighting Style (Thrown)", "Adept Fighting Style (Wrestler)", // prereq: lvl 5 & max one from this list
				"Crushing Strike", "Divine Light", "Unyielding Perseverance", // prereq: lvl 5
				"Aura Sight", "Heavenly Step", "Indomitable Spirit", "Mantle of Courtesy", // prereq: lvl 9
				"Commune with Self", "Friend of Beast and Leaf", "Monastic Fortitude", // prereq: lvl 9
				"Armor of the Ascetic", "Mystical Integrity", "Tongue of Sun and Moon", "Banishing Strike","Conjure Previous Life", // prereq: lvl 13
				"Empty Body", "Quivering Palm", "Awaken the Third Eye", "Word of Creation"], // prereq: lvl 18
			limfeaname : "Ki Points",
			usages : "Monk level + Wisdom modifier per ",
			// kiwarriorfeat = CurrentFeats.known.includes("ki warrior") ? 2 : 0
			// See https://canary.discord.com/channels/533350585706217494/863810547584467004/1267406407364509737 for reference
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
				description : desc("As an action, I regain hit points equal to one roll of my Martial Arts die + my Wis mod"),
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
			"deflect missiles" : {
				name : "Deflect Missiles",
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
					return "1d" + (n < 5 ? 6 : n < 11 ? 8 : n < 17 ? 10 : 12) + " + " + n + " + Dexterity modifier; 1 ki to throw";
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
				description : desc(["Add +1 to an ability check or saving throw for each Ki spent","I can use this Technique after I roll, but before I know if my roll succeeds or fails"]),
				additional : "1 to Wis mod ki points",
				submenu : "[monk level  5+]",
				prereqeval : function(v) { return classes.known["monk(laserllama)"].level >= 5; },
			},
			"aura sight" : {
				name : "Aura Sight",
				source : ["GMB:LL"],
				description : levels.map(function (n) {
					var newRange = n < 13 ? 20 : n < 18 ? 30 : 60;
					descr = ["I gain "+newRange+" ft blindsight and can see anything that isn't behind total cover within that range","I can see invisible creatures within range unless the creature successfully hides from me"]
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
				description : desc(["I can move along vertical surfaces, across liquids, and upside down on ceilings without falling during the move","If I end my movement on a vertical surface, liquid, or upside down on a ceiling, I can spend 1 Ki Point to remain in place without falling until the start of my next turn"]),
				submenu : "[monk level  9+]",
				prereqeval : function(v) { return classes.known["monk(laserllama)"].level >= 9; },
			},
			"indomitable spirit" : {
				name : "Indomitable Spirit",
				source : ["GMB:LL"],
				description : desc(["Add my Wis mod (min 1) to a Strength (Athletics) or Dexterity (Athletics) check","I can use this Technique after I roll, but before I know if my roll succeeds or fails"]),
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
				description : desc(["At the end of a short or long rest, I gain the effects of sanctuary spell","This lasts until the start of my next short or long rest and can end early as normal"]),
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
				description : desc(["I can touch the Ki of other minds and communicate with any creature that speaks a language","Creatures that speak no languages can communicate and understand simple ideas"]),
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
		"subclassfeature11" : {
			name : "Cloak of Shadows",
			source : [["P", 80]],
			minlevel : 11,
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

// Way of the Wuxia (Kensei)
RunFunctionAtEnd(function () {
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
					extraname : "Way of the Wuxia 11",
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
					minlevel : 11
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
	// See https://canary.discord.com/channels/533350585706217494/863810547584467004/1267406407364509737 for reference
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