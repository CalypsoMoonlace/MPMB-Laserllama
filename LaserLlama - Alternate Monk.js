/*  -WHAT IS THIS?-
    This file adds optional material to "MPMB's Character Record Sheet" found at https://www.flapkan.com/download#charactersheets
    Import this file using the "Add Extra Materials" bookmark.

    -KEEP IN MIND-
    It is recommended to enter the code in a fresh sheet before adding any other information (i.e. before making your character with it).
    This script requires importing the Exploits first!
	
    -INFORMATION-
    Subject:    Alternate Monk

    Effect:     This script adds the Alternate Monk class published by Laserllama in GM Binder under the Fan Content policy.
    			Laserllama: https://www.gmbinder.com/profile/laserllama
    			Alternate Monk: https://www.gmbinder.com/share/-MhGHvc1sNLoUrISINrV
    			Alternate Monk expanded: https://www.gmbinder.com/share/-MyVERQKKbawlJLVjpyo

    Sheet:      v13.0.06 and newer
 
    Code by:    Original script by CalypsoMoonlace
*/


// Meta information
var iFileName = "LaserLlama - Monk.js";
RequiredSheetVersion("13.0.6");

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
				"Monk weapons: any simple melee (not special/heavy), unarmed strike, shortsword",
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
						if (classes.known["monk(laserllama)"] && classes.known["monk(laserllama)"].level && (v.theWea.monkweapon || v.baseWeaponName == "unarmed strike" || v.baseWeaponName == "shortsword" || (v.isMeleeWeapon && (/simple/i).test(v.theWea.type) && !(/heavy/i).test(fields.Description)))) {
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
					"I can use either Strength or Dexterity and my Martial Arts damage die in place of the normal damage die for any 'Monk Weapons', which include unarmed strike, shortsword, and any simple melee weapon that is not heavy or has the 'special' property.",
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
			extrachoices : ["Arresting Strike","Crippling Strike","Empowered Strike","Mystic Healing","Patient Defense","Slow Fall","Step of the Wind",
				"Deflect Missiles", "Gentling Touch", "Seeking Strike", "Slowing Strike", "Stunning Strike",
				"Aura Sight", "Heavenly Step", "Indomitable Spirit", "Mantle of Courtesy",
				"Armor of the Ascetic", "Mystical Integrity", "Tongue of Sun and Moon",
				"Empty Body", "Quivering Palm"],
			limfeaname : "Ki Points",
			usages : "Monk level + Wisdom modifier per ",
			usagescalc : "event.value = classes.known['monk(laserllama)'].level + What('Wis Mod');",
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
				action : ["action", ""]
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
				additional : "1 ki point",
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
			"armor of the ascetic" : {
				name : "Armor of the Ascetic",
				source : ["GMB:LL"],
				description : desc(["At the end of a short or long rest, I gain the effects of sanctuary spell","This lasts until the start of my next short or long rest and can end early as normal"]),
				submenu : "[monk level 13+]",
				prereqeval : function(v) { return classes.known["monk(laserllama)"].level >= 13; },
				recovery : "short rest",
            	usages : 1
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
			autoSelectExtrachoices : [{extrachoice : "flurry of blows"}]
		},
		"unarmored movement" : {
			name : "Unarmored Movement",
			source : ["GMB:LL"],
			minlevel : 2,
			description : desc("Speed increases and eventually lets me traverse some surfaces without falling as I move"),
			additional : levels.map(function (n) {
				if (n < 2) return "";
				var spd = "+" + (n < 6 ? 10 : n < 10 ? 15 : n < 14 ? 20 : n < 18 ? 25 : 30) + " ft";
				var xtr = n < 9 ? "" : "; Vertical surfaces and liquids";
				return spd + xtr;
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
			description : desc("I can spend 1 Ki Point to instantly end either the charmed or frightened condition on myself"),
			additional : "1 ki point"
		},
		"timeless body" : {
			name : "Timeless Body",
			source : ["GMB:LL"],
			minlevel : 15,
			description : desc(["I don't require food or water; I don't suffer age penalties and can't be aged magically","For every 10 years that pass my physical body only ages 1 year"])
		},
		"perfect self" : {
			name : "Perfect Self",
			source : ["GMB:LL"],
			minlevel : 20,
			description : desc("I regain all expended Ki Points by meditating or performing only light activity for 10 minutes")
		}
	}
}

// Way of the Wuxia
RunFunctionAtEnd(function () {
	var theKenseiSubclassName = AddSubClass("monk(laserllama)", "way of the wuxia", {
		regExpSearch : /wuxia/i,
		subname : "Way of the Wuxia",
		source : ["GMB:LL"],
		fullname : "Wuxia",
		features : {
			"subclassfeature3" : {
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
							var theKenseiWeapons = GetFeatureChoice("class", "monk(laserllama)", "subclassfeature3", true);
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
			"subclassfeature3.1" : {
				name : "Wuxia Techniques",
				source : [["GMB:LL", 0]],
				minlevel : 3,
				description : desc(["I learn additional Techniques who don't count against my total and can't be switched"]),
				"patient defense" : {
					name : "Patient Defense",
					extraname : "Wuxia Technique",
					source : ["GMB:LL"],
					description : " [1 ki point]" + desc("As a bonus action, I can take the Dodge action"),
					action : ["bonus action", ""]
				},
				"seeking strike" : {
					name : "Seeking Strike",
					source : ["GMB:LL"],
					description : desc("On miss with a Martial Arts attack, I can reroll the attack roll and must use the new result"),
					additional : "1 ki point"
				},
				"heavenly step" : {
					name : "Heavenly Step",
					extraname : "Wuxia Technique",
					source : ["GMB:LL"],
					description : " [1 ki point]" + desc(["I can move along vertical surfaces, across liquids, and upside down on ceilings without falling during the move","If I end my movement on a vertical surface, liquid, or upside down on a ceiling, I can spend 1 Ki Point to remain in place without falling until the start of my next turn"]),
				},
				autoSelectExtrachoices : [{
					extrachoice : "patient defense",
					minlevel : 3
				}, {
					extrachoice : "seeking strike",
					minlevel : 5
				}, {
					extrachoice : "heavenly step",
					minlevel : 9
				}]
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

	var itsFea = ClassSubList[theKenseiSubclassName].features.subclassfeature3;
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

// Source information
SourceList["GMB:LL"] = {
	name : "LaserLlama",
	abbreviation : "GMB:LL",
	abbreviationSpellsheet : "LL",
	group : "GM Binder",
	url : "https://www.gmbinder.com/profile/laserllama",
	date : "2018/04/22"
}