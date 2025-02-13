import { scrapeInara } from '../src/utils'

const NO_RECORDS_URL =
  'https://inara.cz/elite/nearest-stations/?formbrief=1&ps1=sol&pi13=&pi14=0&pi15=0&pi16=&pi1=0&pi18=0&pi19=2000&pi17=0&ps2=&pi25=0&pi8=&pi9=0&pa2%5B%5D=20&pi26=0&pi3=&pi4=0&pi5=0&pi7=0&pi23=0&pi6=0&ps3=&pi24=0'

const URLS = {
  factors: {
    url: 'https://inara.cz/elite/nearest-stations/?formbrief=1&ps1=sol&pi13=&pi14=0&pi15=0&pi16=&pi1=0&pi18=3&pi19=2000&pi17=1&pi2=1&pa1%5B%5D=18&ps2=&pi25=0&pi8=&pi9=0&pi26=0&pi3=&pi4=0&pi5=0&pi7=0&pi23=0&pi6=0&ps3=&pi24=0',
    cellsPerRow: 7,
  },
  broker: {
    url: 'https://inara.cz/elite/nearest-stations/?formbrief=1&ps1=sol&pi13=&pi14=0&pi15=0&pi16=&pi1=0&pi18=0&pi19=2000&pi17=2&pi2=1&pa1%5B%5D=26&ps2=&pi25=0&pi8=&pi9=0&pi26=0&pi3=&pi4=0&pi5=0&pi7=0&pi23=0&pi6=0&ps3=&pi24=0',
    cellsPerRow: 8,
  },
  trader: {
    url: 'https://inara.cz/elite/nearest-stations/?formbrief=1&ps1=sol&pi13=&pi14=0&pi15=0&pi16=&pi1=0&pi18=0&pi19=2000&pi17=2&pi2=1&pa1%5B%5D=25&ps2=&pi25=0&pi8=&pi9=0&pi26=0&pi3=&pi4=0&pi5=0&pi7=0&pi23=0&pi6=0&ps3=&pi24=0',
    cellsPerRow: 8,
  },
}

// Mock the redis module
// NOTE: This is a hack to avoid the redis module from being loaded
// I am lazy to do it properly because there are only a few test files
jest.mock('../src/utils/redis', () => ({
  getTrackedFactions: jest.fn(),
  Redis: {
    exists: jest.fn(),
    set: jest.fn(),
    get: jest.fn(),
    del: jest.fn(),
  },
}))

describe('Inara scraper', () => {
  it('should return empty array if no data is found', async () => {
    const data = await scrapeInara(NO_RECORDS_URL, 8)
    expect(data.length).toBe(0)
    expect(data).toEqual([])
  })

  it('should return broker data', async () => {
    const data = await scrapeInara(URLS.broker.url, URLS.broker.cellsPerRow)
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
    const data = await scrapeInara(URLS.trader.url, URLS.trader.cellsPerRow)
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
    const data = await scrapeInara(URLS.factors.url, URLS.factors.cellsPerRow)
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
