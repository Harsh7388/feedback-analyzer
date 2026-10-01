import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Brain } from 'lucide-react';
import AnimatedBackground from '../components/shared/AnimatedBackground';

function PolicyPage({ title, children }) {
  return (
    <div style={{ minHeight: '100vh', position: 'relative', padding: '2rem 1rem' }}>
      <AnimatedBackground />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.85rem', textDecoration: 'none', marginBottom: '2rem' }}>
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ width: 40, height: 40, borderRadius: '12px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Brain size={20} color="white" />
          </div>
          <div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: '#f1f5f9' }}>FeedSense</div>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.6rem', fontWeight: 800, color: '#f1f5f9', lineHeight: 1.2 }}>{title}</h1>
          </div>
        </div>

        <div className="card" style={{ lineHeight: 1.9, color: '#94a3b8' }}>
          {children}
        </div>

        <p style={{ textAlign: 'center', color: '#475569', fontSize: '0.8rem', marginTop: '2rem' }}>
          © 2024 FeedSense · AI/ML College Feedback Platform
        </p>
      </div>
    </div>
  );
}

const sectionStyle = { marginBottom: '1.75rem' };
const headingStyle = { fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: '#f1f5f9', fontSize: '1.05rem', marginBottom: '0.625rem' };
const paraStyle = { fontSize: '0.9rem', marginBottom: '0.75rem' };

export function PrivacyPolicyPage() {
  return (
    <PolicyPage title="Privacy Policy">
      <div style={{ fontSize: '0.78rem', color: '#475569', marginBottom: '1.5rem' }}>Last updated: October 1, 2024</div>

      <div style={sectionStyle}>
        <h2 style={headingStyle}>1. Information We Collect</h2>
        <p style={paraStyle}>FeedSense collects the following types of information to provide our academic feedback services:</p>
        <ul style={{ paddingLeft: '1.5rem', fontSize: '0.9rem' }}>
          <li>Student registration data (name, roll number, semester)</li>
          <li>Authentication credentials (stored securely as hashed passwords)</li>
          <li>Feedback responses and ratings you voluntarily submit</li>
          <li>Usage data for improving the platform</li>
        </ul>
      </div>

      <div style={sectionStyle}>
        <h2 style={headingStyle}>2. How We Use Your Information</h2>
        <p style={paraStyle}>We use collected data to:</p>
        <ul style={{ paddingLeft: '1.5rem', fontSize: '0.9rem' }}>
          <li>Provide personalized academic feedback experiences</li>
          <li>Perform AI/ML-based sentiment analysis for academic improvement</li>
          <li>Generate anonymous performance reports for administrators</li>
          <li>Improve our platform's features and user experience</li>
        </ul>
      </div>

      <div style={sectionStyle}>
        <h2 style={headingStyle}>3. Data Storage & Security</h2>
        <p style={paraStyle}>All data is stored locally on your device using browser localStorage. No data is transmitted to external servers. We implement the following security measures:</p>
        <ul style={{ paddingLeft: '1.5rem', fontSize: '0.9rem' }}>
          <li>No transmission of personal data to third-party services</li>
          <li>Session-based access control for all user roles</li>
          <li>Secure credential validation</li>
        </ul>
      </div>

      <div style={sectionStyle}>
        <h2 style={headingStyle}>4. Feedback Anonymity</h2>
        <p style={paraStyle}>Teacher accounts can only see whether students submitted feedback or not — not the content. Only administrators can view full feedback details for quality improvement purposes.</p>
      </div>

      <div style={sectionStyle}>
        <h2 style={headingStyle}>5. Cookies</h2>
        <p style={paraStyle}>FeedSense uses minimal session cookies for authentication and user preferences. See our <Link to="/cookies" style={{ color: '#a5b4fc' }}>Cookie Policy</Link> for details.</p>
      </div>

      <div style={sectionStyle}>
        <h2 style={headingStyle}>6. Your Rights</h2>
        <p style={paraStyle}>You have the right to access, correct, or delete your personal data. Contact your institution's administrator for data requests.</p>
      </div>

      <div style={sectionStyle}>
        <h2 style={headingStyle}>7. Contact</h2>
        <p style={paraStyle}>For privacy concerns, contact: <a href="mailto:privacy@feedsense.edu" style={{ color: '#a5b4fc' }}>privacy@feedsense.edu</a></p>
      </div>
    </PolicyPage>
  );
}

export function TermsPage() {
  return (
    <PolicyPage title="Terms & Conditions">
      <div style={{ fontSize: '0.78rem', color: '#475569', marginBottom: '1.5rem' }}>Effective: October 1, 2024</div>

      <div style={sectionStyle}>
        <h2 style={headingStyle}>1. Acceptance of Terms</h2>
        <p style={paraStyle}>By accessing FeedSense, you agree to these Terms and Conditions. If you disagree, please do not use the platform.</p>
      </div>

      <div style={sectionStyle}>
        <h2 style={headingStyle}>2. Permitted Use</h2>
        <p style={paraStyle}>FeedSense is exclusively for academic feedback purposes within your educational institution. You agree to:</p>
        <ul style={{ paddingLeft: '1.5rem', fontSize: '0.9rem' }}>
          <li>Provide honest, constructive feedback</li>
          <li>Not submit false or misleading information</li>
          <li>Use your actual credentials only</li>
          <li>Not attempt to access other users' accounts</li>
        </ul>
      </div>

      <div style={sectionStyle}>
        <h2 style={headingStyle}>3. Intellectual Property</h2>
        <p style={paraStyle}>All platform content, design, and AI/ML algorithms are proprietary to FeedSense. Unauthorized reproduction is prohibited.</p>
      </div>

      <div style={sectionStyle}>
        <h2 style={headingStyle}>4. Feedback Content</h2>
        <p style={paraStyle}>By submitting feedback, you grant FeedSense a non-exclusive license to use this data for academic improvement and sentiment analysis. Personal comments remain confidential from teachers.</p>
      </div>

      <div style={sectionStyle}>
        <h2 style={headingStyle}>5. Disclaimer</h2>
        <p style={paraStyle}>FeedSense is provided "as is" for educational purposes. We are not responsible for any academic decisions made based on feedback analysis results.</p>
      </div>

      <div style={sectionStyle}>
        <h2 style={headingStyle}>6. Changes to Terms</h2>
        <p style={paraStyle}>We reserve the right to modify these terms at any time. Continued use constitutes acceptance of updated terms.</p>
      </div>
    </PolicyPage>
  );
}

export function CookiePolicyPage() {
  return (
    <PolicyPage title="Cookie Policy">
      <div style={{ fontSize: '0.78rem', color: '#475569', marginBottom: '1.5rem' }}>Last updated: October 1, 2024</div>

      <div style={sectionStyle}>
        <h2 style={headingStyle}>What Are Cookies?</h2>
        <p style={paraStyle}>Cookies are small text files stored on your device that help websites provide a better experience. FeedSense uses minimal, essential cookies only.</p>
      </div>

      <div style={sectionStyle}>
        <h2 style={headingStyle}>Cookies We Use</h2>
        <ul style={{ paddingLeft: '1.5rem', fontSize: '0.9rem' }}>
          <li><strong style={{ color: '#f1f5f9' }}>Session cookies:</strong> To keep you logged in during your session</li>
          <li><strong style={{ color: '#f1f5f9' }}>Preference cookies:</strong> To remember your cookie consent choice</li>
          <li><strong style={{ color: '#f1f5f9' }}>No tracking cookies:</strong> We do not use advertising or analytics cookies</li>
        </ul>
      </div>

      <div style={sectionStyle}>
        <h2 style={headingStyle}>Managing Cookies</h2>
        <p style={paraStyle}>You can clear all FeedSense cookies by clearing your browser's localStorage. This will log you out and reset preferences.</p>
      </div>

      <div style={sectionStyle}>
        <h2 style={headingStyle}>Contact</h2>
        <p style={paraStyle}>For cookie-related queries: <a href="mailto:support@feedsense.edu" style={{ color: '#a5b4fc' }}>support@feedsense.edu</a></p>
      </div>
    </PolicyPage>
  );
}
