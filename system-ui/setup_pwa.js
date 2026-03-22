const fs = require('fs');
const path = require('path');

const dir = path.resolve('src/app/shared/components/install-prompt');
fs.mkdirSync(dir, { recursive: true });

const tsCode = `import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-install-prompt',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './install-prompt.component.html',
  styleUrls: ['./install-prompt.component.scss']
})
export class InstallPromptComponent implements OnInit {
  deferredPrompt: any;
  showPrompt = false;

  @HostListener('window:beforeinstallprompt', ['$event'])
  onbeforeinstallprompt(e: Event) {
    e.preventDefault();
    this.deferredPrompt = e;
    this.showPrompt = true;
  }

  ngOnInit() {
    window.addEventListener('appinstalled', () => {
      this.showPrompt = false;
      this.deferredPrompt = null;
    });
  }

  installApp() {
    this.showPrompt = false;
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      this.deferredPrompt.userChoice.then((choiceResult: any) => {
        this.deferredPrompt = null;
      });
    }
  }

  dismiss() {
    this.showPrompt = false;
  }
}`;

const htmlCode = `<div class="install-prompt-overlay" *ngIf="showPrompt">
  <div class="install-card hud-panel glow-hover">
    <div class="card-glow"></div>
    <div class="panel-header" style="border-bottom: 1px solid rgba(0,234,255,0.2); padding-bottom: 10px; margin-bottom: 15px;">
      <h3 class="panel-title" style="margin: 0; font-size: 1.2rem;">SYSTEM APP AVAILABLE</h3>
    </div>
    <div class="prompt-body">
      <p style="color: #aaa; margin-bottom: 20px;">Install System App for offline tracking, better performance, and immersive full-screen experience.</p>
      <div class="action-buttons" style="display: flex; gap: 10px; justify-content: flex-end;">
        <button class="sys-btn" style="background: transparent; color: #888; border-color: #555;" (click)="dismiss()">LATER</button>
        <button class="save-btn glow-hover" (click)="installApp()">INSTALL SYSTEM APP</button>
      </div>
    </div>
  </div>
</div>`;

const scssCode = `.install-prompt-overlay {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  width: 350px;
  max-width: calc(100vw - 40px);
  animation: slideIn 0.5s ease-out;
}
.install-card {
  padding: 20px;
  background: rgba(10, 15, 25, 0.95);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5), 0 0 10px rgba(0, 234, 255, 0.2) inset;
}
@keyframes slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}`;

fs.writeFileSync(path.join(dir, 'install-prompt.component.ts'), tsCode);
fs.writeFileSync(path.join(dir, 'install-prompt.component.html'), htmlCode);
fs.writeFileSync(path.join(dir, 'install-prompt.component.scss'), scssCode);

let appTs = fs.readFileSync('src/app/app.ts', 'utf8');
if (!appTs.includes('InstallPromptComponent')) {
  appTs = appTs.replace(/import \{ CommandPaletteComponent \}[\s\S]*?;/, match => match + "\nimport { InstallPromptComponent } from './shared/components/install-prompt/install-prompt.component';");
  appTs = appTs.replace(/imports:\s*\[([^\]]+)\]/, (match, p1) => { return 'imports: [' + p1 + ', InstallPromptComponent]'; });
  fs.writeFileSync('src/app/app.ts', appTs);
}

let appHtml = fs.readFileSync('src/app/app.html', 'utf8');
if (!appHtml.includes('<app-install-prompt>')) {
  fs.writeFileSync('src/app/app.html', appHtml + '\n<app-install-prompt></app-install-prompt>');
}

const ngswConfig = {
  "$schema": "./node_modules/@angular/service-worker/config/schema.json",
  "index": "/index.html",
  "assetGroups": [
    {
      "name": "app",
      "installMode": "prefetch",
      "resources": {
        "files": ["/favicon.ico", "/index.html", "/manifest.webmanifest", "/*.css", "/*.js"]
      }
    },
    {
      "name": "assets",
      "installMode": "lazy",
      "updateMode": "prefetch",
      "resources": {
        "files": ["/assets/**", "/*.(svg|cur|jpg|jpeg|png|apng|webp|avif|gif|otf|ttf|woff|woff2)"]
      }
    }
  ],
  "dataGroups": [
    {
      "name": "api-cache",
      "urls": [
        "https://leveling-up-system-1.onrender.com/api/user/**",
        "https://leveling-up-system-1.onrender.com/api/activity/**",
        "https://leveling-up-system-1.onrender.com/api/modules/**"
      ],
      "cacheConfig": {
        "strategy": "performance",
        "maxSize": 100,
        "maxAge": "1d",
        "timeout": "5s"
      }
    }
  ]
};
fs.writeFileSync('ngsw-config.json', JSON.stringify(ngswConfig, null, 2));

const manifest = {
  "name": "System App",
  "short_name": "System App",
  "theme_color": "#00eaff",
  "background_color": "#0a0f19",
  "display": "standalone",
  "scope": "/",
  "start_url": "/",
  "icons": [
    {
      "src": "assets/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    {
      "src": "assets/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ]
};
const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(path.join('public', 'manifest.webmanifest'), JSON.stringify(manifest, null, 2));

let indexHtml = fs.readFileSync('src/index.html', 'utf8');
if (!indexHtml.includes('manifest.webmanifest')) {
  indexHtml = indexHtml.replace('</head>', '  <link rel="manifest" href="manifest.webmanifest">\n  <meta name="theme-color" content="#00eaff">\n</head>');
  fs.writeFileSync('src/index.html', indexHtml);
}

let appConfig = fs.readFileSync('src/app/app.config.ts', 'utf8');
if (!appConfig.includes('provideServiceWorker')) {
  appConfig = appConfig.replace("import { ApplicationConfig", "import { ApplicationConfig, isDevMode");
  appConfig = appConfig.replace("@angular/core';", "@angular/core';\nimport { provideServiceWorker } from '@angular/service-worker';");
  appConfig = appConfig.replace("providers: [", "providers: [\n    provideServiceWorker('ngsw-worker.js', {\n      enabled: !isDevMode(),\n      registrationStrategy: 'registerWhenStable:30000'\n    }),");
  fs.writeFileSync('src/app/app.config.ts', appConfig);
}

let angularJson = fs.readFileSync('angular.json', 'utf8');
const p = JSON.parse(angularJson);
const sysUI = p.projects['system-ui'];
if (sysUI && sysUI.architect && sysUI.architect.build && sysUI.architect.build.options) {
   sysUI.architect.build.options.serviceWorker = 'ngsw-config.json';
}
fs.writeFileSync('angular.json', JSON.stringify(p, null, 2));

console.log('PWA Setup Completed');
