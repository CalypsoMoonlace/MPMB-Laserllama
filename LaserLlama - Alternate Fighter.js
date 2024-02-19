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
				note : desc(["Below are my " + subclass_name + " exploits"])
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
		var NewSpell = SubclassExploits.autoSelectExtrachoices[i].extrachoice;

		SubclassExploits[NewSpell] = {
			name: SpellsList[NewSpell].name,
			toNotesPage : [{ // What is added to the notes page
				name : SpellsList[NewSpell].name + " Exploit",
				note : desc(SpellsList[NewSpell].descriptionFull),
				amendTo : SubclassExploits.name
			}],
			source: SpellsList[NewSpell].source,
			spellcastingBonus : [{ // What is added to the spellcasting sheet
				name : SpellsList[NewSpell].name + " Exploit",
				spellcastingAbility : 1,
				spells : [NewSpell],
				selection : [NewSpell]
			}],
			addMod: SpellsList[NewSpell].addMod,
			submenu: SpellsList[NewSpell].submenu
		};
	}

	return SubclassExploits;
}

// Fighting styles
var FightingStyles = {
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
		description : desc([
			"As a reaction, I can add my prof bonus to AC against an attack made vs. me or someone within 5 ft of me",
			"I need to be wielding a shield or a melee weapon to do this"
		]),
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


// Defining the Fighter spell sheet - also known as Martial exploits
CurrentSpells["fighter(laserllama)"] = {
	name : "Fighter",
	shortname : "Martial Exploits",
	ability: 1,
	bonus : {},
	typeSp:"known",
	refType:"class"
}

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

// Warlord Exploits (for testing Master at Arms)
SpellsList["intimidating command"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[2nd-degree exploits]",
	prereqeval : function(v) { return What('Cha') >= 13},
	// Regular spell attributes
	name : "Intimidating Command",
	classes : ["warlord"],
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
	descriptionFull : "When making a Charisma (Persuasion) or Charisma (Intimidation) check, you can expend one Exploit Die, roll it, and add the result to your ability check after rolling the d20 but before determining success. Additionally, when required to make a Charisma (Intimidation) check, you can opt to make a Strength (Intimidation) check instead."
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

SpellsList["parry & riposte"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[1st-degree exploits (combat)]",
	prereqeval : function(v) { return What('Dex') >= 11},
	// Regular spell attributes
	name : "Parry & Riposte",
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
	descriptionFull : "Whenever you would normally make a Charisma (Deception) or Charisma (Persuasion) check, you can choose to use your Intelligence in place of Charisma for that ability check. Also, whenever you make an Intelligence (Deception) or Intelligence (Persuasion) check you can expend one Exploit Die, roll it, and add the result to your check. You can do so after you roll the d20, but before you know if you succeed."
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
	descriptionFull : "If you are in a settlement, you can make Charisma (History) and Charisma (Investigation) checks instead of the normal Intelligence (History) or Intelligence (Investigation) checks. Also, when you make a Charisma (History) or a Charisma (Investigation) check you can expend one Exploit Die, roll it, and add the result to your ability check. You can do so after you roll the d20, but before you know if you succeed or fail."
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
	components : "W*", // W = weapon
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

// 3rd degree exploits
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
	descriptionFull : "As a bonus action, expend one Exploit Die to enter a heightened state of focus (requires concentration like a spell) for 1 minute or until concentration is lost, gaining doubled speed, +2 Armor Class, advantage on Dexterity saves, and an additional action (usable for specified actions); end with a Constitution saving throw against Exploit save DC or be incapacitated until the end of the next turn; does not stack with haste spell."
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
	subclasses : ["Warrior Archetype", []],
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
			"archery" : FightingStyles.archery,
			"classical swordplay" : FightingStyles.classical,
			"brawler": FightingStyles.brawler,
			"defense" : FightingStyles.defense,
			"dueling" : FightingStyles.dueling,
			"dual wielding" : FightingStyles.dual_wielding,
			"featherweight fighting" : FightingStyles.featherweight,
			"great weapon fighting" : FightingStyles.great_weapon,
			"improvised fighting" : FightingStyles.improvised,
			"melee marksman" : FightingStyles.marksman,
			"protector" : FightingStyles.protector,
			"strongbow" : FightingStyles.strongbow,
			"thrown weapon fighting" : FightingStyles.thrown,
			"versatile fighting" : FightingStyles.versatile,
			"blind warrior" : FightingStyles.blind,
			"heavyweight fighting" : FightingStyles.heavyweight,
			"mariner" : FightingStyles.mariner,
			"mountaineer" : FightingStyles.mountaineer,
			"pit fighting" : FightingStyles.pit,
			"shield warrior" : FightingStyles.shieldwarrior,
			"standard bearer" : FightingStyles.standardbearer,
			"wrestler" : FightingStyles.wrestler
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
					note : desc(["Below are all Martial Exploits I know"])
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
			
			//const DegreeToMinLevel = [0,0,5,9,13,17]
			// Iterate over all Fighter(laserllama) "spells"
			for (var i = 0; i < FighterSpells.length; i++) {
				var NewSpell = SpellsList[FighterSpells[i]];

				MartialExploits.extrachoices.push(NewSpell.name); // Add "spell" name to menu options

				MartialExploits[FighterSpells[i]] = { // Add "spell" to the main item (when it is picked through the menu)
					name: NewSpell.name,
					toNotesPage : [{ // What is added to the notes page
						name : NewSpell.name + " Exploit",
						note : desc(NewSpell.descriptionFull),
						amendTo : "Martial Exploits"
					}],
					source: NewSpell.source,
					spellcastingBonus : [{ // What is added to the spellcasting sheet
						name : NewSpell.name + " Exploit",
						spellcastingAbility : 1,
						spells : [FighterSpells[i]],
						selection : [FighterSpells[i]]
					}],
					addMod: NewSpell.addMod,
					submenu: NewSpell.submenu
				}


				// Matching prereqeval with required Fighter level
				// NOTE: I am doing this ugly copypasted thing because DegreeToMinLevel[NewSpell.level] didn't work, I'm assuming due to lexical scoping but that kinda sucks
				// It's easier for me to do this than spend idk how much time debugging this issue
				if (NewSpell.level == 2) {
					MartialExploits[FighterSpells[i]].prereqeval = function(v) { return classes.known["fighter(laserllama)"].level >= 5 }; 
				}
				if (NewSpell.level == 3) {
					MartialExploits[FighterSpells[i]].prereqeval = function(v) { return classes.known["fighter(laserllama)"].level >= 9 }; 
				}
				if (NewSpell.level == 4) {
					MartialExploits[FighterSpells[i]].prereqeval = function(v) { return classes.known["fighter(laserllama)"].level >= 13 }; 
				}
				if (NewSpell.level == 5) {
					MartialExploits[FighterSpells[i]].prereqeval = function(v) { return classes.known["fighter(laserllama)"].level >= 17 }; 
				}

				// Combining level prereq (defined just above) with spell prereq (defined in the spell itself)
				// Exploit has a prerequisite and a level prerequisite
				if (NewSpell.prereqeval && MartialExploits[FighterSpells[i]].prereqeval) {
					MartialExploits[FighterSpells[i]].prereqeval = (MartialExploits[FighterSpells[i]].prereqeval && NewSpell.prereqeval);
				}
				// Exploit has a prerequisite but no level prerequesite
				if (NewSpell.prereqeval && !MartialExploits[FighterSpells[i]].prereqeval) {
					MartialExploits[FighterSpells[i]].prereqeval = NewSpell.prereqeval;
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
			minlevel : 6,
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

// Subclasses
AddSubClass("fighter(laserllama)", "master at arms", {
	regExpSearch : /^(?=.*master)(?=.*arms).*$/i,
	subname : "Master at Arms",
	fullname : "Master at Arms",
	source : [["GMB:LL", 0]],
	abilitySave : 1,
	abilitySaveAlt : 2,
	features : {

		// NOTE: This overrides martial exploits from the main class and is necessary to update the Exploit Dice size
		// See this for more details: https://canary.discord.com/channels/533350585706217494/863810547584467004/1204723669042069525
		"martial exploits": function() {
			var MEfea = newObj(ClassList["fighter(laserllama)"].features["martial exploits"]);
			MEfea.additional = ['', "d6", "d8", "d8", "d10", "d10", "d10", "d10", "d10", "d10", "d12", "d12", "d12", "d12", "d12", "d12", "d12", "d12", "d12", "d12"];
			return MEfea;
		}(),

		"subclassfeature3" : function(){

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
						note : desc(["Below are my Master at Arms exploits"])
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
						name : NewSpell.name + " Exploit",
						note : desc(NewSpell.descriptionFull),
						amendTo : "Master at Arms Exploits"
					}],
					source: NewSpell.source,
					spellcastingBonus : [{ // What is added to the spellcasting sheet
						name : NewSpell.name + " Exploit",
						spellcastingAbility : 1,
						spells : [FighterSpells[i]],
						selection : [FighterSpells[i]]
					}],
					addMod: NewSpell.addMod,
					submenu: NewSpell.submenu
				}


				// Matching prereqeval with required Fighter level
				// NOTE: I am doing this ugly copypasted thing because DegreeToMinLevel[NewSpell.level] didn't work, I'm assuming due to lexical scoping but that kinda sucks
				// It's easier for me to do this than spend idk how much time debugging this issue
				if (NewSpell.level == 2) {
					MartialExploits[FighterSpells[i]].prereqeval = function(v) { return classes.known["fighter(laserllama)"].level >= 5 }; 
				}
				if (NewSpell.level == 3) {
					MartialExploits[FighterSpells[i]].prereqeval = function(v) { return classes.known["fighter(laserllama)"].level >= 9 }; 
				}

				// Combining level prereq (defined just above) with spell prereq (defined in the spell itself)
				// Exploit has a prerequisite and a level prerequisite
				if (NewSpell.prereqeval && MartialExploits[FighterSpells[i]].prereqeval) {
					MartialExploits[FighterSpells[i]].prereqeval = (MartialExploits[FighterSpells[i]].prereqeval && NewSpell.prereqeval);
				}
				// Exploit has a prerequisite but no level prerequesite
				if (NewSpell.prereqeval && !MartialExploits[FighterSpells[i]].prereqeval) {
					MartialExploits[FighterSpells[i]].prereqeval = NewSpell.prereqeval;
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
						name : NewSpell.name + " Exploit",
						note : desc(NewSpell.descriptionFull),
						amendTo : "Master at Arms Exploits"
					}],
					source: NewSpell.source,
					spellcastingBonus : [{ // What is added to the spellcasting sheet
						name : NewSpell.name + " Exploit",
						spellcastingAbility : 1,
						spells : [FighterSpells[i]],
						selection : [FighterSpells[i]]
					}],
					addMod: NewSpell.addMod,
					submenu: NewSpell.submenu
				}


				// Matching prereqeval with required Fighter level
				// NOTE: I am doing this ugly copypasted thing because DegreeToMinLevel[NewSpell.level] didn't work, I'm assuming due to lexical scoping but that kinda sucks
				// It's easier for me to do this than spend idk how much time debugging this issue
				if (NewSpell.level == 2) {
					MartialExploits[FighterSpells[i]].prereqeval = function(v) { return classes.known["fighter(laserllama)"].level >= 5 }; 
				}
				if (NewSpell.level == 3) {
					MartialExploits[FighterSpells[i]].prereqeval = function(v) { return classes.known["fighter(laserllama)"].level >= 9 }; 
				}
				if (NewSpell.level == 4) {
					MartialExploits[FighterSpells[i]].prereqeval = function(v) { return classes.known["fighter(laserllama)"].level >= 13 }; 
				}
				if (NewSpell.level == 5) {
					MartialExploits[FighterSpells[i]].prereqeval = function(v) { return classes.known["fighter(laserllama)"].level >= 17 }; 
				}

				// Combining level prereq (defined just above) with spell prereq (defined in the spell itself)
				// Exploit has a prerequisite and a level prerequisite
				if (NewSpell.prereqeval && MartialExploits[FighterSpells[i]].prereqeval) {
					MartialExploits[FighterSpells[i]].prereqeval = (MartialExploits[FighterSpells[i]].prereqeval && NewSpell.prereqeval);
				}
				// Exploit has a prerequisite but no level prerequesite
				if (NewSpell.prereqeval && !MartialExploits[FighterSpells[i]].prereqeval) {
					MartialExploits[FighterSpells[i]].prereqeval = NewSpell.prereqeval;
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
	source : [["P", 170]],
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

// Source information
SourceList["GMB:LL"] = {
	name : "LaserLlama",
	abbreviation : "GMB:LL",
	abbreviationSpellsheet : "LL",
	group : "GM Binder",
	url : "https://www.gmbinder.com/profile/laserllama",
	date : "2018/04/22"
}
