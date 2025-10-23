import InsightsSection from "@/components/InsightsSection/InsightsSection";
import { RiskData } from "@/lib/types/health";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const MOCK_INSIGHTS: RiskData[] = [
  {
    id: "1",
    title: "Thrombosis Risk",
    level: "Medium",
    description: "Some factors may raise clotting risk.",
  },
  {
    id: "2",
    title: "Anemia Risk",
    level: "Low",
    description: "Iron levels appear sufficient.",
  },
];

const fetchRiskData = (): Promise<RiskData[]> => {
  // function promises that it will return, at some point, a RiskData array
  return new Promise(
    (
      resolve // each promise needs to be resolved, by a solver. resolve is that solver function. definition of the function is below; this is a description of the resolver rather than a definition. it just specifies what the function that will be called to resolve is named.
    ) => setTimeout(() => resolve(MOCK_INSIGHTS), 1500) // def of solver: resolve calls the setTimeout function, that calls the resolve function. the resolve function fufills the promise by returning the specified type of data, after 1500 ms go by
  );
};

const home = () => {
  useEffect(() => {}, []);
  const [data, setData] = useState<RiskData[]>(MOCK_INSIGHTS);
  return (
    <SafeAreaView>
      <InsightsSection insights={data}></InsightsSection>
    </SafeAreaView>
  );
};
export default home;
