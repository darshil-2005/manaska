import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateCodeFromInput } from  '../../src/utils/generateCodeFromInput'; 
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

// --- Mocks ---

// Mock the external LangChain dependencies
vi.mock('@langchain/google-genai', () => ({
  ChatGoogleGenerativeAI: vi.fn(),
}));

vi.mock('@langchain/core/prompts', () => ({
  PromptTemplate: {
    fromTemplate: vi.fn(),
  },
}));

vi.mock('@langchain/core/output_parsers', () => ({
  StringOutputParser: vi.fn(),
}));

describe('generateCodeFromInput', () => {
  // Variables to hold our mock functions for assertions
  let mockInvoke;
  let mockPipeToModel;
  let mockPipeToParser;
  let mockPromptInstance;

  beforeEach(() => {
    // Reset modules and environment variables
    vi.clearAllMocks();
    process.env.GOOGLE_API_KEY = 'test-api-key';

    // Setup the specific mock implementation for the chaining logic:
    // prompt.pipe(model).pipe(parser).invoke(...)
    
    mockInvoke = vi.fn();
    
    // The final chain object that has the .invoke method
    const mockChain = {
      invoke: mockInvoke,
    };

    // The intermediate runnable resulting from prompt.pipe(model)
    const mockIntermediateRunnable = {
      pipe: vi.fn().mockReturnValue(mockChain),
    };
    mockPipeToParser = mockIntermediateRunnable.pipe;

    // The initial prompt object resulting from PromptTemplate.fromTemplate
    mockPromptInstance = {
      pipe: vi.fn().mockReturnValue(mockIntermediateRunnable),
    };
    mockPipeToModel = mockPromptInstance.pipe;

    // Apply the mock to the PromptTemplate factory
    vi.mocked(PromptTemplate.fromTemplate).mockReturnValue(mockPromptInstance);
  });

  afterEach(() => {
    delete process.env.GOOGLE_API_KEY;
  });

  it('should successfully generate code from valid text input', async () => {
    // Arrange
    const userInput = 'Create a system design for a chat app';
    const expectedOutput = 'Node ChatApp {{ ... }}'; // Simplified mock output
    mockInvoke.mockResolvedValue(expectedOutput);

    // Act
    const result = await generateCodeFromInput(userInput);

    // Assert
    expect(result).toBe(expectedOutput);
    
    // Verify Chain Construction
    expect(PromptTemplate.fromTemplate).toHaveBeenCalled();
    expect(mockPipeToModel).toHaveBeenCalled(); // prompt.pipe(model) called
    expect(mockPipeToParser).toHaveBeenCalled(); // .pipe(parser) called
    
    // Verify Chain Invocation
    expect(mockInvoke).toHaveBeenCalledWith({ user_input: userInput });
  });

  it('should initialize ChatGoogleGenerativeAI with correct configuration', async () => {
    // Arrange
    mockInvoke.mockResolvedValue('success');

    // Act
    await generateCodeFromInput('test');

    // Assert
    expect(ChatGoogleGenerativeAI).toHaveBeenCalledWith({
      model: 'gemini-1.5-pro-latest',
      temperature: 0.1,
      apiKey: 'test-api-key',
    });
  });

  it('should handle empty string input', async () => {
    // Arrange
    const emptyInput = '';
    mockInvoke.mockResolvedValue('Node Empty {{ ... }}');

    // Act
    await generateCodeFromInput(emptyInput);

    // Assert
    expect(mockInvoke).toHaveBeenCalledWith({ user_input: '' });
  });

  it('should throw an error if the API call fails', async () => {
    // Arrange
    const errorMsg = 'Google API Error';
    mockInvoke.mockRejectedValue(new Error(errorMsg));

    // Act & Assert
    await expect(generateCodeFromInput('valid input'))
      .rejects
      .toThrow(errorMsg);
  });

  it('should handle undefined input by passing undefined to the chain', async () => {
    // Arrange
    // In LangChain, if a variable is missing in the input map, it might throw or pass undefined
    // depending on validation. Here we verify we pass exactly what we received.
    mockInvoke.mockResolvedValue('');

    // Act
    await generateCodeFromInput(undefined);

    // Assert
    expect(mockInvoke).toHaveBeenCalledWith({ user_input: undefined });
  });

  it('should instantiate StringOutputParser correctly', async () => {
    // Arrange
    mockInvoke.mockResolvedValue('success');

    // Act
    await generateCodeFromInput('test');

    // Assert
    expect(StringOutputParser).toHaveBeenCalled();
  });
});