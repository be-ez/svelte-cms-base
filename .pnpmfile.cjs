/**
 * This file is used to customize pnpm behavior.
 * It's also a clear indicator that the project uses pnpm.
 */

function readPackage(pkg) {
	// You can modify package.json contents here
	// For example, fixing peer dependency issues

	// Example: if a package has a peer dependency on svelte@4 but we're using svelte@5
	if (pkg.peerDependencies && pkg.peerDependencies.svelte) {
		if (pkg.peerDependencies.svelte === '^4.0.0') {
			pkg.peerDependencies.svelte = '^4.0.0 || ^5.0.0';
		}
	}

	return pkg;
}

module.exports = {
	hooks: {
		readPackage
	}
};
