import { FileChange } from '@/types';

interface DiffResult {
  path: string;
  additions: number;
  deletions: number;
  hunks: DiffHunk[];
}

interface DiffHunk {
  oldStart: number;
  oldLines: number;
  newStart: number;
  newLines: number;
  lines: DiffLine[];
}

interface DiffLine {
  type: 'context' | 'addition' | 'deletion';
  content: string;
  oldLineNumber?: number;
  newLineNumber?: number;
}

export class DiffEngine {
  generateDiff(original: string, modified: string): DiffResult {
    const originalLines = original.split('\n');
    const modifiedLines = modified.split('\n');
    
    // Simple line-by-line diff (can be enhanced with better algorithm)
    const hunks: DiffHunk[] = [];
    const lines: DiffLine[] = [];
    
    let i = 0, j = 0;
    let additions = 0;
    let deletions = 0;
    
    while (i < originalLines.length || j < modifiedLines.length) {
      if (i < originalLines.length && j < modifiedLines.length && originalLines[i] === modifiedLines[j]) {
        lines.push({
          type: 'context',
          content: originalLines[i],
          oldLineNumber: i + 1,
          newLineNumber: j + 1,
        });
        i++;
        j++;
      } else {
        // Find next matching lines
        let nextMatch = -1;
        for (let k = i; k < originalLines.length; k++) {
          const matchIndex = modifiedLines.indexOf(originalLines[k], j);
          if (matchIndex !== -1) {
            nextMatch = k;
            break;
          }
        }
        
        if (nextMatch === -1) {
          // Deletions at the end
          while (i < originalLines.length) {
            lines.push({
              type: 'deletion',
              content: originalLines[i],
              oldLineNumber: i + 1,
            });
            deletions++;
            i++;
          }
          // Additions at the end
          while (j < modifiedLines.length) {
            lines.push({
              type: 'addition',
              content: modifiedLines[j],
              newLineNumber: j + 1,
            });
            additions++;
            j++;
          }
        } else {
          // Deletions before next match
          while (i < nextMatch) {
            lines.push({
              type: 'deletion',
              content: originalLines[i],
              oldLineNumber: i + 1,
            });
            deletions++;
            i++;
          }
          // Additions before next match
          const targetMatch = modifiedLines.indexOf(originalLines[nextMatch], j);
          while (j < targetMatch) {
            lines.push({
              type: 'addition',
              content: modifiedLines[j],
              newLineNumber: j + 1,
            });
            additions++;
            j++;
          }
        }
      }
    }
    
    if (lines.length > 0) {
      hunks.push({
        oldStart: lines[0].oldLineNumber || 1,
        oldLines: deletions,
        newStart: lines[0].newLineNumber || 1,
        newLines: additions,
        lines,
      });
    }
    
    return {
      path: '',
      additions,
      deletions,
      hunks,
    };
  }

  compareFiles(changes: FileChange[]): Map<string, DiffResult> {
    const diffs = new Map<string, DiffResult>();
    
    changes.forEach(change => {
      const diff = this.generateDiff(
        change.originalContent || '',
        change.content
      );
      diff.path = change.path;
      diffs.set(change.path, diff);
    });
    
    return diffs;
  }

  formatDiffForDisplay(diff: DiffResult): string {
    let output = '';
    
    diff.hunks.forEach(hunk => {
      output += `@@ -${hunk.oldStart},${hunk.oldLines} +${hunk.newStart},${hunk.newLines} @@\n`;
      
      hunk.lines.forEach(line => {
        const prefix = line.type === 'addition' ? '+' : line.type === 'deletion' ? '-' : ' ';
        const lineNumber = line.type === 'deletion' 
          ? line.oldLineNumber 
          : line.type === 'addition' 
            ? line.newLineNumber 
            : '';
        
        output += `${prefix} ${lineNumber ? `${lineNumber}: ` : ''}${line.content}\n`;
      });
    });
    
    return output;
  }
}

export const diffEngine = new DiffEngine();
