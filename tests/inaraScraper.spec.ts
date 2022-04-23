import { getInaraData } from '../src/utils'

const NO_RECORDS_URL =
  'https://inara.cz/nearest-stations/?ps1=sol&pi13=&pi14=0&pi15=0&pi16=&pi1=0&pi18=0&pi19=2000&pi17=0&ps2=&pi8=&pi9=0&pa2%5B20%5D=1&pi3=&pi4=0&pi5=0&pi6=0&pi7=0&pi23=0'

const URLS = {
  factors: {
    url: 'https://inara.cz/nearest-stations/?ps1=sol&pi13=&pi14=0&pi15=0&pi16=&pi1=0&pi18=3&pi19=2000&pi17=1&pi2=1&pa1%5B18%5D=1&pi8=&pi9=0&pi3=&pi4=0&pi5=0&pi6=0&pi7=0&pi23=0',
    cellsPerRow: 7,
  },
  broker: {
    url: 'https://inara.cz/nearest-stations/?ps1=sol&pi13=&pi14=0&pi15=0&pi16=&pi1=0&pi18=0&pi19=2000&pa1%5B26%5D=1&pi8=&pi9=0&pi3=&pi4=0&pi5=0&pi6=0&pi7=0&pi23=0',
    cellsPerRow: 8,
  },
  trader: {
    url: 'https://inara.cz/nearest-stations/?ps1=sol&pi13=&pi14=0&pi15=0&pi16=&pi1=0&pi18=0&pi19=2000&pa1%5B25%5D=1&pi8=&pi9=0&pi3=&pi4=0&pi5=0&pi6=0&pi7=0&pi23=0',
    cellsPerRow: 8,
  },
}

describe('Inara scraper', () => {
  it('should return empty array if no data is found', async () => {
    const data = await getInaraData(NO_RECORDS_URL, 8)
    expect(data.length).toBe(0)
    expect(data).toEqual([])
  })

  it('should return broker data', async () => {
    const data = await getInaraData(URLS.broker.url, URLS.broker.cellsPerRow)
    expect(data.length).toBeGreaterThan(0)
    expect(data[0]).toMatchSnapshot(
      {
        distanceLs: expect.stringContaining('Ls'),
        distanceLy: expect.stringContaining('Ly'),
      },
      'Tech broker data snapshot'
    )
  })

  it('should return trader data', async () => {
    const data = await getInaraData(URLS.trader.url, URLS.trader.cellsPerRow)
    expect(data.length).toBeGreaterThan(0)
    expect(data[0]).toMatchSnapshot(
      {
        distanceLs: expect.stringContaining('Ls'),
        distanceLy: expect.stringContaining('Ly'),
      },
      'Material trader data snapshot'
    )
  })

  // Interstellar factors avaliablity changes over time due to BGS
  it('should return factors data', async () => {
    const data = await getInaraData(URLS.factors.url, URLS.factors.cellsPerRow)
    expect(data.length).toBeGreaterThan(0)
    expect(data[0]).toMatchSnapshot(
      {
        station: expect.any(String),
        system: expect.any(String),
        distanceLs: expect.stringContaining('Ls'),
        distanceLy: expect.stringContaining('Ly'),
      },
      'Interstellar factors data snapshot'
    )
  })
})
