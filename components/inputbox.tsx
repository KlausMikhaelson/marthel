import React from "react";

interface InputBoxProps {
  value: string;
  disabled: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  inputRef: (el: HTMLInputElement | null) => void;
}

const InputBox: React.FC<InputBoxProps> = ({ value, disabled, onChange, onKeyDown, inputRef }) => {
  return (
    <input
      type="text"
      maxLength={1}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      ref={inputRef}
      className="text-black rounded-lg w-12 h-12 border-2 border-gray-300 text-center text-xl font-bold transition-colors duration-500"
      disabled={disabled}
    />
  );
};

export default InputBox;
