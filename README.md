# ToolHitList

A Power Platform code-first application built using the **Power Apps Component Framework (PCF)**, managed with PAC CLI and source-controlled in an unpacked solution format.

## Quick Start

### Prerequisites
- [VS Code](https://code.visualstudio.com/) with the [Power Platform Tools](https://marketplace.visualstudio.com/items?itemName=microsoft-isvexptools.powerplatform-vscode) extension
- [Node.js LTS](https://nodejs.org/)
- PAC CLI (included with the Power Platform Tools VS Code extension)
- A Dataverse Dev environment with System Admin / System Customizer rights

### Authenticate
```bash
pac auth create --url https://<dev-env>.crm.dynamics.com
```

### Build a PCF component
```bash
cd src/<ComponentName>
npm install
npm run build
```

### Pack & deploy to Dev
```bash
pac solution pack --zipfile solution.zip --folder src --packagetype Managed
pac solution import --path solution.zip --activate-plugins
```

## Repository Structure

```
.
├── .github/
│   ├── copilot-instructions.md   # AI agent conventions
│   └── workflows/                # GitHub Actions CI/CD
├── docs/
│   ├── project-brief.md          # Project brief & requirements
│   ├── security.md               # Security design
│   └── adr/                      # Architecture Decision Records
├── src/                          # Unpacked solution (pac solution unpack)
│   ├── CanvasApps/               # Canvas app YAML (*.pa.yaml)
│   ├── Workflows/                # Power Automate flow JSON
│   ├── Entities/                 # Dataverse table definitions
│   └── Other/                    # Solution metadata, env vars, connection refs
├── config/                       # Environment-specific config (non-secret)
└── dist/                         # Managed ZIPs – gitignored
```

## Publisher

`jsdev` – all custom components, tables, and columns use this prefix.

## Environments

| Environment | Branch |
|-------------|--------|
| Dev | `feature/*` |
| Test/UAT | `main` |
| Production | tagged release |

## Docs

- [Project Brief](docs/project-brief.md)
- [Security Design](docs/security.md)
- [Architecture Decisions](docs/adr/README.md)
