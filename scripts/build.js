const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');
const manifest = require('../src/manifest.js');

const { NODE_ENV } = process.env;
const watch = NODE_ENV !== 'production';

const indir = path.join(__dirname, '/../src');

const browsers = [
    'chrome',
    'firefox',
    'safari'
];

async function build(browser) {
    const outdir = path.join(__dirname, `/../build-${browser}`);

    fs.rmSync(outdir, { recursive: true, force: true }); // rm -rf
    fs.mkdirSync(outdir, { recursive: true });
    fs.writeFileSync(path.join(outdir, 'manifest.json'), manifest(browser));

    copyFile(path.join(indir, 'sandbox.html'), outdir);
    copyFiles(path.join(indir, 'icons'), outdir);

    // build bundle
    await esbuild.build({
        entryPoints: [
            { in: path.join(indir, 'content-script.js'), out: 'content-script' },
            { in: path.join(indir, 'discovery/index.js'), out: 'discovery' },
            { in: path.join(indir, 'discovery/index.css'), out: 'discovery' }
        ],
        format: 'esm',
        bundle: true,
        minify: true,
        outdir,
        define: {
            global: 'window'
        },
        loader: {
            '.png': 'dataurl',
            '.svg': 'dataurl',
            '.md': 'text'
        }
    });
}

const buildAll = async function() {
    console.log('Building bundles:'); // eslint-disable-line no-console

    for (const browser of browsers) {
        console.log(`  ${browser}...`); // eslint-disable-line no-console

        try {
            await build(browser);
        } catch (e) {
            if (!/esbuild/.test(e.stack)) {
                console.error(e); // eslint-disable-line no-console
            }

            return;
        }
    }

    console.log('  OK'); // eslint-disable-line no-console
};

(async function() {
    await buildAll();

    if (watch) {
        const lastChange = new Map();

        fs.watch(indir, { recursive: true }, function(event, fn) {
            const filename = path.join(indir, fn);
            if (event === 'rename' && !fs.existsSync(filename)) {
                return;
            }
            const mtime = Number(fs.statSync(filename).mtime);

            // avoid build when file doesn't changed but event is received
            if (lastChange.get(fn) !== mtime) {
                lastChange.set(fn, mtime);
                buildAll();
            }
        });
    }
})();

function copyFile(filepath, dest) {
    fs.copyFileSync(filepath, path.join(dest, path.basename(filepath)));
}

function copyFiles(src, dest) {
    fs.mkdirSync(dest, { recursive: true });

    if (fs.statSync(src).isDirectory()) {
        fs.readdirSync(src).forEach(p =>
            copyFiles(path.join(src, p), path.join(dest, path.basename(src)))
        );
    } else {
        copyFile(src, dest);
    }
}
