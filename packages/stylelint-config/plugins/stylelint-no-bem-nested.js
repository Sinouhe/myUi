import stylelint from 'stylelint';

const { createPlugin, utils } = stylelint;

export const ruleName = 'custom/no-bem-nested';

export const messages = utils.ruleMessages(ruleName, {
	rejected:
		"A selector containing '__' can't be nested in a selector rule containing '__' ou '--'.",
});

const ruleFunction = () => {
	return (root, result) => {
		root.walkRules((rule) => {
			if (!rule.parent || rule.parent.type !== 'rule') return;

			const parentSelector = rule.parent.selector;
			const currentSelector = rule.selector;

			if (/(__|--)/.test(parentSelector) && /__/.test(currentSelector)) {
				utils.report({
					ruleName,
					result,
					node: rule,
					message: messages.rejected,
				});
			}
		});
	};
};

export default createPlugin(ruleName, ruleFunction);
