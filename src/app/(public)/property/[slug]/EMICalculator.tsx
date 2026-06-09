"use client";

import { useState, useMemo } from "react";
import { formatPrice } from "@/lib/utils";

interface EMICalculatorProps {
  propertyPrice: number;
}

export default function EMICalculator({ propertyPrice }: EMICalculatorProps) {
  // State for sliders
  const [loanPercentage, setLoanPercentage] = useState<number>(80); // Default 80% loan
  const [interestRate, setInterestRate] = useState<number>(8.5); // Default 8.5% rate
  const [tenureYears, setTenureYears] = useState<number>(20); // Default 20 years tenure

  // Computed values
  const loanAmount = useMemo(() => {
    return (propertyPrice * loanPercentage) / 100;
  }, [propertyPrice, loanPercentage]);

  const emiDetails = useMemo(() => {
    const P = loanAmount;
    const r = interestRate / (12 * 100);
    const n = tenureYears * 12;

    if (P <= 0 || r <= 0 || n <= 0) {
      return { emi: 0, totalInterest: 0, totalPayable: 0 };
    }

    const emi = P * r * (Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1));
    const totalPayable = emi * n;
    const totalInterest = totalPayable - P;

    return { emi, totalInterest, totalPayable };
  }, [loanAmount, interestRate, tenureYears]);

  return (
    <div className="select-none">
      <h2 className="text-xl font-semibold mb-6 text-white">EMI Calculator</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        
        {/* Sliders Input */}
        <div className="flex flex-col gap-5">
          {/* Loan Amount slider */}
          <div>
            <div className="flex justify-between text-xs mb-1 font-light">
              <span className="text-gray-400">Loan Amount ({loanPercentage}%)</span>
              <span className="text-white font-semibold">{formatPrice(loanAmount)}</span>
            </div>
            <input
              type="range"
              min={10}
              max={100}
              step={5}
              value={loanPercentage}
              onChange={(e) => setLoanPercentage(Number(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
            />
            <div className="flex justify-between text-[10px] text-gray-500 mt-1 font-light">
              <span>10% (Min)</span>
              <span>100% (Max)</span>
            </div>
          </div>

          {/* Interest Rate slider */}
          <div>
            <div className="flex justify-between text-xs mb-1 font-light">
              <span className="text-gray-400">Interest Rate</span>
              <span className="text-white font-semibold">{interestRate}% p.a.</span>
            </div>
            <input
              type="range"
              min={6}
              max={15}
              step={0.1}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
            />
            <div className="flex justify-between text-[10px] text-gray-500 mt-1 font-light">
              <span>6%</span>
              <span>15%</span>
            </div>
          </div>

          {/* Loan Tenure slider */}
          <div>
            <div className="flex justify-between text-xs mb-1 font-light">
              <span className="text-gray-400">Tenure</span>
              <span className="text-white font-semibold">{tenureYears} Years</span>
            </div>
            <input
              type="range"
              min={5}
              max={30}
              step={1}
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
            />
            <div className="flex justify-between text-[10px] text-gray-500 mt-1 font-light">
              <span>5 Years</span>
              <span>30 Years</span>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col gap-4 text-center md:text-left">
          <div>
            <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1 font-medium">
              Estimated Monthly EMI
            </span>
            <span className="text-2xl font-extrabold text-white">
              {formatPrice(emiDetails.emi)} / month
            </span>
          </div>

          <div className="border-t border-white/5 pt-4 grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] text-gray-500 block font-medium">Principal Loan</span>
              <span className="text-xs font-semibold text-gray-200">
                {formatPrice(loanAmount)}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 block font-medium">Interest Payable</span>
              <span className="text-xs font-semibold text-gray-200">
                {formatPrice(emiDetails.totalInterest)}
              </span>
            </div>
            <div className="col-span-2 border-t border-white/5 pt-3">
              <span className="text-[10px] text-gray-500 block font-medium">Total Payable Amount</span>
              <span className="text-sm font-bold text-white">
                {formatPrice(emiDetails.totalPayable)}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
