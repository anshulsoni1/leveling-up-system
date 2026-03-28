import os

file_path = 'src/app/features/system/hunter-status-panel/hunter-status-panel.component.ts'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

old_circuit = '''    .circuit-module {
      position: relative;
      background: rgba(4, 9, 24, 0.98);
      padding: 45px;
      min-height: 250px;
      clip-path: polygon(
        0% 20px, 20px 0%, 
        calc(100% - 20px) 0%, 100% 20px,
        100% calc(100% - 20px), calc(100% - 20px) 100%,
        20px 100%, 0% calc(100% - 20px)
      );
    }'''

new_circuit = '''    @property --border-angle {
      syntax: "<angle>";
      inherits: true;
      initial-value: 0turn;
    }

    @keyframes spin-border {
      to { --border-angle: 1turn; }
    }

    .circuit-module {
      position: relative;
      background: rgba(2, 6, 23, 0.45);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      box-shadow: inset 0 0 20px rgba(0, 234, 255, 0.15);
      padding: 45px;
      min-height: 250px;
      clip-path: polygon(
        0% 20px, 20px 0%, 
        calc(100% - 20px) 0%, 100% 20px,
        100% calc(100% - 20px), calc(100% - 20px) 100%,
        20px 100%, 0% calc(100% - 20px)
      );
    }

    .circuit-module::after {
      content: "";
      position: absolute;
      inset: 0;
      z-index: 1;
      pointer-events: none;
      padding: 2px;
      background: conic-gradient(from var(--border-angle), transparent 25%, #00eaff, #007bff, transparent 80%);
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      animation: spin-border 4s linear infinite;
    }'''

if old_circuit in content:
    content = content.replace(old_circuit, new_circuit)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Patched Hunter Panel SCSS")
else:
    print("Target 1 not found. Check formatting.")

scss_path = 'src/app/features/system/dashboard/dashboard.scss'
with open(scss_path, 'r', encoding='utf-8') as f:
    scss_content = f.read()

hex_grid_css = '''/* Hexagonal Pulse Grid Layer */
.dashboard-container::before {
  content: "";
  position: absolute;
  inset: -10%;
  pointer-events: none;
  z-index: 0;
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='103.92' viewBox='0 0 60 103.92' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 103.92 L0 86.6 L0 51.96 L30 34.64 L60 51.96 L60 86.6 Z M30 69.28 L0 51.96 L0 17.32 L30 0 L60 17.32 L60 51.96 Z' stroke='rgba(0, 234, 255, 0.06)' stroke-width='1' fill='none'/%3E%3C/svg%3E");
  background-size: 60px 103.92px;
  animation: hexPulse 6s ease-in-out infinite alternate;
}

@keyframes hexPulse {
  0% { opacity: 0.3; transform: scale(1); }
  100% { opacity: 0.8; transform: scale(1.02); }
}

/* Sharp Electric Sparks Layer (Z-Index 1) */'''

if '/* Sharp Electric Sparks Layer (Z-Index 1) */' in scss_content:
    if 'Hexagonal Pulse Grid Layer' not in scss_content:
        scss_content = scss_content.replace('/* Sharp Electric Sparks Layer (Z-Index 1) */', hex_grid_css)
        with open(scss_path, 'w', encoding='utf-8') as f:
            f.write(scss_content)
        print("Patched Dashboard SCSS")
    else:
        print("Dashboard SCSS already patched.")
else:
    print("Target 2 not found.")
