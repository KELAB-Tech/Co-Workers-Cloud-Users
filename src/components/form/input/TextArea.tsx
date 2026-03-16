import React from "react";

interface TextareaProps {
  label?: string;
  name?: string;
  placeholder?: string;
  rows?: number;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  disabled?: boolean;
  error?: boolean;
  hint?: string;
}

const TextArea: React.FC<TextareaProps> = ({
  label,
  name,
  placeholder = "Enter your message",
  rows = 3,
  value = "",
  onChange,
  className = "",
  disabled = false,
  error = false,
  hint = "",
}) => {

  let textareaClasses = `w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs focus:outline-none ${className}`;

  if (disabled) {
    textareaClasses += ` bg-gray-100 opacity-50 text-gray-500 border-gray-300 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700`;
  } else if (error) {
    textareaClasses += ` bg-transparent text-gray-700 border-gray-300 focus:border-error-300 focus:ring-2 focus:ring-error-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white`;
  } else {
    textareaClasses += ` bg-transparent text-gray-700 border-gray-300 focus:border-brand-300 focus:ring-2 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white`;
  }

  return (
    <div className="space-y-1.5">
      
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}

      <textarea
        name={name}
        placeholder={placeholder}
        rows={rows}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={textareaClasses}
      />

      {hint && (
        <p
          className={`text-xs ${
            error ? "text-red-500" : "text-gray-500 dark:text-gray-400"
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
};

export default TextArea;