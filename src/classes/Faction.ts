/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import got from 'got'

export class Faction {
  name: string
  shortName: string
  id: number
  eddbId: number
  inaraUrl: string
  isSetup: boolean

  constructor(name: string, shortName?: string) {
    this.name = name
    this.shortName = shortName || name
    this.id = 0
    this.eddbId = 0
    this.inaraUrl = ''
    this.isSetup = false
  }

  // TODO think about error throwing
  async setup() {
    const factionNameEncoded = encodeURIComponent(this.name)

    const url = `https://elitebgs.app/api/ebgs/v5/factions?name=${factionNameEncoded}`
    const { docs } = await got(url).json()

    this.id = docs[0]._id
    this.eddbId = docs[0].eddb_id
    this.inaraUrl = `https://inara.cz/minorfaction/?search=${factionNameEncoded}`
    this.isSetup = true
  }

  getName() {
    return this.name
  }

  getShortName() {
    return this.shortName
  }

  getId() {
    return this.id
  }

  getEddbId() {
    return this.eddbId
  }

  getInaraUrl() {
    return this.inaraUrl
  }

  getIsSetup() {
    return this.isSetup
  }
}
