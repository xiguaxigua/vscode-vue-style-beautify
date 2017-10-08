const vscode = require('vscode');

function activate(context) {
  const onCommand = vscode.commands.registerTextEditorCommand('vueStyle.beautify', function (textEditor) {
    vscode.window.showInformationMessage('Hello World!');
    console.log(textEditor)
  });

  const onSave = vscode.workspace.onWillSaveTextDocument((event) => {
    vscode.window.showInformationMessage('save Hello World!');
    console.log(event)
  });

  context.subscriptions.push(onCommand);
  context.subscriptions.push(onSave);
}
exports.activate = activate;

function deactivate() {}
exports.deactivate = deactivate;
