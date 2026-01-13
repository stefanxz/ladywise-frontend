import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { getRiskHistory } from "@/lib/api";
import { DiagnosticsResponseDTO } from "@/lib/types/diagnostics";
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/context/AuthContext";

export const useRiskData = (riskFactor?: string) => {
    const { token, userId } = useAuth();
    const { showToast } = useToast();
    const [history, setHistory] = useState<DiagnosticsResponseDTO[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = useCallback(async () => {
        if (!token || !userId) {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const data = await getRiskHistory(token, userId);
            if (Array.isArray(data)) {
                const sorted = data.sort(
                    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
                );
                setHistory(sorted);
            } else {
                showToast("Received invalid data from server.", "error");
            }
        } catch (e: any) {
            // Only show specific errors or generic fallback
            showToast("Failed to load history.", "error");
        } finally {
            setLoading(false);
        }
    }, [token, userId, showToast]);

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [loadData])
    );

    return { history, loading, refetch: loadData };
};
