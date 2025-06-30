"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setIsDark(savedTheme === "dark" || (!savedTheme && prefersDark));

    // Listen for theme changes
    const handleThemeChange = (event: CustomEvent) => {
      setIsDark(event.detail.isDark);
    };

    window.addEventListener("themeChange", handleThemeChange as EventListener);

    return () => {
      window.removeEventListener(
        "themeChange",
        handleThemeChange as EventListener
      );
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log("Form submitted:", formData);
    setIsSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });

    // Reset success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div
      className="min-h-screen transition-colors duration-200"
      style={{ backgroundColor: isDark ? "#0a0a0a" : "#ffffff" }}
    >
      <Header />

      {/* Hero Section */}
      <section
        className="py-20"
        style={{
          background: isDark
            ? "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)"
            : "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1
              className="text-4xl md:text-5xl font-bold mb-6"
              style={{ color: isDark ? "#ffffff" : "#111827" }}
            >
              Get in Touch
            </h1>
            <p
              className="text-xl mb-8 max-w-3xl mx-auto"
              style={{ color: isDark ? "#d1d5db" : "#4b5563" }}
            >
              Have questions about our courses or need help getting started?
              We&apos;re here to help you succeed on your learning journey.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section
        className="py-20"
        style={{ backgroundColor: isDark ? "#0a0a0a" : "#ffffff" }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2
                className="text-3xl font-bold mb-8"
                style={{ color: isDark ? "#ffffff" : "#111827" }}
              >
                Send us a Message
              </h2>

              {isSubmitted && (
                <div
                  className="mb-6 p-4 rounded-lg flex items-center"
                  style={{ backgroundColor: isDark ? "#166534" : "#dcfce7" }}
                >
                  <CheckCircle
                    className="w-5 h-5 mr-3"
                    style={{ color: isDark ? "#4ade80" : "#16a34a" }}
                  />
                  <span style={{ color: isDark ? "#4ade80" : "#16a34a" }}>
                    Thank you! Your message has been sent successfully.
                    We&apos;ll get back to you soon.
                  </span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium mb-2"
                      style={{ color: isDark ? "#ffffff" : "#111827" }}
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border transition-colors"
                      style={{
                        backgroundColor: isDark ? "#1e293b" : "#ffffff",
                        borderColor: isDark ? "#374151" : "#d1d5db",
                        color: isDark ? "#ffffff" : "#111827",
                      }}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium mb-2"
                      style={{ color: isDark ? "#ffffff" : "#111827" }}
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border transition-colors"
                      style={{
                        backgroundColor: isDark ? "#1e293b" : "#ffffff",
                        borderColor: isDark ? "#374151" : "#d1d5db",
                        color: isDark ? "#ffffff" : "#111827",
                      }}
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium mb-2"
                    style={{ color: isDark ? "#ffffff" : "#111827" }}
                  >
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border transition-colors"
                    style={{
                      backgroundColor: isDark ? "#1e293b" : "#ffffff",
                      borderColor: isDark ? "#374151" : "#d1d5db",
                      color: isDark ? "#ffffff" : "#111827",
                    }}
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="course">Course Information</option>
                    <option value="technical">Technical Support</option>
                    <option value="billing">Billing Question</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium mb-2"
                    style={{ color: isDark ? "#ffffff" : "#111827" }}
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border transition-colors resize-none"
                    style={{
                      backgroundColor: isDark ? "#1e293b" : "#ffffff",
                      borderColor: isDark ? "#374151" : "#d1d5db",
                      color: isDark ? "#ffffff" : "#111827",
                    }}
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <Send className="w-5 h-5" />
                  <span>Send Message</span>
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2
                className="text-3xl font-bold mb-8"
                style={{ color: isDark ? "#ffffff" : "#111827" }}
              >
                Contact Information
              </h2>

              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: isDark ? "#1e40af" : "#dbeafe" }}
                  >
                    <Mail
                      className="w-6 h-6"
                      style={{ color: isDark ? "#60a5fa" : "#2563eb" }}
                    />
                  </div>
                  <div>
                    <h3
                      className="text-lg font-semibold mb-2"
                      style={{ color: isDark ? "#ffffff" : "#111827" }}
                    >
                      Email Us
                    </h3>
                    <p style={{ color: isDark ? "#d1d5db" : "#4b5563" }}>
                      support@nanolearning.com
                    </p>
                    <p style={{ color: isDark ? "#d1d5db" : "#4b5563" }}>
                      info@nanolearning.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: isDark ? "#166534" : "#dcfce7" }}
                  >
                    <Phone
                      className="w-6 h-6"
                      style={{ color: isDark ? "#4ade80" : "#16a34a" }}
                    />
                  </div>
                  <div>
                    <h3
                      className="text-lg font-semibold mb-2"
                      style={{ color: isDark ? "#ffffff" : "#111827" }}
                    >
                      Call Us
                    </h3>
                    <p style={{ color: isDark ? "#d1d5db" : "#4b5563" }}>
                      +1 (555) 123-4567
                    </p>
                    <p style={{ color: isDark ? "#d1d5db" : "#4b5563" }}>
                      Mon-Fri: 9AM-6PM EST
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: isDark ? "#7c3aed" : "#f3e8ff" }}
                  >
                    <MapPin
                      className="w-6 h-6"
                      style={{ color: isDark ? "#a78bfa" : "#9333ea" }}
                    />
                  </div>
                  <div>
                    <h3
                      className="text-lg font-semibold mb-2"
                      style={{ color: isDark ? "#ffffff" : "#111827" }}
                    >
                      Visit Us
                    </h3>
                    <p style={{ color: isDark ? "#d1d5db" : "#4b5563" }}>
                      123 Learning Street
                      <br />
                      Education City, EC 12345
                      <br />
                      United States
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: isDark ? "#ea580c" : "#fed7aa" }}
                  >
                    <Clock
                      className="w-6 h-6"
                      style={{ color: isDark ? "#fb923c" : "#ea580c" }}
                    />
                  </div>
                  <div>
                    <h3
                      className="text-lg font-semibold mb-2"
                      style={{ color: isDark ? "#ffffff" : "#111827" }}
                    >
                      Business Hours
                    </h3>
                    <p style={{ color: isDark ? "#d1d5db" : "#4b5563" }}>
                      Monday - Friday: 9:00 AM - 6:00 PM EST
                      <br />
                      Saturday: 10:00 AM - 4:00 PM EST
                      <br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>

              {/* Live Chat */}
              <div
                className="mt-12 p-6 rounded-xl"
                style={{
                  background:
                    "linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)",
                }}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <MessageSquare className="w-6 h-6 text-white" />
                  <h3 className="text-xl font-semibold text-white">
                    Live Chat
                  </h3>
                </div>
                <p className="text-blue-100 mb-4">
                  Need immediate assistance? Start a live chat with our support
                  team.
                </p>
                <button className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2">
                  <span>Start Chat</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        className="py-20"
        style={{ backgroundColor: isDark ? "#1e293b" : "#f9fafb" }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: isDark ? "#ffffff" : "#111827" }}
            >
              Frequently Asked Questions
            </h2>
            <p
              className="text-xl max-w-2xl mx-auto"
              style={{ color: isDark ? "#d1d5db" : "#4b5563" }}
            >
              Find quick answers to common questions about our platform and
              services.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            <div
              className="rounded-xl p-6"
              style={{ backgroundColor: isDark ? "#0a0a0a" : "#ffffff" }}
            >
              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: isDark ? "#ffffff" : "#111827" }}
              >
                How do I get started with a course?
              </h3>
              <p style={{ color: isDark ? "#d1d5db" : "#4b5563" }}>
                Simply sign up for an account, browse our course catalog, and
                enroll in any course that interests you. You can start learning
                immediately after enrollment.
              </p>
            </div>

            <div
              className="rounded-xl p-6"
              style={{ backgroundColor: isDark ? "#0a0a0a" : "#ffffff" }}
            >
              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: isDark ? "#ffffff" : "#111827" }}
              >
                What payment methods do you accept?
              </h3>
              <p style={{ color: isDark ? "#d1d5db" : "#4b5563" }}>
                We accept all major credit cards, PayPal, and bank transfers. We
                also offer flexible payment plans for many of our courses.
              </p>
            </div>

            <div
              className="rounded-xl p-6"
              style={{ backgroundColor: isDark ? "#0a0a0a" : "#ffffff" }}
            >
              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: isDark ? "#ffffff" : "#111827" }}
              >
                Can I get a refund if I&apos;m not satisfied?
              </h3>
              <p style={{ color: isDark ? "#d1d5db" : "#4b5563" }}>
                Yes, we offer a 30-day money-back guarantee. If you&apos;re not
                completely satisfied with your course, you can request a full
                refund within 30 days of purchase.
              </p>
            </div>

            <div
              className="rounded-xl p-6"
              style={{ backgroundColor: isDark ? "#0a0a0a" : "#ffffff" }}
            >
              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: isDark ? "#ffffff" : "#111827" }}
              >
                Do you offer certificates upon completion?
              </h3>
              <p style={{ color: isDark ? "#d1d5db" : "#4b5563" }}>
                Yes, all our courses provide a certificate of completion that
                you can download and share on your professional profiles like
                LinkedIn.
              </p>
            </div>

            <div
              className="rounded-xl p-6"
              style={{ backgroundColor: isDark ? "#0a0a0a" : "#ffffff" }}
            >
              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: isDark ? "#ffffff" : "#111827" }}
              >
                How long do I have access to my courses?
              </h3>
              <p style={{ color: isDark ? "#d1d5db" : "#4b5563" }}>
                You have lifetime access to all courses you purchase. You can
                revisit the content anytime and continue learning at your own
                pace.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
