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
			source : [["SRD", 26], ["P", 78]],
			minlevel : 1,
			description : desc("Without armor and no shield, my AC is 10 + Dexterity modifier + Wisdom modifier"),
			armorOptions : [{
				regExpSearch : /justToAddToDropDown/,
				name : "Unarmored Defense (Wis)",
				source : [["SRD", 26], ["P", 78]],
				ac : "10+Wis",
				affectsWildShape : true
			}],
			armorAdd : "Unarmored Defense (Wis)"
		},
		"martial arts" : {
			name : "Martial Arts",
			source : [["SRD", 26], ["P", 78]],
			minlevel : 1,
			description : desc([
				"Monk weapons: any simple melee (not two-handed/heavy), unarmed strike, shortsword",
				"With monk weapons, I can use Dex instead of Str and use the Martial Arts damage die",
				"When taking an Attack action with these, I get one unarmed strike as a bonus action",
				"I can replace Strength (Athletics) checks to grapple or shove with a Dexterity (Athletics) check"
			]),
			addMod : [
				{ type : "skill", field : "Athletics", mod : "max(Dex-Str|0)", text : "I can replace Strength (Athletics) checks to grapple or shove with a Dexterity (Athletics) check" }
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
			source : [["SRD", 27], ["P", 78]],
			minlevel : 2,
			description : desc([
				"I can spend ki points to fuel special actions (see third page)",
				"I need to meditate for at least 30 min of a short rest for that short rest to restore ki",
				"I also learn techniques and can replace them when I gain a monk level (use \"Choose Feature\")",
				"I can only use one Technique per each attack, ability check, or saving throw"
			]),
			extraname : "Monk Techniques",
			extraTimes : ['', 3, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 9, 10, 10, 10],
			extrachoices : ["Patient Defense","Step of the Wind"],
			limfeaname : "Ki Points",
			usages : "Monk level + Wisdom modifier per ",
			usagescalc : "event.value = classes.known['monk(laserllama)'].level + What('Wis Mod');",
			recovery : "short rest",
			"flurry of blows" : {
				name : "Flurry of Blows",
				extraname : "Ki Feature",
				source : [["SRD", 27], ["P", 78]],
				description : " [1 ki point]" + desc("After taking the Attack action, I can make 2 unarmed attacks as a bonus action"),
				action : ["bonus action", " (after Attack action)"]
			},
			"patient defense" : {
				name : "Patient Defense",
				extraname : "Ki Feature",
				source : [["SRD", 27], ["P", 78]],
				description : " [1 ki point]" + desc("As a bonus action, I can take the Dodge action"),
				action : ["bonus action", ""]
			},
			"step of the wind" : {
				name : "Step of the Wind",
				extraname : "Ki Feature",
				source : [["SRD", 27], ["P", 78]],
				description : " [1 ki point]" + desc("As a bonus action, I can either Dash or Disengage; My jump distance doubles when I do so"),
				action : ["bonus action", ""]
			},
			autoSelectExtrachoices : [
			{extrachoice : "flurry of blows"}
			/*, {
				extrachoice : "patient defense"
			}, {
				extrachoice : "step of the wind"
			}*/]
		},
		"unarmored movement" : {
			name : "Unarmored Movement",
			source : [["SRD", 27], ["P", 78]],
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
			source : [["SRD", 27], ["P", 78]],
			minlevel : 3,
			description : desc('Choose a Monastic Tradition to commit to and put it in the "Class" field ')
		},
		/*"deflect missiles" : {
			name : "Deflect Missiles",
			source : [["SRD", 27], ["P", 78]],
			minlevel : 3,
			description : desc([
				"As a reaction, I can reduce ranged weapon attack damage done to me",
				"If the damage is negated, I catch and may throw it back (20/60 ft) as a monk weapon"
			]),
			action : ["reaction", ""],
			additional : levels.map(function (n) {
				return n < 3 ? "" : "1d10 + " + n + " + Dexterity modifier; 1 ki to throw";
			})
		},
		"slow fall" : {
			name : "Slow Fall",
			source : [["SRD", 27], ["P", 78]],
			minlevel : 4,
			description : desc("As a reaction, I can reduce any falling damage I take by five times my monk level"),
			additional : levels.map(function (n) { return n < 4 ? "" : (n*5) + " less falling damage" }),
			action : ["reaction", ""],
			"stunning strike" : {
				name : "Stunning Strike",
				extraname : "Monk 5",
				source : [["SRD", 27], ["P", 79]],
				description : " [1 ki point]" + desc([
					"After I hit a creature with a melee weapon attack, I can spend a ki point to try to stun it",
					"It has to succeed on a Constitution save or be stunned until the end of my next turn"
				])
			},
			autoSelectExtrachoices : [{
				extrachoice : "stunning strike",
				minlevel : 5
			}]
		},*/
		"enlightened fist" : {
			name : "Enlightened Fist",
			source : [["SRD", 28], ["P", 79]],
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
			source : [["SRD", 28], ["P", 79]],
			minlevel : 7,
			description : desc("My Dexterity saves vs. areas of effect negate damage on success and halve it on failure"),
			savetxt : { text : ["Dex save vs. area effects: fail \u2015 half dmg, success \u2015 no dmg"] }
		},
		"ki adept" : {
			name : "Ki Adept",
			source : [["SRD", 28], ["P", 79]],
			minlevel : 11,
			description : desc("Once on my turn, I can use a Technique I know that costs 1 Ki Point, or Flurry of Blows without spending Ki")
		},
		"purity of body" : {
			name : "Purity of Body",
			source : [["SRD", 28], ["P", 79]],
			minlevel : 13,
			description : desc("I gain proficiency in Con saving throws; I am immune to the poisoned condition and disease"),
			savetxt : { immune : ["poisoned", "disease"] },
			saves : ["Con"]
		},
		"diamond soul" : {
			name : "Diamond Soul",
			source : [["SRD", 28], ["P", 79]],
			minlevel : 14,
			description : desc("I can spend 1 Ki Point to instantly end either the charmed or frightened condition on myself"),
			additional : "1 ki point"
		},
		"timeless body" : {
			name : "Timeless Body",
			source : [["SRD", 28], ["P", 79]],
			minlevel : 15,
			description : desc(["I don't require food or water; I don't suffer age penalties and can't be aged magically","For every 10 years that pass my physical body only ages 1 year"])
		},
		/*"empty body" : {
			name : "Empty Body",
			source : [["SRD", 28], ["P", 79]],
			minlevel : 18,
			description : desc("Be invisible and resist non-force damage for 1 min or cast Astral Projection on self"),
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
					changes : "I can spend 8 ki points to cast Astral Projection without requiring material components, although I can't bring other creatures with me."
				}
			}
		},*/
		"perfect self" : {
			name : "Perfect Self",
			source : [["SRD", 28], ["P", 79]],
			minlevel : 20,
			description : desc("I regain all expended Ki Points by meditating or performing only light activity for 10 minutes")
		}
	}
}