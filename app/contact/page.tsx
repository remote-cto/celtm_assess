//app/contact/page.tsx

"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Image from "next/image";

const Page = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
      isValid = false;
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly", {
        duration: 3000,
        position: "top-center",
      });
      return;
    }

    const loadingToast = toast.loading("Submitting your enquiry...");

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.dismiss(loadingToast);
        toast.success(
          "Thank you! Your enquiry has been submitted successfully.",
          {
            duration: 5000,
            position: "top-center",
          }
        );

        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        toast.dismiss(loadingToast);
        toast.error("Failed to submit enquiry. Please try again.", {
          duration: 5000,
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.dismiss(loadingToast);
      toast.error(
        "An error occurred while submitting the form. Please try again.",
        {
          duration: 5000,
          position: "top-center",
        }
      );
    }
  };

  const inputClasses = (errorField: string) => `
    w-full rounded-lg border-2 p-3 text-sm
    ${
      errors[errorField as keyof typeof errors]
        ? "border-red-500"
        : "border-blue-200"
    }
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
    transition-all duration-300 ease-in-out
    shadow-[0_0_10px_rgba(59,130,246,0.1)]
    hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]
    focus:shadow-[0_0_20px_rgba(59,130,246,0.3)]
    placeholder-gray-500
  `;

  const cards = [
    {
      title: "For Institutions",
      description:
        "Looking to rewire placement models? Launch AI-first skill hubs? Let's co-create readiness.",
      color: "from-blue-500 to-cyan-500",
      emoji: "🏛️",
    },
    {
      title: "For Business",
      description:
        "Tired of paper résumés and generic assessments? Let's show you signal-based hiring.",
      color: "from-purple-500 to-pink-500",
      emoji: "💼",
    },
    {
      title: "For Policy & Ecosystems",
      description:
        "Building regional, equitable, intelligent talent networks? Let's align intentions.",
      color: "from-cyan-500 to-teal-500",
      emoji: "🌐",
    },
  ];

  return (
    <>
      <Navbar />
      <section className="bg-white font-['Manrope']">
        {/* Hero Section with Video Background */}
        <section className="bg-gradient-to-br from-slate-50 via-white to-yellow-50">
          <div className="relative py-24 px-6 md:px-16 lg:px-24 overflow-hidden">
            {/* Background Video */}
            <div className="absolute inset-0 z-0">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              >
                <source src="/video/Bgnew.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="absolute inset-0 bg-black/40"></div>
            </div>
            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10 mt-20">
              {/* Text Content - Left Side */}
              <div className="flex-1 space-y-6">
                <h1 className="text-3xl md:text-4xl lg:text-5xl text-white leading-relaxed font-['Manrope'] font-light mt-5">
                  GET IN TOUCH WITH US
                </h1>
                <p className="text-lg md:text-xl text-white/90 leading-relaxed font-['Manrope'] font-light">
                  You're here. That's the first{" "}
                  <span className="font-bold text-yellow-300 font-['Manrope']">
                    signal
                  </span>
                  .
                </p>
                <p className="text-base md:text-lg text-white/80 leading-relaxed font-['Manrope'] font-light">
                  We don't cold-sell. We align deeply. If you're looking to
                  activate talent at scale, accelerate ecosystem impact, or
                  architect future-ready skill networks — we'd love to hear your
                  signal.
                </p>
                <p className="text-base md:text-lg text-white/80 leading-relaxed font-['Manrope'] font-light">
                  No forms. No bots. Just a conversation. Because the future
                  won't be built by funnels. It'll be built by{" "}
                  <span className="font-bold text-yellow-300 font-['Manrope']">
                    resonance
                  </span>
                  .
                </p>
              </div>

              {/* Right side - can be left empty or add some visual element */}
              <div className="flex-1 flex justify-center items-center"></div>
            </div>
          </div>
        </section>

        {/* Cards Section - Now outside the video background */}
        <div className="py-16 px-6 md:px-16 lg:px-24 bg-gradient-to-br from-slate-50 via-white to-yellow-50">
          <div className="flex flex-wrap items-center justify-center gap-8 max-w-8xl mx-auto">
            {cards.map((card, index) => (
              <div
                key={index}
                className="group relative transition-all duration-500 hover:scale-110"
              >
                <div
                  className={`bg-gradient-to-r ${card.color} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-poManrope min-w-[280px] max-w-[280px] min-h-[250px] flex flex-col justify-center`}
                >
                  <div className="flex items-center justify-center mb-3">
                    <div className="text-3xl">{card.emoji}</div>
                  </div>
                  <h3 className="text-xl font-bold text-white text-center mb-2 font-['Manrope']">
                    {card.title}
                  </h3>
                  <p className="text-sm text-white/90 text-center leading-relaxed font-['Manrope']">
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form Section */}
        <section className="bg-white font-mono relative overflow-hidden">
          <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 gap-x-16 gap-y-12 lg:grid-cols-5">
              <div className="lg:col-span-2 lg:py-12 space-y-8">
                <div className="transform transition-all duration-300 hover:scale-105">
                  <strong className="block text-blue-700 text-2xl lg:text-3xl mb-2">
                    Phone
                  </strong>
                  <a
                    href="https://wa.me/9662512899"
                    target="_blank"
                    className="text-[#061BB0] text-xl relative group
                    after:content-[''] after:absolute after:bottom-0 after:left-0
                    after:w-full after:h-0.5 after:bg-blue-400
                    after:transform after:scale-x-0 after:origin-left
                    after:transition-transform after:duration-300
                    group-hover:after:scale-x-100
                    hover:text-blue-800 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                  >
                    +91 966-251-2899
                  </a>
                </div>

                <div className="transform transition-all duration-300 hover:scale-105">
                  <strong className="block text-[#061BB0] text-2xl lg:text-3xl mb-2">
                    Email
                  </strong>
                  <a
                    href="mailto:connect@CELTM.live"
                    className="text-blue-600 text-xl relative group
                    after:content-[''] after:absolute after:bottom-0 after:left-0
                    after:w-full after:h-0.5 after:bg-blue-400
                    after:transform after:scale-x-0 after:origin-left
                    after:transition-transform after:duration-300
                    group-hover:after:scale-x-100
                    hover:text-blue-800 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] font-['Manrope']"
                  >
                    admin@celtm.com
                  </a>
                </div>

                <div className="transform transition-all duration-300 hover:scale-105">
                  <strong className="block text-[#061BB0] text-2xl lg:text-3xl mb-2 font-['Manrope']">
                    Our Location
                  </strong>
                  <p
                    className="text-blue-600 text-xl relative group flex items-center gap-2
                    after:content-[''] after:absolute after:bottom-0 after:left-0
                    after:w-full after:h-0.5 after:bg-blue-400
                    after:transform after:scale-x-0 after:origin-left
                    after:transition-transform after:duration-300
                    group-hover:after:scale-x-100
                    hover:text-blue-800 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] font-['Manrope']"
                  >
                    <span>10, Shivani, Nr IIMA, Ambavadi, Ahmedabad</span>
                  </p>
                </div>
              </div>

              <div
                className="rounded-lg bg-white p-8 lg:p-12
                shadow-[0_0_20px_rgba(59,130,246,0.2)]
                hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]
                transition-shadow duration-300 ease-in-out
                border-2 border-blue-100
                lg:col-span-3"
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="sr-only" htmlFor="name">
                      Name
                    </label>
                    <input
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={inputClasses("name")}
                      placeholder="Name *"
                      type="text"
                      id="name"
                    />
                    {errors.name && (
                      <p className="mt-2 text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>

                  {/* Email and Phone Fields */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 font-['Manrope']">
                    <div>
                      <label className="sr-only" htmlFor="email">
                        Email
                      </label>
                      <input
                        required
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={inputClasses("email")}
                        placeholder="Email address *"
                        type="email"
                        id="email"
                      />
                      {errors.email && (
                        <p className="mt-2 text-sm text-red-500">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="sr-only" htmlFor="phone">
                        Phone
                      </label>
                      <input
                        required
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={inputClasses("phone")}
                        placeholder="Phone Number *"
                        type="tel"
                        id="phone"
                      />
                      {errors.phone && (
                        <p className="mt-2 text-sm text-red-500">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="sr-only" htmlFor="message">
                      Message
                    </label>
                    <textarea
                      required
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className={inputClasses("message")}
                      placeholder="Message *"
                      rows={5}
                      id="message"
                    ></textarea>
                    {errors.message && (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  <div className="mt-6">
                    <button
                      type="submit"
                      className="inline-block w-full sm:w-auto px-5 py-3 
                      bg-[#061BB0] text-white font-medium rounded-lg
                      transform transition-all duration-300 ease-in-out
                      hover:scale-105 hover:bg-blue-700
                      shadow-[0_0_15px_rgba(59,130,246,0.2)]
                      hover:shadow-[0_0_25px_rgba(59,130,246,0.4)]
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-['Manrope']"
                    >
                      Send Enquiry
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </section>
    </>
  );
};

export default Page;
