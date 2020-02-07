import * as nearley from 'nearley'
import * as grammar from './grammar.ne'

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar.default))

parser.feed('allowme')
console.log(parser.results[0])
