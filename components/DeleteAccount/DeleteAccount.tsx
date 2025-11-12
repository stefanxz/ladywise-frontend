import React, { useCallback, useState } from "react";
import { ActivityIndicator, Modal, Pressable, Text, View } from "react-native";

export interface DeleteAccountModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => Promise<void> | void;

  title?: string;
  message?: string;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  visible,
  onCancel,
  onConfirm,
  title = "Delete account",
  message = "This action is permanent. Your profile, data, and all associated content will be deleted. This cannot be undone.",
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = useCallback(async () => {
    if (loading) return;
    setError(null);
    setLoading(true);
    try {
      await onConfirm();
    } catch (e: any) {
      setError(
        e?.message ?? "Something went wrong while deleting the account."
      );
      return; // keep modal open to show error
    } finally {
      setLoading(false);
    }
  }, [loading, onConfirm]);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onCancel}
      statusBarTranslucent
    >
      {/* Backdrop - now contains the dialog */}
      <Pressable
        onPress={onCancel}
        className="flex-1 bg-black/50 items-center justify-center px-4"
        accessibilityRole="button"
        accessibilityLabel="Close delete account dialog backdrop"
      >
        {/* Dialog - using View instead of Pressable, with pointerEvents to prevent backdrop dismiss */}
        <View pointerEvents="box-none" className="w-full max-w-sm">
          <View className="rounded-2xl bg-white p-5 shadow-lg">
            <View className="items-center">
              <View className="mb-3 h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <Text className="text-lg font-bold text-red-600">!</Text>
              </View>
              <Text className="mb-1 text-center text-lg font-semibold text-gray-900">
                {title}
              </Text>
              <Text className="mb-3 text-center text-sm text-gray-500">
                {message}
              </Text>

              {error ? (
                <View className="mb-3 w-full rounded-md bg-red-50 p-2">
                  <Text className="text-xs text-red-700">{error}</Text>
                </View>
              ) : null}

              <View className="mt-1 w-full flex-row gap-3">
                <Pressable
                  disabled={loading}
                  onPress={onCancel}
                  className="flex-1 items-center justify-center rounded-xl border border-gray-300 px-4 py-3 active:opacity-70"
                  accessibilityRole="button"
                  accessibilityLabel="Cancel delete account"
                >
                  <Text className="text-sm font-medium text-gray-900">
                    Cancel
                  </Text>
                </Pressable>

                <Pressable
                  disabled={loading}
                  onPress={handleConfirm}
                  className="flex-1 items-center justify-center rounded-xl bg-brand px-4 py-3 active:opacity-80 disabled:opacity-60"
                  accessibilityRole="button"
                  accessibilityLabel="Confirm delete account"
                >
                  {loading ? (
                    <ActivityIndicator testID="activity-indicator" />
                  ) : (
                    <Text className="text-sm font-semibold text-white">
                      Delete
                    </Text>
                  )}
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

export default DeleteAccountModal;
