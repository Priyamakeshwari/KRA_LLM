from langchain.llms import LlamaCpp
from langchain import PromptTemplate, LLMChain
from langchain.callbacks.manager import CallbackManager
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
from langchain.text_splitter import RecursiveCharacterTextSplitter

<<<<<<< HEAD
=======
MODEL_PATH = "./models/llama-2-13b-chat.Q5_K_M.gguf"
 
>>>>>>> d4302be (update)

MODEL_PATH = "./models/llama-2-13b-chat.Q5_K_M.gguf"

def create_prompt() -> PromptTemplate:
    DEFAULT_PROMPT = """
        <s>[IN <<SYS>>ST] You are a helpful, respectful and honest assistant. Always do...If you are unsure about an answer, truthfully say \" I don't know \" <</SYS>> {user_input} [/INST]
    """
    prompt = PromptTemplate(
        input_variables=["user_input"],
        template=DEFAULT_PROMPT,
    )
    return prompt

def load_model() -> LLMChain:
    callback_manager = CallbackManager([StreamingStdOutCallbackHandler()])

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

    llm_chain = LLMChain(llm=llm_model,prompt=prompt)
    return llm_chain

<<<<<<< HEAD
=======
if __name__ == "__main__":
    llm_chain = load_model()
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=4096,
        chunk_overlap=256, 
        length_function=len,
    )
    chunks = text_splitter.split_text("hello")
    print(chunks)
    response = llm_chain.run(chunks)


    print(llm_chain([HumanMessage(content="Tell me a joke")])['text'])
>>>>>>> d4302be (update)
