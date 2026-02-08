/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // ativa dark mode via classe .dark
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#2DD4BF',      // Verde água (On Time / Botões principais)
          secondary: '#F97316',    // Laranja (alertas, ações secundárias)
          hover: '#1DB8A5',        // Verde água mais escuro para hover
        },
        background: {
          dark: '#0D0D0D',         // Fundo principal da aplicação
          darker: '#050505',       // Fundo ainda mais escuro para contraste
        },
        card: {
          dark: '#1A1A1A',         // Cards principais
          darker: '#141414',       // Cards com menos destaque
          lighter: '#202020',      // Cards com mais destaque
          border: '#2A2A2A',       // Bordas dos cards
        },
        input: {
          bg: '#0F0F0F',           // Fundo dos inputs (mais escuro que os cards)
          border: '#2A2A2A',       // Borda padrão dos inputs
          borderHover: '#3A3A3A',  // Borda no hover
          borderFocus: '#2DD4BF',  // Borda no focus (brand primary)
          placeholder: '#525252',  // Texto placeholder
          text: '#F9FAFB',         // Texto digitado
        },
        status: {
          success: '#2DD4BF',      // Verde água - sucesso/concluído
          warning: '#FACC15',      // Amarelo - aviso/atenção
          error: '#EF4444',        // Vermelho - erro/crítico
          info: '#3B82F6',         // Azul - informação
          pending: '#F97316',      // Laranja - pendente
        },
        text: {
          primary: '#F9FAFB',      // Texto principal (branco suave)
          secondary: '#A1A1AA',    // Texto secundário (cinza médio)
          tertiary: '#71717A',     // Texto terciário (cinza escuro)
          muted: '#52525B',        // Texto muito discreto
        },
        border: {
          default: '#2A2A2A',      // Borda padrão
          light: '#3A3A3A',        // Borda clara
          lighter: '#4A4A4A',      // Borda mais clara
        },
      },
      boxShadow: {
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
        input: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)',
        glow: '0 0 20px rgba(45, 212, 191, 0.3)',
      },
      borderRadius: {
        card: '12px',
        input: '8px',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
