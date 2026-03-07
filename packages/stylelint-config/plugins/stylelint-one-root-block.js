import stylelint from 'stylelint';

const ruleName = 'custom/one-root-block';

const messages = stylelint.utils.ruleMessages(ruleName, {
	tooMany: 'Only one root-level ".fs-*" block is allowed per file (plus optional :root).',
	invalidName: 'Root block must start with ".fs-".',
});

const oneRootBlock = stylelint.createPlugin(ruleName, function () {
	return (root, result) => {
		const rootRules = root.nodes.filter((node) => node.type === 'rule' && node.parent === root);

		let fsBlocks = [];

		rootRules.forEach((rule) => {
			// Ignore :root
			if (rule.selector.trim() === ':root') {
				return;
			}

			// Check .fs-* selectors
			if (/^\.fs-[a-z0-9]/.test(rule.selector)) {
				fsBlocks.push(rule);
			} else {
				// Any other root-level rule is invalid
				stylelint.utils.report({
					message: messages.invalidName,
					node: rule,
					result,
					ruleName,
				});
			}
		});

		if (fsBlocks.length !== 1) {
			stylelint.utils.report({
				message: messages.tooMany,
				node: root,
				result,
				ruleName,
			});
		}
	};
});

export default oneRootBlock;
