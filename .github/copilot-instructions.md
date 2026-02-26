# Copilot Instructions – ToolHitList (Power Platform)

## Architecture

This is a **Power Platform code-first application** repository using **Power Apps Component Framework (PCF)**. It is managed with the PAC CLI and a source-control–friendly unpacked solution format. PCF components are TypeScript/React-based controls deployed into Dataverse solutions.

- Solution components live in `src/` (unpacked via `pac solution unpack`)
- Canvas apps are stored as unpacked MSAPP YAML (`*.pa.yaml`) under `src/CanvasApps/`
- Power Automate flows are stored as JSON under `src/Workflows/`
- Dataverse customizations (tables, forms, views, plugins) are under `src/Other/` and `src/Entities/`
- Environment-specific config lives in `config/<env>.json` — never hardcoded in source files
- Connection references are declared in `src/Other/ConnectionReference/` — use symbolic names, not environment-specific IDs

## Build and Test

```bash
# Authenticate to Dataverse environment
pac auth create --url https://<env>.crm.dynamics.com

# Initialise a new PCF component (run from component subfolder)
pac pcf init --namespace jsdev --name <ComponentName> --template field --run-npm-install

# Build component (dev)
npm run build

# Build component (production)
npm run build -- --buildMode production

# Launch local test harness
npm start watch

# Unpack solution from environment into src/
pac solution unpack --zipfile solution.zip --folder src --packagetype Both

# Pack solution ready for import
pac solution pack --zipfile solution.zip --folder src --packagetype Managed

# Import to target environment
pac solution import --path solution.zip --activate-plugins

# Push PCF component directly to environment (dev only)
pac pcf push --publisher-prefix jsdev
```

## Code Style

- **Power Fx**: use named formulas in `App.Formulas` for reusable logic; avoid deep-nesting `If()` — prefer `Switch()` or `Select()`
- **Variable naming**: prefix globals with `g` (e.g., `gCurrentUser`), context vars with `loc` (e.g., `locIsLoading`)
- **Collections**: prefix with `col` (e.g., `colItems`)
- **Component properties**: use PascalCase; document custom input/output properties inline
- **YAML/JSON**: 2-space indentation; no trailing whitespace

## Project Conventions

- All environment-specific values (URLs, IDs, feature flags) must use **Environment Variables** — never embed them in canvas app formulas or flow definitions
- Connection references must be used for all connector references; do not use personal connections in shared flows
- Solution publisher prefix: **`jsdev`** (confirm in `src/Other/Solution/solution.xml`) — all custom tables, columns, and components must use this prefix (e.g., `jsdev_toolhitlist`)
- Managed solution exports go to `dist/` (gitignored); only unpack source goes in `src/`

## ALM – Environment Promotion

| Environment | Purpose | Branch |
|-------------|---------|--------|
| Dev | Active development | `feature/*` |
| Test / UAT | Validation | `main` |
| Production | Live | tagged release |

- Deploy via **managed** solution only to Test and Prod
- Post-deploy checklist: activate flows, verify environment variable values, confirm connection reference assignments, smoke-test key screens/flows
- Rollback: re-import previous managed solution zip from `dist/` or prior Git tag

## Copilot Studio – Agent Development

Copilot Studio agents are solution components packaged inside the same Dataverse solution as the rest of the app. The **Power Agent MCP** server (253+ tools) is wired up in `.vscode/mcp.json` and gives AI assistants (GitHub Copilot, Claude) direct access to Power Platform at dev time.

### Key agent concepts
- All agents are stored as solution components — never created directly in Prod without promotion through Dev → Test
- Agent topics: small, composable; name variables with `loc` prefix; document every user-visible prompt
- Each tool/action must have a tight "when to use" description and defined failure behavior
- Knowledge sources: public URLs, SharePoint, or Dataverse; document in the relevant ADR

### MCP server setup (one-time, per machine)
```bash
# Requires .NET SDK 8+ — install from https://dot.net if not present
dotnet tool install --global DarBotLabs.PowerAgent.MCP

# Set these environment variables (add to user profile or .env – never commit secrets)
$env:POWERPLATFORM_TENANT_ID   = "<your-tenant-id>"
$env:POWERPLATFORM_APP_ID      = "<service-principal-app-id>"
$env:POWERPLATFORM_CLIENT_SECRET = "<secret>"   # stored in user env only
```

Then in VS Code: **Ctrl+Shift+P → Power Agent MCP: Start MCP Server**

### Available MCP tool groups (via `f1e_pp_*`)
| Group | What it does |
|-------|-------------|
| `f1e_pp_copilot` | Create, configure, deploy, test Copilot Studio agents |
| `f1e_pp_solution` | Export, import, pack, unpack solutions |
| `f1e_pp_application` | Canvas apps, PCF components |
| `f1e_pp_data` | Dataverse CRUD, schema discovery |
| `f1e_pp_environment` | Environment management |
| `f1e_pp_connector` | Custom connectors, connection references |
| `f1e_pp_quality` | Solution checker, Power Fx, testing |
| `f1e_pp_pipeline` | CI/CD, package deployment |

## Integration Points

- **Dataverse** – primary data store; all schema changes via solution (no manual customizations in target environments)
- **Power Automate** – all automations packaged inside the solution
- **Custom connectors** – packaged in solution; base URL set via environment variable
- **Azure / external APIs** – credentials stored in Azure Key Vault or Dataverse secret environment variables; never in plain text

## Security

- Do not commit credentials, client secrets, or tenant/environment IDs — use environment variables or `.env` files (gitignored)
- Column-level and row-level security defined in Dataverse; document in `docs/security.md`
- Service principal used for CI/CD authentication (`pac auth create --applicationId ... --clientSecret ...`); credentials stored in pipeline secrets only
