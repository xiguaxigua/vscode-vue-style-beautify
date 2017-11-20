function extend (prefix, suffix) {
  if (!Array.isArray(prefix)) {
    prefix = [prefix]
  }
  if (!Array.isArray(suffix)) {
    suffix = [suffix]
  }
  return prefix.reduce((prev, curr) => {
    return prev.concat(suffix.map(i => curr + i))
  }, [])
}

const trbl = ['', '-top', '-right', '-bottom', '-left']

const order = [
  'content',

  // Positioning
  'position', 'z-index', 'top', 'right', 'bottom', 'left', 'float', 'clear',

  // Display & Box Model
  'display',
  // Flex
  extend('flex', ['-flow', '-direction', '-wrap']),
  'justify-content', 'align-content', 'align-items', 'align-self', 'order',
  extend('flex', ['', '-basis', '-grow', '-shrink']),
  // Box Model
  'box-sizing', extend('overflow', ['', '-x', '-y']),
  extend(['', 'min-', 'max-'], 'width'),
  extend(['', 'min-', 'max-'], 'height'),
  extend('padding', trbl),
  extend(extend('border', trbl), ['', '-width', '-style', '-color']),
  'border-radius',
  'border-top-left-radius',
  'border-top-right-radius',
  'border-bottom-right-radius',
  'border-bottom-left-radius',
  extend('margin', trbl),
  'outline',
  'box-shadow',

  // Color
  extend('background', [
    '',
    '-attachment',
    '-clip',
    '-color',
    '-image',
    '-origin',
    '-position',
    '-repeat',
    '-size'
  ]),
  'color',

  // Text
  extend('font', ['', '-family', '-size', '-weight']),
  'text-align', 'text-decoration', 'text-overflow',
  'word-break', 'word-wrap', 'white-spacing',
  'vertical-align',

  // Appearance
  'opacity', 'visibility'
]

module.exports = {
  "remove-empty-rulesets": true,
  "always-semicolon": true,
  "color-case": "lower",
  "block-indent": "  ",
  "color-shorthand": true,
  "element-case": "lower",
  "eof-newline": true,
  "leading-zero": false,
  "quotes": "double",
  "sort-order-fallback": "abc",
  "space-before-colon": "",
  "space-after-colon": " ",
  "space-before-combinator": " ",
  "space-after-combinator": " ",
  "space-between-declarations": "\n",
  "space-before-opening-brace": " ",
  "space-after-opening-brace": "\n",
  "space-after-selector-delimiter": "\n",
  "space-before-selector-delimiter": "",
  "space-before-closing-brace": "\n",
  "strip-spaces": true,
  "tab-size": true,
  "unitless-zero": true,
  "vendor-prefix-align": true,
  "sort-order": order.toString().split(',')
}
