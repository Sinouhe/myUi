import stylelint from 'stylelint';

const ruleName = 'custom/no-nested-classes-in-include';

const messages = stylelint.utils.ruleMessages(ruleName, {
	rejected: 'Nested classes are not allowed inside @include.',
});

const noNestedClassesInInclude = stylelint.createPlugin(
	ruleName,
	function (primaryOption, secondaryOptions, context) {
		return (root, result) => {
			root.walkAtRules((atRule) => {
				if (atRule.name === 'include') {
					atRule.nodes?.forEach((node) => {
						if (node.type === 'rule' && node.selector.startsWith('.')) {
							stylelint.utils.report({
								message: messages.rejected,
								node,
								result,
								ruleName,
							});
						}
					});
				}
			});
		};
	}
);

export default noNestedClassesInInclude;
export { ruleName, messages };
