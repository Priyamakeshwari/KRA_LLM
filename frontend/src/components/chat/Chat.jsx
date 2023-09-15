import React, { useEffect, useLayoutEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { FcSpeaker } from "react-icons/fc";
import { HiMiniSpeakerWave, HiSpeakerWave } from "react-icons/hi2";

import { useSpeechSynthesis } from "react-speech-kit";
import CodeBlock from "./CodeBlock";

function renderTextWithCodeBlocks(text) {
  const paragraphs = text.split(/\n\n/);

  // Initialize an array to hold paragraphs and code blocks
  const result = [];

  // Regular expression to identify SQL code blocks
  const sqlRegex = /sql(.*?);/s;

  paragraphs.forEach((paragraph, index) => {
    // Check if the paragraph matches the SQL regex
    const match = paragraph.match(sqlRegex);
    if (match) {
      // If it's a code block, add it as a CodeBlock component
      const code = match[1].trim();
      result.push(<CodeBlock key={index} code={code} />);
    } else {
      // If it's regular text, add it as a paragraph
      result.push(<p key={index}>{paragraph}</p>);
    }
  });

  return result;
}

function Chat() {
  const exampleText = `

   This is the normal text 

  sql SELECT * FROM customers
  WHERE Income > (
    SELECT AVG(Income)
    FROM customers
  );

  This query uses a subquery to find the average income of all customers.

  sql SELECT Name, Age FROM customers WHERE Age > 30;
  Another SQL query to retrieve names and ages of customers above 30.

    
  `;

  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState("");

  const [text, setText] = useState("hello world");

  const { speak } = useSpeechSynthesis();

  const messagesEnd = React.useRef(null);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  },[chatMessages]);

  const handleSpeakText = () => {
    speak({ text: text });
  };

  const sendMessageToAPI = async (message) => {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_input: message }) ,
      });

      if (response.ok) {
        const data = await response.json();

        console.log(data);

        return data.response;
      } else {
        throw new Error("API request failed");
      }
    } catch (error) {
      console.error("Error sending message to API:", error);
      return "An error occurred while processing your request.";
    }
  };

  const handleUserMessageSubmit = async () => {
    if (userInput.trim() === "") {
      return;
    }
  
    // Update chatMessages using prevState pattern
    setChatMessages((prevState) => [
      ...prevState,
      { text: userInput, isUserMessage: true },
    ]);
  
    try {
      // Send the user's message to the API and get the chatbot's response
      const chatbotResponse = await sendMessageToAPI(userInput);
  
      // Update chatMessages with the chatbot's response
      setChatMessages((prevState) => [
        ...prevState,
        { text: chatbotResponse, isUserMessage: false },
      ]);

      setText(chatbotResponse);
  
      // Clear the input field
      setUserInput("");
    } catch (error) {
      // Handle any errors that occur during the API request
      console.error("Error sending message to API:", error);
      // You can update the state or show an error message to the user here
    }
    setUserInput();
  };
  
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleUserMessageSubmit();
      setUserInput("");
    }

  };

  return (
    <div className="flex  overflow-hidden  ">
      <Sidebar />

      <div className="flex flex-col flex-grow ">
        <div className="container mx-auto flex-grow">
          <div className="w-[90%] mx-auto border rounded shadow-lg bg-white flex-grow">
            <div>
              <div className="w-[90%">
                <div className="relative p-6 overflow-y-auto h-[93vh] bg-gradient-to-b">
                  <ul className="space-y-6">
                    {chatMessages.map((message, index) => (
                      <li
                        key={index}
                        className={`${
                          message.isUserMessage
                            ? "flex justify-end"
                            : "flex justify-start"
                        } my-0`}
                      >
                        <div
                          className={`relative max-w-xl px-4 py-2 text-blue-800 bg-blue-100 rounded shadow ${
                            message.isUserMessage ? "flex flex-col" : ""
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            {message.isUserMessage ? (
                              <img
                                className="w-12 h-12 rounded-full"
                                src="/user.avif"
                                alt=""
                              />
                            ) : (
                              <>
                              <img
                                className="w-12 h-12 rounded-full"
                                src="/bot.jpg"
                                alt=""
                              />

<div>
                            <button
                            onClick={handleSpeakText}
                            className="p-2 rounded-full flex p-2"
                          >
                            <h1 className="text-sm text-black italic underline">
                              Listen now
                            </h1>
                            <HiSpeakerWave className="ml-2" />
                          </button>
                            </div>
                              </>
                              
                            )}

                            

                            
                          </div>

                          {renderTextWithCodeBlocks(message.text)}

                        </div>
                      </li>
                    ))}
                    <div ref={messagesEnd}></div>
                  </ul>
                </div>

                <div className="flex items-center justify-between w-full p-3 border-t border-gray-300 bg-gray-100">
                  <input
                    type="text"
                    placeholder="Message"
                    className="block w-full py-2 pl-4 mx-3 bg-gray-200 rounded-full outline-none focus:text-gray-800"
                    name="message"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    required
                  />

<button type="submit" onClick={() => { handleUserMessageSubmit(); setUserInput(""); }}>
                    <svg
                      className="w-5 h-5 text-green-500 origin-center transform rotate-90"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
