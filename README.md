This repository is where I store scripts which add [LaserLlama](https://www.gmbinder.com/profile/laserllama)'s content to [MorePurpleMoreBetter](https://www.flapkan.com/download#charactersheets)'s scripted player sheets.

# How to import
To import any of my scripts to your own sheet, you have to do the following:
1. Import the [all_WotC](https://github.com/safety-orange/Imports-for-MPMB-s-Character-Sheet/releases/latest/download/all_WotC_published.min.js) file
1. Import the `Exploits and Spells.js` file
2. Import the file of the class you want

All of my scripts require using v13.0.6 of the sheet or higher.

While I do my best to make my scripts not clash with each other, there is a possibility that importing all of them at once leads to conflicts.

# About Exploits
Many of Laserllama's (sub)classes have exploits, and they are handled in a unique way with MPMB's sheets:
1. Pick them through the "Choose feature" on the top of the second page
2. All chosen exploits will be added to the notes, in a dedicated section. Exploits gained from a subclass also have their own dedicated section.
3. If you want to, you can also create a spell sheet which will contain all chosen Exploits (with short description, duration, save, etc.)

Similarly, you can also create a spell sheet with *all* exploits if you want a short summary before picking, by clicking on "Make a complete spell sheet" > "With all ... spells"

# Edge cases
There are some content that is not possible to add through, or that I chose to add differently. Here is what I'd like to mention:
- Alternate versions of spells are currently not included, but new spells are included
- Pugilist's Iron physique feature on medium armor is not included (only light armor & unarmored) as the sheet can't handle the math required behind it
- Tinker knight's schematics do not go from the assumption the player will be the one to use the schematics so some calculations are not done automatically
- Some subclasses overflow the "class features" box at level 20 because they are too complex to be shortened, if you reach that point feel free to move the text around as desired

# Current content and WIP
Below is the list of what I did so far, and what I have planned.

### Todo
- [ ] Magus
- [ ] Psion
- [ ] Warlord
- [ ] And all other alternate classes
- [ ] Alternate version of spells

### In Progress
- [ ] Alternate Barbarian
- [ ] Alternate Rogue

### Done ✓
- [x] Alternate Monk Expanded
- [x] Alternate Monk
- [x] Alternate Fighter Expanded
- [x] Alternate Fighter
- [x] Core system for Exploits

# Contribute
Found a bug? Want to help? Let me know! You can either create an issue on Github or contact me through Discord at `selene.lullaby` (you will need a mutual server, I am on [MPMB's Discord server](https://discord.gg/Qjq9Z5Q))
