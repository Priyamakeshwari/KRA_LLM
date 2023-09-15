from langchain.llms import LlamaCpp
from langchain import PromptTemplate, LLMChain, ConversationChain
from langchain.callbacks.manager import CallbackManager
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.memory import ConversationBufferWindowMemory

MODEL_PATH = "./models/llama-2-13b-chat.Q5_K_M.gguf"

def create_prompt() -> PromptTemplate:
    DEFAULT_PROMPT = """
       <s>[IN <<SYS>>ST] You are a helpful, respectful and honest assistant. Always do...If you are unsure about an answer, truthfully say \" I don't know \" and remember the chat history {chat_history} <</SYS>> {human_input} [/INST]
    """
    prompt = PromptTemplate(
        input_variables=["chat_history","human_input"],
        template=DEFAULT_PROMPT,
    )
    return prompt

def load_model() -> LLMChain:
    callback_manager = CallbackManager([StreamingStdOutCallbackHandler()])
    memory = ConversationBufferWindowMemory(k=2, return_messages=True,memory_key="chat_history")
    llm_model = LlamaCpp(
        model_path=MODEL_PATH,
        max_tokens=4096,
        temperature=0.9,
        top_p=1,
        callback_manager=callback_manager,
        verbose=False,
        n_batch=512,
        n_gpu_layers=40,
        f16_kv=True, 
    )
    prompt = create_prompt()

    llm_chain = LLMChain(llm=llm_model,prompt=prompt,memory=memory,verbose=True)
    return llm_chain

if __name__ == '__main__':
    llm_chain = load_model()
    import sys
    for input_model in sys.stdin:
        llm_chain.run(input_model)


