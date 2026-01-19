"use client";
import React, { useState, useEffect } from "react";
import { BACKEND_API_URL } from "../lib/config";
import {
  sanitizeInput,
  sanitizePhoneNumber,
  sanitizeMessage,
  containsDangerousPatterns,
} from "../../utils/sanitize";

interface FormData {
  name: string;
  phoneNumber: string;
  notes: string;
  durationId: number;
}

interface FormErrors {
  name?: string;
  phoneNumber?: string;
  notes?: string;
  durationId?: string;
}

interface Duration {
  advertiseWithUsDurationId: number;
  advertiseWithUsDurationName: string;
}

export default function AdvertisePage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phoneNumber: "",
    notes: "",
    durationId: 0,
  });

  const [durations, setDurations] = useState<Duration[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [apiError, setApiError] = useState("");
  const [durationLoading, setDurationLoading] = useState(true);

  // Fetch durations on component mount
  useEffect(() => {
    const fetchDurations = async () => {
      try {
        const response = await fetch(
          `${BACKEND_API_URL}/api/AdvertiseWithUsDurations`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch durations");
        }
        const data = await response.json();
        console.log('Raw duration data from API:', data);
        console.log('Duration name samples:', data?.map((d: Duration) => ({
          id: d.advertiseWithUsDurationId,
          name: d.advertiseWithUsDurationName,
          nameLength: d.advertiseWithUsDurationName?.length,
          nameCharCodes: d.advertiseWithUsDurationName?.split('').map(c => c.charCodeAt(0))
        })));
        setDurations(data || []);
      } catch (error) {
        console.error("Error fetching durations:", error);
        setDurations([]);
      } finally {
        setDurationLoading(false);
      }
    };

    fetchDurations();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "اسم الشركة/الجهة مطلوب";
    } else if (formData.name.length < 2) {
      newErrors.name = "الاسم يجب أن يكون على الأقل 2 أحرف";
    } else if (containsDangerousPatterns(formData.name)) {
      newErrors.name = "الاسم يحتوي على أحرف غير آمنة";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "رقم الهاتف مطلوب";
    } else if (formData.phoneNumber.length < 8) {
      newErrors.phoneNumber = "رقم الهاتف غير صحيح";
    } else if (containsDangerousPatterns(formData.phoneNumber)) {
      newErrors.phoneNumber = "رقم الهاتف يحتوي على أحرف غير آمنة";
    }

    if (formData.notes && containsDangerousPatterns(formData.notes)) {
      newErrors.notes = "الملاحظات تحتوي على أحرف غير آمنة";
    }

    if (!formData.durationId || formData.durationId === 0) {
      newErrors.durationId = "اختر مدة الإعلان";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Real-time sanitization
    let sanitized = value;
    if (name === "name") {
      sanitized = sanitizeInput(value);
    } else if (name === "phoneNumber") {
      sanitized = sanitizePhoneNumber(value);
    } else if (name === "notes") {
      sanitized = sanitizeMessage(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "durationId" ? (value ? parseInt(value) : 0) : sanitized,
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
        advertiseWithUsName: sanitizeInput(formData.name),
        advertiseWithUsPhoneNumber: sanitizePhoneNumber(
          formData.phoneNumber
        ),
        advertiseWithUsNotes: sanitizeMessage(formData.notes),
        advertiseWithUsDurationId: formData.durationId,
      };

      const response = await fetch(
        `${BACKEND_API_URL}/api/AdvertiseWithUs`,
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
        "شكراً لاهتمامك! سيتواصل معك فريقنا قريباً لمناقشة تفاصيل الإعلان."
      );
      setFormData({
        name: "",
        phoneNumber: "",
        notes: "",
        durationId: 0,
      });

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (error) {
      console.error("Error submitting form:", error);
      setApiError(
        "حدث خطأ أثناء إرسال الطلب. يرجى المحاولة لاحقاً."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            إعلن عندنا
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            نرحب بشركتك وعروضك الإعلانية. يرجى ملء النموذج أدناه وسنقوم بمراجعة طلبك والتواصل معك قريباً.
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            <p className="font-semibold">{successMessage}</p>
          </div>
        )}

        {/* Error Message */}
        {apiError && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <p className="font-semibold">{apiError}</p>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8"
        >
          {/* Company/Organization Name Field */}
          <div className="mb-6">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              اسم الشركة / الجهة
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="أدخل اسم شركتك أو جهتك"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              maxLength={200}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Phone Field */}
          <div className="mb-6">
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              رقم الهاتف
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="أدخل رقم هاتف الاتصال"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                errors.phoneNumber ? "border-red-500" : "border-gray-300"
              }`}
              maxLength={20}
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
            )}
          </div>

          {/* Duration Field */}
          <div className="mb-6">
            <label
              htmlFor="durationId"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              مدة الإعلان
            </label>
            {durationLoading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
            ) : (
              <select
                id="durationId"
                name="durationId"
                value={formData.durationId}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                  errors.durationId ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value={0}>-- اختر مدة الإعلان --</option>
                {durations.map((duration) => (
                  <option
                    key={duration.advertiseWithUsDurationId}
                    value={duration.advertiseWithUsDurationId}
                  >
                    {duration.advertiseWithUsDurationName}
                  </option>
                ))}
              </select>
            )}
            {errors.durationId && (
              <p className="text-red-500 text-sm mt-1">{errors.durationId}</p>
            )}
          </div>

          {/* Notes Field */}
          <div className="mb-6">
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              ملاحظات إضافية (اختياري)
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="أضف أي ملاحظات أو متطلبات خاصة..."
              rows={4}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 resize-none ${
                errors.notes ? "border-red-500" : "border-gray-300"
              }`}
              maxLength={1000}
            />
            <p className="text-gray-500 text-sm mt-1">
              {formData.notes.length}/1000
            </p>
            {errors.notes && (
              <p className="text-red-500 text-sm mt-1">{errors.notes}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primaryOther hover:bg-opacity-90 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
          >
            {loading ? "جاري الإرسال..." : "إرسال طلب الإعلان"}
          </button>
        </form>

        {/* Security Notice */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            <strong>ملاحظة أمان:</strong> يتم حماية جميع البيانات التي تدخلها من خلال معالجة آمنة. لا نقبل أي محاولات للحقن أو البرامج الضارة.
          </p>
        </div>
      </div>
    </div>
  );
}
