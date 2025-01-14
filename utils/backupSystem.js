class BackupSystem {
    constructor() {
        this.backupInterval = 24 * 60 * 60 * 1000; // 24 horas
        this.maxBackups = 7; // Mantém backups da última semana
    }

    async startAutoBackup() {
        try {
            // Faz backup inicial
            await this.createBackup();

            // Configura backup automático
            setInterval(async () => {
                await this.createBackup();
            }, this.backupInterval);
        } catch (error) {
            reportError(error);
            console.error('Erro ao iniciar backup automático:', error);
        }
    }

    async createBackup() {
        try {
            const data = await this.gatherData();
            const backup = {
                timestamp: new Date().toISOString(),
                data: data
            };

            // Salva o backup
            await safeCreateObject('backups', backup);

            // Remove backups antigos
            await this.cleanOldBackups();

            console.log('Backup criado com sucesso:', backup.timestamp);
        } catch (error) {
            reportError(error);
            console.error('Erro ao criar backup:', error);
        }
    }

    async gatherData() {
        try {
            // Coleta dados de todas as coleções
            const [
                bookings,
                customers,
                courts,
                settings,
                releases
            ] = await Promise.all([
                safeListObjects('booking', 1000, true),
                safeListObjects('customer', 1000, true),
                safeListObjects('court', 1000, true),
                safeListObjects('settings', 1000, true),
                safeListObjects('releases', 1000, true)
            ]);

            return {
                bookings,
                customers,
                courts,
                settings,
                releases,
                version: '1.0',
                createdAt: new Date().toISOString()
            };
        } catch (error) {
            reportError(error);
            console.error('Erro ao coletar dados para backup:', error);
            throw error;
        }
    }

    async cleanOldBackups() {
        try {
            const backups = await safeListObjects('backups', 1000, true);
            
            if (backups.length > this.maxBackups) {
                const oldBackups = backups
                    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                    .slice(this.maxBackups);

                for (const backup of oldBackups) {
                    await safeDeleteObject('backups', backup.objectId);
                }
            }
        } catch (error) {
            reportError(error);
            console.error('Erro ao limpar backups antigos:', error);
        }
    }

    async restoreBackup(backupId) {
        try {
            const backup = await safeGetObject('backups', backupId);
            if (!backup) {
                throw new Error('Backup não encontrado');
            }

            // Restaura os dados
            for (const [collection, items] of Object.entries(backup.data)) {
                // Remove dados atuais
                const currentItems = await safeListObjects(collection, 1000, true);
                for (const item of currentItems) {
                    await safeDeleteObject(collection, item.objectId);
                }

                // Insere dados do backup
                for (const item of items) {
                    await safeCreateObject(collection, item.objectData);
                }
            }

            console.log('Backup restaurado com sucesso:', backup.timestamp);
        } catch (error) {
            reportError(error);
            console.error('Erro ao restaurar backup:', error);
            throw error;
        }
    }
}
