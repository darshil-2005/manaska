export const PromptTemplate = {
  fromTemplate: (template) => ({
    pipe: () => ({
      pipe: () => ({
        invoke: async () => "Mocked AI response"
      })
    })
  })
};