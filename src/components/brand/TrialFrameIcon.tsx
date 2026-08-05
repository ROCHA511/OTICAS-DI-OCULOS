import React from 'react';

interface TrialFrameIconProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Ícone do Óculos de Prova de Exames Optométricos / Armação de Prova
 * Com marcas graduadas de eixo (0°-180°), ponte graduada e lentes de teste.
 */
export const TrialFrameIcon: React.FC<TrialFrameIconProps> = ({ className = 'w-5 h-5', style }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      {/* Aro de Prova Esquerdo com marcas de graus do transferidor */}
      <circle cx="6.5" cy="12" r="4.5" />
      <path d="M 6.5 7.5 L 6.5 6" strokeWidth="1.5" />
      <path d="M 2 12 L 0.5 12" strokeWidth="1.5" />
      <path d="M 11 12 L 9.5 12" strokeWidth="1.5" />
      <path d="M 6.5 16.5 L 6.5 18" strokeWidth="1.5" />
      <path d="M 3.3 8.8 L 2.2 7.7" strokeWidth="1.2" />
      <path d="M 9.7 8.8 L 10.8 7.7" strokeWidth="1.2" />

      {/* Aro de Prova Direito com marcas de graus do transferidor */}
      <circle cx="17.5" cy="12" r="4.5" />
      <path d="M 17.5 7.5 L 17.5 6" strokeWidth="1.5" />
      <path d="M 13 12 L 14.5 12" strokeWidth="1.5" />
      <path d="M 22 12 L 23.5 12" strokeWidth="1.5" />
      <path d="M 17.5 16.5 L 17.5 18" strokeWidth="1.5" />
      <path d="M 14.3 8.8 L 13.2 7.7" strokeWidth="1.2" />
      <path d="M 20.7 8.8 L 21.8 7.7" strokeWidth="1.2" />

      {/* Ponte de Ajuste DNP / Parafuso Central */}
      <path d="M 11 10.5 C 11.6 9.3, 12.4 9.3, 13 10.5" strokeWidth="2" />
      <path d="M 12 7.5 L 12 9.5" strokeWidth="1.5" />
      <circle cx="12" cy="6.8" r="0.8" fill="currentColor" />

      {/* Hastes de Suporte Lateral */}
      <path d="M 2 11 L 0.5 10" strokeWidth="1.8" />
      <path d="M 22 11 L 23.5 10" strokeWidth="1.8" />
    </svg>
  );
};
