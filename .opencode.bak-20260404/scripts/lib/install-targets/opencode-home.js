const path = require('path');

const {
  createInstallTargetAdapter,
  createManagedOperation,
} = require('./helpers');

/**
 * OpenCode install target: project-local `.opencode/` (not `~/.opencode`).
 *
 * ECC agent markdown uses Claude-style frontmatter; OpenCode validates `.opencode/agents/*.md`
 * against its own schema. We copy repo `agents/` into `.opencode/ecc-agents/` so files remain
 * available without breaking OpenCode startup.
 */
module.exports = createInstallTargetAdapter({
  id: 'opencode-project',
  target: 'opencode',
  kind: 'project',
  rootSegments: ['.opencode'],
  installStatePathSegments: ['ecc-install-state.json'],
  nativeRootRelativePath: '.opencode',
  planOperations(input, adapter) {
    const modules = Array.isArray(input.modules)
      ? input.modules
      : (input.module ? [input.module] : []);
    const {
      repoRoot,
      projectRoot,
      homeDir,
    } = input;
    const planningInput = {
      repoRoot,
      projectRoot,
      homeDir,
    };
    const targetRoot = adapter.resolveRoot(planningInput);

    return modules.flatMap(module => {
      const paths = Array.isArray(module.paths) ? module.paths : [];
      return paths.flatMap((sourceRelativePath) => {
        if (sourceRelativePath === 'agents') {
          return [createManagedOperation({
            moduleId: module.id,
            sourceRelativePath: 'agents',
            destinationPath: path.join(targetRoot, 'ecc-agents'),
            strategy: 'preserve-relative-path',
          })];
        }

        return [adapter.createScaffoldOperation(module.id, sourceRelativePath, planningInput)];
      });
    });
  },
});
