var iFileName = "LaserLlama - Psion.js";
RequiredSheetVersion("13.0.6");

ClassList["psion(laserllama)"] = {
  name: "Psion(LaserLlama)",
  regExpSearch: /^(?=.*psion)(?=.*laserllama).*$/i,
  source: ["GMB:LL", 0],
  primaryAbility: "Intelligence",
  prereqs: "Intelligence 13",
  die: 6,
	saves: ["Int", "Wis"],
  improvements: [0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 5, 5],
	skillstxt : {
		primary : "Choose two from Arcana, History, Insight, Medicine, Nature, Perception, and Religion"
	},

  armorProfs: {
    //required; the 4 entries are for: ["light", "medium", "heavy", "shields"]
    primary: [true, false, false, false], //required; the armor proficiencies if this is the first or only class
    secondary: [true, false, false, false], //required; the armor proficiencies if this class is multiclassed with (so not taken at level 1, but later)
  },

  weaponProfs: {
    //required; the 3 entries are for: ["simple", "martial", "other"]
    primary:[true, false], //required; the weapon proficiencies if this is the first or only class
    secondary:[true, false], //required; the weapon proficiencies if this class is multiclassed with (so not taken at level 1, but later)
  },

  equipment:
    "Psion starting equipment:\n \u2022 leather armor and a quarterstaff;\n \u2022 a light crossbow and 20 bolts -or- a sling;\n \u2022  two daggers -or- any simple weapon;\n \u2022 A scholar's pack -or- an explorer's pack.", //required; the text to display when citing the starting equipment

  subclasses: [
    "Awakening",
    [],
  ], 
  attacks: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], //required; the amount of attacks at each level. Note that there are 20 entries, one for each level.

  abilitySave: 4, //optional, but required for a spellcaster; the ability score to use for the Ability Saving Throws. Remove this line if your class has no Ability that requires Saving Throws. (Str=1, Dex=2, Con=3, Int=4, Wis=5, Cha=6)

  //abilitySaveAlt : 2,//optional; if the class offers a choice between two ability scores to be used to determine the DC, you can put that secondary one here (Str=1, Dex=2, Con=3, Int=4, Wis=5, Cha=6)

  spellcastingFactor: "psion0", //required for a spellcaster; the speed with which spell progression works type 1 for full spellcasting (Cleric), 2 for half spellcasting (Paladin), and 3 for one-third spellcasting (Arcane Trickster). This can be any positive number other than 0. Remove this line if your class has no spellcasting. If your character uses the Warlock way of spellcasting, write "warlock1" here. The 1 indicates the spell progression factor. You can change it to a 2 or 3 to have half or one-third spell progression (or to any other factor you like).
  // You can also have this refer to a Spell Slot progression you define yourself, as a separate variable (see "Homebrew Syntax - SpellTable.js"). In order to do this the name of that variable and the spellcastingFactor must match. Using the name "purplemancer" for example would mean that here you put [spellcastingFactor : "purplemancer1"] (the 1 is the factor, this can be any positive number other than 0) while for the variable containing the table you use "purplemancerSpellTable". Note that the name is all lower case!

  spellcastingList: {
    //Optional; Only needed if the class doesn't have its own spell list. This object denotes what spells the class has access to. All things in this object constrain the selection of spells that will be available. The contstraints are cumulative.

    class: "psion", //Required; The name of the class from whose spell list the spells come from. This can be "any" if the spells are not limited by a spell list of just one class. The entry has to match the name of the class in the SpellsList
      level: [0, 9],
      spells: [
          // Cantrips (0 Level)
          "blade ward ll", "friends ll", "guidance ll", "light", "mage hand", "magic stone", "message", 
          "mind sliver", "mind thrust", "minor illusion", "mystic hammer", "psionic strike", 
          "spare the dying", "sword burst ll", "thaumaturgy", "toll the dead", "true strike ll",

          // 1st Level
          "catapult", "cause fear", "charm person", "command", "comprehend languages", "detect magic", 
          "disguise self", "dissonant whispers", "ethereal anchor", "faerie fire", "hideous laughter", 
          "id insinuation", "identify", "jump ll", "magic missile", "shield ll", "sleep",

          // 2nd Level
          "blindness/deafness", "blur", "calm emotions", "crown of madness", "detect thoughts", 
          "enlarge/reduce", "hold person", "invisibility", "levitate", "locate creature ll", 
          "mind spike", "mind whip", "mirror image", "misty step", "mystic spear", 
          "phantasmal force", "see invisibility", "suggestion",

          // 3rd Level
          "blink", "cerebral blast", "clairvoyance", "enemies abound", "fear", "feign death", 
          "fly", "haste", "hypnotic pattern ll", "intellect fortress", "life transference", 
          "major image", "nondetection", "sending", "slow", "spectral passage", "tongues", "water walk",

          // 4th Level
          "arcane eye", "charm monster", "compulsion", "confusion", "dimension door", 
          "ego scourge LL", "freedom of movement", "greater invisibility", "phantasmal killer", "resilient sphere",

          // 5th Level
          "arcane hand", "dominate person", "dream", "far step", "geas", "hold monster", 
          "modify memory", "psychic crush", "scrying", "skill empowerment", "synaptic static", 
          "telekinesis", "telepathic bond", "wall of force",

          // 6th Level
          "arcane gate", "eyebite", "globe of invulnerability", "mass suggestion", "mental prison", 
          "psionic oppression", "scatter", "true seeing",

          // 7th Level
          "etherealness", "forcecage ll", "plane shift", "project image", "reverse gravity", 
          "sequester", "teleport",

          // 8th Level
          "antimagic field", "antipathy/sympathy", "dominate monster", "feeblemind", 
          "maddening darkness", "mind blank", "telepathy",

          // 9th Level
          "astral projection", "foresight", "invulnerability", "psychic scream", "time stop", "weird ll"
      ],
    },
  spellcastingKnown: {
    //Optional; Denotes the amount and type of spells the class has access to

    cantrips: [2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4], //Optional; This can either be one number, an array of 20 numbers, or be omitted for a class that doesn't have access to cantrips. The numbers reflect the amount of cantrips known

    spells: [
      2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15,
    ], //Optional; This can either be one number, an array of 20 numbers, or be omitted for a class that doesn't have access to spells. The numbers reflect the amount of spells known. For a class that doesn't know spells, but prepares them from a list, you should put "list" here. For a class that uses a spellbook, you should put "book" here.

    prepared: false, //Optional; This indicates that the class has to prepare spells like a cleric/druid/paladin/wizard
  },

  features: {
    //required;  the class features. Each works the same way, so only a couple of example are given. You can add as many as you want

    "psionics": {
      name: "Psionics",
			source : [["GMB:LL", 0]],
      minlevel: 1,
      description:
        "\n   " +
        "I have psionic power I have awakened within my psyche allow me to manifest mystical spells. It counts as spellcasting fot the purpose of features and spells like detect magic, counterspell, and antimagic field.",

      spellFirstColTitle: "Psionics", //optional, only works if spellcastingBonus exists; if set to any value, this makes the first column of the captions on the spell sheet be set to the first two letters/numbers of that value
},

    "cantrips": {
      name: "Cantrips",
			source : [["GMB:LL", 0]],
      minlevel: 1,
      description:
        "\n   " +
        "I can cast cantrips by my Psionics",
      additional: [
        "2 cantrips known",
        "2 cantrips known",
        "2 cantrips known",
        "3 cantrips known",
        "3 cantrips known",
        "3 cantrips known",
        "3 cantrips known",
        "3 cantrips known",
        "4 cantrips known",
        "4 cantrips known",
        "4 cantrips known",
        "4 cantrips known",
        "4 cantrips known",
        "4 cantrips known",
        "4 cantrips known",
        "4 cantrips known",
        "4 cantrips known",
        "4 cantrips known",
        "4 cantrips known",
        "4 cantrips known",
      ], //optional; text to display in the header of the feature. This can be one value, but can also be an array of 20 values, one for each level.
    },

    "psi points": {
      name: "Psi Points",
			source : [["GMB:LL", 0]],
      minlevel: 1,
      description:
        "\n   " +
        "I have a pool of Psi Points which I can use to cast my Psion spells spending points equal to the spell level (0 for Cantrips). I regain all expended Psi Points on a long or short rest.",
      additional: [
        "2 Psi Points",
        "3 Psi Points",
        "4 Psi Points",
        "5 Psi Points",
        "6 Psi Points",
        "7 Psi Points",
        "8 Psi Points",
        "9 Psi Points",
        "10 Psi Points",
        "11 Psi Points",
        "11 Psi Points",
        "12 Psi Points",
        "12 Psi Points",
        "13 Psi Points",
        "13 Psi Points",
        "14 Psi Points",
        "14 Psi Points",
        "15 Psi Points",
        "16 Psi Points",
        "17 Psi Points",
      ], //optional; text to display in the header of the feature. This can be one value, but can also be an array of 20 values, one for each level.
      usages: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 16, 17], //example of usages varying per level
      recovery: "short rest",
    },

    "mental limit": {
      name: "Mental Limit",
			source : [["GMB:LL", 0]],
      minlevel: 1,
      description:
        "\n   " +
        "I have a limit of the potency of spell I can manifest with my Psioncs. When a Psion feature allows me to expend Psi Points, I can never expend more Psi Points than it costs to manifest a spell of my Mental Limit Level.",
      additional: [
		"1st Level",
		"1st Level",
		"2nd Level",
		"2nd Level",
		"3rd Level",
		"3rd Level",
		"4th Level",
		"4th Level",
		"5th Level",
		"5th Level",
		"5th Level",
		"5th Level",
		"5th Level",
		"5th Level",
		"5th Level",
		"5th Level",
		"5th Level",
		"5th Level",
		"5th Level",
		"5th Level",
      ], //optional; text to display in the header of the feature. This can be one value, but can also be an array of 20 values, one for each level.
    },

    "spellcasting": {
      name: "Spellcasting",
			source : [["GMB:LL", 0]],
      minlevel: 1,
      description:
        "\n   " +
        "Intelligence is my spellcasting ability for my Psion spells."+
        "\n   " +
        "Each spell I learn from the Psion spell List must be of a level equal to my Mental Limit or lower and when I gain a Psion level I can replace a Psion spell I know with another Psion spell of my choice."+
        "\n   " +
        "My mind is my spellcasting focus for my Psion spells. I must have a free hand to cast spells that require somatic or material components, and I must still provide any material components that are consumed or have a required gold cost."+
        "\n   " +
        "Whenever you manifest a Psion spell you exhibit noticeable changes and creatures are aware that I using my psionic abilities."+
        "\n   " +
        "I cannot use my Psionics if I am wearing medium or heavy armor, or wielding a shield, unless a feature allows me to.",
      additional: [
        "2 Spells Knows",
        "3 Spells Knows",
        "4 Spells Knows",
        "5 Spells Knows",
        "6 Spells Knows",
        "7 Spells Knows",
        "8 Spells Knows",
        "9 Spells Knows",
        "10 Spells Knows",
        "10 Spells Knows",
        "11 Spells Knows",
        "11 Spells Knows",
        "12 Spells Knows",
        "12 Spells Knows",
        "13 Spells Knows",
        "13 Spells Knows",
        "14 Spells Knows",
        "14 Spells Knows",
        "15 Spells Knows",
        "15 Spells Knows",
      ],
    },

    "mystic talents": {
      name: "Mystic Talents",
			source : [["GMB:LL", 0]],
      minlevel: 2,
      description:
        "\n   " +
        "I can manifest unique powers called Mystic Talents. Whenever I gain a Psion Level i can replace a Mystic Talent I know with a new Mystic Talent as long I meet the prerequisites. I cannot replace a Talent if it is the prerequisite for another Talent.",
      additional: [
          "0 Talents",
          "2 Talents",
          "3 Talents",
          "3 Talents",
          "4 Talents",
          "4 Talents",
          "5 Talents",
          "5 Talents",
          "6 Talents",
          "6 Talents",
          "7 Talents",
          "7 Talents",
          "8 Talents",
          "8 Talents",
          "8 Talents",
          "9 Talents",
          "9 Talents",
          "9 Talents",
          "10 Talents", 
          "10 Talents",
            ], //optional; text to display in the header of the feature. This can be one value, but can also be an array of 20 values, one for each level.
      extraname : "Mystic Talents",
      extrachoices:[

          //Talents Level 1
          "Celerity I",
          "Iron Durability I",
          "Metamorphosis I",
          "Precognition I",
          "Restoration I",
          "Telekinesis I",
          "Telepathy I",
          
          //Talents Level 2
          "Celerity II",
          "Iron Durability II",
          "Metamorphosis II",
          "Precognition II",
          "Restoration II",
          "Telekinesis II",
          "Telepathy II",
          
          // //Talents Level 3
          "Celerity III",
          "Iron Durability III",
          "Metamorphosis III",
          "Precognition III",
          "Restoration III",
          "Telekinesis III",
          "Telepathy III",
          
          // //Talents Level 4
          "Celerity IV",
          "Iron Durability IV",
          "Metamorphosis IV",
          "Precognition IV",
          "Restoration IV",
          "Telekinesis IV",
          "Telepathy IV",
        ],
      extraTimes: levels.map(function(n){
          return n<2? 0 : n<3? 2:n<5?3:n<7?4:n<9?5:n<11?6:n<13?7:n<16?8:n<19?9:10;
        }),
      "celerity i" : {
				name : "Celerity I",
				description : desc(["My speed +10 feet, and I can take the Dash or Disengage action as a bonus action."]),
				submenu : "[psion level 1+]",
        speed:{walk:{spd:"+10", enc:"+10"}},				
				source : [["GMB:LL", 0]]
			},
      "celerity ii":{
        name: "Celerity II",
        submenu : "[psion level 5+]",
  description : desc(["prereq: 5th-Level Psion, Celerity I",
    "My speed additional +5 feet, I ignore difficult terrain on dash or disingage and I can move across liquids and vertical surfaces without falling until the end of my turn."]),
    speed:{walk:{spd:"+5", enc:"+5"}},		
  
	prereqeval : function() {    
		return (classes.known["psion(laserllama)"].level>=5);
	},
      },
      "celerity iii":{
        name: "Celerity III",
        submenu : "[psion level 11+]",
  description : desc(["prereq: 11th-Level Psion, Celerity I, II",
    "My speed additional +5 feet, I became invisible on dash or disingage until I stop moving or until the end of my turn."]),
    speed:{walk:{spd:"+5", enc:"+5"}},		
  
	prereqeval : function() {    
		return (classes.known["psion(laserllama)"].level>=11);
	},
      },
      "celerity iv":{
      name: "Celerity IV",
      submenu : "[psion level 16+]",
description : desc(["prereq: 16th-Level Psion, Celerity I, II, III",
  "I can take a second action but only for dash, disingage or dodge."]),
prereqeval : function() {    
  return (classes.known["psion(laserllama)"].level>=16);
},
      },
      "iron durability i" : {
				name : "Iron Durability I",
				description : desc(["Without armor, my AC is 10 + Constitution modifier + Intelligence modifier + shield"]),
				submenu : "[psion level 1+]",
				source : [["GMB:LL", 0]],
        armorOptions : [{
          regExpSearch : /^(?=.*(iron))(?=.*durability)(?=.*i).*$/i,
          name : "Iron Durability I",
          source : [["GMB:LL", 0]],
          ac : "10+Con+Int",
          dex:-10,
          affectsWildShape : true,
          selectNow : true,
          type:"light",
          }],
        armorAdd : "Iron Durability I",
      },
      "iron durability ii" : {
				name : "Iron Durability II",
				description : desc(["prereq: 5th-Level Psion, Iron Durability I",
          "As a bonus action I gain temp hp to equal my Int Mod (min of 1)."]),
        submenu : "[psion level 5+]",
				source : [["GMB:LL", 0]],
        action:["bonus action",""],
        prereqeval : function() {    
          return (classes.known["psion(laserllama)"].level>=5);
        },
			},
      "iron durability iii" : {
				name : "Iron Durability III",
				description : desc(["prereq: 11th-Level Psion, Iron Durability I, II",
          "As a reaction I can spend 3 Psi Points ot gain resistance of to the incoming damage's type.","The resistance last until I use this ability again."]),
        submenu : "[psion level 11+]",
				source : [["GMB:LL", 0]],
        action:["reaction",""],
        prereqeval : function() {    
          return (classes.known["psion(laserllama)"].level>=11);
        },
			},
      "iron durability iv" : {
				name : "Iron Durability IV",
				description : desc(["prereq: 16th-Level Psion, Iron Durability I, II, III",
          "I have resistance to all bludgeoning, piercing, slashing damage.","Whenever I take damage, it is reduced by an amount equal to my Int Mod (min of 1)."]),
        submenu : "[psion level 16+]",
				source : [["GMB:LL", 0]],
        prereqeval : function() {    
          return (classes.known["psion(laserllama)"].level>=16);
        },
        dmgres : ["Bludgeoning", "Piercing", "Slashing"]
			},
      "metamorphosis i" : {
				name : "Metamorphosis I",
				description : desc([
          "I learn the psionic strike Cantrip. I can use my Intelligence for that Cantrip, Strength checks and unarmed strikes."]),
				submenu : "[psion level 1+]",
				source : [["GMB:LL", 0]],
        spellcastingBonus : [ {
          name : "Metamorphosis I",
          firstCol : "M1C",
          spells : ["psionic strike"],
          selection : ["psionic strike"],
          times : 1
        }],
				spellChanges : {
          "psionic strike" : {
					changes : 
          "You can use Intelligence instead of Strength to calculate the damage of this spell."
				}
      },
			},
      "metamorphosis ii" : {
				name : "Metamorphosis II",
				description : desc(["prereq: 5th-Level Psion, Metamorphosis I",
          "As a bonus action I can spend 2 Psi Points to change my size (Large or Tiny) unitl 1 min or incapacitated or bonus action to end it.",
          "Large (temp hp equal to my Int Mod, +1d4 damage melee atks, adv on Str checks and saves).",
          "Tiny (I can move through 6-inches space w/out squeeze, bonus on Stealth checks equal to my Int Mod -min of 1-)."
        ]),
        submenu : "[psion level 5+]",
				source : [["GMB:LL", 0]],
        action:[
          ["bonus action", "Meta. Large (start)"],
          ["bonus action", "Meta. Large (end)"],
          ["bonus action", "Meta. Tiny (start)"],
          ["bonus action", "Meta. Tiny (end)"],
        ],
        prereqeval : function() {    
          return (classes.known["psion(laserllama)"].level>=5);
        },
			},
      "metamorphosis iii" : {
				name : "Metamorphosis III",
				description : desc(["prereq: 11th-Level Psion, Metamorphosis I, II",
          "As a bonus action I can spend 4 Psi Points to cast Polymorph (LL) targeting myself."
        ]),
        submenu : "[psion level 11+]",
				source : [["GMB:LL", 0]],
        action:[
          ["bonus action", "Meta. III Polymorph"]
        ],
        spellcastingBonus : [ {
          name : "Metamorphosis III",
          firstCol : "M-3",
          spells : ["polymorph ll"],
          selection : ["polymorph ll"],
          times : 1
        }],
				spellChanges : {
          "polymorph ll" : {
					changes : 
          "You can cast it only targeting yourself"+
          "\n   "+
          "You retain your mental ability scores, the ability to use Psionics, and any Awakening features or Mystic Talents that your new form is physically capable of using with its anatomy."
				}
      },
        prereqeval : function() {    
          return (classes.known["psion(laserllama)"].level>=11);
        },
			},
      "metamorphosis iv" : {
				name : "Metamorphosis IV",
				description : desc(["prereq: 16th-Level Psion, Metamorphosis I, II, III",
          "As a bonus action I can spend 5 Psi Points to change my size (Huge or Diminutive) unitl 1 min or incapacitated or bonus action to end it.",
          "Huge (temp hp equal to twice my Int Mod, +2d6 damage melee atks, adv on Str checks and saves).",
          "Diminutive (1-inch height, I cannot makes weapon atks, bonus on Stealth checks equal to my Psion Level)."
        ]),
        submenu : "[psion level 16+]",
				source : [["GMB:LL", 0]],
        action:[
          ["bonus action", "Meta. Huge (start)"],
          ["bonus action", "Meta. Huge (end)"],
          ["bonus action", "Meta. Diminutive (start)"],
          ["bonus action", "Meta. Diminutive (end)"],
        ],
        prereqeval : function() {    
          return (classes.known["psion(laserllama)"].level>=16);
        },
			},
      "precognition i" : {
      name : "Precognition I",
      description : desc(["I cannot be surprised unless unconscious, asleep or incapacitated. I have a bonus to my initiative rolls equal to my Intelligence modifier (minimun of +1)"]),
      submenu : "[psion level 1+]",
      source : [["GMB:LL", 0]]
      },
      "precognition ii" : {
    name : "Precognition II",
    description : desc(["prereq: 5th-Level Psion, Precognition I",
      "When I am hit by an attack I can see, I can use my reaction to have 1d4 bonus on my AC against that attack."]),
    submenu : "[psion level 5+]",
    source : [["GMB:LL", 0]],
    action:[
      ["reaction", "Precognition II"],
    ],
    prereqeval : function() {    
      return (classes.known["psion(laserllama)"].level>=5);
    },
      },
      "precognition iii" : {
  name : "Precognition III",
  description : desc(["prereq: 11th-Level Psion, Precognition I, II",
    "As a bonus action, I can enter a state (con. on it like a spell). For duration, I add 1d4 to checks, attacks amd saves."]),
  submenu : "[psion level 11+]",
  source : [["GMB:LL", 0]],
  action:[
    ["bonus action", "Precognition III"],
  ],
  prereqeval : function() {    
    return (classes.known["psion(laserllama)"].level>=11);
  },
      },
      "precognition iv" : {
name : "Precognition IV",
description : desc(["prereq: 16th-Level Psion, Precognition I, II, III",
  "As a reaction, when rolling initiative, I can take a turn before any other creatures."+"Additionally, when in precognitive state I gain an additional reaction each round, but only one reaction per trigger."]),
submenu : "[psion level 16+]",
source : [["GMB:LL", 0]],
action:[
  ["reaction", "Precognition IV"],
],
prereqeval : function() {    
  return (classes.known["psion(laserllama)"].level>=16);
},
      },
      "restoration i" : {
    name : "Restoration I",
    description : desc(["I have a Restoration Pool hit points equal my Psion Level x5. As an action, I can touch a creature to restore its HP up to what left in my pool"]),
    submenu : "[psion level 1+]",
    source : [["GMB:LL", 0]],
    action : [["action","Restoration Talent"]],
    extraLimitedFeatures : [{
      name : "Rest. Pool Points",
      usages : levels.map(function (n){return (n*5)}),
      recovery : "long rest"
    }]
      },
      "restoration ii" : {
  name : "Restoration II",
  description : desc(["prereq: 5th-Level Psion, Restoration I",
    "As an action, I can touch a creature to end blinded, charmed, defened, frightened,paralyzed, poisoned and/or stunned condition per 5 Restoration Pool points each."+
    "I can use my other Restoration Talent powers as part of one touch, expending points for each effect."
  ]),
  submenu : "[psion level 5+]",
  source : [["GMB:LL", 0]],
  prereqeval : function() {    
    return (classes.known["psion(laserllama)"].level>=5);
  },
      },
      "restoration iii" : {
name : "Restoration III",
description : desc(["prereq: 11th-Level Psion, Restoration I, II",
  "As an action, I can touch a dead creature died no longer than 10 minutes, spending 10 Restoration Pool Points, to bring it back to life with 1 Hit Point, that is not died of old age or natural causes."+
  "I can use my other Restoration Talent powers as part of one touch, expending points for each effect."
]),
submenu : "[psion level 11+]",
source : [["GMB:LL", 0]],
prereqeval : function() {    
  return (classes.known["psion(laserllama)"].level>=11);
},
      },
      "restoration iv" : {
name : "Restoration IV",
description : desc(["prereq: 16th-Level Psion, Restoration I, II, III",
  "I can use my Restoration Talent powers on any once creature that I can see within 120 feet."+
  "As an action, with 10 Restoration Pool Points, I can end the following effects: petrified, on level one level of exhaustation, reduction to an ability score or reduction to hit point maximum."
]),
submenu : "[psion level 16+]",
source : [["GMB:LL", 0]],
prereqeval : function() {    
  return (classes.known["psion(laserllama)"].level>=16);
},
      },
      "telekinesis i" : {
				name : "Telekinesis I",
				description : desc(["I learn the mage hand Cantrip. It can use my Intelligence instead of Strength and some extras."]),
				submenu : "[psion level 1+]",
				source : [["GMB:LL", 0]],
        spellcastingBonus : [ {
          name : "Telekinesis I",
          firstCol : "TkI",
          spells : ["mage hand"],
          selection : ["mage hand"],
          times : 1
        }],
				spellChanges : {
          "mage hand" : {
					changes : 
          "You can cast it without V,S components."+
          "\n   "+
          "The hand is invisible and is capable of anything you can would be capable of doing with one of your hands, including shoving, grappling, and using tools. However, it uses my Intelligence, in place of my Strength, for ability checks."+
          "\n   "+
          "The hand can push, pull, drag, or lift a number of pounds equals ot 10 times your Intelligence score (minimum of 10)."
        
				}
      },
			},
      "telekinesis ii" : {
            name : "Telekinesis II",
            description : desc(["prereq: 5th-Level Psion, Telekinesis I",
              "When I manifest mage hand, I manifest two hands that use the rules of Telekinesis I."]),
            submenu : "[psion level 5+]",
            source : [["GMB:LL", 0]],
            spellChanges : {
              "mage hand" : {
              changes : 
              "You manifest two hands instead of one."+
              "\n   "+
              "You can move one of the hands as an action or bonus action (but not both). If the mage hands are in the same space you can use both of them together, andthey are capable of anything you would be capable of doingwith both of your hands at one time."+
              "\n   "+
              "If they are in the same space and used together, the mage hands can push, pull, drag, or lift a number of pounds equal to 30 times your Intelligence score (minimum of 30)."            
            }
          },
          prereqeval : function() {    
            return (classes.known["psion(laserllama)"].level>=5);
          },
      },
      "telekinesis iii" : {
                name : "Telekinesis III",
                description : desc(["prereq: 11th-Level Psion, Telekinesis I, II",
                  "I learn the Telekinesis spell. I can cast it w/out V,S conponents (but I always need to spend Psi Points to cast it), and it last as long as I can mantain concentration."]),
                submenu : "[psion level 11+]",
                source : [["GMB:LL", 0]],
                spellcastingBonus : [ {
                  name : "Telekinesis III",
                  firstCol : "TkIII",
                  spells : ["telekinesis"],
                  selection : ["telekinesis"],
                  times : 1
                }],
                spellChanges : {
                  "telekinesis" : {
                  changes : 
                  "You  cast it without V,S components."+
                  "\n   "+
                  "It last as long as You can mantain concentration."
                
                }
              },
              prereqeval : function() {    
                return (classes.known["psion(laserllama)"].level>=11);
              },
      },
      "telekinesis iv" : {
                    name : "Telekinesis IV",
                    description : desc(["prereq: 16th-Level Psion, Telekinesis I, II, III",
                      "I can cast Telekinesis at will without spending Psi Points (regardless of Telekinesis III).", "Whenever I make a check by Mage Hand or Telekinesis, I can spend 1 Psi Points to gain advantage on the roll."]),
                    submenu : "[psion level 16+]",
                    source : [["GMB:LL", 0]],
                    prereqeval : function() {    
                      return (classes.known["psion(laserllama)"].level>=16);
                    },
      },
      "telepathy i" : { 
				name : "Telepathy I",
				description : desc(["I can communicate with any crea I can see w/in 60 feet that can speak at least a language. I can telepathic fullfill V component for one of the spells' targets so long It fullfill the Telepathy I requirements."]),
				submenu : "[psion level 1+]",
				source : [["GMB:LL", 0]]
			},
      "telepathy ii" : { 
				name : "Telepathy II",
				description : desc(["prereq: 5th-Level Psion, Telepathy I",
          "The range of my telepathy becomes 1000 feet."+
          "As an action I can telepatically link creatures eligible for Telepathy I up to my Int Mod to a Telepathic Network. Linked creature can communicate telepathically while within 1000 feet of me."]),
				submenu : "[psion level 5+]",
				source : [["GMB:LL", 0]],
        action:[["action", "Telepathic Network"]],
        prereqeval : function() {    
          return (classes.known["psion(laserllama)"].level>=5);
        },
			},
      "telepathy iii" : { 
				name : "Telepathy III",
				description : desc(["prereq: 11th-Level Psion, Telepathy I, II",
          "The range of my telepathy becomes 1 mile."+
          "I can link a creature I cannot see only if it was linked previously to my Telepathic Network."]),
				submenu : "[psion level 11+]",
				source : [["GMB:LL", 0]],
        prereqeval : function() {    
          return (classes.known["psion(laserllama)"].level>=11);
        },
			},
      "telepathy iv" : { 
				name : "Telepathy IV",
				description : desc(["prereq: 16th-Level Psion, Telepathy I, II, III",
          "My telepathy has no range limit."+
          "Whenever a creature linked to my Telepathic Network is forced to make a save I can use my reaction, and expending 1 Psi Point, to add my Int Mod to the result of the roll."]),
				submenu : "[psion level 16+]",
				source : [["GMB:LL", 0]],
        action:[["reaction", "TN Save Bonus"]],
        prereqeval : function() {    
          return (classes.known["psion(laserllama)"].level>=16);
        },
			},
    },

    subclassfeature1: {
      //You need at least one entry named "subclassfeatureX". It signals the sheet to ask the user for which subclass he would like to have. The level of this feature should match the level the class needs to select a subclass. Once a subclass is selected, any feature with "subclassfeature" in the object name in the class entry will be ignored.
      name: "Awakening",
			source : [["GMB:LL", 0]],
      minlevel: 1,
      description:
        "\n   " +
        'Choose an Awakening you strive to emulate and put it in the "Class" field' +
        "\n   " +
        "Choose either Empath, Enlightened, Immortal, Outsider, Visionary, or Wilder",
    },
    
		"psionic recovery" : {
			name : "Mystical Recovery",
			source : [["GMB:LL", 0]],
			minlevel : 2,
			description : 
      "\n   " +
      'As a bonus action, I can clear my mind and regenerate a number of expended Psi Points equal to my Intelligence modifier (minimum of 1). I can do it once per long rest.',
			recovery : "long rest",
			usages : levels.map(function (n) {
				return n < 11 ? 1 : 2;
			}),
			action : ["bonus action", ""]
		},

		"consumptive power" : {
			name : "Consumptive Power",
			source : [["GMB:LL", 0]],
			minlevel : 10,
			description :
      "\n   " + 
				"I can use my HP to fuel a psionic discipline instead of psi points"+"\n   " + 
				"I lose HP twice the Psi Point I want to spend (cannot be lessened); My HP max is reduced with the same amount until I finish my next long rest"
			,
		},

		"interior gate1" : {
			name : "First Interior Gate",
			source : [["GMB:LL", 0]],
			minlevel : 11,
			description : 
      "\n   " + 
      "I unlock the first Interior Gate and learn a 6th-level Psion spell. It does not count against my total number of Spells Known. Once between each long rest, I can manifest this Psion spell, at 6th-level, without expending Psi Points."+
      "\n   " + 
      "Whenever I gain a level I can replace this Interior Gate spell with another Psion spell of the same level",
			usages : levels.map(function (n) {
				if (n < 11) return "";
				return 1;
			}),
			recovery : "long rest",
      spellcastingBonus : [ {
				name : "First Gate Spell (6th-level)",
				firstCol : "1st-IG",
				spells : ["arcane gate", "eyebite", "globe of invulnerability", "mass suggestion","mental prison", "psionic oppression (LL)", "scatter", "true seeing"],
				selection : ["arcane gate", "eyebite", "globe of invulnerability", "mass suggestion","mental prison", "psionic oppression (LL)", "scatter", "true seeing"],
				times : 1
			}]
		},

		"interior gate2" : {
			name : "Second Interior Gate",
			source : [["GMB:LL", 0]],
			minlevel : 13,
			description : 
      "\n   " + 
      "I unlock the second Interior Gate and learn a 7th-level Psion spell. It does not count against my total number of Spells Known. Once between each long rest, I can manifest this Psion spell, at 7th-level, without expending Psi Points."+
      "\n   " + 
      "Whenever I gain a level I can replace this Interior Gate spell with another Psion spell of the same level",
			usages : levels.map(function (n) {
				if (n < 13) return "";
				return 1;
			}),
			recovery : "long rest",
      spellcastingBonus : [ {
				name : "Second Interior Gate Spell (7th-level)",
				firstCol : "2nd-IG",
				spells : ["etherealness", "force cage (LL)", "planeshit", "project image", "reverse gravity","sequester", "teleport"],
				selection : ["etherealness", "force cage (LL)", "planeshit", "project image", "reverse gravity","sequester", "teleport"],
				times : 1
			}]
		},

		"interior gate3" : {
			name : "Third Interior Gate",
			source : [["GMB:LL", 0]],
			minlevel : 15,
			description : 
      "\n   " + 
      "I unlock the third Interior Gate and learn a 8th-level Psion spell. It does not count against my total number of Spells Known. Once between each long rest, I can manifest this Psion spell, at 8th-level, without expending Psi Points."+
      "\n   " + 
      "Whenever I gain a level I can replace this Interior Gate spell with another Psion spell of the same level",
			usages : levels.map(function (n) {
				if (n < 15) return "";
				return 1;
			}),
			recovery : "long rest",
      spellcastingBonus : [ {
				name : "Third Interior Gate Spell (8th-level)",
				firstCol : "3rd-IG",
				spells : ["antimagic field","antipathy/sympathy", "dominate monster", "feeblmind", "maddenind darkness", "mind blank", "telepathy"],
				selection : ["antimagic field","antipathy/sympathy", "dominate monster", "feeblmind", "maddenind darkness", "mind blank", "telepathy"],
				times : 1
			}]
		},

		"interior gate4" : {
			name : "Fourth Interior Gate",
			source : [["GMB:LL", 0]],
			minlevel : 17,
			description : 
      "\n   " + 
      "I unlock the third Interior Gate and learn a 9th-level Psion spell. It does not count against my total number of Spells Known. Once between each long rest, I can manifest this Psion spell, at 9th-level, without expending Psi Points."+
      "\n   " + 
      "Whenever I gain a level I can replace this Interior Gate spell with another Psion spell of the same level",
			usages : levels.map(function (n) {
				if (n < 17) return "";
				return 1;
			}),
			recovery : "long rest",
      spellcastingBonus : [ {
				name : "Third Interior Gate Spell (8th-level)",
				firstCol : "3rd-IG",
				spells : ["astral projection", "foresight", "invulnerability","psychic scream", "time stop","weird (LL)"],
				selection : ["astral projection", "foresight", "invulnerability","psychic scream", "time stop","weird (LL)"],
				times : 1
			}]
		},

		"limitless" : {
			name : "Limitless",
			source : [["GMB:LL", 0]],
			minlevel : 20,
			description :
      "\n   "+
      "I am restistance to all bludgeoning, piercing, psychic and slashing damage. I stop aging, am immune to all disease, poison damage, and the poisoned condition."+
      "\n   "+
      "Finally, if I spend 10 minutes meditating or performing only light activity, I regain all of my expended Psi Points.",
			savetxt : { immune : ["poison", "disease"] },
			dmgres : ["Bludgeoning", "Piercing", "Slashing", "Psychic"]
		}

  },
};

// Empath subclass for the Psion(laserllama)
AddSubClass("psion(laserllama)","empath", {
	regExpSearch : /empath/i,
  source : [["GMB:LL", 0]],
	subname : "Empath",
	fullname : "Empath",
	features : {
		
		"subclassfeature1" : {
			name : "Empath Spells",
			source : [["GMB:LL", 0]],
			minlevel : 1,
			description :  
      "\n   " + 
      "I learn certain spells. They are Psion spells for me and don't count against my total of spells known and can't be replaced when I gain a level",
			spellcastingBonus : [ {
				name : "Empath Spells (1st-level)",
				firstCol : "EmS",
				spells : ["charm person"],
				selection : ["charm person"],
				times : 1
			}, {
				name : "Empath Spells (3rd-level)",
				firstCol : "EmS",
				spells : ["calm emotions"],
				selection : ["calm emotions"],
				times : levels.map(function (n) { return n < 3 ? 0 : 1; })
			}, {
				name : "Empath Spells (5th-level)",
				firstCol : "EmS",
				spells : ["fear"],
				selection : ["fear"],
				times : levels.map(function (n) { return n < 5 ? 0 : 1; })
			}, {
				name : "Empath Spells (7th-level)",
				firstCol : "EmS",
				spells : ["charm monster"],
				selection : ["charm monster"],
				times : levels.map(function (n) { return n < 7 ? 0 : 1; })
			}, {
				name : "Empath Spells (9th-level)",
				firstCol : "EmS",
				spells : ["dominate person"],
				selection : ["dominate person"],
				times : levels.map(function (n) { return n < 9 ? 0 : 1; })
			}]
		},
		"subclassfeature1.1" : {
			name : "Aura Sight",
			source : [["GMB:LL", 0]],
      skill:["Insight"],
			minlevel : 1,
      action:["action",""],
			description : 
      "\n   " + 
      "I gain proficiency in Insight. I can use my Intelligence instead of Wisdom for any Insight check."+
      "\n   " + 
      "As an action, I learn the most powerful emotion (for example: anger, anxiety, contentment, fear or joy) of a creature I can see within 60 feet. A creature immune to psionic, divination magic or having its thoughts read telepathically is immune to this feature."+
      "\n   " + 
      "I can use this feature a number of times equal to my Intelligence modifier (minimun of 1). I regain all expended uses on a long rest. If I have no uses left, I can expend 1 Psi Point to use this ability again.",
		},
		"subclassfeature3" : {
			name : "Emotional Flood",
			source : [["GMB:LL", 0]],
			minlevel : 3,
			action : [levels.map(function (n){return n<18?"action":"bonus action"}), ""],
			description : "\n   " + 
      "As an action, I force a creature within 30 feet to make a Charisma saving throw or inflicting one of the following:"+
      "\n   " + 
      "- Despair: It takes 1d6 psychic damage, its speed is halved and it cannot take reactions until the start of my next turn."+
      "\n   " + 
      "- Disgust: It takes 1d8 psychic damage, it cannot move closer to a creature you choose until the start of my next turn."+
      "\n   " + 
      "- Fury: It must use its reaction to make a melee attack against one target of its choice within range. If there is no target, it takse 1d10 psychic damage."
		},
		"subclassfeature6" : {
			name : "Mantel of Calm",
			source : [["GMB:LL", 0]],
			minlevel : 6,
			description : 
      "\n   " + 
      "I exude a Mantle of calming emotions in a determinated radius. Creatures of my choices within this Mantle are considered to be proficient in all Intelligence, Wisdom and Charisma saving throws."+
      "\n   " + 
      "I can also use my Aura Sight on creatures within my Mantle without expending Psi Points.",
      saves : ["Int", "Wis", "Cha"],
			additional: [
        "",
        "",
        "",
        "",
        "",
        "10-foot radius",
        "10-foot radius",
        "10-foot radius",
        "10-foot radius",
        "10-foot radius",
        "10-foot radius",
        "10-foot radius",
        "10-foot radius",
        "20-foot radius",
        "20-foot radius",
        "20-foot radius",
        "20-foot radius",
        "30-foot radius",
        "30-foot radius",
        "30-foot radius",
          ]
		},
		"subclassfeature14" : {
			name : "Empathic Control",
			source : [["GMB:LL", 0]],
			minlevel : 14,
      savetxt : { immune : ["charmed", "frightened"] },
			description : "\n   " + 
      "I have immunity to being charmed and firghtened."+
      "\n   " + 
      "WAdditionally, whenever I cause a creature to be charmed or frightened, I can expend 1 (addional) Psi Point to enhance the effect for one creature. As long its charmed or frightened by that effect, the creature's speed is 0 and it is incapacitated."
		},
		"subclassfeature18" : {
			name : "Ascended Empath",
			source : [["GMB:LL", 0]],
			minlevel : 18,
			description : "\n   " + 
      "I can use Emotional Flood as a bonus action."+
      "\n   " + 
      "Creatures charmed by me will do anything within their power to defend me for the duration, regardless of any previous loyalties they may have had."+
      "\n   " + 
      "Creatures frightened by me are stunned for the duration, so long as I am within 30 feet of it and the creature can see me."
		}
	}
});

AddSubClass("psion(laserllama)","immortal",{
	regExpSearch : /immortal/i,
  source : [["GMB:LL", 0]],
	subname : "Immortal",
	fullname : "Immortal",
  features:{	
		"subclassfeature1" : {
			name : "Immortal Spells",
			source : [["GMB:LL", 0]],
			minlevel : 1,
			description :  
      "\n   " + 
      "I learn certain spells. They are Psion spells for me and don't count against my total of spells known and can't be replaced when I gain a level",
			spellcastingBonus : [ {
				name : "Immortal Spells (1st-level)",
				firstCol : "IS",
				spells : ["jump ll"],
				selection : ["jump ll"],
				times : 1
			}, {
				name : "Immortal Spells (3rd-level)",
				firstCol : "IS",
				spells : ["blur"],
				selection : ["blur"],
				times : levels.map(function (n) { return n < 3 ? 0 : 1; })
			}, {
				name : "Immortal Spells (5th-level)",
				firstCol : "IS",
				spells : ["haste"],
				selection : ["haste"],
				times : levels.map(function (n) { return n < 5 ? 0 : 1; })
			}, {
				name : "Immortal Spells (7th-level)",
				firstCol : "IS",
				spells : ["death ward"],
				selection : ["death ward"],
				times : levels.map(function (n) { return n < 7 ? 0 : 1; })
			}, {
				name : "Immortal Spells (9th-level)",
				firstCol : "IS",
				spells : ["mislead"],
				selection : ["mislead"],
				times : levels.map(function (n) { return n < 9 ? 0 : 1; })
			}]
		},
    "subclassfeature1.1":{
      name:"Esoteric Skill",
			source : [["GMB:LL", 0]],
			minlevel : 1,
      skillstxt :  "Choose one from Acrobatics, Atheltics, Perception, Sleight of Hand or Stealth. Over 1 hour in meditation (which can be during rests), I can switch that chosen skill with another one skill of this list.",
      description :
      "\n   "+
      "I gain Prof in Acrobatics, Atheltics, Perception, Sleight of Hand or Stealth. Over 1 hour in meditation (which can be during rests), I can switch that chosen skill with another one skill of this list."+
      "\n When I make a check with any skill of this list, I can spend 1 Psi Point to add my Int Mod (min of +1) to the result of that check."
    },
    "subclassfeature1.2":{
      name : "Immortal Training",
			source : [["GMB:LL", 0]],
			minlevel : 1,
      description :
        "\n   "+
        "I gain Prof with medium armor, shields and martial weapons. I can use my Psionics while wearing medium armor and/or wielding a shield."+
        "\n Additionally, my hit point maximum increases by 1, and increase by 1 again each time I gain a Psion level.",
      armorProfs: {
        //required; the 4 entries are for: ["light", "medium", "heavy", "shields"]
        primary: [true, true, false, false], //required; the armor proficiencies if this is the first or only class
        secondary: [true, true, false, false], //required; the armor proficiencies if this class is multiclassed with (so not taken at level 1, but later)
      },    
      weaponProfs: {
        //required; the 3 entries are for: ["simple", "martial", "other"]
        primary:[true, true], //required; the weapon proficiencies if this is the first or only class
        secondary:[true, true], //required; the weapon proficiencies if this class is multiclassed with (so not taken at level 1, but later)
      },
			calcChanges : {
				hp : function (totalHD) {
					if (classes.known["psion(laserllama)"]) {
						return [classes.known["psion(laserllama)"].level, "Immortal Training (psion level)"];
					}
				}
			},
    },
    "sublcassfeature1.3":{
			name : "Immortal Will",
			source : [["GMB:LL", 0]],
			minlevel : 3,
			description :  
      "\n   " + 
      "When I am reduced to 0 hit points but not killed outright, I can expend 1 Psi Point and fall to 1 hit point instead."+
      "  Each subsequent time that I use this feature before a long rest, I must expend 1 additional Psi Point, but I cannot exceed my Mental Limit.",
    },
    "sublcassfeature1.4":{
      name: "Extra Attack",
      minlevel:6,
			source : [["GMB:LL", 0]],
      description : "I can attack twice, whenever you take the Attack action on my turn. \nMoreover, if I use my action to manifest a Psion spell or Mystic Talent, I can make a single weapon attack as a bonus action on that turn."
    },
    "sublcassfeature1.5":{
      name: "Phase Walk",
      minlevel:14,
			source : [["GMB:LL", 0]],
      description : "As a bonus action, expending 1 Psi Points I can enter in an Etheral State until the end of my current turn."+
        "\n While in this state I can move through solid objects and creatures as if they were difficult terrain. If I end my movement inside an object or creature, I am shunted to the nearest unoccupied space and take 1d10 force damage for every 5 feet I was forced to travel.",
      action :[["bonus action", "Entheral State"]]
    },
    "sublcassfeature1.6":{
      name: "Eternal Will",
      minlevel:18,
			source : [["GMB:LL", 0]],
      description : "If I begin one of my turns with less than half of my hit points remaining, but at least 1 hit point, I regaing hit points equal to my Int Mod."
    },
  }
});

AddSubClass("psion(laserllama)","enlightened",{
	regExpSearch : /enlightened/i,
  source : [["GMB:LL", 0]],
	subname : "Enlightened",
	fullname : "Enlightened",
  features:{	
		"subclassfeature1" : {
			name : "Enlightened Spells",
			source : [["GMB:LL", 0]],
			minlevel : 1,
			description :  
      "\n   " + 
      "I learn certain spells. They are Psion spells for me and don't count against my total of spells known and can't be replaced when I gain a level",
			spellcastingBonus : [ {
				name : "Enlightened Spells (1st-level)",
				firstCol : "EnS",
				spells : ["catapult"],
				selection : ["catapult"],
				times : 1
			}, {
				name : "Enlightened Spells (3rd-level)",
				firstCol : "EnS",
				spells : ["levitate"],
				selection : ["levitate"],
				times : levels.map(function (n) { return n < 3 ? 0 : 1; })
			}, {
				name : "Enlightened Spells (5th-level)",
				firstCol : "EnS",
				spells : ["spectral passage"],
				selection : ["spectral passage"],
				times : levels.map(function (n) { return n < 5 ? 0 : 1; })
			}, {
				name : "Enlightened Spells (7th-level)",
				firstCol : "EnS",
				spells : ["otiluke's resilient sphere"],
				selection : ["otiluke's resilient sphere"],
				times : levels.map(function (n) { return n < 7 ? 0 : 1; })
			}, {
				name : "Enlightened Spells (9th-level)",
				firstCol : "EnS",
				spells : ["wall of force ll"],
				selection : ["wall of force ll"],
				times : levels.map(function (n) { return n < 9 ? 0 : 1; })
			}]
		},
    "subclassfeature1.1":{
      name:"Enlightened Potential",
			source : [["GMB:LL", 0]],
			minlevel : 1,description :
      "\n   I unlock an additional Mystic Talent of my choice from the Psion Mystic Talents. This Talent doesn't count against my total of Talents Known and it can be replaced each time I gain a Psion level.",
      extraname : "Enlightened Talent",
      extrachoices:[

          //Talents Level 1
          "Celerity I",
          "Iron Durability I",
          "Metamorphosis I",
          "Precognition I",
          "Restoration I",
          "Telekinesis I",
          "Telepathy I",
          
          //Talents Level 2
          "Celerity II",
          "Iron Durability II",
          "Metamorphosis II",
          "Precognition II",
          "Restoration II",
          "Telekinesis II",
          "Telepathy II",
          
          // //Talents Level 3
          "Celerity III",
          "Iron Durability III",
          "Metamorphosis III",
          "Precognition III",
          "Restoration III",
          "Telekinesis III",
          "Telepathy III",
          
          // //Talents Level 4
          "Celerity IV",
          "Iron Durability IV",
          "Metamorphosis IV",
          "Precognition IV",
          "Restoration IV",
          "Telekinesis IV",
          "Telepathy IV",
        ],
      extraTimes:1,
      "celerity i" : {
				name : "Celerity I",
				description : desc(["My speed +10 feet, and I can take the Dash or Disengage action as a bonus action."]),
				submenu : "[psion level 1+]",
        speed:{walk:{spd:"+10", enc:"+10"}},				
				source : [["GMB:LL", 0]]
			},
      "celerity ii":{
        name: "Celerity II",
        submenu : "[psion level 5+]",
  description : desc(["prereq: 5th-Level Psion, Celerity I",
    "My speed additional +5 feet, I ignore difficult terrain on dash or disingage and I can move across liquids and vertical surfaces without falling until the end of my turn."]),
    speed:{walk:{spd:"+5", enc:"+5"}},		
  
	prereqeval : function() {    
		return (classes.known["psion(laserllama)"].level>=5);
	},
      },
      "celerity iii":{
        name: "Celerity III",
        submenu : "[psion level 11+]",
  description : desc(["prereq: 11th-Level Psion, Celerity I, II",
    "My speed additional +5 feet, I became invisible on dash or disingage until I stop moving or until the end of my turn."]),
    speed:{walk:{spd:"+5", enc:"+5"}},		
  
	prereqeval : function() {    
		return (classes.known["psion(laserllama)"].level>=11);
	},
      },
      "celerity iv":{
      name: "Celerity IV",
      submenu : "[psion level 16+]",
description : desc(["prereq: 16th-Level Psion, Celerity I, II, III",
  "I can take a second action but only for dash, disingage or dodge."]),
prereqeval : function() {    
  return (classes.known["psion(laserllama)"].level>=16);
},
      },
      "iron durability i" : {
				name : "Iron Durability I",
				description : desc(["Without armor, my AC is 10 + Constitution modifier + Intelligence modifier + shield"]),
				submenu : "[psion level 1+]",
				source : [["GMB:LL", 0]],
        armorOptions : [{
          regExpSearch : /^(?=.*(iron))(?=.*durability)(?=.*i).*$/i,
          name : "Iron Durability I",
          source : [["GMB:LL", 0]],
          ac : "10+Con+Int",
          dex:-10,
          affectsWildShape : true,
          selectNow : true,
          type:"light",
          }],
        armorAdd : "Iron Durability I",
      },
      "iron durability ii" : {
				name : "Iron Durability II",
				description : desc(["prereq: 5th-Level Psion, Iron Durability I",
          "As a bonus action I gain temp hp to equal my Int Mod (min of 1)."]),
        submenu : "[psion level 5+]",
				source : [["GMB:LL", 0]],
        action:["bonus action",""],
        prereqeval : function() {    
          return (classes.known["psion(laserllama)"].level>=5);
        },
			},
      "iron durability iii" : {
				name : "Iron Durability III",
				description : desc(["prereq: 11th-Level Psion, Iron Durability I, II",
          "As a reaction I can spend 3 Psi Points ot gain resistance of to the incoming damage's type.","The resistance last until I use this ability again."]),
        submenu : "[psion level 11+]",
				source : [["GMB:LL", 0]],
        action:["reaction",""],
        prereqeval : function() {    
          return (classes.known["psion(laserllama)"].level>=11);
        },
			},
      "iron durability iv" : {
				name : "Iron Durability IV",
				description : desc(["prereq: 16th-Level Psion, Iron Durability I, II, III",
          "I have resistance to all bludgeoning, piercing, slashing damage.","Whenever I take damage, it is reduced by an amount equal to my Int Mod (min of 1)."]),
        submenu : "[psion level 16+]",
				source : [["GMB:LL", 0]],
        prereqeval : function() {    
          return (classes.known["psion(laserllama)"].level>=16);
        },
        dmgres : ["Bludgeoning", "Piercing", "Slashing"]
			},
      "metamorphosis i" : {
				name : "Metamorphosis I",
				description : desc([
          "I learn the psionic strike Cantrip. I can use my Intelligence for that Cantrip, Strength checks and unarmed strikes."]),
				submenu : "[psion level 1+]",
				source : [["GMB:LL", 0]],
        spellcastingBonus : [ {
          name : "Metamorphosis I",
          firstCol : "M1C",
          spells : ["psionic strike"],
          selection : ["psionic strike"],
          times : 1
        }],
				spellChanges : {
          "psionic strike" : {
					changes : 
          "You can use Intelligence instead of Strength to calculate the damage of this spell."
				}
      },
			},
      "metamorphosis ii" : {
				name : "Metamorphosis II",
				description : desc(["prereq: 5th-Level Psion, Metamorphosis I",
          "As a bonus action I can spend 2 Psi Points to change my size (Large or Tiny) unitl 1 min or incapacitated or bonus action to end it.",
          "Large (temp hp equal to my Int Mod, +1d4 damage melee atks, adv on Str checks and saves).",
          "Tiny (I can move through 6-inches space w/out squeeze, bonus on Stealth checks equal to my Int Mod -min of 1-)."
        ]),
        submenu : "[psion level 5+]",
				source : [["GMB:LL", 0]],
        action:[
          ["bonus action", "Meta. Large (start)"],
          ["bonus action", "Meta. Large (end)"],
          ["bonus action", "Meta. Tiny (start)"],
          ["bonus action", "Meta. Tiny (end)"],
        ],
        prereqeval : function() {    
          return (classes.known["psion(laserllama)"].level>=5);
        },
			},
      "metamorphosis iii" : {
				name : "Metamorphosis III",
				description : desc(["prereq: 11th-Level Psion, Metamorphosis I, II",
          "As a bonus action I can spend 4 Psi Points to cast Polymorph (LL) targeting myself."
        ]),
        submenu : "[psion level 11+]",
				source : [["GMB:LL", 0]],
        action:[
          ["bonus action", "Meta. III Polymorph"]
        ],
        spellcastingBonus : [ {
          name : "Metamorphosis III",
          firstCol : "M-3",
          spells : ["polymorph ll"],
          selection : ["polymorph ll"],
          times : 1
        }],
				spellChanges : {
          "polymorph ll" : {
					changes : 
          "You can cast it only targeting yourself"+
          "\n   "+
          "You retain your mental ability scores, the ability to use Psionics, and any Awakening features or Mystic Talents that your new form is physically capable of using with its anatomy."
				}
      },
        prereqeval : function() {    
          return (classes.known["psion(laserllama)"].level>=11);
        },
			},
      "metamorphosis iv" : {
				name : "Metamorphosis IV",
				description : desc(["prereq: 16th-Level Psion, Metamorphosis I, II, III",
          "As a bonus action I can spend 5 Psi Points to change my size (Huge or Diminutive) unitl 1 min or incapacitated or bonus action to end it.",
          "Huge (temp hp equal to twice my Int Mod, +2d6 damage melee atks, adv on Str checks and saves).",
          "Diminutive (1-inch height, I cannot makes weapon atks, bonus on Stealth checks equal to my Psion Level)."
        ]),
        submenu : "[psion level 16+]",
				source : [["GMB:LL", 0]],
        action:[
          ["bonus action", "Meta. Huge (start)"],
          ["bonus action", "Meta. Huge (end)"],
          ["bonus action", "Meta. Diminutive (start)"],
          ["bonus action", "Meta. Diminutive (end)"],
        ],
        prereqeval : function() {    
          return (classes.known["psion(laserllama)"].level>=16);
        },
			},
      "precognition i" : {
      name : "Precognition I",
      description : desc(["I cannot be surprised unless unconscious, asleep or incapacitated. I have a bonus to my initiative rolls equal to my Intelligence modifier (minimun of +1)"]),
      submenu : "[psion level 1+]",
      source : [["GMB:LL", 0]]
      },
      "precognition ii" : {
    name : "Precognition II",
    description : desc(["prereq: 5th-Level Psion, Precognition I",
      "When I am hit by an attack I can see, I can use my reaction to have 1d4 bonus on my AC against that attack."]),
    submenu : "[psion level 5+]",
    source : [["GMB:LL", 0]],
    action:[
      ["reaction", "Precognition II"],
    ],
    prereqeval : function() {    
      return (classes.known["psion(laserllama)"].level>=5);
    },
      },
      "precognition iii" : {
  name : "Precognition III",
  description : desc(["prereq: 11th-Level Psion, Precognition I, II",
    "As a bonus action, I can enter a state (con. on it like a spell). For duration, I add 1d4 to checks, attacks amd saves."]),
  submenu : "[psion level 11+]",
  source : [["GMB:LL", 0]],
  action:[
    ["bonus action", "Precognition III"],
  ],
  prereqeval : function() {    
    return (classes.known["psion(laserllama)"].level>=11);
  },
      },
      "precognition iv" : {
name : "Precognition IV",
description : desc(["prereq: 16th-Level Psion, Precognition I, II, III",
  "As a reaction, when rolling initiative, I can take a turn before any other creatures."+"Additionally, when in precognitive state I gain an additional reaction each round, but only one reaction per trigger."]),
submenu : "[psion level 16+]",
source : [["GMB:LL", 0]],
action:[
  ["reaction", "Precognition IV"],
],
prereqeval : function() {    
  return (classes.known["psion(laserllama)"].level>=16);
},
      },
      "restoration i" : {
    name : "Restoration I",
    description : desc(["I have a Restoration Pool hit points equal my Psion Level x5. As an action, I can touch a creature to restore its HP up to what left in my pool"]),
    submenu : "[psion level 1+]",
    source : [["GMB:LL", 0]],
    action : [["action","Restoration Talent"]],
    extraLimitedFeatures : [{
      name : "Rest. Pool Points",
      usages : levels.map(function (n){return (n*5)}),
      recovery : "long rest"
    }]
      },
      "restoration ii" : {
  name : "Restoration II",
  description : desc(["prereq: 5th-Level Psion, Restoration I",
    "As an action, I can touch a creature to end blinded, charmed, defened, frightened,paralyzed, poisoned and/or stunned condition per 5 Restoration Pool points each."+
    "I can use my other Restoration Talent powers as part of one touch, expending points for each effect."
  ]),
  submenu : "[psion level 5+]",
  source : [["GMB:LL", 0]],
  prereqeval : function() {    
    return (classes.known["psion(laserllama)"].level>=5);
  },
      },
      "restoration iii" : {
name : "Restoration III",
description : desc(["prereq: 11th-Level Psion, Restoration I, II",
  "As an action, I can touch a dead creature died no longer than 10 minutes, spending 10 Restoration Pool Points, to bring it back to life with 1 Hit Point, that is not died of old age or natural causes."+
  "I can use my other Restoration Talent powers as part of one touch, expending points for each effect."
]),
submenu : "[psion level 11+]",
source : [["GMB:LL", 0]],
prereqeval : function() {    
  return (classes.known["psion(laserllama)"].level>=11);
},
      },
      "restoration iv" : {
name : "Restoration IV",
description : desc(["prereq: 16th-Level Psion, Restoration I, II, III",
  "I can use my Restoration Talent powers on any once creature that I can see within 120 feet."+
  "As an action, with 10 Restoration Pool Points, I can end the following effects: petrified, on level one level of exhaustation, reduction to an ability score or reduction to hit point maximum."
]),
submenu : "[psion level 16+]",
source : [["GMB:LL", 0]],
prereqeval : function() {    
  return (classes.known["psion(laserllama)"].level>=16);
},
      },
      "telekinesis i" : {
				name : "Telekinesis I",
				description : desc(["I learn the mage hand Cantrip. It can use my Intelligence instead of Strength and some extras."]),
				submenu : "[psion level 1+]",
				source : [["GMB:LL", 0]],
        spellcastingBonus : [ {
          name : "Telekinesis I",
          firstCol : "TkI",
          spells : ["mage hand"],
          selection : ["mage hand"],
          times : 1
        }],
				spellChanges : {
          "mage hand" : {
					changes : 
          "You can cast it without V,S components."+
          "\n   "+
          "The hand is invisible and is capable of anything you can would be capable of doing with one of your hands, including shoving, grappling, and using tools. However, it uses my Intelligence, in place of my Strength, for ability checks."+
          "\n   "+
          "The hand can push, pull, drag, or lift a number of pounds equals ot 10 times your Intelligence score (minimum of 10)."
        
				}
      },
			},
      "telekinesis ii" : {
            name : "Telekinesis II",
            description : desc(["prereq: 5th-Level Psion, Telekinesis I",
              "When I manifest mage hand, I manifest two hands that use the rules of Telekinesis I."]),
            submenu : "[psion level 5+]",
            source : [["GMB:LL", 0]],
            spellChanges : {
              "mage hand" : {
              changes : 
              "You manifest two hands instead of one."+
              "\n   "+
              "You can move one of the hands as an action or bonus action (but not both). If the mage hands are in the same space you can use both of them together, andthey are capable of anything you would be capable of doingwith both of your hands at one time."+
              "\n   "+
              "If they are in the same space and used together, the mage hands can push, pull, drag, or lift a number of pounds equal to 30 times your Intelligence score (minimum of 30)."            
            }
          },
          prereqeval : function() {    
            return (classes.known["psion(laserllama)"].level>=5);
          },
      },
      "telekinesis iii" : {
                name : "Telekinesis III",
                description : desc(["prereq: 11th-Level Psion, Telekinesis I, II",
                  "I learn the Telekinesis spell. I can cast it w/out V,S conponents (but I always need to spend Psi Points to cast it), and it last as long as I can mantain concentration."]),
                submenu : "[psion level 11+]",
                source : [["GMB:LL", 0]],
                spellcastingBonus : [ {
                  name : "Telekinesis III",
                  firstCol : "TkIII",
                  spells : ["telekinesis"],
                  selection : ["telekinesis"],
                  times : 1
                }],
                spellChanges : {
                  "telekinesis" : {
                  changes : 
                  "You  cast it without V,S components."+
                  "\n   "+
                  "It last as long as You can mantain concentration."
                
                }
              },
              prereqeval : function() {    
                return (classes.known["psion(laserllama)"].level>=11);
              },
      },
      "telekinesis iv" : {
                    name : "Telekinesis IV",
                    description : desc(["prereq: 16th-Level Psion, Telekinesis I, II, III",
                      "I can cast Telekinesis at will without spending Psi Points (regardless of Telekinesis III).", "Whenever I make a check by Mage Hand or Telekinesis, I can spend 1 Psi Points to gain advantage on the roll."]),
                    submenu : "[psion level 16+]",
                    source : [["GMB:LL", 0]],
                    prereqeval : function() {    
                      return (classes.known["psion(laserllama)"].level>=16);
                    },
      },
      "telepathy i" : { 
				name : "Telepathy I",
				description : desc(["I can communicate with any crea I can see w/in 60 feet that can speak at least a language. I can telepathic fullfill V component for one of the spells' targets so long It fullfill the Telepathy I requirements."]),
				submenu : "[psion level 1+]",
				source : [["GMB:LL", 0]]
			},
      "telepathy ii" : { 
				name : "Telepathy II",
				description : desc(["prereq: 5th-Level Psion, Telepathy I",
          "The range of my telepathy becomes 1000 feet."+
          "As an action I can telepatically link creatures eligible for Telepathy I up to my Int Mod to a Telepathic Network. Linked creature can communicate telepathically while within 1000 feet of me."]),
				submenu : "[psion level 5+]",
				source : [["GMB:LL", 0]],
        action:[["action", "Telepathic Network"]],
        prereqeval : function() {    
          return (classes.known["psion(laserllama)"].level>=5);
        },
			},
      "telepathy iii" : { 
				name : "Telepathy III",
				description : desc(["prereq: 11th-Level Psion, Telepathy I, II",
          "The range of my telepathy becomes 1 mile."+
          "I can link a creature I cannot see only if it was linked previously to my Telepathic Network."]),
				submenu : "[psion level 11+]",
				source : [["GMB:LL", 0]],
        prereqeval : function() {    
          return (classes.known["psion(laserllama)"].level>=11);
        },
			},
      "telepathy iv" : { 
				name : "Telepathy IV",
				description : desc(["prereq: 16th-Level Psion, Telepathy I, II, III",
          "My telepathy has no range limit."+
          "Whenever a creature linked to my Telepathic Network is forced to make a save I can use my reaction, and expending 1 Psi Point, to add my Int Mod to the result of the roll."]),
				submenu : "[psion level 16+]",
				source : [["GMB:LL", 0]],
        action:[["reaction", "TN Save Bonus"]],
        prereqeval : function() {    
          return (classes.known["psion(laserllama)"].level>=16);
        },
			},
    },
    "subclassfeature1.2":{
      name : "Mystical Precision",
			source : [["GMB:LL", 0]],
			minlevel : 3,
      description :
        "\n   "+
        "Whenever I manifest a Psion spell, I can expend 1 additional Psi Point to manifest it without providingthe spell's V and/or S components, or manifesting any of the normal outward signs of your Psionics.",
    },
    "sublcassfeature1.3":{
			name : "Focused Psioncs",
			source : [["GMB:LL", 0]],
			minlevel : 6,
			description :  
      "\n   " + 
      "Whenever I deal damage with a Psion spell or Mystic Talent, I can add my Int Mod(minimum of +1) to one damage roll, if I do not already.",
    },
    "sublcassfeature1.4":{
      name: "Telekinetic Flight",
      minlevel:14,
			source : [["GMB:LL", 0]],
      description : "I gain flying speed equal to my walking speed. While flying this way, the air around me shimmers with ambient psionic power, and rocks, dirt, and other small loose objects rise from the ground to float around you. ",
      speed:{fly : { spd : "walk", enc : 0 },}
    },
    "sublcassfeature1.5":{
      name: "Ascended Form",
      minlevel:14,
			source : [["GMB:LL", 0]],
      description : "As a bonus action, I can take on an Ascended Form up to 1 minute, I am incapacitated, or if I end it with a bonus action. While in this form I gain the following:"+
        "\n   - I become translucent and emit otherworldly brightlight, in a 5-foot radius, and dim light 5 feet beyond that."+
        "\n   - I gain resistance to all damage."+
        "\n   - My flying speed becomes 60 feet, unless it was higher."+
        "\n   - I gain the benefits of the Spectral Passage spell, but it does not require my concentration while in this form."+
        "\n Once I use this feature I must finish a long rest or expend 5 Psi Points to use it again.",
      action :[["bonus action", "Ascended Form (start)"], ["bonus action", "Ascended Form (end)"]],
			usages : 1,
			recovery : "long rest",
    },
  }
});

AddSubClass("psion(laserllama)","outsider",{
	regExpSearch : /^(?=.*outsider).*$/i,
  source : [["GMB:LL", 0]],
	subname : "Outsider",
	fullname : "Outsider",
  features:{	
		"subclassfeature1" : {
			name : "Outsider Spells",
			source : [["GMB:LL", 0]],
			minlevel : 1,
			description :  
      "\n   " + 
      "I learn certain spells. They are Psion spells for me and don't count against my total of spells known and can't be replaced when I gain a level",
			spellcastingBonus : [ {
				name : "Outsider Spells (1st-level)",
				firstCol : "OS",
				spells : ["arms of hadar"],
				selection : ["arms of hadar"],
				times : 1
			}, {
				name : "Outsider Spells (3rd-level)",
				firstCol : "OS",
				spells : ["spider climb"],
				selection : ["spider climb"],
				times : levels.map(function (n) { return n < 3 ? 0 : 1; })
			}, {
				name : "Outsider Spells (5th-level)",
				firstCol : "OS",
				spells : ["hunger of hadar"],
				selection : ["hunger of hadar"],
				times : levels.map(function (n) { return n < 5 ? 0 : 1; })
			}, {
				name : "Outsider Spells (7th-level)",
				firstCol : "OS",
				spells : ["summon aberration"],
				selection : ["summon aberration"],
				times : levels.map(function (n) { return n < 7 ? 0 : 1; })
			}, {
				name : "Outsider Spells (9th-level)",
				firstCol : "OS",
				spells : ["contact other plane"],
				selection : ["contact other plane"],
				times : levels.map(function (n) { return n < 9 ? 0 : 1; })
			}]
		},
    "subclassfeature1.1":{
      name:"Aberrant Form",
			source : [["GMB:LL", 0]],
			minlevel : 1,
      description :
      "\n   "+
      "When I have 0 Psi Poits I instantly transform into my Aberrant Form (Small or Medium, my choice) and remain in it until I regain at least 1 Psi Points."+
      "\n I can also expend all my remaining Psi Points as an action to mutate.",
      action : [levels.map(function (n){return n<3?"action":"bonus action"}), ""],
      creaturesAdd : [["Aberrant Form", true]],
			creatureOptions : [{
				name : "Aberrant Form",
				source : [["MHB:LL", 0]],
				size : [4,3],
				type : "Aberration",
        subtype:"Shapechanger",
				alignment : "",
				ac : "10+Int+Prof",
        scores:[],
				hd : [],
				speed : "30 ft, climb 30 ft, swim 30 ft",
				languages : "Deep Speech. I can understand leanguage I know but cannot speak them",
				proficiencyBonusLinked : true,
        savesLinked:true,
        scoresLinked:true,
        sense:"My normal senses",
				attacksAction : 1,
				attacks : [{
					name : "Tentacle",
					ability : 4,
					damage : [1, 8, "psychic"],
					range : "5 ft",
					description : "Melee weapon attack. ",
					modifiers : ["Int", "Prof"],
					abilitytodamage : false,
					useSpellMod : "psion(laserllama)"
				}],
				features : [{
					name : "Aberrant Vigor",
					description : "The first time I transform into this Aberrant Form between each short or long rest, i gain temporary hit points equal to twice my Psion level, which only last while I am in Aberrant Form."
				},
        {
					name : "Alien Influence",
					description : "I cannot concentrate on spells or other abilities while I am in my Aberrant Form.",
				},
        {
					name : "Improved Alien Influence",
					description : "If I have at least 1 Psi Point, I can concentrate on spells, features, and Talent while I am in my Aberrant Form, and I can revert to my normal form as a bonus action.",
          minlevel:3
				}],
				actions : [{
					name : "Tentacle Grasp",
					description : "When I hit a creature with my tentacle, I can automatically grapple a creature equal to me in size, or smaller. As an action, the grappled creature can make a Strength save, escaping on a success.",
				},{
					name : "Improved Tentacle Grasp",
					description : "If a creature starts its turn grappled by my Aberrant Form. it takes 1d4 Psychic damage.",
          minlevel:6
				},],
				traits : [{
					name : "My Aberrant Self",
					description : "This form uses my proficiency bonus (PB), Intelligence modifier (INT), and Psion Spell save DC. I retain my ability scores, alignment, personality, skill and saving throw proficiencies, and all other features from my race, class, and other sources (such as Feats and curses)."
				}],
				header : "Aberrant Form",
			}]
    },
    "sublcassfeature1.2":{
			name : "Psionic Control",
			source : [["GMB:LL", 0]],
			minlevel : 3,
			description :  
      "\n   " + 
      "While I have more than 0 Psi Points, I can mutate in or revert back from my Aberrant Form w/out expending Psi Points as a bonus action and I can concentrate on Psion spells, features and Talents while in that form.",
    },
    "sublcassfeature1.3":{
      name: "Extra Attack",
      minlevel:6,
			source : [["GMB:LL", 0]],
      description : "I can attack twice, whenever you take the Attack action on my turn. \nMoreover, if I use my action to manifest a Psion spell or Mystic Talent, I can make a single weapon attack or the Tentacle attack as a bonus action on that turn."+
      "\n Also, whenever a creature starts its turn grappled by my Aberrant Form. it takes 1d4 Psychic damage."
    },
    "sublcassfeature1.4":{
      name: "Eldritch Rift",
      minlevel:14,
			source : [["GMB:LL", 0]],
      description : "Immediately after I expend 1 or more Psi Points, I can teleport to an occupied space of my choice I can see within 30 feet of me."
    },
    "sublcassfeature1.5":{
      name: "Glimpse Beyond the Veil",
      minlevel:18,
			source : [["GMB:LL", 0]],
      description : "As an action, I can force a creature I can see w/in 60 feet to make a Charisma save agains my Spell DC or disappear into an abberrant void. At the end of my next turn it returns to the space it previously occupied or the nearest unoccupied space. If the creature is not an aberration it takes 10d12 Psychic damage when it returns. On a successful save, the creature is immune to this effect for 24 hours."+
      "\n   Once I ust this feature I cannot use it again unti I finish a rest or I expend 5 Psi Points to use it again.",
      action : ["bonus action", "Glimpse Beyond the Veil"],
    },
  }
});

AddSubClass("psion(laserllama)","visionary",{
	regExpSearch : /visionary/i,
  source : [["GMB:LL", 0]],
	subname : "Visionary",
	fullname : "Visionary",
  features:{	
		"subclassfeature1" : {
			name : "Visionary Spells",
			source : [["GMB:LL", 0]],
			minlevel : 1,
			description :  
      "\n   " + 
      "I learn certain spells. They are Psion spells for me and don't count against my total of spells known and can't be replaced when I gain a level",
			spellcastingBonus : [ {
				name : "Visionary Spells (1st-level)",
				firstCol : "VS",
				spells : ["silent image"],
				selection : ["silent image"],
				times : 1
			}, {
				name : "Visionary Spells (3rd-level)",
				firstCol : "VS",
				spells : ["blur"],
				selection : ["blur"],
				times : levels.map(function (n) { return n < 3 ? 0 : 1; })
			}, {
				name : "Immortal Spells (5th-level)",
				firstCol : "VS",
				spells : ["haste"],
				selection : ["haste"],
				times : levels.map(function (n) { return n < 5 ? 0 : 1; })
			}, {
				name : "Immortal Spells (7th-level)",
				firstCol : "VS",
				spells : ["death ward"],
				selection : ["death ward"],
				times : levels.map(function (n) { return n < 7 ? 0 : 1; })
			}, {
				name : "Immortal Spells (9th-level)",
				firstCol : "VS",
				spells : ["mislead"],
				selection : ["mislead"],
				times : levels.map(function (n) { return n < 9 ? 0 : 1; })
			}]
		},
    "subclassfeature1.1":{
      name:"Psionic Projection",
			source : [["GMB:LL", 0]],
			minlevel : 1,
      description :
      "\n   "+
      "As an action I can create an exact copy of a non magical, inanimate, object that I have seen before."+
      "\n When I make The object has an AC equal to my Int score, it persist until destroyed, I use an action to touch it and destroy it, or I create another Psionic Projection."+
      "\n The projection follow the depending on the Psi Points I expend when I create it:"+
      "\n  - 0 Psi Point: Tiny size, psion level HP; "+
      "\n  - 1 Psi Point: Small size, 10+psion level HP; "+
      "\n  - 2 Psi Point: Medium size, 20+psion level HP; "+
      "\n  - 3 Psi Point: Large size, 30+psion level HP; "+
      "\n  - 5 Psi Point: Huge size, 50+psion level HP;",
      action:[["action",""]]
    },
    "sublcassfeature1.2":{
			name : "Deadly Projections",
			source : [["GMB:LL", 0]],
			minlevel : 3,
			description :  
      "\n   " + 
      "When I create a Projection I can launcht it at a target I can see w/in 60 feet. It takes 2d6 force damage plus 2d6 for every Psi Points I expended to create the Projection. On a succes it takes half damage. Success or failure, the projection is destroyed on impact.",
    },
    "sublcassfeature1.3":{
      name: "Projected Defense",
      minlevel:6,
			source : [["GMB:LL", 0]],
      description : "When I am targeted by an attack I can see, I can use my reaction to create a defensive Psionic Projection of appropriate size between me and the attacker. The projection becomes the target of the attack in my place."+
      "\n If the triggering attack destroy the projection, I take any remaining damage.",
      action:[["reaction",""]]
    },
    "sublcassfeature1.4":{
      name: "Greater Vision",
      minlevel:14,
			source : [["GMB:LL", 0]],
      description : "I expend 1 Psi Point less to create a Psionic Projection (minimun of 0). Also, I can expend 1 additional Psi Point to grant my projection resistance to non-magical bludgeoning, piercing and slashing damage."+
      "\n Finally, I can have up to three projections but when I create a fourth one, I must choose to instantly destroy one of my projections.",
    },
    "sublcassfeature1.5":{
      name: "Visionary Journey",
      minlevel:18,
			source : [["GMB:LL", 0]],
      description : "I learn the Astral Projections spell but it does not count against my total number of Spell Known."+
      "\n Once per long rest, I can cast this spell as an action w/out expendin Psi Points or material components. If I do so, the astral form appears w/in 5 feet of my body."+
      "\n Me and the astral form share one pool of Psi Points, and my body cannot take short or long rest while I use this spell."+
      "When I have no use left I can expend 5 Psi Points to cast Astral Projection in this way again.",
      action:[["action",""]],
      spellcastingBonus : [ {
				name : "Visionary Journey",
				firstCol : "VS",
				spells : ["astral projection"],
				selection : ["astral projection"],
				times : 1
			}],
      usages:1,
      recovery: "long rest"
    },
  }
});

AddSubClass("psion(laserllama)","wilder",{
	regExpSearch : /wilder/i,
  source : [["GMB:LL", 0]],
	subname : "Wilder",
	fullname : "Wilder",
  features:{	
		"subclassfeature1" : {
			name : "Wilder Spells",
			source : [["GMB:LL", 0]],
			minlevel : 1,
			description :  
      "\n   " + 
      "I learn certain spells. They are Psion spells for me and don't count against my total of spells known and can't be replaced when I gain a level",
			spellcastingBonus : [ {
				name : "Wilder Spells (1st-level)",
				firstCol : "WS",
				spells : ["tasha's hideous laughter"],
				selection : ["tasha's hideous laughter"],
				times : 1
			}, {
				name : "Wilder Spells (3rd-level)",
				firstCol : "WS",
				spells : ["crown of madness"],
				selection : ["creown of madness"],
				times : levels.map(function (n) { return n < 3 ? 0 : 1; })
			}, {
				name : "Wilder Spells (5th-level)",
				firstCol : "WS",
				spells : ["cerebral blast"],
				selection : ["cerebral blast"],
				times : levels.map(function (n) { return n < 5 ? 0 : 1; })
			}, {
				name : "Wilder Spells (7th-level)",
				firstCol : "WS",
				spells : ["confusion"],
				selection : ["confusion"],
				times : levels.map(function (n) { return n < 7 ? 0 : 1; })
			}, {
				name : "Wilder Spells (9th-level)",
				firstCol : "WS",
				spells : ["synaptic static"],
				selection : ["synaptic static"],
				times : levels.map(function (n) { return n < 9 ? 0 : 1; })
			}]
		},
    "subclassfeature1.1":{
      name:"Inscrutable Psyche",
			source : [["GMB:LL", 0]],
			minlevel : 1,
      description :
      "\n   "+
      "Whenever I am forced to make a Intelligence, Wisdom, or Charisma saving throw, I can expend 1 Psi Point as a reaction to roll with advantage."+
      "\n If I succeed, the creature who forced me to make this saving throw takes psychic damage equal to my Psion level.",
      action:[["reaction",""]]
    },
    "subclassfeature1.2":{
      name : "Wild Psionics",
			source : [["GMB:LL", 0]],
			minlevel : 1,
      description :
        "\n   "+
        "Immediately after I expend 1 or more Psi Points, I roll a d6. If the result is equal to the Psi Points I expended, I roll a d100 on my Psionic Surge table.",
      
			toNotesPage : [{
				name : "Psionic Surge Table",
				source : [["HMB:LL", 0]],
				popupName : "Wilder's Psionic Surge Table, part 1",
				additional : "results 01-50",
				note : [
					"My Psionics can unleash surges of untamed psionic. Immediately after I expend 1 or more Psi Point, I roll a d6. If I roll a number equal to the Psi Points I expended, a Psionic Surge happens. Roll on the table below to create a random magical effect.",
					"If a Psionic effect is a spell, I am the target of or center of that spell, it use my Psion Spell save DC, and the spell effect persist on its own even if it would normally require concentration.",
					"d100  Effect",
					"01-02 Roll on this table at the start of each of your turns for 1 minute, ignoring this result on subsequent rolls.",
					"03-04 For the next minute, you can see any invisible creature if you have line of sight to it.",
					"03-05 You manifest magic missile at 5th-level targeting random creatures in range.",
					"06-08 You are the target of a levitate spell.",
					"09-11 You teleport to a random unoccupied space you can see within 60 feet.",
					"12-14 You can speak only in Deep Speech for the next 10 minutes.",
					"15-17 You gain 1d20 temporary hit points.",
					"18-20 You leave footprints that glow with an otherworldly light for the next hour.",
					"21-23 You gain the benefits of the jump (LL) spell.",
					"24-26 You manifest disguise self, taking on the appearance of the nearest humanoid.",
					"27-29 You float 1d10 inches off the ground for the next hour.",
					"30-32 Your skin is translucent for 1 minute.",
					"33-35 You are the target of a confusion spell.",
					"36-38 You loose all distinctive features and appear as an average member of your race.",
					"39-41 You emit bright light in out to a 10-foot radius for 1 minute.",
					"42-44 You briefly see a fond childhood memory of a random creature within 60 feet.",
					"45-47 You know every spell on the Psion spell list for the next minute.",
					"48-50 You gain resistance to all damage for 1 minute."
				]
			}, {
				name : "Psionic Surge Table",
				source : [["HMB:LL", 0]],
				popupName : "Wilder's Psionic Surge Table, part 2",
				additional : "results 51-100",
				note : [
					"d100  Effect",
					"51-53 Up to three creatures of your choice you can see within 30 feet take 4d10 psychic damage.",
					"54-56 You regain all expended Hit Dice.",
					"57-59 Your Strength score becomes 4 for 1 minute.",
					"60-62 You are the target of a sleep spell cast at a level equal to the number of Psi Points that triggered this Surge.",
					"63-65 For 1 minute, you can see into the Ethereal Plane out to a 30-foot radius.",
					"66-68 You are the target of a grease spell.",
					"69-71 You are frightened by the nearest creature until the end of your next turn.",
					"72-74 You are the target of a hypnotic pattern spell.",
					"75-77 You regain expended Psi Points equal to your Intelligence modifier.",
					"78-80 For 1 minute, you regain 1 Psi Point at the start of each of your turns.",
					"81-83 You can immediately take one extra action.",
					"84-86 You are the target of a blur spell.",
					"87-89 A fly spell manifests on a random creature within 60 feet of you.",
					"90-92 The first spell you manifest in the next miniute deals maximum possible damage.",
					"93-95 For 1 minute, you can teleport up to 20 feet to an unoccupied space you can see as a bonus action.",
					"96-98 You are the target of an invisibility spell.",
					"99-100 You regain all expended Psi Points."
				]
			}]
    },
    "sublcassfeature1.3":{
			name : "Psionic Eruption",
			source : [["GMB:LL", 0]],
			minlevel : 3,
			description :  
      "\n   " + 
      "When I am hit by an attack or failing a save, I can use a reaction to expend Psi Points forcing creatures w/in the range of this feature to make an Intelligence saving throw. They take 1d12 psychic damage per Psi Point expended on a fail, and half on a success.",
      additional:["","",
        "10 feet radius",
        "10 feet radius",
        "10 feet radius",
        "10 feet radius",
        "10 feet radius",
        "10 feet radius",
        "10 feet radius",
        "10 feet radius",
        "10 feet radius",
        "10 feet radius",
        "10 feet radius",
        "20 feet radius",
        "20 feet radius",
        "20 feet radius",
        "20 feet radius",
        "30 feet radius",
        "30 feet radius",
        "30 feet radius",
      ],
      action:[["reaction",""]]
    },
    "sublcassfeature1.4":{
      name: "Psychic Storm",
      minlevel:6,
			source : [["GMB:LL", 0]],
      description : "Whenever I manifest a Psion spell that deals damage, I gain a 1d8 bonus to one damage roll of that spell."
    },
    "sublcassfeature1.5":{
      name: "Mental Torrent",
      minlevel:14,
			source : [["GMB:LL", 0]],
      description : "When I force a creature within the range of this feature to make an Intelligence, Wisdom, or Charisma savingthrow to resist the effects of a Psion spell, Psion feature, or a Mystic Talent, it has disadvantage on its initial roll.",
      additional:[
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "15 feet radius",
        "15 feet radius",
        "15 feet radius",
        "15 feet radius",
        "30 feet radius",
        "30 feet radius",
        "30 feet radius",
      ]
    },
    "sublcassfeature1.6":{
      name: "Controlled Surge",
      minlevel:14,
			source : [["GMB:LL", 0]],
      description : "Whenever I trigger a Psionic Surge, I roll twice on the Psionic Surge table and choose which effect takes place."+
        "\n In addition, when I use Psionic Eruption, only creature sof my choice must make the Intelligence saving throw."
    },
    "sublcassfeature1.7":{
      name: "Unleashed Wilder",
      minlevel:18,
			source : [["GMB:LL", 0]],
      description : "When I roll damage for a Psion spell and roll the highest possible result on any of the damage dice, I roll that die again, and add its result to the total damage roll of the spell, continuing until I do not roll the highest possible result on that die."
    },
  }
});
