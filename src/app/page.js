"use client";

import { useState } from "react";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setOutput(null); // Reset output

    try {
      const response = await fetch("/api/identify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });

      const data = await response.json();
      console.log("Response Data:", data); // Debugging response

      if (data && data.algorithm && data.details) {
        setOutput({
          algorithm: data.algorithm,
          details: data.details,
        });
      } else {
        setOutput({ error: "No algorithm identified." });
      }
    } catch (error) {
      console.error("Error: ", error);
      setOutput({ error: "Error identifying the algorithm." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-12 bg-gray-900 text-white space-y-16">
      
      {/* Title */}
      <h1 className="text-6xl font-extrabold text-center">Encryption Identifier</h1>

      {/* Input Form */}
      <div className="w-full max-w-4xl">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
          <textarea
            className="w-full p-6 rounded-lg bg-gray-800 resize-none h-40 focus:outline-none text-2xl"
            placeholder="Enter hash..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 font-bold py-4 text-2xl rounded-lg"
            disabled={loading}
          >
            {loading ? "Identifying..." : "Identify Algorithm"}
          </button>
        </form>
      </div>

      {/* Output Section */}
      {output && (
        <div className="w-full max-w-5xl bg-gray-800 p-10 rounded-xl space-y-8">
          {output.error ? (
            <p className="text-red-400 text-3xl">{output.error}</p>
          ) : (
            <div className="text-2xl leading-relaxed">
              
              {/* Algorithm Name */}
              <h2 className="text-5xl font-bold text-blue-400 text-center">{output.algorithm}</h2>
              
              {/* Report Sections */}
              <div className="mt-8 space-y-6">
                <div>
                  <h3 className="text-3xl font-semibold text-yellow-300">Description</h3>
                  <p className="text-xl">{output.details.Description}</p>
                </div>
                
                <div>
                  <h3 className="text-3xl font-semibold text-yellow-300">Security Level</h3>
                  <p className="text-xl">{output.details["Security Level"]}</p>
                </div>

                <div>
                  <h3 className="text-3xl font-semibold text-yellow-300">Algorithm Type</h3>
                  <p className="text-xl">{output.details["Algorithm Type"]}</p>
                </div>

                <div>
                  <h3 className="text-3xl font-semibold text-yellow-300">Hash Length</h3>
                  <p className="text-xl">{output.details["Hash Length"]}</p>
                </div>

                <div>
                  <h3 className="text-3xl font-semibold text-yellow-300">Common Use Cases</h3>
                  <p className="text-xl">{output.details["Common Use Cases"]}</p>
                </div>

                <div>
                  <h3 className="text-3xl font-semibold text-yellow-300">Crackability</h3>
                  <p className="text-xl">{output.details.Crackability}</p>
                </div>

                <div>
                  <h3 className="text-3xl font-semibold text-yellow-300">Next Steps</h3>
                  <p className="text-xl">{output.details["Possible Next Steps"]}</p>
                </div>
              </div>

            </div>
          )}
        </div>
      )}

    </div>
  );
}
