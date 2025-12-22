import React, { useRef, useState, useEffect } from "react";

type OtpInputProps = {
    length?: number;
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
};

export default function OtpInput({ length = 6, value, onChange, disabled = false }: OtpInputProps) {
    const [digits, setDigits] = useState<string[]>(new Array(length).fill(""));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        // Sync outside value to internal state if needed (e.g. initial load or clear)
        const newDigits = value.split("").slice(0, length);
        while (newDigits.length < length) newDigits.push("");
        setDigits(newDigits);
    }, [value, length]);

    const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (isNaN(Number(val))) return;

        const newDigits = [...digits];
        // Take the last character entered
        newDigits[index] = val.substring(val.length - 1);
        setDigits(newDigits);
        onChange(newDigits.join(""));

        // Move to next input if value is entered
        if (val && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        // Backspace: if empty, move to previous
        if (e.key === "Backspace" && !digits[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (disabled) return;
        const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
        if (!pastedData) return;

        const newDigits = [...digits];
        for (let i = 0; i < pastedData.length; i++) {
            newDigits[i] = pastedData[i];
        }
        setDigits(newDigits);
        onChange(newDigits.join(""));

        // Focus the box after the last pasted digit
        const nextIndex = Math.min(pastedData.length, length - 1);
        inputRefs.current[nextIndex]?.focus();
    };

    return (
        <div className="flex gap-2 justify-center">
            {digits.map((digit, index) => (
                <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    disabled={disabled}
                    className={`w-10 h-12 text-center text-xl font-bold border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${digit ? "border-purple-500 bg-purple-50" : "border-gray-300 bg-white"
                        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                />
            ))}
        </div>
    );
}
