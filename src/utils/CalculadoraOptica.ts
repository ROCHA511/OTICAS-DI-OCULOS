// ============================================================================
// MOTOR DE CÁLCULO ÓPTICO MATEMÁTICO - OPTICAMESH AI
// Fórmulas Geométricas de Lentes e Armações
// ============================================================================

export interface ParametrosArmacao {
  aroHorizontalA: number; // Aros horizontal (mm)
  aroVerticalB: number;   // Aro vertical (mm)
  ponteDbl: number;       // Ponte da armação (mm)
  ed: number;             // Diagonal maior (se houver)
}

export interface ReceitaMedidas {
  dnpOD: number;
  dnpOE: number;
  alturaOD: number;
  alturaOE: number;
}

export interface ResultadoCalculoOptico {
  dbc: number;                   // Distância entre centros ópticos da armação (mm)
  centroGeometrico: number;      // CG = DBC / 2 (mm)
  descentracaoOD: number;        // Descentração Olho Direito (mm)
  descentracaoOE: number;        // Descentração Olho Esquerdo (mm)
  descentracaoTotal: number;     // Descentração Total (mm)
  maiorDescentracao: number;     // Maior descentração absoluta (mm)
  edCalculado: number;           // Diagonal maior calculada (mm)
  diametroMinimoLente: number;   // Diâmetro mínimo de bloco da lente (mm)
  corredorMultifocal: string;    // 'Não recomendado', 'Curto', 'Médio', 'Longo' ou 'Premium'
  centroOpticoHorizontalOD: number;
  centroOpticoHorizontalOE: number;
  centroOpticoVerticalOD: number;
  centroOpticoVerticalOE: number;
}

/**
 * Realiza os cálculos de geometria óptica baseados na receita, armação e DNP obtidos por IA.
 */
export function calcularGeometriaOptica(
  armacao: ParametrosArmacao,
  medidas: ReceitaMedidas
): ResultadoCalculoOptico {
  // 1. MÓDULO 04 - DBC (DBC = ARO_HORIZONTAL + PONTE)
  const dbc = armacao.aroHorizontalA + armacao.ponteDbl;

  // 2. Centro Geométrico (CG = DBC / 2)
  const centroGeometrico = dbc / 2;

  // 3. Descentrações por Olho (CG - DNP)
  const descentracaoOD = centroGeometrico - medidas.dnpOD;
  const descentracaoOE = centroGeometrico - medidas.dnpOE;

  // 4. Descentração Total (DBC - DP_Total)
  const dpTotal = medidas.dnpOD + medidas.dnpOE;
  const descentracaoTotal = dbc - dpTotal;

  // 5. Maior Descentração Absoluta
  const maiorDescentracao = Math.max(
    Math.abs(descentracaoOD),
    Math.abs(descentracaoOE)
  );

  // 6. MÓDULO 05 - Diagonal Maior (ED) se não existir
  const edCalculado = armacao.ed && armacao.ed > 0
    ? armacao.ed
    : Math.sqrt(Math.pow(armacao.aroHorizontalA, 2) + Math.pow(armacao.aroVerticalB, 2));

  // 7. MÓDULO 06 - Diâmetro Mínimo da Lente
  // DIAMEETRO_LENTE = ED + (MAIOR_DESCENTRACAO * 2) + 2
  const diametroMinimoLente = edCalculado + (maiorDescentracao * 2) + 2;

  // 8. MÓDULO 07 - Centro Óptico
  const coHorizontalOD = medidas.dnpOD;
  const coHorizontalOE = medidas.dnpOE;
  const coVerticalOD = medidas.alturaOD;
  const coVerticalOE = medidas.alturaOE;

  // 9. MÓDULO 09 - Multifocal Inteligente baseado nas alturas pupilares reais
  const menorAltura = Math.min(medidas.alturaOD, medidas.alturaOE);
  let corredorMultifocal = 'Não recomendado';
  
  if (menorAltura >= 22) {
    corredorMultifocal = 'Corredor Premium (Altura >= 22mm)';
  } else if (menorAltura >= 20) {
    corredorMultifocal = 'Corredor Longo (Altura >= 20mm)';
  } else if (menorAltura >= 18) {
    corredorMultifocal = 'Corredor Médio (Altura >= 18mm)';
  } else if (menorAltura >= 14) {
    corredorMultifocal = 'Corredor Curto (Altura >= 14mm)';
  }

  return {
    dbc,
    centroGeometrico,
    descentracaoOD,
    descentracaoOE,
    descentracaoTotal,
    maiorDescentracao,
    edCalculado: Math.round(edCalculado * 100) / 100,
    diametroMinimoLente: Math.round(diametroMinimoLente * 100) / 100,
    corredorMultifocal,
    centroOpticoHorizontalOD: coHorizontalOD,
    centroOpticoHorizontalOE: coHorizontalOE,
    centroOpticoVerticalOD: coVerticalOD,
    centroOpticoVerticalOE: coVerticalOE
  };
}

/**
 * MÓDULO 10 - Validador de Armação e Lentes (Score de Adaptação de 0 a 100)
 */
export function validarCompatibilidadePreditiva(
  grauEsferico: number,
  grauCilindrico: number,
  armacao: ParametrosArmacao,
  medidas: ReceitaMedidas,
  indiceRefracao: number
): { score: number; riscos: string[]; recomendacoes: string[] } {
  const calculos = calcularGeometriaOptica(armacao, medidas);
  const riscos: string[] = [];
  const recomendacoes: string[] = [];
  let score = 100;

  const grauTotalAbs = Math.abs(grauEsferico) + Math.abs(grauCilindrico);

  // 1. Validação de diâmetro mínimo do bloco
  if (calculos.diametroMinimoLente > 80) {
    riscos.push("Diâmetro mínimo de lente extremamente grande (necessita de bloco sob medida > 80mm).");
    score -= 30;
  }

  // 2. Validação de espessura de borda para miopia alta
  if (grauEsferico < -4 && indiceRefracao < 1.6) {
    riscos.push("Alto grau de miopia com índice de refração baixo (lente ficará grossa nas bordas).");
    recomendacoes.push("Recomendar lente de alto índice (1.67 ou 1.74) para reduzir espessura da borda.");
    score -= 20;
  }

  // 3. Validação de espessura de centro para hipermetropia alta
  if (grauEsferico > 4 && armacao.aroHorizontalA > 54) {
    riscos.push("Alto grau de hipermetropia em armação grande (lente ficará pesada e espessa no centro).");
    recomendacoes.push("Sugerir uma armação menor (aro < 52mm) para otimizar peso e espessura.");
    score -= 25;
  }

  // 4. Adaptação Multifocal
  if (calculos.corredorMultifocal === 'Não recomendado') {
    riscos.push("Altura pupilar insuficiente para corredor multifocal seguro (< 14mm). Risco de não adaptação.");
    recomendacoes.push("Trocar por armação com maior altura vertical (> 16mm para permitir corredor curto/médio).");
    score -= 40;
  }

  return {
    score: Math.max(0, score),
    riscos,
    recomendacoes
  };
}


/**
 * MÓDULO 11 - Estimativa de Espessura (Fórmula do Sagita)
 * Estima as espessuras físicas de borda e centro da lente em milímetros (mm).
 */
export function estimarEspessuraLente(
  grauEsferico: number,
  grauCilindrico: number,
  armacao: ParametrosArmacao,
  medidas: ReceitaMedidas,
  indiceRefracao: number
): {
  espessuraBordaOD: number;
  espessuraBordaOE: number;
  espessuraCentroOD: number;
  espessuraCentroOE: number;
  pesoEstimadoGramas: number;
} {
  const calculos = calcularGeometriaOptica(armacao, medidas);
  
  // O semidiâmetro (r) em mm da lente cortada é metade do diâmetro mínimo necessário
  const r = calculos.diametroMinimoLente / 2;

  // Poder total absoluto aproximado nos dois meridianos principais
  const poderOD = grauEsferico + (grauCilindrico < 0 ? grauCilindrico : 0);
  const poderOE = grauEsferico + (grauCilindrico < 0 ? grauCilindrico : 0);

  // Espessura base de fabricação segura das lentes
  const espessuraBaseNegativaCentro = 1.2; // mm
  const espessuraBasePositivaBorda = 1.0;  // mm

  // Cálculo da Sagita para OD/OE
  const sagitaOD = (Math.pow(r, 2) * Math.abs(poderOD)) / (2000 * (indiceRefracao - 1));
  const sagitaOE = (Math.pow(r, 2) * Math.abs(poderOE)) / (2000 * (indiceRefracao - 1));

  let espessuraBordaOD = espessuraBasePositivaBorda;
  let espessuraCentroOD = espessuraBaseNegativaCentro;
  let espessuraBordaOE = espessuraBasePositivaBorda;
  let espessuraCentroOE = espessuraBaseNegativaCentro;

  // Lente Negativa (Miopia - mais grossa na borda)
  if (poderOD < 0) {
    espessuraBordaOD = espessuraBaseNegativaCentro + sagitaOD;
    espessuraCentroOD = espessuraBaseNegativaCentro;
  } else { // Lente Positiva (Hipermetropia - mais grossa no centro)
    espessuraBordaOD = espessuraBasePositivaBorda;
    espessuraCentroOD = espessuraBasePositivaBorda + sagitaOD;
  }

  if (poderOE < 0) {
    espessuraBordaOE = espessuraBaseNegativaCentro + sagitaOE;
    espessuraCentroOE = espessuraBaseNegativaCentro;
  } else {
    espessuraBordaOE = espessuraBasePositivaBorda;
    espessuraCentroOE = espessuraBasePositivaBorda + sagitaOE;
  }

  // Estimativa de Peso (Baseado no diâmetro e na densidade média do material)
  const densidadeMedia = 1.3; // g/cm3
  const volumeOD = Math.PI * Math.pow(r / 10, 2) * ((espessuraCentroOD + espessuraBordaOD) / 2 / 10);
  const volumeOE = Math.PI * Math.pow(r / 10, 2) * ((espessuraCentroOE + espessuraBordaOE) / 2 / 10);
  
  // Peso estimado total (Armação + as duas lentes)
  const pesoArmacao = Math.round(14 + armacao.aroHorizontalA * 0.15); // g
  const pesoLentes = (volumeOD + volumeOE) * densidadeMedia;
  const pesoEstimadoGramas = Math.round(pesoArmacao + pesoLentes);

  return {
    espessuraBordaOD: Math.round(espessuraBordaOD * 10) / 10,
    espessuraBordaOE: Math.round(espessuraBordaOE * 10) / 10,
    espessuraCentroOD: Math.round(espessuraCentroOD * 10) / 10,
    espessuraCentroOE: Math.round(espessuraCentroOE * 10) / 10,
    pesoEstimadoGramas
  };
}
