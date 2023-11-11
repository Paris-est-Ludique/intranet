export function gameTitleOrder(boxOrGame: { title: string }): string {
  return boxOrGame.title
    .normalize('NFD')
    .replace(/[\u0300-\u036F]/g, '')
    .toLowerCase()
    .replace(/^[^a-z0-9]+/, '')
    .replace(/^(le |la |les |l'|the )/, '')
    .replace(/[^a-z0-9]/g, '')
}

export function gameTitleCategory(boxOrGame: { title: string }, length = 3): string {
  return gameTitleOrder(boxOrGame)
    .substring(0, length)
    .replace(/([0-9]).+/, '$1')
    .toUpperCase()
}

export function gameTitleExactCategory(boxOrGame: { title: string }): string {
  const cats = [
    ['1', '6'],
    ['7', 'AB'],
    ['AC', 'AK'],
    ['ALA', 'ALO'],
    ['ALP', 'AP'],
    ['AQ', 'ARG'],
    ['ARH', 'AT'],
    ['AU', 'AV'],
    ['AW', 'BAR'],
    ['BAS', 'BER'],
    ['BES', 'BLI'],
    ['BLJ', 'BRE'],
    ['BRF', 'CAC'],
    ['CAD', 'CAP'],
    ['CAQ', 'CEM'],
    ['CEN', 'CHIN'],
    ['CHJ', 'CK'],
    ['CL'],
    ['COA', 'COL'],
    ['COM'],
    ['CON', 'COP'],
    ['COQ', 'CRA'],
    ['CRB', 'DEB'],
    ['DEC', 'DES'],
    ['DET', 'DIC'],
    ['DID', 'DOM'],
    ['DON', 'DR'],
    ['DS', 'ELG'],
    ['ELH', 'EVE'],
    ['EVD', 'FAM'],
    ['FAN', 'FIC'],
    ['FID', 'FOL'],
    ['FOM', 'FUM'],
    ['FUN', 'GEE'],
    ['GED', 'GLA'],
    ['GLB', 'GQ'],
    ['GR', 'HAN'],
    ['HAO', 'HIM'],
    ['HIN', 'IL'],
    ['IM', 'IS'],
    ['IT', 'JE'],
    ['JD', 'KAB'],
    ['KAC', 'KEM'],
    ['KEN', 'KILL'],
    ['KIM', 'KOD'],
    ['KOE', 'LAB'],
    ['LAC', 'LIC'],
    ['LID', 'LIP'],
    ['LIQ', 'LOQ'],
    ['LOR', 'LZ'],
    ['MAA', 'MAN'],
    ['MAO', 'MED'],
    ['MEE', 'MIM'],
    ['MINE', 'MOR'],
    ['MOS', 'MYS'],
    ['MYT', 'NE'],
    ['ND', 'ODD'],
    ['ODE', 'ONE'],
    ['ONF', 'OU'],
    ['OV', 'PAN'],
    ['PAO', 'PEL'],
    ['PEM', 'PIO'],
    ['PIP', 'PLZ'],
    ['PO', 'PRI'],
    ['PRJ', 'PZ'],
    ['QI', 'RAT'],
    ['RAU', 'RI'],
    ['RJ', 'ROO'],
    ['ROP', 'SAL'],
    ['SAM', 'SEI'],
    ['SEJ', 'SIC'],
    ['SID', 'SL'],
    ['SM', 'SO'],
    ['SPA', 'SPX'],
    ['SPY', 'STE'],
    ['STD', 'SUN'],
    ['SUO', 'TAF'],
    ['TAG', 'TD'],
    ['TE', 'TIC'],
    ['TID', 'TIL'],
    ['TIM'],
    ['TIN', 'TO'],
    ['TP', 'TRO'],
    ['TRP', 'UNE'],
    ['UND', 'VEM'],
    ['VEN', 'WAT'],
    ['WAU', 'WH'],
    ['WI', 'YE'],
    ['YOGA', 'ZOO'],
  ]

  const gameCat = gameTitleCategory(boxOrGame, 4)

  const foundCat = cats.find(([a, b]) =>
    b
      ? gameCat.substring(0, a.length) >= a && gameCat.substring(0, b.length) <= `${b}`
      : gameCat.substring(0, a.length) === a,
  )

  if (!foundCat) {
    console.warn('no game found for ', foundCat, boxOrGame.title)
  }

  return foundCat ? `${foundCat[0]}-${foundCat[1]}` : gameCat
}
