"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const noMessages = [
  "Are you sure? 😢",
  "Really sure? 🥺",
  "Think again! 💔",
  "Don't break my heart 😭",
  "Last chance! 😳",
  "Please say yes ❤️",
];

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbw7u91dvtA_mhEKGadGbMrcZsWJfgZr2Fv06A2gTy5UETsv2KFusFohyVImQCGTiXid/exec";

export default function Home() {
  const [noCount, setNoCount] = useState(0);
  const [showLovePopup, setShowLovePopup] = useState(false);
  const [showReasonPopup, setShowReasonPopup] = useState(false);
  const [reason, setReason] = useState("");
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // 💖 YES CLICK
  const handleYes = async () => {
    const confetti = (await import("canvas-confetti")).default;

    setShowLovePopup(true);

    confetti({
      particleCount: 200,
      spread: 120,
      origin: { y: 0.6 },
    });

    await saveResponse("YES", "");
  };

  // 💔 NO CLICK
  const handleNo = () => {
    if (noCount < noMessages.length) {
      alert(noMessages[noCount]);
      setNoCount(noCount + 1);
    }

    setShowReasonPopup(true);
    moveButton();
  };

  // 🎯 Move NO button randomly
  const moveButton = () => {
    const x = Math.random() * 300 - 150;
    const y = Math.random() * 200 - 100;
    setNoPosition({ x, y });
  };

  // 📡 Save to Google Sheet
  const saveResponse = async (response: string, reasonText: string) => {
    try {
      await fetch(SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({
          name: "Her Name",
          response: response,
          reason: reasonText,
        }),
      });
    } catch (error) {
      console.error("Error saving:", error);
    }
  };

  // 💌 Submit Reason
  const submitReason = async () => {
    if (!reason.trim()) {
      alert("Please tell me the reason 😢");
      return;
    }

    try {
      setLoading(true);

      await saveResponse("NO", reason);

      // Delay for romantic effect
      setTimeout(() => {
        setLoading(false);
        setSubmitted(true);
      }, 1500);

      // Auto close popup
      setTimeout(() => {
        setShowReasonPopup(false);
        setSubmitted(false);
        setReason("");
      }, 3000);
    } catch (error) {
      console.error("Error saving:", error);
      setLoading(false);
    }
  };

  return (
    <main className="h-screen flex items-center justify-center bg-gradient-to-r from-pink-400 to-red-400 overflow-hidden relative">

      {/* 💕 Main Card */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-white p-10 rounded-3xl shadow-2xl text-center"
      >
        <h1 className="text-3xl font-bold text-pink-600 mb-6">
          Will You Be My Valentine? 💖
        </h1>

        <div className="flex gap-6 justify-center">
          {/* YES BUTTON */}
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleYes}
            className="bg-pink-500 text-white px-6 py-3 rounded-full text-lg shadow-lg"
          >
            Yes 💕
          </motion.button>

          {/* NO BUTTON */}
          <motion.button
            animate={{ x: noPosition.x, y: noPosition.y }}
            transition={{ type: "spring", stiffness: 300 }}
            onClick={handleNo}
            className="bg-gray-300 px-6 py-3 rounded-full text-lg shadow-lg"
          >
            No 😢
          </motion.button>
        </div>
      </motion.div>

      {/* 💖 YES POPUP */}
      {showLovePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="bg-white p-10 rounded-3xl text-center shadow-2xl"
          >
            <h1 className="text-3xl font-bold text-red-500 mb-4">
              YAYYY!!! 💕
            </h1>
            <p>You just made me the happiest person alive ❤️🥰</p>
          </motion.div>
        </div>
      )}

      {/* 💔 REASON POPUP */}
      {showReasonPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="bg-white p-8 rounded-3xl text-center shadow-2xl w-80"
          >
            <h2 className="text-xl mb-4 text-red-500 font-bold">
              Why are you saying no? 😢
            </h2>

            <textarea
              className="w-full border p-2 rounded-lg mb-4"
              rows={3}
              placeholder="Tell me the reason..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />

            <button
              onClick={submitReason}
              disabled={loading}
              className={`px-4 py-2 rounded-full text-white transition-all ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-400 hover:bg-red-500"
              }`}
            >
              {loading
                ? "Saving... 💔"
                : submitted
                ? "Saved 😢"
                : "Submit 💔"}
            </button>
          </motion.div>
        </div>
      )}
    </main>
  );
}