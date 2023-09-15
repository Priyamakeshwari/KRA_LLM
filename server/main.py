
from flask import Flask, request,jsonify, stream_with_context
from flask_socketio import SocketIO, send, emit
from auth.auth import register_user, generate_token, login_user
from engine import  load_model
import datetime
from langchain.text_splitter import RecursiveCharacterTextSplitter

app = Flask(__name__)
app.config['SECRET'] = "12345"

llm_chain = load_model()
print("Model loaded")

@app.route('/')
def index():
    return "<h1> Hello World </h1>"

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


@app.route("/api/chat",methods=['POST'])
def chat():
    """
    Endpoint to chat with the bot.
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
    response = llm_chain.run(chunks)
    return {
        "response": response,
    }





if __name__ == '__main__':

    app.run(host='0.0.0.0', port=5100, debug=True)

