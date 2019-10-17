const vscode = require('vscode');
module.exports = {
  provideFoldingRanges(file) {
    const source = file.getText();
    const lines = source.split('\n');
    const folds = [];
    let start = 0;
    lines.forEach((line, index) => {
      if (line === '<!-- slide *-->') {
        folds.push(new vscode.FoldingRange(
          start, index - 1, vscode.FoldingRangeKind.Region
        ));
        start = index;
      }
    });
    return folds;
  },
};
