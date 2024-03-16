/*  -WHAT IS THIS?-
    This file adds optional material to "MPMB's Character Record Sheet" found at https://www.flapkan.com/download#charactersheets
    Import this file using the "Add Extra Materials" bookmark.

    -KEEP IN MIND-
    It is recommended to enter the code in a fresh sheet before adding any other information (i.e. before making your character with it).
	
    -INFORMATION-
    Subject:    Alternate Fighter

    Effect:     This script adds the Alternate Fighter class published by Laserllama in GM Binder under the Fan Content policy.
    			Laserllama: https://www.gmbinder.com/profile/laserllama
    			Alternate Fighter: https://www.gmbinder.com/share/-MSfA82gv8V69JAoqFVq
    			Alternate Fighter expanded: https://www.gmbinder.com/share/-MUkP55cdNMTFYMKlDUL

    Sheet:      v13.0.06 and newer
 
    Code by:    Original script by CalypsoMoonlace
    			Thanks to @garnaul (t-santana on github) for helping out with some exploits
*/


// Meta information
var iFileName = "LaserLlama - Fighter.js";
RequiredSheetVersion("13.0.6");

// Utility function
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
			// NOTE: prereqeval shouldn't be added here because they are automatically selected with autoSelectExtrachoices
			eval : MartialEvalFactory(NewSpellKey),
			removeeval : MartialRemoveFactory(NewSpellKey)
		};
	}

	return SubclassExploits;
}

// Factory methods
function MartialEvalFactory(tempSpell) {
	// pre: tempSpell is the key of an item from SpellsList
	// post: returns an eval() function that adds the tempSpell to the spell list when evaluated
	return function() {
		if (!CurrentSpells["martial exploits"]) {
			// Defining the Fighter spell sheet - also known as Martial exploits
			CurrentSpells["martial exploits"] = {
				name : "Martial Exploits",
				shortname : "Martial Exploits",
				ability: 1,
				bonus : {},
				typeSp:"known",
				refType:"feat"
			}
		}

	    CurrentSpells["martial exploits"].bonus["martial exploit " + tempSpell] = [{ // What is added to the spellcasting sheet
				name : "Martial Exploits",
				spellcastingAbility : 1,
				spells : [tempSpell],
				selection : [tempSpell]
			}];
	    SetStringifieds('spells'); CurrentUpdates.types.push('spells');
	}
}

function MartialRemoveFactory(tempSpell) {
	// pre: tempSpell is the key of an item from SpellsList
	// post: returns a removeeval() function that remove the tempSpell from the spell list when evaluated
	return function() {
	    delete CurrentSpells["martial exploits"].bonus["martial exploit " + tempSpell];
	    SetStringifieds('spells'); CurrentUpdates.types.push('spells');
	}
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

// Fighting styles
var FightingStylesLL = {
	archery : {
		name : "Archery Fighting Style",
		description : desc("+2 bonus to attack rolls I make with ranged weapons"),
		calcChanges : {
			atkCalc : [
				function (fields, v, output) {
					if (v.isRangedWeapon && !v.isNaturalWeapon && !v.isDC) output.extraHit += 2;
				},
				"My ranged weapons get a +2 bonus on the To Hit."
			]
		}
	},

	brawler: {
		name : "Brawler Fighting Style",
		description : desc([
			"My unarmed strikes deal 1d6 damage. If I have both hands free and used my action to make only unarmed strikes, I can make a single unarmed strike as bonus action."
		]),
		calcChanges : {
			atkAdd : [
				function (fields, v) {
					if (v.baseWeaponName == "unarmed strike") {
						if (fields.Damage_Die == 1 || fields.Damage_Die == "1d4") fields.Damage_Die = '1d6';
					};
				},
				"My unarmed strikes deal 1d6 damage. If I have both hands free and used my action to make only unarmed strikes, I can make a single unarmed strike as bonus action.",
				1
			]
		},
		action : ['bonus action', '']
	},

	classical : {
		name : "Classical Swordplay Fighting Style",
		description : desc("+2 bonus to attack rolls and +1 to AC when wielding a finesse weapon and no other weapon, heavy armor nor shield"),
		calcChanges : {
			atkCalc : [
				function (fields, v, output) {
					for (var i = 1; i <= FieldNumbers.actions; i++) {
						if ((/off.hand.attack/i).test(What('Bonus Action ' + i))) return;
					};
					if ((/\bfinesse\b/i).test(fields.Description)) output.extraDmg += 2;
				},
				"When I'm wielding a finesse weapon in one hand and no weapon nor shield in my other hand, I do +2 damage with that melee weapon. This condition will always be false if the bonus action 'Off-hand Attack' exists."
			]
		},
		extraAC : {
			name : "Classical Swordplay Fighting Style", // necessary for features referring to fighting style properties directly
			mod : 1,
			text : "I gain a +1 bonus to AC when wielding a finesse weapon and no other weapon, heavy armor nor shield.",
			stopeval : function (v) { return v.heavyArmor || v.usingShield; }
		}
	},

	defense : {
		name : "Defense Fighting Style",
		description : desc("+1 bonus to AC when I'm wearing armor or wielding a shield"),
		extraAC : {
			name : "Defense Fighting Style", // necessary for features referring to fighting style properties directly
			mod : 1,
			text : "I gain a +1 bonus to AC while wearing armor or wielding a shield.",
			stopeval : function (v) { return !v.wearingArmor && !v.usingShield; }
		}
	},

	dueling : {
		name : "Dueling Fighting Style",
		description : desc("+2 to damage rolls when wielding a melee weapon in one hand and no other weapons"),
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

	dual_wielding : {
		name : "Dual Wielding Fighting Style",
		description : desc([
					"I can add make an additional attack when two-weapon fighting as part of my attack action",
					"I can add my ability modifier to the damage of my off-hand attacks"
					]),
		calcChanges : {
			atkCalc : [
				function (fields, v, output) {
					if (v.isOffHand) output.modToDmg = true;
				},
				"When engaging in two-weapon fighting, I can add my ability modifier to the damage of my off-hand attacks. If a melee weapon includes 'off-hand' or 'secondary' in its name or description, it is considered an off-hand attack."
			]
		},
		action : ["action","Dual Wielding (one additional attack)"]
	},

	featherweight : {
		name : "Featherweight Fighting Style",
		description : desc("+1 bonus to damage rolls and +10 ft to speed when wielding only light weapons and not wearing medium or heavy armor nor shield"),
		calcChanges : {
			atkCalc : [
				function (fields, v, output) {
					if ((/\blight\b/i).test(fields.Description)) output.extraDmg += 1;
				},
				"When I'm wielding light weapons and not wearing medium or heavy armor nor a shield, I do +1 damage with light weapons."
			]
		},
		speed : {
			allModes : "+10"
		}
	},

	great_weapon : {
		name : "Great Weapon Fighting Style",
		description : desc([
				"While wielding a heavy melee weapon in two hands and making an attack with my action,",
				"I treat total damage dice rolls lower than 5 as 6"
			]),
		calcChanges : {
			atkAdd : [
				function (fields, v) {
					if (v.isMeleeWeapon && (/\bheavy\b/i).test(fields.Description)) {
						fields.Description += (fields.Description ? '; ' : '') + 'Treat total damage dice rolls lower than 5 as 6';
					}
				},
				"While wielding a heavy melee weapon in two hands and making an attack with my action, I treat total damage dice rolls lower than 5 as 6"
			]
		}
	},

	improvised : {
		name : "Improvised Fighting Style",
		description : desc([
				"I am proficient with improvised weapons,",
				"I can reroll damage once per turn but it destroys non-magical objects"
			]),
		weaponProfs : [false, false, ["Improvised weapons"]]
	},

	marksman : {
		name : "Melee Marksman Fighting Style",
		description : desc([
			"I don't suffer disadv. on ranged attack rolls for being within 5 ft of a hostile creature",
			"When I make a ranged attack in my Attack action against a creature within 5 ft, I can use a bonus action to make a melee attack with my ranged weapon"
		]),
		weaponOptions : {
			regExpSearch : /(ranged|melee|marksman)/i,
			name : "Ranged weapon melee attack",
			source : [["P", 168]],
			ability : 1,
			type : "ranged weapon melee attack",
			damage : [1, 4, "bludgeoning"],
			range : "Melee",
			list: "melee",
			description : "As bonus action after Attack action with ranged weapon",
			abilitytodamage : true
		},
		weaponsAdd : ["Ranged weapon melee attack"],
		action : ["bonus action", "Melee Marksman attack (with Attack action)"],
		weaponProfs : [false, false, ["ranged weapon melee attack"]]
	},

	protector : {
		name : "Protector Fighting Style",
		description : desc(["As a reaction, I can add my prof bonus to AC against an attack made vs. me or someone within 5 ft of me. I need to be wielding a shield or a melee weapon to do this."]),
		action : ["reaction", ""]
	},

	strongbow : {
		name : "Strongbow Fighting Style",
		description : desc("I can use Strength for ranged attacks with longbows and shortbows, +1 damage when I do"),
		calcChanges : {
			atkAdd : [
				function (fields, v, output) {
					if (v.isRangedWeapon && (v.WeaponName == "shortbow" || v.baseWeaponName == "shortbow" || v.WeaponName == "longbow" || v.baseWeaponName == "longbow")) {
						fields.Mod = 1;
					}
				},
				"Strength-based attacks with longbows and shortbows get a +1 bonus damage"
			],
			atkCalc : [
				function (fields, v, output) {
					if (v.isRangedWeapon && (v.WeaponName == "shortbow" || v.baseWeaponName == "shortbow" || v.WeaponName == "longbow" || v.baseWeaponName == "longbow")) {
						output.extraDmg += 1;
					}
				},
				"Strength-based attacks with longbows and shortbows get a +1 bonus damage"
			]
		}
	},

	thrown : {
		name : "Thrown Weapon Fighting Style",
		description : desc("+2 bonus to damage rolls with thrown weapons as ranged attack"),
		calcChanges : {
			atkCalc : [
				function (fields, v, output) {
					if (v.isThrownWeapon) output.extraDmg += 2;
				},
				"My thrown weapons get a +2 bonus damage when thrown."
			]
		}
	},

	versatile : {
		name : "Versatile Fighting Style",
		description : desc([
				"+1 bonus to attack rolls when wielding a single versatile weapon and no shield",
				"When attacking with it, I can take a bonus action to grapple, shove or use an object"
			]),
		calcChanges : {
			atkCalc : [
				function (fields, v, output) {
					for (var i = 1; i <= FieldNumbers.actions; i++) {
						if ((/off.hand.attack/i).test(What('Bonus Action ' + i))) return;
					};
					if ((/\bversatile\b/i).test(fields.Description)) output.extraHit += 1;
				},
				"I get a +1 bonus to attack rolls when wielding a single versatile weapon and no shield"
			]
		},
		action : ["bonus action", "Grapple, shove or use an object (with Attack action)"]
	},

	// Fighting styles from expanded alternate fighter
	blind : {
		name : "Blind Warrior Fighting Style",
		description : desc([
							"I gain blindsight for a range of 5 times my prof bonus",
							"In that range, I can see invisible creatures and anything that isn't behind total cover or hidden"
						]),
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

	heavyweight : {
		name : "Heavyweight Fighting Style",
		description : desc("+1 damage to damage rolls and adv. on Strength (Athletics) checks to shove when wielding a heavy melee weapon"),
		calcChanges : {
			atkAdd : [
				function (fields, v) {
					if (v.isMeleeWeapon && (/\bheavy\b/i).test(fields.Description)) {
						fields.Description += (fields.Description ? '; ' : '') + 'Adv. on Strength (Athletics) checks to shove';
					}
				},
				"While wielding a heavy melee weapon, I get +1 to damage rolls and adv. on Strength (Athletics) checks to shove"
			],
			atkCalc : [
				function (fields, v, output) {
					if (v.isMeleeWeapon && (/\bheavy\b/i).test(fields.Description)) {
						output.extraDmg += 1;
					}
				},
				"While wielding a heavy melee weapon, I get +1 to damage rolls and adv. on Strength (Athletics) checks to shove"
			]
		}
	},

	mariner : {
		name : "Mariner Fighting Style",
		description : desc("+1 bonus to AC and swimming speed when not wearing medium or heavy armor nor shield"),
		extraAC : {
			name : "Mariner Fighting Style",
			mod : 1,
			text : "I gain a +1 bonus to AC when not wearing medium or heavy armor nor shield.",
			stopeval : function (v) { return v.mediumArmor || v.heavyArmor || v.usingShield; }
		},
		speed : {
			swim : { spd : "walk", enc : 0 }
		}
	},

	mountaineer : {
		name : "Mountaineer Fighting Style",
		description : desc("+1 bonus to AC and climbing speed when not wearing medium or heavy armor nor shield"),
		extraAC : {
			name : "Mountaineer Fighting Style",
			mod : 1,
			text : "I gain a +1 bonus to AC when not wearing medium or heavy armor nor shield.",
			stopeval : function (v) { return v.mediumArmor || v.heavyArmor || v.usingShield; }
		},
		speed : {
			climb : { spd : "walk", enc : 0 }
		}
	},

	mounted : {
		name : "Mounted Warrior Fighting Style",
		description : desc("+1 bonus to AC to me and my mount when riding, I can use my bonus action to command"),
		extraAC : {
			name : "Mounted Warrior Fighting Style",
			mod : 1,
			text : "I gain a +1 bonus to AC when riding a controlled mount"
		},
		action : ["bonus action", " (command)"]
	},
	// Note: it is not possible to check for AC bonus easily here, so I'll leave it like this

	pit : {
		name : "Pit Fighting Style",
		description : desc([
				"Tridents deal 1d8 (1d10) piercing damage on hit",
				"Attacks with nets only replace one attack, melee attacks don't have disadv."
			]),
		calcChanges : {
			atkAdd : [
				function (fields, v) {
					if (v.WeaponName == "net" || v.baseWeaponName == "net") {
						fields.Description = "Thrown, no disadv. in melee, up to large creature hit is restrained"
					}

					if ((v.WeaponName == "trident" || v.baseWeaponName == "trident") && (fields.Damage_Die == "1d4" || fields.Damage_Die == "1d6")) {
						fields.Damage_Die = "1d8";
						fields.Description = "Thrown, versatile (1d10)";
					}
				},
				"Nets attack only replace one attack, no disadv. in melee and my tridents deal 1d8 (1d10) damage"
			]
		}
	},

	shieldwarrior : {
		name : "Shield Warrior Fighting Style",
		description : desc([
							"+1 bonus to AC when I'm wielding a shield and nothing else",
							"I gain prof. with shields as martial melee weapon, 2d4 bludg. on hit"
						]),
		extraAC : {
			name : "Shield Warrior Fighting Style",
			mod : 1,
			text : "I gain a +1 bonus to AC while wielding a shield and nothing else.",
			stopeval : function (v) { return !v.usingShield; }
		},
		weaponOptions : {
			regExpSearch : /(shield|bash)/i,
			name : "Shield melee attack",
			ability : 1,
			type : "shield melee attack",
			damage : [2, 4, "bludgeoning"],
			range : "Melee",
			list: "melee",
			abilitytodamage : true
		},
		weaponsAdd : ["Shield melee attack"],
		weaponProfs : [false, false, ["shield melee attack"]]
	},


	standardbearer : {
		name : "Standard Bearer Fighting Style",
		description : desc([
			"As a reaction, I can give adv. to an attack made by someone within 5 ft of me",
			"I need to be wielding a standard or banner to do this"
		]),
		action : ["reaction", ""]
	},

	wrestler : {
		name : "Wrestler Fighting Style",
		description : desc([
						"When hitting someone on my turn, I can attempt to grapple or shove them as a bonus action",
						"I can drag grappled creatures up to my full speed"
					]),
		action : ["bonus action", "Grapple or shove (after hitting with Attack action)"]
	}
};

// Exploits list

/* HOW TO ADD AN EXPLOIT 
	Exploits attributes are split into two parts:
	1. Exploit exclusive attributes
	2. Regular spell attributes
	
	Exploit exclusive attributes are detailed below:
	isExploit // REQUIRED // 
		TYPE: boolean
		Has to be set to true for ALL Exploits
		Setting it to false is the same as not putting it

	submenu // OPTIONAL //
		TYPE: string
		Determines the submenu in which the Exploit will be added, if any
		It is recommended to use a submenu related to the degree of the Exploit

	prereqeval // OPTIONAL //
		TYPE: function or, for backwards-compatibility, string that is evaluated using eval()
		This should return 'true' if the prerequisite is met or 'false' otherwise
		NOTE: Do not add the class level preqrequisite, as it is calculated using the spell level attribute
		For more details: https://github.com/morepurplemorebetter/MPMBs-Character-Record-Sheet/blob/master/additional%20content%20syntax/feat%20(FeatsList).js#L146

	addMod // OPTIONAL //
		TYPE: array of objects (variable length)
		This should only be used if the exploit gives a passive bonus (eg, replacing a skill check with another ability)
		For more details: https://github.com/morepurplemorebetter/MPMBs-Character-Record-Sheet/blob/master/additional%20content%20syntax/_common%20attributes.js#L2108 

	Regular spell attributes are detailed below:
	classes // REQUIRED //
		TYPE: array (variable length)
		This determines which classes can access this Exploit

	level // REQUIRED //
		TYPE: number (0-5)
		This is the exploit's degree

	school // OPTIONAL //
		TYPE: string
		This determines the school in which the spell belongs
		For Exploits, there are currently the following schools: Combat, Skill & Order

		You can also define a new spell school abbreviation by adding it to the "spellSchoolList" object, like so:
			spellSchoolList["NewSc"] = "new school";
		Be aware that the object name can use capitalization but the entered string can't.

	components // OPTIONAL //
		TYPE: string
		This determines the required components for the spell
		For Exploits, there might be components such as a ranged weapon, a melee weapon, a free hand, etc.

	All other spell attributes can be found at:
	https://github.com/morepurplemorebetter/MPMBs-Character-Record-Sheet/blob/master/additional%20content%20syntax/spell%20(SpellsList).js

*/

// New spell schools
spellSchoolList["Combat"] = "combat";
spellSchoolList["Skill"] = "skill";
spellSchoolList["Order"] = "order";

// Martial Exploits
// 1st degree martial exploits
SpellsList["arresting strike"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[1st-degree exploits (combat)]",
	// Regular spell attributes
	name : "Arresting Strike",
	classes : ["fighter(laserllama)"],
	source : ["GMB:LL", 0],
	level : 1,
	school : "Combat",
	time : "Hit",
	timeFull : "No action required, on hit with a weapon attack",
	range : "Attack",
	components : "W", // W = weapon
	compMaterial : "Weapon attack",
	duration : "Instantaneous",
	save : "Dex",
	description : "On hit, target makes Dex saving throw or speed reduced to 0 and takes an Exploit Die of bonus dmg",
	descriptionFull : "When you hit a target with a weapon attack, you can expend one Exploit Die and force it to make a Dexterity saving throw. On a failure, it takes bonus damage equal to one roll of your Exploit Die and its speed is 0 until the start of your next turn."
};

SpellsList["brace up"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[1st-degree exploits (combat)]",
	prereqeval : function(v) { return What('Con') >= 11},
	// Regular spell attributes
	name : "Brace Up",
	classes : ["fighter(laserllama)"],
	source : ["GMB:LL", 0],
	level : 1,
	school : "Combat",
	time : "1 bns",
	range : "Self",
	duration : "Instantaneous",
	description : "Gain 1+Con temporary hit points",
	descriptionFull : "You steel yourself for combat, preparing yourself to take a hit. As a bonus action, you can expend one Exploit Die and gain temporary hit points equal to 1 + your Constitution modifier."
};

SpellsList["commanding presence"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[1st-degree exploits (checks)]",
	prereqeval : function(v) { return What('Str') >= 11 || What('Cha') >= 11},
	addMod : { type : "skill", field : "Intimidation", mod : "max(Str-Cha|0)", text : "I can replace Charisma (Intimidation) checks with Strength (Intimidation)" },
	// Regular spell attributes
	name : "Commanding Presence",
	classes : ["fighter(laserllama)", "barbarian(laserllama)"],
	source : ["GMB:LL", 0],
	level : 1,
	school : "Skill",
	time : "Check",
	range : "Self",
	duration : "Instantaneous",
	description : "Add Exploit Die to Persuasion and Intimidation checks; Can make Str (Intimidation) checks (passive)",
	descriptionFull : "When making a Charisma (Persuasion) or Charisma (Intimidation) check, you can expend one Exploit Die, roll it, and add the result to your ability check after rolling the d20 but before determining success.\n\nAdditionally, when required to make a Charisma (Intimidation) check, you can opt to make a Strength (Intimidation) check instead."
};

SpellsList["counter"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[1st-degree exploits (combat)]",
	prereqeval : function(v) { return What('Dex') >= 11},
	// Regular spell attributes
	name : "Counter",
	classes : ["fighter(laserllama)"],
	source : ["GMB:LL", 0],
	level : 1,
	school : "Combat",
	time : "1 rea",
	timeFull : "1 reaction, which you take when someone misses you with a melee attack",
	range : "Self",
	duration : "Instantaneous",
	description : "When a crea misses me in melee; Use my reaction for melee attack; Add exploit die to dmg",
	descriptionFull : "When a creature you can see misses you with a melee attack, you can use your reaction to expend an Exploit Die, make a single melee weapon attack against your attacker, and on hit, add one roll of your Exploit Die to the damage roll of that attack."
};

SpellsList["cunning instinct"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[1st-degree exploits (checks)]",
	prereqeval : function(v) { return What('Wis') >= 11},
	// Regular spell attributes
	name : "Cunning Instinct",
	classes : ["fighter(laserllama)"],
	source : ["GMB:LL", 0],
	level : 1,
	school : "Skill",
	time : "Check",
	range : "Self",
	duration : "Instantaneous",
	description : "Add Exploit Die to a Wisdom (Perception) or Wisdom (Survival) check",
	descriptionFull : "When making a Wisdom (Perception) or Wisdom (Survival) check, you can expend one Exploit Die, roll it, and add the result to your ability check after rolling but before determining success or failure."
};

SpellsList["disarm"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[1st-degree exploits (combat)]",
	// Regular spell attributes
	name : "Disarm",
	classes : ["fighter(laserllama)"],
	source : ["GMB:LL", 0],
	level : 1,
	school : "Combat",
	time : "Hit",
	timeFull : "No action required, on hit with a weapon attack",
	range : "Attack",
	components : "W", // W = weapon
	compMaterial : "Weapon attack",
	duration : "Instantaneous",
	save : "Str",
	description : "On hit, target makes Str saving throw or drops one item and takes an Exploit Die of bonus dmg",
	descriptionFull : "When you hit a creature with a weapon attack, you can expend an Exploit Die and attempt to disarm it. It must succeed on a Strength saving throw, or it takes additional damage equal to one roll of your Exploit Die, and it drops one item of your choice that it is currently holding on the ground in the space that it is currently occupying."
};

SpellsList["feat of strength"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[1st-degree exploits (checks)]",
	prereqeval : function(v) { return What('Str') >= 11 || What('Con') >= 11},
	// Regular spell attributes
	name : "Feat of Strength",
	classes : ["fighter(laserllama)"],
	source : ["GMB:LL", 0],
	level : 1,
	school : "Skill",
	time : "Check",
	range : "Self",
	duration : "Instantaneous",
	description : "Add any Exploit Die up to my Prof Bonus to a Str or Con ability check",
	descriptionFull : "Whenever you make a Strength or Constitution ability check you can expend Exploit Dice (up to your proficiency bonus), roll those dice, and add the total to the result of your ability check. You can do so after you roll the d20, but before you know if you succeed or fail."
};

SpellsList["feint"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[1st-degree exploits (combat)]",
	// Regular spell attributes
	name : "Feint",
	classes : ["fighter(laserllama)"],
	source : ["GMB:LL", 0],
	level : 1,
	school : "Combat",
	time : "1 bns",
	range : "15 ft",
	duration : "Instantaneous",
	description : "One creature makes Wis save or I have adv on all my attacks against them until the end of my turn",
	descriptionFull : "As a bonus action, you can expend one Exploit Die to feint, forcing a creature that can see you within 15 feet to make a Wisdom saving throw. On a failed save, you have advantage on your attacks against it until the end of your current turn."
};

SpellsList["first aid"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[1st-degree exploits (combat)]",
	// Regular spell attributes
	name : "First Aid",
	classes : ["fighter(laserllama)"],
	source : ["GMB:LL", 0],
	level : 1,
	school : "Combat",
	time : "1 a",
	timeFull : "An action",
	range : "Touch",
	duration : "Instantaneous",
	description : "Touch a creature with at least 1 hp, expend any Exploit Die up to Prof Bonus to heal total roll + its Con",
	descriptionFull : "As an action, you can touch a creature that has at least 1 hit point and expend Exploit Dice (up to your proficiency bonus), roll those dice, and that creature regains a number of hit points equal to the total roll + its Constitution modifier."
};

SpellsList["heroic fortitude"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[1st-degree exploits (checks)]",
	// Regular spell attributes
	name : "Heroic Fortitude",
	classes : ["fighter(laserllama)"],
	source : ["GMB:LL", 0],
	level : 1,
	school : "Skill",
	time : "Save",
	range : "Self",
	duration : "Instantaneous",
	description : "Add Exploit Die to a Str, Dex or Con saving throw",
	descriptionFull : "Whenever you are forced to make a Strength, Dexterity, or Constitution saving throw you can expend an Exploit Die, roll it, and add the result to your saving throw. You can do so after you roll the d20, but before you know if you succeed or fail."
};

SpellsList["hurl"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[1st-degree exploits (combat)]",
	prereqeval : function(v) { return What('Str') >= 11},
	// Regular spell attributes
	name : "Hurl",
	classes : ["fighter(laserllama)"],
	source : ["GMB:LL", 0],
	level : 1,
	school : "Combat",
	time : "Attack",
	timeFull : "In place of an attack",
	range : "60/120 ft",
	duration : "Instantaneous",
	save : "Dex",
	description : "1 crea makes Dex saving throw or both crea and thrown object take Exploit Die + Str bludg dmg",
	descriptionFull : "In place of an attack, you can expend an Exploit Die to throw an object that you are holding at a target you can see within 60 feet. The target must succeed on a Dexterity saving throw or both the object and target take bludgeoning damage equal to one roll of your Exploit Die + your Strength modifier.\n\nAt 11th level, the range of this Exploit becomes 120 feet"
};

SpellsList["inquisitive eye"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[1st-degree exploits (checks)]",
	prereqeval : function(v) { return What('Int') >= 11 ||What('Wis') >= 11},
	// Regular spell attributes
	name : "Inquisitive Eye",
	classes : ["fighter(laserllama)"],
	source : ["GMB:LL", 0],
	level : 1,
	school : "Skill",
	time : "Check",
	range : "Self",
	duration : "Instantaneous",
	description : "Add Exploit Die to an Intelligence (Investigation) or a Wisdom (Insight) check",
	descriptionFull : "When you make an Intelligence (Investigation) or a Wisdom (Insight) check you can expend one Exploit Die, roll it, and add the result to your ability check. You can do so after you roll the d20, but before you know if you succeed or fail."
};

SpellsList["lightstep"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[1st-degree exploits (checks)]",
	prereqeval : function(v) { return What('Dex') >= 11},
	// Regular spell attributes
	name : "Lightstep",
	classes : ["fighter(laserllama)"],
	source : ["GMB:LL", 0],
	level : 1,
	school : "Skill",
	time : "Check",
	range : "Self",
	duration : "Instantaneous",
	description : "Add Exploit Die to a Dexterity (Acrobatics) or a Dexterity (Stealth) check",
	descriptionFull : "When you make a Dexterity (Acrobatics) or a Dexterity (Stealth) check you can expend one Exploit Die, roll it, and add the result to your ability check. You can do so after you roll the d20, but before you know if you succeed or fail."
};

SpellsList["lunge"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[1st-degree exploits (combat)]",
	prereqeval : function(v) { return What('Dex') >= 11},
	// Regular spell attributes
	name : "Lunge",
	classes : ["fighter(laserllama)"],
	source : ["GMB:LL", 0],
	level : 1,
	school : "Combat",
	time : "Attack",
	timeFull : "No action required, as part of a weapon attack",
	range : "Melee",
	components : "W", // W = weapon
	compMaterial : "Melee weapon attack",
	duration : "Instantaneous",
	description : "Increase range of a melee weapon attack by 5 ft; Add Exploit Die to dmg",
	descriptionFull : "As part of a melee weapon attack you can expend an Exploit Die to increase the range of that attack by 5 feet. On hit, you deal additional damage equal to one roll of your Exploit Die."
};

SpellsList["mighty leap"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[1st-degree exploits (checks)]",
	prereqeval : function(v) { return What('Dex') >= 11},
	// Regular spell attributes
	name : "Mighty Leap",
	classes : ["fighter(laserllama)"],
	source : ["GMB:LL", 0],
	level : 1,
	school : "Skill",
	time : "Jump",
	timeFull : "After moving at least 10 ft immediately before jumping",
	range : "Self",
	duration : "Instantaneous",
	description : "Increase jump distance by 10 ft * Exploit Die expended (up to prof bonus) even if it exceeds my speed",
	descriptionFull : "When you move at least 10 feet immediately before you jump, you can expend Exploit Dice (up to your proficiency bonus) to increase the distance of your jump by 10 feet for each Exploit Die expended, even if this exceeds your remaining speed."
};

SpellsList["mighty thrust"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[1st-degree exploits (combat)]",
	prereqeval : function(v) { return What('Str') >= 11},
	// Regular spell attributes
	name : "Mighty Thrust",
	classes : ["fighter(laserllama)"],
	source : ["GMB:LL", 0],
	level : 1,
	school : "Combat",
	time : "Attack",
	timeFull : "In place of an attack",
	range : "Touch",
	duration : "Instantaneous",
	save : "Dex",
	description : "One crea makes Str save (larger crea have adv.) or knocked back in line by 5 ft times my Str mod",
	descriptionFull : "In place of an attack, you can expend an Exploit Die to force one target you touch to make a Strength saving throw. On a failed save, it is knocked back in a line number of feet equal to 5 times your Strength modifier. A target that is more than one size larger than you has advantage on its saving throw."
};

SpellsList["parry and riposte"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[1st-degree exploits (combat)]",
	prereqeval : function(v) { return What('Dex') >= 11},
	// Regular spell attributes
	name : "Parry and Riposte",
	classes : ["fighter(laserllama)"],
	source : ["GMB:LL", 0],
	level : 1,
	school : "Combat",
	time : "1 rea",
	timeFull : "1 reaction, which you take when someone hits you with a melee attack",
	components : "W*", // W = weapon, adding a * so the user knows it's more specific
	compMaterial : "Finesse or versatile weapon",
	range : "Self",
	duration : "Instantaneous",
	description : "Add Exploit Die to AC against 1 attack; Melee attack as part of the reaction if turns hit into miss",
	descriptionFull : "While you are wielding a finesse or versatile weapon, and a creature you can see hits you with a melee attack, you can use your reaction to expend one Exploit Die, roll it, and add it to your Armor Class against that attack. Should this cause the attack to miss, you can make one melee weapon attack against your attacker as part of the same reaction."
};

SpellsList["precision strike"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[1st-degree exploits (combat)]",
	prereqeval : function(v) { return What('Dex') >= 11},
	// Regular spell attributes
	name : "Precision Strike",
	classes : ["fighter(laserllama)"],
	source : ["GMB:LL", 0],
	level : 1,
	school : "Combat",
	time : "Attack",
	timeFull : "No action required, as part of a weapon attack",
	range : "Self",
	components : "W", // W = weapon
	compMaterial : "Weapon attack",
	duration : "Instantaneous",
	description : "Add Exploit Die to attack roll",
	descriptionFull : "As part of a weapon attack you can expend one Exploit Die, roll it, and add the result to your attack roll. You can use this Exploit after you roll, but before you know if you hit or miss."
};

SpellsList["rustic intuition"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[1st-degree exploits (checks)]",
	prereqeval : function(v) { return What('Wis') >= 11},
	// Regular spell attributes
	name : "Rustic Intuition",
	classes : ["fighter(laserllama)"],
	source : ["GMB:LL", 0],
	level : 1,
	school : "Skill",
	time : "Check",
	range : "Self",
	duration : "Instantaneous",
	description : "Add Exploit Die to an Intelligence (Nature), Wisdom (Animal Handling), or Wisdom (Medicine) check",
	descriptionFull : "When you make an Intelligence (Nature), Wisdom (Animal Handling), or Wisdom (Medicine) check you can expend an Exploit Die, roll it, and add the result to your ability check. You can do so after you roll, but before you know the result."
};

SpellsList["ruthless strike"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[1st-degree exploits (combat)]",
	prereqeval : function(v) { return What('Str') >= 11},
	// Regular spell attributes
	name : "Ruthless Strike",
	classes : ["fighter(laserllama)"],
	source : ["GMB:LL", 0],
	level : 1,
	school : "Combat",
	time : "Hit",
	timeFull : "No action required, when you hit a nonmagical object with an attack",
	range : "Melee",
	duration : "Instantaneous",
	description : "On hit, expend any Exploit Die up to Prof Bonus as bonus dmg",
	descriptionFull : "When you hit a target with a melee weapon attack, you can expend Exploit Dice (up to your proficiency bonus), roll the dice, and add them to the damage roll of that attack."
};

SpellsList["scholarly recall"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[1st-degree exploits (checks)]",
	prereqeval : function(v) { return What('Int') >= 11},
	// Regular spell attributes
	name : "Scholarly Recall",
	classes : ["fighter(laserllama)"],
	source : ["GMB:LL", 0],
	level : 1,
	school : "Skill",
	time : "Check",
	range : "Self",
	duration : "Instantaneous",
	description : "Add Exploit Die to an Intelligence (Arcana), Intelligence (History), or Intelligence (Religion) check",
	descriptionFull : "Whenever you make an Intelligence (Arcana), Intelligence (History), or Intelligence (Religion) check you can expend an Exploit Die, roll it, and add the result to your ability check. You can do so after you roll, but before you know the result."
};

SpellsList["shield impact"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[1st-degree exploits (combat)]",
	prereqeval : function(v) { return What('Str') >= 11},
	// Regular spell attributes
	name : "Shield Impact",
	classes : ["fighter(laserllama)"],
	source : ["GMB:LL", 0],
	level : 1,
	school : "Combat",
	time : "1 rea",
	timeFull : "1 reaction, which you take when someone hits you with an attack",
	components : "Shield",
	range : "Self",
	duration : "Instantaneous",
	description : "Reduce dmg taken by Exploit Die (up to my Prof Bonus) + Str",
	descriptionFull : "When a creature you can see hits you with an attack, you can use a reaction to expend Exploit Dice (up to your proficiency bonus), roll those dice, and reduce the damage of that attack by an amount equal to the total you rolled + your Strength modifier. You must be wielding a shield to use this Exploit."
};

SpellsList["skilled rider"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[1st-degree exploits (checks)]",
	prereqeval : function(v) { return What('Wis') >= 11},
	// Regular spell attributes
	name : "Skilled Rider",
	classes : ["fighter(laserllama)"],
	source : ["GMB:LL", 0],
	level : 1,
	school : "Skill",
	time : "Check",
	range : "Self",
	components : "Mount",
	duration : "Instantaneous",
	description : "Add Exploit Die to an Animal Handling check to control my mount or any d20 roll my mount makes",
	descriptionFull : "When your trained mount makes an ability check, attack roll, or saving throw, or you make a Wisdom (Animal Handling) check to control it, you can expend one Exploit Die, roll it, and add the result to your ability check. You can do so after you roll the d20, but before you know if you succeed or fail."
};

SpellsList["subtle con"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[1st-degree exploits (checks)]",
	prereqeval : function(v) { return What('Dex') >= 11 || What('Cha') >= 11},
	// Regular spell attributes
	name : "Subtle Con",
	classes : ["fighter(laserllama)"],
	source : ["GMB:LL", 0],
	level : 1,
	school : "Skill",
	time : "Check",
	range : "Self",
	duration : "Instantaneous",
	description : "Add Exploit Die to a Dex (Sleight of Hand), a Cha (Deception), or a Cha (Performance) check",
	descriptionFull : "When you make a Dexterity (Sleight of Hand), a Charisma (Deception), or a Charisma (Performance) check you can expend an Exploit Die, roll it, and add it to your ability check. You can do so after you roll, but before you know the result."
};

SpellsList["sweeping strike"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[1st-degree exploits (combat)]",
	// Regular spell attributes
	name : "Sweeping Strike",
	classes : ["fighter(laserllama)"],
	source : ["GMB:LL", 0],
	level : 1,
	school : "Combat",
	time : "Hit",
	timeFull : "No action required, when you hit a nonmagical object with an attack",
	range : "Melee",
	duration : "Instantaneous",
	description : "On hit, force target to make a Dex saving throw or take Exploit Die of bludg dmg and fall prone",
	descriptionFull : "When you hit a creature with a melee weapon attack, you can expend an Exploit Die and force it to make a Dexterity saving throw. On a failure, it takes bludgeoning damage equal to one roll of your Exploit Die and falls prone. A creature more than one size larger than you has advantage on its saving throw."
};

SpellsList["warding strike"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[1st-degree exploits (combat)]",
	// Regular spell attributes
	name : "Warding Strike",
	classes : ["fighter(laserllama)"],
	source : ["GMB:LL", 0],
	level : 1,
	school : "Combat",
	time : "1 rea",
	timeFull : "1 reaction, which you take when someone moves within the reach of a melee weapon you are wielding",
	range : "Self",
	duration : "Instantaneous",
	description : "When a crea moves within my melee reach; Use my reaction for melee attack; Add exploit die to dmg",
	descriptionFull : "When a creature moves within the reach of a melee weapon you are wielding, you can use a reaction to expend an Exploit Die and make a single attack against it with that weapon. On hit, you add one roll of your Exploit Die to your damage roll."
};

// From the expanded fighter
SpellsList["destructive strike"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[1st-degree exploits (combat)]",
	prereqeval : function(v) { return What('Str') >= 11},
	// Regular spell attributes
	name : "Destructive Strike",
	classes : ["fighter(laserllama)"],
	source : ["GMB:LL", 0],
	level : 1,
	school : "Combat",
	time : "Hit",
	timeFull : "No action required, when you hit a nonmagical object with an attack",
	range : "Attack",
	duration : "Instantaneous",
	description : "On hit on a non-magical item, treat attack dmg as maximum dmg and add roll of Exploit Die to dmg",
	descriptionFull : "When you hit a nonmagical object with an attack, you can expend an Exploit Die, add it to the damage roll, and cause that attack to deal maximum damage in place of rolling."
};

SpellsList["eloquent speech"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[1st-degree exploits (checks)]",
	prereqeval : function(v) { return What('Int') >= 11},
	addMod : [
		{ type : "skill", field : "Persuasion", mod : "max(Int-Cha|0)", text : "I can replace Charisma (Persuasion) checks with Intelligence (Persuasion)" },
		{ type : "skill", field : "Deception", mod : "max(Int-Cha|0)", text : "I can replace Charisma (Deception) checks with Intelligence (Deception)" }
	],
	// Regular spell attributes
	name : "Eloquent Speech",
	classes : ["fighter(laserllama)"],
	source : ["GMB:LL", 0],
	level : 1,
	school : "Skill",
	time : "Check",
	range : "Self",
	duration : "Instantaneous",
	description : "Add Exploit Die to Pers and Decep checks; Can make Int (Persuasion) & Int (Persuasion) checks (passive)",
	descriptionFull : "Whenever you would normally make a Charisma (Deception) or Charisma (Persuasion) check, you can choose to use your Intelligence in place of Charisma for that ability check.\n\nAlso, whenever you make an Intelligence (Deception) or Intelligence (Persuasion) check you can expend one Exploit Die, roll it, and add the result to your check. You can do so after you roll the d20, but before you know if you succeed."
};

SpellsList["mechanical insight"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[1st-degree exploits (checks)]",
	prereqeval : function(v) { return What('Int') >= 11},
	// Regular spell attributes
	name : "Mechanical Insight",
	classes : ["fighter(laserllama)"],
	source : ["GMB:LL", 0],
	level : 1,
	school : "Skill",
	time : "Check",
	components : "M",
	compMaterial : "Thieves' tools or tinker's tools",
	range : "Self",
	duration : "Instantaneous",
	description : "Add Exploit Die to a thieves' tools or tinker's tools check",
	descriptionFull : "Whenever you make an ability check with a set of thieves' tools or tinker's tools you can expend one Exploit Die, roll it, and add the result to your ability check. You can do so after you roll the d20, but before you know if you succeed or fail."
};

SpellsList["reposition"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[1st-degree exploits (combat)]",
	// Regular spell attributes
	name : "Reposition",
	classes : ["fighter(laserllama)"],
	source : ["GMB:LL", 0],
	level : 1,
	school : "Combat",
	time : "1 bns",
	range : "5 ft",
	duration : "Instantaneous",
	description : "Switch place with a conscious and willing creature, either me or target gains Exploit Die of temp hp",
	descriptionFull : "As a bonus action, you can expend one Exploit Die to switch places with a conscious and willing creature within 5 feet of you. This movement does not provoke opportunity attacks. Either you or the creature you switched places with gains temporary hit points equal to one roll of your Exploit Die."
};

SpellsList["savvy explorer"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[1st-degree exploits (checks)]",
	prereqeval : function(v) { return What('Int') >= 11 || What('Wis') >= 11},
	// Regular spell attributes
	name : "Savvy Explorer",
	classes : ["fighter(laserllama)"],
	source : ["GMB:LL", 0],
	level : 1,
	school : "Skill",
	time : "Check",
	range : "Self",
	components : "M",
	compMaterial : "Land/water vehicle, cartographer's tools, or navigator's tools",
	duration : "Instantaneous",
	description : "Add Exploit Die to a land/water vehicles, cartographer's tools, or navigator's tools check",
	descriptionFull : "When you make an ability check with land or water vehicles, cartographer's tools, or navigator's tools you can expend one Exploit Die, roll it, and add it to your ability check. You can do so after you roll the d20, but before you know if you succeed."
};

SpellsList["streetwise"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[1st-degree exploits (checks)]",
	prereqeval : function(v) { return What('Cha') >= 11},
	addMod : [
		{ type : "skill", field : "History", mod : "max(Cha-Int|0)", text : "I can replace Intelligence (History) checks with Charisma (History)" },
		{ type : "skill", field : "Investigation", mod : "max(Cha-Int|0)", text : "I can replace Intelligence (Investigation) checks with Charisma (Investigation)" }
	],
	// Regular spell attributes
	name : "Streetwise",
	classes : ["fighter(laserllama)"],
	source : ["GMB:LL", 0],
	level : 1,
	school : "Skill",
	time : "Check",
	range : "Self",
	duration : "Instantaneous",
	description : "Add Exploit Die to Hist and Invest checks; Can make Cha (History) & Cha (Investigation) checks (passive)",
	descriptionFull : "If you are in a settlement, you can make Charisma (History) and Charisma (Investigation) checks instead of the normal Intelligence (History) or Intelligence (Investigation) checks.\n\nAlso, when you make a Charisma (History) or a Charisma (Investigation) check you can expend one Exploit Die, roll it, and add the result to your ability check. You can do so after you roll the d20, but before you know if you succeed or fail."
};

SpellsList["take down"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[1st-degree exploits (combat)]",
	prereqeval : function(v) { return What('Str') >= 11},
	// Regular spell attributes
	name : "Take Down",
	classes : ["fighter(laserllama)"],
	source : ["GMB:LL", 0],
	level : 1,
	school : "Combat",
	time : "1 bns",
	range : "Touch",
	duration : "Instantaneous",
	description : "Attempt to shove or grapple a creature and add Exploit Die to the Strength (Athletics) check",
	descriptionFull : "As a bonus action, you can expend one Exploit Die to touch a creature and attempt to Shove or Grapple it, and add one roll of your Exploit Die to your Strength (Athletics) check."
};

// 2nd-Degree Martial Exploits
SpellsList["aggressive sprint"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[2nd-degree exploits]",
	// Regular spell attributes
	name : "Aggressive sprint",
	classes : ["fighter(laserllama)"],
	source : ["GMB:LL", 0],
	level : 2,
	school : "Combat",
	time : "1 bns",
	range : "Self",
	duration : "Instantaneous",
	description : "Move up to my walk speed toward a hostile creature; Single melee weapon attack against it",
	descriptionFull : "As a bonus action, you can expend one Exploit Die to move up to your walking speed toward a hostile creature that you can see and make a single melee weapon attack against it."
};

SpellsList["blinding debris"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[2nd-degree exploits]",
	prereqeval : function(v) { return What('Dex') >= 11},
	// Regular spell attributes
	name : "Blinding Debris",
	classes : ["fighter(laserllama)"],
	source : ["GMB:LL", 0],
	level : 2,
	school : "Combat",
	time : "1 bns",
	range : "10 ft",
	save : "Con",
	duration : "1 rnd",
	description : "One crea Con saving throw or blinded until beginning of my next turn",
	descriptionFull : "As a bonus action, you can expend an Exploit Die to attempt to blind a creature with debris. A creature you can see within 10 feet must succeed on a Constitution saving throw or take piercing damage equal to one roll of your Exploit Die and become blinded until the beginning of your next turn."
};

SpellsList["concussive blow"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[2nd-degree exploits]",
	prereqeval : function(v) { return What('Str') >= 13},
	// Regular spell attributes
	name : "Concussive Blow",
	classes : ["fighter(laserllama)"],
	source : ["GMB:LL", 0],
	level : 2,
	school : "Combat",
	time : "Hit",
	timeFull : "No action required, on hit with a melee weapon attack",
	range : "Melee",
	components : "W", // W = weapon
	compMaterial : "Melee weapon attack",
	save : "Con",
	duration : "1 rnd",
	description : "On fail, 0 speed, can't speak, disadv. on attacks, skills and dex saving throws and attacks have adv.",
	descriptionFull : "When you hit a creature with a melee weapon attack, you can expend an Exploit Die to empower your attack and force it to make a Constitution saving throw. On a failed save, the target suffers the effects below until the beginning of your next turn:\nIts speed becomes 0, and it can speak only falteringly.\nIt has disadvantage on attack rolls and ability checks.\nIt has disadvantage on Dexterity saving throws.\nAttack rolls against it have advantage."
};

SpellsList["crippling strike"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[2nd-degree exploits]",
	// Regular spell attributes
	name : "Crippling Strike",
	source : ["GMB:LL", 0],
	classes : ["fighter(laserllama)"],
	level : 2,
	school : "Combat",
	time : "Hit",
	timeFull : "No action required, on hit with a weapon attack",
	range : "Attack",
	components : "W", // W = weapon
	compMaterial : "Weapon attack",
	duration : "1 rnd",
	save : "Con",
	description : "On hit, one crea save or Exploit Die of bonus dmg and blinded or deafened or can't speak (my choice)",
	descriptionFull : "When you hit a target with a weapon attack, you can expend an Exploit Die to cripple one of its senses. It must succeed on a Constitution saving throw or it takes additional damage equal to one roll of your Exploit Die and is blinded, deafened, or cannot speak (your choice) until the start of your next turn."
};

SpellsList["defensive stance"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[2nd-degree exploits]",
	// Regular spell attributes
	name : "Defensive Stance",
	source : ["GMB:LL", 0],
	classes : ["fighter(laserllama)"],
	level : 2,
	school : "Combat",
	time : "1 bns",
	range : "Self",
	duration : "1 rnd",
	description : "Add Exploit Die to my AC to every attack from a creature I can see that targets me",
	descriptionFull : "As a bonus action, you can expend an Exploit Die to enter a defensive stance that lasts until the start of your next turn. Each time a creature you can see targets you with an attack while you are in this stance, you gain a bonus to your Armor Class against that attack equal to a roll of your Exploit Die."
};

SpellsList["dirty hit"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[2nd-degree exploits]",
	prereqeval : function(v) { return What('Dex') >= 13},
	// Regular spell attributes
	name : "Dirty Hit",
	source : ["GMB:LL", 0],
	classes : ["fighter(laserllama)"],
	level : 2,
	school : "Combat",
	time : "Hit",
	timeFull : "No action required, on hit with a melee weapon attack",
	range : "Melee",
	components : "W", // W = weapon
	compMaterial : "Weapon attack",
	duration : "1 rnd",
	save : "Con",
	description : "On hit, one crea save or Exploit Die of bonus dmg and prone and can't take reactions",
	descriptionFull : "When you hit a creature with a melee weapon attack, you can expend an Exploit Die to strike at a vulnerable area. It must succeed on a Constitution saving throw or it takes additional damage equal to a roll of your Exploit Die, falls prone, and it cannot take reactions until the start of your next turn."
};

SpellsList["heroic will"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[2nd-degree exploits]",
	// Regular spell attributes
	name : "Heroic Will",
	source : ["GMB:LL", 0],
	classes : ["fighter(laserllama)"],
	level : 2,
	school : "Skill",
	time : "Save",
	range : "Self",
	duration : "Instantaneous",
	description : "Add Exploit Die to an Int, Wis or Cha saving throw",
	descriptionFull : "Whenever you are forced to make an Intelligence, Wisdom, or Charisma saving throw you can expend an Exploit Die, roll it, and add the result to your saving throw. You can do so after you roll the d20, but before you know if you succeed or fail."
};

SpellsList["honor duel"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[2nd-degree exploits]",
	// Regular spell attributes
	name : "Honor Duel",
	classes : ["fighter(laserllama)"],
	source : ["GMB:LL", 0],
	level : 2,
	school : "Combat",
	time : "1 bns",
	range : "30 ft",
	components : "V",
	duration : "1 min",
	save : "Wis",
	description : "One crea save or dis. on attacks vs. not-me; Extra save each turn; Ends if I attack someone else",
	descriptionFull : "As a bonus action, you can expend an Exploit Die and shout a challenge at a foe. One creature of your choice within 30 feet that can see or hear you must make a Wisdom saving throw. On a failed save, the creature has disadvantage on all attack rolls it makes against targets other than you for 1 minute. The creature can repeat this saving throw at the end of each of its turns, ending the effect on a success. This effect ends early if you attack a creature other than the target."
};

SpellsList["martial focus"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[2nd-degree exploits]",
	// Regular spell attributes
	name : "Martial Focus",
	source : ["GMB:LL", 0],
	classes : ["fighter(laserllama)"],
	level : 2,
	school : "Combat",
	time : "Attack",
	timeFull : "No action required, as part of a weapon attack",
	range : "Attack",
	components : "W", // W = weapon
	compMaterial : "Weapon attack",
	duration : "Instantaneous",
	description : "As part of the attack, grant myself advantage",
	descriptionFull : "As part of a weapon attack you can expend an Exploit Die to grant yourself advantage on your attack roll. You can use this Exploit after you roll, but before you know if you hit or miss."
};

SpellsList["menacing shout"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[2nd-degree exploits]",
	prereqeval : function(v) { return What('Con') >= 13 || What('Cha') >= 13},
	// Regular spell attributes
	name : "Menacing Shout",
	classes : ["fighter(laserllama)"],
	source : ["GMB:LL", 0],
	level : 2,
	school : "Combat",
	time : "1 bns",
	range : "30 ft",
	components : "V",
	duration : "1 rnd",
	save : "Wis",
	description : "One crea save or frightened of me and must use their action to move away (without harming itself)",
	descriptionFull : "As a bonus action, you can expend one Exploit Die and force one creature within 30 feet that can see or hear you to make a Wisdom saving throw. On a failed save, it is frightened of you until the end of your next turn and must use its action to move as far away from you as possible without harming itself."
};

SpellsList["redirect"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[2nd-degree exploits]",
	// Regular spell attributes
	name : "Redirect",
	source : ["GMB:LL", 0],
	classes : ["fighter(laserllama)"],
	level : 2,
	school : "Combat",
	time : "1 rea",
	timeFull : "1 reaction, which you take when a creature you can see misses you with a melee attack",
	range : "Melee",
	components : "W", // W = weapon
	compMaterial : "Weapon attack",
	duration : "Instantaneous",
	description : "Redirect melee attack to another target of my choice within range, adding Exploit Die to attack roll",
	descriptionFull : "When a creature you can see misses you with a melee attack, you can use your reaction to expend an Exploit Die and force it to attack another creature of your choice within range of its attack, adding one roll of your Exploit Die to its attack roll."
};

SpellsList["rending strike"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[2nd-degree exploits]",
	prereqeval : function(v) { return What('Str') >= 13},
	// Regular spell attributes
	name : "Rending Strike",
	source : ["GMB:LL", 0],
	classes : ["fighter(laserllama)"],
	level : 2,
	school : "Combat",
	time : "Hit",
	timeFull : "No action required, on hit with a melee weapon attack",
	range : "Melee",
	components : "W", // W = weapon
	compMaterial : "Weapon attack",
	duration : "Until long rest",
	description : "On hit, Dex saving throw or -1 to AC and Exploit Die of bonus dmg",
	descriptionFull : "When you hit a creature with a melee weapon attack, you can expend an Exploit Die to rend its armor. It must succeed on a Dexterity saving throw or it takes additional damage equal to one roll of your Exploit Die and its Armor Class is reduced by 1 until the damage is repaired, or it finishes a long rest."
};

SpellsList["volley"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[2nd-degree exploits]",
	prereqeval : function(v) { return What('Dex') >= 13},
	// Regular spell attributes
	name : "Volley",
	source : ["GMB:LL", 0],
	classes : ["fighter(laserllama)"],
	level : 2,
	school : "Combat",
	time : "1 a",
	range : "Attack",
	components : "W", // W = weapon
	compMaterial : "Ranged weapon",
	duration : "Instantaneous",
	description : "All crea of my choice within 5 ft of chosen point save or take Exploit Die + Dex dmg (half on success)",
	descriptionFull : "As an action, you can expend one Exploit Die to fire a volley of ammunition at a point you can see within normal range of your weapon. Creatures of your choice within 5 feet of that point must make a Dexterity Saving throw. On a failure, they take piercing damage equal to one roll of your Exploit Die + your Dexterity modifier, and half as much on a success."
};

SpellsList["whirlwind strike"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[2nd-degree exploits]",
	prereqeval : function(v) { return What('Str') >= 13 || What('Dex') >= 13},
	// Regular spell attributes
	name : "Whirlwind Strike",
	source : ["GMB:LL", 0],
	classes : ["fighter(laserllama)"],
	level : 2,
	school : "Combat",
	time : "Attack",
	range : "Melee",
	components : "W", // W = weapon
	compMaterial : "Melee weapon",
	duration : "Instantaneous",
	description : "All crea within reach of a melee weapon save or take Exploit Die + Str/Dex dmg (half on success)",
	descriptionFull : "In place of an attack, you can expend an Exploit Die to force each target within reach of a melee weapon you are wielding to make a Dexterity saving throw. Targets take damage equal to a roll of your Exploit Die + your Strength or Dexterity modifier on a failed save, and half as much on a success."
};

// From the expanded fighter
SpellsList["exposing strike"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[2nd-degree exploits]",
	// Regular spell attributes
	name : "Exposing Strike",
	source : ["GMB:LL", 0],
	classes : ["fighter(laserllama)"],
	level : 2,
	school : "Combat",
	time : "Hit",
	timeFull : "No action required, on hit with a weapon attack",
	range : "Attack",
	components : "W", // W = weapon
	compMaterial : "Weapon attack",
	duration : "1 rnd",
	description : "On hit, the next attack against that crea before my turn has adv and adds Exploit Die to dmg",
	descriptionFull : "When you hit a creature with a weapon attack, you can expend an Exploit Die to temporarily weaken it. The first attack made against that creature before the beginning of your next turn has advantage, and on hit, that attack deals additional damage equal to one roll of your Exploit Die."
};

SpellsList["exposing strike"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[2nd-degree exploits]",
	// Regular spell attributes
	name : "Exposing Strike",
	source : ["GMB:LL", 0],
	classes : ["fighter(laserllama)"],
	level : 2,
	school : "Combat",
	time : "Miss",
	timeFull : "No action required, on miss with a melee weapon attack",
	range : "Melee",
	components : "W", // W = weapon
	compMaterial : "Melee weapon attack",
	duration : "Instantaneous",
	description : "On miss, repeat my attack against another target within reach of my weapon",
	descriptionFull : "When you make a melee weapon attack and miss, you can expend an Exploit Die to immediately repeat your attack against another target within the reach of your weapon."
};

SpellsList["hold the line"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[2nd-degree exploits]",
	prereqeval : function(v) { return What('Str') >= 13 || What('Con') >= 13 },
	// Regular spell attributes
	name : "Hold the Line",
	source : ["GMB:LL", 0],
	classes : ["fighter(laserllama)"],
	level : 2,
	school : "Combat",
	time : "1 bns",
	range : "S:10-ft rad",
	duration : "Until move",
	description : "All allied crea with a weapon/shield within range gain half cover (see book)",
	descriptionFull : "As a bonus action, you can expend an Exploit Die to form your allies into a defensive position. You and allied creatures within 10 feet that are wielding a weapon or shield gain the benefits of half cover, which also apply to ability checks and saving throws made to avoid being moved against your will.\n\nThe benefits of this Exploit instantly end if you leave your space, and they have no effect on incapacitated creatures."
};

SpellsList["immovable stance"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[2nd-degree exploits]",
	prereqeval : function(v) { return What('Str') >= 13 || What('Con') >= 13 },
	// Regular spell attributes
	name : "Immovable Stance",
	source : ["GMB:LL", 0],
	classes : ["fighter(laserllama)"],
	level : 2,
	school : "Combat",
	time : "1 bns",
	range : "Self",
	duration : "Until move",
	save : "Str",
	description : "Each time a crea tries to grapple, move me or move in my space, Str saving throw or is grappled/prone",
	descriptionFull : "As a bonus action, you can expend an Exploit Die to enter an immovable stance that lasts until you move from the space. Each time a creature attempts to grapple, move you against your will, or move through your space while you are in this stance it must first succeed on a Strength saving throw. On a failed save, you can instantly grapple it or knock it prone."
};

SpellsList["improvised skill"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[2nd-degree exploits]",
	// Regular spell attributes
	name : "Improvised Skill",
	classes : ["fighter(laserllama)"],
	source : ["GMB:LL", 0],
	level : 2,
	school : "Skill",
	time : "Check",
	range : "Self",
	duration : "Instantaneous",
	description : "Add Exploit Die to a non proficient check",
	descriptionFull : "When you make an ability check that doesn't include your proficiency bonus, you can expend an Exploit Die and add it to your roll. You can use this Exploit after you roll, but before you know if you succeed or fail."
};

SpellsList["intimidating command"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[2nd-degree exploits]",
	prereqeval : function(v) { return What('Cha') >= 13 },
	// Regular spell attributes
	name : "Intimidating Command",
	classes : ["fighter(laserllama)"],
	source : ["GMB:LL", 0],
	level : 2,
	school : "Combat",
	time : "1 bns",
	range : "30 ft",
	components : "V",
	duration : "1 rnd",
	save : "Wis",
	description : "1 crea save or follow one word command (cannot be directly harmful), e.g. approach, drop, flee, halt",
	descriptionFull : "As a bonus action, you can expend an Exploit Die to shout a one-word command at one creature that can hear you within 30 feet. It must succeed on a Wisdom saving throw, or it is compelled to obey your command to the best of its ability on its next turn unless its actions would be directly harmful to it"
};

SpellsList["ringing strike"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[2nd-degree exploits]",
	prereqeval : function(v) { return What('Str') >= 13 },
	// Regular spell attributes
	name : "Ringing Strike",
	source : ["GMB:LL", 0],
	classes : ["fighter(laserllama)"],
	level : 2,
	school : "Combat",
	time : "Hit",
	range : "Attack",
	duration : "1 min",
	save : "Wis",
	description : "On hit, one crea save or -1d4 penalty to all d20 it makes; extra save end of each turn",
	descriptionFull : "When you hit a creature with a melee weapon attack, you can expend an Exploit Die to send it reeling. It must succeed on a Wisdom saving throw or it must subtract 1d4 from all ability checks, attack rolls, and saving throws it makes for 1 minute.\n\nA creature can repeat this saving throw at the end of each of its turns, ending the effect on a success."
};

SpellsList["shattering slam"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[2nd-degree exploits]",
	prereqeval : function(v) { return What('Str') >= 13 },
	// Regular spell attributes
	name : "Shattering Slam",
	source : ["GMB:LL", 0],
	classes : ["fighter(laserllama)"],
	level : 2,
	school : "Combat",
	time : "Attack",
	range : "S:5-ft rad",
	components : "W", // W = weapon
	compMaterial : "Melee weapon attack",
	duration : "Instantaneous",
	save : "Dex",
	description : "All crea within range Dex save or fall prone and take Exploit Die + Str dmg (half on save); diff. terrain",
	descriptionFull : "In place of an attack, you can expend an Exploit Die to strike the ground at your feet with a melee weapon. All creatures within 5 feet of you must succeed on a Dexterity saving throw or take bludgeoning damage equal to one roll of your Exploit Die + your Strength modifier and fall prone. On a successful save, they take half as much damage and don't fall prone.\n\nTerrain in this area that is loose earth or stone becomes difficult terrain until a creature uses its action to clear it."
};

SpellsList["thunderous blow"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[2nd-degree exploits]",
	prereqeval : function(v) { return What('Str') >= 13 },
	// Regular spell attributes
	name : "Thunderous Blow",
	source : ["GMB:LL", 0],
	classes : ["fighter(laserllama)"],
	level : 2,
	school : "Combat",
	time : "Attack",
	range : "Melee",
	time : "Hit",
	timeFull : "No action required, on hit with a melee weapon attack",
	components : "W", // W = weapon
	compMaterial : "Melee weapon attack",
	duration : "Instantaneous",
	save : "Dex",
	description : "On hit, one crea save (larger crea have adv.) or Expl Die of bonus dmg and pushed 5 ft times my Str mod",
	descriptionFull : "When you hit a creature with a melee weapon attack, you can expend an Exploit Die to empower your attack with immense force. The creature must succeed on a Strength saving throw or take additional damage equal to a roll of your Exploit Die and be knocked back in a straight line number of feet equal to 5 times your Strength modifier. Creatures more than one size larger than you have advantage on their saving throw."
};

SpellsList["trick shot"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[2nd-degree exploits]",
	prereqeval : function(v) { return What('Dex') >= 13 || What('Int') >= 13 },
	// Regular spell attributes
	name : "Trick Shot",
	source : ["GMB:LL", 0],
	classes : ["fighter(laserllama)"],
	level : 2,
	school : "Combat",
	time : "Attack",
	range : "Melee",
	time : "1 bns",
	components : "W*", // W = weapon
	compMaterial : "Ranged weapon that has both the finesse and thrown properties",
	duration : "Instantaneous",
	description : "Attack that ignores cover if it can ricochet; Ignore disadv; Add Exploit Die to dmg",
	descriptionFull : "As a bonus action, you can expend an Exploit Die to make a special ranged weapon attack with a weapon that has both the finesse and thrown properties.\n\nThis attack ignores the benefits of cover, so long as it can ricochet off one surface and hit a target in range. If this attack would normally have disadvantage, it does not, and on hit, it deals additional damage equal to one roll of your Exploit Die."
};

SpellsList["zephyr slash"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[2nd-degree exploits]",
	prereqeval : function(v) { return What('Str') >= 13 || What('Dex') >= 13},
	// Regular spell attributes
	name : "Zephyr Slash",
	source : ["GMB:LL", 0],
	classes : ["fighter(laserllama)"],
	level : 2,
	school : "Combat",
	time : "1 a",
	range : "S:30-ft line",
	components : "W", // W = weapon
	compMaterial : "Melee weapon",
	duration : "Instantaneous",
	description : "Move up to 30 ft, all crea I go through Dex save or take 2 Exploit Die + Str/Dex dmg",
	descriptionFull : "As an action, you can expend an Exploit Die and flourish your melee weapon instantly move up to 30 feet in a straight line, without provoking attacks of opportunity. Any creatures that you pass through must succeed on a Dexterity saving throw or take damage equal to two rolls of your Exploit Die + either your Strength or Dexterity modifier."
};

// 3rd degree exploits
SpellsList["disorienting blow"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[3rd-degree exploits]",
	prereqeval : function(v) { return What('Str') >= 15},
	// Regular spell attributes
	name : "Disorienting Blow",
	classes : ["fighter(laserllama)"],
	source : ["GMB:LL", 0],
	level : 3,
	school : "Combat",
	time : "Hit",
	timeFull : "No action required, on hit with a melee weapon attack",
	components : "W", // W = weapon
	compMaterial : "Melee weapon attack",
	range : "Melee",
	duration : "1 min",
	save : "Wis",
	description : "Add 2 ED to dmg; save or -2 AC, speed halved, disadv. on Dex saves, no rea, only 1 a (1 atk) or 1 bns",
	descriptionFull : "When you hit with a creature with a melee weapon attack, you can expend an Exploit Die to strike with great force, dealing additional damage equal to two rolls of your Exploit Die and it must succeed on a Wisdom saving throw or suffer the effects below for 1 minute: \nIts speed is halved and it cannot take reactions.\nIts Armor Class is reduced by 2.\nIt has disadvantage on Dexterity saving throws.\nOn its turn it can only take an action or a bonus action.\nIt cannot make more than one attack during its turn, even if a feature would allow it to make multiple.\n\nIt can make a Wisdom saving throw at the end of each of its turns, ending these effects on a success.\nThis Exploit's effects do not stack with the slow spell."
};

SpellsList["heroic focus"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[3rd-degree exploits]",
	// Regular spell attributes
	name : "Heroic Focus",
	classes : ["fighter(laserllama)"],
	source : ["GMB:LL", 0],
	level : 3,
	school : "Combat",
	time : "1 bns",
	range : "Self",
	duration : "Conc, 1 min",
	description : "+2 AC, speed doubled, adv. on Dex saves, extra action (1 attack, dash, disengage, hide, search, object)",
	descriptionFull : "As a bonus action, you can expend one Exploit Die to enter a heightened state of focus which you must concentrate on as if you were concentrating on a spell. For 1 minute, or until you lose concentration, you gain the following benefits:\nMy speed is doubled, I gain a +2 bonus to AC, I have advantage on Dexterity saving throws, and I gain an additional action on each of my turns. That action can be used only to take the Attack (one weapon attack only), Dash, Disengage, Hide, or Use an Object action.\nWhen the effect ends, you must succeed on a Constitution saving throw against your Exploit save DC, or you can't move or take actions until after the end of your next turn.\nThis Exploit's effects do not stack with the haste spell."
};

SpellsList["mythic athleticism"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[3rd-degree exploits]",
	prereqeval : function(v) { return What('Str') >= 15 || What('Con') >= 15 },
	// Regular spell attributes
	name : "Mythic Athleticism",
	classes : ["fighter(laserllama)"],
	source : ["GMB:LL", 0],
	level : 3,
	school : "Combat",
	time : "1 bns",
	range : "Self",
	duration : "Conc, ED*10m",
	description : "Str & Con check cannot be <10, walk speed increases by 5*Str, one size larger carry/grap, double jump",
	descriptionFull : "As a bonus action, you can expend Exploit Dice (up to your proficiency bonus) to enter a heightened state of physical performance which you must concentrate on as if you were concentrating on a spell. You gain the benefits listed below:\nWhenever you make a Strength or Constitution check, you can treat a roll of 9 or lower on the d20 as a 10.\nYour walking speed increases by a number of feet equal to 5 times your Strength modifier (minimum of 5 feet).\nYou count as one size larger for the purposes of carrying capacity and the size of creatures that you can grapple.\nBoth your long and high jump distances double, even if that distance would exceed your remaining movement.\nThe effects last for 10 minutes for each Exploit Die spent."
};

SpellsList["mythic resilience"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[3rd-degree exploits]",
	// Regular spell attributes
	name : "Mythic Resilience",
	classes : ["fighter(laserllama)"],
	source : ["GMB:LL", 0],
	level : 3,
	school : "Combat",
	time : "Special",
	timeFull : "No action required, when you take damage from a source you can see", // NOTE: RAW it doesn't consume the reaction, though I'm not sure if it's intended
	range : "Self",
	duration : "Instantaneous",
	description : "Reduce dmg by (3*ED+Con) * ED spent (up to my prof bns); Excess dmg reduction becomes temp HP",
	descriptionFull : "When you take damage from a source you can see, you can expend Exploit Dice (up to your proficiency bonus) to reduce the incoming damage.\nFor each Exploit Die you expend you roll three Exploit Dice, adding your Constitution modifier to the total of all the dice. You reduce the damage by the total.\nIf the total rolled exceeds the amount of damage, you gain temporary hit points equal to the remaining amount."
};

SpellsList["thunderous shot"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[3rd-degree exploits]",
	prereqeval : function(v) { return What('Str') >= 15 || What('Dex') >= 15 },
	// Regular spell attributes
	name : "Thunderous Shot",
	source : ["GMB:LL", 0],
	classes : ["fighter(laserllama)"],
	level : 3,
	school : "Combat",
	time : "Attack",
	range : "Line (W)",
	components : "W", // W = weapon
	compMaterial : "Ranged weapon",
	duration : "Instantaneous",
	description : "All crea in line save or take (2 ED) * ED spent (up to my PB) + Str/Dex dmg and prone (half on success)",
	descriptionFull : "In place of an attack, you can expend Exploit Dice (up to your proficiency bonus) and fire one piece of ammunition in a line, out to the weapon's normal range. Creatures in the line must succeed on a Dexterity saving throw or take piercing damage equal to two rolls of your Exploit Die for each Die you spent + either your Strength or Dexterity modifier and fall prone. On a success, they take half that damage and don't fall prone."
};

SpellsList["war cry"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[3rd-degree exploits]",
	// Regular spell attributes
	name : "War Cry",
	source : ["GMB:LL", 0],
	classes : ["fighter(laserllama)"],
	level : 3,
	school : "Combat",
	time : "1 a",
	range : "S:30" + (typePF ? "-" : "") + "ft cone",
	components : "V",
	duration : "1 min",
	save : "Wis",
	description : "All crea save or drop what it is holding and frightened; extra save at end of turn if not in line of sight",
	descriptionFull : "As an action, you can expend one Exploit Die and issue a mighty cry, forcing creatures of your choice that can hear you in an adjacent 30-foot cone to make a Wisdom saving throw. On a failed save, they drop whatever they are holding and are frightened of you for 1 minute. If a frightened creature ends its turn and does not have line of sight to you, it can repeat the saving throw, ending the effect on a success."
};

// 4th degree exploits
SpellsList["expert determination"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[4th-degree exploits]",
	// Regular spell attributes
	name : "Expert Determination",
	source : ["GMB:LL", 0],
	classes : ["fighter(laserllama)"],
	level : 4,
	school : "Skill",
	time : "1 a",
	range : "Self",
	duration : "1 h",
	description : "Choose one skill/tool I'm proficient in; Add Exploit die to all checks for this skill/tool",
	descriptionFull : "As an action, you can expend one Exploit Die to focus your mind and temporarily sharpen one of your skills. Choose a skill or tool that you are proficient in. For the next hour, you can add one roll of your Exploit Die to any check you make that uses that skill, without expending an Exploit Die."
};

SpellsList["fluid movements"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[4th-degree exploits]",
	prereqeval : function(v) { return What('Dex') >= 17 },
	// Regular spell attributes
	name : "Fluid Movements",
	source : ["GMB:LL", 0],
	classes : ["fighter(laserllama)"],
	level : 4,
	school : "Combat",
	time : "1 bns",
	range : "Self",
	duration : "Conc, 1 min",
	description : "Dash & diseng as 1 bns; magic/terrain cannot reduce speed, paralyze, restrain; 5 ft to escape (see book)",
	descriptionFull : "As a bonus action, you can expend one Exploit Die to enter a heightened state of movement which you must concentrate on as if you were concentrating on a spell. For 1 minute, or until you lose concentration, you gain the following benefits:\n\u2022 Your movement is unaffected by difficult terrain.\n\u2022 You can use a bonus action on your turn to gain the benefits of both the Dash and Disengage action.\n\u2022 Spells and other magical effects can neither reduce your speed nor cause you to be paralyzed or restrained.\n\u2022 You can spend 5 feet of movement to instantly escape from nonmagical restraints like manacles or a grapple.\n\u2022 Swimming or being underwater imposes no penalties on your movements or your attack rolls."
};

SpellsList["quick draw"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[4th-degree exploits]",
	prereqeval : function(v) { return What('Dex') >= 17 },
	// Regular spell attributes
	name : "Quick Draw",
	source : ["GMB:LL", 0],
	classes : ["fighter(laserllama)"],
	level : 4,
	school : "Combat",
	time : "1 bns",
	range : "Self",
	components : "W", // W = weapon
	compMaterial : "Ranged weapon",
	duration : "Conc, 1 min",
	description : "Use bns (including when activating this expl) to make 2 ranged weapon atks as long as I have ammo",
	descriptionFull : "As a bonus action, you can expend one Exploit Die and enter into a heightened state of focus which you must concentrate on as if concentrating on a spell. For the next minute, or until you lose concentration, you can use a bonus action, including the bonus action you used to use this Exploit to make two ranged weapon attacks so long as you have ammunition.\nThis Exploit's effects don't stack with the swift quiver spell."
};

SpellsList["staggering blow"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[4th-degree exploits]",
	prereqeval : function(v) { return What('Str') >= 17 },
	// Regular spell attributes
	name : "Staggering Blow",
	source : ["GMB:LL", 0],
	classes : ["fighter(laserllama)"],
	level : 4,
	school : "Combat",
	time : "Hit",
	timeFull : "No action required, on hit with a melee weapon attack",
	range : "Melee",
	components : "W", // W = weapon
	compMaterial : "Melee weapon",
	duration : "1 min",
	description : "Add 3 expl die to dmg; Wis saving throw or disadv. on checks & attack rolls and can't take reactions",
	descriptionFull : "When you hit a creature with a melee weapon attack, you can expend one Exploit Die to strike with near-supernatural power, dealing additional damage equal to three rolls of your Exploit Die. It must succeed on a Wisdom saving throw, or for the next minute it has disadvantage on ability checks and attack rolls and can't take reactions. The creature can make a Wisdom saving throw at the start of each of its turns, ending these effects on a success."
};

SpellsList["unbreakable"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[4th-degree exploits]",
	prereqeval : function(v) { return What('Con') >= 17 },
	// Regular spell attributes
	name : "Unbreakable",
	source : ["GMB:LL", 0],
	classes : ["fighter(laserllama)"],
	level : 4,
	school : "Combat",
	time : "Special",
	timeFull : "No action required, when you take damage that would reduce you to 0 hit points, even if that damage would kill you outright",
	range : "Self",
	duration : "1 min",
	description : "Fall to 1 HP and gain temp HP equal to (3 expl die) * Expl die spent (up to prof bonus)",
	descriptionFull : "When you take damage that would reduce you to 0 hit points, even if that damage would kill you outright, you can expend Exploit Dice (up to your proficiency bonus) and fall to 1 hit point. For each Exploit Die you spent, you roll three Exploit Dice, and you gain temporary hit points equal to the total roll."
};

// 5th degree exploits
SpellsList["storm of arrows"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[5th-degree exploits]",
	prereqeval : function(v) { return What('Dex') >= 19 },
	// Regular spell attributes
	name : "Storm of Arrows",
	source : ["GMB:LL", 0],
	classes : ["fighter(laserllama)"],
	level : 5,
	school : "Combat",
	time : "1 a",
	range : "Attack",
	components : "W", // W = weapon
	compMaterial : "Ranged weapon",
	duration : "Instantaneous",
	description : "All crea I choose within 30 ft; Dex saving throw or (2 ED) * ED spent (up to PB) + Dex dmg (half on save)",
	descriptionFull : "As an action on your turn, you can expend Exploit Dice (up to your proficiency bonus) to fire a volley of ammunition at a point you can see within the range of your weapon. Creatures of your choice within 30 feet of that point must succeed on a Dexterity saving throw or they take piercing damage equal to two rolls of your Exploit Die for each Exploit Die you spent + your Dexterity modifier. Any creature that succeeds on its saving throw takes half as much piercing damage. You must have enough ammunition to hit each target."
};

SpellsList["steel wind slash"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[5th-degree exploits]",
	prereqeval : function(v) { return What('Str') >= 19 || What('Dex') >= 19},
	// Regular spell attributes
	name : "Steel Wind Slash",
	source : ["GMB:LL", 0],
	classes : ["fighter(laserllama)"],
	level : 5,
	school : "Combat",
	time : "1 a",
	range : "30 ft",
	components : "W", // W = weapon
	compMaterial : "Melee weapon",
	duration : "Instantaneous",
	description : "Melee attack vs 5 crea in range; (2 ED) * ED spent (up to PB) + Dex/Str dmg; Teleport next to one target",
	descriptionFull : "As an action on your turn, you can expend Exploit Dice (up to your proficiency bonus) and flourish a melee weapon then vanish. Choose up to five targets that you can see within 30 feet and make one melee weapon attack against each one.\nOn a hit, each target takes damage of your weapon's type equal to two rolls of your Exploit Die for each Exploit Die you spent + either your Strength or Dexterity modifier.\nYou then appear in an unoccupied space of your choice you can see within 5 feet of one of the targets of this Exploit."
};

// Main class
ClassList["fighter(laserllama)"] = {

	name : "Fighter(LaserLlama)",
	regExpSearch : /^(?=.*fighter)(?=.*laserllama).*$/i,
	source : ["GMB:LL", 0],
	primaryAbility : "Strength or Dexterity",
	prereqs : "Strength 13 or Dexterity 13",
	die : 10,
	improvements : [0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 5, 5],
	saves : ["Str", "Con"],
	skillstxt : {
		primary : "Choose two from Acrobatics, Athletics, History, Intimidation, Perception, Stealth and Survival."
	},
	toolProfs : {
		primary : [["Artisan's tool", 1]]
	},
	armorProfs : { // the 4 entries are for: ["light", "medium", "heavy", "shields"]
		primary : [true, true, true, true], // the armor proficiencies if this is the first or only class
		secondary : [true, true, false, true] // the armor proficiencies if this class is multiclassed with (so not taken at level 1, but later)
	},
	weaponProfs : {
		primary : [true, true],
		secondary : [true, true]
	},
	equipment : "Fighter starting equipment:" + 
				"\n \u2022 chain mail -or- leather armor, a longbow, 20 arrows;" +
				"\n \u2022 martial weapon and shield -or- two martial weapons;" +
				"\n \u2022 light crossbow and 20 bolts -or- two handaxes;" +
				"\n \u2022 a dungeoneer’s pack -or- an explorer’s pack;" + 
				"\n\nAlternatively, choose 5d4 x 10 gp worth of starting equipment instead of both the class' and the background's starting equipment.", 
	subclasses : ["Warrior Archetype", ["fighter(laserllama)-arcane knight"]],
	attacks : [1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4],
	abilitySave : 1, // Alt Fighter uses Strength or Dex for foes' saving throws
	abilitySaveAlt : 2,
	spellcastingFactor : "warlock99", // Required for the "create a complete spell sheet" option; using the warlock option ensures it doesn't clash with multiclassing
	features: {

		"fighting style" : {
			name : "Fighting Style",
			source : [["GMB:LL", 0]],
			minlevel : 1,
			description : desc('Choose a Fighting Style for the fighter using the "Choose Feature" button above'),
			choices : ["Archery", "Brawler", "Classical Swordplay", "Defense", "Dueling", "Dual Wielding", "Featherweight Fighting","Great Weapon Fighting", 
						"Improvised Fighting", "Melee Marksman", "Protector", "Strongbow", "Thrown Weapon Fighting", "Versatile Fighting", "Blind Warrior",
						"Heavyweight Fighting", "Mariner", "Mountaineer", "Pit Fighting", "Shield Warrior", "Standard Bearer", "Wrestler"],
			"archery" : FightingStylesLL.archery,
			"classical swordplay" : FightingStylesLL.classical,
			"brawler": FightingStylesLL.brawler,
			"defense" : FightingStylesLL.defense,
			"dueling" : FightingStylesLL.dueling,
			"dual wielding" : FightingStylesLL.dual_wielding,
			"featherweight fighting" : FightingStylesLL.featherweight,
			"great weapon fighting" : FightingStylesLL.great_weapon,
			"improvised fighting" : FightingStylesLL.improvised,
			"melee marksman" : FightingStylesLL.marksman,
			"protector" : FightingStylesLL.protector,
			"strongbow" : FightingStylesLL.strongbow,
			"thrown weapon fighting" : FightingStylesLL.thrown,
			"versatile fighting" : FightingStylesLL.versatile,
			"blind warrior" : FightingStylesLL.blind,
			"heavyweight fighting" : FightingStylesLL.heavyweight,
			"mariner" : FightingStylesLL.mariner,
			"mountaineer" : FightingStylesLL.mountaineer,
			"pit fighting" : FightingStylesLL.pit,
			"shield warrior" : FightingStylesLL.shieldwarrior,
			"standard bearer" : FightingStylesLL.standardbearer,
			"wrestler" : FightingStylesLL.wrestler
		},

		"second wind" : {
			name : "Second Wind",
			source : [["GMB:LL", 0]],
			minlevel : 1,
			description : desc([
				"As a bonus action, I can regain hit points equal to 1d10 + fighter level"
			]),
			additional : levels.map(function (n) {
				if (n < 11) {
					return "1d10+" + n;
				} else {
					return "1d10+" + n + ", exploit die";
				}
			}),
			usages : levels.map(function (n) { return n < 1 ? "" : n < 20 ? 1 : 2 }),
			recovery : "short rest",
			action : [["bonus action", ""]]
		},

		"martial exploits": function(){

			// Fixed attributes
			MartialExploits = {
				name : "Martial Exploits",
				minlevel : 2,
				source : [["GMB:LL", 0]],
				description : desc(["I gain Exploit Dice, which are used to fuel my Martial Exploits", "Use the \"Choose Feature\" button above to choose Martial Exploits"]),
				toNotesPage : [{
					name : "Martial Exploits",
					note : desc(["Below are all Martial Exploits I know. Each 3rd and 4th degree exploits can only be used once per short rest. Each 5th degree exploit can only be used once per long rest."])
				}],

				// Martial Exploits
				extraname : "Martial Exploits",
				extraTimes : ['', 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 10, 10],
				extrachoices : [],

				// Exploit dice
				usages : ['', 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 6],
				additional : ['', "d6", "d6", "d6", "d8", "d8", "d8", "d8", "d8", "d8", "d10", "d10", "d10", "d10", "d10", "d10", "d12", "d12", "d12", "d12"],
				recovery : "short rest"
			}

			// Make a filtered spell list that contains only Fighter(laserllama) "spells"
			const FighterSpells = Object.keys(SpellsList).filter((key) => SpellsList[key].isExploit).filter((key) => {
				for (var i = 0; i < SpellsList[key].classes.length; i++) {
					if (SpellsList[key].classes[i] == "fighter(laserllama)") return true;
				}
				return false;
				// NOTE: this is literally a SpellsList[key].classes.includes("fighter(laserllama)") but for some cursed reason I can't use that function
			});
			
			// Iterate over all Fighter(laserllama) "spells"
			for (var i = 0; i < FighterSpells.length; i++) {
				var NewSpell = SpellsList[FighterSpells[i]];
				var tempSpell = FighterSpells[i];

				MartialExploits.extrachoices.push(NewSpell.name); // Add "spell" name to menu options

				MartialExploits[FighterSpells[i]] = { // Add "spell" to the main item (when it is picked through the menu)
					name: NewSpell.name,
					toNotesPage : [{ // What is added to the notes page
						name : NewSpell.name + " Exploit [" + (NewSpell.level == 1 ? '1st' : NewSpell.level == 2 ? '2nd' : NewSpell.level == 3 ? '3rd': NewSpell.level + 'th') + " degree]",
						note : desc(NewSpell.descriptionFull),
						amendTo : "Martial Exploits"
					}],
					source: NewSpell.source,
					addMod: NewSpell.addMod,
					submenu: NewSpell.submenu,
					prereqeval: ExploitPrereqFactory(FighterSpells[i], "fighter(laserllama)"),
					eval : MartialEvalFactory(FighterSpells[i]),
					removeeval : MartialRemoveFactory(FighterSpells[i])
				}
			}

			return MartialExploits;
		}(),

		"know your enemy" : {
			name : "Know Your Enemy",
			source : [["GMB:LL", 0]],
			minlevel : 3,
			description : levels.map(function (n) {
				if (n < 14) {
					var descr = [
						"If I spend an action studying someone (up to 60 ft), the DM will tell me info about them",
						"I cannot use this twice on the same creature before completing a short rest"
					];
				} else {
					var descr = [
						"If I spend an action studying someone (up to 60 ft), the DM will tell me info about them",
						"I can also use this once per turn if I hit with a weapon attack",
						"I cannot use this more than three times on the same creature before completing a short rest"
					];
				}
				return desc(descr);
			}),
			action : [["action", ""]]
		},

		"subclassfeature3" : {
            name : "Warrior Archetype",
            source : [["GMB:LL", 0]],
            minlevel : 3,
            description : desc([
                'Choose a Warrior Archetype you strive to emulate and put it in the "Class" field'
            ])
        },

        "action surge" : {
			name : "Action Surge",
			source : [["GMB:LL", 0]],
			minlevel : 6,
			description : desc([
                "I can take one additional action on my turn on top of my normally allowed actions"
            ]),
			usages : levels.map(function (n) {
					return n < 6 ? 0 : n < 20 ? 1 : 2;
			}),
			recovery : "short rest"
		},

		"indomitable" : {
			name : "Indomitable",
			source : [["GMB:LL", 0]],
			minlevel : 9,
			description : desc([
                "When I fail a saving throw, I can choose to succeed instead"
            ]),
			usages : levels.map(function (n) {
					return n < 9 ? 0 : n < 13 ? 1 : n < 17 ? 2 : 3;
			}),
			recovery : "long rest"
		},

		"martial superiority" : {
			name : "Martial Superiority",
			source : [["GMB:LL", 0]],
			minlevel : 11,
			description : desc(["Whenever I use second wind, I regain an exploit die",
				"Also, I regain all expended exploit die if I spend 10 minutes only doing light activity"
			])
		},

		"relentless" : {
			name : "Relentless",
			source : [["GMB:LL", 0]],
			minlevel : 20,
			description : desc(["When I roll initiative, I regain all expended exploit die",
				"Also, if I start my turn without any exploit die remaining, I regain one"
			])
		}
	}

}

// Edit official eldritch knight regex to avoid conflict with arcane knight
if(ClassSubList["fighter-eldritch knight"]) {
    ClassSubList["fighter-eldritch knight"].regExpSearch = /^(?!.*(exalted|sacred|holy|divine|nature|natural|purple.*dragon|green|arcane archer))(?=.*(knight|fighter|warrior|militant|warlord|phalanx|gladiator|trooper))(?=.*\b(eldritch|magic|mage|witch)\b).*$/i
};

// Create arcane knight spell list
var ArcaneKnightList = [
	"blade ward", "booming blade", "chill touch", "control flames", "fire bolt", "green-flame blade", "gust", "light", "lightning lure", "mold earth", "prestidigitation", "resistance", "shape water", "shocking grasp", "sword burst", "true strike", // cantrips
	"absorb elements", "burning hands", "catapult", "chromatic orb", "compelled duel", "earth tremor", "hellish rebuke", "mage armor", "magic missile", "protection from evil and good", "searing smite", "shield", "thunderous smite", "thunderwave", // 1st level
	/*"arcane scorcher",*/ "scorching ray", "branding smite", "flame blade", "gust of wind", "magic weapon", "misty step", "protection from poison", "scorching ray", "shatter", "shadow blade", "warding wind", // 2nd level
	"blinding smite", "counterspell", "dispel magic", "elemental weapon", "fireball", "lightning bolt", "magic circle", "melf's minute meteors", "protection from energy", // 3rd level
	"banishment", "death ward", "fire shield", "freedom of movement", "ice storm", "otiluke's resilient sphere", "staggering smite", "storm sphere" // 4th level
]

for (var i = 0; i < ArcaneKnightList.length; i++) {
	SpellsList[ArcaneKnightList[i]].classes.push("arcane knight");
}

// Subclasses
// Arcane Knight (eldritch knight)
ClassSubList["fighter(laserllama)-arcane knight"] = {
	regExpSearch : /^(?=.*arcane)(?=.*knight)(?!.*errant).*$/i,
	subname : "Arcane Knight",
	fullname : "Arcane Knight",
	source : [["GMB:LL", 0]],
	abilitySave : 4,
	spellcastingFactor : 3,
	spellcastingList : {
		spells : [
			"blade ward", "booming blade", "chill touch", "control flames", "fire bolt", "green-flame blade", "gust", "light", "lightning lure", "mold earth", "prestidigitation", "resistance", "shape water", "shocking grasp", "sword burst", "true strike", // cantrips
			"absorb elements", "burning hands", "catapult", "chromatic orb", "compelled duel", "earth tremor", "hellish rebuke", "mage armor", "magic missile", "protection from evil and good", "searing smite", "shield", "thunderous smite", "thunderwave", // 1st level
			"arcane scorcher", "branding smite", "flame blade", "gust of wind", "magic weapon", "misty step", "protection from poison", "scorching ray", "shatter", "shadow blade", "warding wind", // 2nd level
			"blinding smite", "counterspell", "dispel magic", "elemental weapon", "fireball", "lightning bolt", "magic circle", "melf's minute meteors", "protection from energy", // 3rd level
			"banishment", "death ward", "fire shield", "freedom of movement", "ice storm", "otiluke's resilient sphere", "staggering smite", "storm sphere" // 4th level
		]
	},
	spellcastingKnown : {
		cantrips : [0, 0, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
		spells : [0, 0, 3, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12]
	},
	features : {
		// Override action surge because of the lvl 15 subclass feature
		"action surge": function() {
			var actsurge = newObj(ClassList["fighter(laserllama)"].features["action surge"]);
			actsurge.additional = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "30 ft teleport", "30 ft teleport", "30 ft teleport", "30 ft teleport", "30 ft teleport", "30 ft teleport"];
			return actsurge;
		}(),
		"subclassfeature3" : {
			name : "Spellcasting",
			source : [["GMB:LL", 0]],
			minlevel : 3,
			description : desc(["I can cast known Arcane Knight spells, using Intelligence as my spellcasting ability", "I can replace a spell I know with another I have spell slots for when I gain a level"]),
			additional : ["", "", "2 cantrips \u0026 3 spells known", "2 cantrips \u0026 4 spells known", "2 cantrips \u0026 5 spells known", "2 cantrips \u0026 5 spells known", "2 cantrips \u0026 6 spells known", "2 cantrips \u0026 6 spells known", "2 cantrips \u0026 7 spells known", "3 cantrips \u0026 7 spells known", "3 cantrips \u0026 8 spells known", "3 cantrips \u0026 8 spells known", "3 cantrips \u0026 9 spells known", "3 cantrips \u0026 9 spells known", "3 cantrips \u0026 10 spells known", "3 cantrips \u0026 10 spells known", "3 cantrips \u0026 11 spells known", "3 cantrips \u0026 11 spells known", "3 cantrips \u0026 12 spells known", "3 cantrips \u0026 12 spells known"],
		},
		"subclassfeature3.1" : {
			name : "Weapon Bond",
			source : [["GMB:LL", 0]],
			minlevel : 3,
			description : desc([
				"At the end of a short or long rest, I can touch a weapon, forging a magical bond",
				"I cannot be disarmed of a bonded weapon unless I am incapacitated",
				"If it is on the same plane of existence, I can use a bonus action to instantly summon it to me", 
				"It can be used as a spellcasting focus for my Arcane Knight spells",
				"I can have up to two bonded weapons, but can only summon one at a time"
			]),
			calcChanges : {
				atkAdd : [
					function (fields, v) {
						if (classes.known["fighter(laserllama)"] && classes.known["fighter(laserllama)"].level >= 3 && v.isWeapon && (/bond/i).test(v.WeaponTextName)) {
							fields.Description += (fields.Description ? '; ' : '') + 'Cannot be disarmed unless incapacitated';
						}
					},
					"I cannot be disarmed of a bonded weapon unless I am incapacitated",
					19
				]
			},
			action : [["bonus action", " (summon)"]]
		},
		"subclassfeature7" : {
			name : "War Magic",
			source : [["GMB:LL", 0]],
			minlevel : 7,
			description : "\n   " + "When I use my action to cast an Arcane Knight spell, I can make a weapon attack as a bonus action",
			action : ["bonus action", ""]
		},
		"subclassfeature10" : {
			name : "Enchanted Strikes",
			source : [["GMB:LL", 0]],
			minlevel : 10,
			description : "\n   " + "A creature hit by my weapon attack has disadv. on the save vs. the next spell I cast" + "\n   " + "This lasts until the end of my next turn"
		},
		"subclassfeature15" : {
			name : "Arcane Surge",
			source : [["GMB:LL", 0]],
			minlevel : 15,
			description : "\n   " + "When I use Action Surge, I can also teleport up to 30 ft to an empty space I can see" + "\n   " + "I can do so before or after the extra action"
		},
		"subclassfeature18" : {
			name : "Legendary Arcane Knight",
			source : [["GMB:LL", 0]],
			minlevel : 18,
			description : desc("When I take the Attack action on my turn, I can cast an Arcane Knight spell with a casting time of one action in place of one attack")
		}
	}
}

// Champion
AddSubClass("fighter(laserllama)", "champion", {
	regExpSearch : /champion/i,
	subname : "Champion",
	fullname : "Champion",
	source : [["GMB:LL", 0]],
	abilitySave : 1,
	abilitySaveAlt : 2,
	features : {
		"subclassfeature3" : GetSubclassExploits("Champion", ["feat of strength", "ruthless strike","concussive blow","heroic will","mythic athleticism"]),
		"subclassfeature3.1" : {
			name : "Mighty Warrior",
			source : [["GMB:LL", 0]],
			minlevel : 3,
			description : levels.map(function (n) {
					return n < 15 ? desc("I score a critical hit with my weapon attacks on a roll of 19 and 20") : desc("I score a critical hit with my weapon attacks on a roll of 18, 19 and 20");
			}),
			calcChanges : {
				atkAdd : [
					function (fields, v) {
						if (!v.isSpell && !v.CritChance && classes.known["fighter(laserllama)"] && classes.known["fighter(laserllama)"].level < 15) {
							fields.Description += (fields.Description ? '; ' : '') + 'Crit on 19-20';
							v.CritChance = 19;
						};
						if (!v.isSpell && (!v.CritChance || v.CritChance >= 19) && classes.known["fighter(laserllama)"] && classes.known["fighter(laserllama)"].level >= 15) {
							fields.Description += (fields.Description ? '; ' : '') + 'Crit on 18-20';
							v.CritChance = 18;
						};
					},
					"My weapon attacks score a critical hit on 19-20 (if fighter lvl < 15) or 18-20 (if fighter lvl >=15)",
					19
				]
			}
		},
		"subclassfeature3.2" : {
			name : "Remarkable Strength",
			source : [["GMB:LL", 0]],
			minlevel : 3,
			description : desc("Whenever I make a Strength or Constitution ability check or saving throw, I gain a bonus to my roll equal to one roll of my Exploit Die")
		},
		"subclassfeature7" : {
			name : "Peak Athlete",
			source : [["GMB:LL", 0]],
			minlevel : 7,
			description : desc(["I gain a climbing and swimming speed equal to my walking speed", "When I use Second Wind, I gain the benefits of the Dash action"]),
			speed : {
				swim : { spd : "walk", enc : 0 },
				climb : { spd : "walk", enc : 0 }
			}
		},
		"subclassfeature10" : {
			name : "Devastating Critical",
			source : [["GMB:LL", 0]],
			minlevel : 10,
			description : desc(["Whenever I score a critical hit with a weapon attack, I can deal additional damage equal to my Fighter level"])
		},
		"subclassfeature15" : {
			name : "Devastating Critical Improvement",
			source : [["GMB:LL", 0]],
			minlevel : 15,
			description : desc(["When I score a critical hit with a weapon attack, I can maximize the damage instead of rolling"]),
			usages : 1,
			recovery : "short rest"
		},
		"subclassfeature18" : {
			name : "Legendary Champion",
			source : [["GMB:LL", 0]],
			minlevel : 18,
			description : desc("At the start of my turn, if I'm not above half or at 0 HP, I regain 5 + Con mod HP")
		}
	}
})

// Commander (banneret)
AddSubClass("fighter(laserllama)", "commander", {
	regExpSearch : /commander/i,
	subname : "Commander",
	fullname : "Commander",
	source : [["GMB:LL", 0]],
	abilitySave : 1,
	abilitySaveAlt : 2,
	features : {
		"subclassfeature3" : {
			name : "Commander Exploits",
			source : [["GMB:LL", 0]],
			minlevel : 7,
			description : desc(["I learn exploits from the Warlord class who don't count against my total", "This feature has not been implemented yet (interested in this? shoot me a dm!)"])
		},
		"subclassfeature3.1" : {
			name : "Student of War",
			source : [["GMB:LL", 0]],
			minlevel : 3,
			description : desc(["I gain proficiency in either History, Insight, or Persuasion, and whenever I make an ability check with that skill I gain a bonus to my roll equal to one roll of my Exploit Die"]),
			skillstxt : "Choose one from: History, Insight, or Persuasion",
		},
		"subclassfeature7" : {
			name : "Strategic Command",
			source : [["GMB:LL", 0]],
			minlevel : 7,
			description : desc(["When I use Second Wind, I can choose up to three creatures within 30 ft that can see or hear me to regain hit points equal to one roll of my Exploit Die + my Leadership modifier"])
		},
		"subclassfeature10" : {
			name : "Heroic Surge",
			source : [["GMB:LL", 0]],
			minlevel : 10,
			description : levels.map(function (n) {
				if (n < 18) return desc(["When I use Action Surge, I can choose another creature within 30 ft that can see or hear me", "It can use its reaction to move up to its full speed without provoking opportunity attacks and then make a single weapon attack"])
				return desc(["When I use Action Surge, I can choose two creatures within 30 feet that can see or hear me", "They can use their reaction to move up to their full speed without provoking opportunity attacks and then make a single weapon attack"])
			})
		},
		"subclassfeature15" : {
			name : "Inspiring Commands",
			source : [["GMB:LL", 0]],
			minlevel : 15,
			description : desc(["Once per turn when I use a Tactical Exploit that targets at least one friendly creature, one target of my choice gains temp HP equal to my Leadership modifier"])
		}
	}
})

// Marksman
AddSubClass("fighter(laserllama)", "marksman", {
	regExpSearch : /marksman/i,
	subname : "Marksman",
	fullname : "Marksman",
	source : [["GMB:LL", 0]],
	abilitySave : 1,
	abilitySaveAlt : 2,
	weaponProfs : {
		primary : [true, true, ["Firearms"]]
	},
	features : {
		"subclassfeature3" : GetSubclassExploits("Marksman", ["arresting strike", "inquisitive eye", "crippling strike", "volley", "thunderous shot"]),
		"subclassfeature3.1" : {
			name : "Marksman's Focus",
			source : [["GMB:LL", 0]],
			minlevel : 3,
			description : desc([
					"When I begin my turn and am not surprised or incapacitated, I can choose to enter a state of Focus, which imposes the following benefits and effects until the end of my turn:",
					"\u2022 My speed is reduced to 0 feet",
					"\u2022 Until I hit a creature with a ranged attack, I have adv. on all ranged weapon attack rolls",
					"\u2022 I can reroll 1 and 2 (but must take the new roll) on my damage rolls with a ranged weapon"
				])
		},
		"subclassfeature3.2" : {
			name : "Elite Training",
			source : [["GMB:LL", 0]],
			minlevel : 3,
			description : desc([
				"When I make a Dex check or saving throw, I can expend an Exploit Die and add it to my roll", 
				"I can do so after I roll, but before I know the result."
			])
		},
		"subclassfeature7" : {
			name : "Cunning Shot",
			source : [["GMB:LL", 0]],
			minlevel : 7,
			description : desc(["I add my proficiency bonus to my Initiative rolls while conscious", "My attacks with ranged weapons ignore resistance to piercing damage"]),
			addMod : { type : "skill", field : "Init", mod : "Prof", text : "I can add my Proficiency Bonus to initiative rolls" },
			calcChanges : {
				atkAdd : [
					function (fields, v, output) {
						if (v.isRangedWeapon && !v.isNaturalWeapon && !v.isDC) fields.Description += (fields.Description ? '; ' : '') + "Ignore resistance to pierc dmg";
					},
					"My attacks with ranged weapons ignore resistance to piercing damage"
				]
			}
		},
		"subclassfeature10" : {
			name : "Reposition",
			source : [["GMB:LL", 0]],
			minlevel : 10,
			description : desc(["When I use Second Wind, my walking speed increases by 10 feet, and any opportunity attacks against me are made at disadvantage until the end of my current turn"])
		},
		"subclassfeature15" : {
			name : "Reliable Shot",
			source : [["GMB:LL", 0]],
			minlevel : 15,
			description : desc(["My normal and long range for ranged weapon attacks increases by 10 ft times my Fighter lvl", 
				"Also, once per turn, when I have advantage on a ranged weapon attack, I can forgo advantage and make one additional ranged weapon attack"
				]),
			calcChanges : {
			    atkAdd : [
			        function (fields, v) {
			            if (v.isRangedWeapon && !v.isNaturalWeapon && !v.isDC && (/\d+\/\d+\s?(ft|m)/).test(fields.Range)) {
			                var rangeNmbr = fields.Range.match(/\b(\d+)\/(\d+)\b/);
			                var shortRange = parseInt(rangeNmbr[1]);
			                var longRange = parseInt(rangeNmbr[2]);
			                shortRange += classes.known["fighter(laserllama)"].level * 10;
			                longRange += classes.known["fighter(laserllama)"].level * 10;

			                fields.Range = fields.Range.replace(/\b(\d+)\/(\d+)\b/, shortRange + '/' + longRange);
			            };
			        },
					"My normal and long range for ranged weapon attacks increases by 10 ft times my Fighter lvl"
			    ],
			}
		},
		"subclassfeature18" : {
			name : "Legendary Marksman",
			source : [["GMB:LL", 0]],
			minlevel : 18,
			description : desc([
				"When I Focus, the benefits last for 1 minute, and I have adv. on all ranged weapon attacks for the duration and my speed is only reduced to 10 ft",
				"At the start of my turn, I can end my Focus (no action required)"
			])
		}
	}
})

// Master at arms (battle master)
AddSubClass("fighter(laserllama)", "master at arms", {
	regExpSearch : /^(?=.*master)(?=.*arms).*$/i,
	subname : "Master at Arms",
	fullname : "Master at Arms",
	source : [["GMB:LL", 0]],
	abilitySave : 1,
	abilitySaveAlt : 2,
	features : {

		// Override action surge because of the lvl 10 subclass feature
		"action surge": function() {
			var actsurge = newObj(ClassList["fighter(laserllama)"].features["action surge"]);
			actsurge.additional = ["", "", "", "", "", "", "", "", "", "exploit die", "exploit die", "exploit die", "exploit die", "exploit die", "exploit die", "exploit die", "exploit die", "exploit die", "exploit die", "exploit die"];
			return actsurge;
		}(),

		"subclassfeature3" : function(){
			ClassList["fighter(laserllama)"].features["martial exploits"].additional = ['', "d6", "d8", "d8", "d10", "d10", "d10", "d10", "d10", "d10", "d12", "d12", "d12", "d12", "d12", "d12", "d12", "d12", "d12", "d12"];

			// Fixed attributes
			MartialExploits = {
				name : "Advanced Technique",
				minlevel : 3,
				source : [["GMB:LL", 0]],
				description : levels.map(function (n) {
						if (n < 3) return '';

						if (n >= 3 && n < 5) {
							var result = ["My total number of Exploit Dice increases by 1 and my Exploit Dice increase to become 1d8",
							"I also learn two 1st degree Martial Exploits of my choice who don't count against my total"]
						}

						if (n >= 5 && n < 9) {
							var result = ["My total number of Exploit Dice increases by 1 and my Exploit Dice increase to become 1d10",
							"I also learn two 1st degree and two 2nd degree Martial Exploits of my choice who don't count against my total"]
						}

						if (n >= 9 && n < 11) {
							var result = ["My total number of Exploit Dice increases by 1 and my Exploit Dice increase to become 1d10",
							"I also learn two 1st degree, two 2nd degree and a 3rd degree Martial Exploits of my choice who don't count against my total"]
						}

						if (n >= 11) {
							var result = ["My total number of Exploit Dice increases by 1 and my Exploit Dice increase to become 1d12",
							"I also learn two 1st degree, two 2nd degree and a 3rd degree Martial Exploits of my choice who don't count against my total"]
						}

						return desc(result)
					}),
				toNotesPage : [{
						name : "Master at Arms Exploits",
						note : desc(["Below are my Master at Arms exploits. The 3rd level exploit can only be used per short rest."])
					}],

				extraLimitedFeatures : [{
					name : "Martial Exploits",
					usages : 1,
					recovery : "short rest",
					addToExisting : true
				}],

				// Martial Exploits
				extraname : "Master at Arms Exploits",
				extraTimes : levels.map(function (n) {
					return n < 3 ? 0 : n < 5 ? 2 : n < 9 ? 4 : 5;
				}),
				extrachoices : []
			}

			// Make a filtered spell list that contains only Fighter(laserllama) "spells" of degree <= 3
			const FighterSpells = Object.keys(SpellsList).filter((key) => SpellsList[key].isExploit && SpellsList[key].level <= 3).filter((key) => {
				for (var i = 0; i < SpellsList[key].classes.length; i++) {
					if (SpellsList[key].classes[i] == "fighter(laserllama)") return true;
				}
				return false;
				// NOTE: this is literally a SpellsList[key].classes.includes("fighter(laserllama)") but for some cursed reason I can't use that function
			});
			
			//const DegreeToMinLevel = [0,0,5,9,13,17]
			// Iterate over all Fighter(laserllama) "spells"
			for (var i = 0; i < FighterSpells.length; i++) {
				var NewSpell = SpellsList[FighterSpells[i]];

				MartialExploits.extrachoices.push(NewSpell.name); // Add "spell" name to menu options

				MartialExploits[FighterSpells[i]] = { // Add "spell" to the main item (when it is picked through the menu)
					name: NewSpell.name,
					toNotesPage : [{ // What is added to the notes page
						name : NewSpell.name + " Exploit [" + (NewSpell.level == 1 ? '1st' : NewSpell.level == 2 ? '2nd' : NewSpell.level == 3 ? '3rd': NewSpell.level + 'th') + " degree]",
						note : desc(NewSpell.descriptionFull),
						amendTo : "Master at Arms Exploits"
					}],
					source: NewSpell.source,
					addMod: NewSpell.addMod,
					submenu: NewSpell.submenu,
					prereqeval: ExploitPrereqFactory(FighterSpells[i], "fighter(laserllama)"),
					eval : MartialEvalFactory(FighterSpells[i]),
					removeeval : MartialRemoveFactory(FighterSpells[i])
				}
			}

			return MartialExploits;
		}(),

		"subclassfeature3.1" : function () { // copies the main class feature, avoids having to copy all fighting styles
			var FSfea = newObj(ClassList["fighter(laserllama)"].features["fighting style"]);
			FSfea.name = "Additional Fighting Style";
			FSfea.source = [["GMB:LL", 0]];
			FSfea.minlevel = 3;
			FSfea.description = levels.map(function (n) {
					if (n < 3) return '';

					if (n >= 3 && n < 7) {
						var result = ["I learn an additional Fighting Style but can only benefit from one at a time",
							"I can switch between Fighting Styles I know as a bonus action"]
					}

					if (n >= 7 && n < 10) {
						var result = ["I learn two additional Fighting Styles but can only benefit from one at a time",
							"I can switch between Fighting Styles I know as a bonus action"]
					}

					if (n >= 10 && n < 15) {
						var result = ["I learn two additional Fighting Styles but can only benefit from two at a time",
							"I can change one active Fighting Styles I know with another as a bonus action"]
					}

					if (n >= 15) {
						var result = ["I learn three additional Fighting Styles but can only benefit from two at a time",
							"I can change one active Fighting Styles I know with another as a bonus action"]
					}

					return desc(result)
				});
			FSfea.action = [["bonus action", "Change fighting style"]];

			FSfea.extraname = "Additional Fighting Style";
			FSfea.extrachoices = FSfea.choices;
			FSfea.extraTimes = levels.map(function (n) {
					return n < 3 ? 0 : n < 7 ? 1 : n < 15 ? 2 : 3;
				});
			FSfea.choices = undefined; // work-around to prevent having the choice menu display twice

			return FSfea;
		}(),

		"subclassfeature7": function(){

			// Fixed attributes
			MartialExploits = {
				name : "Master of Forms",
				minlevel : 7,
				source : [["GMB:LL", 0]],
				description: levels.map(function (n) {
						if (n < 7) return '';

						if (n >= 7 && n < 15) {
							var result = ["I learn two additional Exploits of my choice from any class", "If it has a level prerequisite, I use my Fighter level"]
						}

						if (n >= 15 && n < 18) {
							var result = ["I learn three additional Exploits of my choice from any class", "If it has a level prerequisite, I use my Fighter level"]
						}

						if (n >= 18) {
							var result = ["I learn four additional Exploits of my choice from any class", "If it has a level prerequisite, I use my Fighter level"]
						}

						return desc(result)
					}),

				// Exploit choice menu
				extraname : "Master of Forms Exploits",
				extrachoices : [],
				extraTimes : levels.map(function (n) {
					return n < 7 ? 0 : n < 15 ? 2 : n < 18 ? 3 : 4;
				}),
				toNotesPage : [{
					name : "Master of Forms Exploits",
					note : desc(["Below are my Master of Forms exploits. Each 3rd and 4th degree exploits can only be used once per short rest. Each 5th degree exploit can only be used once per long rest."])
				}],
			}

			// Make a filtered spell list that contains only exploits
			const FighterSpells = Object.keys(SpellsList).filter((key) => SpellsList[key].isExploit);
			
			//const DegreeToMinLevel = [0,0,5,9,13,17]
			// Iterate over all Fighter(laserllama) "spells"
			for (var i = 0; i < FighterSpells.length; i++) {
				var NewSpell = SpellsList[FighterSpells[i]];

				MartialExploits.extrachoices.push(NewSpell.name); // Add "spell" name to menu options

				MartialExploits[FighterSpells[i]] = { // Add "spell" to the main item (when it is picked through the menu)
					name: NewSpell.name,
					toNotesPage : [{ // What is added to the notes page
						name : NewSpell.name + " Exploit [" + (NewSpell.level == 1 ? '1st' : NewSpell.level == 2 ? '2nd' : NewSpell.level == 3 ? '3rd': NewSpell.level + 'th') + " degree]",
						note : desc(NewSpell.descriptionFull),
						amendTo : "Master of Forms Exploits"
					}],
					source: NewSpell.source,
					addMod: NewSpell.addMod,
					submenu: NewSpell.submenu,
					prereqeval: ExploitPrereqFactory(FighterSpells[i], "fighter(laserllama)"),
					eval : MartialEvalFactory(FighterSpells[i]),
					removeeval : MartialRemoveFactory(FighterSpells[i])
				}
			}

			return MartialExploits;
		}(),

		"subclassfeature10" : {
			name : "Masterful Surge",
			source : [["GMB:LL", 0]],
			minlevel : 10,
			description : desc(["Whenever I use action surge, I regain an exploit die which can only be used in the additional action (and disappears if not consumed)"])
		},

		"subclassfeature18" : {
			name : "Warrior of Legend",
			source : [["GMB:LL", 0]],
			minlevel : 18,
			description : desc(["Once per turn, instead of expending an Exploit Die, I can use a d6 as Exploit Die", "Also, I can replace an Exploit I know with another of the same level with 1h of training (can be part of a short/long rest)"])
		}
	}
})

// Mystic (psi warrior)
AddSubClass("fighter(laserllama)", "mystic", {
	regExpSearch : /mystic/i,
	subname : "Mystic",
	fullname : "Mystic",
	source : [["GMB:LL", 0]],
	abilitySave : 4,
	spellcastingFactor : 3,
	/*spellcastingList : {
		spells : [
			"blade ward", "booming blade", "chill touch", "control flames", "fire bolt", "green-flame blade", "gust", "light", "lightning lure", "mold earth", "prestidigitation", "resistance", "shape water", "shocking grasp", "sword burst", "true strike", // cantrips
			"absorb elements", "burning hands", "catapult", "chromatic orb", "compelled duel", "earth tremor", "hellish rebuke", "mage armor", "magic missile", "protection from evil and good", "searing smite", "shield", "thunderous smite", "thunderwave", // 1st level
			"arcane scorcher", "branding smite", "flame blade", "gust of wind", "magic weapon", "misty step", "protection from poison", "scorching ray", "shatter", "shadow blade", "warding wind", // 2nd level
			"blinding smite", "counterspell", "dispel magic", "elemental weapon", "fireball", "lightning bolt", "magic circle", "melf's minute meteors", "protection from energy", // 3rd level
			"banishment", "death ward", "fire shield", "freedom of movement", "ice storm", "otiluke's resilient sphere", "staggering smite", "storm sphere" // 4th level
		]
	},
	spellcastingKnown : {
		cantrips : [0, 0, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
		spells : [0, 0, 3, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12]
	},*/
	features : {
		"subclassfeature3" : {
			name : "Spellcasting",
			source : [["GMB:LL", 0]],
			minlevel : 3,
			description : desc(["I can cast known Psion spells, using Intelligence as my spellcasting ability", "This feature has not been implemented yet (interested in this? shoot me a dm!)"]),
			//additional : ["", "", "2 cantrips \u0026 3 spells known", "2 cantrips \u0026 4 spells known", "2 cantrips \u0026 5 spells known", "2 cantrips \u0026 5 spells known", "2 cantrips \u0026 6 spells known", "2 cantrips \u0026 6 spells known", "2 cantrips \u0026 7 spells known", "3 cantrips \u0026 7 spells known", "3 cantrips \u0026 8 spells known", "3 cantrips \u0026 8 spells known", "3 cantrips \u0026 9 spells known", "3 cantrips \u0026 9 spells known", "3 cantrips \u0026 10 spells known", "3 cantrips \u0026 10 spells known", "3 cantrips \u0026 11 spells known", "3 cantrips \u0026 11 spells known", "3 cantrips \u0026 12 spells known", "3 cantrips \u0026 12 spells known"],
		},
		"subclassfeature3.1" : {
			name : "Minor Telekinesis",
			source : [["GMB:LL", 0]],
			minlevel : 3,
			description : desc([
				"I learn the mage hand spell, and when I manifest it I do not need to provide components",
				"My mage hand is invisible, and can lift a number of pounds equal to 10 * Int mod (min 10)"
			]),
			spellcastingBonus : [{
				name : "Minor Telekinesis",
				spells : ["mage hand"],
				selection : ["mage hand"]
			}],
			spellChanges : {
				"mage hand" : {
					description : "Create invis hand for simple tasks or carry up to 10*Int lb; 1 a to control; can't have multiple instances",
					components : "",
					changes : "My Minor Telekinesis class feature expands my use of the Mage Hand cantrip, removes the need for components and makes the spectral hand invisible."
				}
			}
		},
		"subclassfeature3.2" : {
			name : "Mystic Empowerment",
			source : [["GMB:LL", 0]],
			minlevel : 3,
			description : desc(["When an Exploit would use my Str, Dex, or Con, I can choose to use my Int instead", "Also, once per turn when I damage a creature with a Martial Exploit, I can choose for the Exploit to deal psychic damage in place of its normal damage type"]),
		},
		"subclassfeature7" : {
			name : "Phase Step",
			source : [["GMB:LL", 0]],
			minlevel : 7,
			description : levels.map(function (n) {
				var result = ["When I use Second Wind, until the end of my current turn, I can move through solid nonmag objects and crea as if they were difficult terrain", "If I end my movement inside an object or creature, I am instantly shunted to the nearest unoccupied space, taking 1d10 force damage for every 5 feet I am forced to move"]
				if (n >= 18) result[0] = ("When I use Second Wind, until the end of my current turn, I gain a fly speed equal to my walk speed and can move through solid nonmag objects and crea as if they were difficult terrain");
				return desc(result);
			})
		},
		"subclassfeature10" : {
			name : "Inscrutable Mind",
			source : [["GMB:LL", 0]],
			minlevel : 10,
			description : desc(["I have adv. on saving throws to resist being charmed, frightened, or having my thoughts read", "Also, whenever I succeed on an Int, Wis, or Cha saving throw, I can spend 1 Psi Point to force the attacker to succeed an Int saving throw or take psychic dmg equal to my Fighter lvl"]),
			savetxt : { adv_vs : ["charmed", "frightened", "mind reading"] }
		},
		"subclassfeature15" : {
			name : "Psionic Ward",
			source : [["GMB:LL", 0]],
			minlevel : 15,
			description : desc(["As a bonus action, project a Psionic Ward around me for a 30-foot radius for 1 minute", "Me, and creatures of my choice within range gain resistance to psychic damage and can add my Int mod (min of +1) to any Int, Wis, and Cha saving throws that we make"]),
			additional : "5 Psi Points",
			action : ["bonus action", ""]
		},
		"subclassfeature18" : {
			name : "Legendary Mystic",
			source : [["GMB:LL", 0]],
			minlevel : 18,
			description : desc(["I learn the telekinesis spell, but it does not count against my total", "I can manifest this spell once per long rest or spend 5 Psi points to use it again"]),
			spellcastingBonus : {
				name : "Telekinetic Master",
				spells : ["telekinesis"],
				selection : ["telekinesis"],
				firstCol : "oncelr"
			},
			spellChanges : {
				"telekinesis" : {
					components : "",
					changes : "Using Legendary Mystic, I can cast Telekinesis without requiring components and without spell slots"
				}
			}
		}
	}
})

// Ronin (samurai)
AddSubClass("fighter(laserllama)", "ronin", {
	regExpSearch : /ronin/i,
	subname : "Ronin",
	fullname : "Ronin",
	source : [["GMB:LL", 0]],
	abilitySave : 1,
	abilitySaveAlt : 2,
	features : {
		"subclassfeature3" : GetSubclassExploits("Ronin", ["commanding presence","counter","aggressive sprint","honor duel","heroic focus"]),
		"subclassfeature3.1" : {
			name : "Exiled Courtier",
			languageProfs : [1],
			source : [["GMB:LL", 0]],
			minlevel : 3,
			skillstxt : "Choose one from: History, Insight, Performance, or Persuasion",
			description : levels.map(function (n) {
				if (n < 7) return desc(["I learn to speak, read, and write one additional language of my choice and gain proficiency in either History, Insight, Performance, or Persuasion."]);
				return desc(["I learn to speak, read, and write one additional language of my choice and gain proficiency in either History, Insight, Performance, or Persuasion.", "I also gain a bonus of my Exploit Die to any roll made with that skill."])
			})
		},
		"subclassfeature3.2" : {
			name : "Unyielding Spirit",
			source : [["GMB:LL", 0]],
			minlevel : 3,
			description : desc(["As a bonus action, I gain adv. on my attacks and ignore any exhaustion level for this turn", "I also gain temporary HP equal to my fighter level", "I can use this once per short rest or gain an exhaustion level to use it again"]),
			recovery : levels.map(function (n) {
					return n < 10 ? "short rest" : "Init";
				}),
			additional : levels.map(function (n) { return n < 3 ? "" : n + " temp HP"; }),
			usages : 1,
			action : ["bonus action", ""]
		},
		"subclassfeature7" : {
			name : "Unbreakable Will",
			source : [["GMB:LL", 0]],
			minlevel : 7,
			description : desc(["I gain proficiency with Wis saves, or if I'm already proficient, either Int or Cha saves"]),
			saves : ["Wis"]
		},
		"subclassfeature10" : {
			name : "Unrelenting",
			source : [["GMB:LL", 0]],
			minlevel : 10,
			description : desc(["I regain one use of Unyielding Spirit if I have no more remaining when I roll initiative","When using Second Wind, my current level of exhaustion, if any, is reduced by 1"])
		},
		"subclassfeature15" : {
			name : "Swift Strikes",
			source : [["GMB:LL", 0]],
			minlevel : 15,
			description : desc([
				"With the Attack action, I can forgo advantage on one attack to make one extra attack",
				"This extra attack is part of the same action; I can do this only once per turn"
			])
		},
		"subclassfeature18" : {
			name : "Legendary Ronin",
			source : [["GMB:LL", 0]],
			minlevel : 18,
			description : desc([
				"If I'm reduced to 0 HP, I can delay falling unconscious, immediately taking a bonus turn",
				"While I'm at 0 HP, I suffer damage normally and die if I have 3 failed death saves",
				"If I'm still at 0 HP at the end of this bonus turn, I fall unconscious",
				"If I have no uses remaining, I can expend a use of Action Surge instead"
			]),
			recovery : "long rest",
			usages : 1
		}
	}
})

// Knight Errant (cavalier)
AddSubClass("fighter(laserllama)", "knight errant", {
	regExpSearch : /^(?=.*knight)(?=.*errant)(?!.*arcane).*$/i,
	subname : "Knight Errant",
	fullname : "Knight Errant",
	source : [["GMB:LL", 0]],
	abilitySave : 1,
	abilitySaveAlt : 2,
	features : {
		"subclassfeature3" : GetSubclassExploits("Knight Errant", ["shield impact", "skilled rider","defensive stance","honor duel","mythic resilience"]),
		"subclassfeature3.1" : {
			name : "Courtly Pedigree",
			languageProfs : [1],
			source : [["GMB:LL", 0]],
			minlevel : 3,
			skillstxt : "Choose one from: Animal Handling, History, Insight, Performance, or Persuasion",
			description : desc(["I learn to speak, read, and write one additional language of my choice and gain proficiency in either Animal Handling, History, Insight, Performance, or Persuasion.",
				"I cannot be knocked against my will from a trained mount unless me or the mount is incapacitated and mounting/dismounting only takes me 5 ft of movement"])
		},
		"subclassfeature3.2" : {
			name : "Chivalric Mark",
			source : [["GMB:LL", 0]],
			minlevel : 3,
			description : desc([
				"Once per turn, if hit a creature with a melee weapon attack, I can mark it until the end of my next turn",
				"While it is within 10 ft of me, a marked target has disadv. on attacks not directed at me",
				"If it damages anybody but me, I can make a special melee attack vs. it with my reaction",
				"I can give myself adv. on that attack by expending an Exploit Die and add it to the damage"
			]),
			action : ["reaction", ""]
		},
		"subclassfeature7" : {
			name : "Noble Guardian",
			source : [["GMB:LL", 0]],
			minlevel : 7,
			description : desc(["I learn the Protector Fighting Style (or another if I already know it)",
			 "As a reaction, I can add my Exploit Die to AC against an attack made vs. me or someone within 5 ft of me. I need to be wielding a shield or a melee weapon to do this.",
			 "If the attack still hits, I can expend an Exploit Die to grant the target resistance to the attack"]),
			action : ["reaction", "Protector Fighting Style"]
		},
		"subclassfeature10" : {
			name : "Unyielding Knight",
			source : [["GMB:LL", 0]],
			minlevel : 10,
			description : desc(["Creatures provoke opportunity attacks when moving 5 ft or more while within my reach",
				"If I hit an opportunity attack, the target's speed is reduced to 0 until the end of the turn",
				"I can use the Skilled Rider exploit at will without expending an Exploit Die"]),
			spellChanges : {
				"skilled rider" : {
					firstCol : "atwill",
					changes : "I can use the Skilled Rider exploit at will without expending an Exploit Die" // required
				}
			}
		},
		"subclassfeature15" : {
			name : "Perilous Charge",
			source : [["GMB:LL", 0]],
			minlevel : 15,
			description : desc([
				"If I hit a creature after moving 10 ft in a straight line, it must make a Strength save",
				"If failed, the target is knocked prone; I can do this only once per turn",
				"It has disadvantage on the saving throw if I am mounted"
			])
		},
		"subclassfeature18" : {
			name : "Legendary Knight Errant",
			source : [["GMB:LL", 0]],
			minlevel : 18,
			description : desc([
				"I can gain a special reaction but only for opportunity attacks or protector fighting style",
				"I can do this only once on every creature's turn, except on my own turn",
				"I can redirect damage from my trained mount to myself"
			])
		}
	}
})

// Runecarver (rune knight)
AddSubClass("fighter(laserllama)", "runecarver", {
	regExpSearch : /^(?=.*rune)(?=.*carver).*$/i,
	subname : "Runecarver",
	fullname : "Runecarver",
	source : [["GMB:LL", 0]],
	abilitySave : 1,
	abilitySaveAlt : 2,
	features : {
		"subclassfeature3" : {
			name : "Rune Carver",
			languageProfs : [1],
			source : [["GMB:LL", 0]],
			minlevel : 3,
			description : desc("I gain proficiency with calligrapher's supplies and I learn to speak, read, and write Giant"),
			toolProfs : ["Calligrapher's Supplies"],
			languageProfs : ["Giant"]
		},
		"subclassfeature3.1" : {
			name : "Rune Carving",
			source : [["GMB:LL", 0]],
			minlevel : 3,
			description : desc([
				"I learn how to use magic runes to enhance my gear that I can wear or hold in my hand",
				"When I finish a short/long rest, I can inscribe each rune I know upon a different item I touch",
				"Runes inscribed on a carried object grant both a passive and a limited-use active effect",
				"Each rune can only be on one item at a time, and recharge after a short/long rest",
				"Whenever I gain a fighter level, I can swap a rune I know for another",
				"Only me can trigger runes; The DC for a rune's abilities is my Exploit Die DC",
				"Exploits learned through runes can be used at will and don't count against my total"
			]),
			toNotesPage : [{
					name : "Runecarver Exploits",
					note : desc(["Below are my Runecarver exploits. They can all be used at will."])
			}],
			additional : levels.map(function (n){
				return n < 3 ? "" : (n < 7 ? 2 : n < 10 ? 3 : n < 15 ? 4 : n < 18 ? 5 : 6) + " runes known"
			}),
			extraTimes : levels.map(function (n) {
				return n < 3 ? 0 : n < 7 ? 2 : n < 10 ? 3 : n < 15 ? 4 : n < 18 ? 5 : 6;
			}),
			extraname : "Known runes",
			extrachoices : ["Cloud Rune", "Fire Rune", "Frost Rune", "Stone Rune", "Hill Rune (prereq: level 7 fighter)", "Storm Rune (prereq: level 7 fighter)"],
			"cloud rune" : {
				name : "Cloud Rune",
				source : [["GMB:LL", 0]],
				description : desc([
					"I learn the Subtle Con exploit",
					"As a reaction when I or another I can see within 30 ft is hit by an attack, I can invoke this",
					"I select another target for the attack within 30 ft of me, using the same roll (within range)"
				]),
				spellcastingBonus : [{ // What is added to the spellcasting sheet
					name : "Cloud Rune Exploit",
					spellcastingAbility : 1,
					spells : ["subtle con"],
					selection : ["subtle con"],
					firstCol: 'atwill'
				}],
				toNotesPage : [{ // What is added to the notes page
					name : SpellsList["subtle con"].name,
					note : desc(SpellsList["subtle con"].descriptionFull),
					amendTo : "Runecarver Exploits"
				}],
				action : [["reaction", " (invoke)"]],
				additional : "invoke",
				usages : 1,
				recovery : "short rest"
			},
			"fire rune" : {
				name : "Fire Rune",
				source : [["GMB:LL", 0]],
				description : desc([
					"I add my Exploit Die when making an ability check with a tool",
					"When I hit a creature with a weapon attack, I can invoke it to summon molten restraints",
					"It must make a Str save or take 2 Exploit Die of fire dmg and be restrained for 1 min",
					"While restrained, it can repeat the saving throw at the end of each of its turns",
					"It takes 2 Exploit Die of fire dmg on a failure and breaks free on a success"
				]),
				additional : "invoke",
				usages : 1,
				recovery : "short rest"
			},
			"frost rune" : {
				name : "Frost Rune",
				source : [["GMB:LL", 0]],
				description : desc([
					"I learn the Cunning Instinct exploit",
					"As a bonus action, I can invoke this to add my Exploit Die on Str and Con checks and saves for 10 min"
				]),
				spellcastingBonus : [{ // What is added to the spellcasting sheet
					name : "Frost Rune Exploit",
					spellcastingAbility : 1,
					spells : ["cunning instinct"],
					selection : ["cunning instinct"],
					firstCol: 'atwill'
				}],
				toNotesPage : [{ // What is added to the notes page
					name : SpellsList["cunning instinct"].name,
					note : desc(SpellsList["cunning instinct"].descriptionFull),
					amendTo : "Runecarver Exploits"
				}],
				addMod: SpellsList["cunning instinct"].addMod,
				action : [["bonus action", " (invoke)"]],
				additional : "invoke",
				usages : 1,
				recovery : "short rest"
			},
			"stone rune" : {
				name : "Stone Rune",
				source : [["GMB:LL", 0]],
				description : desc([
					"I learn the Inquisitive Eye exploit",
					"As a reaction when a creature I can see ends it turn within 30 ft, I can invoke this rune",
					"This causes the creature to make a Wisdom save or be charmed by me for 1 minute",
					"While charmed, it descends into a dreamy stupor, becoming incapacitated and has speed 0",
					"It can repeat the save at the end of each of its turns, ending the effect on a success"
				]),
				spellcastingBonus : [{ // What is added to the spellcasting sheet
					name : "Stone Rune Exploit",
					spellcastingAbility : 1,
					spells : ["inquisitive eye"],
					selection : ["inquisitive eye"],
					firstCol: 'atwill'
				}],
				toNotesPage : [{ // What is added to the notes page
					name : SpellsList["inquisitive eye"].name,
					note : desc(SpellsList["inquisitive eye"].descriptionFull),
					amendTo : "Runecarver Exploits"
				}],
				action : [["reaction", " (invoke)"]],
				additional : "invoke",
				usages : 1,
				recovery : "short rest"
			},
			"hill rune (prereq: level 7 fighter)" : {
				name : "Hill Rune",
				source : [["GMB:LL", 0]],
				description : desc([
					"I learn the Brace Up exploit",
					"As a bonus action, I can invoke it to gain resistance to bludg/slash/pierc damage for 1 min",
					"When I use Runic Might, I can invoke this Rune as part of that same bonus action"
				]),
				spellcastingBonus : [{ // What is added to the spellcasting sheet
					name : "Hill Rune Exploit",
					spellcastingAbility : 1,
					spells : ["brace up"],
					selection : ["brace up"],
					firstCol: 'atwill'
				}],
				toNotesPage : [{ // What is added to the notes page
					name : SpellsList["brace up"].name,
					note : desc(SpellsList["brace up"].descriptionFull),
					amendTo : "Runecarver Exploits"
				}],
				prereqeval : function(v) { return classes.known["fighter(laserllama)"].level >= 7; },
				action : [["bonus action", " (invoke)"]],
				additional : "invoke",
				usages : 1,
				recovery : "short rest"
			},
			"storm rune (prereq: level 7 fighter)" : {
				name : "Storm Rune",
				source : [["T", 45]],
				description : desc([
					"I learn the Scholarly Recall exploit",
					"As a bonus action, I can invoke it to enter a prophetic state for 1 min or till incapacitated",
					"While in this state, I can use a reaction to add or substract a roll of my Exploit Die from a roll",
					"I can do this for attacks, saves, and checks of myself or others I can see within 30 ft of me"
				]),
				spellcastingBonus : [{ // What is added to the spellcasting sheet
					name : "Storm Rune Exploit",
					spellcastingAbility : 1,
					spells : ["scholarly recall"],
					selection : ["scholarly recall"],
					firstCol: 'atwill'
				}],
				toNotesPage : [{ // What is added to the notes page
					name : SpellsList["scholarly recall"].name,
					note : desc(SpellsList["scholarly recall"].descriptionFull),
					amendTo : "Runecarver Exploits"
				}],
				prereqeval : function(v) { return classes.known["fighter(laserllama)"].level >= 7; },
				action : [["bonus action", " (invoke)"]],
				additional : "invoke",
				usages : 1,
				recovery : "short rest"
			}
		},
		"subclassfeature3.2" : {
			name : "Giant's Might",
			source : [["GMB:LL", 0]],
			minlevel : 3,
			description : desc([
				"As a bonus action, I can imbue myself with runic magic for 1 minute and gain benefits:",
				" \u2022 Space permitted, I grow to a larger size category along with everything I'm wearing",
				" \u2022 Once per turn, I can get a bonus equal to my Exploit Die for a Strength-based check, saving throw or weapon damage roll",
			]),
			additional : levels.map(function (n) {
				return n < 3 ? "" : (n < 18 ? "Large" : "Huge") + ", +1d" + (n < 5 ? 6 : n < 11 ? 8 : n < 17 ? 10 : 12) + " bonus"
			}),
			action : [["bonus action", ""]],
			usages : "Con mod per ",
			usagescalc : "event.value = Math.max(1, What('Con Mod'));",
			recovery : "long rest",
			calcChanges : {
				atkAdd : [
					function (fields, v) {
						if (classes.known["fighter(laserllama)"] && classes.known["fighter(laserllama)"].level >= 3 && v.isWeapon && (/giant('s)? might/i).test(v.WeaponTextName)) {
							n = classes.known["fighter(laserllama)"].level;
							var GMdmgDie = (n < 5 ? 'd6' : n < 11 ? 'd8' : n < 17 ? 'd10' : 'd12');

							var dmgDieRx = RegExp('(\\d+)' + GMdmgDie, 'i');
							if (dmgDieRx.test(fields.Damage_Die)) {
								var dmgDieMatch = fields.Damage_Die.match(dmgDieRx);
								fields.Damage_Die = fields.Damage_Die.replace(dmgDieRx, Number(dmgDieMatch[1]) + 1 + GMdmgDie);
								fields.Description = fields.Description.replace(/Versatile \((\d+d\d+)\)/i, 'Versatile ($1+1' + GMdmgDie + ')');
							} else if (!isNaN(fields.Damage_Die)) {
								fields.Damage_Die = 1 + GMdmgDie + "+" + fields.Damage_Die;
							} else {
								fields.Description += (fields.Description ? '; ' : '') + '+1' + GMdmgDie + ' damage';
							}
							if (classes.known["fighter(laserllama)"].level >= 18 && v.isMeleeWeapon) fields.Description += (fields.Description ? '; ' : '') + '+5 ft reach';
						};
					},
					"If I include the words \"Giant Might\" in the name of a weapon or unarmed strike, it gets treated as a weapon that I use while imbued by my Giant's Might feature. It adds my Exploit Die to damage and if I am above lvl 18, my reach increases by 5 ft (for melee weapons).",
					8
				]
			}
		},
		"subclassfeature7" : {
			name : "Runic Ward",
			source : [["GMB:LL", 0]],
			minlevel : 7,
			description : desc([
				"As a reaction when I see a creature within 30 ft get hit by an attack, I can protect it",
				"I add my Constitution modifier (min of +1) to the target's AC against that attack"
			]),
			action : [["reaction", ""]],
			usages : "Con mod per ",
			usagescalc : "event.value = Math.max(1, What('Con Mod'));",
			recovery : "long rest",
		},
		"subclassfeature10" : {
			name : "Unyielding",
			source : [["GMB:LL", 0]],
			minlevel : 10,
			description : desc(["Adv. on saves vs moved against my will, knocked prone, poisoned, or stunned"]),
			savetxt : { 
				text : ["Adv. on saves vs moved against my will, knocked prone, poisoned, or stunned"]
			},
		},
		"subclassfeature15" : {
			name : "Ancient Insight",
			source : [["GMB:LL", 0]],
			minlevel : 15,
			description : desc(["When I have no uses of a Rune remaining, I can expend one Exploit Die to invoke that Rune"])
		},
		"subclassfeature18" : {
			name : "Legendary Rune Carver",
			source : [["GMB:LL", 0]],
			minlevel : 18,
			description : desc(["When I use Runic Might, I can become Huge, so long as there is room for me to grow", "While Huge, my reach increases by 5 feet"])
		}
	}
})

// Shadow dancer (echo knight)
AddSubClass("fighter(laserllama)", "shadowdancer", {
	regExpSearch : /^(?=.*shadow)(?=.*dancer).*$/i,
	subname : "Shadowdancer",
	fullname : "Shadowdancer",
	source : [["GMB:LL", 0]],
	features : {
		"subclassfeature3" : GetSubclassExploits("Shadowdancer", ["feint", "lightstep", "dirty hit", "whirlwind strike", "heroic focus"]),
		"subclassfeature3.1" : {
			name : "Conjure Shade",
			source : [["GMB:LL", 0]],
			minlevel : 3,
			description : desc([
				"As a bonus action, I can magically manifest a translucent image of myself within 15 ft",
				"My shade lasts until I dismiss it as a bonus action, I manifest another, or I'm incapacitated",
				"It is also destroyed if it is more than 30 ft away from me at the end of my turn",
				"It has 1 HP, immunity to all conditions, uses my save bonuses, and AC 14 + Cha modifier",
				"On my turn as a free action, I can command it to move up to 30 ft in any direction",
				"When I use the Attack action on my turn, I can have any attack originate from my echo",
				"I can also make opportunity attacks from the echo's location as if I were in its space"
			]),
			action: [["bonus action", " (summon/dismiss)"]],
			creaturesAdd : [["Shade"]],
			creatureOptions : [{
				name : "Shade",
				source : [["W", 183]],
				size : 3,
				type : "Undead",
				alignment : "",
				ac : "14+oCha",
				hp : 1,
				hd : [],
				speed : "30 ft",
				scores : ["", "", "", "", "", ""],
				savesLinked : true,
				condition_immunities : "all conditions",
				passivePerception : 0,
				senses : "",
				languages : "Understands all the languages you know, but it cannot speak",
				challengeRating : "0",
				proficiencyBonus : 0,
				attacksAction : 0,
				attacks : [],
				features : [{
					name : "Dark Bond",
					description : "If the Shade is forced to make a saving throw, it uses my saving throw bonus for the roll"
				}, {
					name : "Incorporeal Echo",
					description : "The Shade has no physical presence and counts as difficult terrain for creatures that move through its space. It cannot hold or interact with any objects, nor can it attune to or use any magic items."
				}],
				traits : [{
					name : "Swap Place",
					description : "The shade's creator can, as a bonus action, teleport, magically swapping places with the shade, if it is within 30 feet."
				}, {
					name : "Umbral Guardian",
					description : "When the shade's creator takes the Attack action on their turn, any attack they make with that action can originate from the echo's space. This choice is made for each attack separately.\n   In addition, when a creature would provoke an opportunity attack from the shade, its creator can use their reaction to make an opportunity attack against that creature as if its creator was in the shade's space."
				}],
				notes: [{
					name : "The shade is a magical, translucent, gray image of its creator that shares its creator's turn in",
					description : "combat, but it cannot act on its own.",
					joinString: " "
				}, {
					name : "It lasts until it is destroyed, dismissed or another is",
					description : "manifested.",
					joinString: " "
				}, {
					name : "The shade is also destroyed if it is ever more than 30 ft away from its creator at the end of its creator's",
					description : "turn.",
					joinString: " "
				}],
				header : "Shade",
				eval : function(prefix, lvl) {
					// Same size as character
					PickDropdown(prefix + "Comp.Desc.Size", tDoc.getField("Size Category").currentValueIndices);
					Value(prefix + "Comp.Desc.Age", What("Age"));
					Value(prefix + "Comp.Desc.Sex", What("Sex"));
					Value(prefix + "Comp.Desc.Height", What("Height"));
					Value(prefix + "Comp.Desc.Alignment", What("Alignment"));
				}
			}]
		},
		"subclassfeature3.2" : {
			name : "Dance of Shadows",
			source : [["GMB:LL", 0]],
			minlevel : 3,
			description : desc(["As a bonus action, if my Shade is within 30 ft of me, I can teleport to swap places with it"]),
			action : ["bonus action", "Swap Location with Shade"]
		},
		"subclassfeature7" : {
			name : "Shade Strike",
			source : [["GMB:LL", 0]],
			minlevel : 7,
			description : desc([
				"When I use the Dance of Shadows, I can make one extra melee attack from my or my shade's position",
				"When I have no uses left, I can expend an Exploit Die as part of Dance of Shadows to make this bonus attack again"
			]),
			usages : "Charisma modifier per ",
			usagescalc : "event.value = Math.max(1, What('Cha Mod'));",
			recovery : "short rest"
		},
		"subclassfeature7.1" : {
			name : "Umbral Voyage",
			source : [["GMB:LL", 0]],
			minlevel : 7,
			description : desc([
				"As an action, I can temporarily transfer my consciousness to my shade for up to 10 min",
				"During this time, I see and hear through its eyes and ears, but not my own eyes and ears",
				"While I use my shade this way, it can be up to 1 mile away from me without issue",
				"It ends early if my Shade is destroyed. or I use your bonus action to end it"
			]),
			action : [["action", ""]]
		},
		"subclassfeature10" : {
			name : "Dark Sacrifice",
			source : [["GMB:LL", 0]],
			minlevel : 10,
			description : desc([
				"As a reaction when a creature within 10 ft of my shade is hit, I can make my shade the target",
				"The damage that the target would take is reduced by an amount equal to my Fighter level, causing my Shade to take the damage instead"
			]),
			action : [["reaction", ""]]
		},
		"subclassfeature15" : {
			name : "Restorative Shadows",
			source : [["GMB:LL", 0]],
			minlevel : 15,
			description : desc([
				"When my echo is destroyed by taking damage, I can use my reaction to regain temp HP",
				"I gain temporary hit points equal to one roll of my Exploit Die + my Charisma modifier"
			])
		},
		"subclassfeature18" : {
			name : "Legendary Shadowdancer",
			source : [["GMB:LL", 0]],
			minlevel : 18,
			description : desc([
				"I can now manifest two echoes instead of one with the same bonus action",
				"These two can coexist, but if I manifest a third, the previous two are destroyed",
				"Anything I can do from one echo's position can be done from the other's instead"
			])
		}
	}
});

// Sylvan archer (arcane archer)
AddSubClass("fighter(laserllama)", "sylvan archer", {
	regExpSearch : /^(?=.*sylvan)(?=.*archer).*$/i,
	subname : "Sylvan Archer",
	fullname : "Sylvan Archer",
	source : [["GMB:LL", 0]],
	abilitySave : 1,
	abilitySaveAlt : 2,
	features : {
		"subclassfeature3" : GetSubclassExploits("Sylvan Archer", ["precision strike", "rustic intuition", "martial focus", "volley", "thunderous shot"]),
		"subclassfeature3.1" : {
			name : "Sylvan Lore",
			source : [["GMB:LL", 0]],
			minlevel : 3,
			description : desc([
				"I gain proficiency in Nature and can make Wis (Nature) checks instead of Int (Nature)",
				"I learn Sylvan and druidcraft, I can cast druidcraft with Wis and an ammunition as focus"
				]),
			languageProfs : ["Sylvan"],
			skills : ["Nature"],
			addMod : { type : "skill", field : "Nature", mod : "max(Wis-Int|0)", text : "I can replace Intelligence (Nature) checks with Wisdom (Nature)" },
			spellcastingBonus : {
				name : "Sylvan Lore",
				spells : ["druidcraft"],
				selection : ["druidcraft"],
				firstCol : "atwill",
				spellcastingAbility : 5
			},
			spellChanges : {
				"druidcraft" : {
					components : "V,S,M",
					compMaterial : "A piece of ammunition",
					changes : "With Sylvan Lore, I can cast druidcraft with my Wisdom and an ammunition as focus"
				}
			}
		},
		"subclassfeature3.2" : {
			name : "Enchanted Arrows",
			source : [["GMB:LL", 0]],
			minlevel : 3,
			description : desc([
				"I can unleash magical effects when I hit a creature from a ranged weapon",
				"I know a number of Arcane Shot Options and learn additional at certain levels",
				"If I have no uses left, I can expend an Exploit Die to use it again",
				"The DC for my Enchanted Shots is my Exploit Die DC"
			]),
			usages : "Wis mod per ",
			usagescalc : "event.value = Math.max(1, What('Wis Mod'));",
			recovery : "long rest",
			altResource : "ED",
			additional : levels.map( function(n) { return n < 3 ? "" : (n < 7 ? 2 : n < 10 ? 3 : n < 15 ? 4 : n < 18 ? 5 : 6) + " options known"; }),
			extraname : "Enchanted Shots Options",
			extrachoices : ["Beguiling Shot", "Bursting Shot", "Enfeebling Shot", "Grasping Shot", "Piercing Shot", "Seeking Shot", "Shadow Shot",
				"Banishing Shot", "Severing Shot", "Technical Shot", "Transposing Shot"],
			extraTimes : levels.map(function (n) {
				return n < 3 ? 0 : n < 7 ? 2 : n < 10 ? 3 : n < 15 ? 4 : n < 18 ? 5 : 6;
			}),
			"beguiling shot" : {
				name : "Beguiling Shot",
				source : [["GMB:LL", 0]],
				description : levels.map( function(n) {
					if (n < 3) return "";
					if (n < 7) return desc([
							"The target must succeed on a Wisdom save or takes psychic damage",
							"If failed, it is charmed by a creature of my choice",
							"This lasts until my next turn starts or anyone attacks or damages the target in any way"
						]);
					return desc([
							"The target must succeed on a Wisdom save or takes psychic damage (half on success)",
							"If failed, it is charmed by a creature of my choice",
							"This lasts until my next turn starts or anyone attacks or damages the target in any way"
						]);
				}),
				additional : levels.map( function(n) {
					const expldie = ['', "d6", "d6", "d6", "d8", "d8", "d8", "d8", "d8", "d8", "d10", "d10", "d10", "d10", "d10", "d10", "d12", "d12", "d12", "d12"];
					if (n < 3) return "";
					if (n < 18) return "+2" + expldie[n] + " psychic damage";
					return "+2d12 psychic & +1d12 force dmg";
				})
			},
			"bursting shot" : {
				name : "Bursting Shot",
				source : [["GMB:LL", 0]],
				description : levels.map( function(n) {
					if (n < 3) return "";
					if (n < 7) return desc([
							"The creature and any other creature within 10 ft of it must succeed on a Dex saving throw",
							"If failed, they take (my choice) acid, cold, fire, lightning, poison, or thunder damage"
						])
					return desc([
							"The creature and any other creature within 10 ft of it must succeed on a Dex saving throw",
							"If failed, they take (my choice) acid, cold, fire, lightning, poison, or thunder damage (half on success)"
						]);
				}),
				additional : levels.map( function(n) {
					const expldie = ['', "d6", "d6", "d6", "d8", "d8", "d8", "d8", "d8", "d8", "d10", "d10", "d10", "d10", "d10", "d10", "d12", "d12", "d12", "d12"];
					if (n < 3) return "";
					if (n < 18) return "+2" + expldie[n] + " (my choice) damage";
					return "+2d12 (my choice) & +1d12 force dmg";
				})
			},
			"enfeebling shot" : {
				name : "Enfeebling Shot",
				source : [["GMB:LL", 0]],
				description : levels.map( function(n) {
					if (n < 3) return "";
					if (n < 7) return desc([
							"The target must succeed on a Constitution save or takes necrotic damage",
							"If failed, the damage of its weapon attacks is halved for 1 minute",
							"The creature can repeat this saving throw at the start of each of its turns, ending this effect on a success"
						]);
					return desc([
							"The target must succeed on a Constitution save or takes necrotic damage (half on success)",
							"If failed, the damage of its weapon attacks is halved for 1 minute",
							"The creature can repeat this saving throw at the start of each of its turns, ending this effect on a success"
						]);
				}),
				additional : levels.map( function(n) {
					const expldie = ['', "d6", "d6", "d6", "d8", "d8", "d8", "d8", "d8", "d8", "d10", "d10", "d10", "d10", "d10", "d10", "d12", "d12", "d12", "d12"];
					if (n < 3) return "";
					if (n < 18) return "+2" + expldie[n] + " necrotic damage";
					return "+2d12 necrotic & +1d12 force dmg";
				})
			},
			"grasping shot" : {
				name : "Grasping Shot",
				source : [["GMB:LL", 0]],
				description : levels.map( function(n) {
					if (n < 3) return "";
					if (n < 7) return desc([
							"The target must succeed on a Dexterity save or takes poison damage",
							"If failed, its speed is halved for 1 minute and it takes additional piercing dmg the first time it moves",
							"A creature can use its action to make a Strength check, removing the thorns on a success"
						]);
					return desc([
							"The target must succeed on a Dexterity save or takes poison damage (half on success)",
							"If failed, its speed is halved for 1 minute and it takes additional piercing dmg the first time it moves",
							"A creature can use its action to make a Strength check, removing the thorns on a success"
						]);
				}),
				additional : levels.map( function(n) {
					const expldie = ['', "d6", "d6", "d6", "d8", "d8", "d8", "d8", "d8", "d8", "d10", "d10", "d10", "d10", "d10", "d10", "d12", "d12", "d12", "d12"];
					if (n < 3) return "";
					if (n < 18) return "+2" + expldie[n] + " poison/pierc damage";
					return "+2d12 poison/pierc & +1d12 force dmg";
				})
			},
			"piercing shot" : {
				name : "Piercing Shot",
				source : [["GMB:LL", 0]],
				description : levels.map( function(n) {
					if (n < 3) return "";
					if (n < 7) return desc([
							"The creature and any creature directly behind it in a straight line out to 30 ft must succeed on a Dex saving throw",
							"If failed, they take force damage"
						])
					return desc([
							"The creature and any creature directly behind it in a straight line out to 30 ft must succeed on a Dex saving throw",
							"If failed, they take force damage (half on success)"
						]);
				}),
				additional : levels.map( function(n) {
					const expldie = ['', "d6", "d6", "d6", "d8", "d8", "d8", "d8", "d8", "d8", "d10", "d10", "d10", "d10", "d10", "d10", "d12", "d12", "d12", "d12"];
					if (n < 3) return "";
					if (n < 18) return "+2" + expldie[n] + " force damage";
					return "+3d12 force dmg";
				})
			},
			"seeking shot" : {
				name : "Seeking Shot",
				source : [["GMB:LL", 0]],
				description : levels.map( function(n) {
					if (n < 3) return "";
					if (n < 7) return desc([
							"I don't roll for the attack, but I choose a target I have seen in the last minute",
							"The seeking arrow moves around corners, obstacles, and ignores cover to hit the target",
							"The target must succeed on a Dex saving throw or be hit if there is a path within range",
							"If failed, I learn its location and it takes force damage"
						])
					return desc([
							"I don't roll for the attack, but I choose a target I have seen in the last minute",
							"The seeking arrow moves around corners, obstacles, and ignores cover to hit the target",
							"The target must succeed on a Dex saving throw or be hit if there is a path within range",
							"If failed, I learn its location and it takes force damage (half on success)"
						]);
				}),
				additional : levels.map( function(n) {
					const expldie = ['', "d6", "d6", "d6", "d8", "d8", "d8", "d8", "d8", "d8", "d10", "d10", "d10", "d10", "d10", "d10", "d12", "d12", "d12", "d12"];
					if (n < 3) return "";
					if (n < 18) return "+2" + expldie[n] + " force damage";
					return "+3d12 force dmg";
				})
			},
			"shadow shot" : {
				name : "Shadow Shot",
				source : [["GMB:LL", 0]],
				description : levels.map( function(n) {
					if (n < 3) return "";
					if (n < 7) return desc([
							"The target must succeed on an Intelligence save or takes psychic damage",
							"If failed, it is blinded for 1 minute",
							"The creature can repeat this saving throw at the start of each of its turns, ending this effect on a success"
						]);
					return desc([
							"The target must succeed on an Intelligence save or takes psychic damage (half on success)",
							"If failed, it is blinded for 1 minute",
							"The creature can repeat this saving throw at the start of each of its turns, ending this effect on a success"
						]);
				}),
				additional : levels.map( function(n) {
					const expldie = ['', "d6", "d6", "d6", "d8", "d8", "d8", "d8", "d8", "d8", "d10", "d10", "d10", "d10", "d10", "d10", "d12", "d12", "d12", "d12"];
					if (n < 3) return "";
					if (n < 18) return "+2" + expldie[n] + " psychic damage";
					return "+2d12 psychic & +1d12 force dmg";
				})
			},
			// 10th level prereq
			"banishing shot" : {
				name : "Banishing Shot",
				source : [["GMB:LL", 0]],
				description : desc([
					"The target makes a Charisma save or is banished to a harmless demiplane for 1 minute",
					"On each of its turns while it is banished, the creature can use its action to repeat the saving throw, ending the effect on a success",
					"When it ends, it reappears in the space it was banished from, or the closest unoccupied space"
				]),
				submenu : "[fighter level 10+]",
				prereqeval : function(v) { return classes.known["fighter(laserllama)"].level >= 10; },
				additional : levels.map( function(n) { return n < 18 ? "" : "+1d12 force damage"; })
			},
			"severing shot" : {
				name : "Severing Shot",
				source : [["GMB:LL", 0]],
				description : desc([
					"The target makes a Charisma save or take force dmg and be unable to cast spells",
					"The creature can repeat this saving throw at the start of each turn, ending the effect on a success"
				]),
				submenu : "[fighter level 10+]",
				prereqeval : function(v) { return classes.known["fighter(laserllama)"].level >= 10; },
				additional : levels.map( function(n) {
					const expldie = ['', "d6", "d6", "d6", "d8", "d8", "d8", "d8", "d8", "d8", "d10", "d10", "d10", "d10", "d10", "d10", "d12", "d12", "d12", "d12"];
					if (n < 3) return "";
					if (n < 18) return "+2" + expldie[n] + " force damage";
					return "+3d12 force dmg";
				})
			},
			"technical shot" : {
				name : "Technical Shot",
				source : [["GMB:LL", 0]],
				description : desc([
					"The target makes a Dexterity save or suffer the effects of one Martial Exploit I know",
					"I can use this Enchanted Shot to deliver the effects of Exploits that normally require me to hit with a melee weapon attack"
				]),
				submenu : "[fighter level 10+]",
				prereqeval : function(v) { return classes.known["fighter(laserllama)"].level >= 10; },
				additional : levels.map( function(n) { return n < 18 ? "" : "+1d12 force damage"; })
			},
			"transposing shot" : {
				name : "Transposing Shot",
				source : [["GMB:LL", 0]],
				description : desc([
					"The target makes a Charisma save or takes force damage (half on success)",
					"If failed, it instantly switches places with me (no opportunity attacks with this movement)"
				]),
				submenu : "[fighter level 10+]",
				prereqeval : function(v) { return classes.known["fighter(laserllama)"].level >= 10; },
				additional : levels.map( function(n) {
					const expldie = ['', "d6", "d6", "d6", "d8", "d8", "d8", "d8", "d8", "d8", "d10", "d10", "d10", "d10", "d10", "d10", "d12", "d12", "d12", "d12"];
					if (n < 3) return "";
					if (n < 18) return "+2" + expldie[n] + " force damage";
					return "+3d12 force dmg";
				})
			},

		},
		"subclassfeature7" : {
			name : "Sylvan Shot",
			source : [["GMB:LL", 0]],
			minlevel : 7,
			description : desc([
				"My ranged weapon attacks count as magical",
				"Once per turn when I miss with a ranged weapon attack, I can use my reaction to redirect it",
				"I reroll the attack against a different target within range of my weapon"
			]),
			action : ["reaction", " (reroll attack)"]
		},
		"subclassfeature15" : {
			name : "Enchanted Quiver",
			source : [["GMB:LL", 0]],
			minlevel : 15,
			description : desc([
				"Whenever I make a ranged attack I can conjure a magical ammunition as part of the attack",
				"After the attack, hit or miss, this ammunition vanishes",
				"Also, when I roll initiative, I regain one expended use of my Enchanted Shots"
			])
		},
		"subclassfeature18" : {
			name : "Legendary Sylvan Archer",
			source : [["GMB:LL", 0]],
			minlevel : 18,
			description : desc([
				"Whenever I use an Enchanted Shot it deals additional force damage equal to my Exploit Die",
				"Also, when I use an Enchanted Shot I can empower it, causing creatures of my choice within 20 ft to suffer the effects of the Shot along with the target"
			]),
			additional : "Empowered shot",
			recovery : "long rest",
			usages : 1
		}
	}
})

// Feats
FeatsList["alternate defensive duelist"] = {
	name : "Alternate Defensive Duelist",
	source : [["GMB:LL"]],
	descriptionFull : "When a creature you can see hits you with a melee attack while you are wielding a finesse weapon you are proficient with, you can use a reaction to add your Dexterity modifier (minimum of +1) to your Armor Class against that attack. If this bonus to your Armor Class would cause the attack to miss, you can make an attack with that finesse weapon against the attacker as part of the same reaction.",
	description : "When wielding a finesse weapon with which I am proficient and another creature hits me with a melee attack, I can use my reaction to add my Dexterity modifier to my AC for that attack. If this causes the attack to miss me, I can make an attack with it as part of the reaction.",
	prerequisite : "Dexterity 13 or higher",
	prereqeval : function(v) { return What('Dex') >= 13; },
	action : ["reaction", " (when hit in melee)"]
};

FeatsList["alternate weapon master"] = {
	name : "Alternate Weapon Master",
	source : [["GMB:LL"]],
	descriptionFull : "You have practiced extensively with a variety of weapons, gaining the following benefits:\n \u2022 Increase your Strength or Dexterity score by 1, to a maximum of 20.\n \u2022 You gain proficiency with all simple and martial weapons.\n \u2022 If you are already proficient with all simple and martial weapons, you can instead choose four types of weapons. Whenever you make a weapon attack with one of those weapons, you can treat a roll equal to your proficiency bonus or lower on the d20 as your proficiency bonus.",
	description : "I gain proficiency with all simple or martial weapons of my choice. If I'm already proficient with all, I instead choose 4 weapons with which I can treat a result on the d20 as my Prof Bonus. [+1 Strength or Dexterity]",
	weaponProfs: [true, true],
	scorestxt : "+1 Strength or Dexterity"
};

FeatsList["masterful technique"] = {
	name : "Masterful Technique",
	source : [["GMB:LL"]],
	descriptionFull : "You have learned to change your fighting stance to best meet the challenges you face. You gain the following benefits: You increase your Strength, Dexterity, or Constitution score by 1, to a maximum of 20. You learn one Fighting Style of your choice from those available to the Alternate Fighter. However, you can only benefit from the effects of one Fighting Style you know. As a bonus action, you can switch your current Fighting Style to another Fighting Style that you know.",
	description: 'I learn an additional Fighting Style but can only benefit from one at a time. I can switch between Fighting Styles I know as a bonus action. ' + "[+1 " + (typePF ? "Str, Dex or Con" : "Strength, Dexterity or Constitution") + "]",
	bonusClassExtrachoices : [{
		"class" : "fighter(laserllama)",
		"subclass" : "fighter(laserllama)-master at arms",
		feature : "subclassfeature3",
		bonus : 1
	}],
	action: [["bonus action", "Change fighting style"]],
	prerequisite : "At least one Fighting Style known",
	prereqeval : function (v) { return classes.known["fighter"] || classes.known["fighter(laserllama)"] || (classes.known["ranger"] && classes.known["ranger"].level >= 2) || (classes.known["paladin"] && classes.known["paladin"].level >= 2)}, 
	// NOTE: The prerequesite is not exhaustive. It is probably possible to make it dynamically instead of hard-coded, but I don't think it's worth the time investment since you can bypass it anyways.
	scorestxt : "+1 Strength, Dexterity or Constitution"
};

FeatsList["signature technique"] = {
	name : "Signature Technique",
	source : [["GMB:LL"]],
	descriptionFull : "You have practiced and mastered a single technique so you can use it at will. Choose one 1st-degree Exploit you know is on the Fighter's list of Martial Exploits that forces a creature to make a saving throw or deals damage. Once on each of your turns, you can use this Signature Exploit, rolling a d4 in place of expending an Exploit Die. You can choose this Feat more than once, however, you are always limited to one Signature Exploit per turn.",
	description : "I mastered a single 1st-degree Exploit and can use it every turn, using a d4 instead of expending an Exploit Die. It has to be an exploit I know which causes damage or a saving throw.",
	prerequisite : "At least one Martial Exploit Known",
	allowDuplicates : true,
	prereqeval : function(v) { return GetFeatureChoice('classes', 'fighter(laserllama)', 'martial exploits', true).length >= 1 }
};

FeatsList["signature weapon"] = {
	name : "Signature Weapon",
	source : [["GMB:LL"]],
	descriptionFull : "You specialize in a single weapon, gaining benefits: +1 to Str, Dex, or Con (max 20), choose a proficient weapon as your Signature Weapon, its damage die increases by one size; when rolling a 1 on its damage die, reroll (use the new roll, even if it's another 1).",
	description : "I specialize in a single weapon (in which I'm already proficient), gaining benefits: its damage die increases by one size; Reroll 1 on damage. Add 'signature' to the attack name to include the bonus. " + "[+1 " + (typePF ? "Str, Dex or Con" : "Strength, Dexterity or Constitution") + "]",
	scorestxt : "+1 Strength, Dexterity or Constitution",
	calcChanges : {
		atkAdd : [
			function (fields, v) {
				if (!v.isSpell && !v.isDC && fields.Proficiency && (/\bsignature\b/i).test(v.WeaponTextName)) {
					fields.Description += (fields.Description ? '; ' : '') + "Re-roll 1 on damage die"

					switch (fields.Damage_Die) {
					  case '1':
					    fields.Damage_Die = '1d4'
					    break;
					  case '1d4':
					  	fields.Damage_Die = '1d6'
					  	break;
					  case '1d6':
					  	fields.Damage_Die = '1d8'
					  	break;
					  case '2d4':
					  case '1d8':
					    fields.Damage_Die = '1d10'
					    break;
					  case '1d10':
					  	fields.Damage_Die = '1d12'
					  	break;
					  case '1d12':
					  case '2d6':
					    fields.Damage_Die = '2d6';
					    fields.Damage_Bonus += 1;
					    break;
					  default:
					    break;
					}
				}
			},
			"My Signature Weapon's damage die increases by one size; Reroll 1 on damage",
			750
		]
	}
};

FeatsList["martial training"] = {
	name : "Martial Training",
	source : [["GMB:LL"]],
	descriptionFull : "You have studied combat techniques that allow you to perform Martial Exploits. You gain the following benefits: You learn two 1st-degree Martial Exploits of your choice from those available to the Alternate Fighter. If an Exploit you use requires the target to make a saving throw to resist the effects, the DC is equal to 8 + your proficiency bonus + your Strength or Dexterity modifier (your choice). You gain two d4 Exploit Dice to fuel your Exploits. An Exploit Die is expended when you use it. You regain all of your Exploit Dice when you finish a short or long rest. If you already have Exploit Dice from another source, you only gain one Exploit Die equal to your other Exploit Dice.",
	description : "",
	calculate : "event.value = 'I learn two maneuvers of my choice from those available to the Fighter (2nd page \"Choose Feature\" button). The saving throw DC for this is ' + (8 + Number(How('Proficiency Bonus')) + Math.max(Number(What('Str Mod')), Number(What('Dex Mod')))) + ' (8 + proficiency bonus + Str/Dex mod). I gain two (only one if already have Exploit Die) Exploit dice (d4), which I regain when I finish a short rest.';",
	bonusClassExtrachoices : [{
		"class" : "fighter(laserllama)",
		"feature" : "martial exploits",
		"bonus" : 2
	}],
	extraLimitedFeatures : [{
		name : "Martial Exploits",
		usages : 2, // I don't think it's easily doable to check for the condition soooo just gonna leave it like that
		additional : 'd4',
		recovery : "short rest",
		addToExisting : true
	}]
};

// Add the fighting initiate only when all other code has run, so that we get fighting styles added by the code
RunFunctionAtEnd(function() {
	if (!ClassList["fighter(laserllama)"] || !ClassList["fighter(laserllama)"].features["fighting style"]) return;
	var FtngStyles = ClassList["fighter(laserllama)"].features["fighting style"];

	FeatsList["alternate fighting initiate"] = {
		name : "Alternate Fighting Initiate",
		source : [["GMB:LL"]],
		descriptionFull : "Your martial training has helped you develop a particular style of fighting. As a result, you learn one Fighting Style option of your choice from the fighter class. If you already have a style, the one you choose must be different.\n   Whenever you reach a level that grants the Ability Score Improvement feature, you can replace this feat's fighting style with another one from the alternate fighter class that you don't have.",
		description: "I learn one Fighting Style from the alternate fighter class, which must be one that I don't yet know. I can replace this fighting style for another whenever I gain an Ability Score Improvement.",
		prerequisite: "Proficiency with a martial weapon",
		prereqeval : function(v) {
			return v.martialWeaponsProf || v.otherWeaponsProf.some(function (n) {
				return WeaponsList[n] && (/Martial/i).test(WeaponsList[n].type);
			});
		},
		choices : []
	};

	FtngStyles.choices.forEach(function (sName) {
		var sNameLC = sName.toLowerCase();
		if (!FtngStyles[sNameLC]) return;
		FeatsList["alternate fighting initiate"].choices.push(sName);

		if (!FeatsList["alternate fighting initiate"][sNameLC]) {
			FeatsList["alternate fighting initiate"][sNameLC] = {
				description : FtngStyles[sNameLC].description.replace(/^\n   /i, '').replace(/\n   /g, '. ') + ". I can replace this fighting style whenever I gain an ASI.",
				source : FtngStyles[sNameLC].source ? FtngStyles[sNameLC].source : FtngStyles.source
			}
		}

		// Copy all attributes except name, source and description
		for (var attr in FtngStyles[sNameLC]) {
			if ((/\b(name|description|source)\b/i).test(attr)) continue;
			FeatsList["alternate fighting initiate"][sNameLC][attr] = FtngStyles[sNameLC][attr];
		}
		if (!FeatsList["alternate fighting initiate"][sNameLC].prereqeval) {
			FeatsList["alternate fighting initiate"][sNameLC].prereqeval = function(v) {
				var knownStyles = GetFightingStyleSelection();
				return knownStyles[v.choice] ? false : true;
			};
			if (!FeatsList["alternate fighting initiate"][sNameLC].prerequisite) FeatsList["alternate fighting initiate"][sNameLC].prerequisite = sName + " Fighting Style is not selected anywhere else."
		};
	});

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
