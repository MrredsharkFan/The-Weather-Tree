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
            body: "first, the gain before 1e10 is LINEAR to points, and <br>of course there is a ^0.5 softcap at 1e10<br><br>ALSO, U13 is softcapped beyond 1e24" +
                "<br><br>A threshold would also be reached somewhere in the future, where your points increase by a whole lot for an instant,<br>but grow much slower further down..." +
            "<br><br>Energy is limited to 1,000x your pending energy."
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
        if (hasUpgrade("C", 15)) { mult = mult.times(upgradeEffect("C", 15)) }
        if (hasUpgrade("h", 55)) { mult = mult.times(upgradeEffect("h", 55)) }
        if (hasUpgrade("C", 35)) { mult = mult.times(upgradeEffect("C", 35)) }
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        e = new ExpantaNum(1)
        if (hasUpgrade("A", 11)){
            e = e.times(1.05)
        }
        if (hasUpgrade("C",33)){e = e.times(upgradeEffect("C",33))}
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
                if (player.w.puddleSize.gte(0)) { s = s.pow(clickableEffect("w", 21)) }
                if (s.gte("1e7200")){
                    s = s.pow(1 / 720).log().times(0.434294481903251827).pow(7200).div("1e1000").add("1e7200")
                }
                if (hasUpgrade("s",22)){s = s.pow(upgradeEffect("s",22))}
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
                if (s.gte(1e24)) { s = s.div(1e14).log(10).pow(24).div(1e9).add(1e24) }
                if (hasUpgrade("A", 13)){s = new ExpantaNum(10).pow(s.add(1).log().times(0.434294482).pow(2))}
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
        if (hasUpgrade("A", 12)) { e = e.times(1.05) }
        if (hasUpgrade("C",25)){e = e.times(upgradeEffect("C",25))}
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
                ["display-text", function () { return "This also corresponds to a humidity of " + format(getRH(player.w.points)[0],5) + "%" }],
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
                if (e.gte("1e7200")) {
                    e = e.pow(1/7200).div(10).log().times(4.34294481903251827).pow(3200).times("1e7200")
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
                if (e.gte(1e8)) { e = e.pow(0.5).times(1e4) }
                if (e.gte("1e7200")) {
                    e = e.pow(1 / 7200).div(10).log().times(4.34294481903251827).add(1).pow(3200).times("1e7200")
                }
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
                if (hasUpgrade("w", 31)) { e = e.pow(2) }
                if (e.gte("1e7200")) {
                    e = e.pow(1 / 7200).div(10).log().times(4.34294481903251827).add(1).pow(3200).times("1e7200")
                }
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
            nl: 0
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
        },
        "???": {
            "content": ["main-display",
                ["display-text", "A certain threshold needs to be reached to unlock this.<br>Come back when you feel like the threshold is reached.<br>It\'s not steaming out..."],
            ["clickables",1]]
        }
    },
    layerShown() {
        return hasUpgrade("w", 51) || player.r.points.gte(1) 
    },
    clickables: {
        11: {
            title: "...",
            display() { return "What kind of new weather can this be..." },
            canClick() {
                return (player.r.nl==0)
            },
            onClick() {
                if (getCold(player.C.points).gte(0)) {
                    alert("You\'re in fact, not ready.")
                } else {
                    alert("Welcome to Check back v3.")
                    player.r.nl = 1
                }
            }
        }
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
        ,
        8: {
            requirementDescription: "1.000e308 total rain droplets",
            effectDescription: "Shop\'s base cost is 1, and automate buying max shops. Same with <b>Global Warming</b>.",
            done() { return player.r.total.gte("1e308") }
        }
        ,
        9: {
            requirementDescription: "Fulfiled the requirement.",
            unlocked(){return this.done()},
            effectDescription: "Unlocks a new layer (Non-reset)",
            done(){return player.r.nl==1}
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
            effect() {
                e = player.r.r_coins.pow(0.25).add(1)
                if (e.gte(1e100)){e = e.log().pow(50).div(1e12).add(1e100)}
                return e
             }
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
            effect() {
                e = player.r.points.add(2).pow(9) 
                if (e.gte("1e7200")){
                    e = e.pow(1/7200).log().pow(2400).times("1e7200")
                }
                return e
            },
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
                if (hasUpgrade("C", 31)) { e = e.pow(upgradeEffect("C",31)) }
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
    tooltip() {
        return format(player.h.points)+" Heat<br><h5>"+format(getHeat(player.h.points),5)+"*C</h5>"
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
            cost: new ExpantaNum(1e24)
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
            time() {
                if (hasUpgrade("s",41)){ return 2}
                if (hasUpgrade("C", 32)) { return 30 }
                return 10
            },
            title: "Cloudburst",
            description() { return "<b>Sudden intensification</b> effect ^1.5, only for 1s every 10s, next activation in " + format(new ExpantaNum(Math.max(0, (this.time() - (Date.now()/1000 % this.time())),4)))+"s" },
            cost: new ExpantaNum(1e28),
            effect() {
                if (Date.now() % (this.time()*1000) < 1000) {
                    e = new ExpantaNum(1.5)
                    if (hasUpgrade("C", 32)) {
                        e = e.times(1.5)
                    }
                    return e
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
        },
        55: {
            unlocked() { return hasUpgrade("h", 54) },
            title: "General Oil usage",
            description: "Oil boosts energy. <br><i>Fact: I have to add this much later because i forgor</i>",
            cost: new ExpantaNum("1e3100"),
            effect() {
                e = new ExpantaNum(10).pow(player.h.oil.log().pow(3.6).div(3))
                return e
            },
            effectDisplay(){return "x"+format(this.effect())}
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
            layerDataReset("A",(hasMilestone("C",1)?["upgrades"]:null))
        }
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
        if (hasUpgrade("C", 12)) { mult = mult.times(upgradeEffect("C", 12)) }
        if (hasUpgrade("C",34)){mult = mult.times(upgradeEffect("C",34))}
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
            effect() {
                e = player.A.points.pow(player.A.points.add(1).log())
                if (e.gte("1e7200")) {
                    e = e.pow(1 / 7200).div(10).log().times(4.34294481903251827).pow(3200).times("1e7200")
                }
                return e
             },
            effectDisplay() {return "x"+format(this.effect())}
        },
        13: {
            title: "2+1/2+1/6+...",
            description: "<b>Let me do something</b>\'s effect is dilated by 2.",
            cost: new ExpantaNum("1e1800")
        },
    }
}
)


function generate_cloth(name, price, effect) {
    return {
        fullDisplay() { return "<h3>" + name + "</h3><br>+" + format(effect.times(new ExpantaNum.pow(2.5, player.C.quality))) + " Clothing power<br>Cost:" + format(price.times(new ExpantaNum.pow(2, player.C.quality))) + " C-coin" },
        canAfford() { return player.C.c_coin.gte(player.C.c_coin_spent.add(price.times(new ExpantaNum.pow(2, player.C.quality)))) },
        pay() { player.C.c_coin_spent = player.C.c_coin_spent.add(price.times(new ExpantaNum.pow(2, player.C.quality))) },
        effect() { return effect.times(new ExpantaNum.pow(2.5, player.C.quality)) }
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
    generate_cloth("Thick pants", new OmegaNum(160), new OmegaNum(9)),
    generate_cloth("Furry pants", new OmegaNum(388), new OmegaNum(14)),
    generate_cloth("Furry pants (luxury)", new OmegaNum(788), new OmegaNum(23)),
    generate_cloth("(So-called Warm) Earphones", new OmegaNum(8), new OmegaNum(1.5)),
    generate_cloth("Earmuffs", new OmegaNum(64), new OmegaNum(4.5)),
    generate_cloth("Normal Hoodie", new OmegaNum(78), new OmegaNum(5.5)),
    generate_cloth("Thick Hoodie", new OmegaNum(138), new OmegaNum(7.5)),
    generate_cloth("Double layer Hoodie", new OmegaNum(288), new OmegaNum(13)),
    generate_cloth("Scarf", new OmegaNum(135), new OmegaNum(8)),
    generate_cloth("Stylish Scarf", new OmegaNum(280), new OmegaNum(11)),
    generate_cloth("Double Scarf", new OmegaNum(420), new OmegaNum(13)),
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
            c_coin_spent: new ExpantaNum(0),
            quality: new ExpantaNum(0)
        }
    },
    tooltip() {
        return format(player.C.points) + " Coldness<br><h5>" + format(getCold(player.C.points), 5) + "*C</h5>"
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
            ["upgrades",5]
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
                        "<br>This returns in a x" + format(get_clothing_effect()[1]) + " boost in heat" +
                    ((hasUpgrade("C",24))?"<br><br>Your current quality is "+format(player.C.quality)+".":null)
                }],
                ["upgrades", [90,91,92,93,94,95]]
            ]
        }
},
    milestones: {
        0: {
            requirementDescription: "<19*C",
            effectDescription: "Gain 300% of Anti-Energy/s.",
            done(){return !getCold(player.C.points).gte(19)}
        }, 
        1: {
            requirementDescription: "<14*C",
            effectDescription: "Anti-energy upgrades are kept upon Coldness reset.",
            done() { return !getCold(player.C.points).gte(14) }
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
            effect() {
                e = new ExpantaNum(20).sub(getCold(player.C.points)).add(1).pow(0.3).sub(1) 
                if (hasUpgrade("C", 52)) {
                    e = e.times(upgradeEffect("C",52))
                }
                return e
            },
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
            effect() {
                e = getRain(player.r.points).add(1).pow(0.25).sub(1)
                if (hasUpgrade("C", 53)) {
                    e = e.pow(1.4)
                }
                return e
             },
            effectDisplay() { return "-" + format(this.effect(), 5) }
        },
        22: {
            title: "Put those MONEY into use!",
            description: "Unlocks jackets",
            cost: new ExpantaNum(144)
        },
        23: {
            title: "AC Mass Production",
            description: "Coldness\' temperature is decreased by 2.",
            cost: new ExpantaNum(1e25)
        },
        24: {
            title: "Quality Control+",
            description: "Unlocks a new feature.",
            cost: new ExpantaNum(2.5e25)
        },
        25: {
            title: "Condensation",
            description: "Coldness\' temperature (needs to be below 10*C) boosts water.",
            cost: new ExpantaNum(1.25e26),
            effect() {
                e = new ExpantaNum(10).sub(getCold(player.C.points))
                e = e.max(0).pow(0.25).div(4).add(1)
                return e
            },
            effectDisplay(){return "^"+format(this.effect(),5)}
        },
        31: {
            title: "Refreshing waTers",
            description: "Overland Flow effect ^1.5.",
            cost: new ExpantaNum(1e28),
            effect() {
                e = new ExpantaNum(1.5)
                if (hasUpgrade("C", 41)) {
                    e = e.times(upgradeEffect("C", 41))
                }
                return e
            },
            effectDisplay(){return "^"+format(this.effect(),5)}
        },
        32: {
            title: "SlighT convecTion",
            description: "<b>Cloudburst</b>\'s active effect x1.5, but the activation interval is set to 30s.",
            cost: new ExpantaNum(2e28)
        },
        33: {
            title: "Comfort",
            description: "The closer the optimal temperature is to the current temperature, the more energy you get.",
            cost: new ExpantaNum(1e29),
            effect() {
                e = get_clothing_effect()[0].sub(getCold(player.C.points)).abs()
                e = new ExpantaNum(0.5).div(e.div(7).add(1)).add(1)
                return e
            },
            effectDisplay() {return "^"+format(this.effect(),5)}
        },
        15: {
            title: "Energizing wash",
            description: "Energy is massively boosted based on coldness.",
            cost: new ExpantaNum(1e30),
            effect() {
                e = player.C.points
                e = new ExpantaNum(10).pow(e.add(1).log().pow(3).div(8))
                return e
            },
            effectDisplay() {return "*"+format(this.effect())}
        },
        34: {
            title: "Preferred tendency",
            description: "Anti-energy is boosted by Energy.",
            cost: new ExpantaNum(1e34),
            effect() {
                e = new ExpantaNum(10).pow(player.e.points.add(1).log().pow(1 / 2.4).div(8))
                if (e.gte("ee10")){
                    e = new ExpantaNum.pow(10,e.add(10).slog().times(10/3).pow(10))
                }
                return e
            },
            effectDisplay(){return "*"+format(this.effect())}
        },
        35: {
            title: "Enhanced Powerhouses",
            description: "Quality boosts energy",
            cost: new ExpantaNum(1e48),
            effect() {
                e = new ExpantaNum(10).pow(player.C.quality.pow(4).times(16767))
                return e
            },
            effectDisplay() { return "*" + format(this.effect()) }
        },
        41: {
            title: "Refreshing wa\'ers^2",
            description: "The less clothes you buy, the stronger <b>Refreshing waTers</b>\'s effect.",
            cost: new ExpantaNum(1e67),
            effect() {
                e = new ExpantaNum(20).sub(getClothesBought())
                return e.div(10).add(1).pow(0.4)
            },
            effectDisplay(){return "*"+format(this.effect())}
        },
        43: {
            title: "Dawn-Dusk Waves",
            cost: new ExpantaNum(1e85),
            effect() {
                e = Math.sin(Date.now() / 4000) * 2.5
                if (hasUpgrade("C", 44)) {
                    e = e/2-1.75
                }
                return new ExpantaNum(e.toString())
            },
            description() { return "Cooled temperature is altered in a <i>wavy</i> way.<br><br>Currently: " + format(this.effect()) }
        },
        44: {
            title: "Coolkeeper devices",
            cost: new ExpantaNum(1e86),
            description: "<b>Dawn-Dusk waves</b>\' effect is better."
        },
        45: {
            title: "Buy 1, get an umbrella free",
            cost: new ExpantaNum(1e86),
            description: "Based on clothing power, exponentiate umbrella gain.",
            effect() {
                e = getTotalClothPower().div(10000).add(1).log().add(1).pow(1.25)
                return e
            },
            effectDisplay(){return "^"+format(this.effect(),5)}
        },
        51: {
            title: "Optimization",
            cost: new ExpantaNum(1e90),
            description: "The softcap of the optimal temperature is set to the current temperature."
        },
        52: {
            title: "EXtRA air condiTioner!!!!",
            cost: new ExpantaNum(1e92),
            description: "<b>Rerouted Heat</b> is stronger based on energy.",
            effect() {
                f = player.e.points.add(10).slog().pow(9).div(5000).add(1)
                return f
            },
            effectDisplay() { return "*" + format(this.effect(), 5) }
        },
        53: {
            title: "Senere scenery",
            description: "<b>Natural raindrops</b>\'s effect ^1.4.",
            cost: new ExpantaNum(1e117)
        },
        901: {
            fullDisplay() { return hasUpgrade("C",24)?"Respec your cloth selection. If you have all the clothing, +1 quality.":"Respec your cloth selection." },
            pay() {
                player.C.upgrades.sort()
                if (player.C.upgrades[player.C.upgrades.length - 1] == 943 && player.C.upgrades[player.C.upgrades.length - 18] == 911) {
                    player.C.quality = player.C.quality.add(1)
                }
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
        941: cloth_grid[15],
        942: cloth_grid[16],
        943: cloth_grid[17],
    }
})

function snowman_button(n,u) {
    return {
        snowman_wait_time() {
            q = 45
            if (hasUpgrade("s", 14)) { q = q + upgradeEffect("s", 14).toNumber() }
            if (hasUpgrade("s", 31)) { q = q * 1.5 }
            if (hasUpgrade("s",42)){q = q * (2**n)/5}
            return q.toFixed(2)
        },
        title() { return "Snowman [" + formatTime(Math.max(0, this.snowman_wait_time() - (Date.now() - player.s.timers[n]) / 1000)) + " left]" },
        unlocked() { return (hasUpgrade("s", 11) && hasUpgrade("s",u)) },
        display() {
            e = getSnowmanGain()
            e = "Build " + format(e) + " snowman(s)! Cooldown: " + this.snowman_wait_time() + "s"
            if (hasUpgrade("s",42)){e = e+"<br>Luck: "+format(new ExpantaNum(2.2**n),4)+"x"}
            return e
        },
        canClick() { return (Date.now() - player.s.timers[n] > this.snowman_wait_time() * 1000) },
        onClick() {
            player.s.snowmans = player.s.snowmans.add(getSnowmanGain())
            player.s.timers[n] = Date.now()
            if (hasUpgrade("s", 31)) {
                r = Math.floor(Math.min(Math.log10((1 / (Math.random()*2.2**(-n))), 6)))
                player.s.rarity_snowmans[r] = player.s.rarity_snowmans[r].add(getSnowmanGain())
            }
        }
    }
}

rarities = ["Common","Uncommon","Rare","Epic","Legendary","Mythical","Omega"]
function get_snowman_rarity_text(){
    return null //dummy functions!!!! who tf cared about optmization on a tmt mod...
}

addLayer("s", {
    name: "Snow",
    tooltip() {
        return format(player.s.snow_depth)+"cm snow"
    },
    symbol: "S",
    color: "#eeeeee",
    branches: ["r", "C"],
    tabFormat: [
        ["display-text", "This layer doesn\'t reset anything.<br>Good luck.<br><h5>Tip: Play this layer like a ... shortened version of check back.</h5>"],
        "blank",
        ["display-text", function () {
            return "Current <font color='#0066ee'>rain</font> accumlation: <h3>" + format(player.s.rain_acc) + "</h3>mm<br><br>" +
                "Current <font color='#aaaaaa'>snow</font> accumlation: <h3>" + format(player.s.snow_depth) + "</h3>cm"
        }],
        "upgrades",
        ["display-text", function(){return "<h3>"+(hasUpgrade("s",11)?format(player.s.snowmans)+"</h3> Snowmans":null)}],
        "clickables",
        ["display-text", function(){return (hasUpgrade("s",31)?get_snowman_rarity_text():null)}]
    ],
    layerShown() { return hasMilestone("r", 9) },
    unlocked() { return this.layerShown() },
    row: 2,
    position: 1,
    type: "none",
    startData() {
        return {
            points: new ExpantaNum(0),
            snow_depth: new ExpantaNum(0),
            rain_acc: new ExpantaNum(0),
            snowmans: new ExpantaNum(0),
            timers: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            rarity_snowmans: [new ExpantaNum(0), new ExpantaNum(0), new ExpantaNum(0), new ExpantaNum(0), new ExpantaNum(0), new ExpantaNum(0), new ExpantaNum(0)],
        }
    },
    upgrades: {
        11: {
            fullDisplay() { return "<h3>Fake<sup>-1</sup> labour</h3><br>Enable the creation of snowmans.<br><br>Cost: 2cm snow." },
            canAfford() { return player.s.snow_depth.gte(2) },
            pay(){ player.s.snow_depth = player.s.snow_depth.sub(2)}
        },
        12: {
            fullDisplay() { return "<h3>Bulk building</h3><br>Snowmans are boosted by snow depth.<br><br>Cost: 2 snowmans<br>Currently: x"+format(this.effect()) },
            canAfford() { return player.s.snowmans.gte(2) },
            pay() { player.s.snowmans = player.s.snowmans.sub(2) },
            effect() {
                e = player.s.snow_depth.add(1).pow(0.5)
                if (hasUpgrade("s",14)){ e = e.pow(2)}
                return e
            }
        },
        13: {
            fullDisplay() { return "<h3>Albedo part 1</h3><br>Snow decreases temperature.<br><br>Cost: 10 snowmans<br>Currently: -" + format(this.effect()) },
            canAfford() { return player.s.snowmans.gte(10) },
            pay() { player.s.snowmans = player.s.snowmans.sub(10) },
            effect() {
                e = player.s.snow_depth.add(1).log().add(1).log()
                if (hasUpgrade("s",34)){e = e.times(upgradeEffect("s",34))}
                return e
             }
        },
        14: {
            fullDisplay() { return "<h3>Detailed constructions</h3><br><b>Bulk Building</b> is better, but the snowman cooldown is increased accordingly.<br><br>Cost: 25 snowmans<br>Currently: +" + format(this.effect())+"s" },
            canAfford() { return player.s.snowmans.gte(25) },
            pay() { player.s.snowmans = player.s.snowmans.sub(25) },
            effect() { return player.s.snow_depth.add(1).slog().times(80) }
        },
        21: {
            fullDisplay() { return "<h3>Coal collection</h3><br>Snowmans can now mine coal (+1x base gain/snowman)<br><br>Cost: 160 Snowmans"},
            canAfford() { return player.s.snowmans.gte(160) },
            pay() { player.s.snowmans = player.s.snowmans.sub(160) }
        },
        22: {
            fullDisplay() { return "<h3>HYPER GENERATORS</h3><br>Snowmans boost the efficiency of <b>2nd Generator</b> AFTER SOFTCAP<br><br>Cost: 225 Snowmans<br>Currently: ^"+format(this.effect(),4) },
            canAfford() { return player.s.snowmans.gte(225) },
            pay() { player.s.snowmans = player.s.snowmans.sub(225) },
            effect() {
                e = player.s.snowmans.add(1).log().div(3).add(1)
                return e
            }
        },
        23: {
            fullDisplay() { return "<h3>Snowing more-\>More snowmans</h3><br>Add a few(5) more snowman buttons<br><br>Cost: 300 Snowmans"},
            canAfford() { return player.s.snowmans.gte(300) },
            pay() { player.s.snowmans = player.s.snowmans.sub(300) }
        },
        24: {
            fullDisplay() { return "<h3>Let them wear some clothing too!</h3><br>+50% Clothing power.<br><br>Cost: 1,500 Snowmans" },
            canAfford() { return player.s.snowmans.gte(1500) },
            pay() { player.s.snowmans = player.s.snowmans.sub(1500) }
        },
        31: {
            fullDisplay() { return "<h3>Demonitization</h3><br>Unlocks one of the most <i>disgusting</i> features in a tmt mod, and x1.5 wait time.<br><br>Cost: 2,500 Snowmans" },
            canAfford() { return player.s.snowmans.gte(2500) },
            pay() { player.s.snowmans = player.s.snowmans.sub(2500) }
        },
        32: {
            fullDisplay() { return "<h3>Specialized <i>Icey</i> Statues</h3><br>Uncommon snowmans decrease temperature.<br><br>Cost: 100 Uncommon snowmans<br>Currently: -"+format(this.effect(),4) },
            canAfford() { return player.s.rarity_snowmans[1].gte(100) },
            pay() { player.s.rarity_snowmans[1] = player.s.rarity_snowmans[1].sub(100) },
            effect() {
                e = player.s.rarity_snowmans[1].add(1).log().div(2.8)
                return e
            }
        },
        33: {
            fullDisplay() { return "<h3>Coldly, Snowed in</h3><br>Temperature boosts snow gain.<br><br>Cost: 1,000 Uncommon snowmans<br>Currently: *" + format(this.effect(), 4) },
            canAfford() { return player.s.rarity_snowmans[1].gte(1000) },
            pay() { player.s.rarity_snowmans[1] = player.s.rarity_snowmans[1].sub(1000) },
            effect() {
                e = new ExpantaNum(0).sub(getCold(player.C.points).min(0)).add(1).pow(2)
                return e
            }
        },
        34: {
            fullDisplay() { return "<h3>Albedo pt.2</h3><br><b>Albedo part 1</b> is stronger based on uncommon snowmans.<br><br>Cost: 2,500 Uncommon snowmans<br>Currently: *" + format(this.effect(), 4) },
            canAfford() { return player.s.rarity_snowmans[1].gte(2500) },
            pay() { player.s.rarity_snowmans[1] = player.s.rarity_snowmans[1].sub(2500) },
            effect() {
                e = player.s.rarity_snowmans[1].add(1).log().div(15).add(1)
                return e
            }
        },
        41: {
            fullDisplay() { return "<h3>Sustainability</h3><br><b>Cloudburst</b>\'s cooldown is 2s.<br><br>Cost: 10,000 Uncommon snowmans"},
            canAfford() { return player.s.rarity_snowmans[1].gte(10000) },
            pay() { player.s.rarity_snowmans[1] = player.s.rarity_snowmans[1].sub(10000) },
        },
        42: {
            fullDisplay() { return "<h3>More sleeping, more calmness</h3><br>Alter the clickables\' mechanics, 'slightly'<br>Also, /5 base wait time, and unlock 3 more clickables.<br><br>Cost: 400,000 Uncommon snowmans" },
            canAfford() { return player.s.rarity_snowmans[1].gte(400000) },
            pay() { player.s.rarity_snowmans[1] = player.s.rarity_snowmans[1].sub(400000) },
        },
        43: {
            fullDisplay() { return "<h3>Iced Lootbozos</h3><br>Rare snowmans decrease temperature.<br><br>Cost: 100,000 Rare snowmans Currently: -" + format(this.effect(), 4) },
            canAfford() { return player.s.rarity_snowmans[2].gte(100000) },
            pay() { player.s.rarity_snowmans[2] = player.s.rarity_snowmans[2].sub(100000) },
            effect(){return player.s.rarity_snowmans[2].add(1).log().div(2.4)}
        }
    },
    clickables: {
        11: snowman_button(0, 11),
        12: snowman_button(1, 23),
        13: snowman_button(2, 23),
        21: snowman_button(3, 23),
        22: snowman_button(4, 23),
        23: snowman_button(5, 23),
        31: snowman_button(6, 42),
        32: snowman_button(7, 42),
        33: snowman_button(8, 42),

    }
}
)