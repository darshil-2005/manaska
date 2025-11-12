
export const manaskaLight = {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: '005cc5', fontStyle: 'bold' },        // vivid blue
      { token: 'string', foreground: '22863a' },                            // fresh green
      { token: 'number', foreground: 'b31d28' },                            // crimson
      { token: 'attribute.name', foreground: '6f42c1', fontStyle: 'italic' }, // purple
      { token: 'operator', foreground: 'd73a49' },                          // red-orange
      { token: 'delimiter', foreground: '586069' },                         // neutral gray
      { token: 'comment', foreground: '6a737d', fontStyle: 'italic' },      // muted gray
      { token: 'number.hex', foreground: '0366d6' },                        // bright cyan
      { token: 'invalid', foreground: 'd50000', background: 'ffebee', fontStyle: 'underline' },
    ],
    colors: {
      'editor.background': '#fafafa',
      'editor.foreground': '#24292e',
      'editorCursor.foreground': '#24292e',
      'editorLineNumber.foreground': '#bcbec0',
      'editorLineNumber.activeForeground': '#005cc5',
      'editor.selectionBackground': '#dbe9f9',
      'editor.inactiveSelectionBackground': '#e1e4e8',
    },
  };


export const manaskaDark = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'keyword', foreground: 'ff6e00', fontStyle: 'bold' }, // bright orange
    { token: 'string', foreground: '00e676' }, // vivid neon green
    { token: 'number', foreground: '29b6f6' }, // bright cyan-blue
    { token: 'number.hex', foreground: '18ffff' }, // glowing aqua
    { token: 'attribute.name', foreground: 'b388ff', fontStyle: 'italic' }, // warm yellow-gold
    { token: 'operator', foreground: 'ff9100' }, // saturated amber
    { token: 'delimiter', foreground: 'bdbdbd' }, // light neutral gray
    { token: 'comment', foreground: '757575', fontStyle: 'italic' }, // subtle cool gray
    { token: 'invalid', foreground: 'ff1744', fontStyle: 'underline' }, // strong red text only 
  ],
  colors: {
    'editor.background': '#000000', // pure black
    'editor.foreground': '#e0e0e0',
    'editorCursor.foreground': '#ff6e00', // matches keyword orange
    'editorLineNumber.foreground': '#444444',
    'editorLineNumber.activeForeground': '#ff6e00',
    'editor.selectionBackground': '#222222',
    'editor.inactiveSelectionBackground': '#333333',
    'editorLineHighlightBackground': '#111111',
    'scrollbarSlider.background': '#1f1f1f',
    'scrollbarSlider.hoverBackground': '#2e2e2e',
  },
};


