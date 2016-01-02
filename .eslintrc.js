module.exports = {
	'globals': {
		'tandem': true
	},
	'parser': 'babel-eslint',
	'rules': {
		'block-scoped-var': 2,
		'curly': 2,
		'dot-notation': 2,
		'indent': [ 2, 'tab' ],
		'quotes': [ 2, 'single' ],
		'linebreak-style': [ 2, 'unix' ],
		'no-caller': 2,
		'no-case-declarations': 2,
		'no-else-return': 2,
		'no-empty-pattern': 2,
		'no-eval': 2,
		'no-extend-native': 2,
		'no-extra-bind': 2,
		'no-floating-decimal': 2,
		'no-implied-eval': 2,
		'no-lone-blocks': 2,
		'no-loop-func': 2,
		'no-magic-numbers': [ 2, {
			ignore: [-1, 0, 1, 2, 3, 1000]
		}],
		'no-multi-spaces': 2,
		'no-multi-str': 2,
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
		'no-unused-expressions': 2,
		'no-useless-call': 2,
		'no-useless-concat': 2,
		'no-void': 2,
		'no-unexpected-multiline': 2,
		'semi': [ 2, 'always' ],
		'react/react-in-jsx-scope': 1,
		'react/jsx-curly-spacing': [ 1, 'never' ],
		'react/jsx-closing-bracket-location': [ 1, 'tag-aligned' ],
		'react/jsx-handler-names': [ 1, {
			'eventHandlerPrefix': 'handle',
			'eventHandlerPropPrefix': 'on'
		}],
		'react/jsx-key': 1,
		'react/jsx-max-props-per-line': [ 1, {
			'maximum': 3
		}],
		'react/jsx-no-bind': 1,
		'react/jsx-no-duplicate-props': 1,
		'react/jsx-no-undef': 1,
		'react/jsx-pascal-case': 1,
		'react/jsx-uses-react': 1,
		'react/jsx-uses-vars': 1,
		'react/no-danger': 1,
		'react/no-deprecated': 1,
		'react/no-direct-mutation-state': 1,
		'react/no-multi-comp': 1,
		'react/no-unknown-property': 1,
		'react/prop-types': 1,
		'react/sort-comp': 1,
		'yoda': 2
	},
	'env': {
		'es6': true,
		'browser': true
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
