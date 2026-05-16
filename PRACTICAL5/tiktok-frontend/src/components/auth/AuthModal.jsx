"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { LoginForm, SignupForm } from "@/components/auth/AuthForms";

export default function AuthModal({ isOpen, onClose, initialTab = "login" }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  const handleSuccess = () => {
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={activeTab === "login" ? "Log in" : "Sign up"}
    >
      <div className="mb-4">
        <div className="flex border-b">
          <button
            type="button"
            className={`flex-1 py-2 text-center ${
              activeTab === "login"
                ? "border-b-2 border-pink-500 font-medium text-pink-500"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("login")}
          >
            Log in
          </button>
          <button
            type="button"
            className={`flex-1 py-2 text-center ${
              activeTab === "signup"
                ? "border-b-2 border-pink-500 font-medium text-pink-500"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("signup")}
          >
            Sign up
          </button>
        </div>
      </div>

      {activeTab === "login" ? (
        <LoginForm onSuccess={handleSuccess} />
      ) : (
        <SignupForm onSuccess={handleSuccess} />
      )}
    </Modal>
  );
}
