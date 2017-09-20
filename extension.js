const vscode = require('vscode');

function activate(context) {
    console.log('Congratulations, your extension "vue-style-beautify" is now active!');

    let disposable = vscode.commands.registerTextEditorCommand('extension.sayHello', function (textEditor) {
        vscode.window.showInformationMessage('Hello World!');
    });

    context.subscriptions.push(disposable);
}
exports.activate = activate;

function deactivate() {}
exports.deactivate = deactivate;
