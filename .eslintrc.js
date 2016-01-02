module.exports = {
	'globals': {
		'tandem': true
	},
	'parser': 'babel-eslint',
	'rules': {
		'array-bracket-spacing': [ 2, 'always', {
			'objectsInArrays': false
		}],
		'block-scoped-var': 2,
		'block-spacing': [ 2, 'always' ],
		'brace-style': [ 2, 'stroustrup' ],
		'comma-spacing': [ 2, {
			'before': false,
			'after': true
		}],
		'comma-style': [ 2, 'last' ],
		'computed-property-spacing': [ 2, 'never' ],
		'curly': 2,
		'dot-notation': 2,
		'func-style': [ 2, 'expression' ],
		'indent': [ 2, 'tab' ],
		'jsx-quotes': [ 2, 'prefer-double' ],
		'key-spacing': [ 2, {
			'beforeColon': false,
			'afterColon': true
		}],
		'linebreak-style': [ 2, 'unix' ],
		'max-params': [ 2, 5 ],
		'new-parens': 2,
		'no-caller': 2,
		'no-case-declarations': 2,
		'no-const-assign': 2,
		'no-delete-var': 2,
		'no-dupe-class-members': 2,
		'no-else-return': 2,
		'no-empty-pattern': 2,
		'no-eval': 2,
		'no-extend-native': 2,
		'no-extra-bind': 2,
		'no-floating-decimal': 2,
		'no-implied-eval': 2,
		'no-lone-blocks': 2,
		'no-lonely-if': 2,
		'no-loop-func': 2,
		'no-magic-numbers': [ 2, {
			ignore: [ -1, 0, 1, 2, 3, 1000 ]
		}],
		'no-multi-spaces': 2,
		'no-multi-str': 2,
		'no-multiple-empty-lines': 2,
		'no-native-reassign': 2,
		'no-new-func': 2,
		'no-new-wrappers': 2,
		'no-new': 2,
		'no-param-reassign': 2,
		'no-proto': 2,
		'no-return-assign': 2,
		'no-script-url': 2,
		'no-self-compare': 2,
		'no-sequences': 2,
		'no-shadow': 2,
		'no-shadow-restricted-names': 2,
		'no-spaced-func': 2,
		'no-trailing-spaces': 2,
		'no-undef-init': 2,
		'no-undefined': 2,
		'no-unneeded-ternary': 2,
		'no-unused-expressions': 2,
		'no-use-before-define': 2,
		'no-useless-call': 2,
		'no-useless-concat': 2,
		'no-void': 2,
		'no-unexpected-multiline': 2,
		'prefer-arrow-callback': 2,
		'prefer-const': 2,
		'prefer-spread': 2,
		'prefer-template': 2,
		'object-curly-spacing': [ 2, 'always' ],
		'quotes': [ 2, 'single' ],
		'semi': [ 2, 'always' ],
		'semi-spacing': [ 2, {
			'before': false,
			'after': true
		}],
		'space-before-keywords': [ 2, 'always' ],
		'space-before-function-paren': [ 2, 'never'],
		'space-infix-ops': 2,
		'space-return-throw-case': 2,
		'space-unary-ops': [ 2, {
			'words': true,
			'nonwords': false
		}],
		'react/react-in-jsx-scope': 2,
		'react/jsx-curly-spacing': [ 2, 'never' ],
		'react/jsx-closing-bracket-location': [ 2, 'tag-aligned' ],
		'react/jsx-handler-names': [ 2, {
			'eventHandlerPrefix': 'handle',
			'eventHandlerPropPrefix': 'on'
		}],
		'react/jsx-key': 2,
		'react/jsx-max-props-per-line': [ 2, {
			'maximum': 3
		}],
		'react/jsx-no-bind': 2,
		'react/jsx-no-duplicate-props': 2,
		'react/jsx-no-undef': 2,
		'react/jsx-pascal-case': 2,
		'react/jsx-uses-react': 2,
		'react/jsx-uses-vars': 2,
		'react/no-danger': 2,
		'react/no-deprecated': 2,
		'react/no-direct-mutation-state': 2,
		'react/no-multi-comp': 2,
		'react/no-unknown-property': 2,
		'react/prop-types': 2,
		'react/sort-comp': 2,
		'yoda': 2
	},
	'env': {
		'es6': true,
		'browser': true,
		'node': true
	},
	'extends': 'eslint:recommended',
	'ecmaFeatures': {
		'jsx': true,
		'experimentalObjectRestSpread': true,
		'modules': true
	},
	'plugins': [
		'react'
	]
};
