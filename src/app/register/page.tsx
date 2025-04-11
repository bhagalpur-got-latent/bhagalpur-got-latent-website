"use client";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { fira_sans, lobster_two } from "@/utils/fonts";

export default function Home() {
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
  }>({
    name: "",
    email: "",
    phone: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    file?: string;
  }>({});
  const [message, setMessage] = useState<string>(""); // Message for displaying alerts
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null); // Success/failure state
  const router = useRouter();

  // Handle text input changes and remove errors dynamically
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Remove errors dynamically if the user corrects their input
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validateField(name, value), // Validate field individually
    }));
  };

  // Handle file selection and remove error if file is selected
  // Handle file selection and validate file size
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];

      // Check if file size is greater than 1MB
      if (selectedFile.size > 1024 * 1024) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          file: "File size must be under 1MB",
        }));
        setFile(null); // Reset file
      } else {
        setFile(selectedFile);
        setErrors((prevErrors) => ({ ...prevErrors, file: undefined })); // Remove file error if valid
      }
    }
  };

  // Validate individual fields
  const validateField = (name: string, value: string): string | undefined => {
    if (name === "name" && !value.trim()) return "Name is required";
    if (name === "email") {
      if (!value.trim()) return "Email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        return "Invalid email format";
    }
    if (name === "phone") {
      if (!value.trim()) return "Phone number is required";
      if (!/^\d+$/.test(value)) return "Only numbers are allowed";
      if (value.length !== 10) return "Phone number must be of 10 digits";
    }
    return undefined;
  };

  // Validate entire form before submission
  const validateForm = () => {
    let newErrors: typeof errors = {};
    newErrors.name = validateField("name", formData.name);
    newErrors.email = validateField("email", formData.email);
    newErrors.phone = validateField("phone", formData.phone);
    if (!file) newErrors.file = "Resume file is required";

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === undefined);
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    if (file) data.append("resume", file);

    try {
      setMessage("Please wait, registering...");
      setIsSuccess(null); // Reset state

      const res = await axios.post<{ resumeUrl: string }>("/api/upload", data);
      setMessage(`Resume uploaded successfully!`);
      setIsSuccess(true);
    } catch (error) {
      setMessage("Upload failed. Try again.");
      setIsSuccess(false);
    }
  };
  useEffect(() => {
    if (message === "Resume uploaded successfully!") {
      setTimeout(() => {
        router.push("/thank-you");
      }, 3000);
    }
  }, [message]);

  return (
    <div className={`${fira_sans.className} container mx-auto p-6 relative`}>
      <h1 className={`${lobster_two.className} text-3xl text-center mb-6`}>
        Register for Bhagalpur's Got Latent
      </h1>
      {/* Additional Info Section */}
      <div className="bg-white p-6 rounded-lg shadow-md max-w-lg text-center mt-8">
        <h2 className="text-xl font-semibold text-gray-800">Attension:</h2>
        <p className="mt-4 text-gray-700 text-sm">
          📝 <b>Resume should include information related to art form only.</b>
        </p>
        <h2 className="text-xl font-semibold text-gray-800">
          Contact details:
        </h2>
        <p className="mt-4 text-gray-700 text-sm">
          📧 <b>Gmail:</b> bhagalpurgotlatent2025@gmail.com
        </p>
        <p className="mt-2 text-gray-700 text-sm">
          📞 <b>Contact:</b> 9080058587
        </p>
      </div>
      <div className="flex justify-center">
        {message && (
          <div
            className={`flex items-center max-w-[25rem] py-4 px-2 mt-0 mb-4 top-2 text-sm border rounded-lg absolute ${
              isSuccess === null
                ? "text-blue-800 border-blue-300 bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:border-blue-800" // Info state (waiting)
                : isSuccess
                ? "text-green-800 border-green-300 bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800" // Success state
                : "text-red-800 border-red-300 bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800" // Error state
            }`}
            role="alert"
          >
            {/* Info Icon */}
            {isSuccess === null && (
              <svg
                viewBox="0 0 1024 1024"
                className="w-6 h-6 text-blue-500 mr-1"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
              >
                <path
                  d="M512 512m-448 0a448 448 0 1 0 896 0 448 448 0 1 0-896 0Z"
                  fill="#2196F3"
                ></path>
                <path
                  d="M469.333333 469.333333h85.333334v234.666667h-85.333334z"
                  fill="#FFFFFF"
                ></path>
                <path
                  d="M512 352m-53.333333 0a53.333333 53.333333 0 1 0 106.666666 0 53.333333 53.333333 0 1 0-106.666666 0Z"
                  fill="#FFFFFF"
                ></path>
              </svg>
            )}
            {/* Success Icon */}
            {isSuccess && (
              <svg
                className="w-6 h-6 text-green-500 mr-1"
                viewBox="0 0 1024 1024"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
              >
                <path
                  fill="currentColor"
                  d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm-55.808 536.384-99.52-99.584a38.4 38.4 0 1 0-54.336 54.336l126.72 126.72a38.272 38.272 0 0 0 54.336 0l262.4-262.464a38.4 38.4 0 1 0-54.272-54.336L456.192 600.384z"
                ></path>
              </svg>
            )}
            {/* Error Icon */}
            {isSuccess === false && (
              <svg
                className="w-6 h-6 text-red-500 mr-1"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                stroke="currentColor"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm-1.5-5.009c0-.867.659-1.491 1.491-1.491.85 0 1.509.624 1.509 1.491 0 .867-.659 1.509-1.509 1.509-.832 0-1.491-.642-1.491-1.509zM11.172 6a.5.5 0 0 0-.499.522l.306 7a.5.5 0 0 0 .5.478h1.043a.5.5 0 0 0 .5-.478l.305-7a.5.5 0 0 0-.5-.522h-1.655z"
                  fill="currentColor"
                ></path>
              </svg>
            )}
            <div>{message}</div>
          </div>
        )}
      </div>

      {/* Registration Form */}
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto space-y-6 bg-white p-8 rounded-lg shadow-md"
      >
        {/* Name Input */}
        <div className="space-y-2">
          <label
            className="block text-sm font-medium text-gray-900"
            htmlFor="name"
          >
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            className={`block w-full text-sm text-gray-900 border ${
              errors.name
                ? "border-red-500 focus:ring-blue-500 focus:border-0"
                : "border-gray-300 focus:ring-blue-500"
            } rounded-lg p-2 bg-gray-50 focus:ring-2  focus:outline-none`}
          />
          {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
        </div>

        {/* Email Input */}
        <div className="space-y-2">
          <label
            className="block text-sm font-medium text-gray-900"
            htmlFor="email"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className={`block w-full text-sm text-gray-900 border ${
              errors.email
                ? "border-red-500 focus:ring-blue-500 focus:border-0"
                : "border-gray-300 focus:ring-blue-500"
            } rounded-lg p-2 bg-gray-50 focus:ring-2  focus:outline-none`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email}</p>
          )}
        </div>

        {/* Phone Number Input */}
        <div className="space-y-2">
          <label
            className="block text-sm font-medium text-gray-900"
            htmlFor="phone"
          >
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            id="phone"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={handleChange}
            className={`block w-full text-sm text-gray-900 border ${
              errors.phone
                ? "border-red-500 focus:ring-blue-500 focus:border-0"
                : "border-gray-300 focus:ring-blue-500"
            } rounded-lg p-2 bg-gray-50 focus:ring-2  focus:outline-none`}
          />
          {errors.phone && (
            <p className="text-red-500 text-xs">{errors.phone}</p>
          )}
        </div>

        {/* File Upload */}
        <div className="space-y-2">
          <label
            className="block text-sm font-medium text-gray-900"
            htmlFor="upload_resume"
          >
            Upload Resume
          </label>
          <div className="flex justify-center">
            <input
              className="block w-full text-sm text-gray-900 border border-gray-300 focus:ring-blue-500 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
              onChange={handleFileChange}
              id="upload_resume"
              type="file"
              accept=".pdf,.doc,.docx"
            />
          </div>
          {errors.file && <p className="text-red-500 text-xs">{errors.file}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 "
        >
          Register
        </button>
      </form>
    </div>
  );
}
