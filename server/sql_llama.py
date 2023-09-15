from langchain.utilities import SQLDatabase
from langchain.llms import LlamaCpp
from langchain_experimental.sql import SQLDatabaseChain

db = SQLDatabase.from_uri("sqlite:///db/data_KRA.sqlite")  # Updated database URL
llm = LlamaCpp(
        model_path='/Users/kuldeep/Project/KRA_LLM/server/models/llama-2-13b-chat.Q5_K_M.gguf',
        max_tokens=4096,
        temperature=0.9,
        top_p=1,
        verbose=False,
        n_batch=512,
        n_gpu_layers=40,
        f16_kv=True, 
        streaming=True,
    )

print(db)
db_chain = SQLDatabaseChain.from_llm(llm, db, verbose=True)
print(db_chain)
# db_chain.run("How many employees are there in employees table?")
# db_chain.run('select employee database and display all columns in the table')
