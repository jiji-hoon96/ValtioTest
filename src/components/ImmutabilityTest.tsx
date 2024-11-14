import { useEffect, useState, type FC } from "react";
import { useTestStore } from "../store/testStore";

export const EnhancedImmutabilityTest: FC = () => {
  const {
    directObject,
    immerObject,
    directMutate,
    immerMutate,
    checkMutability,
    deepNestedMutate,
    checkDeepNestedMutation,
    testExternalMutation,
    asyncMutate,
    asyncObject,
    reset,
  } = useTestStore();

  const [testResults, setTestResults] = useState<
    Array<{ phase: string; results: string[] }>
  >([]);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (isRunning) {
      runTests();
    }
  }, [isRunning]);

  const runTests = async () => {
    setTestResults([]);

    // 1. 초기 상태 테스트
    addTestResults("Initial State", [
      "Initial Objects:",
      `Direct Object: ${JSON.stringify(directObject, null, 2)}`,
      `Immer Object: ${JSON.stringify(immerObject, null, 2)}`,
      "",
      "Reference Checks:",
      `Direct Reference Same: ${checkMutability().directReference}`,
      `Immer Reference Same: ${checkMutability().immerReference}`,
    ]);

    // 2. 기본 mutation 테스트
    directMutate();
    immerMutate();

    addTestResults("Basic Mutations", [
      "After Basic Mutations:",
      `Direct Mutation Success: ${checkMutability().mutationSuccess}`,
      `Immer Mutation Success: ${checkMutability().mutationSuccess}`,
    ]);

    // 3. 깊은 중첩 객체 테스트
    deepNestedMutate();

    addTestResults("Deep Nested Mutations", [
      "After Deep Nested Mutation:",
      `Deep Mutation Success: ${checkDeepNestedMutation()}`,
      `Deep Reference Changed: ${!checkMutability().immerReference}`,
    ]);

    // 4. 외부 참조 테스트
    const externalMutationResult = testExternalMutation();

    addTestResults("External Reference Test", [
      "External Reference Mutation Attempt:",
      `State Changed by External Mutation: ${externalMutationResult}`,
      "Note: If true, this indicates a potential issue with immutability!",
    ]);

    // 5. 비동기 테스트
    addTestResults("Async Mutation Test - Start", [
      `Initial Async Status: ${asyncObject.status}`,
      `Initial Async Value: ${asyncObject.value}`,
    ]);

    await asyncMutate();

    addTestResults("Async Mutation Test - Complete", [
      `Final Async Status: ${asyncObject.status}`,
      `Final Async Value: ${asyncObject.value}`,
    ]);

    setIsRunning(false);
  };

  const addTestResults = (phase: string, results: string[]) => {
    setTestResults((prev) => [...prev, { phase, results }]);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Enhanced Zustand Immer Immutability Test
      </h1>

      {testResults.map((test, index) => (
        <div key={index} className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{test.phase}</h2>
          <div className="font-mono bg-gray-100 p-4 rounded">
            {test.results.map((result, idx) => (
              <div key={idx} className="mb-1">
                {result}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex gap-4">
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          onClick={() => setIsRunning(true)}
          disabled={isRunning}
        >
          {isRunning ? "Running Tests..." : "Run All Tests"}
        </button>

        <button
          className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:bg-gray-400"
          onClick={() => {
            reset();
            setTestResults([]);
          }}
          disabled={isRunning}
        >
          Reset Tests
        </button>
      </div>
    </div>
  );
};
