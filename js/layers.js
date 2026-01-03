addLayer("e", {
    name: "Energy", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "E", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: true,
            points: new ExpantaNum(0),
        }
    },
    infoboxes: {
        "softcaps":
        {
            title: "why is this section so fast",
            body: "first, the gain before 1e10 is LINEAR to points, and <br>of course there is a ^0.5 softcap at 1e10<br><br>ALSO, U13 is softcapped beyond 1e24"
        },
    },
    color: "#FFFFAA",
    requires: new ExpantaNum(10), // Can be a function that takes requirement increases into account
    resource: "energy", // Name of prestige currency
    passiveGeneration() { return hasMilestone("r", 1) ? 1 : 0 },
    autoUpgrade() { return hasMilestone("r", 2)},
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() { return player.points }, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1.0, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
        if (hasUpgrade("w", 11)) { mult = mult.times(2) }
        if (hasUpgrade("w", 13)) { mult = mult.times(2) }
        mult = mult.times(clickableEffect("w", 12))
        if (hasUpgrade("w", 15)) { mult = mult.times(upgradeEffect("w", 15)) }
        if (hasUpgrade("h", 12)) { mult = mult.times(upgradeEffect("h", 12)) }
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        e = new ExpantaNum(1)
        if (hasUpgrade("A", 11)){
            e = e.times(1.05)
        }
        return e
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        { key: "e", description: "E: Reset for energy", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
    softcap: new ExpantaNum("1e10"),
    softcapPower: new ExpantaNum(0.5),
    layerShown() { return true },
    upgrades: {
        11: {
            title: "Everything starts normal",
            description: "idk u found a generator somewhere",
            cost: new ExpantaNum(1),
        },
        12: {
            title: "2nd Generator",
            description: "time since reset boosts points gain",
            cost: new ExpantaNum(1),
            effect() {
                s = new ExpantaNum(player.e.resetTime)
                if (hasMilestone("r", 11)) { s = s.times(2.5) }
                if (hasUpgrade("r", 24)) { s = s.times(clickableEffect("w", 23)) }
                if (hasUpgrade("h", 13)) { s = s.times(upgradeEffect("h",13)) }
                s = s.pow(0.25).add(1)
                if (hasUpgrade("w", 22)) { s = s.pow(2) }
                if (hasUpgrade("w", 23)) { s = s.pow(1.5) }
                if (player.w.puddleSize.gte(0)) {s = s.pow(clickableEffect("w",21))}
                return s
            },
            effectDisplay() {return "x"+format(this.effect())}
        },
        13: {
            unlocked(){return hasUpgrade("e",12)},
            title: "let me do something",
            description: "energy boosts points gain",
            cost: new ExpantaNum(2),
            effect() {
                s = player.e.points.add(4).pow(0.5)
                if (hasUpgrade("w", 42)) { s = s.pow(clickableEffect("w", 22)) }
                if (s.gte(1e24)) {s = s.div(1e14).log(10).pow(24).div(1e9).add(1e24)}
                return s
            },
            effectDisplay() {return "x"+format(this.effect())}
        },
        14: {
            unlocked() { return hasUpgrade("e", 12) },
            title: "conversion",
            description: "unlocks <s>3</s>1 layer<s>s</s>",
            cost: new ExpantaNum(201)
        },
        15: {
            unlocked() { return hasUpgrade("e", 14) },
            title: "why did u double this",
            description: "double the effect of <b>conversion</b> (basically unlocks another layer)",
            cost: new ExpantaNum("1.5e150")
        },
        16: {
            unlocked() { return hasUpgrade("e", 15) },
            title: "An unknown force",
            description() { return hasUpgrade("e",16)?"Unlocks Anti-energy.":"????" },
            cost: new ExpantaNum("1e1700")
        }
},
})

addLayer("w", {
    name: "Water", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "W", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: true,
            points: new ExpantaNum(0),
            waterings: [new ExpantaNum(0), new ExpantaNum(0), new ExpantaNum(0)],
            puddleSize: new ExpantaNum(0),
            pondSize: new ExpantaNum(0),
            riverSize: new ExpantaNum(0)
        }
    },
    color: "#8888FF",
    requires: new ExpantaNum(150), // Can be a function that takes requirement increases into account
    resource: "water", // Name of prestige currency
    baseResource: "energy", // Name of resource prestige is based on
    baseAmount() { return player.e.points }, // Get the current amount of baseResource
    onPrestige() {
        if (hasMilestone("r", 3)) {
            addWatering(0)
            addWatering(1)
            addWatering(2)
        }
    },
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.4, // Prestige currency exponent
    staticGeneration() {
        e = hasMilestone("r", 0) ? player.r.points : new ExpantaNum(0)
        if (hasMilestone("r", 2)) {
            e = e.pow(5)
        }
        if (hasUpgrade("r", 23)) {
            e = e.times(upgradeEffect("r",23))
        }
        return e
    },
    passiveGeneration() {
        return (hasMilestone("r",6))?1:0
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
        mult = mult.times(clickableEffect("w", 13))
        if (hasUpgrade("w", 13)) { mult = mult.times(upgradeEffect("r", 13)) }
        if (hasUpgrade("h", 11)) { mult = mult.times(upgradeEffect("h", 11)) }
        return mult
    },
    autoUpgrade(){return hasMilestone("r",5)},
    gainExp() { // Calculate the exponent on main currency from bonuses
        e = new ExpantaNum(1)
        if (hasUpgrade("A",12)){ e = e.times(1.05)}
        return e
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        { key: "w", description: "W: Reset for water", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
    branches: ["e"],
    layerShown() { return hasUpgrade("e", 14) || player.w.points.gte(1) || player.r.points.gte(1) },
    tabFormat: {
        "Main": {
            content: [
                "main-display",
                ["display-text", function () { return "this is enough to fill a box with sides of " + format(player.w.points.pow(1 / 3)) + "cm with air" }],
                "prestige-button",
                "upgrades",
                "blank",
                ["display-text", function () {
                    return hasUpgrade("w", 12) ? "<b>" + format(player.w.waterings[0]) + "</b> drops filled in the grass outside<br><b>" +
                        format(player.w.waterings[1]) + "</b> drops filled in your hydroelectric generator<br><b>" +
                        format(player.w.waterings[2]) + "</b> drops filled in the sky<br><br> Which means x" +
                        format(clickableEffect("w", 11)) + " points,<br> x" +
                        format(clickableEffect("w", 12)) + " energy,<br> and x" +
                        format(clickableEffect("w", 13)) + " water"
                        : null
                }],
                "blank",
                "clickables"
            ]
        },
        "Puddle": {
            unlocked(){return hasUpgrade("w",24)},
            content: [
                "main-display",
                "prestige-button",
                ["display-text", function () {
                    return "your puddle has a volume of " + format(player.w.puddleSize) + "cm^3.<h6> don't worry! this puddle is contained within a really large box, so it won\'t affect residence.</h6>" +
                    "This exponentiates <b>2nd Generator</b>\'s effect by "+format(clickableEffect("w",21))
                }],
                "blank",
                ["display-text", function () {
                    return hasUpgrade("w",42)?"your pond has a volume of " + format(player.w.pondSize) + "m^3.<h6> also allows a large amount of squashy ducks.</h6>" +
                        "This exponentiates <b>let me do something</b>\'s effect by " + format(clickableEffect("w", 22)):null
                }],
                "blank",
                ["display-text", function () {
                    return hasUpgrade("r", 24) ? "your river has a volume of " + format(player.w.riverSize) + "m^3.<br>" +
                        "This increases <b>2nd Generator</b>\'s timespeed by " + format(clickableEffect("w", 23)) : null
                }],
                "clickables"
                ],
        }
    },
    upgrades: {
        11: {
            title: "conductivity",
            description: "x2 energy",
            cost: new ExpantaNum(1)
        },
        12: {
            title: "watering",
            description: "unlocks some places to fill in",
            cost: new ExpantaNum(3)
        },
        13: {
            unlocked() { return hasUpgrade("w", 12) },
            fullDisplay: "<h3>grassy</h3><br>x2 energy<br><br>cost: 3 grass drops",
            canAfford() { return player.w.waterings[0].gte(3) },
            pay(){player.w.waterings[0] = player.w.waterings[0].sub(3)},
        },
        14: {
            unlocked() { return hasUpgrade("w", 12) },
            fullDisplay: "<h3>POWER...</h3><br>x3 points<br><br>cost: 3 hydroelectric generator drops",
            canAfford() { return player.w.waterings[1].gte(3) },
            pay() { player.w.waterings[1] = player.w.waterings[1].sub(3) },
        },
        15: {
            unlocked() { return hasUpgrade("w", 12) },
            title: "storage",
            description: "boost energy based on water",
            cost: new ExpantaNum(30),
            effect() { return player.w.points.pow(0.25).add(1) },
            effectDisplay() {return "x"+format(this.effect())}
        },
        21: {
            unlocked() { return hasUpgrade('w', 15) },
            title: "save the clicking",
            description: "allow you to use 5% of your water when filling in places",
            cost: new ExpantaNum(150)
        },
        22: {
            unlocked() { return hasUpgrade('w', 15) },
            title: "squashy puddle",
            description: "<b>2nd Generator</b> is stronger <br>(^0.25->^0.5)",
            cost: new ExpantaNum(300)
        },
        23: {
            unlocked() { return hasUpgrade('w', 22) },
            title: "slightly bigger puddle",
            description: "<b>2nd Generator</b> is stronger <br>(^0.5->^0.75)",
            cost: new ExpantaNum(3300)
        },
        24: {
            unlocked() { return hasUpgrade('w', 23) },
            title: "nicer puddle",
            description: "learn how to make the puddle bigger",
            cost: new ExpantaNum(13300)
        },
        31: {
            unlocked() { return hasUpgrade('w', 24) },
            title: "still 99.999999% sunny skies",
            description: "sky drops filled\'s effect ^2",
            cost: new ExpantaNum(33330)
        },
        32: {
            unlocked() { return hasUpgrade('w', 24) },
            title: "upgraded infrastructure",
            description: "hydro power drops filled\'s effect ^2",
            cost: new ExpantaNum(3333330)
        },
        33: {
            unlocked() { return hasUpgrade('w', 24) },
            title: "stop watering us vro",
            description: "grass drops filled\'s effect ^2",
            cost: new ExpantaNum(23333330)
        },
        41: {
            unlocked() { return hasUpgrade('w', 33) },
            title: "really large puddle",
            description: "puddle effect ^2",
            cost: new ExpantaNum(3e10)
        },
        42: {
            unlocked() { return hasUpgrade('w', 41) },
            title: "pond",
            description: "unlocks a new puddle",
            cost: new ExpantaNum(1e12)
        },
        51: {
            unlocked() { return hasUpgrade("w", 42) },
            title: "progression in weather",
            description: "unlocks <i>rain</i>",
            cost: new ExpantaNum("1e20")
        }
    },
    clickables: {
        11: {
            title: "the grass outside" ,
            display(){return "drops filled boosts point gain!"},
            unlocked() { return hasUpgrade("w", 12) && player.subtabs.w.mainTabs == "Main" },
            canClick() { return player.w.points.gte(1) },
            onClick() {
                addWatering(0)
            },
            effect() {
                e = player.w.waterings[0].pow(1 / 2).add(1)
                if (hasUpgrade("w", 33)) {
                    e = e.pow(2)
                }
                if (e.gte(1e9)) {
                    e = e.pow(1/3).times(1e6)
                }
                return e
            }
        },
        12: {
            title: "the hydro power generator",
            display: function () { return "drops filled boosts energy gain!" },
            unlocked() { return hasUpgrade("w", 12) && player.subtabs.w.mainTabs == "Main" },
            canClick() { return player.w.points.gte(1) },
            onClick() {
                addWatering(1)
            },
            effect() {
                e = player.w.waterings[1].pow(1 / 4).add(1)
                if (hasUpgrade("w", 32)) {
                    e = e.pow(2)
                }
                if (e.gte(1e8)){e = e.pow(0.5).times(1e4)}
                return e
            }
        },
        13: {
            title: "the sky",
            display: function () { return "drops filled boosts water gain!" },
            unlocked() { return hasUpgrade("w", 12) && player.subtabs.w.mainTabs=="Main" },
            canClick() { return player.w.points.gte(1) },
            onClick() {
                addWatering(2)
            },
            effect() {
                e = player.w.waterings[2].pow(1 / 6).add(1)
                if (hasUpgrade("w",31)){e = e.pow(2)}
                return e
            }
        },
        21: {
            title: "the puddle",
            display: function () { return "expand your puddle (uses all your water)" },
            unlocked() { return hasUpgrade("w", 24) && player.subtabs.w.mainTabs == "Puddle" && !hasMilestone("r",4) },
            canClick() { return player.w.points.gte(1) },
            onClick() {
                player.w.puddleSize = player.w.puddleSize.add(player.w.points.div(10))
                player.w.points = new ExpantaNum(0)
            },
            effect() {
                e = player.w.puddleSize.div(1000).add(1).log().add(1).log().div(2.5).add(1)
                if (hasUpgrade("w", 41)) { e = e.pow(2) }
                if (hasUpgrade("r", 22)) { e = e.pow(1.5) }
                return e
            }
        },
        22: {
            title: "the pond",
            display: function () { return "expand your pond (uses all your water)" },
            unlocked() { return hasUpgrade("w", 42) && player.subtabs.w.mainTabs == "Puddle" && !hasMilestone("r", 4) },
            canClick() { return player.w.points.gte(1) },
            onClick() {
                player.w.pondSize = player.w.pondSize.add(player.w.points.div(1e6))
                player.w.points = new ExpantaNum(0)
            },
            effect() {
                e = player.w.pondSize.div(1000).add(1).log().add(1).log().pow(0.5)
                if (hasUpgrade("h",23)){e = e.pow(2)}
                return e
            }
        },
        23: {
            title: "the river",
            display: function () { return "expand your river (scales logrithmically) (uses all your water)" },
            unlocked() { return hasUpgrade("r", 24) && player.subtabs.w.mainTabs == "Puddle" },
            canClick() { return player.w.points.gte(1) },
            onClick() {
                player.w.riverSize = player.w.riverSize.add(player.w.points.log())
                player.w.points = new ExpantaNum(0)
            },
            effect() {
                e = player.w.riverSize.div(100).add(1)
                return e
            }
        }
    }
})

//fun parts coming up!

addLayer("r", {
    name: "Rain", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "R", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            points: new ExpantaNum(0),
            umbrellas: new OmegaNum(0),
            umbrella_nests: [new OmegaNum(0)],
            r_coins: new OmegaNum(0),
            unlocked: true,
        }
    },
    color: "#3344FF",
    requires: new ExpantaNum(1e20), // Can be a function that takes requirement increases into account
    resource: "rain", // Name of prestige currency
    baseResource: "water", // Name of resource prestige is based on
    baseAmount() { return player.w.points }, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.05, // Prestige currency exponent
    passiveGeneration() {
        return (hasMilestone("r",7)?1:0)
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new ExpantaNum(1)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        { key: "r", description: "R: Reset for rain", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
    branches: ["w"],
    tabFormat: {
        "Main": {
            "content":
                ["main-display",
                    ["display-text", function () { return "Equals to a rain rate of " + format(getRain(player.r.points)) + "mm/h" }],
                    "prestige-button",
                    "milestones"],
        },
        "Umbrellas": {
            "content":
                ["main-display",
                    ["display-text", function () { return "Equals to a rain rate of " + format(getRain(player.r.points)) + "mm/h" }],
                    "prestige-button",
                    ["display-text", function () {
                        return "The rain is making people buy umbrellas! You get R-coins from it.<br>" +
                            "You have " + format(player.r.r_coins) + " R-coins<br> You have sold " +
                        format(player.r.umbrellas) + " umbrellas"
                    }
                    ],
                    "buyables",
                    "upgrades",
                    "blank",
                ["display-text", function() {return hasUpgrade("r",31)?"You have "+format(player.r.umbrella_nests[0])+" nested umbrellas.":null}]]
        }
    },
    layerShown() {
        return hasUpgrade("w", 51) || player.r.points.gte(1) 
    },
    milestones: {
        0: {
            requirementDescription: "1 rain droplets",
            effectDescription: "Based on rain droplets, gain water per second (unaffected by multipliers)<br>Also, x2.5 timespeed of energy layer",
            done(){return player.r.points.gte(0.9999)}
        },
        1: {
            requirementDescription: "2 rain droplets",
            effectDescription: "Automatically gain 100% of energy/s",
            done() { return player.r.points.gte(1.9999) }
        },
        2: {
            requirementDescription: "3 rain droplets",
            effectDescription: "Milestone 1\'s 1st effect ^5, automate energy upgrades<br>Unlocks umbrellas",
            done() { return player.r.points.gte(3) }
        },
        3: {
            requirementDescription: "5 total rain droplets",
            effectDescription: "Automatically assign droplets to the three places upon a water reset.",
            done() { return player.r.total.gte(5) }
        },
        4: {
            requirementDescription: "1,000 total rain droplets",
            effectDescription: "Puddle and pond drops are set to current water.",
            done() { return player.r.total.gte(1000) }
        },
        5: {
            requirementDescription: "10,000 total rain droplets",
            effectDescription: "Automate water upgrades.",
            done() { return player.r.total.gte(10000) }
        },
        6: {
            requirementDescription: "1.000e10 total rain droplets",
            effectDescription: "Gain 100% of water/s. The three dropletty places are automatically assigned costs.",
            done() { return player.r.total.gte(1e10) }
        },
        7: {
            requirementDescription: "1.000e20 total rain droplets",
            effectDescription: "Gain 100% of rain/s.",
            done() { return player.r.total.gte(1e20) }
        }
    },
    buyables: {
        11: {
            title: "Shop",
            display() { return "Buy a shop to sell umbrellas! Cost: "+format(this.cost()) +" rain<br><br>This gets boosted by rain rate. (x"+format(buyableEffect("r",11))+")<br><br>You currently have "+format(getBuyableAmount(this.layer,this.id)) +" shops."},
            cost(x) { return new OmegaNum(3).pow(x) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {
                e = getRain(player.r.points)
                if (hasUpgrade("r",33)){e = new ExpantaNum(2.718281828459045).pow(e)}
                return e
            }
        }
    },
    upgrades: {
        11: {
            fullDisplay() { return "<h3>Red umbrella</h3><br>Points are boosted by umbrellas sold.<br>Cost: 50 umbrellas<br>Currently: x" + format(this.effect()) },
            canAfford() { return player.r.umbrellas.gte(50) },
            pay() { player.r.umbrellas = player.r.umbrellas.sub(50) },
            effect(){return player.r.umbrellas.pow(2.5).add(1)}
        },
        12: {
            fullDisplay() { return "<h3>Orange umbrella</h3><br>R-coins boost umbrellas (also boosts R-coins actually)<br>Cost: 100 R-coins<br>Currently: x" + format(this.effect()) },
            canAfford() { return player.r.r_coins.gte(100) },
            pay() { player.r.r_coins = player.r.r_coins.sub(100) },
            effect() { return player.r.r_coins.pow(0.25).add(1) }
        },
        13: {
            fullDisplay() { return "<h3>Yellow umbrella</h3><br>R-coins boost water<br>Cost: 1,500 R-coins<br>Currently: x" + format(this.effect()) },
            canAfford() { return player.r.r_coins.gte(1500) },
            pay() { player.r.r_coins = player.r.r_coins.sub(1500) },
            effect() { return player.r.r_coins.pow(0.5).add(1) }
        },
        14: {
            fullDisplay() { return "<h3>Green umbrella</h3><br>R-coins are boosted by points<br>Cost: 5,000 R-coins<br>Currently: x" + format(this.effect()) },
            canAfford() { return player.r.r_coins.gte(5000) },
            pay() { player.r.r_coins = player.r.r_coins.sub(5000) },
            effect() { return player.points.add(1).log(10).pow(4).div(1e9).add(1) }
        },
        21: {
            title: "Ripples",
            description: "they evolve. Rain boosts points.",
            cost: new OmegaNum(8),
            effect() { return player.r.points.add(2).pow(9) },
            effectDisplay() {return "x"+format(this.effect())}
        },
        22: {
            title: "Blue Umbrella",
            description: "<i>Feelin Blue, ya?</i> Puddle\'s effect ^1.5",
            cost: new OmegaNum(32)
        },
        23: {
            title: "Multi-point production",
            description: "Shops boost passive water gain.",
            cost: new OmegaNum(64),
            effect() { return player.r.buyables["11"].add(1).pow(8) },
            effectDisplay() { return "x" + format(this.effect()) }
        },
        24: {
            title: "From the sea....",
            description: "Unlock rivers",
            cost: new OmegaNum(100)
        },
        31: {
            title: "To the ring...",
            description: "Unlock Nested Umbrellas.",
            cost: new OmegaNum(250)
        },
        32: {
            unlocked() { return hasUpgrade("r", 31) },
            title: "i forgot to add a boost",
            description: "Nested Umbrellas boost R-coins",
            cost: new OmegaNum(50),
            effect() { return player.r.umbrella_nests[0].pow(0.5) },
            effectDisplay(){return "x"+format(this.effect())}
        },
        33: {
            unlocked() { return hasUpgrade("r", 32) },
            title: "advertising",
            description: "rain rate has a stronger influence on umbrella gain (e^x)",
            cost: new OmegaNum(1000),
        },
        34: {
            unlocked() { return hasUpgrade("r", 33) },
            title: "overland flow",
            description: "gain river water volume based on rain rate",
            cost: new OmegaNum(1e14),
            effect() {
                e = getRain(player.w.points).pow(2)
                if (hasUpgrade("h", 24)) { e = e.pow(1.5) }
                if (hasUpgrade("h", 51)) { e = e.pow(1.5) }
                return e
            },
            effectDisplay(){return format(this.effect())+"/s"},
        }
    }
}

    
    
//here comes the SECOND branch!!!! (somehow the holy grail of my free)
)
addLayer("h", {
    name: "Heat", 
    symbol: "H", 
    position: 1, 
    startData() {
        return {
            unlocked: true,
            points: new ExpantaNum(0),
            oil: new ExpantaNum(0),
            lc: 0,
            lc2: 0,
            lc3: 0,
            lc4: 0,
            lc5: 0
        }
    },
    color: "#FF9900",
    requires: new ExpantaNum(1e150), 
    resource: "heat", 
    baseResource: "energy", 
    baseAmount() { return player.e.points }, 
    type: "normal", 
    exponent: 0.02, 
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
        mult = mult.times(get_clothing_effect()[1])
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new ExpantaNum(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        { key: "h", description: "H: Reset for heat", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
    layerShown() { return hasUpgrade("e",15) || player.h.points.gte(1) },
    branches: ["e"],
    tabFormat: {
        "Main": {
            content: [
            "main-display",
            "prestige-button",
            ["display-text", function () { return "this equates to a temperature of " + format(getHeat(player.h.points),5) + " *C" }],
            ["upgrades","123"],
            "blank",
            "buyables"
            ]
        },
        "Extraction": {
            unlocked(){return hasUpgrade("h",32)},
            content: [
                "main-display",
                "prestige-button",
                ["display-text", function () { return "this equates to a temperature of " + format(getHeat(player.h.points), 5) + " *C" }],
                "blank",
                ["display-text",function(){return "You have extracted "+format(player.h.oil)+"kg of oil, translating to *"+format(clickableEffect("h",11),5)+" global warming effect."}],
                ["upgrades", "45"],
                "clickables"
            ]
        }
},
    upgrades: {
        11: {
            title: "getting a bit heated up!",
            description: "Heat boosts water gain",
            cost: new ExpantaNum(1),
            effect() { return player.h.points.add(2).pow(5) },
            effectDisplay(){return "x"+format(this.effect())}
        },
        12: {
            title: "active atoms",
            description: "Heat boosts energy gain",
            cost: new ExpantaNum(10),
            effect() { return player.h.points.add(1).pow(8) },
            effectDisplay() { return "x" + format(this.effect()) }
        },
        13: {
            title: "Accelration",
            description: "<b>2nd Generation</b>\'s timespeed is boosted by temperature.",
            cost: new ExpantaNum(30),
            effect() { 
                e = getHeat(player.h.points)
                e = e.sub(27).pow(6)
                return e
             },
            effectDisplay() { return "x" + format(this.effect()) }
        },
        14: {
            title: "Heated pionts",
            description: "Temperature exponentiates point gain",
            cost: new ExpantaNum(1000),
            effect() {
                e = getHeat(player.h.points)
                e = e.sub(28).div(10).add(1).pow(0.16)
                return e
            },
            effectDisplay() { return "^" + format(this.effect(),5) }
        },
        21: {
            title: "Oil industry",
            description: "Unlocks a buyable",
            cost: new ExpantaNum(201511210),
        },
        22: {
            unlocked(){return hasUpgrade("h",21)},
            title: "Sudden intensification",
            description: "Global warming boosts rain rate",
            cost: new ExpantaNum(1e9),
            effect() {
                e = getBuyableAmount("h", 11).add(1).pow(0.12)
                if (hasUpgrade("h",53)){e = e.pow(upgradeEffect("h",53))}
                return e
            },
            effectDisplay() {return "x"+format(this.effect())}
        },
        23: {
            unlocked() { return hasUpgrade("h", 21) },
            title: "Pond Travel",
            description: "Pond effect ^2",
            cost: new ExpantaNum(1e10)
        },
        24: {
            unlocked() { return hasUpgrade("h", 23) },
            title: "Sudden flows",
            description: "<b>Overland Flow</b>\'s effect ^1.5",
            cost: new ExpantaNum(1e11)
        },
        31: {
            unlocked() { return hasUpgrade("h", 24) },
            title: "Monentary impact",
            description: "R-coins boost the effect of <b>Global Warming</b>",
            cost: new ExpantaNum(1e12),
            effect() {
                return player.r.r_coins.add(2).log(10).add(1).log(10).div(10).add(1)
            },
            effectDisplay() { return "x" + format(this.effect()) }
        },
        32: {
            unlocked(){return hasUpgrade("h",31)},
            title: "Fossil fuels",
            description: "Unlock the drilling of materials",
            cost: new ExpantaNum(1e14)
        },
        41: {
            unlocked() { return hasUpgrade("h", 32)},
            title: "Oil company",
            description: "Enable the manual extraction of oil.",
            cost: new ExpantaNum(1e13)
        },
        42: {
            unlocked() { return hasUpgrade("h", 41) },
            fullDisplay(){return "<h3>Better oil rigs</h3><br>x2 Oil/extraction.<br><br>Cost: 0.5kg Oil"},
            canAfford() { return player.h.oil.gte(0.5) },
            pay(){player.h.oil = player.h.oil.sub(0.5)}
        },
        43: {
            unlocked() { return hasUpgrade("h", 42) },
            fullDisplay() { return "<h3>Violent Digging</h3><br>Temperature boosts Oil gain.<br><br>Cost: 1.25kg Oil<br>Currently: x"+format(this.effect()) },
            effect() {
                if (!hasUpgrade("h", 54)){
                    e = getHeat(player.h.points).sub(30).max(1).pow(2)
                }
                else {
                    e = new ExpantaNum(2.4).pow(getHeat(player.h.points).sub(30).max(1))
                }
                return e
            },
            canAfford() { return player.h.oil.gte(1.25) },
            pay() { player.h.oil = player.h.oil.sub(1.25) }
        },
        44: {
            unlocked() { return hasUpgrade("h", 43) },
            fullDisplay() { return "<h3>Rarer Oils</h3><br>Unlocks 2 new oil clickables.<br><br>Cost: 10kg Oil" },
            canAfford() { return player.h.oil.gte(10) },
            pay() { player.h.oil = player.h.oil.sub(10) }
        },
        45: {
            unlocked() { return hasUpgrade("h", 41) },
            title: "Check back v2",
            description: "Double the effect of <b>Rarer Oils</b>",
            cost: new ExpantaNum(1e24),
            pay() {
                lc5 = Date.now() + 60000
                lc4 = Date.now() + 3000
            }
        },
        51: {
            unlocked() { return hasUpgrade("h", 44) },
            fullDisplay() { return "<h3>Evil CEOs</h3><br><b>Overland Flow</b> effect ^1.5 again<br><br>Cost: 100kg Oil" },
            canAfford() { return player.h.oil.gte(100) },
            pay() { player.h.oil = player.h.oil.sub(100) }
        },
        52: {
            unlocked() { return hasUpgrade("h", 44) },
            fullDisplay() { return "<h3>Demand</h3><br>Shops boost the effect of <b>Global Warming</b><br><br>Cost: 100kg Oil<br>Effect: *"+format(this.effect()) },
            canAfford() { return player.h.oil.gte(100) },
            pay() {
                player.h.oil = player.h.oil.sub(100)
             },
            effect(){return getBuyableAmount("r",11).add(1).pow(0.3).div(10).add(1)}
        },
        53: {
            unlocked() { return hasUpgrade("h", 52) },
            title: "Cloudburst",
            description() { return "<b>Sudden intensification</b> effect ^1.5, only for 1s every 10s, next activation in "+Math.max(0,(10000-Date.now()%10000)/1000)+"s" },
            cost: new ExpantaNum(1e28),
            effect() {
                if (Date.now() % 10000 < 1000) {
                    return new ExpantaNum(1.5)
                } else {
                    return new ExpantaNum(1)
                }
            },
            effectDisplay()
            {
                return "^" + this.effect()
            }
        },
        54: {
            unlocked() { return hasUpgrade("h", 53) },
            title: "Thermal-induced digging",
            description: "<b>Violent Digging</b>\'s effect is improved.",
            cost: new ExpantaNum(1e29)
        }
    },
    buyables: {
        11: {
            title: "Global warming",
            display() { return "By emitting some oil, the temperature increases. <br>Cost: " + format(this.cost(getBuyableAmount(this.layer, this.id)))+"<br>Currently: +" +format(buyableEffect(this.layer,this.id),5) },
            cost(x) {
                return new ExpantaNum(2).pow(x).times(1e8)
            },
            canAfford() { return player[this.layer].points.gte(this.cost(getBuyableAmount(this.layer, this.id))) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost(getBuyableAmount(this.layer, this.id)))
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {
                e = getBuyableAmount(this.layer, this.id).add(1).log(10).add(1).pow(0.25).sub(1)
                if (hasUpgrade("h", 31)) {
                    e = e.times(upgradeEffect("h",31))
                }
                if (hasUpgrade("h", 41)) {
                    e = e.times(clickableEffect("h",11))
                }
                if (hasUpgrade("h", 52)) {
                    e = e.times(upgradeEffect("h", 52))
                }
                return e
            },
            unlocked(){return hasUpgrade("h",21)}
        }
    },
    clickables: {
        11: {
            title() { return "Click to get oil! (" + Math.max(0,500-(Date.now() - player.h.lc)) + "ms left)" },
            unlocked() { return hasUpgrade("h", 41) },
            canClick() { return (Date.now()-player.h.lc>500) },
            onClick() {
                g = getBaseOilGain()
                player.h.oil = player.h.oil.add(g)
                player.h.lc = Date.now()
            },
            effect() {
                e = player.h.oil.add(1).log().add(1).log().add(1)
                return e
            }
        },
        12: {
            title() { return "Click to get oil![10x] (" + Math.max(0, 5000 - (Date.now() - player.h.lc2)) + "ms left)" },
            unlocked() { return hasUpgrade("h", 44) },
            canClick() { return (Date.now() - player.h.lc2 > 5000) },
            onClick() {
                g = getBaseOilGain()
                player.h.oil = player.h.oil.add(g.times(10))
                player.h.lc2 = Date.now()
            }
        },
        13: {
            title() { return "Click to get oil![100x] (" + Math.max(0, 30000 - (Date.now() - player.h.lc3)) + "ms left)" },
            unlocked() { return hasUpgrade("h", 44) },
            canClick() { return (Date.now() - player.h.lc3 > 30000) },
            onClick() {
                g = getBaseOilGain()
                player.h.oil = player.h.oil.add(g.times(100))
                player.h.lc3 = Date.now()
            }
        },
        14: {
            title() { return "Click to get oil![1,000x] (" + Math.max(0, 120000 - (Date.now() - player.h.lc4))/1000 + "s left)" },
            unlocked() { return hasUpgrade("h", 45) },
            canClick() { return (Date.now() - player.h.lc4 > 120000) },
            onClick() {
                g = getBaseOilGain()
                player.h.oil = player.h.oil.add(g.times(1000))
                player.h.lc4 = Date.now()
            }
        },
        15: {
            title() { return "Click to get oil![10,000x] (" + Math.max(0, 600000 - (Date.now() - player.h.lc5)) / 1000 + "s left)" },
            unlocked() { return hasUpgrade("h", 45) },
            canClick() { return (Date.now() - player.h.lc5 > 600000) },
            onClick() {
                g = getBaseOilGain()
                player.h.oil = player.h.oil.add(g.times(10000))
                player.h.lc5 = Date.now()
            }
        }
    }
})


addLayer("A", {
    name: "Anti-Energy", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: false,
            points: new ExpantaNum(0),
        }
    },
    infoboxes: {
        "misc. info": {
            title: "The",
            body: "This layer won\'t be reset by H, W or R."
    }},
    color: "#22FFAA",
    requires: new ExpantaNum("1e2400"), // Can be a function that takes requirement increases into account
    resource: "anti-energy", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() { return player.points }, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.0025, // Prestige currency exponent
    passiveGeneration() {
        return hasMilestone("C",0)?3:0
    },
    doReset(s) {
        if (s == "C") {
            layerDataReset("A")
        }
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
        if (hasUpgrade("C",12)){mult = mult.times(upgradeEffect("C",12))}
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new ExpantaNum(1)
    },
    unlocked() {
        return (hasUpgrade("e",16) && player.points.gte("1e1000") || player.A.points.gte(1))
    },
    layerShown() {
        return this.unlocked()
    },
    row: 0,
    hotkeys: [
        { key: "a", description: "A: Reset for anti-energy", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
    upgrades: {
        11: {
            title: "emocleW",
            description: "A new start. ^1.05 Energy.",
            cost: new ExpantaNum(2)
        },
        12: {
            title: "beating a jet2 holiday",
            description: "Water gain ^1.05",
            cost: new ExpantaNum(128)
        },
        21: {
            title: "Already???",
            description: "Unlocks a new layer.",
            cost: new ExpantaNum(2048)
        },
        22: {
            title: "(s^2+k)/4s<br>+sk/(s^2+k)",
            description: "Points are boosted by Anti-Energy.",
            cost: new ExpantaNum(141421),
            effect() { return player.A.points.pow(player.A.points.add(1).log()) },
            effectDisplay() {return "x"+format(this.effect())}
        }
    }
}
)

function generate_cloth(name, price, effect) { //putting the function here is one of the best things i've ever done
    return {
        fullDisplay() { return "<h3>" + name + "</h3><br>-" + format(effect) + " Optimal temperature<br>Cost:" + format(price) + " C-coin" },
        canAfford() { return player.C.c_coin.gte(player.C.c_coin_spent.add(price)) },
        pay() { player.C.c_coin_spent = player.C.c_coin_spent.add(price) },
        effect() { return effect }
    }

}
cloth_grid = [
    generate_cloth("Light jacket", new OmegaNum(4), new OmegaNum(1)),
    generate_cloth("Normal jacket", new OmegaNum(24), new OmegaNum(2)),
    generate_cloth("Normal jacket (branded)", new OmegaNum(48), new OmegaNum(4)),
    generate_cloth("Thick jacket", new OmegaNum(96), new OmegaNum(6)),
    generate_cloth("Heavy jacket", new OmegaNum(192), new OmegaNum(8)),
    generate_cloth("Long-sleeved pants", new OmegaNum(40), new OmegaNum(3)),
    generate_cloth("\"Winter\" pants", new OmegaNum(80), new OmegaNum(6.5)),
    generate_cloth("Thick pants", new OmegaNum(160), new OmegaNum(7)),
    generate_cloth("Furry pants", new OmegaNum(388), new OmegaNum(14)),
    generate_cloth("Furry pants (luxury)", new OmegaNum(788), new OmegaNum(23)),
    generate_cloth("(So-called Warm) Earphones", new OmegaNum(8), new OmegaNum(1.5)),
    generate_cloth("Earmuffs", new OmegaNum(64), new OmegaNum(4.5)),
    generate_cloth("Normal Hoodie", new OmegaNum(78), new OmegaNum(5.5)),
    generate_cloth("Thick Hoodie", new OmegaNum(138), new OmegaNum(7.5)),
    generate_cloth("Double layer Hoodie", new OmegaNum(288), new OmegaNum(13)),
]

addLayer("C", {
    name: "Coldness", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "C", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 3, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: true,
            points: new ExpantaNum(0),
            c_coin: new ExpantaNum(0),
            c_coin_spent: new ExpantaNum(0)
        }
    },
    color: "#22AAAA",
    requires: new ExpantaNum("2048"), // Can be a function that takes requirement increases into account
    resource: "Coldness", // Name of prestige currency
    baseResource: "anti-energy", // Name of resource prestige is based on
    baseAmount() { return player.A.points }, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.25, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new ExpantaNum(1)
    },
    branches: ["A"],
    row: 1,
    unlocked() {
        return (player.C.total.gte(1) || hasUpgrade("A",21))
    },
    layerShown() {
        return this.unlocked()
    },
    hotkeys: [
        { key: "c", description: "C: Reset for coldness", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
    tabFormat: {

        "main": {
            "content": [
            "main-display",
            "prestige-button",
            ["display-text", function () { return "This equates to a temperature of " + format(getCold(player.C.points), 5) + "*C" }],
            "milestones",
            ["upgrades",2]
            ]
        },
        "outfits": {
            unlocked(){return hasUpgrade("C",22)},
            "content": [
                "main-display",
                "prestige-button",
                ["display-text", function () { return "This equates to a temperature of " + format(getCold(player.C.points), 5) + "*C" }],
                "blank",
                ["display-text", function () {
                    return "You have " + format(player.C.c_coin.sub(player.C.c_coin_spent)) + "/" + format(player.C.c_coin) + " C-coins." +
                        "<br> Your clothing has brought a total of " + format(getTotalClothPower()) + " Clothing power.<br> This returns an optimal temperature of " + format(get_clothing_effect()[0]) + "*C" +
                    "<br>This returns in a x"+format(get_clothing_effect()[1])+" boost in heat"
                }],
                ["upgrades", [90,91,92,93,94,95]]
            ]
        }
},
    milestones: {
        0: {
            requirementDescription: "<19*C",
            effectDescription: "Gain 300% of Anti-Energy/s.",
            done(){return !getCold(player.C.points).gte(20)}
        }  
    },
    upgrades: {
        11: {
            title: "cool day here",
            description: "Coldness boosts R-coin gain",
            cost: new ExpantaNum(1),
            effect() { return new ExpantaNum(10).pow(player.C.points.add(2).log(10).pow(2)) },
            effectDisplay() { return "x" + format(this.effect()) }
        },
        12: {
            title: "De-energizers",
            description: "Anti-energy is boosted by coldness.",
            cost: new ExpantaNum(2),
            effect() { return player.C.points.add(2).pow(0.5) },
            effectDisplay() { return "x" + format(this.effect()) }
        },
        13: {
            title: "Rerouted heat",
            description: "Heat temperature is boosted by cold temperature.",
            cost: new ExpantaNum(3),
            effect() { return new ExpantaNum(20).sub(getCold(player.C.points)).add(1).pow(0.3).sub(1) },
            effectDisplay() { return "+" + format(this.effect(), 5) }
        },
        14: {
            title: "AC water tubes",
            description: "Water decreases temperature.",
            cost: new ExpantaNum(24),
            effect() { return player.w.points.add(1).log().add(1).log().pow(0.4).sub(1) },
            effectDisplay() { return "-" + format(this.effect(), 5) }
        },
        21: {
            title: "Natural raindrops",
            description: "Rain rate decreases temperature.",
            cost: new ExpantaNum(72),
            effect() { return getRain(player.r.points).add(1).pow(0.25).sub(1) },
            effectDisplay() { return "-" + format(this.effect(), 5) }
        },
        22: {
            title: "Put those MONEY into use!",
            description: "Unlocks jackets",
            cost: new ExpantaNum(144)
        },
        901: {
            fullDisplay: "Respec your cloth selection.",
            pay() {
                player.C.upgrades.sort()
                while (player.C.upgrades[player.C.upgrades.length - 1]>99||player.C.upgrades[player.C.upgrades.length - 1]==null){
                    player.C.upgrades.pop()
                }
                player.C.c_coin_spent = new ExpantaNum(0)
            },
            function() {
                if (player.C.upgrades[player.C.upgrades.length - 1] == "901") {
                    player.C.upgrades.pop()
                }
            }
        },
        911: cloth_grid[0], //CODE SIMPLIFICATION
        912: cloth_grid[1],
        913: cloth_grid[2],
        914: cloth_grid[3],
        915: cloth_grid[4],
        921: cloth_grid[5],
        922: cloth_grid[6],
        923: cloth_grid[7],
        924: cloth_grid[8],
        925: cloth_grid[9],
        931: cloth_grid[10],
        932: cloth_grid[11],
        933: cloth_grid[12],
        934: cloth_grid[13],
        935: cloth_grid[14],
    }
})