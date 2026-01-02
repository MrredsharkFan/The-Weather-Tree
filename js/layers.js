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
        if (hasUpgrade("w", 15)) { mult = mult.times(upgradeEffect("w",15)) }
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new ExpantaNum(1)
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
                if (hasUpgrade("r", 24)) { s = s.times(clickableEffect("w",23)) }
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
            description: "double the effect of <b>conversion</b> [WIP]",
            cost: new ExpantaNum("1.5e150")
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
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
        mult = mult.times(clickableEffect("w", 13))
        if (hasUpgrade("w",13)){mult = mult.times(upgradeEffect("r",13))}
        return mult
    },
    autoUpgrade(){return hasMilestone("r",5)},
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new ExpantaNum(1)
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
        }
    }
}

)
addLayer("h", {
    name: "Heat", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "H", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: true,
            points: new ExpantaNum(0),
        }
    },
    color: "#FF9900",
    requires: new ExpantaNum(1e150), // Can be a function that takes requirement increases into account
    resource: "heat", // Name of prestige currency
    baseResource: "energy", // Name of resource prestige is based on
    baseAmount() { return player.e.points }, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.02, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new ExpantaNum(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        { key: "h", description: "H: Reset for heat", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
    layerShown() { return true },
    branches: ["e"],
})