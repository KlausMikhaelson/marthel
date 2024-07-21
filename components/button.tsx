import React from "react";

interface ButtonProps {
  char: string;
  onClick: () => void;
  color: string;
}

const Button: React.FC<ButtonProps> = ({ char, onClick, color }) => {
  return (
    <button onClick={onClick} className={`px-4 py-2 ${color} text-white rounded shadow-lg shadow-gray-900`}>
      {char}
    </button>
  );
};

export default Button;
