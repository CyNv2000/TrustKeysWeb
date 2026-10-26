import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Phone, Calendar, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
import { submitEnquiry } from '../lib/api';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProjectRef?: string;
  defaultRequirement?: string;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  defaultProjectRef,
  defaultRequirement = 'General Enquiry'
}) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [requirement, setRequirement] = useState(defaultRequirement);
  const [preferredDate, setPreferredDate] = useState('');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successResponse, setSuccessResponse] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!name.trim() || name.trim().length < 2) {
      setErrorMessage('Please enter your full name (minimum 2 characters).');
      return;
    }

    const cleanMobile = mobile.replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      let finalMessage = message.trim();
      if (preferredDate) {
        finalMessage = `Preferred Site Visit Date: ${preferredDate}. ${finalMessage}`;
      }

      const res = await submitEnquiry({
        name: name.trim(),
        mobile: cleanMobile,
        email: email.trim(),
        requirement,
        projectRef: defaultProjectRef,
        message: finalMessage || undefined
      });

      setSuccessResponse(res.message);
      setIsSubmitting(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'Submission failed. Please check your network and try again.');
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setName('');
    setMobile('');
    setEmail('');
    setPreferredDate('');
    setMessage('');
    setSuccessResponse(null);
    setErrorMessage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-100 animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={handleReset}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {successResponse ? (
          /* Success Screen */
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif-display text-2xl font-bold text-stone-900 mb-2">
              Enquiry Registered
            </h3>
            <p className="text-sm text-stone-600 mb-6 leading-relaxed">
              {successResponse}
            </p>
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-xs text-stone-600 text-left mb-6 space-y-1.5">
              <div className="flex items-center gap-2 font-semibold text-stone-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Zero Spam Guarantee</span>
              </div>
              <p>Your details are shared solely with your assigned Senior Western Mumbai Advisor. We do not distribute your contact to third-party telemarketers.</p>
            </div>
            <button
              onClick={handleReset}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-white font-bold text-sm shadow-md shadow-amber-500/25 transition-all active:scale-[0.99]"
            >
              Done
            </button>
          </div>
        ) : (
          /* Form */
          <div>
            <div className="mb-6">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                Priority Advisory
              </span>
              <h3 className="font-serif-display text-2xl font-bold text-stone-900 mt-2">
                {defaultProjectRef ? `Enquire for ${defaultProjectRef}` : 'Connect with a Western Mumbai Specialist'}
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Get developer direct pricing, confidential floor plans, and VIP site visit arrangements.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-800">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Intent / Requirement */}
              <div>
                <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">
                  Nature of Enquiry
                </label>
                <select
                  value={requirement}
                  onChange={(e) => setRequirement(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="Schedule Site Visit">Schedule a Private Site Visit</option>
                  <option value="Instant Callback">Request Urgent Callback</option>
                  <option value="Download Brochure">Download Verified Brochure & Price Sheet</option>
                  <option value="Pricing & Negotiation">Pricing & Payment Plan Negotiation</option>
                  <option value="General Enquiry">General Inquiry & Floor Plans</option>
                </select>
              </div>

              {requirement === 'Schedule Site Visit' && (
                <div>
                  <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">
                    Preferred Visit Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <Calendar className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Contact Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">
                    Mobile Number *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-stone-500">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="98200 12345"
                      maxLength={14}
                      className="w-full pl-11 pr-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">
                  Specific Requirements (Optional)
                </label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Mention preferred floor level, budget ceiling, or specific questions..."
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md shadow-amber-900/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Connecting with Advisory...</span>
                  </>
                ) : (
                  <>
                    <span>Submit & Request Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
                <span>RERA Compliant Advisory</span>
                <a href="tel:+919820198765" className="hover:text-amber-700 flex items-center gap-1 font-medium">
                  <Phone className="w-3 h-3 text-amber-600" />
                  <span>Direct Hotline: +91 98201 98765</span>
                </a>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
