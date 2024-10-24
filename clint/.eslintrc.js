module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  globals: {
    defineProps: 'readonly',
    defineEmits: 'readonly',
    defineExpose: 'readonly',
    DialogType: "readonly",
    OptionType: "readonly",
  },
  parser: 'vue-eslint-parser',
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-essential',
    'plugin:@typescript-eslint/recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  plugins: ['vue', '@typescript-eslint'],
  overrides: [ // 兼容global.d.ts全局type
		{
			files: ['*.ts', '*.tsx', '*.vue'],
			rules: {
				'no-undef': 'off',
			},
		},
	],
  rules: {
    'vue/multi-word-component-names': 'off',
    '@typescript-eslint/no-empty-function': 'off', // 关闭空方法检查
    '@typescript-eslint/no-explicit-any': 'off', // 关闭any类型的警告
    'vue/no-v-model-argument': 'off',
    "no-constant-condition": 'off',//禁止在条件中使用常量表达式 if(true) if(1)
    'no-useless-escape': 'off', //禁止不必要的转义字符
    "no-mixed-spaces-and-tabs": "off", //禁止空格和tab建混合缩进
    "vue/no-useless-mustaches": "off", //进制vue {{}} 里面使用常量
  }
};
