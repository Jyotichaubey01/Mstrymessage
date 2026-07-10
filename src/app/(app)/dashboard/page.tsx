"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Message {
  _id: string;
  content: string;
  createdAt?: string;
}

export default function DashboardPage() {
  const profileUrl = "http://localhost:3000/u/mm";

  const [acceptMessages, setAcceptMessages] = useState(true);
  const [context, setContext] = useState("");
  const [insight, setInsight] = useState("");

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);


  // Fetch API Messages
  const fetchMessages = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "/api/get-messages"
      );

      if (response.data.success) {
        setMessages(response.data.messages);
      } else {
        setMessages([]);
      }

    } catch (error) {
      console.log("Error fetching messages:", error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };


  // Load saved data + API data
  useEffect(() => {

    const savedToggle = localStorage.getItem(
      "acceptMessages"
    );

    if (savedToggle !== null) {
      setAcceptMessages(JSON.parse(savedToggle));
    }


    const savedContext =
      localStorage.getItem("feedbackContext");

    if (savedContext) {
      setContext(savedContext);
    }


    fetchMessages();

  }, []);



  // Save toggle
  useEffect(() => {
    localStorage.setItem(
      "acceptMessages",
      JSON.stringify(acceptMessages)
    );

  }, [acceptMessages]);



  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      alert("Profile link copied successfully.");

    } catch {
      alert("Unable to copy link.");
    }
  };



  const saveContext = () => {
    localStorage.setItem(
      "feedbackContext",
      context
    );

    alert("Context saved.");
  };



  const generateInsights = () => {

    if(messages.length === 0){
      setInsight(
        "No feedback messages available."
      );
      return;
    }


    let output = "";


    if(
      messages.some((m)=>
        m.content
        .toLowerCase()
        .includes("great")
      )
    ){
      output +=
      "✅ Users are giving positive feedback.\n";
    }



    if(
      messages.some((m)=>
        m.content
        .toLowerCase()
        .includes("improve")
      )
    ){
      output +=
      "💡 Users suggest improvements.\n";
    }



    output +=
    `📨 Total Messages: ${messages.length}`;


    setInsight(output);

  };




  return (

    <div className="container mx-auto max-w-5xl px-4 py-8">


      <h1 className="text-5xl font-bold mb-8">
        User Dashboard
      </h1>



      {/* Profile Link */}

      <div className="space-y-2">

        <label className="font-semibold">
          Copy Your Unique Link
        </label>


        <div className="flex gap-2">

          <input
            value={profileUrl}
            readOnly
            className="w-full border rounded-md p-2"
          />


          <button
            onClick={copyLink}
            className="bg-black text-white px-5 rounded-md"
          >
            Copy
          </button>


        </div>

      </div>





      {/* Toggle */}

      <div className="flex items-center gap-3 mt-6">

        <input
          type="checkbox"
          checked={acceptMessages}
          onChange={() =>
            setAcceptMessages(prev=>!prev)
          }
        />


        <span className="font-medium">
          Accept Messages :

          <span className="ml-2 text-blue-600">
            {acceptMessages ? "ON":"OFF"}
          </span>

        </span>


      </div>





      <hr className="my-8"/>





      {/* Context */}

      <div className="space-y-4">

        <h2 className="text-2xl font-semibold">
          AI Feedback Context
        </h2>


        <textarea
          rows={5}
          value={context}
          onChange={(e)=>
            setContext(e.target.value)
          }
          className="w-full border rounded-md p-3"
          placeholder="Example: Review my portfolio website"
        />


        <button
          onClick={saveContext}
          className="bg-black text-white px-5 py-2 rounded-md"
        >
          Save Context
        </button>


      </div>






      <hr className="my-8"/>






      {/* Insights */}

      <div className="flex justify-between items-center">


        <h2 className="text-2xl font-semibold">
          AI Feedback Insights
        </h2>


        <button
          onClick={generateInsights}
          className="border px-4 py-2 rounded-md"
        >
          Generate Insights
        </button>


      </div>





      {
        insight &&

        <div className="mt-5 border rounded-md p-4 bg-gray-50 whitespace-pre-line">

          {insight}

        </div>

      }







      <hr className="my-8"/>





      {/* Refresh */}

      <button
        onClick={fetchMessages}
        className="border rounded-md px-5 py-2"
      >
        🔄 Refresh Messages
      </button>







      {/* Messages */}


      <div className="grid gap-4 mt-6">


        {
          loading ?

          <p>
            Loading messages...
          </p>


          : messages.length === 0 ?

          <p>
            No feedback received yet.
          </p>


          :

          messages.map((message)=>(

            <div
              key={message._id}
              className="border rounded-lg p-5 shadow-sm"
            >

              <h3 className="font-bold text-lg">
                Anonymous
              </h3>


              <p className="mt-3">
                {message.content}
              </p>


            </div>

          ))

        }


      </div>



    </div>

  );
}