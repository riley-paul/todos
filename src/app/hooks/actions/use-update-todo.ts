import { useUpdateTodoMutation, type TodoFragment } from "@/app/gql.gen";

export default function useUpdateTodo(original: TodoFragment) {
  return useUpdateTodoMutation({
    optimisticResponse: (vars) => {
      const definedInputs = Object.fromEntries(
        Object.entries(vars.input).filter(
          ([_, value]) => value !== undefined && value !== null,
        ),
      );
      return {
        __typename: "Mutation",
        updateTodo: {
          __typename: "TodoObjectType",
          ...original,
          ...definedInputs,
        },
      };
    },
  });
}
