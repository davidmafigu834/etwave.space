# System Update Feature Documentation

## Overview
The System Update feature allows administrators to upload and apply system updates via ZIP files. This provides a secure, automated way to update the application without manual file management.

## Features
- ✅ Upload ZIP update packages
- ✅ Automatic backup before updates
- ✅ File validation and checksum verification
- ✅ Safe rollback functionality
- ✅ Migration execution
- ✅ Cache clearing
- ✅ Version management
- ✅ Update history and logs
- ✅ Permission-based access control

## Database Structure
```sql
CREATE TABLE system_updates (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    version VARCHAR(20) UNIQUE,
    name VARCHAR(255),
    description TEXT,
    changelog TEXT,
    file_path VARCHAR(500),
    file_name VARCHAR(255),
    file_size VARCHAR(50),
    checksum VARCHAR(64),
    status ENUM('pending', 'applying', 'applied', 'failed', 'rolled_back') DEFAULT 'pending',
    applied_at TIMESTAMP NULL,
    backup_path VARCHAR(500),
    update_files JSON,
    update_actions JSON,
    error_message TEXT,
    created_by BIGINT UNSIGNED,
    applied_by BIGINT UNSIGNED,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (applied_by) REFERENCES users(id)
);
```

## API Routes
```
GET    /system-updates              - List all updates
GET    /system-updates/create       - Upload form
POST   /system-updates              - Upload new update
POST   /system-updates/{id}/apply   - Apply update
POST   /system-updates/{id}/rollback - Rollback update
DELETE /system-updates/{id}         - Delete update
GET    /system-updates/{id}/download - Download update file
GET    /system-updates/{id}/status  - Get update status
POST   /system-updates/validate     - Validate update file
POST   /system-updates/bulk-action  - Bulk operations
```

## Update Package Structure
```
update-package.zip/
├── update.json              # Update metadata
├── app/                     # Updated application files
│   └── Http/Controllers/
├── database/migrations/     # Database migrations
├── resources/              # Updated frontend files
└── routes/                 # Updated routes
```

## Update JSON Format
```json
{
  "version": "1.0.1",
  "name": "Security Update",
  "description": "Important security patches",
  "changelog": [
    "Fixed security vulnerability",
    "Improved performance",
    "Updated dependencies"
  ],
  "requires": {
    "php": ">=8.2",
    "mysql": ">=8.0",
    "backup": true
  },
  "files": [
    "app/Http/Controllers/ExampleController.php",
    "resources/js/components/Example.tsx"
  ],
  "actions": [
    {
      "type": "run_migrations",
      "description": "Run database migrations"
    },
    {
      "type": "clear_cache",
      "description": "Clear application cache"
    }
  ]
}
```

## Usage Instructions

### 1. Access System Updates
- Login as superadmin
- Navigate to **System Updates** in the sidebar
- Click **"Upload Update"** to add new updates

### 2. Create Update Package
1. Create a ZIP file containing your updates
2. Include an `update.json` file with metadata
3. Structure files in their proper directories
4. Calculate SHA-256 checksum for security

### 3. Upload Update
1. Go to **System Updates > Upload Update**
2. Enter version number, name, and description
3. Upload the ZIP file
4. Validate the package
5. Submit the update

### 4. Apply Update
1. Review update details and changelog
2. Click **"Apply Update"**
3. System creates automatic backup
4. Files are extracted and applied
5. Migrations are run (if any)
6. Caches are cleared
7. Update status is marked as applied

### 5. Rollback (if needed)
1. Go to applied updates
2. Click **"Rollback"**
3. System restores from backup
4. Caches are cleared
5. Update status is marked as rolled back

## Security Features
- ✅ File type validation (ZIP only)
- ✅ File size limits (100MB max)
- ✅ Checksum verification
- ✅ Automatic backups before updates
- ✅ Permission-based access control
- ✅ Detailed logging and audit trail

## Permissions Required
- `manage-system-updates` - View and manage updates
- `upload-system-updates` - Upload new updates
- `apply-system-updates` - Apply updates to system
- `rollback-system-updates` - Rollback applied updates
- `delete-system-updates` - Delete update records

## Error Handling
- Update failures are logged with detailed error messages
- Failed updates can be retried or deleted
- Rollback functionality available for applied updates
- Backup validation before rollback

## Version Management
- System version is tracked in settings
- Update history shows all changes
- Version comparison and validation
- Automatic version updates after successful application

## Maintenance Mode
Updates are applied in maintenance mode to prevent:
- Data corruption during file updates
- User interference during critical operations
- Database inconsistencies during migrations

## Logs and Monitoring
- All update activities are logged
- Progress tracking for long-running updates
- Error details for failed updates
- User activity tracking (who applied what)

## Best Practices
1. **Test First**: Always test updates on staging environment
2. **Backup**: System creates automatic backups, but manual backups recommended
3. **Versioning**: Use semantic versioning (1.0.1, 1.1.0, etc.)
4. **Documentation**: Include detailed changelog for each update
5. **Validation**: Always validate update package before applying
6. **Permissions**: Only assign update permissions to trusted administrators
