const fs=require('fs');
let sFile = 'src/app/features/system/dashboard/dashboard.scss';
let s = fs.readFileSync(sFile, 'utf8');
s = s.replace(/\/\* Base Depth and Drifting Stars \(Z-Index 0\) \*\/[\s\S]*?100% \{ background-position:[^}]*\}\r?\n\}/, '/* Base Depth and Drifting Stars (Z-Index 0) */');
s = s.replace(/\s*94% \{ opacity: 1; \}\s*95% \{ opacity: 0\.3; \}\s*96% \{ opacity: 1; \}\s*97% \{ opacity: 0; \}\s*\}/, '');
fs.writeFileSync(sFile, s);

let hFile = 'src/app/features/system/dashboard/dashboard.html';
let h = fs.readFileSync(hFile, 'utf8');
h = h.replace(/<div class="strike strike-3">\s*<\/div>\s*<\/div>/, '<div class="strike strike-3"></div>');
fs.writeFileSync(hFile, h);
console.log('Fixed compile errors.');
