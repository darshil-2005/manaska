/**
 * @brief Defines a variable that declare tokenizer for syntax highlighting for monaco editor for a custom DSL language.
 *
 * @author Darshil Gandhi (202301056)
 */


const manaskaDSLLanguage = {

  defaultToken: 'invalid',

  keywords: [ 'Node', 'Connection', 'Text', 'height', 'width',
    'source', 'target', 'relation', 'x', 'y', 'backgroundColor',
    'borderColor', 'textColor', 'label', 'type', 'borderStyle',
    'backgroundStyle', 'borderWidth', 'fontSize', 'text', 'color',
    'arrowColor', 'arrowStyle', 'startArrowHead', 'endArrowHead',
    'points' ],

  symbols: /:/,

  tokenizer: {
  root: [
    [/^\s*(Node|Connection|Text)\s+(?=")/, 'keyword'],
    [/"([^"\\]|\\.)*"/, 'string'],
    [/-?\d*\.\d+([eE][+\-]?\d+)?/, 'number.float'],
    [/0[xX][0-9a-fA-F]+/, 'number.hex'],
    [/-?\d+/, 'number'],
    [/\b([a-zA-Z_]\w*)(?=\s*:)/, 'attribute.name'],
    [/@symbols/, 'operator'],
    [/[{}\[\](),;]/, 'delimiter'],
    { include: '@whitespace' },
  ],

  whitespace: [
    [/[ \t\r\n]+/, 'white'],
    [/\/\/.*$/, 'comment'],
  ],
  }
  };

export default manaskaDSLLanguage;
