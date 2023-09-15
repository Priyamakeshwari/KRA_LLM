import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { FcSpeaker } from "react-icons/fc";
import { HiMiniSpeakerWave, HiSpeakerWave } from "react-icons/hi2";

import { useSpeechSynthesis } from "react-speech-kit";
import CodeBlock from "./CodeBlock";

function splitTextWithCodeBlocks(text) {
  // Use a regular expression to split the text into paragraphs
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

function Chit() {
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

  const [text, setText] = useState("hey man ");

  const { speak } = useSpeechSynthesis();

  const handleOnClick = () => {
    speak({ text: text });
  };

  return (
    <div className="flex overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-grow">
        <div className="container mx-auto flex-grow">
          <div className="w-[90%] mx-auto border rounded shadow-lg bg-white flex-grow">
            <div>
              <div className="w-[90%]">
                <div className="relative p-6 overflow-y-auto h-[93vh] bg-gradient-to-b">
                  <ul className="space-y-6">
                    <li className="flex justify-end">
                      <div className="relative max-w-xl px-4 py-2 text-blue-800 bg-blue-100 rounded shadow flex flex-col">
                        <div className="flex items-center justify-between">
                          <img
                            className="w-12 h-12 rounded-full"
                            src="/user.avif"
                            alt=""
                          />
                        </div>

                        <span className="block">sql query</span>
                      </div>
                    </li>
                    <li className=" ">
                      <div className="relative max-w-3xl px-4 py-2 text-blue-800 rounded shadow bg-blue-100">
                        <div className="flex items-center justify-between">
                          <img
                            className="w-12 h-12 rounded-full"
                            src="/bot.jpg"
                            alt=""
                          />

                          <button
                            onClick={handleOnClick}
                            className="p-2 rounded-full flex p-2"
                          >
                            <h1 className="text-sm text-black italic underline">
                              Listen now
                            </h1>
                            <HiSpeakerWave className="ml-2" />
                          </button>
                        </div>

                        {splitTextWithCodeBlocks(exampleText)}
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="flex items-center justify-between w-full p-3 border-t border-gray-300 bg-gray-100">
                  <input
                    type="text"
                    placeholder="Message"
                    className="block w-full py-2 pl-4 mx-3 bg-gray-200 rounded-full outline-none focus:text-gray-800"
                    name="message"
                    required
                  />

                  <button type="submit">
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

export default Chit;
