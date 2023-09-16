import React, { useEffect, useLayoutEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { FcSpeaker } from "react-icons/fc";
import { HiMiniSpeakerWave, HiSpeakerWave } from "react-icons/hi2";
import { AiFillFilePdf } from 'react-icons/ai'
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
      result.push(<p className="text-slate-900 text-lg mt-2" key={index}>{paragraph}</p>);
    }
  });

  return result;
}

function Chat() {


  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [pdfBase64, setPdfBase64] = useState('');
  const [imageBase64, setImageBase64] = useState('')

  const [text, setText] = useState("hello world");

  const { speak } = useSpeechSynthesis();

  const messagesEnd = React.useRef(null);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSpeakText = () => {
    speak({ text: text });
  };

  const sendMessageToAPI = async (message) => {
    var apiRoute = '/api/chat';
    if (message.includes("report") || message.includes("generate")) {
      apiRoute = "/api/report"; // Use the report generation API route
    }
    try {
      const response = await fetch(apiRoute, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_input: message }),
      });

      if (response.ok) {
        const data = await response.json();

        console.log(data);
        if (data.file) {
          setPdfBase64(data.file);
          console.log('got file')
        }
        if (data.image) {
          setImageBase64(data.image)
        }

        if (data.response) return data.response;
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

  const handleDownloadPdf = () => {
    if (pdfBase64) {
      const pdfBlob = new Blob([atob(pdfBase64)], { type: "application/pdf" });
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Create a temporary anchor element to trigger the download
      const a = document.createElement("a");
      a.href = pdfUrl;
      a.download = "report.pdf"; // Set the desired download filename
      a.click();

      // Revoke the URL to free up resources
      URL.revokeObjectURL(pdfUrl);
      setPdfBase64('')
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
                        className={`${message.isUserMessage
                          ? "flex justify-end"
                          : "flex justify-start"
                          } my-0`}
                      >
                        <div
                          className={`relative max-w-xl px-4 py-2 text-blue-700 bg-blue-100 rounded shadow ${message.isUserMessage ? "flex flex-col" : ""
                            }`}
                        >
                          <div className="flex items-center justify-between">
                            {message.isUserMessage ? (
                              <>
                                <img
                                  className="w-12 h-12 rounded-full"
                                  src="/user.avif"
                                  alt=""
                                />
                                <h2 className="text-md mx-2 font-semibold text-black italic"> You</h2>
                              </>
                            ) : (
                              <>
                                <img
                                  className="w-12 h-12 rounded-full"
                                  src="/bot.jpg"
                                  alt=""
                                />
                                <h2 className="text-md mx-2 font-semibold text-black italic"> Bot</h2>

                                <div>
                                  <button
                                    onClick={handleSpeakText}
                                    className="p-2 rounded-full flex "
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
                    {
                      pdfBase64 && (
                        <div
                          className={`relative max-w-max px-4 py-2 text-blue-700 bg-blue-100 rounded shadow
                        }`}
                        >
                          {
                            pdfBase64 && (
                              <div className="flex justify-start">
                                <AiFillFilePdf className="w-8 h-8 rounded-full text-green-500" />
                                <button
                                  onClick={handleDownloadPdf}
                                  className="item-center ml-2 justify-center italic text-blue-500 underline"
                                >
                                  Download Report
                                </button>
                              </div>
                            )
                          }
                        </div>
                      )
                    }
                    {
                      imageBase64 && (
                        <div
                          className={`relative max-w-max px-4 py-2 text-blue-700 bg-blue-100 rounded shadow
                        }`}
                        >
                          {
                            imageBase64 && (
                              <div className="flex justify-start">
                                <img
                                  src={`data:image/png;base64,${imageBase64}`}
                                  alt="User Image"
                                  className="w-64 h-64 rounded-full text-green-500"
                                />
                              </div>
                            )
                          }
                        </div>
                      )
                    }
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
