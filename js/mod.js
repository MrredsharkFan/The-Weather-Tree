let modInfo = {
	name: "The Modding Tree",
	id: "mymod",
	author: "",
	pointsName: "points",
	discordName: "",
	discordLink: "",
	initialStartPoints: new ExpantaNum (10), // Used for hard resets and new players
	
	offlineLimit: 100,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.0",
	name: "",
}

let changelog = 
	`<h3>v0.0</h3><br>
THE FIRST UPDATE<br>
Added everything`

let winText = `fuck you!`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new ExpantaNum(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new ExpantaNum(0)

	let gain = new ExpantaNum(1)
	if (hasUpgrade("e", 12)) { gain = gain.times(upgradeEffect("e", 12)) }
	if (hasUpgrade("e", 13)) { gain = gain.times(upgradeEffect("e", 13)) }
	if (hasUpgrade("w", 14)) { gain = gain.times(3) }
	if (hasUpgrade("w", 12)) { gain = gain.times(clickableEffect("w", 11)) }
	if (hasUpgrade("r", 11)) { gain = gain.times(upgradeEffect("r", 11)) }
	if (hasUpgrade("r", 21)) { gain = gain.times(upgradeEffect("r", 21)) }
	if (hasUpgrade("h", 14)) { gain = gain.pow(upgradeEffect("h", 14)) }
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() {
	return {
}}

// Display extra things at the top of the page
var displayThings = ["have u guys realized that being gay is not a mistake, but a sin"]

// Determines when the game "ends"
function isEndgame() {
	return false
}



// Less important things beyond this point!

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(10000000) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}

function addWatering(x) {
	if (hasUpgrade("w", 21)){
		player.w.waterings[x] = player.w.waterings[x].add(player.w.points.div(20))
		player.w.points = player.w.points.sub(player.w.points.div(20))
	}
	else
	{
		player.w.waterings[x] = player.w.waterings[x].add(1)
		player.w.points = player.w.points.sub(1)
	}
}

function getRain(j) {
	e = j.add(1).log(10)
	if (e.gte(10)) {
		e = e.pow(0.5).times(10**0.5)
	}
	if (e.gte(30)) {
		e = e.div(3).slog().times(30)
	}
	if (hasUpgrade("h", 22)) {
		e = e.times(upgradeEffect("h",22))
	}
	return e
}

function getHeat(j) {
	e = j.add(1).log(10).add(1).log(10)
	if (e.gte(10)) {
		e = e.slog().times(10)
	}
	if (e.gte(20)) {
		//e = e.i have fucking no idea(10)
	}
	e = e.add(buyableEffect("h",11))
	return e.add(28)
}