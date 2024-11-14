import { create } from "zustand";
import { produce } from "immer";

interface DeepObject {
  nested: {
    array: number[];
    object: {
      value: string;
      deepNested: {
        value: string;
        array: string[];
      };
    };
  };
  reference: {
    value: string;
  };
}

interface TestState {
  // 기본 테스트 객체들
  directObject: DeepObject;
  immerObject: DeepObject;

  // 외부 참조 테스트를 위한 객체
  externalReferenceObject: {
    value: string;
    array: number[];
  };

  // 비동기 테스트를 위한 객체
  asyncObject: {
    value: string;
    status: "idle" | "loading" | "success" | "error";
  };

  // 테스트 메서드들
  directMutate: () => void;
  immerMutate: () => void;

  // 외부 참조 테스트
  getExternalReference: () => { value: string; array: number[] };
  testExternalMutation: () => boolean;

  // 깊은 중첩 객체 테스트
  deepNestedMutate: () => void;
  checkDeepNestedMutation: () => boolean;

  // 비동기 테스트
  asyncMutate: () => Promise<void>;

  // 검증 메서드들
  checkMutability: () => {
    directReference: boolean;
    immerReference: boolean;
    mutationSuccess: boolean;
    deepMutationCheck: boolean;
  };

  reset: () => void;
}

const createInitialObject = (): DeepObject => ({
  nested: {
    array: [1, 2, 3],
    object: {
      value: "original",
      deepNested: {
        value: "deep-original",
        array: ["a", "b", "c"],
      },
    },
  },
  reference: {
    value: "reference-original",
  },
});

const initialObject = createInitialObject();

export const useTestStore = create<TestState>((set, get) => ({
  directObject: createInitialObject(),
  immerObject: createInitialObject(),
  externalReferenceObject: {
    value: "original",
    array: [1, 2, 3],
  },
  asyncObject: {
    value: "initial",
    status: "idle",
  },

  directMutate: () => {
    const currentState = get();
    const newDirectObject = {
      ...currentState.directObject,
      nested: {
        array: [...currentState.directObject.nested.array, 4],
        object: {
          ...currentState.directObject.nested.object,
          value: "mutated",
        },
      },
    };
    set({ directObject: newDirectObject });
  },

  immerMutate: () => {
    set(
      produce((state: TestState) => {
        state.immerObject.nested.array.push(4);
        state.immerObject.nested.object.value = "mutated";
      })
    );
  },

  getExternalReference: () => {
    return get().externalReferenceObject;
  },

  testExternalMutation: () => {
    const externalRef = get().getExternalReference();
    const originalValue = get().externalReferenceObject.value;

    // 외부 참조를 통한 직접 수정 시도
    externalRef.value = "mutated externally";
    externalRef.array.push(4);

    // 변경이 실제로 상태에 영향을 미쳤는지 확인
    const currentState = get().externalReferenceObject;
    return (
      currentState.value !== originalValue || currentState.array.length !== 3
    );
  },

  deepNestedMutate: () => {
    set(
      produce((state: TestState) => {
        state.immerObject.nested.object.deepNested.array.push("d");
        state.immerObject.nested.object.deepNested.value = "deep-mutated";
      })
    );
  },

  checkDeepNestedMutation: () => {
    const state = get();
    return (
      state.immerObject.nested.object.deepNested.value === "deep-mutated" &&
      state.immerObject.nested.object.deepNested.array.includes("d")
    );
  },

  asyncMutate: async () => {
    set(
      produce((state: TestState) => {
        state.asyncObject.status = "loading";
      })
    );

    // 비동기 작업 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 1000));

    set(
      produce((state: TestState) => {
        state.asyncObject.status = "success";
        state.asyncObject.value = "async-mutated";
      })
    );
  },

  checkMutability: () => {
    const state = get();
    return {
      directReference: state.directObject === initialObject,
      immerReference: state.immerObject === initialObject,
      mutationSuccess:
        state.directObject.nested.array.length === 4 ||
        state.immerObject.nested.array.length === 4,
      deepMutationCheck:
        state.immerObject.nested.object.deepNested.array.length > 3,
    };
  },

  reset: () => {
    set({
      directObject: createInitialObject(),
      immerObject: createInitialObject(),
      externalReferenceObject: {
        value: "original",
        array: [1, 2, 3],
      },
      asyncObject: {
        value: "initial",
        status: "idle",
      },
    });
  },
}));
