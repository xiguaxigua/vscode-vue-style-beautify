const vscode = require('vscode');
const csscomb = require('csscomb');
const micromatch = require('micromatch');
const path = require('path');
const defaultConfig = require('./default-config');

const EMBEDDED_FILE_SUPPORT = ['html', 'htm', 'vue', 'vue-html']
const CSS_FILE_SUPPORT = ['css', 'less', 'scss', 'sass', 'sass-indented']

let output = null;
function showOutput (msg) {
  if (!output) output = vscode.window.createOutputChannel('vueStyle');
  output.clear();
  output.appendLine('[vueStyle]:');
  output.append(msg);
  output.show();
}

function getEmbeddedBlock (args) {
  const { document } = args;
  let content = null;
  let pos = 0;
  let char = '';
  let startIndex = -1;
  let syntax = 'css';
  const text = document.getText();
  const textLangth = text.length;
  while (pos < textLangth) {
    char = text.charAt(pos);
    if (char === '<' && text.substr(pos, 6) === '<style') {
      let tag = '';
      do {
        char = text.charAt(pos);
        tag += char;
        pos++;
      } while (char !== '>' && pos < text.length);
      const matchedSyntax = tag.match(/lang=['"](.+)?['"]/);
      syntax = matchedSyntax ? matchedSyntax[1] : 'css';
      startIndex = pos + 1;
    }

    if (char === '<' && text.substr(pos, 8) === '</style>') {
      content = text.substring(startIndex, pos);
      const start = document.positionAt(startIndex);
      const end = document.positionAt(pos);
      const range = new vscode.Range(start, end);

      return { range, content, syntax };
    }

    pos++;
  }
}

function getCssBlock (args) {
  const { document, selection } = args;
  let range = null;
  let content = null;

  if (!selection || (selection && selection.isEmpty)) {
    const lastLine = document.lineAt(document.lineCount - 1);
    const start = new vscode.Position(0, 0);
    const end = new vscode.Position(document.lineCount - 1, lastLine.text.length);
    range = new vscode.Range(start, end);
    content = document.getText();
  } else {
    range = new vscode.Range(selection.start, selection.end);
    content = document.getText(range);
  }

  return { range, content, syntax: 'css' };
}

function getBlock (args) {
  const { languageId, document, selection } = args
  let block = null;
  if (~EMBEDDED_FILE_SUPPORT.indexOf(languageId)) {
    block = getEmbeddedBlock({ document });
  } else if (~CSS_FILE_SUPPORT.indexOf(languageId)) {
    block = getCssBlock({ document, selection });
  }
  return block
}

function activate(context) {
  const onCommand = vscode.commands.registerTextEditorCommand('vueStyle.beautify', function (textEditor) {
    const { document, selection } = textEditor;
    const { languageId } = document;
    const block = getBlock({ languageId, document, selection });
    if (!block) return showOutput(`${ languageId } syntac not support now.`);
    const { range, content, syntax } = block;
    const settings = vscode.workspace.getConfiguration('vueStyle');
    const preset = settings ? settings.preset : {}
    const config = Object.assign({}, defaultConfig, preset);
    const combHandler = new csscomb(config);

    combHandler.processString(content, { syntax }).then(newString => {
      textEditor.edit(builder => {
        builder.replace(range, newString);
      })
    }, err => showOutput(err.stack));
  });

  const onSave = vscode.workspace.onWillSaveTextDocument((event) => {
    const { document } = event;
    const { languageId, fileName } = document;
    const settings = vscode.workspace.getConfiguration('vueStyle');
    if (!settings || !settings.formatOnSave) return null;
    const { ignoreFilesOnSave, preset } = settings
    let excludes = [];
		if (ignoreFilesOnSave) {
			excludes = excludes.concat(ignoreFilesOnSave);
		}
		if (typeof preset === 'object' && preset.exclude) {
			excludes = excludes.concat(preset.exclude);
		}
		if (excludes.length) {
			const currentFile = path.relative(vscode.workspace.rootPath, fileName);
			if (micromatch([currentFile], excludes).length) return null;
		}
    const block = getBlock({ languageId, document });
    if (!block) return;
    const { range, content, syntax } = block;
    const config = Object.assign({}, defaultConfig, preset);
    const combHandler = new csscomb(config);
    const actions = combHandler.processString(content, { syntax }).then(newString => {
      return [vscode.TextEdit.replace(range, newString)]
    }, err => showOutput(err.stack));
    event.waitUntil(actions)
  });

  context.subscriptions.push(onCommand);
  context.subscriptions.push(onSave);
}
exports.activate = activate;

function deactivate() {}
exports.deactivate = deactivate;
