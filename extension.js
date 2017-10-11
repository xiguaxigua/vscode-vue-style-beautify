const vscode = require('vscode');

let output = null;

function showOutput (msg) {
  if (!output) output = vscode.window.createOutputChannel('vueStyle');
  output.clear();
  output.appendLine('[vueStyle]:');
  output.append(msg);
  output.show();
}

function activate(context) {
  const onCommand = vscode.commands.registerTextEditorCommand('vueStyle.beautify', function (textEditor) {
    vscode.window.showInformationMessage('Hello World!');
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
