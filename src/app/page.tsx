"use client";
import { fira_sans, lobster_two } from "@/utils/fonts";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const getToRegisterPage = () => {
    router.push("/register");
  };

  const getToGuidelinesPage = () => {
    router.push("/guidelines");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 pt-2 bg-gradient-to-r from-yellow-200 to-yellow-500">
      {/* Title Text */}

      <Image
        src="/BhagalpurGotLatent.png" // Path to the image in your public folder
        alt="Bhagaplur Got Latent"
        width={500}
        height={500}
        className="rounded-3xl"
      />

      {/* Buttons */}
      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={getToRegisterPage}
          className={`${fira_sans.className} px-6 py-3 text-xl font-semibold text-white bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 transition duration-300`}
        >
          Register Now
        </button>

        <button
          onClick={getToGuidelinesPage}
          className={`${fira_sans.className} px-6 py-3 text-xl font-semibold text-white bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 transition duration-300`}
        >
          Guidelines
        </button>
      </div>
    </div>
  );
}
