// EmailJS Configuration and Contact Form Handler
(function () {
  "use strict";

  // Configuration - Replace these with your actual EmailJS IDs
  const CONFIG = {
    SERVICE_ID: "service_rtfvja2",
    TEMPLATE_ID: "template_0lupgms",
    PUBLIC_KEY: "GvKLOX4uCC1yMS0C7",
  };

  // Initialize EmailJS with your public key
  emailjs.init(CONFIG.PUBLIC_KEY);

  // DOM Elements
  let contactForm, submitBtn, submitText, submitSpinner;

  // Initialize when DOM is loaded
  document.addEventListener("DOMContentLoaded", function () {
    // Get DOM elements
    contactForm = document.getElementById("contact-form");
    submitBtn = document.getElementById("submit-btn");
    submitText = document.getElementById("submit-text");
    submitSpinner = document.getElementById("submit-spinner");

    // Add form event listener
    if (contactForm) {
      contactForm.addEventListener("submit", handleFormSubmit);
    }

    // Add input validation
    addInputValidation();
  });

  // Handle form submission
  function handleFormSubmit(e) {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Show loading state
    setLoadingState(true);

    // Get form data
    const formData = new FormData(contactForm);
    const templateParams = {
      from_name: `${formData.get("firstName")} ${formData.get("lastName")}`,
      from_email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
      to_name: "Pinwatta Portal Team",
      reply_to: formData.get("email"),
    };

    // Debug info
    console.log("Sending email with params:", templateParams);
    console.log("Using service ID:", CONFIG.SERVICE_ID);
    console.log("Using template ID:", CONFIG.TEMPLATE_ID);

    // Send email using EmailJS
    emailjs
      .send(CONFIG.SERVICE_ID, CONFIG.TEMPLATE_ID, templateParams)
      .then(function (response) {
        console.log("Email sent successfully!", response.status, response.text);
        showNotification(
          "Message sent successfully! We'll get back to you soon.",
          "success"
        );
        contactForm.reset();
        clearValidationStates();
      })
      .catch(function (error) {
        console.error("Failed to send email:", error);

        // More detailed error information
        let errorMessage = "Failed to send message. ";
        if (error.status === 400) {
          errorMessage += "Please check your form data.";
        } else if (error.status === 401) {
          errorMessage +=
            "Authentication error - please check your EmailJS configuration.";
        } else if (error.status === 404) {
          errorMessage += "Service or template not found.";
        } else if (error.status === 429) {
          errorMessage += "Too many requests. Please try again later.";
        } else {
          errorMessage += "Please try again or contact us directly.";
        }

        showNotification(errorMessage, "error");
      })
      .finally(function () {
        setLoadingState(false);
      });
  }

  // Set loading state
  function setLoadingState(isLoading) {
    if (!submitBtn || !submitText || !submitSpinner) return;

    submitBtn.disabled = isLoading;

    if (isLoading) {
      submitText.textContent = "Sending...";
      submitSpinner.classList.remove("hidden");
      submitBtn.classList.add("opacity-75");
    } else {
      submitText.textContent = "Send Message";
      submitSpinner.classList.add("hidden");
      submitBtn.classList.remove("opacity-75");
    }
  }

  // Form validation
  function validateForm() {
    const requiredFields = ["firstName", "lastName", "email", "message"];
    let isValid = true;

    // Clear previous validation states
    clearValidationStates();

    requiredFields.forEach((fieldName) => {
      const field = contactForm.querySelector(`[name="${fieldName}"]`);
      if (field && !field.value.trim()) {
        showFieldError(field, "This field is required");
        isValid = false;
      } else if (fieldName === "email" && field && !isValidEmail(field.value)) {
        showFieldError(field, "Please enter a valid email address");
        isValid = false;
      }
    });

    return isValid;
  }

  // Email validation
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Show field error
  function showFieldError(field, message) {
    field.classList.add("border-red-500", "dark:border-red-400");

    // Remove existing error message
    const existingError = field.parentNode.querySelector(".error-message");
    if (existingError) {
      existingError.remove();
    }

    // Add error message
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message text-red-500 text-sm mt-1";
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
  }

  // Clear validation states
  function clearValidationStates() {
    const inputs = contactForm.querySelectorAll("input, textarea, select");
    inputs.forEach((input) => {
      input.classList.remove("border-red-500", "dark:border-red-400");
      const errorMsg = input.parentNode.querySelector(".error-message");
      if (errorMsg) {
        errorMsg.remove();
      }
    });
  }

  // Add real-time input validation
  function addInputValidation() {
    const inputs = document.querySelectorAll(
      "#contact-form input, #contact-form textarea"
    );
    inputs.forEach((input) => {
      input.addEventListener("blur", function () {
        validateField(this);
      });

      input.addEventListener("input", function () {
        // Remove error styling on input
        this.classList.remove("border-red-500", "dark:border-red-400");
        const errorMsg = this.parentNode.querySelector(".error-message");
        if (errorMsg) {
          errorMsg.remove();
        }
      });
    });
  }

  // Validate individual field
  function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.getAttribute("name");

    if (field.hasAttribute("required") && !value) {
      showFieldError(field, "This field is required");
      return false;
    }

    if (fieldName === "email" && value && !isValidEmail(value)) {
      showFieldError(field, "Please enter a valid email address");
      return false;
    }

    return true;
  }

  // Show notification
  function showNotification(message, type = "success") {
    const notification = document.createElement("div");
    const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";
    const icon = type === "success" ? "check-circle" : "x-circle";

    notification.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-4 rounded-xl shadow-lg z-50 transform translate-x-full transition-all duration-300 max-w-md`;
    notification.innerHTML = `
            <div class="flex items-start">
                <i data-lucide="${icon}" class="h-5 w-5 mr-3 mt-0.5 flex-shrink-0"></i>
                <span class="text-sm leading-relaxed">${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200 flex-shrink-0">
                    <i data-lucide="x" class="h-4 w-4"></i>
                </button>
            </div>
        `;

    document.body.appendChild(notification);

    // Reinitialize Lucide icons for the notification
    if (typeof lucide !== "undefined") {
      lucide.createIcons();
    }

    // Animate in
    setTimeout(() => {
      notification.classList.remove("translate-x-full");
    }, 100);

    // Auto remove after 6 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.classList.add("translate-x-full");
        setTimeout(() => {
          if (notification.parentNode) {
            notification.remove();
          }
        }, 300);
      }
    }, 6000);
  }

  // Console instructions for EmailJS setup
  console.log(`
🚀 EmailJS Setup Instructions:

1. Go to https://www.emailjs.com/ and create an account
2. Add an email service (Gmail, Outlook, etc.)
3. Create an email template with these variables:
   - {{from_name}} - Sender's name
   - {{from_email}} - Sender's email  
   - {{subject}} - Message subject
   - {{message}} - Message content
   - {{to_name}} - Recipient name
   
4. Update the CONFIG object in contact.js with your:
   - SERVICE_ID (from Email Services)
   - TEMPLATE_ID (from Email Templates) 
   - PUBLIC_KEY (from Account → General)

5. Test the form!

Template example:
Subject: New Contact from {{from_name}} - {{subject}}
Body: 
Hello {{to_name}},

You received a message from {{from_name}} ({{from_email}}):

Subject: {{subject}}

Message:
{{message}}

---
Sent from Pinwatta Portal contact form
    `);
})();
