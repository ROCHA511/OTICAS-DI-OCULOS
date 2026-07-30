export interface LensPriceItem {
  code: string;
  brand: string;
  category: 'Visão Simples' | 'Multifocal' | 'Bifocal' | 'Tratamento';
  name: string;
  price: number;
  costPrice?: number;
  quantity?: number;
  supplier?: string;
  refractionIndex?: string;
  protections?: string;
  type?: string;
}

export const OFFICIAL_PRICE_TABLE: LensPriceItem[] = [
  // --- HOYA ---
  { code: '1100', brand: 'HOYA', category: 'Visão Simples', name: 'VS ULTRAX & THINHARD ORGANIC', price: 180.0 },
  { code: '1100', brand: 'HOYA', category: 'Visão Simples', name: 'VS ULTRAX & THINHARD AQUA 1.53', price: 390.0 },
  { code: '1100', brand: 'HOYA', category: 'Visão Simples', name: 'VS ULTRAX & THINHARD SENSITY HARD 1.53', price: 699.0 },
  { code: '1111', brand: 'HOYA', category: 'Visão Simples', name: 'VSPREMIUM BLUECONTROL 1.53', price: 860.0 },
  { code: '1111', brand: 'HOYA', category: 'Visão Simples', name: 'VS PREMIUM SENSITY 2 LONGLIFE', price: 1419.0 },
  { code: '1156', brand: 'HOYA', category: 'Multifocal', name: 'MF DAYNAMIC NO-RISK BLUECONTROL', price: 2755.0 },
  { code: '1157', brand: 'HOYA', category: 'Multifocal', name: 'MF DAYNAMIC SENSITY2', price: 3305.0 },
  { code: '1112', brand: 'HOYA', category: 'Multifocal', name: 'MF AMPLUS HARD 1.53', price: 895.0 },
  { code: '1112', brand: 'HOYA', category: 'Multifocal', name: 'MF AMPLUS NO-RISK BLUECONTROL', price: 1595.0 },
  { code: '1121', brand: 'HOYA', category: 'Multifocal', name: 'MF AMPLUS SENSITYHARD', price: 1570.0 },
  { code: '1122', brand: 'HOYA', category: 'Multifocal', name: 'MF AMPLUS SENSITYHARD 2', price: 1845.0 },
  { code: '1155', brand: 'HOYA', category: 'Multifocal', name: 'MF ARGOS HARD 1.53', price: 1245.0 },
  { code: '1154', brand: 'HOYA', category: 'Multifocal', name: 'MF ARGOS NO-RISK BLUECONTROL', price: 1945.0 },
  { code: '1154', brand: 'HOYA', category: 'Multifocal', name: 'MF ARGOS SENSITY', price: 2220.0 },
  { code: '1154', brand: 'HOYA', category: 'Multifocal', name: 'MF ARGOS SENSITY 2', price: 2495.0 },
  { code: '1155', brand: 'HOYA', category: 'Multifocal', name: 'MF DAYNAMIC HARD 1.53', price: 2055.0 },

  // --- ZEISS ---
  { code: '010001', brand: 'ZEISS', category: 'Visão Simples', name: 'FREEFORM 1.50 DURAVISION CHROME UV', price: 870.0 },
  { code: '010024', brand: 'ZEISS', category: 'Visão Simples', name: 'VS FREEFORM 1.60 DURAVISION CHROME UV', price: 1250.0 },
  { code: '010124', brand: 'ZEISS', category: 'Visão Simples', name: 'VS PHOTOFUSION 1.50 DURAVISION CHROME', price: 1710.0 },
  { code: '010002', brand: 'ZEISS', category: 'Visão Simples', name: 'VS PHOTOFUSION 1.60 DURAVISION CHROME', price: 2190.0 },
  { code: '010026', brand: 'ZEISS', category: 'Visão Simples', name: 'VS SMARTLIFE 1.50 DURAVISION CHROME UV', price: 1055.0 },
  { code: '010097', brand: 'ZEISS', category: 'Visão Simples', name: 'VS SMARTLIFE 1.60 DURAVISION CHROME', price: 1439.0 },
  { code: '010018', brand: 'ZEISS', category: 'Visão Simples', name: 'VS SMARTLIFE PHOTOFUSION 1.50', price: 1899.0 },
  { code: '010098', brand: 'ZEISS', category: 'Visão Simples', name: 'VS SMARTLIFE PHOTOFUSION 1.60', price: 2359.0 },
  { code: '010104', brand: 'ZEISS', category: 'Multifocal', name: 'MF GT2 DURAVISION CHROME UV', price: 895.0 },
  { code: '010125', brand: 'ZEISS', category: 'Multifocal', name: 'MF GT2 1.60 DURAVISION CHROME UV', price: 1279.0 },
  { code: '010126', brand: 'ZEISS', category: 'Multifocal', name: 'MF GT2 PHOTOFUSION', price: 1989.0 },
  { code: '010127', brand: 'ZEISS', category: 'Multifocal', name: 'MF GT2 PHOTOFUSION 1.60', price: 2469.0 },
  { code: '010128', brand: 'ZEISS', category: 'Multifocal', name: 'MF GT2 DURAVISION PLATINUM 1.50', price: 1179.0 },
  { code: '010029', brand: 'ZEISS', category: 'Multifocal', name: 'MF LIGHT D DURAVISION CHROME UV', price: 1249.0 },
  { code: '010030', brand: 'ZEISS', category: 'Multifocal', name: 'MF LIGHT D PHOTOFUSION', price: 2439.0 },
  { code: '010100', brand: 'ZEISS', category: 'Multifocal', name: 'MF LIGHT 3D DURAVISION CHROME UV', price: 1649.0 },
  { code: '010129', brand: 'ZEISS', category: 'Multifocal', name: 'MF LIGHT 3D PHOTOFUSION', price: 2839.0 },
  { code: '010052', brand: 'ZEISS', category: 'Multifocal', name: 'MF SMARTLIFE ESSENTIAL DURAVISION CHROME', price: 2640.0 },
  { code: '010130', brand: 'ZEISS', category: 'Multifocal', name: 'MF SMARTLIFE ESSENTIAL PHOTOFUSION', price: 3830.0 },

  // --- KODAK & GALAXY ---
  { code: '010104', brand: 'KODAK', category: 'Multifocal', name: 'KODAK PRECISE UHD AR', price: 995.0 },
  { code: '010125', brand: 'KODAK', category: 'Multifocal', name: 'KODAK PRECISE UHD TRANS.', price: 1350.0 },
  { code: '010126', brand: 'KODAK', category: 'Multifocal', name: 'KODAK PRECISE UHD POLY', price: 1750.0 },
  { code: '010127', brand: 'KODAK', category: 'Multifocal', name: 'KODAK POLY TRANS.', price: 2000.0 },
  { code: '010128', brand: 'KODAK', category: 'Multifocal', name: 'KODAK 1.67 AR', price: 2300.0 },
  { code: '010104', brand: 'KODAK', category: 'Multifocal', name: 'KODAK PRECISE UHD', price: 749.0 },

  { code: '010072', brand: 'GALAXY', category: 'Multifocal', name: 'MF GALAXY POLLY SEM AR', price: 900.0 },
  { code: '010072', brand: 'GALAXY', category: 'Multifocal', name: 'MF GALAXY POLLY AR', price: 1100.0 },
  { code: '010072', brand: 'GALAXY', category: 'Multifocal', name: 'MF GALAXY POLLY TRANS.', price: 1799.0 },
  { code: '010072', brand: 'GALAXY', category: 'Multifocal', name: 'MF GALAXY POLLY TRANS. AR BLU', price: 1899.0 },
  { code: '3745', brand: 'GALAXY', category: 'Multifocal', name: 'MF C.O AR C.O CLIN 1.67', price: 1250.0 },
  { code: '010021', brand: 'GALAXY', category: 'Multifocal', name: 'C.O TRANSITIONS \\ SPACE 1.67', price: 2600.0 },
  { code: '010072', brand: 'GALAXY', category: 'Multifocal', name: 'MF GALAXY 1.67 SEM AR (BLU NA MASSA)', price: 1550.0 },
  { code: '010072', brand: 'GALAXY', category: 'Multifocal', name: 'MF GALAXY 1.67 AR BLU', price: 1699.0 },

  // --- VARILUX & ESPACE ---
  { code: '010029', brand: 'VARILUX', category: 'Multifocal', name: 'MF VX LIBERTY', price: 990.0 },
  { code: '010029', brand: 'VARILUX', category: 'Multifocal', name: 'MF VX LIBERTY AR', price: 1300.0 },
  { code: '010030', brand: 'VARILUX', category: 'Multifocal', name: 'MF VX LIBERTY TRANS.', price: 2500.0 },
  { code: '010100', brand: 'VARILUX', category: 'Multifocal', name: 'MF VX LIBERTY AIRWEAR', price: 1400.0 },
  { code: '010129', brand: 'VARILUX', category: 'Multifocal', name: 'MF VX LIBERTY AIRWEAR TRANS.', price: 2200.0 },
  { code: '010052', brand: 'VARILUX', category: 'Multifocal', name: 'MF VX COMFORT MAX', price: 1500.0 },
  { code: '010130', brand: 'VARILUX', category: 'Multifocal', name: 'MF VX COMFORT MAX 1.67 CRIZAL', price: 4700.0 },
  { code: '010131', brand: 'VARILUX', category: 'Multifocal', name: 'MF VX COMFORT MAX TRANS.', price: 2800.0 },
  { code: '010071', brand: 'VARILUX', category: 'Multifocal', name: 'MF VX PHYSIO 3.0 CRIZAL PREVENCIA', price: 3500.0 },
  { code: '010072', brand: 'VARILUX', category: 'Multifocal', name: 'MF VX PHYSIO 3.0 TRANS. CRIZAL PV', price: 4700.0 },

  { code: '010018', brand: 'MULTIFOCAIS C.O', category: 'Multifocal', name: 'ESPACE ORMA / SMALL', price: 460.0 },
  { code: '010018', brand: 'MULTIFOCAIS C.O', category: 'Multifocal', name: 'ESPACE ORMA / SMALL AR', price: 650.0 },
  { code: '010021', brand: 'MULTIFOCAIS C.O', category: 'Multifocal', name: 'C.O TRANSITIONS \\ SPACE', price: 1450.0 },

  // --- MULTIFOCAIS C.O ---
  { code: '5982', brand: 'MULTIFOCAIS C.O', category: 'Multifocal', name: 'MULTIFOCAL C.O', price: 300.0 },
  { code: '5982', brand: 'MULTIFOCAIS C.O', category: 'Multifocal', name: 'MF C.O AR C.OCLIN', price: 550.0 },
  { code: '17032', brand: 'MULTIFOCAIS C.O', category: 'Multifocal', name: 'MF C.O CLIN AR BLUE IPER CLIN', price: 800.0 },
  { code: '1774', brand: 'MULTIFOCAIS C.O', category: 'Multifocal', name: 'MF C.O POLLY AR', price: 700.0 },
  { code: '1992', brand: 'MULTIFOCAIS C.O', category: 'Multifocal', name: 'MF C.O FOTO', price: 599.0 },
  { code: '010026', brand: 'MULTIFOCAIS C.O', category: 'Multifocal', name: 'MF FOTO AR', price: 750.0 },
  { code: '010026', brand: 'MULTIFOCAIS C.O', category: 'Multifocal', name: 'MF FOTO AR BLUE', price: 890.0 },
  { code: '26488', brand: 'MULTIFOCAIS C.O', category: 'Multifocal', name: 'C.O TRANSITIONS', price: 1000.0 },

  // --- VISÃO SIMPLES & TRATAMENTOS ---
  { code: '17840', brand: 'VISÃO SIMPLES & TRATAMENTOS', category: 'Visão Simples', name: 'VS ORGANICAS +6A -6 CIL 2.00', price: 150.0 },
  { code: '21837', brand: 'VISÃO SIMPLES & TRATAMENTOS', category: 'Visão Simples', name: 'VS ORGANICAS SURF +4A -4CIL 4', price: 240.0 },
  { code: '279', brand: 'VISÃO SIMPLES & TRATAMENTOS', category: 'Visão Simples', name: 'VS AR CIL ATÉ +3 A -3 CIL 2', price: 219.0 },
  { code: '674', brand: 'VISÃO SIMPLES & TRATAMENTOS', category: 'Visão Simples', name: 'VS AR SURF +6 A -6 CIL 4.00', price: 300.0 },
  { code: '17592', brand: 'VISÃO SIMPLES & TRATAMENTOS', category: 'Visão Simples', name: 'VS BLUE +3 A -3 CIL 2', price: 300.0 },
  { code: '18545', brand: 'VISÃO SIMPLES & TRATAMENTOS', category: 'Visão Simples', name: 'VS BLUE SURF -5 A +4 CL 4', price: 400.0 },
  { code: '3220', brand: 'VISÃO SIMPLES & TRATAMENTOS', category: 'Visão Simples', name: 'VS POLY AR +4 A -6 CIL 4.00', price: 400.0 },
  { code: '527', brand: 'VISÃO SIMPLES & TRATAMENTOS', category: 'Visão Simples', name: 'VS POLY AR SURF. +6 A -6 CIL 4', price: 500.0 },
  { code: '1591', brand: 'VISÃO SIMPLES & TRATAMENTOS', category: 'Visão Simples', name: 'VS AR 1.61 +6 / -10 CIL 2', price: 680.0 },
  { code: '1593', brand: 'VISÃO SIMPLES & TRATAMENTOS', category: 'Visão Simples', name: 'VS AR 1.67 +6 / -12 CIL 2', price: 790.0 },
  { code: '17594', brand: 'VISÃO SIMPLES & TRATAMENTOS', category: 'Visão Simples', name: 'VS 1.67 AR SUF +6 A 10 CIL 4', price: 890.0 },
  { code: '17595', brand: 'VISÃO SIMPLES & TRATAMENTOS', category: 'Visão Simples', name: 'VS 1.67 AR BLUE -6 A -8 CIL 2', price: 950.0 },
  { code: '14036', brand: 'VISÃO SIMPLES & TRATAMENTOS', category: 'Visão Simples', name: 'VS 1.74 SURF -12 A -15 CIL 2', price: 1270.0 },
  { code: '010108', brand: 'VISÃO SIMPLES & TRATAMENTOS', category: 'Visão Simples', name: 'KODAK BLUE', price: 390.0 },
  { code: '010108', brand: 'VISÃO SIMPLES & TRATAMENTOS', category: 'Visão Simples', name: 'KODAK BLUE POLY', price: 600.0 },
  { code: '010108', brand: 'VISÃO SIMPLES & TRATAMENTOS', category: 'Visão Simples', name: 'KODAK BLUE 1.67', price: 1100.0 },

  // --- VS CRIZAL, FOTO & TRANSITIONS ---
  { code: '010042', brand: 'VISÃO SIMPLES & TRATAMENTOS', category: 'Visão Simples', name: 'VS CRIZAL EASY PRÓ', price: 450.0 },
  { code: '010042', brand: 'VISÃO SIMPLES & TRATAMENTOS', category: 'Visão Simples', name: 'VS CRIZAL ROCK', price: 670.0 },
  { code: '010122', brand: 'VISÃO SIMPLES & TRATAMENTOS', category: 'Visão Simples', name: 'VS CRIZAL PREVENCIASAPPHIRE', price: 899.0 },
  { code: '908', brand: 'VISÃO SIMPLES & TRATAMENTOS', category: 'Visão Simples', name: 'VS FOTO AR +6A -6CIL2', price: 380.0 },
  { code: '10612', brand: 'VISÃO SIMPLES & TRATAMENTOS', category: 'Visão Simples', name: 'VS FOTO SURF. AR +4A-6 CIL 4', price: 499.0 },
  { code: '25078', brand: 'VISÃO SIMPLES & TRATAMENTOS', category: 'Visão Simples', name: 'VS TRANSITIONS NG.', price: 680.0 },
  { code: '010006', brand: 'VISÃO SIMPLES & TRATAMENTOS', category: 'Visão Simples', name: 'VS TRANSITIONS NG. AR', price: 780.0 },
  { code: '010059', brand: 'VISÃO SIMPLES & TRATAMENTOS', category: 'Visão Simples', name: 'VS TRANS. SURF. AR', price: 1100.0 },
  { code: '010063', brand: 'VISÃO SIMPLES & TRATAMENTOS', category: 'Visão Simples', name: 'VS TRANS. 1.67 SURF.', price: 1600.0 },
  { code: '010087', brand: 'VISÃO SIMPLES & TRATAMENTOS', category: 'Visão Simples', name: 'VS POLY TRANSITIONS N.G', price: 1300.0 },
];
