# Security Design – ToolHitList

## Data Classification

| Table / Column | Classification | Notes |
|----------------|----------------|-------|
| | | |

## Row-Level Security

| Table | OLS/RLS Rule | Rationale |
|-------|-------------|-----------|
| | | |

## Column-Level Security

| Table | Column | Profile Required |
|-------|--------|-----------------|
| | | |

## Roles

| Security Role | Description | Assigned To |
|---------------|-------------|-------------|
| | | |

## Integration Credentials

All credentials stored in:
- Azure Key Vault  
- Dataverse Secret Environment Variables  
- **Never** in source code or plain-text config

## Service Principal (CI/CD)

| Field | Value |
|-------|-------|
| App Registration | _TBD_ |
| Permissions | Dataverse System Admin (Dev only) |
| Secret storage | GitHub Actions Secret: `POWER_PLATFORM_SPN_SECRET` |
