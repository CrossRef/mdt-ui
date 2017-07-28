
// Configure build settings here
// ------------------------------

const config = {
	globals: {
		rootDir: '',
	},

}

// ------------------------------


config.globals.rootDir = cleanupRootDir(config.globals.rootDir);

function cleanupRootDir (rootDir) {
	if(rootDir.slice(-1) === '/') return rootDir.substring(0, rootDir.length-1)
	else return rootDir;
}


module.exports = config;