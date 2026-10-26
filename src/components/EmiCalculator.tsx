import React, { useState, useMemo } from 'react';
import { Calculator, Percent, Clock, IndianRupee, HelpCircle } from 'lucide-react';

interface EmiCalculatorProps {
  propertyPrice?: number; // Starting price in INR
  onLoanEnquiry?: () => void;
}

export const EmiCalculator: React.FC<EmiCalculatorProps> = ({
  propertyPrice = 35000000,
  onLoanEnquiry
}) => {
  // Default loan amount: 80% of property price
  const defaultLoan = Math.round(propertyPrice * 0.8);
  const [loanAmount, setLoanAmount] = useState<number>(defaultLoan);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [tenureYears, setTenureYears] = useState<number>(20);

  // EMI formula: E = P * r * (1 + r)^n / ((1 + r)^n - 1)
  const calculation = useMemo(() => {
    const P = loanAmount;
    const r = interestRate / 12 / 100;
    const n = tenureYears * 12;

    if (P <= 0 || r <= 0 || n <= 0) {
      return { emi: 0, totalPayment: 0, totalInterest: 0, principalRatio: 50 };
    }

    const emi = Math.round((P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;
    const principalRatio = Math.round((P / totalPayment) * 100);

    return {
      emi,
      totalPayment,
      totalInterest,
      principalRatio
    };
  }, [loanAmount, interestRate, tenureYears]);

  const formatINR = (val: number): string => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    }
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)} Lakhs`;
    }
    return `₹${val.toLocaleString('en-IN')}`;
  };

  return (
    <div className="bg-gradient-to-br from-amber-50/90 via-white to-amber-100/60 text-slate-900 rounded-3xl p-6 sm:p-8 border border-amber-200/90 shadow-xs">
      <div className="flex items-center justify-between mb-6 border-b border-amber-200/70 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center border border-amber-300 shadow-xs">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif-display text-xl font-bold text-slate-900">
              Home Loan & EMI Estimator
            </h3>
            <p className="text-xs text-slate-600">
              Calculate expected monthly outgo with leading institutional lending rates
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-block text-[11px] font-mono font-bold bg-amber-100 text-amber-950 px-3 py-1 rounded-full border border-amber-300">
          Max 80% LTV
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Sliders Input Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Loan Amount Slider */}
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <IndianRupee className="w-3.5 h-3.5 text-amber-600" />
                Loan Amount
              </span>
              <span className="font-mono text-sm font-bold text-amber-900 bg-white px-3 py-1 rounded-lg border border-amber-200 shadow-xs">
                {formatINR(loanAmount)}
              </span>
            </div>
            <input
              type="range"
              min={1000000}
              max={Math.max(100000000, propertyPrice)}
              step={500000}
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full accent-amber-600 bg-slate-200 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1 font-mono font-medium">
              <span>₹10 Lakhs</span>
              <span>{formatINR(Math.max(100000000, propertyPrice))}</span>
            </div>
          </div>

          {/* Interest Rate Slider */}
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <Percent className="w-3.5 h-3.5 text-amber-600" />
                Interest Rate (p.a.)
              </span>
              <span className="font-mono text-sm font-bold text-amber-900 bg-white px-3 py-1 rounded-lg border border-amber-200 shadow-xs">
                {interestRate}%
              </span>
            </div>
            <input
              type="range"
              min={7.5}
              max={12}
              step={0.1}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full accent-amber-600 bg-slate-200 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1 font-mono font-medium">
              <span>7.5%</span>
              <span>12.0%</span>
            </div>
          </div>

          {/* Tenure Slider */}
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                Loan Tenure (Years)
              </span>
              <span className="font-mono text-sm font-bold text-amber-900 bg-white px-3 py-1 rounded-lg border border-amber-200 shadow-xs">
                {tenureYears} Years ({tenureYears * 12} Months)
              </span>
            </div>
            <input
              type="range"
              min={5}
              max={30}
              step={1}
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
              className="w-full accent-amber-600 bg-slate-200 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1 font-mono font-medium">
              <span>5 Years</span>
              <span>30 Years</span>
            </div>
          </div>
        </div>

        {/* Results & Visual Breakdown Column - Bright Clean White Card */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-amber-200/90 shadow-md space-y-5">
          <div>
            <span className="text-[11px] uppercase font-bold text-amber-800 tracking-wider">
              Estimated Monthly EMI
            </span>
            <div className="font-serif-display text-3xl sm:text-4xl font-bold text-slate-950 mt-1">
              ₹{calculation.emi.toLocaleString('en-IN')}
              <span className="text-xs font-normal text-slate-500 ml-1">/ month</span>
            </div>
          </div>

          {/* Breakdown Stats */}
          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Principal Amount:</span>
              <span className="font-mono font-bold text-slate-900">{formatINR(loanAmount)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Total Interest Payable:</span>
              <span className="font-mono font-bold text-amber-700">{formatINR(calculation.totalInterest)}</span>
            </div>
            <div className="flex justify-between text-slate-700 font-bold pt-1.5 border-t border-slate-100">
              <span>Total Repayment:</span>
              <span className="font-mono text-slate-950">{formatINR(calculation.totalPayment)}</span>
            </div>
          </div>

          {/* Visual Bar Ratio */}
          <div>
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
              <div 
                style={{ width: `${calculation.principalRatio}%` }} 
                className="bg-amber-500 transition-all duration-300" 
                title={`Principal: ${calculation.principalRatio}%`}
              />
              <div 
                style={{ width: `${100 - calculation.principalRatio}%` }} 
                className="bg-amber-300 transition-all duration-300" 
                title={`Interest: ${100 - calculation.principalRatio}%`}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1.5 font-mono">
              <span className="flex items-center gap-1 font-semibold text-slate-700">
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Principal ({calculation.principalRatio}%)
              </span>
              <span className="flex items-center gap-1 font-semibold text-slate-700">
                <span className="w-2 h-2 rounded-full bg-amber-300 inline-block" /> Interest ({100 - calculation.principalRatio}%)
              </span>
            </div>
          </div>

          {/* Action CTA */}
          {onLoanEnquiry && (
            <button
              onClick={onLoanEnquiry}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/25 active:scale-95"
            >
              <span>Apply for Pre-Approved Home Loan</span>
            </button>
          )}

          <p className="text-[10px] text-slate-500 leading-tight">
            *Indicative estimation only. Actual interest rates, processing fees, and loan limits are determined by participating banks based on credit score.
          </p>
        </div>
      </div>
    </div>
  );
};
