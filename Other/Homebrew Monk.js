/*  -WHAT IS THIS?-
    This file adds optional material to "MPMB's Character Record Sheet" found at https://www.flapkan.com/download#charactersheets
    Import this file using the "Add Extra Materials" bookmark.

    -KEEP IN MIND-
    It is recommended to enter the code in a fresh sheet before adding any other information (i.e. before making your character with it).
	
    -INFORMATION-
    Subject:    Homebrew Monk

    Effect:     This script adds a homebrew Monk class published in homebrewery under the Fan Content policy
    			Homebrew Monk: https://homebrewery.naturalcrit.com/share/j7fWeAeuoi4P

    Sheet:      v13.0.06 and newer
 
    Code by:    Original script by CalypsoMoonlace (commissioned)
*/


// Meta information
var iFileName = "Homebrew - Monk.js";
RequiredSheetVersion("13.0.6");

// Main class
ClassList["monk(custom)"] = {
    name : "Monk(custom)",
    regExpSearch : /^(?=.*monk)(?=.*custom).*$/i,
    source : ["HB", 0],
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
			source : ["HB"],
			minlevel : 1,
			description : desc("Without armor and no shield, my AC is 10 + Dexterity modifier + Wisdom modifier"),
			armorOptions : [{
				regExpSearch : /justToAddToDropDown/,
				name : "Unarmored Defense (Wis)",
				source : ["HB"],
				ac : "10+Wis",
				affectsWildShape : true
			}],
			armorAdd : "Unarmored Defense (Wis)"
		},
		"martial arts" : {
			name : "Martial Arts",
			source : ["HB"],
			minlevel : 1,
			description : desc([
				"Monk weapons: any simple melee (not two-handed/heavy), unarmed strike, shortsword",
				"With monk weapons, I can use Dex instead of Str and use the Martial Arts damage die"
			]),
			additional : levels.map(function (n) {
				return "1d" + (n < 5 ? 6 : n < 11 ? 8 : n < 17 ? 10 : 12);
			}),
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
						if (classes.known["monk(custom)"] && classes.known["monk(custom)"].level && (v.theWea.monkweapon || v.baseWeaponName == "unarmed strike" || v.baseWeaponName == "shortsword" || (v.isMeleeWeapon && (/simple/i).test(v.theWea.type) && !(/heavy|((^|[^+-]\b)2|\btwo).?hand(ed)?s?/i).test(fields.Description)))) {
							v.theWea.monkweapon = true;
							var aMonkDie = function (n) { return n < 5 ? 6 : n < 11 ? 8 : n < 17 ? 10 : 12; }(classes.known["monk(custom)"].level);
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
					"I can use either Strength or Dexterity and my Martial Arts damage die in place of the normal damage die for any 'Monk Weapons', which include unarmed strike, shortsword, and any simple melee weapon that is not heavy or has the two-handed property.",
					5
				]
			}
		},
		"ki" : {
			name : "Ki",
			source : ["HB"],
			minlevel : 2,
			description : desc([
				"I can spend ki points to fuel special actions (see third page)",
				"I need to meditate for at least 30 min of a short rest for that short rest to restore ki"
			]),
			limfeaname : "Ki Points",
			usages : "Monk level + Wisdom modifier per ",
			usagescalc : "event.value = classes.known['monk(custom)'].level + What('Wis Mod');",
			recovery : "short rest",
			"flurry of blows" : {
				name : "Flurry of Blows",
				extraname : "Ki Feature",
				source : ["HB"],
				description : levels.map(function (n) {
					if (n < 2) return ""
					if (n < 11) return desc("After taking the Attack action, I can make one unarmed strike as a bonus action");
					if (n < 15) return desc("After taking the Attack action, I can make two unarmed strikes as a bonus action");
					if (n < 17) return desc(["After taking the Attack action, I can make two unarmed strikes as a bonus action", "For each attack I can pick a second target within reach who takes the same dmg if it would hit"])
					return desc(["After taking the Attack action, I can make three unarmed strikes as a bonus action", "For each attack I can pick a second target within reach who takes the same dmg if it would hit"])
				}),
				additional : levels.map(function (n) {
					return n < 19 ? "1 ki point" : ""
				}),
				action : ["bonus action", " (after Attack action)"]
			},
			"patient defense" : {
				name : "Patient Defense",
				extraname : "Monk Technique",
				source : ["HB"],
				description : desc("As a bonus action, I can take the Dodge action"),
				action : ["bonus action", ""],
				additional : "1 ki point",
			},
			"step of the wind" : {
				name : "Step of the Wind",
				extraname : "Monk Technique",
				source : ["HB"],
				description : levels.map(function (n) {
					if (n < 9) desc("As a bonus action, I can either Dash or Disengage; My jump distance doubles when I do so");
					return desc("As a bonus action, I can Dash and Disengage; My jump distance doubles when I do so")
				}),
				action : ["bonus action", ""]
			},
			"deflect missiles" : {
				name : "Deflect Missiles",
				source : ["HB"],
				description : desc(["As a reaction, I can reduce ranged weapon attack damage done to me",
							"If the damage is negated, I catch and may throw it back (20/60 ft) as a monk weapon"]),
				action : ["reaction", ""],
				additional : levels.map(function (n) {
					return "1d10 + " + n + " + Dexterity modifier; 1 ki to throw";
				})
			},
			"quickened healing" : {
				name : "Quickened Healing",
				extraname : "Monk Technique",
				source : [["T", 49]],
				description : levels.map(function (n) {
					if (n < 12) return desc("As a bonus action, I can regain HP equal to 1d" + (n < 5 ? 6 : n < 11 ? 8 : n < 17 ? 10 : 12) + " + PB");
					return desc("As a bonus action, I can regain HP equal to 1d" + (n < 5 ? 6 : n < 11 ? 8 : n < 17 ? 10 : 12) + " + PB + Wis mod");
				}),
				additional : "2 ki points",
				action : [["bonus action", ""]]
			},
			"stunning strike" : {
				name : "Stunning Strike",
				extraname : "Monk Technique",
				source : ["HB"],
				description : " [1 ki point]" + desc([
					"After I hit a creature with a melee weapon attack, I can spend a ki point to try to stun it",
					"It has to succeed on a Constitution save or be stunned until the end of my next turn"
				])
			},
			"focused aim" : {
				name : "Focused Aim",
				extraname : "Monk Technique",
				source : ["HB"],
				description : " [1-3 ki points]\n   When I miss an attack roll, I can spend ki to increase the roll by +2 per ki point (max +6)"
			},
			"empty body" : {
				name : "Empty Body",
				source : ["HB"],
				description : desc(["Be invisible and resist non-force damage for 1 min or cast Astral Projection on self",
					"I can cast Astral Projection as ritual (1 h) to bring up to 8 willing creatures",
					"I can cast Astral Projection without spending Ki once per long rest"]),
				additional : "Invisible: 4 ki points; Astral Projection: 8 ki points",
				action : ["action", ""],
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
						changes : "I can spend 8 ki points to cast Astral Projection without requiring material components, although I can't bring other creatures with me unless I cast it as ritual (1 h)"
					}
				},
				recovery : "long rest",
            	usages : 1
			},
			autoSelectExtrachoices : [
				{extrachoice : "flurry of blows"},
				{extrachoice : "patient defense"},
				{extrachoice : "step of the wind"},{
					extrachoice : "deflect missiles",
					minlevel : 3
				},{
					extrachoice : "slow fall",
					minlevel : 4
				},{
					extrachoice : "quickened healing",
					minlevel : 4
				},{
					extrachoice : "stunning strike",
					minlevel : 5
				},{
					extrachoice : "focused aim",
					minlevel : 5
				},{
					extrachoice : "empty body",
					minlevel : 18
				}]
		},
		"unarmored movement" : {
			name : "Unarmored Movement",
			source : ["HB"],
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
		"dedicated weapon" : {
			name : "Dedicated Weapon",
			source : ["HB"],
			minlevel : 3,
			description : desc([
				"When I finish a short or long rest, I can focus ki and touch one simple or martial weapon",
				"From then on, until I use this feature again, this weapon counts as a monk weapon for me",
				"I have to be proficient with the weapon and it can't have the heavy or special property"
			]),
			calcChanges : {
				atkAdd : [
					function (fields, v) {
						if (!v.theWea.monkweapon && !v.theWea.special && classes.known.monk && classes.known.monk.level && (/dedicated/i).test(v.WeaponTextName) && fields.Proficiency && (/simple|martial/i).test(v.theWea.type) && !(/\b(heavy|special)\b/i).test(fields.Description)) {
							v.theWea.monkweapon = true;
						};
					},
					'If I include the word "Dedicated" in the name of a simple or martial weapon that I\'m proficient with and that doesn\'t have the heavy or special property, it will be treated as a monk weapon.',
					1
				]
			}
		},
		"ki-fueled attack" : {
			name : "Ki-Fueled Attack",
			source : ["HB"],
			minlevel : 3,
			description : desc('If I spend 1 Ki during my action, I can make one unarmed strike/monk weapon attack as a bonus action'),
			action : ["bonus action",""]
		},
		"subclassfeature3" : {
			name : "Monastic Tradition",
			source : ["HB"],
			minlevel : 3,
			description : desc('Choose a Monastic Tradition to commit to and put it in the "Class" field ')
		},
		"slow fall" : {
			name : "Slow Fall",
			minlevel : 4,
			source : ["HB"],
			description : desc("As a reaction, I can reduce any falling damage I take by five times my monk level"),
			additional : levels.map(function (n) { return n < 4 ? "" : (n*5) + " less falling damage" }),
			action : ["reaction", ""]
		},
		"enlightened fist" : {
			name : "Enlightened Fist",
			source : ["HB"],
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
			source : ["HB"],
			minlevel : 7,
			description : desc("My Dexterity saves vs. areas of effect negate damage on success and halve it on failure"),
			savetxt : { text : ["Dex save vs. area effects: fail \u2015 half dmg, success \u2015 no dmg"] }
		},
		"stillness of mind" : {
			name : "Stillness of Mind",
			source : ["HB"],
			minlevel : 7,
			description : levels.map(function (n) {
				if (n < 7) return "";
				if (n < 14) return desc("As an action, I can end one effect on me that causes me to be charmed or frightened")
				return desc("I can spend my action or 1 Ki Point to instantly end either the charmed or frightened condition on myself")
			}),
			action: ["action",""]
		},
		"resilient soul" : {
			name : "Resilient Soul",
			source : ["HB"],
			minlevel : 8,
			description : desc("Add half my PB (rounded down) to any Int, Wis or Cha saving throw if not already proficient"),
			addMod : [
				{ type : "save", field : "Int", mod : "prof/2", text : "Resilient Soul class feature" },
				{ type : "save", field : "Wis", mod : "prof/2", text : "Resilient Soul class feature" },
				{ type : "save", field : "Cha", mod : "prof/2", text : "Resilient Soul class feature" },
			]
		},
		"purity of body" : {
			name : "Purity of Body",
			source : ["HB"],
			minlevel : 10,
			description : desc("I am immune to poison and disease; I add my Wis mod if I heal from Hit Die during short rest"),
			savetxt : { immune : ["poison", "disease"] } //both immune to poison damage and the poisoned condition (see sage advice)
		},
		"ki adept" : {
			name : "Ki Adept",
			source : ["HB"],
			minlevel : 11,
			description : desc("Once on my turn, I can use a Technique I know that costs 1 Ki Point, or Flurry of Blows without spending Ki")
		},
		"timeless body" : {
			name : "Timeless Body",
			source : ["HB"],
			minlevel : 13,
			description : desc(["I don't require food or water; I don't suffer age penalties and can't be aged magically","For every 10 years that pass my physical body only ages 1 year"])
		},
		"tongue of the sun and moon" : {
			name : "Tongue of the Sun and Moon",
			source : ["HB"],
			minlevel : 13,
			description : desc("I can understand all spoken languages and all creatures with a language understand me")
		},
		"diamond soul" : {
			name : "Diamond Soul",
			source : ["HB"],
			minlevel : 14,
			description : desc("I am proficient with all saves; I can reroll a failed save once by spending 1 ki point"),
			additional : "1 ki point to reroll failed saving throw",
			saves : ["Str", "Dex", "Con", "Int", "Wis", "Cha"],
			addMod : [
				{ type : "save", field : "Int", mod : "-prof/2", text : "Diamond Soul class feature" },
				{ type : "save", field : "Wis", mod : "-prof/2", text : "Diamond Soul class feature" },
				{ type : "save", field : "Cha", mod : "-prof/2", text : "Diamond Soul class feature" },
			] // this cancels out Resilient Soul, see https://canary.discord.com/channels/533350585706217494/863810547584467004/1240018442799546409
		},
		"abundant step" : {
			name : "Abundant Step",
			source : ["HB"],
			minlevel : 15,
			description : desc("As an action, I can cast Dimension door but only for myself; I can spend 4 Ki to cast it again"),
			spellcastingBonus : {
				name : "Abundant Step",
				spells : ["dimension door"],
				selection : ["dimension door"],
				firstCol : 4
			},
			spellFirstColTitle : "Ki",
			spellChanges : {
				"dimension door" : {
					components : "V,S",
					compMaterial : "",
					description : "Teleport myself up to 500 ft to a place I can see, specify, or describe",
					changes : "I can spend 4 ki points to cast Dimension door without requiring material components, although I can't bring other creatures with me."
				}
			},
			usages : 1,
			recovery : "long rest",
		},
		"true seeing" : {
			name : "True Seeing",
			source : ["HB"],
			minlevel : 16,
			description : desc(["For 1 h, I have truesight, notice secret doors hidden by magic, can see into the Ethereal Plane, all out to a range of 120 ft; I can use this once per long rest or spend 6 ki to use it again"]),
			action: ["action",""],
			usages : 1,
			recovery : "long rest"
		},
		"flowing ki" : {
			name : "Flowing Ki",
			source : ["HB"],
			minlevel : 19,
			description : desc(["I regain 1d4 Ki (up to my max) when rolling initiative", "Any feature that costs Ki costs one less (min of 1) and Flurry of Blows no longer costs ki"]),
		},
		"perfect self" : {
			name : "Perfect Self",
			source : ["HB"],
			minlevel : 20,
			description : desc("I regain all expended Ki Points by meditating or performing only light activity for 10 minutes")
		}
	}
}

// Way of the Wuxia
RunFunctionAtEnd(function () {
	var theKenseiSubclassName = AddSubClass("monk(custom)", "way of the wuxia", {
		regExpSearch : /wuxia/i,
		subname : "Way of the Wuxia",
		source : ["HB"],
		fullname : "Wuxia",
		features : {
			"subclassfeature3" : {
				name : "Student of Steel",
				source : ["HB"],
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
							var theKenseiWeapons = GetFeatureChoice("class", "monk(custom)", "subclassfeature3", true);
							if (theKenseiWeapons.indexOf(v.baseWeaponName) != -1 || ((/wuxia/i).test(v.WeaponTextName) && !v.theWea.special && (!(/heavy|special/i).test(fields.Description)))) {
								v.theWea.monkweapon = true;
								v.theWea.kenseiweapon = true;
								fields.Proficiency = true;
							};
						},
						"For the weapons that I select using the \"Choose Feature\" button on the second page or when I include the word 'Wuxia' in the name of a weapon that doesn't have the Heavy or Special attribute, that weapon gains the same benefits as any other 'Monk Weapon'",
						1
					]
				},
				"patient defense" : {
					name : "Patient Defense",
					extraname : "Wuxia Technique",
					source : ["HB"],
					description : " [1 ki point]" + desc("As a bonus action, I can take the Dodge action"),
					action : ["bonus action", ""]
				},
				"seeking strike" : {
					name : "Seeking Strike",
					source : ["HB"],
					extraname : "Wuxia Technique",
					description : desc("On miss with a Martial Arts attack, I can reroll the attack roll and must use the new result"),
					additional : "1 ki point"
				},
				"heavenly step" : {
					name : "Heavenly Step",
					extraname : "Wuxia Technique",
					source : ["HB"],
					description : " [1 ki point]" + desc(["I can move along vertical surfaces, across liquids, and upside down on ceilings without falling during the move","If I end my movement on a vertical surface, liquid, or upside down on a ceiling, I can spend 1 Ki Point to remain in place without falling until the start of my next turn"]),
				},
				autoSelectExtrachoices : [/*{
					extrachoice : "patient defense",
					minlevel : 3
				},*/ {
					extrachoice : "seeking strike",
					minlevel : 5
				}, {
					extrachoice : "heavenly step",
					minlevel : 9
				}]
			},
			"enlightened fist" : {
				name : "Ki-Infused Weapons",
				source : ["HB"],
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
					source : ["HB"],
					description : "\n   " + "Once per turn when I hit with a Wuxia weapon, I can do a martial arts die extra damage",
					additional : "1 ki point"
				},
				"spirit blade" : {
					name : "Spirit Blade",
					extraname : "Way of the Wuxia 11",
					source : ["HB"],
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
				source : ["HB"],
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
SourceList["HB"] = {
	name : "Seth's homebrew monk",
	abbreviation : "HB",
	abbreviationSpellsheet : "HB",
	group : "Seth",
	url : "https://homebrewery.naturalcrit.com/share/j7fWeAeuoi4P",
	date : "2024/05/14"
}