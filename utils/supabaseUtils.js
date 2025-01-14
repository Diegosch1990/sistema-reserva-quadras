import supabase from './supabaseClient';

export async function safeListObjects(table, limit = 100, ascending = true) {
    try {
        const { data, error } = await supabase
            .from(table)
            .select('*')
            .order('created_at', { ascending })
            .limit(limit);

        if (error) throw error;
        return data;
    } catch (error) {
        console.error(`Error listing objects from ${table}:`, error);
        return [];
    }
}

export async function safeGetObject(table, id) {
    try {
        const { data, error } = await supabase
            .from(table)
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error(`Error getting object from ${table}:`, error);
        return null;
    }
}

export async function safeCreateObject(table, object) {
    try {
        const { data, error } = await supabase
            .from(table)
            .insert([object])
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error(`Error creating object in ${table}:`, error);
        return null;
    }
}

export async function safeUpdateObject(table, id, updates) {
    try {
        const { data, error } = await supabase
            .from(table)
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error(`Error updating object in ${table}:`, error);
        return null;
    }
}

export async function safeDeleteObject(table, id) {
    try {
        const { error } = await supabase
            .from(table)
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error(`Error deleting object from ${table}:`, error);
        return false;
    }
}
