const fs	= require("fs");
const path	= require("path");
const sass	= require("node-sass");
const ncp	= require("ncp").ncp;
const CleanCSS	= require("clean-css");


const buildDirPath			= path.join(__dirname, "build");
const buildMinDirPath		= buildDirPath; //path.join(buildDirPath, "min");

// ensure build directories exists
if(!fs.existsSync(buildDirPath))
{
	fs.mkdirSync(buildDirPath);
}

if(!fs.existsSync(buildMinDirPath))
{
	fs.mkdirSync(buildMinDirPath);
}


const sourcePath		= path.join(__dirname, "src", "scss", "main.scss");
const norDestPath		= path.join(buildDirPath, "iris.css");
const minDestPath		= path.join(buildMinDirPath, "iris.min.css");
const minMapDestPath	= path.join(buildMinDirPath, "iris.min.css.map");
const thirdyDestPath	= buildDirPath;

const examplesDirPath	= path.join(__dirname, "examples");
const examplesCssPath	= path.join(examplesDirPath, "iris.css");

const themesDirPath		= path.join(__dirname, "src", "scss", "themes");

// const thirdyDirPath		= path.join(__dirname, "src", "thirdy");

const buildExpanded = () =>
{
	const result = sass.renderSync({
		file: sourcePath,
		outFile: norDestPath,
		outputStyle: "expanded"
	});

	fs.writeFileSync(norDestPath, result.css);
	fs.copyFileSync(norDestPath, examplesCssPath);

	console.log("source build success");

	buildMinified({
		sourcePath: sourcePath,
		destPath: minDestPath,
		mapDestPath: minMapDestPath,
		plainDestPath: norDestPath
	}, buildThemes);
};

const buildMinified = (opts, cb) =>
{
	// const result = sass.renderSync({
	// 	file: opts.sourcePath,
	// 	// data
	// 	outFile: opts.destPath,
	// 	outputStyle: "compressed",
	// 	sourceMap: opts.mapDestPath,
	// 	//sourceMapRoot: minDirPath
	// });

	// fs.writeFileSync(opts.destPath, result.css);
	// fs.writeFileSync(opts.mapDestPath, result.map);

	const cleaner = new CleanCSS({
		level: {
			2: {
				mergeSemantically: true,
				restructureRules: true
			}
		},
		sourceMap: true
	});

	const source = fs.readFileSync(opts.plainDestPath);

	var result = cleaner.minify(source);

	result.warnings && console.warn(result.warnings.join("\n"));

	fs.writeFileSync(opts.destPath, result.styles);
	fs.writeFileSync(opts.mapDestPath, result.sourceMap);

	console.log("minified build success");

	cb && cb();
};

const buildThemes = () =>
{
	const filesList = fs.readdirSync(themesDirPath);

	// console.log(filesList);

	for(let themeFile of filesList)
	{
		let themeName		= themeFile.replace(".scss", "");

		let themeFilePath	= path.join(themesDirPath, themeFile);
		let themeDestPath	= path.join(buildDirPath, `iris.theme.${themeName}.css`);

		let themeMinDestPath	= path.join(buildMinDirPath, `iris.theme.${themeName}.min.css`);
		let themeMinMapPath		= path.join(buildMinDirPath, `iris.theme.${themeName}.min.css.map`);

		let result = sass.renderSync({
			file: themeFilePath,
			outFile: themeDestPath,
			outputStyle: "expanded"
		});

		fs.writeFileSync(themeDestPath, result.css);

		console.log(`theme "${themeName}" build success`);

		buildMinified({
			sourcePath: themeFilePath,
			destPath: themeMinDestPath,
			mapDestPath: themeMinMapPath,
			plainDestPath: themeDestPath
		});
	}

	// copyThirdyDirectory();
};

// const copyThirdyDirectory = () =>
// {
// 	ncp(thirdyDirPath, thirdyDestPath, function (err)
// 	{
// 		if (err)
// 		{
// 			return console.error(err);
// 		}
// 	});
// };

buildExpanded();




