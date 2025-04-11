"use client";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { fira_sans, lobster_two } from "@/utils/fonts";

export default function Home() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<
    Partial<typeof formData> & { file?: string }
  >({});
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    if (selectedFile.size > 1024 * 1024) {
      setErrors((prev) => ({ ...prev, file: "File size must be under 1MB" }));
      setFile(null);
    } else {
      setFile(selectedFile);
      setErrors((prev) => ({ ...prev, file: undefined }));
    }
  };

  const validateField = (name: string, value: string): string | undefined => {
    if (!value.trim())
      return `${name[0].toUpperCase() + name.slice(1)} is required`;
    if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      return "Invalid email format";
    if (name === "phone") {
      if (!/^\d{10}$/.test(value)) return "Phone number must be 10 digits";
    }
    return undefined;
  };

  const validateForm = () => {
    const newErrors = {
      name: validateField("name", formData.name),
      email: validateField("email", formData.email),
      phone: validateField("phone", formData.phone),
      file: file ? undefined : "Resume file is required",
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((err) => !err);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data = new FormData();
    Object.entries(formData).forEach(([key, val]) => data.append(key, val));
    if (file) data.append("resume", file);

    try {
      setMessage("Please wait, registering...");
      setIsSuccess(null);
      await axios.post("/api/upload", data);
      setMessage("Resume uploaded successfully!");
      setIsSuccess(true);
    } catch {
      setMessage("Upload failed. Try again.");
      setIsSuccess(false);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      const timeout = setTimeout(() => router.push("/thank-you"), 3000);
      return () => clearTimeout(timeout);
    }
  }, [isSuccess, router]);

  return (
    <div className={`${fira_sans.className} container mx-auto px-4 py-10`}>
      <h1 className={`${lobster_two.className} text-4xl text-center mb-6`}>
        Register for Bhagalpur's Got Latent
      </h1>

      <div className="bg-white p-6 rounded-xl shadow-md max-w-2xl mx-auto mb-8 text-center">
        <h2 className="text-xl font-semibold text-gray-800">Attention:</h2>
        <p className="mt-2 text-sm text-gray-700">
          📝 <b>Resume should include information related to art form only.</b>
        </p>
        <h2 className="text-xl font-semibold text-gray-800 mt-4">
          Contact details:
        </h2>
        <p className="text-sm text-gray-700 mt-2">
          📧 <b>Email:</b> bhagalpurgotlatent2025@gmail.com
        </p>
        <p className="text-sm text-gray-700 mt-1">
          📞 <b>Phone:</b> 9080058587
        </p>
      </div>

      {message && (
        <div
          className={`mx-auto max-w-md mb-6 text-sm p-4 rounded-lg shadow-md text-center font-medium transition-colors duration-300 
            ${
              isSuccess === null
                ? "bg-blue-100 text-blue-800"
                : isSuccess
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
        >
          {message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md space-y-5"
      >
        {(["name", "email", "phone"] as const).map((field) => (
          <div key={field} className="space-y-1">
            <label
              htmlFor={field}
              className="block text-sm font-medium text-gray-700"
            >
              {field[0].toUpperCase() + field.slice(1)}
            </label>
            <input
              type={
                field === "email" ? "email" : field === "phone" ? "tel" : "text"
              }
              name={field}
              id={field}
              value={formData[field]}
              onChange={handleChange}
              placeholder={`Enter your ${field}`}
              className={`block w-full rounded-lg border px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2
                ${
                  errors[field]
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
            />
            {errors[field] && (
              <p className="text-xs text-red-500">{errors[field]}</p>
            )}
          </div>
        ))}

        <div className="space-y-1">
          <label
            htmlFor="resume"
            className="block text-sm font-medium text-gray-700"
          >
            Upload Resume
          </label>
          <input
            type="file"
            id="resume"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
          />
          {errors.file && <p className="text-xs text-red-500">{errors.file}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
