// Voice synthesis helper for Mary (IA Mary - Óticas Di Óculos)

export interface VoiceOptions {
  pitch?: number; // Default 1.1 for gentle feminine tone
  rate?: number;  // Default 0.98 for clear, empathetic, elegant delivery
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

export type VoicePersonaKey = 'ideal' | 'tecnica' | 'vip' | 'express' | 'clonada';

export interface VoicePersonaProfile {
  id: VoicePersonaKey;
  title: string;
  badge: string;
  badgeColor: string;
  pitch: number;
  rate: number;
  description: string;
  toneCharacteristics: string[];
  useCases: string;
  samplePhrase: string;
}

export const VOICE_PERSONAS_CONFIG: Record<VoicePersonaKey, VoicePersonaProfile> = {
  ideal: {
    id: 'ideal',
    title: 'Voz 1 - Mary Executiva & Empática (Oficial Recomendada)',
    badge: 'PADRÃO ÓTICAS DI ÓCULOS',
    badgeColor: 'bg-[#071D49] text-[#E8D2A8] border-[#C9A96E]',
    pitch: 1.05, // Pitch equilibrado, suave e natural
    rate: 0.95,  // Velocidade moderada, dicção clara e elegante
    description: 'Tom aveludado, ritmo cadenciado e humano. Transmite autoridade técnica óptica aliada ao carinho e educação de uma gerente geral de ótica.',
    toneCharacteristics: [
      'Tom Executivo Suave (Pitch 1.05)',
      'Velocidade Natural (0.95x)',
      'Cadência Humana Pausada',
      'Empatia e Acolhimento Receptivo'
    ],
    useCases: 'Atendimento geral no WhatsApp, explicação de lentes multifocais e recepção de novos clientes.',
    samplePhrase: 'Olá! Sou a Mary, assistente executiva da Óticas Di Óculos. Seja muito bem-vindo! Como posso ajudar a escolher a armação e as lentes perfeitas para você hoje?'
  },
  tecnica: {
    id: 'tecnica',
    title: 'Voz 2 - Mary Consultora Técnica & Precisão Digital',
    badge: 'BIOMETRIA 3D & DNP',
    badgeColor: 'bg-blue-900 text-blue-200 border-blue-400',
    pitch: 0.88, // Tom mais grave, firme e encorpado
    rate: 1.12,  // Ritmo mais dinâmico e direto
    description: 'Tom firme, grave, altamente articulado e preciso. Transmite rigor científico, agilidade e máxima segurança em medidas ópticas.',
    toneCharacteristics: [
      'Tom Grave & Firme (Pitch 0.88)',
      'Velocidade Dinâmica (1.12x)',
      'Articulação Clara em Milímetros',
      'Foco em Precisão de Laboratório'
    ],
    useCases: 'Instruções de foto DNP, confirmação de medidas de montagem e relatórios técnicos do laboratório.',
    samplePhrase: 'Identificação bio-óptica concluída com sucesso: DNP do olho direito trinta e dois ponto cinco milímetros, e altura de montagem vinte e dois milímetros. Parâmetros enviados para o laboratório!'
  },
  vip: {
    id: 'vip',
    title: 'Voz 3 - Mary Melódica VIP & Relacionamento Acolhedor',
    badge: 'FIDELIZAÇÃO & PÓS-VENDA VIP',
    badgeColor: 'bg-purple-950 text-purple-200 border-purple-400',
    pitch: 1.30, // Tom mais agudo, melódico e suave
    rate: 0.82,  // Ritmo bem pausado, suave e tranquilo
    description: 'Voz extremamente doce, calma, melódica e calorosa. Proporciona um atendimento VIP intimista, carinhoso e relaxado.',
    toneCharacteristics: [
      'Tom Melódico Agudo (Pitch 1.30)',
      'Velocidade Pausada (0.82x)',
      'Cadência Doce e Aveludada',
      'Afeto e Consideração Especial VIP'
    ],
    useCases: 'Mensagens de pós-venda, aviso de óculos prontos na loja de Ituberá, aniversários e lembretes de exames.',
    samplePhrase: 'É um imenso prazer falar com você! Passando para te avisar com todo carinho que seus óculos novinhos já estão prontos aqui na loja, esperando por você.'
  },
  express: {
    id: 'express',
    title: 'Voz 4 - Mary Comercial Dinâmica & Fechamento Pix',
    badge: 'OFERTAS & PROMOÇÕES',
    badgeColor: 'bg-emerald-950 text-emerald-200 border-emerald-400',
    pitch: 1.18, // Tom médio-alto, vibrante e animado
    rate: 1.08,  // Ritmo rápido e estimulante
    description: 'Voz vibrante, enérgica, alegre e persuasiva. Transmite senso de oportunidade, entusiasmo comercial e agilidade.',
    toneCharacteristics: [
      'Tom Animado & Vibrante (Pitch 1.18)',
      'Velocidade Rápida (1.08x)',
      'Entusiasmo Comercial Promocional',
      'Foco em Desconto e Pix Imadiato'
    ],
    useCases: 'Ofertas do dia, comunicação de 10% de desconto via Pix, promoções relâmpago e fechamento rápido.',
    samplePhrase: 'Aproveite essa oportunidade incrível! Garantindo o pagamento via Pix agora, você ganha dez por cento de desconto e enviamos suas lentes para produção hoje mesmo!'
  },
  clonada: {
    id: 'clonada',
    title: 'Voz Clonada Personalizada (Perfil Capturado por IA)',
    badge: 'CLONAGEM NEURAL ATIVA',
    badgeColor: 'bg-amber-500 text-[#071D49] border-amber-300 font-black',
    pitch: 1.00,
    rate: 0.98,
    description: 'Perfil de voz sintética clonada a partir de amostra de voz real capturada via microfone de 30 segundos.',
    toneCharacteristics: [
      'Inflexão Vocal Clonada em 30s',
      'Impressão Digital Vocal Neural',
      'Modulação Customizada',
      'Fidelidade ao Timbre do Operador'
    ],
    useCases: 'Atendimento personalizado da Mary utilizando a voz real da gerente ou do proprietário da ótica.',
    samplePhrase: 'Olá! Esta é a minha voz personalizada clonada por Inteligência Artificial para atender nossos clientes com a máxima identidade da nossa loja!'
  }
};

let currentUtterance: SpeechSynthesisUtterance | null = null;

export const getAvailableVoices = (): SpeechSynthesisVoice[] => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  return window.speechSynthesis.getVoices();
};

export const getMaryFemaleVoice = (): SpeechSynthesisVoice | null => {
  const voices = getAvailableVoices();
  if (!voices.length) return null;

  // Search for Portuguese (Brazil) female voices
  const ptVoices = voices.filter(
    (v) => v.lang.includes('pt') || v.lang.includes('PT') || v.lang.includes('br') || v.lang.includes('BR')
  );

  // Preferred voice names containing female indicators or high-quality PT-BR
  const preferredFemaleNames = [
    'Luciana',
    'Francisca',
    'Helena',
    'Fernanda',
    'Vitória',
    'Yelda',
    'Google português do Brasil',
    'Letícia',
    'Márcia',
  ];

  for (const name of preferredFemaleNames) {
    const match = ptVoices.find((v) => v.name.toLowerCase().includes(name.toLowerCase()));
    if (match) return match;
  }

  return ptVoices[0] || voices[0] || null;
};

export const speakMaryPersona = (personaKey: VoicePersonaKey, customText?: string, options?: VoiceOptions) => {
  const persona = VOICE_PERSONAS_CONFIG[personaKey] || VOICE_PERSONAS_CONFIG.ideal;
  const textToSpeak = customText || persona.samplePhrase;

  speakMaryVoice(textToSpeak, {
    pitch: persona.pitch,
    rate: persona.rate,
    ...options
  });
};

export const speakMaryVoice = (text: string, options?: VoiceOptions) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('SpeechSynthesis is not supported in this browser.');
    return;
  }

  // Stop any ongoing speech
  stopMaryVoice();

  // Clean markdown syntax or emojis for smoother speech reading
  const cleanText = text
    .replace(/\*+/g, '')
    .replace(/\[.*?\]/g, '')
    .replace(/(http|https):\/\/[^\s]+/g, '')
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E6}-\u{1F1FF}]/gu, '')
    .trim();

  if (!cleanText) return;

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = 'pt-BR';
  utterance.pitch = options?.pitch ?? 1.1; // Gentle feminine pitch
  utterance.rate = options?.rate ?? 0.98;   // Natural, clear, elegant rate

  const femaleVoice = getMaryFemaleVoice();
  if (femaleVoice) {
    utterance.voice = femaleVoice;
  }

  utterance.onstart = () => {
    if (options?.onStart) options.onStart();
  };

  utterance.onend = () => {
    currentUtterance = null;
    if (options?.onEnd) options.onEnd();
  };

  utterance.onerror = (e) => {
    currentUtterance = null;
    if (options?.onError) options.onError(e);
  };

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
};

export const stopMaryVoice = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
};

export const isMarySpeaking = (): boolean => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    return window.speechSynthesis.speaking;
  }
  return false;
};

