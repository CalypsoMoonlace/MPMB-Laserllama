

var iFileName = "LaserLlama - SpellsList.js";

RequiredSheetVersion("13.0.6");
SourceList["HMB:LL"] = {
    name: "LaserLlama Creations",
    abbreviation: "HMB:LL",
    abbreviationSpellsheet: "LL",
    group: "Third Party",
    url: "https://www.patreon.com/laserllama",
    date: "Since 2028"
};

SpellsList["acid splash ll"] = {
    name: "Acid Splash (LL)",
    nameShort: "A. Splash (LL)",
    regExpSearch: /^(?=.*acid)(?=.*splash).*$/i,
    source: ["HMB:LL", 0],
    classes: ["artificer", "magus", "sorcerer", "wizard"],
    level: 0,
    time: "1 a",
    timeFull: "1 action",
    range: "60 ft",
    rangeMetric: "18 m",
    components: "V,S",
    duration: "Instantaneous",
    save: "Dex",
    description: "5-ft rad all crea or `CD`d6 Acid dmg",
    descriptionCantripDie: "5-ft rad all crea or `CD`d6 Acid dmg",
    descriptionMetric: "1.5-m rad all crea or `CD`d6 Acid dmg",
    descriptionFull: "You hurl an orb of caustic acid at a point you can see within range. Creatures within 5 feet of that point must succeed on a Dexterity saving throw or take 1d6 acid damage." +
        AtHigherLevels +
        "The damage of this spell increases by 1d6 at 5th (2d6), 11th (3d6), and 17th level (4d6).",
    firstCol: "6",
    allowUpCasting: false,
    descriptionShorter: "5-ft rad all crea or `CD`d6 Acid dmg",
    descriptionShorterMetric: "1.5-m rad all crea or `CD`d6 Acid dmg",
    dynamicDamageBonus: {
        doNotProcess: true,
        multipleDmgMoments: false,
        allDmgTypesSingleMoment: true,
        extraDmgGroupsSameType: /((?:\+?\d+d?\d*)+)( crit)/i,
    },
};

// Beckon Air
SpellsList["beckon air"] = {
    name: "Beckon Air",
    nameShort: "B. Air",
    regExpSearch: /^(?=.*beckon)(?=.*air).*$/i,
    source: ["HMB:LL", 0],
    classes: ["druid", "magus", "sorcerer"],
    level: 0,
    school: "Trans",
    time: "1 a",
    timeFull: "1 action",
    range: "60 ft",
    rangeMetric: "18 m",
    components: "V,S",
    duration: "Instantaneous",
    save: "Str",
    description: "sensory effect // 1 crea or `CD`d6 Thunder dmg",
    descriptionCantripDie: "sensory effect // 1 crea or `CD`d6 Thunder dmg",
    descriptionMetric: "sensory effect // 1 crea or `CD`d6 Thunder dmg",
    descriptionFull: "You can manipulate the winds and use them to assault foes. When you cast this spell choose one of the following effects:" +
        "\n   " + toUni("Manipulate Air.") + " You manipulate the air in a 5-foot cube within range, creating a small sensory effect such as causing leaves to rustle, shutters to slam shut, or clothing to ripple." +
        "\n   " + toUni("Hurl Squall") + " You create a small wind squall in your hand and hurl it at a target you can see within range, forcing it to make a Strength saving throw. On a failed save, it takes 1d6 thunder damage and a Medium or smaller target is knocked back 10 feet in a straight line." +
        AtHigherLevels +
        "The damage of this Cantrip and the size target it can knock back increases by 1d6 at 5th (2d6, Large), 11th (3d6, Huge), and 17th level (4d6, Gargantuan).",
    firstCol: "6",
    allowUpCasting: false,
    descriptionShorter: "sensory effect // 1 crea or `CD`d6 Thunder dmg",
};

// Booming Blade (LL)
SpellsList["booming blade ll"] = {
    name: "Booming Blade (LL)",
    nameShort: "B. Blade (LL)",
    regExpSearch: /^(?=.*booming)(?=.*blade).*$/i,
    source: ["HMB:LL", 0],
    classes: ["artificer", "bard", "magus", "sorcerer", "warlock"],
    level: 0,
    school: "Evoc",
    time: "1 bns",
    timeFull: "1 action",
    range: "S",
    rangeMetric: "S",
    components: "V,M",
    compMaterial: "a simple or martial weapon",
    duration: "1 round",
    description: "wreathe weapon // 1 crea or `CD`d6 Thunder dmg",
    descriptionCantripDie: "wreathe weapon // 1 crea or `CD`d6 Thunder dmg",
    descriptionMetric: "wreathe weapon // 1 crea or `CD`d6 Thunder dmg",
    descriptionFull: "As a bonus action, you wreathe the melee weapon used in the casting of this spell with thunderous magic. Until the start of your next turn, your attacks with that weapon deal thunder damage in place of the weapon's normal damage type." +
        "\n    Once per casting when you deal thunder damage with this spell, you can envelop your target in thunderous energy until the start of your next turn. If the target willingly moves 5 feet or more before then, this thunderous energy explodes and it takes 1d6 thunder damage, then the energy dissipates." +
        AtHigherLevels +
        "The thunder damage dealt by this spell when the creature moves at least 5 feet increases at 5th level (1d8), 11th level (1d10), and 17th level (1d12).",
    firstCol: "6",
    allowUpCasting: false,
    descriptionShorter: "wreathe weapon // 1 crea or `CD`d6 Thunder dmg",
};

// Blade Ward (LL)
SpellsList["blade ward ll"] = {
    name: "Blade Ward (LL)",
    nameShort: "B. Ward (LL)",
    regExpSearch: /^(?=.*blade)(?=.*ward).*$/i,
    source: ["HMB:LL", 0],
    classes: ["bard", "magus", "sorcerer", "warlock", "wizard"],
    level: 0,
    school: "Abju",
    time: "1 bns",
    timeFull: "1 bonus action",
    range: "S",
    rangeMetric: "S",
    components: "V,S",
    duration: "conc, 1 min",
    description: "1d4 bludgeoning, piercing, slashing damage reduction",
    descriptionCantripDie: "1d4 bludgeoning, piercing, slashing damage reduction",
    descriptionMetric: "bludgeoning, piercing, slashing damage reduction",
    descriptionFull: "You trace a sigil of warding into the air. Whenever you take bludgeoning, piercing, or slashing damage for the duration of this spell, you can reduce the damage you would take by 1d4.",
    firstCol: "6",
    allowUpCasting: false,
    descriptionShorter: "1d4 bludgeoning, piercing, slashing damage reduction",
};

// Control Flame (LL)
SpellsList["control flame ll"] = {
    name: "Control Flame (LL)",
    nameShort: "C. Flame (LL)",
    regExpSearch: /^(?=.*control)(?=.*flame).*$/i,
    source: ["HMB:LL", 0],
    classes: ["druid", "magus", "sorcerer"],
    level: 0,
    school: "Trans",
    time: "1 a",
    timeFull: "1 action",
    range: "60 feet",
    rangeMetric: "18 m",
    components: "V,S",
    duration: "Instantaneous",
    description: "control flames // 60-feet 1 target on hit `CD`d8 Fire dmg",
    descriptionCantripDie: "control flames // 60-feet 1 target on hit `CD`d8 Fire dmg",
    descriptionMetric: "control flames // 18-m 1 target on hit `CD`d8 Fire dmg",
    descriptionFull: "You can manipulate fire and use it to assault your foes. When you cast this spell choose one of the following effects:" +
        "\n   " + toUni("Manipulate Fire.") + " You choose nonmagical flame you can see within range and that fits within a 5-foot cube and cause the flame to grow to fill the cube, extinguish all flame within the cube, change its color, or cause simple animated shapes to appear within the flames, such as creatures or locations." +
        "\n   " + toUni("Hurl Flame.") + " You create a small ball of flickering flame in your hand and hurl it at a target that you can see within range, making a ranged spell attack against it. On hit, it takes 1d8 fire damage. Flammable objects that aren't being worn or carried are ignited when hit by this spell attack." +
        AtHigherLevels + " The damage of this Cantrip increases by 1d8 at 5th (2d8), 11th (3d8), and 17th level (4d8).",
    firstCol: "6",
    allowUpCasting: false,
    descriptionShorter: "control flames // 60-feet 1 target on hit `CD`d8 Fire dmg",
};

// Friends (LL)
SpellsList["friends ll"] = {
    name: "Friends (LL)",
    nameShort: "Friends (LL)",
    regExpSearch: /^(?=.*friends).*$/i,
    source: ["HMB:LL", 0],
    classes: ["bard", "sorcerer", "wizard"],
    level: 0,
    school: "Trans",
    time: "1 a",
    timeFull: "1 action",
    range: "S",
    rangeMetric: "S",
    components: "S,M",
    compMaterial: "a small amount of makeup applied to the face as this spell is cast",
    duration: "conc, 1 min",
    description: "1 crea that can understand and hear you or adv on CHA checks",
    descriptionCantripDie: "1 crea that can understand and hear you or adv on CHA checks",
    descriptionMetric: "1 crea that can understand and hear you or adv on CHA checks",
    descriptionFull: "You lace your words with soothing magic and force a creature of your choice that can hear and understand you to make a Wisdom saving throw. On a failure, you have advantage on all Charisma checks directed at that creature for the duration." +
        "\n   On a successful save, the creature realizes that you used magic to attempt to influence it and becomes hostile toward you. A creature prone to violence might attack you, and other creatures might seek retribution against you in other ways.",
    firstCol: "6",
    allowUpCasting: false,
    descriptionShorter: "control flames // 60-feet 1 target on hit `CD`d8 Fire dmg",
};

// Glitterbeam
SpellsList["glitterbeam"] = {
    name: "Glitterbeam",
    nameShort: "Glitterbeam",
    regExpSearch: /^(?=.*glitterbeam).*$/i,
    source: ["HMB:LL", 0],
    classes: ["bard", "magus"],
    level: 0,
    school: "Evoc",
    time: "1 a",
    timeFull: "1 action",
    range: "120 feet",
    rangeMetric: "36 m",
    components: "V,S",
    duration: "Instantaneous",
    description: "120-feet 1 target on hit `CD`d8 Radiant dmg and dis on stealth",
    descriptionCantripDie: "120-feet 1 target on hit `CD`d8 Radiant dmg and dis on stealth",
    descriptionMetric: "36-m 1 target on hit `CD`d8 Radiant dmg and dis on stealth",
    descriptionFull: "You project a beam of twinkling lights at a creature or object within range. Make a ranged spell attack against the target." +
        "\n   On a hit, it takes 1d8 radiant damage. Until a creature uses an action to remove the glitter, a target hit by this spell emits bright light in a 5-foot radius and has disadvantage on any Dexterity (Stealth) checks it makes to hide or conceal itself." +
        AtHigherLevels + " The damage of this spell increases by 1d8 at 5th (2d8), 11th (3d8), and 17th level (4d8).",
    firstCol: "6",
    allowUpCasting: false,
    descriptionShorter: "120-feet 1 target on hit `CD`d8 Radiant dmg and dis on stealth",
};

// Green-Flame Blade (LL)
SpellsList["green-flame blade ll"] = {
    name: "Green-Flame Blade (LL)",
    nameShort: "G.F. Blade (LL)",
    regExpSearch: /^(?=.*green)(?=.*flame)(?=.*blade).*$/i,
    source: ["HMB:LL", 0],
    classes: ["artificer", "magus", "sorcerer", "warlock"],
    level: 0,
    school: "Evoc",
    time: "1 bns",
    timeFull: "1 bonus action",
    range: "S",
    rangeMetric: "S",
    components: "V,M",
    compMaterial: "a simple or martial melee weapon",
    duration: "Instantaneous",
    description: "wreathe weapon, on hit 5-feet another crea Fire damage once",
    descriptionCantripDie: "wreathe weapon, on hit 5-feet another crea Fire damage once",
    descriptionMetric: "wreathe weapon, on hit 1.5-m another crea Fire damage once",
    descriptionFull: "As a bonus action, you wreathe the melee weapon used in the casting of this spell with emerald flames. Until the start of your next turn, your attacks with that weapon deal fire damage in place of the weapon's normal damage type." +
        "\nOnce per casting when you deal fire damage with this spell, you can cause the flames to leap to another creature you can see within 5 feet of your target, dealing 1d6 fire damage to it." +
        AtHigherLevels + " The fire damage dealt to the second creature by this spell increases at 5th level (1d8), 11th level (1d10), and 17th level (1d12).",
    firstCol: "6",
    allowUpCasting: false,
    descriptionShorter: "wreathe weapon, on hit 1.5-m another crea Fire damage once",
};

// Guidance (LL)
SpellsList["guidance ll"] = {
    name: "Guidance (LL)",
    nameShort: "Guidance (LL)",
    regExpSearch: /^(?=.*guidance).*$/i,
    source: ["HMB:LL", 0],
    classes: ["cleric", "druid", "wizard"],
    level: 0,
    school: "Div",
    time: "1 a",
    timeFull: "1 action",
    range: "Touch",
    rangeMetric: "Touch",
    components: "V,S",
    duration: "conc, 1 min",
    description: "touch another crea, bonus on chosen skill",
    descriptionCantripDie: "touch another crea, bonus on chosen skill",
    descriptionMetric: "touch another crea, bonus on chosen skill",
    descriptionFull: "You touch another creature and infuse it with otherworldly knowledge of a skill of your choice. For the duration, it gains a 1d4 bonus to any ability checks it makes with that skill." +
        "\nIf you are proficient in the skill, this bonus becomes 1d6.",
    allowUpCasting: false,
    descriptionShorter: "touch another crea, bonus on chosen skill",
};

// Lightning Lure (LL)
SpellsList["lightning lure ll"] = {
    name: "Lightning Lure (LL)",
    nameShort: "L. Lure (LL)",
    regExpSearch: /^(?=.*lightning)(?=.*lure).*$/i,
    source: ["HMB:LL", 0],
    classes: ["artificer", "magus", "sorcerer", "warlock"],
    level: 0,
    school: "Evoc",
    time: "1 att",
    timeFull: "1 attack",
    range: "S:15ftradius",
    rangeMetric: "S:4.5-m radius",
    components: "V",
    duration: "Instantaneous",
    description: "1 crea in range, Str save or 1d8 Lightning dmg and drag",
    descriptionCantripDie: "1 crea in range, Str save or 1d8 Lightning dmg and drag",
    descriptionMetric: "1 crea in range, Str save or 1d8 Lightning dmg and drag",
    descriptionFull: "You create a lash of arcane lightning and strike at a creature of your choice you can see within 15 feet. It must succeed on a Strength saving throw or take 1d8 lightning damage and be pulled in a line to an unoccupied space within 5 feet of you." +
        AtHigherLevels + " The range of this spell increases at 5th level (20 feet), 11th level (25 feet), and 17th level (30 feet).",
    allowUpCasting: false,
    descriptionShorter: "1 crea in range, Str save or 1d8 Lightning dmg and drag",
};

// Mind Thrust
SpellsList["mind thrust"] = {
    name: "Mind Thrust",
    nameShort: "Mind Thrust",
    regExpSearch: /^(?=.*mind)(?=.*thrust).*$/i,
    source: ["HMB:LL", 0],
    classes: ["psion"],
    level: 0,
    school: "Evoc",
    time: "1 a",
    timeFull: "1 action",
    range: "120 feet",
    rangeMetric: "36 m",
    components: "V,S",
    duration: "Instantaneous",
    description: "120-feet 1 crea, on hit `CD`d10 Psychic dmg and no reaction until start your next turn",
    descriptionCantripDie: "120-feet 1 crea, on hit `CD`d10 Psychic dmg and no reaction until start your next turn",
    descriptionMetric: "36-m 1 crea, on hit `CD`d10 Psychic dmg and no reaction until start your next turn",
    descriptionFull: "You assault the mind of a creature within range with a torrent of psionic power. Make a ranged spell attack against the target." +
        "\nOn hit, the creature takes 1d10 psychic damage and it cannot take reactions until the start of your next turn." +
        AtHigherLevels + " This spell’s damage increases by 1d10 at 5th level (2d10), 11th level (3d10), and 17th level (4d10).",
    allowUpCasting: false,
    descriptionShorter: "120-feet 1 crea, on hit `CD`d10 Psychic dmg and no reaction until start your next turn",
};

// Mold Earth (LL)
SpellsList["mold earth ll"] = {
    name: "Mold Earth (LL)",
    nameShort: "Mold Earth (LL)",
    regExpSearch: /^(?=.*mold)(?=.*earth).*$/i,
    source: ["HMB:LL", 0],
    classes: ["druid", "magus", "sorcerer"],
    level: 0,
    school: "Trans",
    time: "1 a",
    timeFull: "1 action",
    range: "60 feet",
    rangeMetric: "18 m",
    components: "V,S",
    duration: "Instantaneous",
    description: "manipulate earth // 1 target, on hit `CD`d6 Bludgeoning/Piercing dmg",
    descriptionCantripDie: "manipulate earth // 1 target, on hit `CD`d6 Bludgeoning/Piercing dmg",
    descriptionMetric: "manipulate earth // 1 target, on hit `CD`d6 Bludgeoning/Piercing dmg",
    descriptionFull: "You can manipulate the earth and use it to assault your foes. When you cast this spell choose one of the following effects:" +
        "\n" + toUni("Manipulate Earth") + " You manipulate loose earth and stone in a 5-foot cube within range, harmlessly excavating, moving, and depositing it up to 5 feet away, changing it into difficult terrain, or changing difficult terrain into normal terrain." +
        "\n" + toUni("Hurl Stone") + " You create a small ball of loose stone and dirt in your hand and hurl it at a target you can see within range, making a ranged spell attack against it. On hit, it takes your choice of either 1d6 bludgeoning or piercing damage, and if the target is Small or smaller it is knocked prone." +
        AtHigherLevels + " The damage of this Cantrip and the size of targets that it knocks prone increases by 1d6 at 5th (2d6, Medium), 11th (3d6, Large), and 17th level (4d6, Huge).",
    allowUpCasting: false,
    descriptionShorter: "manipulate earth // 1 target, on hit `CD`d6 Bludgeoning/Piercing dmg",
};

// Mystic Hammer
SpellsList["mystic hammer"] = {
    name: "Mystic Hammer",
    nameShort: "M. Hammer",
    regExpSearch: /^(?=.*mystic)(?=.*hammer).*$/i,
    source: ["HMB:LL", 0],
    classes: ["psion"],
    level: 0,
    school: "Conj",
    time: "1 a",
    timeFull: "1 action",
    range: "60 feet",
    rangeMetric: "18 m",
    components: "V,S",
    duration: "Instantaneous",
    description: "1 crea, Str save or `CD`d6 Force damage and prone",
    descriptionCantripDie: "1 crea, Str save or `CD`d6 Force damage and prone",
    descriptionMetric: "1 crea, Str save or `CD`d6 Force damage and prone",
    descriptionFull: "You batter a creature within range with psionic force, forcing it to make a Strength saving throw. On a failed save, it takes 1d6 force damage and is knocked prone. Large and larger creatures have advantage on this Strength saving throw." +
        AtHigherLevels + " The damage of this Cantrip and the size of creature that makes the saving throw normally grows at 5th level (2d6, Large), 11th level (3d6, Huge), and 17th level (4d6).",
    allowUpCasting: false,
    descriptionShorter: "1 crea, Str save or `CD`d6 Force damage and prone",
};

// Otherworldly Grasp
SpellsList["otherworldly grasp"] = {
    name: "Otherworldly Grasp",
    nameShort: "O. Grasp",
    regExpSearch: /^(?=.*otherworldly)(?=.*grasp).*$/i,
    source: ["HMB:LL", 0],
    classes: ["shaman", "sorcerer", "warlock", "wizard"],
    level: 0,
    school: "Necro",
    time: "1 a",
    timeFull: "1 action",
    range: "S",
    components: "S, M",
    compMaterial: "an empty hand",
    duration: "Instantaneous",
    description: "1 crea, on hit 1d8 Necrotic dmg, gain temp HP = 1/2 dmg dealt",
    descriptionCantripDie: "1 crea, on hit `CD`d8 Necrotic dmg, gain temp HP = 1/2 dmg dealt",
    descriptionMetric: "1 crea, on hit `CD`d8 Necrotic dmg, gain temp HP = 1/2 dmg dealt",
    descriptionFull: "You channel necrotic spiritual power to your hand, changing it into a withered specter of itself. Make a melee spell attack against one creature within your reach. On a hit, it takes 1d8 necrotic damage, and you can choose to gain temporary hit points equal to half the necrotic damage dealt." +
        AtHigherLevels + " The damage of this spell increases by 1d8 at 5th level (2d8), 11th level (3d8), and 17th level (4d8).",
    allowUpCasting: false,
    descriptionShorter: "1 crea, on hit `CD`d8 Necrotic dmg, gain temp HP = 1/2 dmg dealt",
};
// Poison Spray (LL)
SpellsList["poison spray ll"] = {
    name: "Poison Spray (LL)",
    nameShort: "P. Spray (LL)",
    regExpSearch: /^(?=.*poison)(?=.*spray).*$/i,
    source: ["HMB:LL", 0],
    classes: ["artificer", "druid", "magus", "shaman", "sorcerer", "warlock", "wizard"],
    level: 0,
    school: "Necro",
    time: "1 a",
    timeFull: "1 action",
    range: "30 feet",
    rangeMetric: "9 m",
    components: "V,S",
    duration: "Instantaneous",
    description: "1 crea, on hit `CD`d12 Poison dmg",
    descriptionCantripDie: "1 crea, on hit `CD`d12 Poison dmg",
    descriptionMetric: "1 crea, on hit `CD`d12 Poison dmg",
    descriptionFull: "You raise your hand and project a toxic mist at a creature you can see within range. Make a ranged spell attack against the target. On a hit, the target takes 1d12 poison damage." +
        AtHigherLevels + " The damage of this spell increases by 1d12 at 5th level (2d12), 11th level (3d12), and 17th level (4d12).",
    allowUpCasting: false,
    descriptionShorter: "1 crea, on hit `CD`d12 Poison dmg",
};

// Primal Savagery (LL)
SpellsList["primal savagery ll"] = {
    name: "Primal Savagery (LL)",
    nameShort: "P. Savagery (LL)",
    regExpSearch: /^(?=.*primal)(?=.*savagery).*$/i,
    source: ["HMB:LL", 0],
    classes: ["druid", "shaman"],
    level: 0,
    school: "Trans",
    time: "1 att",
    timeFull: "1 attack",
    range: "S",
    components: "S, M",
    compMaterial: "an empty hand",
    duration: "Instantaneous",
    description: "1 target, on hit magical Piercing/Slashing dmg + spell mod",
    descriptionCantripDie: "1 target, on hit magical Piercing/Slashing dmg + spell mod",
    descriptionMetric: "1 target, on hit magical Piercing/Slashing dmg + spell mod",
    descriptionFull: "As part of an unarmed strike, your fingers transform into savage claws, and you use your spellcasting modifier for the attack roll. On hit, this unarmed strike deals magical piercing or slashing damage equal to 1d6 + your spellcasting modifier. Your fingers revert to normal after this unarmed strike." + 
        AtHigherLevels + " The damage die of this spell increases at 5th level (1d8), 11th level (1d10), and 17th level (1d12).",
    allowUpCasting: false,
    descriptionShorter: "1 target, on hit magical Piercing/Slashing dmg + spell mod",
};

// Psionic Strike
SpellsList["psionic strike"] = {
    name: "Psionic Strike",
    nameShort: "P. Strike",
    regExpSearch: /^(?=.*psionic)(?=.*strike).*$/i,
    source: ["HMB:LL", 0],
    classes: ["psion"],
    level: 0,
    school: "Evoc",
    time: "1 att",
    timeFull: "1 attack",
    range: "S",
    components: "S, M",
    compMaterial: "an empty hand",
    duration: "Instantaneous",
    description: "1 target, on hit Psychic dmg instead of normal dmg",
    descriptionCantripDie: "1 target, on hit Psychic dmg instead of normal dmg",
    descriptionMetric: "1 target, on hit Psychic dmg instead of normal dmg",
    descriptionFull: "As part of an unarmed strike, you manifest a blade of psionic energy in your hand. On hit, the target takes psychic damage equal to 1d6 + your Strength modifier, in place of the normal damage of your unarmed strike. Your hand instantly reverts to its normal appearance after your attack." + 
        AtHigherLevels + " The damage die of this spell increases at 5th level (1d8), 11th level (1d10), and 17th level (1d12).",
    allowUpCasting: false,
    descriptionShorter: "1 target, on hit Psychic dmg instead of normal dmg",
};

// Resistance (LL)
SpellsList["resistance ll"] = {
    name: "Resistance (LL)",
    nameShort: "Resistance (LL)",
    regExpSearch: /^(?=.*resistance).*$/i,
    source: ["HMB:LL", 0],
    classes: ["cleric", "druid", "wizard"],
    level: 0,
    school: "Abju",
    time: "1 a",
    timeFull: "1 action",
    range: "Touch",
    components: "V,S",
    duration: "conc, up to 1 min",
    description: "1 crea, 1d4 bonus to 1 save per turn",
    descriptionCantripDie: "1 crea, 1d4 bonus to 1 save per turn",
    descriptionMetric: "1 crea, 1d4 bonus to 1 save per turn",
    descriptionFull: "You weave a protective mantle of magic around one willing creature you touch. Once per turn, when the target is forced to make a saving throw, it can gain a 1d4 bonus to its roll.",
    allowUpCasting: false,
    descriptionShorter: "1 crea, 1d4 bonus to 1 save per turn",
};

// Seance
SpellsList["seance"] = {
    name: "Seance",
    nameShort: "Seance",
    regExpSearch: /^(?=.*seance).*$/i,
    source: ["HMB:LL", 0],
    classes: ["shaman"],
    level: 0,
    school: "Trans",
    time: "1 a",
    timeFull: "1 action",
    range: "30 feet",
    rangeMetric: "9 m",
    components: "V,S",
    duration: "Instantaneous",
    description: "Create harmless sensory effects, reveal ley lines, or a mote points to spiritual power or death",
    descriptionCantripDie: "Create harmless sensory effects, reveal ley lines, or a mote points to spiritual power or death",
    descriptionMetric: "Create harmless sensory effects, reveal ley lines, or a mote points to spiritual power or death",
    descriptionFull: "You channel minor spirits, allowing them to work through you so that they may once again affect change in the material world. You create one of the following effects within range:\n\n" +
        "- You create an instantaneous, harmless sensory effect, such as a flickering azure flame, an unnaturally chill breeze, rhythmic chanting, or the smell of incense.\n" +
        "- A minor spirit briefly appears and fades away.\n" +
        "- You instantaneously light or snuff out a candle, torch, or a small campfire.\n" +
        "- A mote of iridescent light points to the closest place of spiritual power, recent death, or new birth.\n" +
        "- Ley lines within range briefly reveal themselves as they flicker with otherworldly light.",
    allowUpCasting: false,
    descriptionShorter: "Create harmless sensory effects, reveal ley lines, or a mote points to spiritual power or death",
};

// Shape Water (LL)
SpellsList["shape water ll"] = {
    name: "Shape Water (LL)",
    nameShort: "S. Water (LL)",
    regExpSearch: /^(?=.*shape)(?=.*water).*$/i,
    source: ["HMB:LL", 0],
    classes: ["druid", "magus", "sorcerer"],
    level: 0,
    school: "Trans",
    time: "1 a",
    timeFull: "1 action",
    range: "60 feet",
    rangeMetric: "18 m",
    components: "V,S",
    duration: "Instantaneous",
    description: "Manipulate water // 1 crea, Dex save or `CD`d8 Cold dmg",
    descriptionCantripDie: "Manipulate water // 1 crea, Dex save or `CD`d8 Cold dmg",
    descriptionMetric: "Manipulate water // 1 crea, Dex save or `CD`d8 Cold dmg",
    descriptionFull: "You can manipulate water and use it to assault your enemies. When you cast this spell, choose one of the following effects:" +
        "\n   " + toUni("Manipulate Water.") + " You manipulate water in a 5-foot cube within range, harmlessly changing the direction it is flowing, altering its color or opacity, causing simple animated shapes to appear, or if there are no creatures in it, you can freeze it.\n" +
        "\n   " + toUni("Hurl Wave.") + " You create a small orb of tempestuous water in your hand and hurl it at one target you can see within range, forcing it to make a Dexterity saving throw. On a failed save, the target takes 1d8 cold damage, and any non-magical flame it is holding or within 5 feet of it is instantly extinguished." + 
        AtHigherLevels + " The damage of this Cantrip increases by 1d8 at 5th level (2d8), 11th level (3d8), and 17th level (4d8).",
    allowUpCasting: false,
    descriptionShorter: "Manipulate water // 1 crea, Dex save or `CD`d8 Cold dmg",
};

// Sword Burst (LL)
SpellsList["sword burst ll"] = {
    name: "Sword Burst (LL)",
    nameShort: "S. Burst (LL)",
    regExpSearch: /^(?=.*sword)(?=.*burst).*$/i,
    source: ["HMB:LL", 0],
    classes: ["magus", "warlock", "wizard"],
    level: 0,
    school: "Abj",
    time: "1 att",
    timeFull: "1 attack",
    range: "S",
    components: "V,S",
    duration: "Instantaneous",
    description: "5-ft radius all creas, Dex save or Slashing dmg",
    descriptionCantripDie: "5-ft radius all creas, Dex save or Slashing dmg",
    descriptionMetric: "5-ft radius all creas, Dex save or Slashing dmg",
    descriptionFull: "You conjure a defensive ring of spectral blades that sweep around you. Creatures within 5 feet of you must succeed on a Dexterity saving throw or take 1d6 slashing damage." + 
        AtHigherLevels + " The damage die of this spell increases at 5th level (1d8), 11th level (1d10), and 17th level (1d12).",
    allowUpCasting: false,
    descriptionShorter: "5-ft radius all creas, Dex save or Slashing dmg",
};

SpellsList["tempestuous blade"] = {
    name: "Tempestuous Blade",
    nameShort: "T. Blade",
    regExpSearch: /^(?=.*tempestuous)(?=.*blade).*$/i,
    source: ["HMB:LL", 0],
    classes: ["artificer", "bard", "magus", "warlock"],
    level: 0,
    school: "Evoc",
    time: "1 bonus action",
    timeFull: "1 bonus action",
    range: "S",
    components: "V,M",
    compMaterial: "a simple or martial melee weapon",
    duration: "1 round",
    description: "infuse weapon, trigger for lightning dmg",
    descriptionCantripDie: "infuse weapon, trigger for lightning dmg",
    descriptionMetric: "infuse weapon, trigger for lightning dmg",
    descriptionFull: "As a bonus action, you infuse the melee weapon used in the casting of this spell with electrified magic. Until the start of your next turn, your attacks with that weapon deal lightning damage in place of the weapon's normal damage type.\n   " +
        "Once per casting, when you deal lightning damage with this spell, you can infuse your target with an electrical charge until the start of your next turn. If the target uses a reaction of any kind before then, this tempestuous charge is unleashed, and it takes 1d6 lightning damage." + 
        AtHigherLevels + " The lightning damage dealt by this spell when the target uses its reaction increases at 5th level (1d8), 11th level (1d10), and 17th level (1d12).",
    allowUpCasting: false,
    descriptionShorter: "infuse weapon, trigger for lightning dmg",
};

SpellsList["true strike ll"] = {
    name: "True Strike (LL)",
    nameShort: "T. Strike (LL)",
    regExpSearch: /^(?=.*true)(?=.*strike).*$/i,
    source: ["HMB:LL", 0],
    classes: ["bard", "magus", "warlock", "wizard"],
    level: 0,
    school: "Div",
    time: "1 bonus action",
    timeFull: "1 bonus action",
    range: "S",
    components: "S,M",
    compMaterial: "a melee weapon worth at least 1 sp",
    duration: "Conc, up to 1 round",
    description: "Add bonus to your next melee attack roll",
    descriptionCantripDie: "Add bonus to your next melee attack roll",
    descriptionMetric: "Add bonus to your next melee attack roll",
    descriptionFull: "You infuse your weapon with divination magic and point it at one creature you can see. The next time you make a melee attack with this weapon against that target before the start of your next turn, you add 1d4 to your attack roll." + 
        AtHigherLevels + " This spell's attack roll bonus increases when you reach 5th level (1d6), 11th level (1d8), and 17th level (1d10).",
    allowUpCasting: false,
    descriptionShorter: "Add bonus to your next melee attack roll",
};

SpellsList["vicious mockery ll"] = {
    name: "Vicious Mockery (LL)",
    nameShort: "V. Mockery (LL)",
    regExpSearch: /^(?=.*vicious)(?=.*mockery).*$/i,
    source: ["HMB:LL", 0],
    classes: ["bard"],
    level: 0,
    school: "Ench",
    time: "1 a",
    timeFull: "1 action",
    range: "30 feet",
    components: "V",
    duration: "Instantaneous",
    description: "1 crea that can hear and understand, Wis save or `CD`d6 psychic dmg and disv on attack others",
    descriptionMetric: "1 crea that can hear and understand, Wis save or `CD`d6 psychic and dmg disv on attack others",
    descriptionFull: "You unleash a string of provoking words at a creature that can hear and understand you within range. The target must succeed on a Wisdom saving throw, or it takes 1d6 psychic damage and has disadvantage on every attack roll against targets other than you until the start of your next turn." + 
        AtHigherLevels + " This spell’s damage increases by 1d6 when you reach 5th level (2d6), 11th level (3d6), and 17th level (4d6).",
    allowUpCasting: false,
    descriptionShorter: "1 crea that can hear and understand, Wis save or `CD`d6 psychic and dmg disv on attack others",
};

SpellsList["arcane lance"] = {
    name: "Arcane Lance",
    nameShort: "Arc. Lance",
    regExpSearch: /^(?=.*arcane)(?=.*lance).*$/i,
    source: ["HMB:LL", 0],
    classes: ["magus", "wizard"],
    level: 1,
    school: "Evoc",
    time: "1 a",
    timeFull: "1 action",
    range: "90 feet",
    rangeMetric: "27 m",
    components: "V,S,M",
    compMaterial: "a clear 1-inch crystal",
    duration: "Instantaneous",
    description: "1 target, on hit 5d4 Force dmg",
    descriptionMetric: "1 target, on hit 5d4 Force dmg",
    descriptionFull: "You conjure a lance of pure arcane energy in your hand and make a ranged spell attack against a creature you can see within range. On a hit, the target takes 5d4 force damage." + 
        AtHigherLevels + " When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 2d4 for each slot level above 1st.",
    allowUpCasting: true,
    descriptionShorter: "1 target, on hit 5d4 Force dmg",
};

SpellsList["divine favor ll"] = {
    name: "Divine Favor (LL)",
    nameShort: "Div. Favor (LL)",
    regExpSearch: /^(?=.*divine)(?=.*favor).*$/i,
    source: ["HMB:LL", 0],
    classes: ["paladin"],
    level: 1,
    school: "Evoc",
    time: "1 bns",
    timeFull: "1 bonus action",
    range: "S",
    components: "V,S",
    duration: "con, 1 min",
    description: "Your prayer empowers one weapon of your choice within 10 feet of you with divine radiance. Until the spell ends, attacks with that weapon deal an extra 1d4 radiant damage on a hit.",
    descriptionCantripDie: "Your prayer empowers one weapon of your choice within 10 feet of you.",
    descriptionMetric: "Your prayer empowers one weapon of your choice within 10 feet of you.",
    descriptionFull: "Your prayer empowers one weapon of your choice within 10 feet of you with divine radiance. Until the spell ends, attacks with that weapon deal an extra 1d4 radiant damage on a hit." +
        AtHigherLevels + " When you cast this spell using a spell slot of 2nd level or higher, you target one additional weapon within 10 feet of you for each slot level above 1st.",
    allowUpCasting: true,
    descriptionShorter: "Empowers a weapon to deal an extra `CD`d4 radiant dmg.",
};

SpellsList["ensnaring strike ll"] = {
    name: "Ensnaring Strike (LL)",
    nameShort: "Ensnare Str. (LL)",
    regExpSearch: /^(?=.*ensnaring)(?=.*strike).*$/i,
    source: ["HMB:LL", 0],
    classes: ["artificer", "ranger"],
    level: 1,
    school: "Conj",
    time: "On hit",
    timeFull: "On hit",
    range: "S",
    components: "V,M",
    compMaterial: "a weapon worth at least 1 sp",
    duration: "conc, 1 min",
    description: "When you hit a creature with a weapon attack, you can cause the point of impact to explode with a writhing mass of thorny vines. The target must succeed on a Strength saving throw or be restrained by the vines until the spell ends. Creatures that are Large or larger have advantage on this saving throw.",
    descriptionMetric: "When you hit a creature with a weapon attack, you can cause an explosion of vines.",
    descriptionFull: "When you hit a creature with a weapon attack, you can cause the point of impact to explode with a writhing mass of thorny vines. The target must succeed on a Strength saving throw or be restrained by the vines until the spell ends. Creatures that are Large or larger have advantage on this saving throw. The restrained creature takes 1d6 piercing damage at the start of each of its turns. The restrained creature, or another creature within 5 feet, can use its action to make a Strength check against your Spell save DC, freeing it on a success." +
        AtHigherLevels + " When you cast this spell using a spell slot of 2nd level or higher, the damage it takes at the start of each turn increases by 1d6 for each slot level above 1st.",
    allowUpCasting: true,
    descriptionShorter: "When you hit a creature with a weapon attack, you can cause an explosion of vines.",
};

SpellsList["ethereal anchor"] = {
    name: "Ethereal Anchor",
    nameShort: "Eth. Anchor",
    regExpSearch: /^(?=.*ethereal)(?=.*anchor).*$/i,
    source: ["HMB:LL", 0],
    classes: ["paladin", "psion", "vessel"],
    level: 1,
    school: "Evoc",
    time: "1 a",
    timeFull: "1 action",
    range: "60 feet",
    components: "V,S,M",
    compMaterial: "a silver nail",
    duration: "conc, 1 min",
    description: "Ranged spell attack; 3d6 radiant dmg. On hit, target's speed is reduced to 0 for the duration.",
    descriptionMetric: "Ranged spell attack; radiant dmg. On hit, target's speed is reduced to 0 for the duration.",
    descriptionFull: "You hurl a bolt of pure spirit at a creature within range. Make a ranged spell attack against your target. On hit, it takes 3d6 radiant damage and for the duration, its speed is reduced to 0 as it is pinned in place by the spiritual bolt. As an action, any creature can make a Strength ability check against your Spell save DC, ending this spell's effects on a success." +
        AtHigherLevels + " When you cast this spell using a spell slot of 2nd level or higher, the radiant damage increases by 1d6 for each slot level above 1st.",
    allowUpCasting: true,
    descriptionShorter: "Ranged spell attack; radiant dmg. On hit, target's speed is reduced to 0 for the duration.",
};

SpellsList["ghastly flight"] = {
    name: "Ghastly Flight",
    nameShort: "Ghast. Flight",
    regExpSearch: /^(?=.*ghastly)(?=.*flight).*$/i,
    source: ["HMB:LL", 0],
    classes: ["shaman", "warlock"],
    level: 1,
    school: "Conj",
    time: "1 a",
    timeFull: "1 action",
    range: "S:60-ft line",
    components: "V,S,M",
    compMaterial: "the powdered remains of a creature",
    duration: "Instantaneous",
    description: "60-ft long, 5-ft wide line; Con save or Necrotic dmg, can't regain hp until the start of your next turn. Success: half dmg, can regain hp as normal.",
    descriptionMetric: "18-m long, 1.5-m wide line; Necrotic dmg, can't regain hp until next turn.",
    descriptionFull: "You release a malevolent spirit that flies out from you in a direction of your choice in a 60-foot long, 5-foot wide line, at which point it fades away. Each creature within the line must make a Constitution saving throw. On a failed save, creatures take 2d8 necrotic damage and cannot regain hit points until the start of your next turn. On a successful save, creatures take half as much damage and can regain hit points as normal." +
        AtHigherLevels + " When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d8 for each slot level above 1st.",
    allowUpCasting: true,
    descriptionShorter: "60-ft line; Con save or Necrotic dmg, can't regain hp until next turn.",
};

SpellsList["hail of thorns ll"] = {
    name: "Hail of Thorns (LL)",
    nameShort: "Hail Thorns (LL)",
    regExpSearch: /^(?=.*hail)(?=.*thorns).*$/i,
    source: ["HMB:LL", 0],
    classes: ["ranger"],
    level: 1,
    school: "Conj",
    time: "On hit",
    timeFull: "On hit",
    range: "60 feet",
    components: "V",
    duration: "Instantaneous",
    description: "On hit, ammunition explodes; each creature within 5 ft must Dex save or take Piercing dmg (half on success).",
    descriptionMetric: "Ammunition explodes; Piercing dmg in a 1.5 m radius (Dex save for half).",
    descriptionFull: "When you hit a creature within range with a ranged weapon attack, you can cause the piece of ammunition to explode into a hail of thorns. In addition to the normal effect of the attack, the target of your attack and each creature within 5 feet must make a Dexterity saving throw. On a failed save, creatures take 1d10 piercing damage, or half as much damage on a successful save." +
        AtHigherLevels + " When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d10 for each slot level above 1st.",
    allowUpCasting: true,
    descriptionShorter: "On hit, explode; Piercing dmg in 5-ft radius, Dex save for half.",
};

SpellsList["id insinuation"] = {
    name: "Id Insinuation",
    nameShort: "Id Insin.",
    regExpSearch: /^(?=.*id)(?=.*insinuation).*$/i,
    source: ["HMB:LL", 0],
    classes: ["psion"],
    level: 1,
    school: "Ench",
    time: "1 a",
    timeFull: "1 action",
    range: "60 feet",
    components: "V,S",
    duration: "con, 1 min",
    description: "1 crea, Wis save or be incapacitated.",
    descriptionCantripDie: "1 crea, Wis save or be incapacitated.",
    descriptionMetric: "1 crea, Wis save or be incapacitated.",
    descriptionFull: "You unleash a storm of conflicting desires within the mind of one creature you can see within range. The target must succeed on a Wisdom saving throw or be incapacitated for the duration. The creature can repeat this Wisdom saving throw at the end of each of its turns and each time it takes damage, ending the effects of the spell on a successful save." +
        AtHigherLevels + " When you cast this spell using a spell slot of 2nd level or higher, you can target one additional creature for each slot level above 1st. The creatures must be within 30 feet of each other when you target them.",
    allowUpCasting: true,
    descriptionShorter: "1 crea, Wis save or be incapacitated.",
};

SpellsList["jump ll"] = {
    name: "Jump (LL)",
    nameShort: "Jump (LL)",
    regExpSearch: /^(?=.*jump).*$/i,
    source: ["HMB:LL", 0],  // Correct source
    classes: ["artificer", "druid", "magus", "psion", "ranger", "sorcerer", "vessel", "wizard"],
    level: 1,
    school: "Trans",
    time: "1 bns",
    timeFull: "1 bonus action",
    range: "Touch",
    components: "V,S,M",
    compMaterial: "A grasshopper's hind leg",
    duration: "1 minute",
    description: "Touch a willing creature; it can jump up to 30 ft using 10 ft of movement. Can use once on each turn.",
    descriptionMetric: "Touch a willing creature; it can jump `CD` m using 3 m of movement.",
    descriptionFull: "You touch a willing creature and greatly alter its buoyancy. Once on each of its turns until the spell ends, the target can spend 10 feet of its movement to jump up to 30 feet." +
        AtHigherLevels + " When you cast this spell using a spell slot of 2nd level or higher, the distance of this magical jump increases by 10 feet for each slot level above 1st.",
    allowUpCasting: true,
    descriptionShorter: "Touch a creature; it can jump up to `CD` ft using 10 ft of movement.",
};

SpellsList["searing smite ll"] = {
    name: "Searing Smite (LL)",
    nameShort: "Searing Smite (LL)",
    regExpSearch: /^(?=.*searing)(?=.*smite).*$/i,
    source: ["HMB:LL", 0],  // Correct source
    classes: ["paladin"],
    level: 1,
    school: "Evoc",
    time: "On hit",
    timeFull: "On hit",
    range: "S",
    components: "V,M",
    compMaterial: "A melee weapon worth at least 1 sp",
    duration: "Instantaneous",
    description: "On hit, Fire dmg. Target must make a Con save or take 1Fire dmg at the start of its turns until extinguished.",
    descriptionCantripDie: "On hit, Fire dmg. Target must make a Con save or take 1Fire dmg at the start of its turns until extinguished.",
    descriptionMetric: "On hit, Fire dmg. Target must make a Con save or take 1Fire dmg at the start of its turns until extinguished.",
    descriptionFull: "When you hit with a melee weapon attack, you can cause the weapon to ignite with white-hot intensity. This attack deals 1d8 additional fire damage, and the target bursts into flames. At the start of each of its turns, it must make a Constitution saving throw. On a failed save, it takes 1d8 fire damage; on a success, the flames are extinguished. Another creature can use an action to extinguish these magical flames." + 
        " If your target is a plant, both the initial fire damage and the fire damage dealt on a failed saving throw increase by 1d8." + 
        AtHigherLevels + " When you cast this spell using a spell slot of 2nd level or higher, both the initial fire damage dealt by the attack and the fire damage dealt to the creature on a failed saving throw increase by 1d8 for each slot above 1st.",
    allowUpCasting: true,
    descriptionShorter: "On hit, Fire dmg. Target must make a Con save or take 1Fire dmg at the start of its turns until extinguished.",
};

SpellsList["shield ll"] = {
    name: "Shield (LL)",
    nameShort: "Shield (LL)",
    regExpSearch: /^(?=.*shield).*$/i,
    source: ["HMB:LL", 0],  // Correct source
    classes: ["magus", "psion", "sorcerer", "wizard"],
    level: 1,
    school: "Abju",
    time: "1 r",
    timeFull: "1 reaction, which you take when you are hit by an attack you can see or targeted by magic missile",
    range: "S",
    components: "V,S",
    duration: "Instantaneous",
    description: "Until the end of the turn, bonus to AC and take no damage from magic missile.",
    descriptionMetric: "Until the end of the turn, bonus to AC and take no damage from magic missile.",
    descriptionFull: "A shimmering barrier of magical force appears to protect you. Until the end of the current turn, you gain a bonus to your Armor Class equal to 1 + your Spellcasting modifier, and you take no damage from the magic missile spell." + 
        AtHigherLevels + " When you cast this spell using a spell slot of 2nd level or higher, the bonus to your Armor Class increases by 1 for each slot level above 1st.",
    allowUpCasting: true,
    descriptionShorter: "Until the end of the turn, bonus to AC and take no damage from magic missile.",
};

SpellsList["shield"] = {
    name: "Shield",
    nameShort: "Shield",
    regExpSearch: /^(?=.*shield).*$/i,
    source: ["HMB:LL", 0],  // Correct source
    classes: ["magus", "psion", "sorcerer", "wizard"],
    level: 1,
    school: "Abju",
    time: "1 r",
    timeFull: "1 reaction, which you take when you are hit by an attack you can see or targeted by magic missile",
    range: "S",
    components: "V,S",
    duration: "Instantaneous",
    description: "Until the end of the turn, bonus to AC and take no damage from magic missile.",
    descriptionMetric: "Until the end of the turn, bonus to AC and take no damage from magic missile.",
    descriptionFull: "A shimmering barrier of magical force appears to protect you. Until the end of the current turn, you gain a bonus to your Armor Class equal to 1 + your Spellcasting modifier, and you take no damage from the magic missile spell." + 
        AtHigherLevels + " When you cast this spell using a spell slot of 2nd level or higher, the bonus to your Armor Class increases by 1 for each slot level above 1st.",
    allowUpCasting: true,
    descriptionShorter: "Until the end of the turn, bonus to AC and take no damage from magic missile.",
};

SpellsList["thunderous smite ll"] = {
    name: "Thunderous Smite (LL)",
    nameShort: "Thunderous Smite (LL)",
    regExpSearch: /^(?=.*thunderous)(?=.*smite).*$/i,
    source: ["HMB:LL", 0],  // Correct source
    classes: ["bard", "paladin"],
    level: 1,
    school: "Evoc",
    time: "On hit",
    timeFull: "On hit",
    range: "S",
    components: "V,M",
    compMaterial: "A melee weapon worth at least 1 sp",
    duration: "Instantaneous",
    description: "On hit, Thunder dmg. Target must make a Str save or be pushed 10 ft away and fall prone.",
    descriptionMetric: "On hit, Thunder dmg. Target must make a Str save or be pushed 10 ft away and fall prone.",
    descriptionFull: "When you hit with a melee weapon attack, you can cause the weapon to explode with a thunderous shockwave audible out to 300 feet. This attack deals 1d8 additional thunder damage, and the target must succeed on a Strength saving throw or be pushed 10 feet away from you in a line and fall prone. Huge and larger targets have advantage on this saving throw." + 
        " If your target is a construct or an earth elemental, the bonus thunder damage increases by 1d8, and it has disadvantage on the Strength saving throw." + 
        AtHigherLevels + " When you cast this spell using a spell slot of 2nd level or higher, the thunder damage increases by 1d8, and the target is pushed an additional 10 feet away from you in a straight line for each spell slot level above 1st.",
    allowUpCasting: true,
    descriptionShorter: "On hit, Thunder dmg. Target must make a Str save or be pushed 10 ft away and fall prone.",
};

SpellsList["torrent"] = {
    name: "Torrent",
    nameShort: "Torrent",
    regExpSearch: /^(?=.*torrent).*$/i,
    source: ["HMB:LL", 0],  // Correct source
    classes: ["druid", "magus", "sorcerer", "wizard"],
    level: 1,
    school: "Evoc",
    time: "1 a",
    timeFull: "1 action",
    range: "S:30-ft line",
    components: "V,S,M",
    compMaterial: "A mirror",
    duration: "Instantaneous",
    description: "A burst of elemental water erupts in a 30 ft line. Str save or take Cold dmg, be knocked back and fall prone.",
    descriptionMetric: "A burst of elemental water erupts in a 9 m line. Str save or take Cold dmg, be knocked back 10 and fall prone.",
    descriptionFull: "A burst of elemental water erupts from you in a line 30 feet long and 5 feet wide in a direction you choose, forcing any creature in that area to make a Strength saving throw. On a failure, it takes 1d12 cold damage and is knocked back 10 feet in a straight line and falls prone. On a success, it takes half as much damage and is not moved or knocked prone. A Huge or larger creature has advantage on its saving throw." + 
        AtHigherLevels + " When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d12 and it knocks back 10 additional feet for each slot level above 1st.",
    allowUpCasting: true,
    descriptionShorter: "A burst of elemental water erupts in a 30 ft line. Str save or take Cold dmg, be knocked back and fall prone.",
};

// Witch Bolt ALT
SpellsList["witch bolt ll"] = {
    name: "Witch Bolt (LL)",
    nameShort: "W. Bolt (LL)",
    regExpSearch: /^(?=.*witch)(?=.*bolt).*$/i,
    source: ["HMB:LL", 0],
    classes: ["artificer", "magus", "sorcerer", "warlock", "wizard"],
    level: 1,
    school: "Conj",
    time: "1 action",
    timeFull: "1 action",
    range: "30-ft",
    components: "V,S,M",
    compMaterial: "a piece of wood struck by lightning",
    duration: "conc, 1 min",
    description: "1 target; on hit, Lightning damage; no more than 30 ft apart.",
    descriptionFull: "You create a beam of crackling energy that lances out toward a creature within range, forming a sustained arc of lightning between you and the target. Make a ranged spell attack against the target. On a hit, the target takes 1d12 lightning damage, and neither you nor the target can move more than 30 feet away from each other while this spell lasts." +
        " You can use your action on subsequent turns to deal an additional 1d12 lightning damage to the target. A creature can attempt to move beyond the range of the spell by using its action to make a Strength check against your Spell save DC. Any attempts by the target or another creature (magical or mundane) to move the target beyond this range automatically fail." +
        " The spell immediately ends if you are forced to move more than 30 feet away from the target." +
        AtHigherLevels + " When you cast this spell using a spell slot of 2nd level or higher, both the initial and subsequent damage increase by 1d12 for each slot level above 1st.",
    allowUpCasting: true,
};

// Wrathful Smite ALT
SpellsList["wrathful smite ll"] = {
    name: "Wrathful Smite (LL)",
    nameShort: "Wrath. Smite (LL)",
    regExpSearch: /^(?=.*wrathful)(?=.*smite).*$/i,
    source: ["HMB:LL", 0],
    classes: ["paladin"],
    level: 1,
    school: "Evoc",
    time: "On hit",
    timeFull: "On hit",
    range: "S",
    components: "V,M",
    compMaterial: "a melee weapon worth at least 1 sp",
    duration: "conc, 1 min",
    description: "On hit, Psychic dmg; Wis save or frightened.",
    descriptionFull: "When you hit with a melee weapon attack, you can cause the weapon to strike at both body and mind. This attack deals an additional 1d8 psychic damage, and the target must succeed on a Wisdom saving throw, or it is frightened of you until the spell ends. As an action, the creature can repeat this Wisdom saving throw, ending the effects of the spell on a success." +
        " If your target is an aberration or can speak telepathically, this bonus psychic damage increases by 1d8." +
        AtHigherLevels + " When you cast this spell using a spell slot of 2nd-level or higher, the psychic damage increases by 1d8 for each spell slot level above 1st.",
    allowUpCasting: true,
};

// Aura of Frost
SpellsList["aura of frost"] = {
    name: "Aura of Frost",
    nameShort: "Aura of Frost",
    regExpSearch: /^(?=.*aura)(?=.*frost).*$/i,
    source: ["HMB:LL", 0],
    classes: ["druid", "magus", "sorcerer"],
    level: 2,
    school: "Conj",
    time: "1 action",
    timeFull: "1 action",
    range: "Self",
    components: "V",
    duration: "conc, 1 min",
    description: "10 ft radius; Cold dmg & speed -20 ft on failed Con save.",
    descriptionFull: "Arcane frost, snow, and wind swirl about you in an aura with a 10-foot radius, and until the spell ends, the aura moves with you, centered on you. When a creature other than you enters the area for the first time on a turn or starts its turn there, it must succeed on a Constitution saving throw or it takes 2d8 cold damage and its speed is reduced by 20 feet until the start of its next turn. On a successful save, it takes half as much cold damage and its speed isn't reduced." +
        AtHigherLevels + " When you cast this spell using a spell slot of 3rd-level or higher, a creature that fails its save takes an additional 1d8 cold damage and has its speed reduced by an additional 10 feet for each spell level above 2nd.",
    allowUpCasting: true,
};

// Branding Smite
SpellsList["branding smite ll"] = {
    name: "Branding Smite (LL)",
    nameShort: "Branding Smite (LL)",
    regExpSearch: /^(?=.*branding)(?=.*smite).*$/i,
    source: ["HMB:LL", 0],
    classes: ["paladin"],
    level: 2,
    school: "Evoc",
    time: "On hit",
    timeFull: "On hit",
    range: "Self",
    components: "V, M",
    compMaterial: "a melee weapon worth at least 1 sp",
    duration: "conc, 1 min",
    description: "Radiant damage, target sheds dim light and is visible.",
    descriptionFull: "When you hit with a melee weapon attack, you can cause the weapon to gleam with an otherworldly astral radiance. This attack deals 2d8 bonus radiant damage, and the target sheds dim light out to a 5-foot radius until the spell ends. The target also becomes visible if it was invisible and cannot become invisible by magical or mundane means for the duration." +
        " If your target is a fiend or undead, or if it has the sunlight sensitivity trait, the bonus radiant damage increases by 1d8." +
        AtHigherLevels + " When you cast this spell using a spell slot of 3rd-level or higher, the radiant damage increases by 1d8 for each spell slot level above 2nd.",
    allowUpCasting: true,
};

// Cordon of Arrows
SpellsList["cordon of arrows ll"] = {
    name: "Cordon of Arrows (LL)",
    nameShort: "Cordon of Arrows (LL)",
    regExpSearch: /^(?=.*cordon)(?=.*arrows).*$/i,
    source: ["HMB:LL", 0],
    classes: ["artificer", "ranger"],
    level: 2,
    school: "Trans",
    time: "1 a",
    timeFull: "1 action",
    range: "5 feet",
    components: "V, S, M ",
    compMaterial: "three or more arrows or bolts",
    duration: "8 hours",
    description: "Traps ammo in the ground, damaging first creature within range.",
    descriptionFull: "You plant three pieces of ranged weapon ammunition in the ground within range and transmute them to protect the area. The first creature to move within 30 feet of this enchanted ammunition must make a Dexterity saving throw. The target takes 3d6 piercing damage on a failed save, and half as much piercing damage on a successful save." +
        " As part of casting this spell, you can designate any number of creatures you choose, and the spell ignores them.",
    atHigherLevels: "When you cast this spell using a spell slot of 3rd-level or higher, the amount of ammunition that can be transmuted increases by two for each slot level above 2nd. For each additional piece of ammunition you transmute with this spell, the damage increases by 1d6.",
    allowUpCasting: true,
};

// Elemental Blade
SpellsList["elemental blade"] = {
    name: "Elemental Blade",
    nameShort: "Elemental Blade",
    regExpSearch: /^(?=.*elemental)(?=.*blade).*$/i,
    source: ["HMB:LL", 0],
    classes: ["druid", "magus", "sorcerer"],
    level: 2,
    school: "Conj",
    time: "1 bns",
    timeFull: "1 bonus action",
    range: "Self",
    components: "V, S, M",
    compMaterial: "a charred wooden hilt",
    duration: "conc, 10 min",
    description: "Evokes a melee elemental blade that deals chosen damage type.",
    descriptionFull: "You evoke an elemental blade in a free hand, choosing one of the following damage types: acid, cold, fire, lightning, poison, or thunder. The elemental blade appears as if it were made of the chosen element and lasts for the duration. If you let go of the blade, it disappears, but you can evoke the blade again as a bonus action without expending a spell slot." +
        " Whenever you would make a melee attack, you can make a melee spell attack with the elemental blade against a target within your reach. On hit, it takes damage of the chosen type equal to 2d6 + your spellcasting modifier." +
        " While in your hand, the blade sheds bright light in a 10-foot radius and dim light an additional 10 feet beyond that."+
        AtHigherLevels + "When you cast this spell using a spell slot of 4th level or higher, the damage increases by 1d6 for every two slot levels above 2nd.",
    allowUpCasting: true,
};

// Find Steed
SpellsList["find steed ll"] = {
    name: "Find Steed (LL)",
    nameShort: "Find Steed (LL)",
    regExpSearch: /^(?=.*find)(?=.*steed).*$/i,
    source: ["HMB:LL", 0],
    classes: ["paladin"],
    level: 2,
    school: "Conj",
    time: "1 min",
    timeFull: "1 minute",
    range: "30 feet",
    components: "V, S",
    duration: "Instantaneous",
    description: "Conjures a loyal steed that bonds to you.",
    descriptionFull: "You conjure a spirit in an unoccupied space within range that assumes the form of a supernaturally intelligent, strong, and loyal steed, which is instantly bonded to you. The Steed takes on the form of a Medium or Large quadrupedal beast that you have seen before with a CR of 1/2 or lower that does not have a climbing, flying, or swimming speed. Examples include: elk, camel, giant goat, mastiff, pony, or warhorse." +
        " Your Steed uses the stat block of the form chosen for it, but its creature type now reflects your alignment: celestial (good), fey (neutral), or fiend (evil). The Steed's Intelligence becomes 6 if it was lower, and it understands one language you speak." +
        " In combat, the Steed shares your initiative and acts during your turn. You control the Steed and choose how it acts, both in and out of combat. While mounted on it, you can make any spell you cast that targets only you also target your steed." +
        " While you and your Steed are within 1 mile of one another, you can use a special form of telepathy to communicate." +
        " If your Steed is reduced to 0 hit points, it disappears. You can also use a bonus action to dismiss your Steed, causing it to disappear. Should you cast this spell again, you can choose to either conjure the same Steed, and it reappears in range at its maximum hit points, or to conjure a new Steed, releasing your previous Steed from its bond in the process."+
        AtHigherLevels + "When you cast this spell using a spell slot of 4th-level or higher, your Steed can take on the form of any Medium or Large quadrupedal or winged beast, celestial, or monstrosity that you have seen before that has a CR of 2 or lower. Examples include: dire wolf, griffon, pegasus, peryton, polar bear, or rhinoceros.",
        allowUpCasting: true,
};

// Flame Whip
SpellsList["flame whip"] = {
    name: "Flame Whip",
    nameShort: "Flame Whip",
    regExpSearch: /^(?=.*flame)(?=.*whip).*$/i,
    source: ["HMB:LL", 0],
    classes: ["druid", "vessel", "warlock"],
    level: 2,
    school: "Evoc",
    time: "1 att",
    timeFull: "1 attack",
    range: "Self",
    components: "V, S, M ",
    compMaterial:"a charred wooden hilt",
    duration: "conc, 10 min",
    description: "Evokes a whip of pure flame to grapple and damage enemies.",
    descriptionFull: "In place of an attack, you can evoke a whip of pure flame in a free hand that lasts for the duration. If you let go of the whip, it disappears, but you can evoke this Flame Whip again in place of another attack without expending a spell slot." +
        " Whenever you could make an attack, you can instead make a melee spell attack with your Flame Whip against one target within 10 feet that you can see. On hit, it takes fire damage equal to 1d10 + your spellcasting modifier, and if the target is Large or smaller, you can instantly grapple it with the Whip." +
        " You cannot attack with the Whip while it is grappling a creature, but a grappled creature takes 1d10 fire damage at the start of its turn and can use its action to make a Strength check against your spell save DC, escaping on a success." +
        " While in your hand, your Flame Whip sheds bright light in a 10-foot radius and dim light for an additional 10 feet."+
        AtHigherLevels + "When you cast this spell using a spell slot of 4th level or higher, both instances of fire damage dealt increase by 1d10 for every two slot levels above 2nd.",
        allowUpCasting: true,
};

// Locate Creature
SpellsList["locate creature ll"] = {
    name: "Locate Creature (LL)",
    nameShort: "Locate Creature (LL)",
    regExpSearch: /^(?=.*locate)(?=.*creature).*$/i,
    source: ["HMB:LL", 0],
    classes: ["bard", "cleric", "druid", "paladin", "psion", "ranger", "wizard"],
    level: 2,
    school: "Div",
    time: "1 a",
    timeFull: "1 action",
    range: "Self",
    components: "V, S, M",
    compMaterial:"a magnet dipped in holy water",
    duration: "conc, 1 hr",
    description: "Locates a specific kind of beast or plant.",
    descriptionFull: "Describe or name a specific kind of beast or plant. It can be a specific creature known to you, or the nearest creature of a specific kind (such as a bear, oak, or horse), so long as you have seen such a creature within 30 feet at least once." +
        " If one is within 1 mile, the material component of this spell points to it as if it were a compass. If the target is in motion, it points to it for as long as it remains in range." +
        " If the creature is in a different form, such as under the effect of the polymorph spell, this spell doesn't locate the creature." +
        " This spell can't locate its target if any thickness of lead or 10 feet of running water blocks a straight line to the target."+
        AtHigherLevels + "When you cast this spell using a spell slot of 3rd level or higher, the range and the type of creature you can locate increase as shown in the table below:\n\n" +
        "Slot Level | Range         | Creature Types\n" +
        "-----------|---------------|----------------\n" +
        "3rd        | 2 miles       | Dragon, Giant, Humanoid, Monstrosity, Ooze\n" +
        "4th        | 3 miles       | Aberration, Construct, Undead\n" +
        "5th        | 5 miles       | Celestial, Elemental, Fey, Fiend",
        allowUpCasting: true,
};

// Lock/Unlock
SpellsList["lock unlock"] = {
    name: "Lock/Unlock",
    nameShort: "Lock/Unlock",
    regExpSearch: /^(?=.*lock)(?=.*unlock).*$/i,
    source: ["HMB:LL", 0],
    classes: ["bard", "wizard"],
    level: 2,
    school: "Abj",
    time: "1 a",
    timeFull: "1 action",
    range: "Touch",
    components: "V, S, M",
    compMaterial:"a piton, which the spell consumes",
    duration: "Instantaneous",
    description: "Locks or unlocks a door, window, gate, chest, or entryway.",
    descriptionFull: "You touch one closed door, window, gate, chest, or another entryway, and either lock or unlock it, using the rules below:\n   " +
        toUni("Lock.")+" You and the creatures you designate when you cast this spell can open the object normally. You can also choose a password that, when spoken aloud within 5 feet of the object, suppresses the spell for 1 minute. " +
        "This lock can be bypassed by a successful Strength check or thieves' tools check against your Spell save DC, at which point the spell is dispelled.\n   " +
        toUni("Unlock.")+" If the object is held shut by a mundane lock or it is stuck or barred, it is instantly unlocked, unstuck, or unbarred. If the object has multiple locks, only one of them is unlocked. Regardless, when you cast the spell, a loud knock, audible out to 300 feet, emanates from the target object.",
};

// Magic Weapon
SpellsList["magic weapon ll"] = {
    name: "Magic Weapon (LL)",
    nameShort: "Magic Weapon (LL)",
    regExpSearch: /^(?=.*magic)(?=.*weapon).*$/i,
    source: ["HMB:LL", 0],
    classes: ["druid", "paladin", "magus", "ranger", "sorcerer", "wizard"],
    level: 2,
    school: "Trans",
    time: "1 bns",
    timeFull: "1 bonus action",
    range: "Touch",
    components: "V, S",
    duration: "1 hour",
    description: "Imbues a nonmagical weapon with arcane power.",
    descriptionFull: "You touch a nonmagical weapon and imbue it with arcane power. For the duration, it becomes a magical weapon with a +1 bonus to attack and damage rolls."+
        AtHigherLevels + "When you cast this spell using a spell slot of 3rd-level or higher, the bonus is +2. When you use a spell slot of 6th-level or higher, the bonus increases to +3.",
        allowUpCasting: true,
};

// Mystic Spear
SpellsList["mystic spear"] = {
    name: "Mystic Spear",
    nameShort: "Mystic Spear",
    regExpSearch: /^(?=.*mystic)(?=.*spear).*$/i,
    source: ["HMB:LL", 0],
    classes: ["bard", "psion", "sorcerer", "warlock"],
    level: 2,
    school: "Ench",
    time: "1 a",
    timeFull: "1 action",
    range: "120 feet",
    components: "V",
    duration: "Instantaneous",
    description: "Fires a bolt of mental power, dealing damage and possibly incapacitating the target.",
    descriptionFull: "You project a violent bolt of mental power at a creature you can see within range. You do not need to see the target if you speak its name as part of the verbal component of this spell.\n   " +
        "The creature must make an Intelligence saving throw. On a failed save, it takes 4d6 psychic damage and is incapacitated until the start of your next turn. On a successful save, it takes half as much psychic damage and is not incapacitated."+
        AtHigherLevels +" When you cast this spell using a spell slot of 3rd level or higher, the damage increases by 1d6 for each slot level above 2nd.",
        allowUpCasting: true,
};

// Pass Without Trace ALT
SpellsList["pass without trace ll"] = {
    name: "Pass Without Trace (LL)",
    nameShort: "Pass Without Trace (LL)",
    regExpSearch: /^(?=.*pass)(?=.*without)(?=.*trace).*$/i,
    source: ["HMB:LL", 0],
    classes: ["druid", "ranger"],
    level: 2,
    school: "Abju",
    time: "1 a",
    timeFull: "1 action",
    range: "S",
    components: "V, S, M ",
    compMaterial: "Ashes from a burned leaf of mistletoe",
    duration: "conc, 1 hr",
    description: "Masks you and your companions from detection, granting stealth bonuses.",
    descriptionFull: "A veil of shadows and silence radiates from you, masking you and your companions from detection. For the duration, you and creatures of your choice within 30 feet are considered to be lightly obscured and gain a bonus to all Dexterity (Stealth) checks equal to your Spellcasting modifier. Creatures under the effect of this spell leave no track or trace of their passing.",
};

// Restoration
SpellsList["restoration"] = {
    name: "Restoration",
    nameShort: "Restoration",
    regExpSearch: /^(?=.*restoration).*$/i,
    source: ["HMB:LL", 0],
    classes: ["bard", "cleric", "druid", "paladin", "ranger"],
    level: 2,
    school: "Abju",
    time: "1 a",
    timeFull: "1 action",
    range: "Touch",
    components: "V, S",
    duration: "Instantaneous",
    description: "Ends one disease or condition (blinded, deafened, frightened, paralyzed, or poisoned).",
    descriptionFull: "You touch a willing creature and instantly end one disease or one of the following conditions currently afflicting it: blinded, deafened, frightened, paralyzed, or poisoned."+
        AtHigherLevels +" When you cast this spell using a spell slot of 3rd-level or higher, the conditions and effects you can end increase, but the spell requires you to expend diamond dust of a certain value, which is consumed during casting:\n\nSlot Level | Value | Conditions/Effects\n3rd | 10 gp | Charmed, Exhaustion (1 level)\n4th | 50 gp | Reduction to one Ability Score or Hit Point Maximum\n5th | 100 gp | Petrified, One Curse, or Attunement to a Cursed Item",
        allowUpCasting: true,
};

// Blinding Smite ALT
SpellsList["blinding smite ll"] = {
    name: "Blinding Smite (LL)",
    nameShort: "Blinding Smite (LL)",
    regExpSearch: /^(?=.*blinding)(?=.*smite).*$/i,
    source: ["HMB:LL", 0],
    classes: ["paladin"],
    level: 3,
    school: "Evoc",
    time: "On hit",
    timeFull: "On hit",
    range: "S",
    components: "V, M",
    compMaterial: "a melee weapon worth at least 1 sp",
    duration: "conc, 1 min",
    description: "Deal 3d8 radiant damage, target must save or be blinded.",
    descriptionFull: "When you hit with a melee weapon attack you can cause the weapon to flare with an overwhelming blinding light. This attack deals 3d8 bonus radiant damage, and the target must succeed on a Constitution saving throw or become blinded until the spell ends. The target can repeat this saving throw at the end of each of its turns, ending the effect on a success.\n\nIf your target is a fiend or undead, or if it has the sunlight sensitivity trait, the bonus radiant damage increases by 1d8."+
        AtHigherLevels +" When you cast this spell using a spell slot of 3rd-level or higher, the radiant damage increases by 1d8 for each spell slot level above 2nd.",
        allowUpCasting: true,
};

// Cerebral Blast
SpellsList["cerebral blast"] = {
    name: "Cerebral Blast",
    nameShort: "Cerebral Blast",
    regExpSearch: /^(?=.*cerebral)(?=.*blast).*$/i,
    source: ["HMB:LL", 0],
    classes: ["psion"],
    level: 3,
    school: "Evoc",
    time: "1 a",
    timeFull: "1 action",
    range: "Self (30-foot cone)",
    components: "V",
    duration: "Instantaneous",
    description: "5d8 psychic damage, push target 20 ft, prone on fail.",
    descriptionFull: "Your mind unleashes a blast of overwhelming mental force in a 30-foot cone. Creatures in the area of this spell must make a Strength saving throw. On a failed save, a creature takes 5d8 psychic damage and is pushed 20 feet directly away from you in a line, then falls prone. On a success, creatures take half as much damage, remain in place, and don't fall prone."+
        AtHigherLevels +" When you cast this spell using a spell slot of 4th-level or higher, the psychic damage increases by 1d8 for each spell slot level above 3rd.",
        allowUpCasting: true,
};

// Conjure Volley ALT
SpellsList["conjure volley"] = {
    name: "Conjure Volley",
    nameShort: "Conjure Volley",
    regExpSearch: /^(?=.*conjure)(?=.*volley).*$/i,
    source: ["HMB:LL", 0],
    classes: ["ranger"],
    level: 3,
    school: "Conj",
    time: "1 a",
    timeFull: "1 action",
    range: "Self",
    components: "V,S,M",
    compMaterial: "A single piece of ammunition and a ranged weapon, or one thrown weapon",
    duration: "Instantaneous",
    description: "6d8 weapon damage in a 30-ft-radius, 20-ft-high cylinder",
    descriptionFull: "You fire one piece of nonmagical ammunition from a ranged weapon or throw a nonmagical thrown weapon into the air and choose a point within the normal range of the weapon. The ammunition or weapon explodes into a multitude of exact copies of it, which fall in a 30-foot-radius, 20-foot-high cylinder centered on the point you chose. Creatures within that area must make a Dexterity saving throw. They take 6d8 damage of the weapon or ammunition's type on a failed save, and half as much damage on a successful save. Any pieces of ammunition or weapons created by this spell disintegrate once the effects of this spell are resolved."+
        AtHigherLevels +" When you cast this spell using a spell slot of 4th-level or higher, the damage of this spell increases by 1d8, and the radius of the cylinder increases by 5 feet for each slot level above 3rd.",
        allowUpCasting: true,
};

// Counterspell ALT
SpellsList["counterspell ll"] = {
    name: "Counterspell (LL)",
    nameShort: "Counterspell (LL)",
    regExpSearch: /^(?=.*counterspell).*$/i,
    source: ["HMB:LL", 0],
    classes: ["magus", "sorcerer", "warlock", "wizard"],
    level: 3,
    school: "Abjur",
    time: "1 r",
    timeFull: "1 action",
    range: "60 feet",
    components: "V,S",
    duration: "Instantaneous",
    description: "Contest: cancel spell if you win vs spellcasting ability check",
    descriptionFull: "You attempt to interrupt a creature in the process of casting a spell. You and the target both make an ability check with your respective spellcasting abilities. The target adds the level of the spell it is casting to its ability check, and you add the level at which you cast this counterspell to your ability check.\n   If you know the spell the creature is attempting to cast or if you have it prepared, you have advantage on this ability check, unless you are using this spell against another counterspell.\n   If the result of your ability check is greater than the result of the target's ability check, its spell fails and has no effect.",
};

// Dire Wail
SpellsList["dire wail"] = {
    name: "Dire Wail",
    nameShort: "Dire Wail",
    regExpSearch: /^(?=.*dire)(?=.*wail).*$/i,
    source: ["HMB:LL", 0],
    classes: ["bard", "shaman"],
    level: 3,
    school: "Necro",
    time: "1 a",
    timeFull: "1 action",
    range: "Self (30-ft radius)",
    components: "V",
    duration: "1 minute",
    description: "Creatures within 30 ft take 4d10 thunder damage (Con save half), deafened for duration",
    descriptionFull: "You let forth a wail filled with otherworldly power. Creatures of your choice within 30 feet must succeed on a Constitution saving throw or take 4d10 thunder damage and be deafened for the duration. At the end of each turn, targets can make a Constitution saving throw, ending the spell on a success. On a successful save, the creature takes half damage and is not deafened."+
        AtHigherLevels +" When you cast this spell using a spell slot of 4th-level or higher, the damage increases by 1d10 for each slot level above 3rd.",
        allowUpCasting: true,
};

//Flame Arrows ALT
SpellsList["flame arrows ll"] = {
    name: "Flame Arrows (LL)",
    nameShort: "Flame Arrows (LL)",
    regExpSearch: /^(?=.*flame)(?=.*arrows).*$/i,
    source: ["HMB:LL", 0],
    classes: ["druid", "ranger", "artificer", "magus"],
    level: 3,
    school: "Trans",
    time: "1 bns",
    timeFull: "1 bonus action",
    range: "Touch",
    components: "V, S",
    duration: "1 hour",
    description: "First 12 arrows in a quiver deal 1d6 extra fire damage; fire bursts in flammable objects",
    descriptionFull: "You touch a quiver containing ranged weapon ammunition. The first twelve pieces of ammunition drawn from the quiver deal fire damage in place of their normal damage type, plus an additional 1d6 fire damage on hit. If fired into a flammable object, it bursts into flame on hit. The magic of this spell ends for each piece of ammunition when it hits or misses, and the spell ends after twelve pieces of ammunition are fired."+
        AtHigherLevels +" When you cast this spell using a spell slot of 4th-level or higher, you can draw two additional pieces of ammunition from the quiver for each slot level above 3rd.",
        allowUpCasting: true,
};

//Hunger of Hadar ALT
SpellsList["hunger of hadar ll"] = {
    name: "Hunger of Hadar (LL)",
    nameShort: "Hunger of Hadar (LL)",
    regExpSearch: /^(?=.*hunger)(?=.*hadar).*$/i,
    source: ["HMB:LL", 0],
    classes: ["warlock"],
    level: 3,
    school: "Conj",
    time: "1 a",
    timeFull: "1 action",
    range: "120 feet",
    components: "V, S, M",
    materials: "Pickled octopus tentacle",
    duration: "conc, 1 min",
    description: "20-ft-radius of cold and darkness, 2d6 cold/acid dmg; creatures are blinded in the area",
    descriptionFull: "You open a gateway to the dark between the stars, a region infested with unknown horrors. A 20-foot-radius sphere of blackness and bitter cold appears, centered on a point within range and lasting for the duration. This void is filled with a cacophony of soft whispers and slurping noises that can be heard up to 30 feet away. No light, magical or otherwise, can illuminate the area, and creatures in the area are blinded.\n\nThe void creates a warp in the fabric of space, and the area is difficult terrain. Any creature that starts its turn in the area takes 2d6 cold damage. Any creature that ends its turn in the area must succeed on a Dexterity saving throw or take 2d6 acid damage as milky, otherworldly tentacles rub against it."+
        AtHigherLevels +" When you cast this spell using a spell slot of 4th level or higher, the radius of the spell increases by 5 feet and both the cold and acid damage each increase by 1d6 for each slot level above 3rd.",
        allowUpCasting: true,
};

//Hypnotic Pattern ALT
SpellsList["hypnotic pattern ll"] = {
    name: "Hypnotic Pattern (LL)",
    nameShort: "Hypnotic Pattern (LL)",
    regExpSearch: /^(?=.*hypnotic)(?=.*pattern).*$/i,
    source: ["HMB:LL", 0],
    classes: ["bard", "sorcerer", "warlock", "wizard"],
    level: 3,
    school: "Illus",
    time: "1 a",
    timeFull: "1 action",
    range: "60 feet",
    components: "S, M",
    materials: "A glowing stick of incense",
    duration: "conc, 1 min",
    description: "30-ft cube; creatures see a pattern, Wis save or be charmed, incapacitated, speed 0; ends if dmg or shaken",
    descriptionFull: "You create a twisting pattern of colors that weaves through the air inside a 30-foot cube within range. This psychedelic pattern appears for a moment and vanishes. Each creature in the area who sees the pattern must make a Wisdom saving throw. On a failed save, the creature becomes charmed for the duration. While charmed by this spell, the creature is incapacitated and has a speed of 0.\n  An affected creature can repeat this saving throw at the end of each of its turns, ending the effect on a success. The spell also ends for an affected creature if it takes any damage or if someone else uses an action to shake it out of its stupor.",
};

//Irresistible Dance ALT
SpellsList["irresistible dance ll"] = {
    name: "Irresistible Dance (LL)",
    nameShort: "Irresistible Dance (LL)",
    regExpSearch: /^(?=.*irresistible)(?=.*dance).*$/i,
    source: ["HMB:LL", 0],
    classes: ["bard"],
    level: 3,
    school: "Ench",
    time: "1 a",
    timeFull: "1 action",
    range: "30 feet",
    components: "V",
    duration: "conc, 1 min",
    description: "Forces a creature to dance, disadv. on Dex saves & attacks, others have adv. on attacks; Wis save to end",
    descriptionFull: "You force a creature that can hear you within range to make a Wisdom saving throw. On a failure, it begins a comic dance in place: shuffling, tapping feet, and capering for the duration. Creatures that can't be charmed are immune to this spell.\n\nThe creature must use all its movement to dance without leaving its space and has disadvantage on Dexterity saving throws and attack rolls. While the target is affected by this spell, creatures have advantage on attack rolls against it. As an action, the dancing creature can make a Wisdom saving throw to regain control of itself, ending the spell on a success."+
        AtHigherLevels +" When you cast this spell using a spell slot of 4th level or higher, you target one additional creature who can hear you within range for each slot level above 3rd.",
        allowUpCasting: true,
};

//Lightning Arrow ALT
SpellsList["lightning arrow ll"] = {
    name: "Lightning Arrow (LL)",
    nameShort: "Lightning Arrow (LL)",
    regExpSearch: /^(?=.*lightning)(?=.*arrow).*$/i,
    source: ["HMB:LL", 0],
    classes: ["artificer", "ranger"],
    level: 3,
    school: "Trans",
    time: "1 att",
    timeFull: "1 attack",
    range: "Self",
    components: "V,S",
    duration: "Instantaneous",
    description: "Normal damage + 4d8 lightning; on miss, half lightning damage; all within 10 ft. take 2d8 lightning; can’t take reactions",
    descriptionFull: "As part of a ranged weapon attack, you can transmute a piece of ammunition or a thrown weapon into a bolt of lightning. On hit, the target takes the normal damage of the attack, plus a bonus 4d8 lightning damage. On a miss, the target takes half as much lightning damage and none of the normal damage.\n\nRegardless of whether this attack hits or misses, all creatures within 10 feet of the target must make a Dexterity saving throw. On a failed save, creatures take 2d8 lightning damage, and half as much on a successful save. The piece of ammunition or thrown weapon then returns to its normal form.\n\nAny creature that takes lightning damage from this spell cannot take reactions until the beginning of your next turn."+
        AtHigherLevels +" When you cast this spell using a spell slot of 4th-level or higher, the damage for both effects of the spell increases by 1d8 for each slot level above 3rd.",
        allowUpCasting: true,
};

//Sonic Wave
SpellsList["sonic wave"] = {
    name: "Sonic Wave",
    nameShort: "Sonic Wave",
    regExpSearch: /^(?=.*sonic)(?=.*wave).*$/i,
    source: ["HMB:LL", 0],
    classes: ["bard", "magus", "sorcerer"],
    level: 3,
    school: "Conj",
    time: "1 a",
    timeFull: "1 action",
    range: "Self (30-foot cone)",
    components: "V,S",
    duration: "Instantaneous",
    description: "4d8 thunder damage in a 30-ft cone; prone & deafened on fail",
    descriptionFull: "You forcefully clasp your hands and a shockwave of booming force shoots forth from you, emitting a boom audible up to 500 feet. All creatures in a 30-foot cone must succeed on a Constitution saving throw or take 4d8 thunder damage, fall prone, and be deafened for 1 minute. On a success, creatures take half damage and are not knocked prone or deafened.\n\nA creature can repeat this saving throw at the end of each of its turns, ending the effect on a success."+
        AtHigherLevels +" When you cast this spell using a spell slot of 4th-level or higher, the damage increases by 1d8, and the cone increases by 5 feet for each slot level above 3rd.",
        allowUpCasting: true,
};

//Spectral Passage
SpellsList["spectral passage"] = {
    name: "Spectral Passage",
    nameShort: "Spectral Passage",
    regExpSearch: /^(?=.*spectral)(?=.*passage).*$/i,
    source: ["HMB:LL", 0],
    classes: ["psion", "shaman", "sorcerer", "vessel"],
    level: 3,
    school: "Trans",
    time: "1 a",
    timeFull: "1 action",
    range: "Touch",
    components: "V,S,M",
    compMaterial: "An object a spirit has passed through",
    duration: "conc, 1 min",
    description: "Become semi-incorporeal; move through objects as difficult terrain",
    descriptionFull: "You touch a willing creature. Until the spell ends, it becomes semi-incorporeal and can move through other creatures and objects as if they were difficult terrain. If the creature ends its movement inside another object or creature, it is immediately shunted to the nearest unoccupied space, taking 1d10 force damage for every 5 feet it was forced to travel."+
        AtHigherLevels +" When you cast this spell using a spell slot of 4th-level or higher, you can target one additional creature for each slot level above 3rd.",
        allowUpCasting: true,
};

//Tiny Hut ALT
SpellsList["tiny hut ll"] = {
    name: "Tiny Hut (LL)",
    nameShort: "Tiny Hut (LL)",
    regExpSearch: /^(?=.*tiny)(?=.*hut).*$/i,
    source: ["HMB:LL", 0],
    classes: ["bard", "magus", "shaman", "wizard"],
    level: 3,
    school: "Abju",
    time: "1 min",
    timeFull: "1 minute",
    range: "Self (10-foot radius hemisphere)",
    components: "V,S,M",
    compMaterial: "A pearl cut perfectly in half",
    duration: "8 hours",
    ritual: true,
    description: "Immobile dome of arcane force, 10-ft radius",
    descriptionFull: "A 10-foot-radius immobile dome of arcane force springs into existence around and above you and remains stationary for the duration. The spell ends if you leave its area.\n   Nine creatures of Medium size or smaller can fit inside the dome with you. The spell fails if its area includes any Large creatures or more than nine creatures. Creatures and objects within the dome when you cast this spell can move through it freely. All other creatures and objects cannot pass through it. Spells and other magical effects cannot extend through the dome or be cast through it. The atmosphere inside the dome is comfortable and dry, regardless of the weather outside.\n   Until the spell ends, you can command the interior to be dimly lit or dark. The dome is opaque and dull in color as to blend in with surroundings. It is transparent from the inside."
    +toUni("Statistics.")+" The dome has 100 hit points and Armor Class equal to your Spell save DC. It is immune to poison, psychic, and non-magical bludgeoning, piercing, and slashing damage; it is vulnerable to force and all magical bludgeoning, piercing, and slashing damage, and it is resistant to all other damage types. A disintegrate spell destroys it instantly.",
};

//Accursed Touch
SpellsList["accursed touch"] = {
    name: "Accursed Touch",
    nameShort: "Accursed Touch",
    regExpSearch: /^(?=.*accursed)(?=.*touch).*$/i,
    source: ["HMB:LL", 0],
    classes: ["druid", "cleric", "magus", "sorcerer"],
    level: 4,
    school: "Trans",
    time: "1 a",
    timeFull: "1 action",
    range: "Touch",
    components: "V,S,M",
    compMaterial: "A basilisk scale",
    duration: "conc, 1 min",
    description: "Transmute a creature into stone; Constitution saving throw",
    descriptionFull: "You attempt to transmute a creature into stone. As an action, you touch a creature, forcing it to make a Constitution saving throw. On a failed save, the creature is restrained as its flesh begins to harden. On a successful save, it isn't affected.\n   A creature restrained by this spell must make another Constitution saving throw at the end of each of its turns. If it successfully saves against this spell three times, the spell ends. If it fails three saves, it is turned to stone and petrified. The successes and failures don't need to be consecutive; keep track of both until the creature fails or passes three saves.\n   If the creature is physically broken while petrified, it suffers from similar deformities if it reverts to its original state.\n   If you maintain your concentration for the entire duration, the creature is turned to stone until the effect is removed."+
        AtHigherLevels +" When you cast this spell using a spell slot of 5th level or higher, the number of saves it must fail before it is petrified is reduced by 1 (to a minimum of 1) for each level above 4th.",
        allowUpCasting: true,
};

//Eldritch Tentacles
SpellsList["eldritch tentacles"] = {
    name: "Eldritch Tentacles",
    nameShort: "Eldritch Tentacles",
    regExpSearch: /^(?=.*eldritch)(?=.*tentacles).*$/i,
    source: ["HMB:LL", 0],
    classes: ["warlock", "wizard"],
    level: 4,
    school: "Conj",
    time: "1 a",
    timeFull: "1 action",
    range: "90 feet",
    components: "V,S,M",
    compMaterial: "A piece of tentacle from a giant squid",
    duration: "conc, 1 min",
    description: "Alien tentacles fill a 20-ft square, difficult terrain",
    descriptionFull: "Alien tentacles fill a 20-foot square on the ground you can see within range. For the duration, this area is difficult terrain.\n\nWhen a creature enters this area for the first time on a turn or starts its turn there, it must succeed on a Dexterity saving throw or take 3d6 bludgeoning damage and be restrained by the tentacles until the spell ends. Any creature that begins its turn in the area and is restrained by the tentacles takes 3d6 bludgeoning damage at the start of its turn.\n\nA creature restrained by the tentacles can use its action to make a Strength or Dexterity check (its choice) against your spell save DC. On a success, it frees itself from the tentacles."+
        AtHigherLevels +" When you cast this spell using a spell slot of 5th level or higher, both instances of damage from this spell increase by 1d6 for each slot level above 4th.",
        allowUpCasting: true,
};

//Ego Scourge
SpellsList["ego scourge"] = {
    name: "Ego Scourge",
    nameShort: "Ego Scourge",
    regExpSearch: /^(?=.*ego)(?=.*scourge).*$/i,
    source: ["HMB:LL", 0],
    classes: ["psion"],
    level: 4,
    school: "Ench",
    time: "1 a",
    timeFull: "1 action",
    range: "30 feet",
    components: "V",
    duration: "conc, 1 min",
    description: "Attack the mind, disadvantage on attacks and checks",
    descriptionFull: "You strike at the mind of a creature you can see within range, attacking its sense of self. It must succeed on an Intelligence saving throw or suffer disadvantage on attack rolls and ability checks, and be unable to cast spells for the duration.\n   At the end of each of its turns, the creature can repeat this saving throw, ending the effect of this spell on a success.",
};

//Polymorph ALT
SpellsList["polymorph ll"] = {
    name: "Polymorph",
    nameShort: "Polymorph",
    regExpSearch: /^(?=.*polymorph).*$/i,
    source: ["HMB:LL", 0],
    classes: ["bard", "druid", "magus", "sorcerer", "wizard"],
    level: 4,
    school: "Trans",
    time: "1 a",
    timeFull: "1 action",
    range: "30 feet",
    components: "V,S,M",
    compMaterial: "A caterpillar cocoon",
    duration: "conc, 10 min",
    description: "Transform a creature into a beast",
    descriptionFull: "This spell transforms one creature you can see within range into a new form of your choice. An unwilling creature must succeed on a Wisdom saving throw to resist this effect, but shapechangers automatically succeed on their saving throw. This spell has no effect on a target that has 0 hit points. The transformation lasts for the duration, but it ends early if the target drops to 0 hit points or dies.\n\nForm: The new form can be any beast you have physically seen while it was living. It must have a Challenge Rating less than or equal to the target's level or its Challenge Rating." +toUni("Statistics.")+" Its game statistics, including its mental ability scores, are replaced by those of the beast, but it does retain its alignment and personality within the limitations of that beast.\n   The target assumes the hit points of its new form. When it reverts to its normal form, the creature returns to the number of hit points it had before it was transformed. If it reverts as a result of dropping to 0 hit points, any excess damage carries over to its normal form. If this excess damage reduces its normal form to 0 hit points, it is knocked unconscious." +toUni("Actions.")+" The actions the creature can take are limited to those its new form is able to perform. It cannot speak, cast spells, or take any actions that require hands or speech." +toUni("Equipment.")+" Its clothing, weapons, armor, and objects it is holding meld into the new form. However, it can't activate, use, wield, or otherwise benefit from any of its equipment.",
};

//Staggering Smite ALT
SpellsList["staggering smite ll"] = {
    name: "Staggering Smite (LL)",
    nameShort: "Staggering Smite (LL)",
    regExpSearch: /^(?=.*staggering)(?=.*smite).*$/i,
    source: ["HMB:LL", 0],
    classes: ["paladin"],
    level: 4,
    school: "Evoc",
    time: "On hit",
    timeFull: "On hit",
    range: "Self",
    components: "V,M",
    compMaterial: "A melee weapon worth at least 1 sp",
    duration: "Instantaneous",
    description: "Add 4d6 psychic damage; Wisdom save for disadvantage",
    descriptionFull: "When you hit with a melee weapon attack, you can cause the weapon to pierce both body and mind. This attack deals 4d6 additional psychic damage, and the target must succeed on a Wisdom saving throw or, until the start of its next turn, it has disadvantage on attack rolls and ability checks and cannot take reactions.\n   If your target is an aberration or it can speak telepathically, this bonus psychic damage increases by 1d6."+
        AtHigherLevels +" When you cast this spell using a spell slot of 5th level or higher, the psychic damage increases by 1d6 for each spell slot level above 4th.",
        allowUpCasting: true,
};

//Banishing Smite ALT
SpellsList["banishing smite ll"] = {
    name: "Banishing Smite (LL)",
    nameShort: "Banishing Smite (LL)",
    regExpSearch: /^(?=.*banishing)(?=.*smite).*$/i,
    source: ["HMB:LL", 0],
    classes: ["paladin"],
    level: 5,
    school: "Evoc",
    time: "On hit",
    timeFull: "On hit",
    range: "Self",
    components: "V,M",
    compMaterial: "A melee weapon worth at least 1 sp",
    duration: "conc, 1 min",
    description: "Add 5d10 force damage; banished if at 50 HP or fewer",
    descriptionFull: "When you hit with a melee weapon attack, you can cause the weapon to crackle with pure arcane force. This attack deals 5d10 bonus force damage, and if it reduces the target to 50 hit points or fewer, it is banished from the current plane.\n   If the target is native to a different plane of existence than the one you are currently on, it disappears, returning to its home plane. If the target is native to your current plane, it is banished to a harmless demiplane where it is incapacitated. When the spell ends, the target returns to the space it was banished from, or the nearest unoccupied space.\n   If the target is not native to your current plane of existence, this bonus force damage increases by 1d10."+
        AtHigherLevels +" When you cast this spell using a spell slot of 6th level or higher, the bonus force damage increases by 1d10 for each spell slot level above 5th.",
        allowUpCasting: true,
};

//Psychic Crush
SpellsList["psychic crush"] = {
    name: "Psychic Crush",
    nameShort: "Psychic Crush",
    regExpSearch: /^(?=.*psychic)(?=.*crush).*$/i,
    source: ["HMB:LL", 0],
    classes: ["psion"],
    level: 5,
    school: "Evoc",
    time: "1 a",
    timeFull: "1 action",
    range: "90 feet",
    components: "V",
    duration: "conc, 1 min",
    description: "5d8 force damage; repeat save for additional damage",
    descriptionFull: "You exert the full force of your will upon a creature you can see within range. It must succeed on a Strength saving throw, taking 5d8 force damage on a failure and half as much force damage on a success. It must repeat this saving throw at the end of each of its turns, taking 2d8 force damage on a failure, and ending the effects of this spell on a success.\n   If this spell reduces a creature to 0 hit points, it is crushed into a flesh-colored ball, roughly the size of your fist."+
        AtHigherLevels +" When you cast this spell using a spell slot of 6th level or higher, each instance of force damage it deals increases by 1d8 for each spell slot level above 5th.",
        allowUpCasting: true,
};

//Spiritual Sundering
SpellsList["spiritual sundering"] = {
    name: "Spiritual Sundering",
    nameShort: "Spiritual Sundering",
    regExpSearch: /^(?=.*spiritual)(?=.*sundering).*$/i,
    source: ["HMB:LL", 0],
    classes: ["cleric", "shaman", "warlock"],
    level: 5,
    school: "Ench",
    time: "1 a",
    timeFull: "1 action",
    range: "120 feet",
    components: "V,S",
    duration: "Instantaneous",
    description: "8d6 necrotic damage; penalty on mental saves",
    descriptionFull: "Creatures in a 20-foot-radius sphere centered on a point of your choice within range have their soul rent and must make a Charisma saving throw. On a failure, they take 8d6 necrotic damage, and for the next minute, they have a muddied sense of self and subtract 1d6 from any Intelligence, Wisdom, or Charisma saving throw they make. On a success, they take half damage and suffer no saving throw penalty.\n\nTargets can make a Charisma saving throw at the end of each of their turns, ending the effect on a successful save.",
};

//Steel Wind Strike ALT
SpellsList["steel wind strike ll"] = {
    name: "Steel Wind Strike (LL)",
    nameShort: "Steel Wind Strike (LL)",
    regExpSearch: /^(?=.*steel)(?=.*wind)(?=.*strike).*$/i,
    source: ["HMB:LL", 0],
    classes: ["magus", "ranger"],
    level: 5,
    school: "Conj",
    time: "1 a",
    timeFull: "1 action",
    range: "30 feet",
    components: "V,M",
    compMaterial: "A melee weapon worth at least 1 sp",
    duration: "Instantaneous",
    description: "Attack up to 5 targets; add 5d10 force damage",
    descriptionFull: "You flourish the weapon used in the casting and then vanish to strike like the wind. Choose up to five targets you can see within range. Make one melee weapon attack against each target using the weapon used in the casting. On a hit, targets take the normal damage of an attack with that weapon plus an additional 5d10 force damage.\n   You can then teleport to an unoccupied space you can see within 5 feet of one of the targets you hit or missed.",
};

//Swift Quiver ALT
SpellsList["swift quiver ll"] = {
    name: "Swift Quiver (LL)",
    nameShort: "Swift Quiver (LL)",
    regExpSearch: /^(?=.*swift)(?=.*quiver).*$/i,
    source: ["HMB:LL", 0],
    classes: ["ranger"],
    level: 5,
    school: "Trans",
    time: "1 bns",
    timeFull: "1 bonus action",
    range: "Touch",
    components: "V,S,M",
    compMaterial: "A quiver with a piece of ammunition",
    duration: "conc, 1 min",
    description: "Endless nonmagical ammunition; make 2 attacks per turn",
    descriptionFull: "You transmute your quiver so it produces an endless supply of nonmagical ammunition, which seems to leap into your hand when you reach for it.\n\nOn each of your turns until the spell ends, you can use a bonus action (including the bonus action used to cast this spell) to make two attacks with a ranged weapon that uses ammunition from this quiver. When you make such a ranged attack, your quiver magically replaces the ammunition you used with a nonmagical copy of that ammunition. Pieces of ammunition created by this spell disintegrate when the spell ends. If the quiver leaves your possession, the spell ends.",
};

//Vorpal Blade
SpellsList["vorpal blade"] = {
    name: "Vorpal Blade",
    nameShort: "Vorpal Blade",
    regExpSearch: /^(?=.*vorpal)(?=.*blade).*$/i,
    source: ["HMB:LL", 0],
    classes: ["magus", "paladin"],
    level: 5,
    school: "Trans",
    time: "On hit",
    timeFull: "On hit",
    range: "Touch",
    components: "V,S,M",
    compMaterial: "The finger bone of a necromancer",
    duration: "Instantaneous",
    description: "6d8 force damage; behead if reduced to 50 HP or fewer",
    descriptionFull: "You conjure a blade of pure negative energy in your empty hand and make one melee weapon attack against a creature within your reach, attempting to behead it. On hit, it takes force damage equal to 6d8 + your spellcasting modifier.\n  If this damage reduces the creature to 50 hit points or fewer, you instantly cut off one of its heads of your choice. The creature instantly dies if it cannot survive without the lost head. The creature's head is not removed if it is immune to slashing damage or if it doesn't have or need a head.",
};

//Wall of Force ALT
SpellsList["wall of force ll"] = {
    name: "Wall of Force (LL)",
    nameShort: "Wall of Force (LL)",
    regExpSearch: /^(?=.*wall)(?=.*force).*$/i,
    source: ["HMB:LL", 0],
    classes: ["magus", "sorcerer", "wizard"],
    level: 5,
    school: "Abju",
    time: "1 a",
    timeFull: "1 action",
    range: "60 feet",
    components: "V,S,M",
    materials: "Powder from crushed clear gemstone",
    duration: "conc, 10 min",
    description: "150 hit points; creates an opaque wall of force",
    descriptionFull: "A shimmering opaque wall of force springs into existence at a point you choose within range and lasts for the duration.\n " +toUni("Orientation & Shape.")+" The wall appears in any orientation you choose, as a horizontal or vertical barrier or an angle. It can be free-floating or rest on a solid surface. You can form it into a hemispherical dome, a sphere with a radius of up to 10 feet, or you can shape a flat surface made up of ten 10-by-10-foot panels. Each panel must be contiguous with another. In any form, the wall is 1/4 inch thick. Nothing can pass through the wall physically, and anything viewed through it is lightly obscured. The wall extends into the Ethereal Plane, blocking ethereal travel through the wall. If it cuts through a creature's space when it appears, the creatures must make a Dexterity saving throw. On a success, it chooses which side of the wall it moves to. On a failure, you choose the side it moves to.\n " +toUni("Statistics.")+" The wall has 150 hit points and its Armor Class equals your Spell save DC. It is immune to poison, psychic, and non-magical bludgeoning, piercing, and slashing damage, vulnerable to force and magical bludgeoning, piercing, and slashing damage, and resistant to all other damage types. It cannot be dispelled by a dispel magic spell, but a disintegrate spell destroys the wall instantly."+ AtHigherLevels+" When you cast this spell using a spell slot of 6th level or higher, the hit points of the wall created by this spell increase by 25 for each spell slot level above 5th.",
        allowUpCasting: true,
};

//Psionic Oppression
SpellsList["psionic oppression"] = {
    name: "Psionic Oppression",
    nameShort: "Psionic Oppression",
    regExpSearch: /^(?=.*psionic)(?=.*oppression).*$/i,
    source: ["HMB:LL", 0],
    classes: ["psion"],
    level: 6,
    school: "Ench",
    time: "1 a",
    timeFull: "1 action",
    range: "60 feet",
    components: "V,S",
    duration: "1 minute",
    description: "12d6 psychic damage; stunned on failed save",
    descriptionFull: "You psionically overwhelm the mind of one creature you can see within range. It must succeed on an Intelligence saving throw or it takes 12d6 psychic damage and is stunned for 1 minute. On a successful save, the target takes half as much psychic damage and is not stunned.\n  The stunned target can repeat the saving throw at the end of each of its turns, ending the effect on a success.",
};

//Force Cage ALT
SpellsList["forcecage ll"] = {
    name: "Forcecage (LL)",
    nameShort: "Forcecage (LL)",
    regExpSearch: /^(?=.*forcecage).*$/i,
    source: ["HMB:LL", 0],
    classes: ["warlock", "wizard"],
    level: 7,
    school: "Conj",
    time: "1 action",
    range: "60 feet",
    components: "V,S,M",
    compMaterial: "an ornate jade box worth 1,500 gp",
    duration: "conc, 1 hr",
    description: "Creates a force prison (20ft cage/10ft box), teleportation requires a Cha save.",
    descriptionFull: "A shimmering, immobile, cube-shaped prison composed of magical force springs into existence around an area of your choice within range. You choose whether this magic prison is shaped like a cage with bars or a solid box.\n   "+ toUni("Shape.") +" If you choose cage, it can be up to 20 feet on a side and made from 1/2-inch diameter bars spaced 1/2 inch apart. If you choose box, it can be up to 10 feet on a side, creating a solid barrier that prevents any matter from passing through it and blocking any spells cast into or out of the area. The cage extends into the Ethereal Plane, blocking ethereal travel.\n   "+ toUni("Creatures Inside.") +" When you cast the spell, any creatures that are completely inside the area of the cage are trapped. Any creatures partially within the area, or too large to fit are pushed away until they are completely outside of the cage.\n   A creature inside the cage cannot leave it by non-magical means. If the creature tries to use teleportation or interplanar travel to leave the cage, it must first make a Charisma saving throw. The spell or effect is wasted on a failed save, but on a success the creature uses the spell or effect to escape.\n   "+ toUni("Statistics.") +" The cage's Armor Class equals your Spell save DC and it has 200 hit points. It is immune to poison, psychic, and non-magical bludgeoning, piercing, and slashing damage, vulnerable to force and magical bludgeoning, piercing, and slashing damage, and resistant to all other damage types. It cannot be dispelled by a dispel magic spell, but a disintegrate spell destroys the cage instantly." + AtHigherLevels +" When you cast this spell using a spell slot of 8th level or higher, the hit points of the cage created by this spell increase by 25 for each spell slot level above 7th.",
    allowUpCasting: true,
};

//Mass Polymorph ALT
SpellsList["mass polymorph ll"] = {
    name: "Mass Polymorph (LL)",
    nameShort: "Mass Polymorph (LL)",
    regExpSearch: /^(?=.*mass)(?=.*polymorph).*$/i,
    source: ["HMB:LL", 0],
    classes: ["sorcerer", "wizard"],
    level: 8,
    school: "Trans",
    time: "1 a",
    timeFull: "1 action",
    range: "30 feet",
    components: "V,S,M",
    compMaterial:"a caterpillar cocoon for each target",
    duration: "conc, 10 min",
    description: "Up to 5 creatures you see within range transform into beasts you've seen (target's Wis save resists).",
    descriptionFull: "This spell transforms up to five creatures you can see within range into a new form of your choice, and you can choose the same or different forms for each target. An unwilling creature must succeed on a Wisdom saving throw to resist this effect. Shapechangers automatically succeed on their saving throw. This spell has no effect on a target that has 0 hit points. The transformation lasts for the duration, but it ends early if the target drops to 0 hit points or dies.\n\n**Form**: The new form can be any beast you have physically seen while it was living. It must have a Challenge Rating less than or equal to the target's level or its Challenge Rating.\n   "+toUni("Statistics")+" Its game statistics, including its mental ability scores are replaced by those of the beast, but it does retain its alignment and personality within the limitations of that beast.\n   The target assumes the hit points of its new form. When it reverts to its normal form, the creature returns to the number of hit points it had before it was transformed. If it reverts as a result of dropping to 0 hit points, any excess damage carries over to its normal form. If this excess damage reduces its normal form to 0 hit points, it is knocked unconscious.\n   "+toUni("Actions")+": The actions the creature can take are limited to those its new form is able to perform. It cannot speak, cast spells, or take any actions that require hands or speech.\n   "+toUni("Equipment")+" Its clothing, weapons, armor, and objects it is holding meld into the new form. However, it can't activate, use, wield, or otherwise benefit from any of its equipment."
   +AtHigherLevels+" If you cast this spell using a 9th-level spell slot, you can target up to 10 creatures within range.",
    allowUpCasting: true,
};

//Weird ALT
SpellsList["weird ll"] = {
    name: "Weird (LL)",
    nameShort: "Weird (LL)",
    regExpSearch: /^(?=.*weird).*$/i,
    source: ["HMB:LL", 0],
    classes: ["psion", "warlock", "wizard"],
    level: 9,
    school: "Ench",
    time: "1 a",
    timeFull: "1 action",
    range: "120 feet",
    components: "V, S",
    duration: "conc, 1 min",
    description: "Frighten multiple creatures within a 30-foot radius. Frightened creatures take 4d10 psychic damage each turn (Wis save ends).",
    descriptionFull: "Drawing on the deepest fears, regrets, and primal instincts of a creature, you create the illusion of the most horrifying thing imaginable to them, which is visible only to that creature.\n   Choose a point within range, and creatures of your choice within a 30-foot radius of the point become frightened for the duration. If a target is immune to the frightened condition, it must make a Wisdom saving throw or be frightened anyway.\n   At the end of each of a frightened creature's turns, it must succeed on a Wisdom saving throw or it takes 4d10 psychic damage. On a success, the spell ends for that target."
};


// Create psion spell list
SpellsList["blade ward ll"].classes.push("psion");
SpellsList["friends ll"].classes.push("psion");
SpellsList["guidance ll"].classes.push("psion");
SpellsList["light"].classes.push("psion");
SpellsList["mage hand"].classes.push("psion");
SpellsList["magic stone"].classes.push("psion");
SpellsList["message"].classes.push("psion");
SpellsList["mind sliver"].classes.push("psion");
SpellsList["mind thrust"].classes.push("psion");
SpellsList["minor illusion"].classes.push("psion");
SpellsList["mystic hammer"].classes.push("psion");
SpellsList["psionic strike"].classes.push("psion");
SpellsList["spare the dying"].classes.push("psion");
SpellsList["sword burst ll"].classes.push("psion");
SpellsList["thaumaturgy"].classes.push("psion");
SpellsList["toll the dead"].classes.push("psion");
SpellsList["true strike ll"].classes.push("psion");
SpellsList["catapult"].classes.push("psion");
SpellsList["cause fear"].classes.push("psion");
SpellsList["charm person"].classes.push("psion");
SpellsList["command"].classes.push("psion");
SpellsList["comprehend languages"].classes.push("psion");
SpellsList["detect magic"].classes.push("psion");
SpellsList["disguise self"].classes.push("psion");
SpellsList["dissonant whispers"].classes.push("psion");
SpellsList["ethereal anchor"].classes.push("psion");
SpellsList["faerie fire"].classes.push("psion");
SpellsList["tasha's hideous laughter"].classes.push("psion");
SpellsList["id insinuation"].classes.push("psion");
SpellsList["identify"].classes.push("psion");
SpellsList["jump ll"].classes.push("psion");
SpellsList["magic missile"].classes.push("psion");
SpellsList["shield ll"].classes.push("psion");
SpellsList["sleep"].classes.push("psion");
SpellsList["blindness/deafness"].classes.push("psion");
SpellsList["blur"].classes.push("psion");
SpellsList["calm emotions"].classes.push("psion");
SpellsList["crown of madness"].classes.push("psion");
SpellsList["detect thoughts"].classes.push("psion");
SpellsList["enlarge/reduce"].classes.push("psion");
SpellsList["hold person"].classes.push("psion");
SpellsList["invisibility"].classes.push("psion");
SpellsList["levitate"].classes.push("psion");
SpellsList["locate creature ll"].classes.push("psion");
SpellsList["mind spike"].classes.push("psion");
SpellsList["tasha's mind whip"].classes.push("psion");
SpellsList["mirror image"].classes.push("psion");
SpellsList["misty step"].classes.push("psion");
SpellsList["mystic spear"].classes.push("psion");
SpellsList["phantasmal force"].classes.push("psion");
SpellsList["see invisibility"].classes.push("psion");
SpellsList["suggestion"].classes.push("psion");
SpellsList["blink"].classes.push("psion");
SpellsList["cerebral blast"].classes.push("psion");
SpellsList["clairvoyance"].classes.push("psion");
SpellsList["enemies abound"].classes.push("psion");
SpellsList["fear"].classes.push("psion");
SpellsList["feign death"].classes.push("psion");
SpellsList["fly"].classes.push("psion");
SpellsList["haste"].classes.push("psion");
SpellsList["hypnotic pattern ll"].classes.push("psion");
SpellsList["intellect fortress"].classes.push("psion");
SpellsList["life transference"].classes.push("psion");
SpellsList["major image"].classes.push("psion");
SpellsList["nondetection"].classes.push("psion");
SpellsList["sending"].classes.push("psion");
SpellsList["slow"].classes.push("psion");
SpellsList["spectral passage"].classes.push("psion");
SpellsList["tongues"].classes.push("psion");
SpellsList["water walk"].classes.push("psion");
SpellsList["arcane eye"].classes.push("psion");
SpellsList["charm monster"].classes.push("psion");
SpellsList["compulsion"].classes.push("psion");
SpellsList["confusion"].classes.push("psion");
SpellsList["dimension door"].classes.push("psion");
SpellsList["ego scourge"].classes.push("psion");
SpellsList["freedom of movement"].classes.push("psion");
SpellsList["greater invisibility"].classes.push("psion");
SpellsList["phantasmal killer"].classes.push("psion");
SpellsList["otiluke's resilient sphere"].classes.push("psion");
SpellsList["bigby's hand"].classes.push("psion");
SpellsList["dominate person"].classes.push("psion");
SpellsList["dream"].classes.push("psion");
SpellsList["far step"].classes.push("psion");
SpellsList["geas"].classes.push("psion");
SpellsList["hold monster"].classes.push("psion");
SpellsList["modify memory"].classes.push("psion");
SpellsList["psychic crush"].classes.push("psion");
SpellsList["scrying"].classes.push("psion");
SpellsList["skill empowerment"].classes.push("psion");
SpellsList["synaptic static"].classes.push("psion");
SpellsList["telekinesis"].classes.push("psion");
SpellsList["rary's telepathic bond"].classes.push("psion");
SpellsList["wall of force"].classes.push("psion");
SpellsList["arcane gate"].classes.push("psion");
SpellsList["eyebite"].classes.push("psion");
SpellsList["globe of invulnerability"].classes.push("psion");
SpellsList["mass suggestion"].classes.push("psion");
SpellsList["mental prison"].classes.push("psion");
SpellsList["psionic oppression"].classes.push("psion");
SpellsList["scatter"].classes.push("psion");
SpellsList["true seeing"].classes.push("psion");
SpellsList["etherealness"].classes.push("psion");
SpellsList["forcecage ll"].classes.push("psion");
SpellsList["plane shift"].classes.push("psion");
SpellsList["project image"].classes.push("psion");
SpellsList["reverse gravity"].classes.push("psion");
SpellsList["sequester"].classes.push("psion");
SpellsList["teleport"].classes.push("psion");
SpellsList["antimagic field"].classes.push("psion");
SpellsList["antipathy/sympathy"].classes.push("psion");
SpellsList["dominate monster"].classes.push("psion");
SpellsList["feeblemind"].classes.push("psion");
SpellsList["maddening darkness"].classes.push("psion");
SpellsList["mind blank"].classes.push("psion");
SpellsList["telepathy"].classes.push("psion");
SpellsList["astral projection"].classes.push("psion");
SpellsList["foresight"].classes.push("psion");
SpellsList["invulnerability"].classes.push("psion");
SpellsList["psychic scream"].classes.push("psion");
SpellsList["time stop"].classes.push("psion");
SpellsList["weird ll"].classes.push("psion");