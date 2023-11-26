import { maps } from "./maps.js"
import { FACTIONS } from "./factions.js"
class RoundSettings {
    constructor(playerCount = 2, mapSize = 2, allowedFactions = FACTIONS) {
        this.factions = []
        this.numOfPlayer = playerCount
        this.mapSize = mapSize
        this.allowedFactions = allowedFactions
        this.chooseMap()
        this.chooseEnemyFactions()
        this.render()
    }
    chooseMap() {

        const possibleMaps = Object.groupBy(maps, ({ nplayers }) => nplayers == this.mapSize ? "candidateMaps" : "others")
        return this.map = possibleMaps.candidateMaps[Math.floor(Math.random() * possibleMaps.candidateMaps.length)].name
    }
    chooseEnemyFactions() {
        for (let i = 0; i < this.mapSize - this.numOfPlayer; i++) {
            this.factions.push({ aiNumber: i + 1, faction: this.allowedFactions[Math.floor(Math.random() * this.allowedFactions.length)] })
        }
    }
    render(){
        
        document.querySelector(".response").innerHTML =`<div class="round-card-wrapper"><div class="round-card-header"><h2>Round Info</h2></div><div class="round-card-body"><p class="round-card-info p-player-count"></p><p class="round-card-info p-map-size"></p><p class="round-card-info p-ai-factions"><ul class="round-factions"></ul></p></div><div class="round-card-footer"></div></div>`
        
        document.querySelector(".p-player-count").innerHTML = "Number of Players: " + this.numOfPlayer
        document.querySelector(".p-map-size").innerHTML = "Map: " + this.map

        const ul= document.querySelector(".round-factions")
        for(const faction of this.factions){
            const li = document.createElement("li")
            const span = document.createElement("span")
            span.innerText = "AI n. " + faction.aiNumber
            li.appendChild(span.cloneNode(true))
            span.innerHTML = faction.faction.toUpperCase()
            li.appendChild(span.cloneNode(true))
            ul.appendChild(li)
        }
    }
}
const roundFormRef = document.querySelector(".round-form")
roundFormRef.addEventListener("submit", controlForm)
function controlForm(e) {
    e.preventDefault()

    let values = {
        hasHumanity: roundFormRef.querySelector("#input-human-mod").checked,
        playerCount: roundFormRef.querySelector("#input-player-count").value > 0 ?  roundFormRef.querySelector("#input-player-count").value : 1,
        mapSize: roundFormRef.querySelector("#input-map-size").value > 1 ? roundFormRef.querySelector("#input-map-size").value : 2,
    }

    if (values.hasHumanity) {
        new RoundSettings(values.playerCount, values.mapSize, [...FACTIONS, "humanity"])
    }else new RoundSettings(values.playerCount, values.mapSize)
    roundFormRef.reset()
}
