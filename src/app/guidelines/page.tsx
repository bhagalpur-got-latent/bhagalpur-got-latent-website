"use client";

import { fira_sans } from "@/utils/fonts";

export default function Guidelines() {
  return (
    <div
      className={`${fira_sans.className} min-h-screen bg-gray-100 flex flex-col items-center p-6`}
    >
      {/* Page Heading */}
      <h1 className="text-3xl font-bold text-blue-600 mb-6">
        Guidelines & Participation Rules
      </h1>

      {/* Guidelines Section */}
      <div className="bg-white p-6 rounded-lg shadow-md max-w-lg text-center">
        <h2 className="text-xl font-semibold text-gray-800">
          Registration & Participation
        </h2>
        <p className="mt-4 text-gray-700 text-sm">
          📢 If you are <b>selected by the screening team</b>, you will be
          contacted via your registered contact sources.
        </p>
        <p className="mt-2 text-gray-700 text-sm">
          💰 For participation, <b>Rs.250 is mandatory</b> to be paid.
        </p>
      </div>

      {/* Grading Explanation */}
      <div className="bg-white p-6 rounded-lg shadow-md max-w-lg text-center mt-6">
        <h2 className="text-xl font-semibold text-gray-800">Self-Grading</h2>
        <p className="mt-4 text-gray-700 text-sm">
          🎭<b>Before your performance</b>, you will be asked to{" "}
          <b>grade yourself</b>.
        </p>
        <p className="mt-2 text-gray-700 text-sm">
          🔒 Your self-assigned <b>grade will be kept secret</b> from the
          judges.
        </p>
        <p className="mt-2 text-gray-700 text-sm">
          🏆<b>If the aggregate of judges' grades matches yours</b>, you will be
          awarded <b>cash collected from the audience entry fees</b>.
        </p>
        <p className="mt-2 text-gray-700 text-sm">
          🏅 If multiple contestants win,{" "}
          <b>the prize money will be divided </b>
          among them.
        </p>
      </div>

      {/* Score and Grade Table */}
      <div className="mt-8 w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">
          Score & Grade Table
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 shadow-lg">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="border border-gray-300 px-4 py-2">Sr. No</th>
                <th className="border border-gray-300 px-4 py-2">Score</th>
                <th className="border border-gray-300 px-4 py-2">Grade</th>
              </tr>
            </thead>
            <tbody>
              {[
                { sr: 1, score: "9-10", grade: "A+" },
                { sr: 2, score: "8-9", grade: "A" },
                { sr: 3, score: "7-8", grade: "B" },
                { sr: 4, score: "6-7", grade: "C" },
                { sr: 5, score: "5-6", grade: "D" },
              ].map((item, index) => (
                <tr
                  key={index}
                  className="text-center text-gray-800 bg-white even:bg-gray-100"
                >
                  <td className="border border-gray-300 px-4 py-2">
                    {item.sr}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.score}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.grade}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
