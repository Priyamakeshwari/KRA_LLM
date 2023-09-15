import React, { useState } from "react";

function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false);

  const handleCopyClick = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500); // Reset copied state after 1.5 seconds
  };

  return (
    <div className="bg-gray-900 p-4 rounded-lg shadow-md my-2">
      <div className="flex justify-end">
        <button
          onClick={handleCopyClick}
          className={`mt-2 px-3 py-1 
         bg-green-600 text-white rounded-md ${copied ? "bg-green-500" : ""}`}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      <pre className="text-white overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default CodeBlock;
