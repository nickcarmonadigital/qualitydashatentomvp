import { supabase } from '@/lib/supabase/client';

export const performSoftDelete = async (table: string, id: string) => {
    const { error } = await supabase
        .from(table)
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

    if (error) {
        throw new Error(`Soft delete failed for ${table}:${id} - ${error.message}`);
    }

    return true;
};

// Helper to filter out soft-deleted items
export const notDeleted = (row: any) => !row.deleted_at;
