import { StationType } from '../constants'

const VaultToInternalStationType: Partial<Record<string, StationType>> = {
  AsteroidBase: StationType.AsteroidStation,
  Coriolis: StationType.Coriolis,
  MegaShip: StationType.Megaship,
  Ocellus: StationType.Ocellus,
  OnFootSettlement: StationType.PlanetarySettlement,
  Orbis: StationType.Orbis,
  Outpost: StationType.Outpost,
  PlanetaryOutpost: StationType.PlanetarySettlement,
  PlanetaryPort: StationType.SurfacePort,
}

export const mapVaultStationType = (stationType: string | null): StationType | null =>
  stationType ? (VaultToInternalStationType[stationType] ?? null) : null
