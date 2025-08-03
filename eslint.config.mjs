import eslint from '@eslint/js';
import astro from 'eslint-plugin-astro';
import importX from 'eslint-plugin-import-x';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    { ignores: ['.astro'] },
    eslint.configs.recommended,
    importX.flatConfigs.recommended,
    tseslint.configs.recommended,
    astro.configs.recommended,
    {
        files: ['**/*.{astro,ts,js,mjs}'],
        rules: {
            'object-shorthand': 'error',
            'import-x/namespace': 'off',
            'import-x/no-named-as-default': 'off',
            'import-x/no-named-as-default-member': 'off',
            'import-x/no-unresolved': 'off',
            'import-x/order': [
                'error',
                {
                    groups: [
                        'builtin',
                        'external',
                        'internal',
                        ['sibling', 'parent'],
                        'index',
                        'unknown',
                    ],
                    'newlines-between': 'always',
                    alphabetize: {
                        order: 'asc',
                        caseInsensitive: true,
                    },
                },
            ],
        }
    }
);