import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AirtableRecord {
  id: string;
  fields: Record<string, any>;
  createdTime: string;
}

export const useAirtable = (tableName: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callAirtableFunction = async (action: string, data?: any, recordId?: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data: result, error: functionError } = await supabase.functions.invoke(
        "airtable-sync",
        {
          body: {
            action,
            table: tableName,
            data,
            recordId,
          },
        }
      );

      if (functionError) throw functionError;
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const listRecords = async (): Promise<AirtableRecord[]> => {
    const result = await callAirtableFunction("list");
    return result.records || [];
  };

  const getRecord = async (recordId: string): Promise<AirtableRecord> => {
    return await callAirtableFunction("get", undefined, recordId);
  };

  const createRecord = async (fields: Record<string, any>): Promise<AirtableRecord> => {
    return await callAirtableFunction("create", fields);
  };

  const updateRecord = async (recordId: string, fields: Record<string, any>): Promise<AirtableRecord> => {
    return await callAirtableFunction("update", fields, recordId);
  };

  const deleteRecord = async (recordId: string): Promise<void> => {
    await callAirtableFunction("delete", undefined, recordId);
  };

  return {
    loading,
    error,
    listRecords,
    getRecord,
    createRecord,
    updateRecord,
    deleteRecord,
  };
};
