addLayer("ac", {
    name: "action", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "ac", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
		nextTick: Date.now() + 1000,
		actionProgress: 0,
		actionProgressComplete: 0, 
		actionExp: 0 
    }},
    doReset(resettingLayer) {
    },
    color: "#4BDC13",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "Action Points", // Name of prestige currency
    baseAmount() {return player[this.layer].points}, // Get the current amount of baseResource
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    passiveGeneration() {
        return 1
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        return new Decimal(1)
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
	automate() {
		if (Date.now() > player[this.layer].nextTick) {
			player[this.layer].nextTick = player[this.layer].nextTick + 1000;
			if (player[this.layer].actionProgress > 0) {
				player[this.layer].actionProgress = player[this.layer].actionProgress-1
				if (player[this.layer].actionProgress == 0) {
					player.points = player.points.add(player[this.layer].actionExp)
				}
			} else if (player[this.layer].points < 10) {
				player[this.layer].points = player[this.layer].points.add(1);
			}
		}
	},
	bars: {
	    action: {
	        direction: RIGHT,
    	    width: 150,
        	height: 20,
        	progress() {
				if (player[this.layer].actionProgress == 0) {
					return 0
				} 
				return 1 - player[this.layer].actionProgress / player[this.layer].actionProgressComplete
			},
			unlocked() { return true },
	    }
	},
	clickables: {
	    11: {
	        display() {return "Learn something yourself"},
			onClick() {
				startAction(3, 5, 1)
			},
			canClick() {
				return player[this.layer].actionProgress == 0 && player[this.layer].points >= 5
			}
    	},
	    12: {
	        display() {return "Learn something from teacher"},
			onClick() {
				startAction(10, 10, 3)
			},
			canClick() {
				return player[this.layer].actionProgress == 0 && player[this.layer].points >= 10
			}
    	}
	},
	tabFormat: [
    "main-display",
	["display-text", function() {
		if (player[this.layer].actionProgress > 0) {
			return "Action running"
		} else {
			return "Nothing"
		}
	 }],
	["bar", "action"],
	"blank",
	"blank",
	"clickables",
    "upgrades"
	],
    layerShown(){return true}
})

function startAction(progress, cost, exp) {
	player.ac.actionProgress = progress
	player.ac.actionProgressComplete = progress
	player.ac.points = player.ac.points.subtract(cost)
	player.ac.actionExp = exp
}