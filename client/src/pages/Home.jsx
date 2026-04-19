import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/pages/home.css';

const Home = () => {
  const { user } = useAuth();
  const [openFaq, setOpenFaq] = useState(null);
  const toggleFaq = (id) => setOpenFaq(openFaq === id ? null : id);

  const features = [
    { icon: '💸', title: 'Smart Expense Tracking', desc: 'Log every transaction with categories, dates, and notes. Visual charts show exactly where your money goes.' },
    { icon: '📋', title: 'Budget Planning', desc: 'Set monthly spending limits per category and receive visual alerts when you\'re close to your limit.' },
    { icon: '🎯', title: 'Savings Goals', desc: 'Define financial goals like an Emergency Fund or a new car. Track progress with real-time percentage bars.' },
    { icon: '📈', title: 'Investment Portfolio', desc: 'Monitor SIPs, stocks, mutual funds, and FDs — all in a single dashboard with estimated returns.' },
    { icon: '📊', title: 'Reports & Analytics', desc: 'Generate detailed PDF and CSV reports. Filter by date range and see spending breakdowns by category.' },
    { icon: '🔒', title: 'Bank-Level Security', desc: 'JWT tokens, encrypted passwords, and per-user data isolation ensure your financial data stays private.' },
  ];

  const stats = [
    { value: '10k+', label: 'Active Users' },
    { value: '₹50Cr+', label: 'Total Tracked' },
    { value: '99.9%', label: 'Uptime' },
    { value: '4.9★', label: 'User Rating' },
  ];

  const steps = [
    { num: '01', icon: '📝', title: 'Create Your Account', desc: 'Sign up in under 60 seconds. No credit card required.' },
    { num: '02', icon: '💰', title: 'Log Your Finances', desc: 'Add expenses, budgets, goals, and investments through an intuitive dashboard.' },
    { num: '03', icon: '📊', title: 'Track & Analyse', desc: 'Watch interactive charts update in real-time as your data grows.' },
    { num: '04', icon: '🚀', title: 'Achieve Financial Freedom', desc: 'Hit your savings goals and build lasting financial healthy habits.' },
  ];

  const testimonials = [
    { quote: 'SmartFinance helped me save 30% more every month. The budget tracking feature is a game-changer!', name: 'Priya Sharma', role: 'Software Engineer, Bengaluru', initials: 'PS' },
    { quote: 'Finally an app that tracks SIPs and stocks in one place. The portfolio view is incredibly clean.', name: 'Rajesh Kumar', role: 'Business Analyst, Mumbai', initials: 'RK' },
    { quote: 'I had no idea where my salary was going. After 2 months with SmartFinance, I have full clarity.', name: 'Anika Patel', role: 'Marketing Manager, Delhi', initials: 'AP' },
  ];

  const faqs = [
    { id: 1, q: 'Is my financial data secure?', a: 'Absolutely. We use industry-standard JWT authentication, bcrypt password hashing, and strict per-user data isolation. Your data is never shared.' },
    { id: 2, q: 'Can I track multiple types of investments?', a: 'Yes! SmartFinance supports SIPs, Stocks, Mutual Funds, Fixed Deposits, and more — all with portfolio value tracking.' },
    { id: 3, q: 'How do I export my reports?', a: 'Navigate to the Reports page, set your date range, and click Export PDF or Export CSV. Reports download instantly to your device.' },
    { id: 4, q: 'Is there a mobile app?', a: 'SmartFinance is fully responsive and works beautifully on any mobile browser. A dedicated mobile app is on our roadmap.' },
    { id: 5, q: 'Can I set spending limits for specific categories?', a: 'Yes! The Budget Planner lets you set monthly limits per category (e.g., Food: ₹5000/month) with live progress bars.' },
  ];

  return (
    <div className="home-container">

      {/* ─── HERO ─── */}
      <section className="hero-section">
        <div className="hero-bg-glow"></div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">🚀 MERN Stack · JWT Auth · Real-Time Analytics</div>
            <h1>Take Control of Your<br /><span className="hero-accent">Financial Future</span></h1>
            <p className="subheadline">
              Track expenses, plan budgets, monitor investments, and hit your savings goals — 
              all in one beautiful, secure dashboard.
            </p>
            <div className="hero-buttons">
              {user ? (
                <Link to="/dashboard" className="btn btn-primary">Go to Dashboard →</Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary">Start for Free →</Link>
                  <Link to="/login" className="btn btn-outline">Sign In</Link>
                </>
              )}
            </div>
            <div className="mini-stats">
              {stats.map((s, i) => (
                <div key={i} className="mini-stat">
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="features-section" id="features">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">✨ Features</div>
            <h2 className="section-title">Everything You Need to Master Money</h2>
            <p className="section-subtitle">Six powerful modules working together to give you complete financial clarity.</p>
          </div>
          <div className="features-grid">
            {features.map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STATS BANNER ─── */}
      <section className="stats-banner-section">
        <div className="container">
          <div className="stats-banner">
            <div className="stats-banner-content">
              <h2>Trusted by thousands of users across India</h2>
              <p>Join the growing community of financially empowered individuals.</p>
              <Link to="/register" className="btn btn-primary">Join Free Today →</Link>
            </div>
            <div className="stats-banner-grid">
              {stats.map((s, i) => (
                <div key={i} className="banner-stat">
                  <div className="banner-stat-value">{s.value}</div>
                  <div className="banner-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="how-section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">🛤️ Process</div>
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Get started in four simple steps and transform your relationship with money.</p>
          </div>
          <div className="steps-grid">
            {steps.map((step, i) => (
              <div key={i} className="step-card">
                <div className="step-number">{step.num}</div>
                <div className="step-icon">{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
                {i < steps.length - 1 && <div className="step-connector">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PREVIEW ─── */}
      <section className="preview-section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">👁️ Dashboard</div>
            <h2 className="section-title">See It in Action</h2>
            <p className="section-subtitle">Your financial summary, beautifully visualised in real-time.</p>
          </div>
          <div className="preview-card">
            <div className="preview-mock-nav">
              <span className="mock-dot red"></span>
              <span className="mock-dot yellow"></span>
              <span className="mock-dot green"></span>
              <span className="mock-url">smartfinance.app/dashboard</span>
            </div>
            <div className="preview-mock-body">
              <div className="mock-hero">💎 Welcome back, User 👋</div>
              <div className="mock-cards">
                <div className="mock-card red-accent">💸<br /><strong>$12,450</strong><br /><small>Total Expenses</small></div>
                <div className="mock-card green-accent">🎯<br /><strong>3 / 5</strong><br /><small>Goals Active</small></div>
                <div className="mock-card blue-accent">📈<br /><strong>$84,200</strong><br /><small>Portfolio</small></div>
                <div className="mock-card amber-accent">📋<br /><strong>8</strong><br /><small>Budgets</small></div>
              </div>
              <div className="mock-charts">
                <div className="mock-chart">📊 Category Breakdown</div>
                <div className="mock-chart">📉 30-Day Spending Trend</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge light">⭐ Reviews</div>
            <h2 className="section-title" style={{color:'white'}}>What Our Users Say</h2>
            <p className="section-subtitle" style={{color:'rgba(255,255,255,0.7)'}}>Real stories from real people who took back control of their finances.</p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card">
                <div className="testimonial-avatar">{t.initials}</div>
                <p className="quote">"{t.quote}"</p>
                <div>
                  <div className="author">{t.name}</div>
                  <div className="author-role">{t.role}</div>
                </div>
                <div className="stars">⭐⭐⭐⭐⭐</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section className="pricing-section" id="pricing">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">💳 Pricing</div>
            <h2 className="section-title">Simple, Transparent Pricing</h2>
            <p className="section-subtitle">Start free. Upgrade when you're ready.</p>
          </div>
          <div className="pricing-grid">
            <div className="pricing-card">
              <div className="plan-icon">🌱</div>
              <h3>Free</h3>
              <div className="price">$0<span>/forever</span></div>
              <ul>
                <li>✅ Expense Tracking</li>
                <li>✅ 3 Savings Goals</li>
                <li>✅ Basic Reports</li>
                <li>✅ 2 Budget Categories</li>
              </ul>
              <Link to="/register" className="btn btn-outline">Get Started Free</Link>
            </div>
            <div className="pricing-card pro">
              <div className="popular-badge">🔥 Most Popular</div>
              <div className="plan-icon">💎</div>
              <h3>Pro</h3>
              <div className="price">$9<span>/month</span></div>
              <ul>
                <li>✅ Everything in Free</li>
                <li>✅ Unlimited Goals & Budgets</li>
                <li>✅ Investment Portfolio</li>
                <li>✅ PDF & CSV Exports</li>
                <li>✅ Priority Support</li>
              </ul>
              <Link to="/register" className="btn btn-primary">Start Pro Free Trial</Link>
            </div>
            <div className="pricing-card">
              <div className="plan-icon">🏢</div>
              <h3>Team</h3>
              <div className="price">$29<span>/month</span></div>
              <ul>
                <li>✅ Everything in Pro</li>
                <li>✅ Up to 5 Members</li>
                <li>✅ Shared Dashboards</li>
                <li>✅ Advanced Analytics</li>
              </ul>
              <Link to="/register" className="btn btn-outline">Contact Sales</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="faq-section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">❓ FAQ</div>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle">Everything you need to know before getting started.</p>
          </div>
          <div className="faq-list">
            {faqs.map(({ id, q, a }) => (
              <div key={id} className={`faq-item ${openFaq === id ? 'active' : ''}`} onClick={() => toggleFaq(id)}>
                <div className="faq-question">
                  {q}
                  <span className="faq-toggle">{openFaq === id ? '−' : '+'}</span>
                </div>
                {openFaq === id && <div className="faq-answer">{a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <h2>Ready to Take Control of Your Finances?</h2>
            <p>Join 10,000+ users who have transformed their financial lives with SmartFinance. It's completely free to start.</p>
            <div className="cta-buttons">
              <Link to="/register" className="btn btn-primary">Create Free Account →</Link>
              <Link to="/login" className="btn btn-outline-white">Sign In</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="footer-section" id="footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-brand">
              <div className="footer-logo">💎 SmartFinance</div>
              <p>Your complete personal finance platform. Track, plan, and grow your wealth.</p>
              <div className="footer-social">
                <a href="#" className="social-icon">Twitter</a>
                <a href="#" className="social-icon">LinkedIn</a>
                <a href="#" className="social-icon">GitHub</a>
              </div>
            </div>
            <div className="footer-links-grid">
              <div>
                <h4>Product</h4>
                <ul>
                  <li><Link to="/dashboard">Dashboard</Link></li>
                  <li><Link to="/expenses">Expenses</Link></li>
                  <li><Link to="/budgets">Budgets</Link></li>
                  <li><Link to="/goals">Goals</Link></li>
                  <li><Link to="/investments">Investments</Link></li>
                </ul>
              </div>
              <div>
                <h4>Account</h4>
                <ul>
                  <li><Link to="/login">Sign In</Link></li>
                  <li><Link to="/register">Register</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} SmartFinance. All rights reserved. Built with the MERN Stack.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
