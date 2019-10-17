const vscode = require('vscode');
const slideFoldingRangeProvider = require('./provider');

module.exports = { activate };

function activate() {
  const selector = { language: 'slides' };

  vscode.languages.registerFoldingRangeProvider(
    selector, 
    slideFoldingRangeProvider
  );
}
