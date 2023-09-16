
# Import libraries
from flask import Flask, request,jsonify, stream_with_context, send_from_directory
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from auth.auth import register_user, generate_token, login_user
from engine import  load_model, query_db
import datetime
from langchain.text_splitter import RecursiveCharacterTextSplitter
import base64

# Create a Flask application
app = Flask(__name__)
app.config['SECRET'] = "12345"

# Load the LLMChain model
llm_chain = load_model()
print("Model loaded")

# Testing route to home
@app.route('/')
def index():
    return "<h1> Hello World </h1>"

# Route to register a new user
@app.route('/api/signup', methods=['POST'])
def register():
    """
    Endpoint to register a new user.

    Required JSON data in the request body:
    {
        "email": "user@example.com",
        "username": "username",
        "password": "password"
    }

    Returns:
    - If registration is successful, returns HTTP 200 with a JSON response containing a success message and a JWT token.
    - If registration fails, returns HTTP 401 with a JSON response containing an error message.
    """
    data = request.get_json()
    email = data.get("email")
    username = data.get("username")
    password = data.get("password")
    authenticated = register_user(email, username, password)
    if authenticated[0] == 200:
        token = generate_token(email, authenticated[1])  
        response = jsonify({'message': 'Registered successfully!', 'token': token})
        response.set_cookie('access_token', token, httponly=True, secure=True, samesite='Lax')
        return response
    else:
        return jsonify({'message': 'Registration failed!'}), 401
    
# Route to log in a user
@app.route('/api/login', methods=['POST'])
def login():
    """
    Endpoint to login a user.

    Required JSON data in the request body:
    {
        "email": "user@example.com",
        "password": "password"
    }

    Returns:
    - If login is successful, returns HTTP 200 with a JSON response containing a success message and a JWT token.
    - If login fails, returns HTTP 401 with a JSON response containing an error message.
    """
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    authenticated = login_user(email, password)
    if authenticated[0] == 200:
        token = generate_token(email, authenticated[1])  
        response = jsonify({'message': 'Login successful!', 'token': token, 'user_id':authenticated[1]})
        response.set_cookie('access_token', token, httponly=True, secure=True, samesite='Lax')
        return response


# Route to chat with LLAMA-CPP
@app.route("/api/chat",methods=['POST'])
def chat():
    """
    Endpoint to chat with LLAMA-CPP and generate responses.

    Request JSON data:
    {
        "user_input": "User's input text here"
    }

    Response JSON data:
    {
        "response": "Generated chatbot response"
    }
    """
    global llm_chain
    user_input = request.get_json()['user_input']
    print(user_input)
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=4096,
        chunk_overlap=256, 
        length_function=len,
    )
    chunks = text_splitter.split_text(user_input)
    print(chunks)
    response = llm_chain.run(user_input)
    return {
        "response": response
    }

# Route to access db and analyse the db
@app.route("/api/report",methods=['POST'])
def make_report():
    """
    Endpoint to generate reports and analyze the database.

    Request JSON data:
    {
        "user_input": "User's input text here"
    }

    Response JSON data:
    If a report is generated:
    {
        "response": "Database analysis result",
        "file": "Base64-encoded PDF report"
    }
    If no report is generated:
    {
        "response": "Database analysis result"
    }
    """
    user_input = request.get_json()['user_input']
    print(user_input)
    db_response = query_db(user_input)
    sendFile = False
    if "report" in user_input.lower():
        c = canvas.Canvas('report.pdf', pagesize=letter)
        width, height = letter
        c.drawString(50, height - 50,db_response)  # Adjust the coordinates as needed
        c.save()
        sendFile = True
    
    if sendFile:
        with open('report.pdf', 'rb') as f:
            data = f.read()
            data_base64 = base64.b64encode(data).decode('utf-8')
        return {
            "response": db_response,
            "file": data_base64
        }
    else:
        return {
            "response": db_response
        }

# Start the Flask application
if __name__ == '__main__':
    app.run(port=5000, debug=True)

