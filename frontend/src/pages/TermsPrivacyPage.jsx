import React from "react";

const TermsPrivacyPage = () => {
  return (
     <div className="min-h-screen bg-gray-900 mt-10 mb-10 ml-10 mr-10 text-white py-16 px-6 border-4 border-gray-400 border-dashed flex justify-center items-center">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <h1 className="text-5xl font-bold text-[#0096FF] text-center mb-10">
          Terms & Privacy Policy
        </h1>

        {/* Terms of Service */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-4">Terms of Service</h2>
          <p className="text-gray-300 leading-7 mb-4">
            By using EcoFashion, you agree to comply with and be bound by the following
            terms and conditions. Please review them carefully before using our website.
          </p>

          <h3 className="text-xl font-bold mt-6 mb-2">1. Use of Our Website</h3>
          <p className="text-gray-400 leading-7">
            You agree not to use the website for any illegal or unauthorized purpose.
            You must not violate any laws in your jurisdiction.
          </p>

          <h3 className="text-xl font-bold mt-6 mb-2">2. Product Information</h3>
          <p className="text-gray-400 leading-7">
            We strive to provide accurate details, but we do not guarantee that all product
            descriptions, prices, or images are error-free.
          </p>

          <h3 className="text-xl font-bold mt-6 mb-2">3. Account Responsibilities</h3>
          <p className="text-gray-400 leading-7">
            You are responsible for maintaining the confidentiality of your account details
            and for all activities that occur under your account.
          </p>
        </section>

        {/* Divider */}
        <div className="border-t border-gray-700 my-10"></div>

        {/* Privacy Policy */}
        <section>
          <h2 className="text-3xl font-semibold mb-4">Privacy Policy</h2>
          <p className="text-gray-300 leading-7 mb-4">
            Your privacy is important to us. This section outlines how we collect, use,
            and protect your information when you use our website.
          </p>

          <h3 className="text-xl font-bold mt-6 mb-2">1. Information We Collect</h3>
          <p className="text-gray-400 leading-7">
            We may collect personal information such as your name, email, phone number,
            address, and payment details when you make a purchase or create an account.
          </p>

          <h3 className="text-xl font-bold mt-6 mb-2">2. How We Use Your Information</h3>
          <p className="text-gray-400 leading-7">
            Your information is used to process orders, improve our services, personalize
            your experience, and contact you with updates or offers.
          </p>

          <h3 className="text-xl font-bold mt-6 mb-2">3. Data Security</h3>
          <p className="text-gray-400 leading-7">
            We implement strong security measures to protect your personal data.
            However, no method of online transmission is 100% secure.
          </p>

          <h3 className="text-xl font-bold mt-6 mb-2">4. Cookies & Tracking</h3>
          <p className="text-gray-400 leading-7">
            We use cookies to enhance your browsing experience and analyze site traffic.
          </p>

          <h3 className="text-xl font-bold mt-6 mb-2">5. Your Rights</h3>
          <p className="text-gray-400 leading-7">
            You may request to access, update, or delete your personal data at any time.
          </p>

        </section>

        {/* Footer note */}
        <p className="text-sm text-gray-500 text-center mt-14">
          Last updated: {new Date().getFullYear()}
        </p>

      </div>
    </div>
  );
};

export default TermsPrivacyPage;
