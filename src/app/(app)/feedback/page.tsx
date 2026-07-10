"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function FeedbackPage() {
  const [context, setContext] = useState("");
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(false);

  // Load saved feedback when page opens
  useEffect(() => {
    getFeedback();
  }, []);

  const getFeedback = async () => {
    try {
      const res = await axios.get("/api/feedback");

      if (res.data.success) {
        setContext(res.data.feedbackContext || "");
        setInsight(res.data.feedbackInsights || "");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const saveFeedback = async () => {
    try {
      setLoading(true);

      const res = await axios.post("/api/feedback", {
        feedbackContext: context,
        feedbackInsights: insight,
      });

      if (res.data.success) {
        alert("Feedback Saved Successfully");
      }
    } catch (error) {
      console.error(error);
      alert("Unable to save feedback");
    } finally {
      setLoading(false);
    }
  };

  const generateInsights = () => {
    if (context.trim() === "") {
      alert("Please enter feedback context first.");
      return;
    }

    setInsight(
      `AI Summary

• Feedback Context:
${context}

• Recommendation:
Users should focus on giving constructive feedback based on this context.

• Overall Status:
Ready for anonymous feedback.`
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-5xl">

        <h1 className="mb-8 text-4xl font-bold">
          Feedback Dashboard
        </h1>

        {/* Context Card */}

        <div className="rounded-xl bg-white p-6 shadow">

          <h2 className="text-2xl font-semibold">
            Feedback Context
          </h2>

          <p className="mt-2 text-gray-500">
            Tell the AI what kind of feedback you want users to provide.
          </p>

          <textarea
            rows={6}
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Example: Please review my portfolio website and suggest UI improvements."
            className="mt-5 w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={saveFeedback}
            disabled={loading}
            className="mt-5 rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Context"}
          </button>

        </div>

        {/* AI Insight */}

        <div className="mt-8 rounded-xl bg-white p-6 shadow">

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

          <textarea
            rows={8}
            value={insight}
            onChange={(e) => setInsight(e.target.value)}
            placeholder="Generated insights will appear here..."
            className="mt-5 w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

        </div>

      </div>
    </div>
  );
}