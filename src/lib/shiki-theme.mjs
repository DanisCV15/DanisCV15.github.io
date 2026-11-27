// Tema de resaltado de código con la paleta de la web (fondo del panel y verde lima).
const c = {
  bg: '#111c26',
  text: '#edf2f5',
  muted: '#7f909e',
  accent: '#b9ef76',
  warm: '#f3c98b',
  cool: '#8cc8f0',
  rose: '#f09cb4',
};

export default {
  name: 'portfolio',
  type: 'dark',
  colors: { 'editor.background': c.bg, 'editor.foreground': c.text },
  tokenColors: [
    { settings: { foreground: c.text } },
    { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: c.muted, fontStyle: 'italic' } },
    { scope: ['keyword', 'storage', 'storage.type', 'keyword.control', 'keyword.operator.new', 'support.function.builtin.shell'], settings: { foreground: c.accent } },
    { scope: ['string', 'string.quoted', 'punctuation.definition.string'], settings: { foreground: c.warm } },
    { scope: ['entity.name.function', 'support.function', 'meta.function-call entity.name', 'entity.name.command'], settings: { foreground: c.cool } },
    { scope: ['constant.numeric', 'constant.language', 'constant.character', 'variable.other.constant'], settings: { foreground: c.rose } },
    { scope: ['variable.parameter', 'variable.other.normal.shell', 'punctuation.definition.variable', 'constant.other.option'], settings: { foreground: c.cool } },
    { scope: ['entity.name.tag', 'entity.other.attribute-name', 'support.type.property-name'], settings: { foreground: c.accent } },
    { scope: ['keyword.operator', 'punctuation'], settings: { foreground: '#c3ced6' } },
  ],
};
