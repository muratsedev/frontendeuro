"use client";
import React, { useState } from "react";
import { BACKEND_API_URL } from "../lib/config";
import {
  sanitizeInput,
  sanitizeEmail,
  sanitizePhoneNumber,
  sanitizeMessage,
  containsDangerousPatterns,
} from "../../utils/sanitize";

interface FormData {
  name: string;
  phone: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  subject?: string;
  message?: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [apiError, setApiError] = useState("");

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "الاسم مطلوب";
    } else if (formData.name.length < 2) {
      newErrors.name = "الاسم يجب أن يكون على الأقل 2 أحرف";
    } else if (containsDangerousPatterns(formData.name)) {
      newErrors.name = "الاسم يحتوي على أحرف غير آمنة";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "رقم الهاتف مطلوب";
    } else if (formData.phone.length < 8) {
      newErrors.phone = "رقم الهاتف غير صحيح";
    } else if (containsDangerousPatterns(formData.phone)) {
      newErrors.phone = "رقم الهاتف يحتوي على أحرف غير آمنة";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "الموضوع مطلوب";
    } else if (formData.subject.length < 3) {
      newErrors.subject = "الموضوع يجب أن يكون على الأقل 3 أحرف";
    } else if (containsDangerousPatterns(formData.subject)) {
      newErrors.subject = "الموضوع يحتوي على أحرف غير آمنة";
    }

    if (!formData.message.trim()) {
      newErrors.message = "الرسالة مطلوبة";
    } else if (formData.message.length < 10) {
      newErrors.message = "الرسالة يجب أن تكون على الأقل 10 أحرف";
    } else if (containsDangerousPatterns(formData.message)) {
      newErrors.message = "الرسالة تحتوي على أحرف غير آمنة";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Real-time sanitization preview
    let sanitized = value;
    if (name === "name") {
      sanitized = sanitizeInput(value);
    } else if (name === "phone") {
      sanitized = sanitizePhoneNumber(value);
    } else if (name === "subject") {
      sanitized = sanitizeInput(value);
    } else if (name === "message") {
      sanitized = sanitizeMessage(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: sanitized,
    }));

    // Clear error for this field on change
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Final sanitization before sending
      const sanitizedData = {
        contactUsName: sanitizeInput(formData.name),
        contactUsPhoneNumber: sanitizePhoneNumber(formData.phone),
        contactUsPhoneSubject: sanitizeInput(formData.subject),
        contactUsPhoneMessage: sanitizeMessage(formData.message),
      };

      const response = await fetch(
        `${BACKEND_API_URL}/api/ContactUs`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sanitizedData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setSuccess(true);
      setSuccessMessage(
        "شكراً لتواصلك معنا! سنرد عليك قريباً."
      );
      setFormData({ name: "", phone: "", subject: "", message: "" });

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (error) {
      console.error("Error submitting form:", error);
      setApiError(
        "حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة لاحقاً."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-primaryOther dark:text-primaryOther mb-4">
          تواصل معنا
        </h1>
        <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          مرحباً بك .. يمكنك ترك رسالتك و سيقوم أحد موظفينا بالرد عليك في أقرب فرصة ممكنة
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-8 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg max-w-4xl mx-auto">
          <p className="font-semibold">{successMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {apiError && (
        <div className="mb-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg max-w-4xl mx-auto">
          <p className="font-semibold">{apiError}</p>
        </div>
      )}

      {/* Main Content - Two Column Layout */}
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column - Illustration/Visual */}
          <div className="flex justify-center lg:justify-start order-2 lg:order-1">
            <div className="w-full max-w-md h-80 bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900/30 dark:to-green-900/30 rounded-lg flex items-center justify-center relative overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-8 right-12 w-16 h-16 bg-green-400 rounded-full opacity-80"></div>
              <div className="absolute top-16 left-8 w-12 h-12 bg-blue-400 rounded-full opacity-70"></div>
              <div className="absolute bottom-12 right-4 w-20 h-20 bg-yellow-300 rounded-full opacity-75"></div>
              <div className="absolute bottom-4 left-12 w-10 h-10 bg-green-300 rounded-full opacity-60"></div>
              
              {/* Center Text/Icon */}
              <div className="relative z-10 text-center px-6">
                <div className="text-6xl mb-4">💬</div>
                <p className="text-gray-700 dark:text-gray-300 font-semibold text-lg">
                  نحن هنا للاستماع إليك
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="order-1 lg:order-2">
            <form
              onSubmit={handleSubmit}
              className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 md:p-8"
            >
              {/* Name Field */}
              <div className="mb-6">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  الاسم
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="أدخل اسمك الكامل"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-all ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  maxLength={100}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Phone Field */}
              <div className="mb-6">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  رقم الموبايل
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="أدخل رقم هاتفك"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-all ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                  maxLength={20}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Subject Field */}
              <div className="mb-6">
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  الموضوع
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="موضوع الرسالة"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-all ${
                    errors.subject ? "border-red-500" : "border-gray-300"
                  }`}
                  maxLength={200}
                />
                {errors.subject && (
                  <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
                )}
              </div>

              {/* Message Field */}
              <div className="mb-8">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  الرسالة
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="اكتب رسالتك هنا..."
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 resize-none transition-all ${
                    errors.message ? "border-red-500" : "border-gray-300"
                  }`}
                  maxLength={2000}
                />
                <p className="text-gray-500 text-sm mt-1">
                  {formData.message.length}/2000
                </p>
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primaryOther hover:bg-opacity-90 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition-colors duration-200 text-lg"
              >
                {loading ? "جاري الإرسال..." : "أرسل"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="mt-12 max-w-4xl mx-auto p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-300 text-center">
          <strong>ملاحظة أمان:</strong> يتم حماية جميع البيانات التي تدخلها من خلال معالجة آمنة. لا نقبل أي محاولات للحقن أو البرامج الضارة.
        </p>
      </div>
    </div>
  );
}
