const vscode = require('vscode');

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
        pos++
      } while (char !== '>' && pos < text.length);

      const matchedSyntax = tag.match(/lang=['"](.+)?['"]/);
      syntax = matchedSyntax[1] || 'css'

      startIndex = pos + 1;
    }

    if (char === '<' && text.substr(pos, 8) === '</style>') {
      content = text.substring(startIndex, pos)
      const start = document.positionAt(startIndex);
      const end = document.positionAt(pos);
      const range = new vscode.Range(start, end)

      return { range, content, syntax }
    }

    pos++;
  }
}

function getCssBlock (args) {
  const { document, selection } = args;
  let range = null;
  let content = null;

  if (!selection || (selection && selection.isEmpty)) {
    const lastLine = this.document.lineAt(this.document.lineCount - 1);
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

function activate(context) {
  const onCommand = vscode.commands.registerTextEditorCommand('vueStyle.beautify', function (textEditor) {
    vscode.window.showInformationMessage('Hello World!');
    const { document, selection } = textEditor;
    const { languageId } = document;
    let block = {};

    if (~EMBEDDED_FILE_SUPPORT.indexOf(languageId)) {
      block = getEmbeddedBlock({ document });
    } else if (~CSS_FILE_SUPPORT.indexOf(languageId)) {
      block = getCssBlock({ document, selection });
    } else {
      return showOutput(`${ languageId } syntac not support now.`);
    }
    console.log(block);
    console.log(textEditor);
    console.log(showOutput);
  });

  const onSave = vscode.workspace.onWillSaveTextDocument((event) => {
    vscode.window.showInformationMessage('save Hello World!');
    console.log(event);
  });

  context.subscriptions.push(onCommand);
  context.subscriptions.push(onSave);
}
exports.activate = activate;

function deactivate() {}
exports.deactivate = deactivate;
