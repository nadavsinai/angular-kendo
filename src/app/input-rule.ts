import { schema } from '@progress/kendo-angular-editor';
import { InputRule, inputRules, wrappingInputRule, textblockTypeInputRule, Plugin } from '@progress/kendo-angular-editor';

export const inputRule = (): Plugin => {
  const { ordered_list, bullet_list, heading, blockquote, code_block } = schema.nodes;

  return inputRules({
    rules: [
      // Converts double dashes to an emdash.
      new InputRule(/--$/, '—'),

      // Converts three dots to an ellipsis character.
      new InputRule(/\.\.\.$/, '…'),

      // Converts '# ', '## ', '### ', '#### ', '##### ', '###### '
      // into heading 1, 2, 3, 4, 5, and 6, according to the '#' characters count.
      textblockTypeInputRule(/^(#{1,6})\s$/, heading, match => ({ level: match[1].length })),

      // Converts three backticks to a code block.
      textblockTypeInputRule(/^```$/, code_block),

      // Converts '- ' or '+ ' to a bullet list.
      wrappingInputRule(/^\s*([-+*])\s$/, bullet_list),

      // Converts '1. ' to an ordered list.
      wrappingInputRule(/^(\d+)\.\s$/, ordered_list, match => ({ order: Number(match[1]) }),
        (match, node) => node.childCount + node.attrs.order === match[1])
    ]
  });
};
