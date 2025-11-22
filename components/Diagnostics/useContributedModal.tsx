import React, { useState, useMemo } from "react";
import ContributedModal from "./ContributedModal";

export default function useContributedModal(factors) {
  const [visible, setVisible] = useState(false);

  const modalData = useMemo(() => {
    const grouped: Record<string, any[]> = {};

    factors.forEach((f) => {
      if (!grouped[f.section]) grouped[f.section] = [];
      grouped[f.section].push(f);
    });

    return grouped;
  }, [factors]);

  const modal = (
    <ContributedModal
      visible={visible}
      onClose={() => setVisible(false)}
      data={modalData}
    />
  );

  return {
    openContributed: () => setVisible(true),
    closeContributed: () => setVisible(false),
    modal,
    visible,
  };
}