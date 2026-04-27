import { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import styles from './Contact.module.css';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

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

    setIsSubmitting(true);
    setStatus(null);

    try {
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY);
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
            <a href="mailto:rhbntm@gmail.com" className={styles.infoValue}>rhbntm@gmail.com</a>
          </div>

          <div className={styles.infoGroup}>
            <span className={styles.infoLabel}>Location</span>
            <span className={styles.infoValue}>Manila, Philippines</span>
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
