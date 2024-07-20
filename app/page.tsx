"use client";
import React from "react";
import InputBox from "@/components/inputbox";
import Button from "@/components/button";
import { useEquationGame } from "@/hooks/useMathGameEquationhook";
import Confetti from "react-confetti";

export default function Home() {
  const {
    equations,
    inputRefs,
    currentRow,
    handleInputChange,
    handleKeyDown,
    handleButtonClick,
    handleSubmit,
    won,
    chosenNumber
  } = useEquationGame(5, 6);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <h1 className="text-4xl font-bold mb-8 text-white font-serif">Marthel</h1>
      <div className="text-2xl text-white mb-4">
        Solve for: {chosenNumber}
      </div>
      <div className="grid grid-rows-5 gap-2">
        {equations.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-6 gap-2">
            {row.map((guess, colIndex) => (
              <InputBox
                key={colIndex}
                value={guess}
                disabled={rowIndex !== currentRow}
                onChange={(e) =>
                  handleInputChange({ row: rowIndex, col: colIndex, value: e.target.value })
                }
                onKeyDown={(e) => handleKeyDown({ row: rowIndex, col: colIndex, key: e.key })}
                inputRef={(el) => {
                  inputRefs.current[rowIndex][colIndex] = el;
                }}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        {"0123456789".split("").map((char) => (
          <Button key={char} char={char} onClick={() => handleButtonClick(char)} color="bg-blue-500" />
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        {["+", "-", "*", "/"].map((char) => (
          <Button key={char} char={char} onClick={() => handleButtonClick(char)} color="bg-yellow-500" />
        ))}
      </div>
      <Button char="Submit" onClick={handleSubmit} color="m-2 bg-green-500" />
      {won && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
        />
      )}
    </div>
  );
}
