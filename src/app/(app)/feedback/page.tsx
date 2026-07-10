"use client";

import { useState } from "react";

export default function FeedbackDashboard() {
  const [context, setContext] = useState("");
  const [insight, setInsight] = useState("");

  const feedbacks = [
    {
      id: 1,
      name: "Anonymous",
      message: "Your portfolio looks amazing.",
    },
    {
      id: 2,
      name: "Anonymous",
      message: "Improve your UI spacing.",
    },
    {
      id: 3,
      name: "Anonymous",
      message: "Great work on the authentication.",
    },
  ];

  const saveContext = () => {
    alert("Context Saved Successfully!");
  };

  const generateInsights = () => {
    setInsight(`
Overall Feedback Summary

• Users like your portfolio.
• UI needs more spacing.
• Authentication is appreciated.
• Overall Sentiment: Positive ⭐⭐⭐⭐☆
    `);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-6xl">

        <h1 className="text-4xl font-bold mb-8">
          Feedback Dashboard
        </h1>

        <div className="grid gap-6 lg:grid-cols-3">

          {/* Left Section */}
          <div className="lg:col-span-2 space-y-6">

            <div className="rounded-xl bg-white p-6 shadow">
              <h2 className="text-2xl font-semibold">
                AI Feedback Context
              </h2>

              <p className="text-gray-500 mt-2">
                Tell AI what kind of feedback you want.
              </p>

              <textarea
                rows={6}
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Example: Review my portfolio website..."
                className="mt-4 w-full rounded-lg border p-3"
              />

              <button
                onClick={saveContext}
                className="mt-5 rounded-lg bg-black px-5 py-2 text-white hover:bg-gray-800"
              >
                Save Context
              </button>
            </div>

            <div className="rounded-xl bg-white p-6 shadow">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">
                  AI Feedback Insights
                </h2>

                <button
                  onClick={generateInsights}
                  className="rounded-lg border px-5 py-2 hover:bg-gray-100"
                >
                  Generate Insights
                </button>
              </div>

              <div className="mt-5 rounded-lg bg-gray-50 p-4 whitespace-pre-line border">
                {insight || "Click 'Generate Insights' to analyze feedback."}
              </div>
            </div>

          </div>

          {/* Right Section */}
          <div>

            <div className="rounded-xl bg-white p-6 shadow">

              <h2 className="text-2xl font-semibold mb-5">
                Recent Feedback
              </h2>

              <div className="space-y-4">

                {feedbacks.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg border p-4 hover:bg-gray-50"
                  >
                    <h3 className="font-semibold">
                      {item.name}
                    </h3>

                    <p className="mt-2 text-gray-600">
                      {item.message}
                    </p>
                  </div>
                ))}

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}