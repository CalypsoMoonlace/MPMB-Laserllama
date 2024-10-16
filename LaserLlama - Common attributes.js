/*  -WHAT IS THIS?-
    This file adds optional material to "MPMB's Character Record Sheet" found at https://www.flapkan.com/download#charactersheets
    Import this file using the "Add Extra Materials" bookmark.

    -KEEP IN MIND-
    It is recommended to enter the code in a fresh sheet before adding any other information (i.e. before making your character with it).
	
    -INFORMATION-
    Subject:    Compilation of attributes shared across several of Laserllama's classes which are required to make the other imports work
    			Currently, this includes: Exploits, Spells and Fighting styles

    Effect:     This script adds Laserllama's Exploits as spells (with both regular spell attributes, and some unique attributes, see doc below)
    			It also adds some modified or new spells from LL's spell compendium
    			It also defines a global variable (FightingStylesLL) containing Fighting styles

    			Those exploits were published by Laserllama in GM Binder under the Fan Content policy.
    			Laserllama: https://www.gmbinder.com/profile/laserllama

    			SOURCE FOR MARTIAL EXPLOITS
    			Alternate Fighter: https://www.gmbinder.com/share/-MSfA82gv8V69JAoqFVq
    			Alternate Fighter expanded: https://www.gmbinder.com/share/-MUkP55cdNMTFYMKlDUL
    			Version: 3.2.3

    			SOURCE FOR DEVIOUS EXPLOITS
    			Alternate Rogue: https://www.gmbinder.com/share/-N8o6KduyOA2qhUGBQqA
    			Alternate Rogue expanded: https://www.gmbinder.com/share/-NJ8-9uVQcpeQLxLx5RS
    			Version: 2.1.1

    			SOURCE FOR SAVAGE EXPLOITS
    			Alternate Barbarian: https://www.gmbinder.com/share/-N2gn3QXALCVqwAFJe5v
    			Alternate Barbarian expanded: https://www.gmbinder.com/share/-N7MhiHnBhzmgxFtkzBO
    			Version: 2.1.1

    			SOURCE FOR SPELLS
    			Spell compendium: https://www.gmbinder.com/share/-NQcEN32m0-1u_UMFV5h

    			SOURCE FOR FIGHTING STYLES
    			Alternate Martial Multiclassing: https://www.gmbinder.com/share/-NGUL51kfZCPlESxL1wq

    Sheet:      v13.0.06 and newer
 
    Code by:    Original script by CalypsoMoonlace
    			Thanks to @garnaul (t-santana on github) for helping out with some exploits
*/

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

// Meta information
var iFileName = "LaserLlama - Common attributes.js";
RequiredSheetVersion("13.0.6");

// Source information
SourceList["GMB:LL"] = {
	name : "LaserLlama",
	abbreviation : "GMB:LL",
	abbreviationSpellsheet : "LL",
	group : "GM Binder",
	url : "https://www.gmbinder.com/profile/laserllama",
	date : "2018/04/22"
}

// New spell schools
spellSchoolList["Combat"] = "combat";
spellSchoolList["Skill"] = "skill";
spellSchoolList["Speech"] = "speech";
spellSchoolList["Craft"] = "craft";
spellSchoolList["Order"] = "order";

// 1st degree exploits
SpellsList["aerial maneuver"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[1st-degree exploits (combat)]",
	prereqeval : function(v) { return What('Dex') >= 11},
	// Regular spell attributes
	name : "Aerial Maneuver",
	classes : ["rogue(laserllama)"],
	source : ["GMB:LL", 0],
	level : 1,
	school : "Combat",
	time : "1 rea",
	timeFull : "1 reaction, which you take when you fall",
	range : "Self",
	duration : "Instantaneous",
	description : "Reduce fall damage by five times my level",
	descriptionFull : "When you fall, you can use a reaction to expend an Exploit Die to control your fall. You reduce any falling damage that you would take by an amount equal to five times your level, and when you land, you can choose to land on your feet."
};

SpellsList["alchemical adept"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[1st-degree exploits (checks)]",
	prereqeval : function(v) { return What('Int') >= 11 },
	// Regular spell attributes
	name : "Alchemical Adept",
	classes : ["rogue(laserllama)"],
	source : ["GMB:LL", 0],
	level : 1,
	school : "Skill",
	time : "Check",
	range : "Self",
	components : "M",
	compMaterial : "Land/water vehicle, cartographer's tools, or navigator's tools",
	duration : "Instantaneous",
	description : "Add Exploit Die to a alchemist's supplies, herbalism kit, or poisoner's kit check",
	descriptionFull : "When you make an alchemist's supplies, herbalism kit, or poisoner's kit check you can expend one Exploit Die, roll it, and add the result to your ability check. You can do so after you roll the d20, but before you know if you succeed or fail."
};

SpellsList["arresting strike"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[1st-degree exploits (combat)]",
	// Regular spell attributes
	name : "Arresting Strike",
	classes : ["fighter(laserllama)","rogue(laserllama)"],
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
	classes : ["fighter(laserllama)","barbarian(laserllama)"],
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
	classes : ["fighter(laserllama)", "barbarian(laserllama)","rogue(laserllama)"],
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
	classes : ["fighter(laserllama)","rogue(laserllama)"],
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
	classes : ["fighter(laserllama)","rogue(laserllama)","barbarian(laserllama)"],
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
	classes : ["fighter(laserllama)","rogue(laserllama)"],
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
	classes : ["fighter(laserllama)","barbarian(laserllama)"],
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
	classes : ["fighter(laserllama)","rogue(laserllama)"],
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
	classes : ["fighter(laserllama)","rogue(laserllama)"],
	source : ["GMB:LL", 0],
	level : 1,
	school : "Combat",
	time : "1 a",
	range : "Touch",
	duration : "Instantaneous",
	description : "Touch a creature with at least 1 HP, expend any Exploit Die up to Prof Bonus to heal total roll + its Con",
	descriptionFull : "As an action, you can touch a creature that has at least 1 hit point and expend Exploit Dice (up to your proficiency bonus), roll those dice, and that creature regains a number of hit points equal to the total roll + its Constitution modifier."
};

SpellsList["heroic fortitude"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[1st-degree exploits (checks)]",
	// Regular spell attributes
	name : "Heroic Fortitude",
	classes : ["fighter(laserllama)","barbarian(laserllama)"],
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
	classes : ["fighter(laserllama)","barbarian(laserllama)"],
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
	classes : ["fighter(laserllama)","rogue(laserllama)"],
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
	classes : ["fighter(laserllama)","rogue(laserllama)","barbarian(laserllama)"],
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
	classes : ["fighter(laserllama)","rogue(laserllama)"],
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
	classes : ["fighter(laserllama)","barbarian(laserllama)"],
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
	classes : ["fighter(laserllama)","barbarian(laserllama)"],
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

SpellsList["oil bomb"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[1st-degree exploits (combat)]",
	prereqeval : function(v) { // Prerequisites: proficiency with alchemist's supplies 
        if ((/alchemist.*?/i).test(What('Too Text')) && tDoc.getField("Too Prof").isBoxChecked(0)) {
            return tDoc.getField("Too Exp").isBoxChecked(0) ? "markButDisable" : true;
        } else {
            return CurrentProfs.tool["Alchemist's supplies"] || (/alchemist.*?/i).test(v.toolProfs.toString());
        }
    },
	// Regular spell attributes
	name : "Oil Bomb",
	classes : ["rogue(laserllama)"],
	source : ["GMB:LL", 0],
	level : 1,
	school : "Craft",
	time : "1 a",
	range : "60 ft",
	save: "Dex",
	duration : "1 min",
	description : "Craft oil bomb who can be launched; Each crea in 10 ft square make Dex save or prone (see book)",
	descriptionFull : "As an action, you can expend one Exploit Die and use your alchemist's supplies to craft an Oil Bomb, which retains its potency until the end of your next long rest. However, you cannot regain this Exploit Die until you use the Oil Bomb.\n\nA creature can take the Use an Object action to throw this Oil Bomb at a point it can see within 60 feet. It explodes on impact, covering a 10-foot square centered on that point with alchemical oil, turning it into difficult terrain. Any creatures in that area upon impact, and any creature that enters the area must succeed on a Dexterity saving throw or fall prone.\n\nThe Oil retains its potency on the ground for 1 minute."
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
	classes : ["fighter(laserllama)","rogue(laserllama)"],
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

SpellsList["quick quip"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[1st-degree exploits (checks)]",
	prereqeval : function(v) { return What('Int') >= 11 || What('Cha') >= 11},
	// Regular spell attributes
	name : "Quick Quip",
	classes : ["rogue(laserllama)"],
	source : ["GMB:LL", 0],
	level : 1,
	school : "Speech",
	time : "Special",
	range : "10 ft",
	components : "V",
	duration : "Instantaneous",
	description : "Creatures of my choice that can hear me forget everything I said in the last 10 seconds (see book)",
	descriptionFull : "While speaking, you can expend an Exploit Die to tell a short joke, quip, or another humorous anecdote. Creatures of your choice within 10 feet that can both hear and understand you forget everything you said during the 10 seconds proceeding this Exploit, and instead only remember your quip.\n\nCreatures that are immune to being charmed are immune to this Exploit. Once you use this Exploit on a creature, it is immune to the effects of this Exploit for the next 24 hours."
};

SpellsList["reliable skill"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[1st-degree exploits (checks)]",
	// Regular spell attributes
	name : "Reliable Skill",
	classes : ["rogue(laserllama)"],
	source : ["GMB:LL", 0],
	level : 1,
	school : "Skill",
	time : "Check",
	range : "Self",
	duration : "Instantaneous",
	description : "Treat a roll of 7 or lower on the d20 as an 8 on proficient skill/tool",
	descriptionFull : "Whenever you make an ability check using a skill or tool that you are proficient in and roll a 7 or lower on the d20, you can expend one Exploit Die to treat the d20 roll as an 8."
};

SpellsList["roguish charm"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[1st-degree exploits (checks)]",
	// Regular spell attributes
	name : "Roguish Charm",
	classes : ["rogue(laserllama)"],
	source : ["GMB:LL", 0],
	level : 1,
	school : "Speech",
	time : "1 a",
	range : "10 ft",
	components: "V",
	duration : "1 h",
	save: "Wis",
	description : "One crea save or charmed; adv. on save if me/ally is fighting it (see book)",
	descriptionFull : "As an action, you can expend an Exploit Die and force a creature within 10 feet that can hear and understand you to make a Wisdom saving throw, and it does so with advantage if you or your allies are fighting it. On a failure, it is charmed by you for 1 hour, and regards you as a friendly acquaintance for the duration. Though, it will not risk its life for you.\n\nThis effect immediately ends if you or your companions do anything harmful to the creature, and when the effect ends this way, the target realizes that it was deceived by you.\n\nOnce a creature succeeds on its saving throw against this Exploit it is immune to this Exploit for the next 24 hours."
};

SpellsList["rustic intuition"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[1st-degree exploits (checks)]",
	prereqeval : function(v) { return What('Wis') >= 11},
	// Regular spell attributes
	name : "Rustic Intuition",
	classes : ["fighter(laserllama)","rogue(laserllama)","barbarian(laserllama)"],
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
	classes : ["fighter(laserllama)","barbarian(laserllama)"],
	source : ["GMB:LL", 0],
	level : 1,
	school : "Combat",
	time : "Hit",
	timeFull : "No action required, when you hit a target with a melee weapon attack",
	components : "W", // W = weapon
	compMaterial : "Weapon attack",
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
	classes : ["fighter(laserllama)","rogue(laserllama)"],
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
	timeFull : "1 reaction, which you take when someone you can see hits you with an attack",
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
	classes : ["fighter(laserllama)", "barbarian(laserllama)"],
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

SpellsList["bonebreaking critical"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[1st-degree exploits (combat)]",
	prereqeval : function(v) { return What('Str') >= 11},
	// Regular spell attributes
	name : "Bonebreaking Critical",
	classes : ["barbarian(laserllama)"],
	source : ["GMB:LL", 0],
	level : 1,
	school : "Combat",
	time : "Crit",
	timeFull : "No action required, when you score a critical hit on a creature with a weapon attack",
	components : "W", // W = weapon
	compMaterial : "Weapon attack",
	range : "Weapon",
	save : "Con",
	duration : "1 min",
	description : "On crit, the crea does half dmg with weapon attacks that use Str; save at end of each turn to end",
	descriptionFull : "When you score a critical hit on a creature with a weapon attack, you can expend one Exploit Die to cripple the target. For 1 minute, that creature deals only half damage with any attacks it makes that use its Strength.\nThe creature can make a Constitution saving throw at the end of each of its turns, ending this effect on a success."
};

SpellsList["crushing grip"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[1st-degree exploits (combat)]",
	prereqeval : function(v) { return What('Str') >= 11},
	// Regular spell attributes
	name : "Crushing Grip",
	classes : ["barbarian(laserllama)"],
	source : ["GMB:LL", 0],
	level : 1,
	school : "Combat",
	time : "Grap", // Grapple doesn't fit
	timeFull : "No action required, when you grapple a creature",
	range : "Grapple",
	duration : "Grapple",
	description : "On grapple, crea takes Exploit Die of bludg damage and again at start of each of its turn",
	descriptionFull : "When you grapple a creature, you can expend one Exploit Die to enhance your grip. When you initiate this grapple, and at the start of each of the grappled creature's turns, it takes bludgeoning damage equal to one roll of your Exploit Die."
};

SpellsList["breathless critical"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[1st-degree exploits (combat)]",
	prereqeval : function(v) { return What('Str') >= 11},
	// Regular spell attributes
	name : "Breathless Critical",
	classes : ["barbarian(laserllama)"],
	source : ["GMB:LL", 0],
	level : 1,
	school : "Combat",
	time : "Crit",
	timeFull : "No action required, when you score a critical hit on a creature with a weapon attack",
	components : "W", // W = weapon
	compMaterial : "Weapon attack",
	range : "Weapon",
	save : "Con",
	duration : "1 min",
	description : "On crit, the crea can only speak falteringly and has speed halved; save at end of each turn to end",
	descriptionFull : "When you score a critical hit on a creature with a weapon attack, you can expend one Exploit Die to knock the air from your target's lungs. For 1 minute, that creature can speak only falteringly and its speed is halved.\nThe creature can make a Constitution saving throw at the end of each of its turns, ending this effect on a success."
};

SpellsList["savage rebuke"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[1st-degree exploits (combat)]",
	// Regular spell attributes
	name : "Savage Rebuke",
	classes : ["barbarian(laserllama)"],
	source : ["GMB:LL", 0],
	level : 1,
	school : "Combat",
	time : "1 rea",
	timeFull : "1 reaction, which you take when someone you can see hits you with a melee attack",
	components : "W", // W = weapon
	compMaterial : "Melee weapon attack",
	range : "Melee",
	duration : "Instantaneous",
	description : "When you are hit, make a melee weapon attack against the attacker and add Exploit Die to damage",
	descriptionFull : "When a creature you can see hits you with a melee attack, you can use your reaction to expend one Exploit Die to make a melee weapon attack against that creature. On hit, you deal additional damage equal to one roll of your Exploit Die."
};

SpellsList["trampling rush"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[1st-degree exploits (combat)]",
	// Regular spell attributes
	name : "Trampling Rush",
	classes : ["barbarian(laserllama)"],
	source : ["GMB:LL", 0],
	level : 1,
	school : "Combat",
	time : "1 rea",
	timeFull : "1 reaction, which you take when someone you can see hits you with a melee attack",
	components : "W", // W = weapon
	compMaterial : "Melee weapon attack",
	range : "Melee",
	save : "Str",
	duration : "Instantaneous",
	description : "On hit after moving 20 ft toward, crea must make a save or take Exploit Die of damage and fall prone",
	descriptionFull : "When you move at least 20 feet toward a creature and hit it with a melee weapon attack, you can expend an Exploit Die and attempt to trample the creature. It must succeed on a Strength saving throw, or it takes additional damage equal  to one roll of your Exploit Die and is knocked prone."
};

SpellsList["smoke bomb"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[1st-degree exploits (combat)]",
	prereqeval : function(v) { // Prerequisites: proficiency with alchemist's supplies 
        if ((/alchemist.*?/i).test(What('Too Text')) && tDoc.getField("Too Prof").isBoxChecked(0)) {
            return tDoc.getField("Too Exp").isBoxChecked(0) ? "markButDisable" : true;
        } else {
            return CurrentProfs.tool["Alchemist's supplies"] || (/alchemist.*?/i).test(v.toolProfs.toString());
        }
    },
	// Regular spell attributes
	name : "Smoke Bomb",
	classes : ["rogue(laserllama)"],
	source : ["GMB:LL", 0],
	level : 1,
	school : "Craft",
	time : "1 a",
	range : "60 ft",
	save: "Dex",
	duration : "1 min",
	description : "Craft oil bomb who can be launched; 20 ft rad fog that heavily obscures (see book)",
	descriptionFull : "As an action, you can expend one Exploit Die and use your alchemist's supplies to craft a Smoke Bomb, which retains its potency until the end of your next long rest. However, you can't regain this Exploit Die until you use the Smoke Bomb\n\nA creature can take the Use an Object action to throw this Smoke Bomb at a point it can see within 60 feet. It explodes on impact, creating a 20-foot-radius sphere of smoke, which spreads around corners, centered on the impact. The smoke heavily obscures the area and lasts for 10 minutes. It can be dispersed by a moderate wind of at least 10 miles per hour."
};

SpellsList["subtle con"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[1st-degree exploits (checks)]",
	prereqeval : function(v) { return What('Dex') >= 11 || What('Cha') >= 11},
	// Regular spell attributes
	name : "Subtle Con",
	classes : ["fighter(laserllama)","rogue(laserllama)"],
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
	classes : ["fighter(laserllama)", "rogue(laserllama)","barbarian(laserllama)"],
	source : ["GMB:LL", 0],
	level : 1,
	school : "Combat",
	time : "Hit",
	timeFull : "No action required, when you hit a creature with a melee weapon attack",
	components : "W", // W = weapon
	compMaterial : "Weapon attack",
	range : "Melee",
	save : "Dex",
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
	range : "Melee",
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
	classes : ["fighter(laserllama)","barbarian(laserllama)"],
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
	classes : ["fighter(laserllama)","rogue(laserllama)"],
	source : ["GMB:LL", 0],
	level : 1,
	school : "Skill",
	time : "Check",
	range : "Self",
	duration : "Instantaneous",
	description : "Add Exploit Die to Pers and Decep checks; Can make Int (Deception) & Int (Persuasion) checks (passive)",
	descriptionFull : "Whenever you would normally make a Charisma (Deception) or Charisma (Persuasion) check, you can choose to use your Intelligence in place of Charisma for that ability check.\n\nAlso, whenever you make an Intelligence (Deception) or Intelligence (Persuasion) check you can expend one Exploit Die, roll it, and add the result to your check. You can do so after you roll the d20, but before you know if you succeed."
};

SpellsList["mechanical insight"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[1st-degree exploits (checks)]",
	prereqeval : function(v) { return What('Int') >= 11},
	// Regular spell attributes
	name : "Mechanical Insight",
	classes : ["fighter(laserllama)","rogue(laserllama)"],
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

SpellsList["modify device"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[1st-degree exploits (checks)]",
	prereqeval : function(v) { // Prerequisites: proficiency with tinker's or thieves' tools 
		if ((/tinker.?s.*tools/i).test(What('Too Text')) && tDoc.getField("Too Prof").isBoxChecked(0)) {
            return tDoc.getField("Too Exp").isBoxChecked(0) ? "markButDisable" : true;
        } else if (CurrentProfs.tool["tinker's tools"] || (/tinker.?s.{1,3}tools/i).test(v.toolProfs.toString())) {
        	return true;
        }

        if ((/thieve.?s.*tools/i).test(What('Too Text')) && tDoc.getField("Too Prof").isBoxChecked(0)) {
            return tDoc.getField("Too Exp").isBoxChecked(0) ? "markButDisable" : true;
        } else {
            return CurrentProfs.tool["thieves' tools"] || (/thieve.?s.{1,3}tools/i).test(v.toolProfs.toString());
        }
    },
	// Regular spell attributes
	name : "Modify Device",
	classes : ["rogue(laserllama)"],
	source : ["GMB:LL", 0],
	level : 1,
	school : "Skill",
	time : "1 a",
	components : "M",
	compMaterial : "Thieves' tools or tinker's tools",
	range : "Self",
	duration : "Instantaneous",
	description : "Modify DC of deactivated or unlocked trap to my DC or increase it by 5",
	descriptionFull : "As an action, you can expend one Exploit Die and use either tinker's or thieves' tools to make adjustments to one trap or lock that you can touch. The DC of that trap or lock changes to equal your Exploit save DC, or increases by 5 (your choice).\n\nTo use this Exploit, the trap or lock must be deactivated or unlocked, and you must have access to its inner mechanisms. You cannot use this Exploit to modify a trap or lock that can't be reset, or one that has been destroyed beyond repair."
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
	description : "Switch place with a conscious and willing creature, either me or target gains Exploit Die of temp HP",
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
	classes : ["fighter(laserllama)","rogue(laserllama)"],
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
	classes : ["fighter(laserllama)","barbarian(laserllama)"],
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
	classes : ["fighter(laserllama)","barbarian(laserllama)"],
	source : ["GMB:LL", 0],
	level : 2,
	school : "Combat",
	time : "1 bns",
	range : "Self",
	duration : "Instantaneous",
	description : "Move up to my walk speed toward a hostile creature; Single melee weapon attack against it",
	descriptionFull : "As a bonus action, you can expend one Exploit Die to move up to your walking speed toward a hostile creature that you can see and make a single melee weapon attack against it."
};

SpellsList["alchemical oil"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[2nd-degree exploits]",
	prereqeval : function(v) { // Prerequisites: proficiency with alchemist's supplies 
        if ((/alchemist.*?/i).test(What('Too Text')) && tDoc.getField("Too Prof").isBoxChecked(0)) {
            return tDoc.getField("Too Exp").isBoxChecked(0) ? "markButDisable" : true;
        } else {
            return CurrentProfs.tool["Alchemist's supplies"] || (/alchemist.*?/i).test(v.toolProfs.toString());
        }
    },
	// Regular spell attributes
	name : "Alchemical Oil",
	classes : ["rogue(laserllama)"],
	source : ["GMB:LL", 0],
	level : 2,
	school : "Craft",
	time : "1 a",
	range : "Self",
	duration : "10 min (D)",
	description : "Craft alchemical oil who who changes a weapon's dmg type to acid, cold, fire, or lightning (my choice)",
	descriptionFull : "As an action, you can expend one Exploit Die and use your alchemist's supplies to craft a vial of Alchemical Oil, which retains its potency until the end of your next long rest. Upon creation, you choose either acid, cold, fire, or lightning as the damage type for that vial of oil. You cannot regain the Exploit Die spent on this oil until you expend this Alchemical Oil.\n\nA creature can take the Use an Object action to expend the vial and apply its contents to one weapon it is holding. For the next 10 minutes, that weapon deals the damage type chosen for that Alchemical Oil in place of its normal damage.\n\nA creature can use an action to remove the Alchemical Oil."
};

SpellsList["blinding debris"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[2nd-degree exploits]",
	prereqeval : function(v) { return What('Dex') >= 13},
	// Regular spell attributes
	name : "Blinding Debris",
	classes : ["fighter(laserllama)","rogue(laserllama)"],
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
	classes : ["fighter(laserllama)","barbarian(laserllama)"],
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
	descriptionFull : "When you hit a creature with a melee weapon attack, you can expend an Exploit Die to empower your attack and force it to make a Constitution saving throw. On a failed save, the target suffers the effects below until the beginning of your next turn:"
	+ "\n\u2022 Its speed becomes 0, and it can speak only falteringly."
	+ "\n\u2022 It has disadvantage on attack rolls and ability checks."
	+ "\n\u2022 It has disadvantage on Dexterity saving throws."
	+ "\n\u2022 Attack rolls against it have advantage."
};

SpellsList["craft minor poison"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[2nd-degree exploits]",
	prereqeval : function(v) { // Prerequisites: proficiency with poisoner's kit
        if ((/poisoner.*?/i).test(What('Too Text')) && tDoc.getField("Too Prof").isBoxChecked(0)) {
            return tDoc.getField("Too Exp").isBoxChecked(0) ? "markButDisable" : true;
        } else {
            return CurrentProfs.tool["Poisoner's kit"] || (/poisoner.*?/i).test(v.toolProfs.toString());
        }
    },
	// Regular spell attributes
	name : "Craft Minor Poison",
	classes : ["rogue(laserllama)"],
	source : ["GMB:LL", 0],
	level : 2,
	school : "Craft",
	time : "1 a",
	range : "Self",
	save : "Con",
	duration : "1 min",
	description : "Craft poison who forces one crea to make Con save or poisoned for 1 min; extra save each turn",
	descriptionFull : "As an action, you can expend one Exploit Die and use your poisoner's kit to craft one vial of Minor Poison, which retains its potency until the end of your next long rest. However, you cannot regain this Exploit Die until you expend this poison.\n\nA creature can take the Use an Object action to expend the vial and apply it to one weapon or a piece of ammunition it is holding. On its next hit, the weapon deals poison damage in place of its normal damage, and the target must succeed on a Constitution saving throw or it is poisoned for 1 minute.\n\nThe poisoned creature can repeat this saving throw at the end of each of its turns, ending the effect on a success."
};

SpellsList["crippling strike"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[2nd-degree exploits]",
	// Regular spell attributes
	name : "Crippling Strike",
	source : ["GMB:LL", 0],
	classes : ["fighter(laserllama)","rogue(laserllama)"],
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
	classes : ["fighter(laserllama)","rogue(laserllama)"],
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

SpellsList["flash bomb"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[2nd-degree exploits]",
	prereqeval : function(v) { // Prerequisites: proficiency with alchemist's supplies 
        if ((/alchemist.*?/i).test(What('Too Text')) && tDoc.getField("Too Prof").isBoxChecked(0)) {
            return tDoc.getField("Too Exp").isBoxChecked(0) ? "markButDisable" : true;
        } else {
            return CurrentProfs.tool["Alchemist's supplies"] || (/alchemist.*?/i).test(v.toolProfs.toString());
        }
    },
	// Regular spell attributes
	name : "Flash Bomb",
	classes : ["rogue(laserllama)"],
	source : ["GMB:LL", 0],
	level : 2,
	school : "Craft",
	time : "1 a",
	range : "60 ft",
	save: "Dex",
	duration : "1 min",
	description : "Craft flash bomb who can be launched; Each crea in 20 ft square make Con save or blinded (see book)",
	descriptionFull : "As an action, you can expend one Exploit Die and use your alchemist's supplies to craft a Flash Bomb, which retains its potency until the end of your next long rest. However, you can't regain this Exploit Die until you use the Flash Bomb.\n\nA creature can take the Use an Object action to throw this Flash Bomb at a point it can see within 60 feet. It explodes on impact, and any creature within 20 feet of the impact that can see must succeed on a Constitution saving throw or be blinded for 1 minute. A creature with the sunlight sensitivity trait makes its initial saving throw with disadvantage.\n\nA blinded creature can repeat this saving throw at the end of each of its turns, ending the effect on a success."
};

SpellsList["heroic will"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[2nd-degree exploits]",
	// Regular spell attributes
	name : "Heroic Will",
	source : ["GMB:LL", 0],
	classes : ["fighter(laserllama)","rogue(laserllama)"],
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
	classes : ["fighter(laserllama)","barbarian(laserllama)"],
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
	classes : ["fighter(laserllama)","rogue(laserllama)"],
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
	classes : ["fighter(laserllama)","barbarian(laserllama)"],
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
	classes : ["fighter(laserllama)","rogue(laserllama)"],
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
	classes : ["fighter(laserllama)","barbarian(laserllama)"],
	level : 2,
	school : "Combat",
	time : "Hit",
	timeFull : "No action required, on hit with a melee weapon attack",
	range : "Melee",
	components : "W", // W = weapon
	compMaterial : "Weapon attack",
	duration : "Until long rest",
	save : "Dex",
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
	classes : ["fighter(laserllama)","barbarian(laserllama)"],
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
	classes : ["fighter(laserllama)","rogue(laserllama)"],
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

SpellsList["glancing blow"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[2nd-degree exploits]",
	// Regular spell attributes
	name : "Glancing Blow",
	source : ["GMB:LL", 0],
	classes : ["fighter(laserllama)","rogue(laserllama)","barbarian(laserllama)"],
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

SpellsList["grasp of night"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[2nd-degree exploits]",
	// Regular spell attributes
	name : "Grasp of Night",
	source : ["GMB:LL", 0],
	classes : ["rogue(laserllama)"],
	level : 2,
	school : "Combat",
	time : "Attack",
	timeFull : "In place of an attack",
	range : "Touch",
	duration : "10 min",
	description : "Roll (3*ED) * ED spent (up to my PB) + Wis mod; If crea has less hp than total, it falls asleep",
	descriptionFull : "In place of an attack, you can expend Exploit Dice (up to your proficiency bonus) to touch a creature, attempting to knock it out. For each Exploit Die that you spent you roll three Exploit Dice, adding your Wisdom modifier to the total of all the dice. If the total meets or exceeds the creature's remaining hit points, it instantly falls asleep, and is unconscious for 10 minutes. The creature instantly wakes up if it takes damage or another creature uses an action on its turn to shake or slap the sleeping creature awake."
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
	range : "S:10ft rad",
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
	classes : ["fighter(laserllama)","barbarian(laserllama)"],
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
	classes : ["fighter(laserllama)","rogue(laserllama)"],
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
	classes : ["fighter(laserllama)","barbarian(laserllama)"],
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
	classes : ["fighter(laserllama)","rogue(laserllama)"],
	level : 2,
	school : "Combat",
	time : "Hit",
	range : "Melee",
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
	classes : ["fighter(laserllama)","barbarian(laserllama)"],
	level : 2,
	school : "Combat",
	time : "Attack",
	range : "S:5ft rad",
	components : "W", // W = weapon
	compMaterial : "Melee weapon attack",
	duration : "Instantaneous",
	save : "Dex",
	description : "All crea within range Dex save or fall prone and take Exploit Die + Str dmg (half on save); diff. terrain",
	descriptionFull : "In place of an attack, you can expend an Exploit Die to strike the ground at your feet with a melee weapon. All creatures within 5 feet of you must succeed on a Dexterity saving throw or take bludgeoning damage equal to one roll of your Exploit Die + your Strength modifier and fall prone. On a successful save, they take half as much damage and don't fall prone.\n\nTerrain in this area that is loose earth or stone becomes difficult terrain until a creature uses its action to clear it."
};

SpellsList["soothing speech"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[2nd-degree exploits]",
	prereqeval : function(v) { return What('Cha') >= 13 },
	// Regular spell attributes
	name : "Soothing Speech",
	classes : ["rogue(laserllama)"],
	source : ["GMB:LL", 0],
	level : 2,
	school : "Speech",
	time : "1 a",
	range : "20 ft",
	save : "Cha",
	components : "V",
	duration : "10 min",
	description : "Crea of my choice make Cha save or stop being hostile to crea of my choice for the duration",
	descriptionFull : "As an action, you can expend an Exploit Die and speak to all creatures that can hear and understand you within 20 feet, and force them to make a Charisma saving throw. On a failed save, creatures become indifferent toward creatures of your choice that they are currently hostile toward for 10 minutes.\n\nThis indifference ends if a creature takes damage, is forced to make a saving throw, or it witnesses an ally being harmed. When the effect ends, the creature becomes hostile again."
};

SpellsList["survey dungeon"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[2nd-degree exploits]",
	prereqeval : function(v) { return What('Dex') >= 13 || What('Int') >= 13},
	// Regular spell attributes
	name : "Survey Dungeon",
	classes : ["rogue(laserllama)"],
	source : ["GMB:LL", 0],
	level : 2,
	school : "Skill",
	time : "10 min",
	range : "Self",
	duration : "Instantaneous",
	description : "Learn three of: one trap, one active spell, one secret compartment, door or passageway (see book)",
	descriptionFull : "You can expend an Exploit Die to spend 10 minutes carefully examining a room you currently occupy. At the end of the 10 minutes, you gain knowledge about three of the following:\n"
    + "\n\u2022 One trap in the area. This includes any mechanical or natural effect that was intended to harm an intruder."
    + "\n\u2022 One active spell in the area that was cast at a level equal to your Intelligence modifier or lower."
    + "\n\u2022 One secret compartment, door, or passageway."
	+ "\n\nOnce you use this Exploit to survey a room you must finish a long rest before you can use it in that location again."
};

SpellsList["thunderous blow"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[2nd-degree exploits]",
	prereqeval : function(v) { return What('Str') >= 13 },
	// Regular spell attributes
	name : "Thunderous Blow",
	source : ["GMB:LL", 0],
	classes : ["fighter(laserllama)","barbarian(laserllama)"],
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
	description : "On hit, one crea save (larger crea have adv.) or Expl Die of extra dmg and pushed 5 ft times my Str mod",
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
	classes : ["fighter(laserllama)","rogue(laserllama)"],
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
	range : "S:30ft line",
	components : "W", // W = weapon
	compMaterial : "Melee weapon",
	duration : "Instantaneous",
	description : "Move up to 30 ft, all crea I go through Dex save or take 2 Exploit Die + Str/Dex dmg",
	descriptionFull : "As an action, you can expend an Exploit Die and flourish your melee weapon instantly move up to 30 feet in a straight line, without provoking attacks of opportunity. Any creatures that you pass through must succeed on a Dexterity saving throw or take damage equal to two rolls of your Exploit Die + either your Strength or Dexterity modifier."
};

SpellsList["arresting critical"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[2nd-degree exploits]",
	prereqeval : function(v) { return What('Str') >= 13 },
	// Regular spell attributes
	name : "Arresting Critical",
	classes : ["barbarian(laserllama)"],
	source : ["GMB:LL", 0],
	level : 2,
	school : "Combat",
	time : "Crit",
	timeFull : "No action required, when you score a critical hit on a creature with a weapon attack",
	components : "W", // W = weapon
	compMaterial : "Weapon attack",
	range : "Weapon",
	save : "Con",
	duration : "1 min",
	description : "On crit, the crea's speed is reduced to 0; save at start of each turn to end",
	descriptionFull : "When you score a critical hit on a creature with a weapon attack, you can expend one Exploit Die to critically disable its movement. For 1 minute, its speed is reduced to 0.\nThe creature can make a Constitution saving throw at the start of each of its turns, ending this effect on a success."
};

SpellsList["bloodthirsty critical"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[2nd-degree exploits]",
	prereqeval : function(v) { return What('Str') >= 13 },
	// Regular spell attributes
	name : "Bloodthirsty Critical",
	classes : ["barbarian(laserllama)"],
	source : ["GMB:LL", 0],
	level : 2,
	school : "Combat",
	time : "Crit",
	timeFull : "No action required, when you score a critical hit on a creature with a weapon attack",
	components : "W", // W = weapon
	compMaterial : "Weapon attack",
	range : "Weapon",
	duration : "Instantaneous",
	description : "On crit, make another attack against the same creature; cannot use this exploit again on that attack",
	descriptionFull : "When you score a critical hit on a creature with a weapon attack, you can expend an Exploit Die to instantly make one additional weapon attack against that creature. On hit, you deal additional damage equal to one roll of your Exploit Die.\nIf you score a critical hit with the attack granted by this Exploit, you cannot use this Exploit again to make another attack."
};

SpellsList["ringing critical"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[2nd-degree exploits]",
	prereqeval : function(v) { return What('Str') >= 13 },
	// Regular spell attributes
	name : "Ringing Critical",
	classes : ["barbarian(laserllama)"],
	source : ["GMB:LL", 0],
	level : 2,
	school : "Combat",
	time : "Crit",
	timeFull : "No action required, when you score a critical hit on a creature with a weapon attack",
	components : "W", // W = weapon
	compMaterial : "Weapon attack",
	range : "Weapon",
	save : "Wis",
	duration : "1 min",
	description : "On crit, the crea has to subtract 1d4 on every attack or save; save at start of each turn to end",
	descriptionFull : "When you score a critical hit on a creature with a weapon attack, you can expend one Exploit Die to daze your target.\nFor 1 minute, that creature must roll a d4 and subtract the result from any attack roll and saving throw it makes.\nThe creature can make a Wisdom saving throw at the beginning of each of its turns, ending this effect on a success."
};

SpellsList["greater hurl"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[2nd-degree exploits]",
	prereqeval : function(v) { return What('Str') >= 13 },
	// Regular spell attributes
	name : "Greater Hurl",
	classes : ["barbarian(laserllama)"],
	source : ["GMB:LL", 0],
	level : 2,
	school : "Combat",
	time : "1 a",
	range : "Touch",
	save : "Str",
	duration : "Instantaneous",
	description : "Throw a crea at least one size smaller than me to a space within 30 ft (see book)",
	descriptionFull : "As an action, you can expend an Exploit Die to touch one creature at least one size smaller than you and attempt to throw it. The creature must succeed on a Strength saving throw or be thrown to a space you can see within 30 feet. A creature can choose to fail.\nIf the creature lands in an unoccupied space, it falls prone. If it hits another creature, that creature must succeed on a Dexterity saving throw or take bludgeoning damage equal to one roll of your Exploit Die + your Strength modifier.\nIf a feature causes you to count as a size larger for carrying capacity or grappling, you also count as one size larger for the creatures you can throw."
};

SpellsList["feral senses"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[2nd-degree exploits]",
	prereqeval : function(v) { return What('Con') >= 13 || What('Wis') >= 13 },
	// Regular spell attributes
	name : "Feral Senses",
	classes : ["barbarian(laserllama)"],
	source : ["GMB:LL", 0],
	level : 2,
	school : "Skill",
	time : "1 a",
	range : "Self",
	duration : "10 min",
	description : "Add Exploit Die to all Wisdom (Insight, Perception and Survival) checks, smell poison (see book)",
	descriptionFull : "As an action, you can expend an Exploit Die to temporarily heighten your senses. For 10 minutes you gain a bonus to any Wisdom (Insight) Wisdom (Perception) or Wisdom (Survival) checks you make equal to one roll of your Exploit Die, so long as the checks rely on your sense of sight or smell.\nYou can also smell the presence and location of poisons, poisonous creatures, and diseases within 30 feet of you, and identify the kind of poison, poisonous creature, or disease.\nYour senses cannot detect anything behind full cover."
};

// 3rd degree exploits
SpellsList["adrenaline rush"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[3rd-degree exploits]",
	prereqeval : function(v) { return What('Str') >= 15 || What('Con') >= 15 },
	// Regular spell attributes
	name : "Adrenaline Rush",
	classes : ["fighter(laserllama)","barbarian(laserllama)"],
	source : ["GMB:LL", 0],
	level : 3,
	school : "Combat",
	time : "1 bns",
	range : "Self",
	duration : "1 min",
	description : "I can take Dash action now, and as a bonus action for the duration",
	descriptionFull : "As a bonus action, you can expend an Exploit Die to increase your speed, if only temporarily. For the next minute, you can take the Dash action as a bonus action on each of your turns, including the bonus action you used to use this Exploit."
};

SpellsList["daring rescue"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[3rd-degree exploits]",
	// Regular spell attributes
	name : "Daring Rescue",
	classes : ["fighter(laserllama)"],
	source : ["GMB:LL", 0],
	level : 3,
	school : "Combat",
	time : "1 rea",
	timeFull : "As a reaction when a creature you can see within 30 feet is reduced to 0 hit points",
	range : "Self",
	duration : "1 min",
	description : "Move up to twice my move speed to an ally, who heals and gains temp HP if I got attacked (see book)",
	descriptionFull : "As a reaction when a creature you can see within 30 feet is reduced to 0 hit points, you can expend one Exploit Die and move up to twice your walking speed, so long as you end the movement within 5 feet of the downed creature.\nThe creature can then expend one Hit Die to regain hit points equal to one Hit Die roll + its Constitution modifier. It also gains a number of temporary hit points equal to one roll of your Exploit Die for each opportunity attack you provoked as part of the movement granted to you by this Exploit."
};

SpellsList["destructive slam"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[3rd-degree exploits]",
	prereqeval : function(v) { return What('Str') >= 15 },
	// Regular spell attributes
	name : "Destructive Slam",
	classes : ["fighter(laserllama)","barbarian(laserllama)"],
	source : ["GMB:LL", 0],
	level : 3,
	school : "Combat",
	time : "Attack",
	range : "S:20ft cube",
	duration : "Instantaneous",
	save : "Dex",
	description : "All crea within range Dex save or fall prone and take dmg (see book, half on save); diff. terrain",
	descriptionFull : "In place of an attack, you can expend Exploit Dice (up to your proficiency bonus) and strike the ground at your feet, forcing all creatures in an adjacent 20-foot cube to make a Dexterity saving throw. On a failed save, they take bludgeoning damage equal to two rolls of your Exploit Die for each Exploit Die you spent + your Strength modifier and are knocked prone. On a success, they take half as much damage and don't fall prone.\nObjects in this area take the maximum amount of damage. Moreover, the area of the 20-foot cube becomes difficult terrain until a creature takes 1 minute to clear it."
};

SpellsList["disorienting blow"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[3rd-degree exploits]",
	prereqeval : function(v) { return What('Str') >= 15},
	// Regular spell attributes
	name : "Disorienting Blow",
	classes : ["fighter(laserllama)","barbarian(laserllama)"],
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

SpellsList["forgotten knowledge"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[3rd-degree exploits]",
	prereqeval : function(v) { return What('Int') >= 15 || What('Wis') >= 15 },
	// Regular spell attributes
	name : "Forgotten Knowledge",
	source : ["GMB:LL", 0],
	classes : ["fighter(laserllama)"],
	level : 3,
	school : "Skill",
	time : "10 min",
	range : "Self",
	duration : "Instantaneous",
	description : "Remember a piece of lore of person, object, or location you can see (see book)",
	descriptionFull : "You can expend an Exploit Die to spend 10 minutes focused on a person, object, or location you can see, after which, you remember a piece of lore about the thing you focused on.\n\nThis lore might consist of current tales, forgotten stories, or even secret lore that has never been widely known. The more information you have about the thing, the more precise and detailed the information you seem to remember about it."
};

SpellsList["gale slash"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[3rd-degree exploits]",
	prereqeval : function(v) { return What('Str') >= 15 || What('Dex') >= 15 },
	// Regular spell attributes
	name : "Gale Slash",
	classes : ["fighter(laserllama)"],
	source : ["GMB:LL", 0],
	level : 3,
	school : "Combat",
	time : "Attack",
	range : "S:20ft cone",
	components : "W", // W = weapon
	compMaterial : "Melee weapon",
	duration : "Instantaneous",
	save : "Con",
	description : "All crea within range Con save or take dmg (see book, half on save)",
	descriptionFull : "In place of an attack, you can expend Exploit Dice (up to your proficiency bonus) to rend the air in front of you with a melee weapon, forcing targets in an adjacent 20-foot cone to make a Constitution saving throw. On a failure, targets take slashing damage equal to two rolls of your Exploit Die for each Exploit Die spent + either your Strength or Dexterity modifier. On a successful save, targets take half as much damage."
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

SpellsList["inspirational speech"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[3rd-degree exploits]",
	prereqeval : function(v) { return What('Cha') >= 15 },
	// Regular spell attributes
	name : "Inspirational Speech",
	classes : ["fighter(laserllama)"],
	source : ["GMB:LL", 0],
	level : 3,
	school : "Speech",
	time : "1 min",
	range : "Voice",
	components : "V",
	duration : "Instantaneous",
	description : "Give temp HP equal to my lvl to 1 + Cha mod creatures and adv. on Wis saves while the temp HP lasts",
	descriptionFull : "You can expend an Exploit Die and spend 1 minute giving an inspirational speech to a number of creatures that can hear you equal to 1 + your Charisma modifier. At the end of this speech, targets gain temporary hit points equal to your level.\nWhile the temporary hit points from this Exploit last, the creatures have advantage on Wisdom saving throws."
};

SpellsList["mythic athleticism"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[3rd-degree exploits]",
	prereqeval : function(v) { return What('Str') >= 15 || What('Con') >= 15 },
	// Regular spell attributes
	name : "Mythic Athleticism",
	classes : ["fighter(laserllama)","barbarian(laserllama)"],
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
	classes : ["fighter(laserllama)","barbarian(laserllama)"],
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

SpellsList["recruit mercenary"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[3rd-degree exploits]",
	prereqeval : function(v) { return What('Int') >= 15 || What('Cha') >= 15 },
	// Regular spell attributes
	name : "Recruit Mercenary",
	classes : ["fighter(laserllama)"],
	source : ["GMB:LL", 0],
	level : 3,
	school : "Speech",
	time : "1 h",
	range : "Settlement",
	duration : "Instantaneous",
	description : "Recruit Brute or Scout who follows my orders in combat (see book)",
	descriptionFull : "You can expend an Exploit Die and spend 1 hour to recruit a humanoid Mercenary from a settlement you currently occupy. For this Exploit to work, there must be a willing humanoid, such as a bounty hunter, adventurer, or other sellsword in a settlement of significant size, as determined by the DM.\nYou choose to recruit a Brute or Scout, which determines certain traits in their stat block. They use the Mercenary stat block (can be added to Companion page) and roll their own initiative in combat. On their turn, they do their best to follow any orders you have given. If not, they will defend themselves to the best of their ability.\nThe Mercenary remains in your service until you dismiss them, they abandon you, or they die. You do not regain the Exploit Die spent on this Exploit until they leave your service.\nYou can only have one Mercenary in your service at a time. Recruiting another causes others to abandon you."
};

// Mercenary statblocks
CreatureList["mercenary, brute"] = {
	name : "Mercenary, Brute",
	source : ["GMB:LL", 0],
	size : 3,
	type : "Humanoid",
	alignment : "any Non-Lawful Alignment",
	ac : 18,
	hp : 21,
	hd : [3, 10],
	hdLinked : ["fighter(laserllama)", "fighter"],
	minlevelLinked : ["fighter(laserllama)", "fighter"],
	speed : "30 ft",
	scores : [16, 16, 13, 10, 12, 8],
	saves : [3, 3, "", "", "", ""],
	senses : "",
	passivePerception : 12, // The page overrides this to 11 which honestly I think is better since it was probably an oversight to have this set to 12
	languages : "Common and one other language",
	challengeRating : "0", // Not included in document
	proficiencyBonus : 3,
	attacksAction : 1,
	attacks : [{
		name : "Battleaxe",
		ability : 1,
		damage : [1, 8, "slashing"],
		range : "Melee (5 ft)",
		description : "",
		abilitytodamage : true
	}],
	skills : {
		"Athletics" : 6
	}, /*
	features : [{
		name : "Leader",
		description : "-"
	}], */
	traits : [{
		name : "Morale",
		description : "If you fall to 0 hit points the Mercenary does everything in its power to flee and return home."
	}, {
		name : "Rough & Tumble",
		description : "The Mercenary can use a bonus action to attempt a Shove or Grapple."
	}],
	notes: [{
		name : "The Mercenary roll their own initiative in combat",
		description : "On their turn, they do their best to follow any orders you have given. If not, they will defend themselves to the best of their ability.",
		joinString: " "
	}, {
		name: "The Mercenary has a number of d10 Hit Dice equal to your level.",
		description: "It also gains all the normal benefits of both short and long rests.",
		joinString: " "
	}],
	calcChanges : {
		hp : function (totalHD, HDobj, prefix) {
			if (!classes.known["fighter(laserllama)"] && !classes.known.fighter) return;
			var rngrLvl = classes.known["fighter(laserllama)"] ? classes.known["fighter(laserllama)"].level : classes.known.fighter.level;
			var rngrLvlM = 5 * rngrLvl;
			HDobj.alt.push(6 + rngrLvlM);
			HDobj.altStr.push(" = 6 as a base\n + 5 \xD7 " + rngrLvl + " from five times its leader's fighter level (" + rngrLvlM + ")");
		},
		setAltHp : true
	}
}

CreatureList["mercenary, scout"] = {
	name : "Mercenary, Scout",
	source : ["GMB:LL", 0],
	size : 3,
	type : "Humanoid",
	alignment : "any Non-Lawful Alignment",
	ac : 18,
	hp : 21,
	hd : [3, 10],
	hdLinked : ["fighter(laserllama)", "fighter"],
	minlevelLinked : ["fighter(laserllama)", "fighter"],
	speed : "30 ft",
	scores : [16, 16, 13, 10, 12, 8],
	saves : [3, 3, "", "", "", ""],
	senses : "",
	passivePerception : 12, // The page overrides this to 11 which honestly I think is better since it was probably an oversight to have this set to 12
	languages : "Common and one other language",
	challengeRating : "0", // Not included in document
	proficiencyBonus : 3,
	attacksAction : 1,
	attacks : [{
		name : "Shortsword",
		ability : 2,
		damage : [1, 6, "slashing"],
		range : "Melee (5 ft)",
		description : "Finesse, light",
		abilitytodamage : true
	}, {
		name : "Shortbow",
		ability : 2,
		damage : [1, 6, "piercing"],
		range : "80/320 ft",
		description : "Ammunition, two-handed",
		abilitytodamage : true
	}],
	skills : {
		"Stealth" : 6
	}, /*
	features : [{
		name : "Leader",
		description : "-"
	}], */
	traits : [{
		name : "Morale",
		description : "If you fall to 0 hit points the Mercenary does everything in its power to flee and return home."
	}, {
		name : "Slippery",
		description : "The Mercenary can use a bonus action to take the Disengage or Hide action."
	}],
	notes: [{
		name : "The Mercenary roll their own initiative in combat",
		description : "On their turn, they do their best to follow any orders you have given. If not, they will defend themselves to the best of their ability.",
		joinString: " "
	}, {
		name: "The Mercenary has a number of d10 Hit Dice equal to your level.",
		description: "It also gains all the normal benefits of both short and long rests.",
		joinString: " "
	}],
	calcChanges : {
		hp : function (totalHD, HDobj, prefix) {
			if (!classes.known["fighter(laserllama)"] && !classes.known.fighter) return;
			var rngrLvl = classes.known["fighter(laserllama)"] ? classes.known["fighter(laserllama)"].level : classes.known.fighter.level;
			var rngrLvlM = 5 * rngrLvl;
			HDobj.alt.push(6 + rngrLvlM);
			HDobj.altStr.push(" = 6 as a base\n + 5 \xD7 " + rngrLvl + " from five times its leader's fighter level (" + rngrLvlM + ")");
		},
		setAltHp : true
	}
}


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

SpellsList["survey settlement"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[3rd-degree exploits]",
	prereqeval : function(v) { return What('Dex') >= 15 || What('Cha') >= 15 },
	// Regular spell attributes
	name : "Survey Settlement",
	classes : ["fighter(laserllama)"],
	source : ["GMB:LL", 0],
	level : 3,
	school : "Speech",
	time : "1 h",
	range : "1 mile",
	duration : "Instantaneous",
	description : "Learn three of: factions, buildings, leaders, beliefs or secret places (see book)",
	descriptionFull : "You can expend an Exploit Die and spend 1 hour gathering information on up to 1 square mile of a settlement that you currently occupy. At the end of the hour, you gain knowledge about three of the following as they relate to the area:"
	+ "\n\u2022 Any active factions and faction outposts within the area."
	+ "\n\u2022 Prominent buildings, gathering places, and cultural sites."
	+ "\n\u2022 Powerful (CR 1 or higher) politicians or military leaders."
	+ "\n\u2022 Loyalties, beliefs, rumors, and fears of the local populace."
	+ "\n\u2022 Secret alleyways, doors, hideouts, or storefronts."
};

SpellsList["survey wilderness"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[3rd-degree exploits]",
	prereqeval : function(v) { return What('Str') >= 15 || What('Wis') >= 15 },
	// Regular spell attributes
	name : "Survey Wilderness",
	classes : ["fighter(laserllama)","barbarian(laserllama)"],
	source : ["GMB:LL", 0],
	level : 3,
	school : "Speech",
	time : "1 h",
	range : "1 mile",
	duration : "Instantaneous",
	description : "Learn three of: camps, nature, ecosystems, creatures or secret places (see book)",
	descriptionFull : " You can expend an Exploit Die and spend 1 hour gathering information on up to 1 square mile of a wilderness that you currently occupy. At the end of the hour, you gain knowledge about three of the following as they relate to the area:"
	+ "\n\u2022 Any settlements or camps with five or more occupants."
	+ "\n\u2022 Prominent natural formations, bodies of water, and ruins."
	+ "\n\u2022 Local plants, animals, weather, and ecosystems."
	+ "\n\u2022 Powerful (CR 1 or higher) creatures that reside within, or have passed through the area within the last 24 hours."
	+ "\n\u2022 Secret trails, entrances, groves, or monster lairs."
};

SpellsList["war cry"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[3rd-degree exploits]",
	// Regular spell attributes
	name : "War Cry",
	source : ["GMB:LL", 0],
	classes : ["fighter(laserllama)","barbarian(laserllama)"],
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

SpellsList["confounding critical"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[3rd-degree exploits]",
	prereqeval : function(v) { return What('Str') >= 15 },
	// Regular spell attributes
	name : "Confounding Critical",
	classes : ["barbarian(laserllama)"],
	source : ["GMB:LL", 0],
	level : 3,
	school : "Combat",
	time : "Crit",
	timeFull : "No action required, when you score a critical hit on a creature with a weapon attack",
	components : "W", // W = weapon
	compMaterial : "Weapon attack",
	range : "Weapon",
	save : "Int",
	duration : "1 min",
	description : "On crit, crea has -1d6 on every attack, check and concentration save; save at start of each turn to end",
	descriptionFull : "When you score a critical hit on a creature with a weapon attack, you can expend one Exploit Die to strike at the head, weakening its ability to think. For 1 minute, its thoughts are muddled and whenever it makes an attack roll, ability check, or Constitution saving throw to maintain its concentration, it must roll a d6 and subtract the result from its roll.\nThe creature can make an Intelligence saving throw at the start of each of its turns, ending this effect on a success."
};

SpellsList["primal terror"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[3rd-degree exploits]",
	// Regular spell attributes
	name : "Primal Terror",
	classes : ["barbarian(laserllama)"],
	source : ["GMB:LL", 0],
	level : 3,
	school : "Combat",
	time : "1 a",
	range : "5 ft",
	save : "Wis",
	duration : "1 min",
	description : "One crea save or sees all creatures as enemies, attacks randomly; extra save each time it takes damage",
	descriptionFull : "As an action, you can expend one Exploit Die to attempt to drive a creature within 5 feet into a fit of primal fear, forcing it to make a Wisdom saving throw. On a failure, it loses the ability to distinguish friend from foe, regarding all creatures as enemies for the next minute. Each time it takes damage, it repeats the saving throw, ending this effect on a success.\nThe creature must choose the target of each attack and spell at random from among the creatures it can see in range.\nIf a creature provokes an opportunity attack from the affected creature, it must make that attack if it is able to."
};

SpellsList["roar of triumph"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[3rd-degree exploits]",
	prereqeval : function(v) { return What('Str') >= 15 },
	// Regular spell attributes
	name : "Roar of Triumph",
	classes : ["barbarian(laserllama)"],
	source : ["GMB:LL", 0],
	level : 3,
	school : "Combat",
	time : "Crit",
	timeFull : "No action required, when you score a critical hit on a creature",
	components : "V",
	range : "S:300-ft rad",
	duration : "Instantaneous",
	description : "On crit, me and Con mod creatures of my choice gain temp HP equal to my level + my Con mod",
	descriptionFull : "When you score a critical hit, you can expend an Exploit Die to let out a cry that can be heard up to 300 feet away. You and a number of creatures of your choice who can hear you equal to your Constitution modifier (minimum of 1) gain temporary hit points equal to your level + your Constitution modifier."
};

SpellsList["savage defiance"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[3rd-degree exploits]",
	// Regular spell attributes
	name : "Savage Defiance",
	classes : ["barbarian(laserllama)"],
	source : ["GMB:LL", 0],
	level : 3,
	school : "Combat",
	time : "1 a",
	range : "S:60-ft rad",
	duration : "1 min",
	description : "Creas of my choice have disadv. on attacks against not me for 1 min or until they hit me",
	descriptionFull : "As an action you can expend an Exploit Die to issue a savage challenge. Creatures of your choice within 60 feet that can hear you have disadvantage on attacks against targets other than you for 1 minute, or until they hit you with an attack."
};

SpellsList["bewildering blow"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[3rd-degree exploits]",
	prereqeval : function(v) { return What('Str') >= 15 },
	// Regular spell attributes
	name : "Bewildering Blow",
	classes : ["barbarian(laserllama)"],
	source : ["GMB:LL", 0],
	level : 3,
	school : "Combat",
	time : "Hit",
	timeFull : "No action required, on hit with a melee weapon attack",
	range : "Melee",
	components : "W", // W = weapon
	compMaterial : "Melee weapon attack",
	save : "Wis",
	duration : "1 min",
	description : "On hit, crea must make a save or cannot take reactions and roll a d10 for its behaviour (see book)",
	descriptionFull : "When you hit a creature with a melee weapon attack, you can expend an Exploit Die to strike its head, dealing additional damage equal to two rolls of your Exploit Die. The creature must then make a Wisdom save. On a failure, it cannot take reactions and must roll a d10 at the beginning of each of its turns to determine its behavior."
	+toUni("\nd10\tBehaviour")+
	"\n  1\tIt uses all its movement to move in a random direction (roll a d8 and assign a direction to each die face). It does not take an action this turn."+
	"\n  2-5\tIt does not move or take actions this turn."+
	"\n  6-7\tIt uses its action to make a melee attack against a random creature within its reach. If there is no creature in its reach, it does nothing."+
	"\n  8-9\tIt can act and move normally."+
	"\n  10\tIt lays prone on the ground and takes no further actions or movement this turn."+
	"\nThis effect lasts for 1 minute, but the creature can make a Wis save at the end of each of its turns, instantly ending the effects of this Exploit on a success."
};

SpellsList["pack tactics"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[3rd-degree exploits]",
	prereqeval : function(v) { return What('Wis') >= 15 },
	// Regular spell attributes
	name : "Pack Tactics",
	classes : ["barbarian(laserllama)"],
	source : ["GMB:LL", 0],
	level : 3,
	school : "Combat",
	time : "1 bns",
	range : "S:30-ft rad",
	duration : "Up to 1 min",
	description : "Until next turn, creas of my choice have adv. on attacks if has another ally within 5 ft; extend with 1 bns",
	descriptionFull : "As a bonus action, you can expend one Exploit Die to signal your allies to fight as a pack. Until the end of your next turn, creatures of your choice that can see or hear you within 30 feet have advantage on attack rolls, so long as a conscious allied creature is within 5 feet of their target.\nYou can use a bonus action on your next turn to extend the effects of this Exploit to the end of the turn after that, though you do not need to expend an Exploit Die when you do so.\nYou cannot maintain this Exploit longer than 1 minute."
};

// 4th degree exploits
SpellsList["dance of death"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[4th-degree exploits]",
	prereqeval : function(v) { return What('Dex') >= 17 },
	// Regular spell attributes
	name : "Dance of Death",
	source : ["GMB:LL", 0],
	classes : ["fighter(laserllama)"],
	level : 4,
	school : "Combat",
	time : "1 a",
	range : "30 ft",
	save : "Dex",
	components : "W", // W = weapon
	compMaterial : "Melee weapon",
	duration : "Instantaneous",
	description : "Deal 2*ED+Dex dmg (half on save) to 1+ED expended (up to PB) creatures; +1 creature per kill",
	descriptionFull : "As an action on your turn, you can expend Exploit Dice (up to your proficiency bonus) and instantly strike with a melee weapon you are holding at a number of creatures within 30 feet equal to 1 + the number of dice expended, forcing them to make a Dexterity saving throw. Creatures take damage of your weapon's type equal to two rolls of your Exploit Die + your Dexterity modifier on a failed saving throw, and half as much damage on a successful save."
		+ "\n\nFor each of the creatures reduced to 0 hit points by this Exploit, you can force another creature of your choice within range of this Exploit to make the Dexterity saving throw."
		+ "\n\nOnce the Exploit ends, you appear in an unoccupied space of your choice next to one of the targets of this Exploit."
};

SpellsList["devastating critical"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[4th-degree exploits]",
	prereqeval : function(v) { return What('Str') >= 17 },
	// Regular spell attributes
	name : "Devastating Critical",
	classes : ["barbarian(laserllama)"],
	source : ["GMB:LL", 0],
	level : 3,
	school : "Combat",
	time : "Crit",
	timeFull : "No action required, when you score a critical hit on a creature with a weapon attack",
	components : "W", // W = weapon
	compMaterial : "Weapon attack",
	range : "Weapon",
	save : "Int",
	duration : "1 min",
	description : "On crit, crea loses concentration and disadv. on Wis, Int and Cha saves; save at start of each turn to end",
	descriptionFull : "When you score a critical hit on a creature with a weapon attack, you can expend one Exploit Die to shatter its focus. If it was concentrating on a spell or effect, it automatically loses concentration, and for 1 minute, it has disadvantage on all Intelligence, Wisdom, and Charisma saving throws, and any saving throws it makes to maintain concentration.\nThe creature can make an Intelligence saving throw at the start of each of its turns, ending this effect on a success."
};

SpellsList["equip militia"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[4th-degree exploits]",
	// Regular spell attributes
	name : "Equip Militia",
	source : ["GMB:LL", 0],
	classes : ["fighter(laserllama)"],
	level : 4,
	school : "Skill",
	time : "1 h",
	range : "Special",
	duration : "Special",
	description : "Train humanoid creatures (up to my lvl) to fight; They gain 2 benefits of my choice (see book)",
	descriptionFull : "You can expend one Exploit Die and spend 1 hour training a number of humanoid creatures equal to your level to fight. Creatures that spend the full hour listening and training with you gain two of the following benefits of your choice:"
		+ "\n\u2022 They gain proficiency with one martial weapon."
		+ "\n\u2022 They gain proficiency with light armor and shields."
		+ "\n\u2022 They gain temporary hit points equal to your level."
		+ "\n\u2022 They gain proficiency in one of the following skills: Animal Handling, Athletics, Medicine, Survival, or Stealth."
		+ "\n\u2022 They have advantage on saving throws to resist being charmed or frightened."
		+ "\nThe benefits you choose for these creatures last until they are incapacitated, or until the end of their next long rest."
};

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

SpellsList["subjugate beast"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[4th-degree exploits]",
	// Regular spell attributes
	name : "Subjugate Beast",
	source : ["GMB:LL", 0],
	classes : ["barbarian(laserllama)"],
	level : 4,
	school : "Order",
	time : "1 a",
	range : "30 ft",
	duration : "1 min",
	save : "Wis",
	description : "1 beast save or charmed, I can give it an order as a bonus action; extra save when damaged",
	descriptionFull : "As an action, you can expend one Exploit Die and attempt to intimidate one beast that can see or hear you within 30 feet, bending it to your will. The beast must succeed on a Wisdom saving throw or be considered charmed by you for 1 minute.\nWhile it is charmed, you can use a bonus action to issue ita command, which it does its best to obey. You can specify a simple and general course of action. If it doesn’t receive direction from you, it defends itself to the best of its ability.\nEach time the beast takes damage, it repeats the saving throw, ending the effects of this Exploit on a success. "
};

SpellsList["sundering strike"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[4th-degree exploits]",
	prereqeval : function(v) { return What('Str') >= 17 },
	// Regular spell attributes
	name : "Sundering Strike",
	source : ["GMB:LL", 0],
	classes : ["fighter(laserllama)","barbarian(laserllama)"],
	level : 4,
	school : "Combat",
	time : "Attack",
	timeFull : "In place of an attack",
	range : "Melee",
	components : "W", // W = weapon
	compMaterial : "Melee weapon",
	duration : "Instantaneous",
	description : "Destroy magical force field; if above SL 3, DC 10+SL strength check",
	descriptionFull : "In place of an attack, you can expend an Exploit Die to strike a creation of magical force, such as a prismatic wall, resilient sphere, or forcecage with a melee weapon you are wielding. Any magical creations created with a spell slot of 3rd-level or lower are instantly destroyed by your strike.\nIf the magical creation was created with a spell of 4th-level or higher, make a Strength check. The DC equals 10 + the level of the spell slot used to create it. On a successful check, the magical creation is instantly destroyed by your strike."
};

SpellsList["staggering blow"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[4th-degree exploits]",
	prereqeval : function(v) { return What('Str') >= 17 },
	// Regular spell attributes
	name : "Staggering Blow",
	source : ["GMB:LL", 0],
	classes : ["fighter(laserllama)","barbarian(laserllama)"],
	level : 4,
	school : "Combat",
	time : "Hit",
	timeFull : "No action required, on hit with a melee weapon attack",
	range : "Melee",
	components : "W", // W = weapon
	compMaterial : "Melee weapon",
	duration : "1 min",
	save : "Wis",
	description : "Add 3 expl die to dmg; Wis save or disadv. on checks & attack rolls and can't take reactions",
	descriptionFull : "When you hit a creature with a melee weapon attack, you can expend one Exploit Die to strike with near-supernatural power, dealing additional damage equal to three rolls of your Exploit Die. It must succeed on a Wisdom saving throw, or for the next minute it has disadvantage on ability checks and attack rolls and can't take reactions. The creature can make a Wisdom saving throw at the start of each of its turns, ending these effects on a success."
};

SpellsList["strength of the colossus"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[4th-degree exploits]",
	prereqeval : function(v) { return What('Str') >= 17 },
	// Regular spell attributes
	name : "Strength of the Colossus",
	source : ["GMB:LL", 0],
	classes : ["barbarian(laserllama)"],
	level : 4,
	school : "Skill",
	time : "1 bns",
	range : "Self",
	duration : "Conc, 10 min",
	save : "Con",
	description : "My push/drag/lift capacity increases greatly; when it ends, DC17 Con save or exhaustion (see book)",
	descriptionFull : "As a bonus action you can expend Exploit Dice (up to your proficiency bonus) to enhance your strength to mythic levels, though you must concentrate on this Exploit's effect as if you were concentrating on a spell. For 10 minutes, or until you lose concentration, the amount of weight you can push, drag, pull, or lift becomes 50 x expended Exploit Dice x Strength score (as opposed to 30 x Strength score without this exploit)."
	+ "\nFor each size category you are above Medium, the amount of weight you can move as part of this Exploit is doubled. For example, a Medium-sized Barbarian with 20 Strength could expend 3 Exploit Dice to use this Exploit, multiplying their 20 Strength by 150, to lift up to 3,000 pounds. If they were Large, they would double this weight to 6,000 pounds."
	+ "\nWhen this Exploit ends you must succeed on a DC 17 Constitution saving throw or suffer a number of levels of exhaustion equal to the number of Exploit Dice you spent."
};

SpellsList["unbreakable"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[4th-degree exploits]",
	prereqeval : function(v) { return What('Con') >= 17 },
	// Regular spell attributes
	name : "Unbreakable",
	source : ["GMB:LL", 0],
	classes : ["fighter(laserllama)","barbarian(laserllama)"],
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
SpellsList["banishing strike"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[5th-degree exploits]",
	prereqeval : function(v) { return What('Str') >= 19 },
	// Regular spell attributes
	name : "Banishing Strike",
	source : ["GMB:LL", 0],
	classes : ["fighter(laserllama)","barbarian(laserllama)"],
	level : 5,
	school : "Combat",
	time : "Hit",
	timeFull : "No action required, on hit with a melee weapon attack",
	range : "30 ft",
	components : "W", // W = weapon
	compMaterial : "Melee weapon",
	save : "Cha",
	duration : "1 rnd",
	description : "On hit, 4 ED bonus force dmg and save or banished to harmless demiplane until start of my next turn",
	descriptionFull : "When you hit a creature with a melee weapon attack, you can expend an Exploit Die to strike with legendary power, dealing bonus force damage equal to four rolls of your Exploit Die. It must succeed on a Charisma saving throw, or be shunted to a harmless demiplane where it is incapacitated. At the start of your next turn it reappears in the unoccupied space nearest to the last space it occupied when you hit it with this attack."
};

SpellsList["cataclysmic slam"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[5th-degree exploits]",
	prereqeval : function(v) { return What('Str') >= 19 },
	// Regular spell attributes
	name : "Cataclysmic Slam",
	source : ["GMB:LL", 0],
	classes : ["fighter(laserllama)","barbarian(laserllama)"],
	level : 5,
	school : "Combat",
	time : "1 a",
	range : "30 ft",
	save : "Con",
	duration : "Instantaneous",
	description : "All crea within range save or fall prone and take (2*ED spent)+Str dmg (half on save); difficult terrain",
	descriptionFull : "As an action on your turn, you can expend Exploit Dice (up to your proficiency bonus) to strike the ground with mythic power. A shockwave of thunderous force erupts from you, forcing all creatures within 30 feet to make a Constitution saving throw. On a failure, they take bludgeoning damage equal to two rolls of your Exploit Die for each Exploit Die you spent + your Strength modifier and are knocked prone, and on a success, they take half as much damage and don't fall prone. Objects in this area take maximum damage."
		+ "\nThe area becomes difficult terrain, and a creature can use its action to clear one 5-foot square of this difficult terrain."
};

SpellsList["mythic focus"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[5th-degree exploits]",
	// Regular spell attributes
	name : "Mythic Focus",
	source : ["GMB:LL", 0],
	classes : ["fighter(laserllama)"],
	level : 5,
	school : "Combat",
	time : "1 bns",
	range : "Self",
	duration : "Conc, 1 min",
	description : "50 temp HP; add ED to Str/Dex/Con save; add ED to dmg (1/round); +1 atk; adv on weap atks",
	descriptionFull : "As a bonus action, you can expend one Exploit Die to enter a legendary state of focus which you must concentrate on as if you were concentrating on a spell. For 1 minute, or until you lose concentration, you gain the following benefits:"
		+ "\n\u2022 You gain 50 temporary hit points. If any of these remain when the effects of this Exploit end, they are lost."
		+ "\n\u2022 You have advantage on any weapon attacks you make."
		+ "\n\u2022 Once per turn when you hit with a weapon attack, you deal bonus damage equal to one roll of your Exploit Die."
		+ "\n\u2022 You gain a bonus to Strength, Dexterity, and Constitution saving throws equal to one roll of your Exploit Die."
		+ "\n\u2022 When you take the Attack action on your turn, you can make one additional weapon attack as part of that action. "
		+ "\nWhen the effect ends, you can’t move or take actions until after your next turn, as a wave of lethargy sweeps over you. This Exploit doesn't stack with tenser's transformation."
};

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

SpellsList["vorpal strike"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[5th-degree exploits]",
	prereqeval : function(v) { return What('Str') >= 19 || What('Dex') >= 19},
	// Regular spell attributes
	name : "Vorpal Strike",
	source : ["GMB:LL", 0],
	classes : ["fighter(laserllama)"],
	level : 5,
	school : "Combat",
	time : "Hit",
	timeFull : "On hit with melee weapon",
	range : "Melee",
	components : "W", // W = weapon
	compMaterial : "Melee weapon",
	duration : "Instantaneous",
	description : "Add 4 ED to dmg; If <50 HP, cut the crea's head (or use legendary res); If no more head, the crea dies",
	descriptionFull : "When you hit a creature with a melee weapon attack, you can expend one Exploit Die to strike with legendary force, dealing additional damage equal to four rolls of your Exploit Die.\nIf the damage of this Exploit reduces the target's remaining hit points to 50 or fewer, you cut off one of the its heads. If the creature cannot survive without the lost head, it is killed.\nCreatures can use a Legendary Resistance to avoid being beheaded. Any creatures that don't have or don't need a head are immune to this Exploit's effects, but still take the damage."
};

SpellsList["vorpal critical"] = {
	// Exploit exclusive attributes
	isExploit : true,
	submenu : "[5th-degree exploits]",
	prereqeval : function(v) { return What('Str') >= 19 },
	// Regular spell attributes
	name : "Vorpal Critical",
	source : ["GMB:LL", 0],
	classes : ["barbarian(laserllama)"],
	level : 5,
	school : "Combat",
	time : "Crit",
	timeFull : "No action required, when you score a critical hit on a creature with a melee weapon attack",
	components : "W", // W = weapon
	compMaterial : "Weapon attack",
	range : "Melee",
	duration : "Instantaneous",
	description : "Add 3 ED to dmg; If <50 HP, cut the crea's head (or use legendary res); If no more head, the crea dies",
	descriptionFull : "When you score a critical hit with a melee attack on a creature, you can expend one Exploit Die to strike with legendary force, dealing additional damage equal to three rolls of your Exploit Die.\nIf the damage of this Exploit reduces the target's remaining hit points to 50 or fewer, you cut off one of the its heads. If the creature cannot survive without the lost head, it is killed.\nCreatures can use a Legendary Resistance to avoid being beheaded. Any creatures that don't have or don't need a head are immune to this Exploit's effects, but still take the damage."
};


// Spells from LL's spell compendium
// Psion spells (note that I only added those required for the Mystic, Fighter subclass)
SpellsList["id insinuation"] = {
	name : "Id Insinuation",
	classes : ["psion"],
	source : ["GMB:LL", 0],
	level : 1,
	school : "Ench",
	time : "1 a",
	range : "60 ft",
	components : "V,S",
	duration : "Conc, 1 min",
	save : "Wis",
	description : "1+1/SL crea save or incapacitated and end of each turn 1d6 Psychic damage; extra save each turn/dmg",
	descriptionFull : "You unleash conflicting desires within one creature you can see within range, impairing its ability to make decisions. It must succeed on a Wisdom saving throw or be incapacitated.\nAt the end of each of its turns, and each time it takes damage from a source other than this spell, it can make another Wisdom saving throw. It takes 1d6 psychic damage on a failed save, and the spell ends on a successful save." + AtHigherLevels + "When you cast this spell using a spell slot of 2nd level or higher, you can target one additional creature for each slot level above 1st. The creatures must be within 30 feet of each other when you target them.",
};

SpellsList["tower of iron will"] = {
	name : "Tower of Iron Will",
	classes : ["psion"],
	source : ["GMB:LL", 0],
	level : 2,
	school : "Abjur",
	time : "1 rea",
	timeFull : "1 reaction, when you are forced to make an Intelligence, Wisdom, or Charisma saving throw",
	range : "Self",
	components : "V",
	duration : "1 rnd",
	description : "Adv vs all Int, Wis, and Cha saves, and gain resistance to psychic damage",
	descriptionFull : "You protect your mind with a mantra of mundane, repetitive thoughts in order to better resist mental assault. Until the beginning of your next turn, you have advantage on all Intelligence, Wisdom, and Charisma saving throws, and you gain resistance to psychic damage.",
};

SpellsList["cerebral blast"] = {
	name : "Cerebral Blast",
	classes : ["psion"],
	source : ["GMB:LL", 0],
	level : 3,
	school : "Evoc",
	time : "1 a",
	range : "S:30ft cone",
	components : "V",
	duration : "Instantaneous",
	save : "Str",
	description : "All crea save or 5d8+1d8/SL magical bludg dmg, pushed 20ft and prone; save halves \u0026 no push",
	descriptionFull : "Your mind unleashes a mental thrust of overwhelming force in a 30-foot cone. Each creature within the area of this spell must make a Strength saving throw. On a failure, a creature takes 5d8 magical bludgeoning damage and is pushed 20 feet directly away from you, and falls prone. On a successful save, a creature takes half damage and remains in place." + AtHigherLevels + "When you cast this spell using a spell slot of 4th-level or higher, the magical bludgeoning damage increases by 1d8 for each spell slot level above 3rd."
};

SpellsList["ego scourge"] = {
	name : "Ego Scourge",
	classes : ["psion"],
	source : ["GMB:LL", 0],
	level : 4,
	school : "Evoc",
	time : "1 a",
	range : "30 ft",
	components : "V",
	duration : "Conc, 1 min",
	save : "Int",
	description : "1 crea save or disadv on all attacks, checks and can't cast spells; extra save each turn",
	descriptionFull : "You strike at the mind of a creature you can see within range, attacking its very sense of self. The target must succeed on an Intelligence saving throw or suffer disadvantage on attack rolls and ability checks, and it cannot cast spells. At the end of each of its turns, the target can repeat the saving throw. On a successful save, this effect ends on the target."
};

// Fighting styles
// NOTE: See the lack of "var" keyword, it is important as this variable has to be global to be used in other imports
FightingStylesLL = {
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
					if ((/\bfinesse\b/i).test(fields.Description)) output.extraHit += 2;
				},
				"When I'm wielding a finesse weapon in one hand and no weapon nor shield in my other hand, I do +2 on the attack roll with that melee weapon. This condition will always be false if the bonus action 'Off-hand Attack' exists."
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
					if (v.baseWeaponName == "unarmed strike" || (/\blight\b/i).test(fields.Description)) output.extraDmg += 1;
				},
				"When I'm wielding light weapons and not wearing medium or heavy armor nor a shield, I do +1 damage with light weapons and unarmed strikes."
			]
		},
		speed : {
			allModes : "+10"
		}
	},

	great_weapon : {
		name : "Great Weapon Fighting Style",
		description : desc([
				"While wielding a heavy melee weapon in two hands and making an attack with my action, I treat total damage dice rolls lower than 5 as 6"
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
				"I am proficient with improvised weapons",
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
		description : desc(["I gain proficiency with shields as martial melee weapon, which deal 2d4 bludg. damage on hit",
						"When I'm wielding a shield and nothing else, +1 to AC and attack rolls with that shield"]),
		extraAC : {
			name : "Shield Warrior Fighting Style",
			mod : 1,
			text : "I gain a +1 bonus to AC while wielding a shield and nothing else.",
			stopeval : function (v) { return !v.usingShield; }
		},
		weaponOptions : {
			regExpSearch : /(shield|bash)/i,
			name : "Shield Melee Attack",
			ability : 1,
			type : "shield melee attack",
			damage : [2, 4, "bludgeoning"],
			range : "Melee",
			list: "melee",
			abilitytodamage : true
		},
		weaponsAdd : ["Shield Melee Attack"],
		weaponProfs : [false, false, ["shield melee attack"]],
		calcChanges : {
			atkCalc : [
				function (fields, v, output) {
					for (var i = 1; i <= FieldNumbers.actions; i++) {
						if ((/off.hand.attack/i).test(What('Bonus Action ' + i))) return;
					}

					if ((/shield melee attack/i).test(v.baseWeaponName)) {
						output.extraHit += 1;
					}
				},
				"When wielding a shield and nothing else, my shield attacks get a +1 bonus on the To Hit. This condition will always be false if the bonus action 'Off-hand Attack' exists."
			]
		}
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