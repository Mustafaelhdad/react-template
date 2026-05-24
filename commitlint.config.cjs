/**
 * Commitlint configuration.
 *
 * Enforces Conventional Commits on every commit via the Husky `commit-msg`
 * hook. See https://www.conventionalcommits.org and CONTRIBUTING.md.
 *
 * Allowed types are the conventional set plus a few we use frequently. If a
 * type is missing, prefer adding it here over disabling the rule.
 */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'build',
        'chore',
        'ci',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'revert',
        'style',
        'test',
      ],
    ],
    'subject-case': [
      2,
      'never',
      ['sentence-case', 'start-case', 'pascal-case', 'upper-case'],
    ],
    'header-max-length': [2, 'always', 100],
    'body-max-line-length': [1, 'always', 120],
  },
}
