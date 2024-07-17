"use client"
import { useState, useRef } from "react";

interface Guess {
  [key: number]: string;
}

export default function Home() {
  const [guesses, setGuesses] = useState(Array(5).fill("").map(() => Array(6).fill("")));
  const inputRefs = useRef<Array<Array<HTMLInputElement | null>>>(Array(5).fill(null).map(() => Array(6).fill(null)));

  const handleInputChange = ({ row, col, value }: { row: number; col: number; value: string }) => {
    const newGuesses = guesses.map((r, rIndex) =>
      r.map((c, cIndex) => (rIndex === row && cIndex === col ? value : c))
    );
    setGuesses(newGuesses);

    if (value && col < 5) {
      // Move focus to the next input if it exists
      const nextInput = inputRefs.current[row][col + 1];
      nextInput?.focus();
    }
  };

  const handleKeyDown = ({ row, col, key }: { row: number; col: number; key: string }) => {
    if (key === "Backspace" && !guesses[row][col] && col > 0) {
      // Removing value from the previous input and focus it
      const prevInput = inputRefs.current[row][col - 1];
      const newGuesses = guesses.map((r, rIndex) =>
        r.map((c, cIndex) => (rIndex === row && cIndex === col - 1 ? "" : c))
      );
      setGuesses(newGuesses);
      prevInput?.focus();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <h1 className="text-4xl font-bold mb-8">Marthel</h1>
      <div className="grid grid-rows-5 gap-2">
        {/* 5 rows */}
        {guesses.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-6 gap-2">
            {/* 6 columns for each row */}
            {row.map((guess, colIndex) => (
              <input
                key={colIndex}
                type="text"
                maxLength="1"
                value={guess}
                onChange={(e) => handleInputChange({ row: rowIndex, col: colIndex, value: e.target.value })}
                onKeyDown={(e) => handleKeyDown({ row: rowIndex, col: colIndex, key: e.key })}
                ref={(el) => (inputRefs.current[rowIndex][colIndex] = el)}
                className="text-black rounded-lg w-12 h-12 border-2 border-gray-300 text-center text-xl font-bold"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
