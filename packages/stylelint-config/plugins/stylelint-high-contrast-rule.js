import stylelint from 'stylelint';

const ruleName = 'custom/high-contrast-rule';
const messages = stylelint.utils.ruleMessages(ruleName, {
	rejected: (selector) =>
		`Selector "${selector}" containing ".cc-high-contrast &" must be nested at first level of the root css rule. Because declared only once for every element styles of the stylesheet`,
});

const ruleFunction = () => {
	return (root, result) => {
		root.walkRules((rule) => {
			if (!rule.selector.includes('.cc-high-contrast &')) {
				return;
			}

			// Check parent is a rule
			const parent = rule.parent;

			if (!parent || parent.type !== 'rule') {
				stylelint.utils.report({
					ruleName,
					result,
					node: rule,
					message: messages.rejected(rule.selector),
				});
				return;
			}

			// Check grand-parent is root rule
			const grandParent = parent.parent;

			if (!grandParent || grandParent.type !== 'root') {
				stylelint.utils.report({
					ruleName,
					result,
					node: rule,
					message: messages.rejected(rule.selector),
				});
			}
		});
	};
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;

export default stylelint.createPlugin(ruleName, ruleFunction);
