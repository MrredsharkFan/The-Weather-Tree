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
	if (hasUpgrade("A", 22)) { gain = gain.times(upgradeEffect("A", 22)) }
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
	e = e.add(buyableEffect("h", 11))
	if (hasUpgrade("C",13)){e = e.add(upgradeEffect("C",13))}
	return e.add(28)
}

function getCold(j) {
	e = j.add(1).log().add(1).log()
	if (e.gte(20)){
		e = e.div(2).slog().times(20)
	}
	if (hasUpgrade("C", 14)) { e = e.add(upgradeEffect("C", 14)) }
	if (hasUpgrade("C",21)){e = e.add(upgradeEffect("C",21))}
	e = new ExpantaNum(20).sub(e)
	return e
}

function get_clothing_effect(n=getTotalClothPower()) {
	e = new ExpantaNum(20).sub(n.add(1).pow(0.4).times(2))
	f = new ExpantaNum(10).pow(n.pow(1.25).add(1)).add(1)
	return [e,f]
}

function getBaseOilGain() {
	g = new ExpantaNum(0.01)
	if (hasUpgrade("h", 42)) { g = g.times(2) }
	if (hasUpgrade("h", 43)) {
		g = g.times(upgradeEffect("h", 43))
	}
	return g
}

function getTotalClothPower() {
	g = new ExpantaNum(0)
	upg = [911,912,913,914,915,921,922,923,924,925,931,932,933,934,935]
	for (let i in upg) {
		if (hasUpgrade("C",upg[i])) {
			g = g.add(upgradeEffect("C",upg[i]))
		}
	}
	return g
}