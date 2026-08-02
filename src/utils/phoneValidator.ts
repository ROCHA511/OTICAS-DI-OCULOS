/**
 * Utilitário de Validação e Formatação de Números de Telefone (Brasil)
 * Desenvolvido para Óticas Di Óculos
 */

// Lista de DDDs brasileiros válidos e alocados pela ANATEL
const VALID_DDDS = new Set([
  11, 12, 13, 14, 15, 16, 17, 18, 19,
  21, 22, 24, 27, 28,
  31, 32, 33, 34, 35, 37, 38,
  41, 42, 43, 44, 45, 46, 47, 48, 49,
  51, 53, 54, 55,
  61, 62, 63, 64, 65, 66, 67, 68, 69,
  71, 73, 74, 75, 77, 79,
  81, 82, 83, 84, 85, 86, 87, 88, 89,
  91, 92, 93, 94, 95, 96, 97, 98, 99
]);

/**
 * Retorna apenas os dígitos numéricos de uma string
 */
export const cleanPhoneString = (phone: string): string => {
  return phone.replace(/\D/g, '');
};

/**
 * Identifica se um número de telefone é fictício, de teste ou inválido
 */
export const isFictitiousPhone = (phone: string): boolean => {
  if (!phone) return true;
  
  let cleaned = cleanPhoneString(phone);
  
  // Remove prefixo internacional brasileiro 55
  if (cleaned.length > 10 && cleaned.startsWith('55')) {
    cleaned = cleaned.substring(2);
  }
  
  // Telefones válidos no Brasil devem ter 10 (fixo) ou 11 (celular) dígitos
  if (cleaned.length < 10 || cleaned.length > 11) {
    return true;
  }
  
  // Validação de DDD
  const ddd = parseInt(cleaned.substring(0, 2), 10);
  if (!VALID_DDDS.has(ddd)) {
    return true;
  }
  
  // Verifica se todos os dígitos são repetidos (Ex: 99999999999, 11111111111)
  if (/^([0-9])\1+$/.test(cleaned)) {
    return true;
  }
  
  // Sequências óbvias de digitação
  const sequentialPatterns = [
    '1234567890',
    '12345678901',
    '0123456789',
    '01234567890',
    '9876543210',
    '98765432100'
  ];
  if (sequentialPatterns.includes(cleaned)) {
    return true;
  }

  // Celulares com o corpo do número fictício (Ex: 73999999999)
  if (cleaned.length === 11 && cleaned.substring(2) === '999999999') {
    return true;
  }
  
  return false;
};

/**
 * Formata um número bruto para o padrão brasileiro: (XX) 9XXXX-XXXX ou (XX) XXXX-XXXX
 */
export const formatBrazilianPhone = (phone: string): string => {
  if (!phone) return '';
  
  let cleaned = cleanPhoneString(phone);
  
  // Remove prefixo 55
  if (cleaned.length > 10 && cleaned.startsWith('55')) {
    cleaned = cleaned.substring(2);
  }
  
  if (cleaned.length === 11) {
    // Formato Celular: (XX) 9XXXX-XXXX
    return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 3)}${cleaned.substring(3, 7)}-${cleaned.substring(7)}`;
  } else if (cleaned.length === 10) {
    // Formato Fixo: (XX) XXXX-XXXX
    return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 6)}-${cleaned.substring(6)}`;
  }
  
  return phone; // Retorna original se não puder formatar
};

/**
 * Validador geral de telefone para uso em formulários
 */
export const isValidPhone = (phone: string): boolean => {
  return !isFictitiousPhone(phone);
};
