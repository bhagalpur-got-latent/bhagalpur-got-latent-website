"use client";
import { fira_sans } from "@/utils/fonts";
import { useRouter } from "next/navigation";

const ThankYou = () => {
  // Use useRouter directly inside the component
  const router = useRouter();

  // Function to navigate to the homepage
  const getToHomepage = () => {
    router.push("/"); // Navigate to the homepage
  };

  return (
    <div
      className={`${fira_sans.className} min-h-screen flex items-center justify-center bg-gray-100`}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full text-center">
        {/* Thank You Message */}
        <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg mb-6">
          <h1 className="text-3xl font-semibold text-green-600">
            Thank You for Registering!
          </h1>
          <p className="mt-4 text-lg text-gray-700">
            Your application for <strong>Bhagalpur's Got Latent</strong> has
            been received. We will contact you real soon.
          </p>
        </div>

        {/* Return to Homepage Button */}
        <div className="mt-4">
          <button
            onClick={getToHomepage}
            className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
