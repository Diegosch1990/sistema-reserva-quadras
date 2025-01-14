async function handleApiCall(apiFunction, fallbackValue = null) {
    try {
        const response = await apiFunction();
        return response;
    } catch (error) {
        reportError(error);
        console.error('API Error:', error);
        return fallbackValue;
    }
}

async function safeListObjects(objectType, limit = 100, descent = true) {
    try {
        const response = await trickleListObjects(objectType, limit, descent);
        return response?.items || [];
    } catch (error) {
        reportError(error);
        console.error(`Error listing ${objectType}:`, error);
        return [];
    }
}

async function safeCreateObject(objectType, data) {
    try {
        const response = await trickleCreateObject(objectType, data);
        return response;
    } catch (error) {
        reportError(error);
        console.error(`Error creating ${objectType}:`, error);
        throw error;
    }
}

async function safeUpdateObject(objectType, objectId, data) {
    try {
        const response = await trickleUpdateObject(objectType, objectId, data);
        return response;
    } catch (error) {
        reportError(error);
        console.error(`Error updating ${objectType}:`, error);
        throw error;
    }
}

async function safeDeleteObject(objectType, objectId) {
    try {
        await trickleDeleteObject(objectType, objectId);
        return true;
    } catch (error) {
        reportError(error);
        console.error(`Error deleting ${objectType}:`, error);
        throw error;
    }
}
