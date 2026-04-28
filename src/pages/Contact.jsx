import { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { sanitizeString } from '../lib/validation';
import styles from './Contact.module.css';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const MAX_SUBMISSIONS = 3;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const LS_SUBMISSIONS_KEY = 'contact_submissions';
const LS_LAST_SUBMISSION_KEY = 'contact_last_submission';

function getSubmissionCount() {
  const raw = localStorage.getItem(LS_SUBMISSIONS_KEY);
  const lastSubmission = parseInt(localStorage.getItem(LS_LAST_SUBMISSION_KEY) || '0', 10);
  
  // Reset if window expired
  if (Date.now() - lastSubmission > RATE_LIMIT_WINDOW_MS) {
    localStorage.removeItem(LS_SUBMISSIONS_KEY);
    localStorage.removeItem(LS_LAST_SUBMISSION_KEY);
    return 0;
  }
  
  return raw ? parseInt(raw, 10) : 0;
}

function incrementSubmissionCount() {
  const count = getSubmissionCount() + 1;
  localStorage.setItem(LS_SUBMISSIONS_KEY, String(count));
  localStorage.setItem(LS_LAST_SUBMISSION_KEY, String(Date.now()));
  return count;
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export default function Contact() {
  const formRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formRef.current) return;

    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      setStatus({ type: 'error', message: 'Email service is not configured. Please check your environment variables.' });
      return;
    }

    // Rate limit check
    const submissionCount = getSubmissionCount();
    if (submissionCount >= MAX_SUBMISSIONS) {
      const lastSubmission = parseInt(localStorage.getItem(LS_LAST_SUBMISSION_KEY) || '0', 10);
      const remainingMs = RATE_LIMIT_WINDOW_MS - (Date.now() - lastSubmission);
      const remainingMin = Math.ceil(remainingMs / 60000);
      setStatus({ type: 'error', message: `Too many messages. Please try again in ${remainingMin} minute(s).` });
      return;
    }

    // Get and validate form data
    const formData = new FormData(formRef.current);
    const email = formData.get('reply_to');
    
    if (!isValidEmail(email)) {
      setStatus({ type: 'error', message: 'Please enter a valid email address.' });
      return;
    }

    // Sanitize inputs
    const sanitizedData = {
      from_name: sanitizeString(formData.get('from_name')),
      reply_to: sanitizeString(email),
      subject: sanitizeString(formData.get('subject')),
      message: sanitizeString(formData.get('message')),
    };

    // Update form with sanitized values
    formRef.current.elements.from_name.value = sanitizedData.from_name;
    formRef.current.elements.reply_to.value = sanitizedData.reply_to;
    formRef.current.elements.subject.value = sanitizedData.subject;
    formRef.current.elements.message.value = sanitizedData.message;

    setIsSubmitting(true);
    setStatus(null);

    try {
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY);
      incrementSubmissionCount();
      setStatus({ type: 'success', message: 'Message sent successfully. I’ll get back to you soon!' });
      formRef.current.reset();
    } catch (err) {
      console.error('EmailJS error:', err);
      setStatus({ type: 'error', message: 'Something went wrong. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.contactContainer}>
      <header className={styles.header}>
        <span className={styles.eyebrow}>Get in Touch</span>
        <h1 className={styles.title}>Let's discuss your next project or internship opportunity.</h1>
      </header>

      <div className={styles.grid}>
        <div className={styles.infoSection}>
          <div className={styles.infoGroup}>
            <span className={styles.infoLabel}>Email</span>
            <span className={styles.infoValue}>ralphbrentm@gmail.com</span>
          </div>

          <div className={styles.infoGroup}>
            <span className={styles.infoLabel}>Location</span>
            <span className={styles.infoValue}>Manila, Philippines</span>
          </div>
          <div className={styles.infoGroup}>
            <span className={styles.infoLabel}>Phone Number</span>
            <span className={styles.infoValue}>+63 976 195 0149</span>
          </div>

          <div className={styles.infoGroup}>
            <span className={styles.infoLabel}>Socials</span>
            <div className={styles.socialGrid}>
              <a href="https://github.com/rhbntm" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>GitHub</a>
              <a href="https://linkedin.com/in/rhbntm" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>LinkedIn</a>
            </div>
          </div>
        </div>

        <form ref={formRef} className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="from_name"
              className={styles.input}
              placeholder="John Doe"
              required
              disabled={isSubmitting}
              maxLength={100}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="reply_to"
              className={styles.input}
              placeholder="john@example.com"
              required
              disabled={isSubmitting}
              maxLength={256}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="subject">Subject</label>
            <input
              type="text"
              id="subject"
              name="subject"
              className={styles.input}
              placeholder="Project Inquiry"
              required
              disabled={isSubmitting}
              maxLength={200}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              className={styles.textarea}
              placeholder="Tell me about your project..."
              required
              disabled={isSubmitting}
              maxLength={5000}
            ></textarea>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
            {isSubmitting ? 'Sending…' : 'Send Message'}
          </button>

          {status && (
            <p className={status.type === 'success' ? styles.successMsg : styles.errorMsg}>
              {status.message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
