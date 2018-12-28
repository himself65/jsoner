import ohm from 'ohm-js'
import path from 'path'
import fs from 'fs'

const grammar = ohm.grammar(fs.readFileSync(path.resolve(__dirname, './ohm', 'json.ohm')))

export const parse = (str) => {
  const res = grammar.match(str)
  return semantics(res).eval()
}

export const semantics = grammar.createSemantics().addOperation('eval', {
  Object_empty (_0, _1) {
    return {}
  },
  Object_noEmpty (_0, item, _1, items, _2) {
    const obj = {}
    obj[item.children[0].eval()] = item.children[2].eval()
    for (const d of items.children) {
      obj[d.children[0].eval()] = d.children[2].eval()
    }
    return obj
  },
  Array_empty (_0, _1) {
    return []
  },
  Array_noEmpty (_0, item, _1, items, _2) {
    return [item.eval()].concat(items.children.map(x => x.eval()))
  },

  /**
   * @return {string}
   */
  String (_0, item, _1) {
    return item.children.map(x => x.eval()).join("")
  },
  doubleStringCharacter_nonEscaped (item) {
    return item.sourceString
  },
  doubleStringCharacter_escaped (_, item) {
    return item.eval()
  },
  escapeSequence_doubleQuote (_) {
    return '"'
  },
  escapeSequence_reverseSolidus (_) {
    return '\\'
  },
  escapeSequence_solidus (_) {
    return '/'
  },
  escapeSequence_backspace (_) {
    return '\b'
  },
  escapeSequence_formfeed (_) {
    return '\f'
  },
  escapeSequence_newline (_) {
    return '\n'
  },
  escapeSequence_carriageReturn (_) {
    return '\r'
  },
  escapeSequence_horizontalTab (_) {
    return '\t'
  },
  escapeSequence_codePoint (_, item) {
    return String.fromCharCode(parseInt(item.sourceString, 16))
  },

  /**
   * @return {number}
   */
  Number (item) {
    return parseFloat(item.sourceString, 10)
  },

  /**
   * @return {boolean}
   */
  True (_) {
    return true
  },

  /**
   * @return {boolean}
   */
  False (_) {
    return false
  },

  /**
   * @return {null}
   */
  Null (_) {
    return null
  }
})

export default parse
