"use client";
import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [equations, setEquations] = useState(Array(5).fill("").map(() => Array(6).fill("")));
  const inputRefs = useRef(Array(5).fill(null).map(() => Array(6).fill(null)));
  const [currentRow, setCurrentRow] = useState(0);

  const handleInputChange = ({ row, col, value }) => {
    const newEquations = equations.map((r, rIndex) =>
      r.map((c, cIndex) => (rIndex === row && cIndex === col ? value : c))
    );
    setEquations(newEquations);

    if (value && col < 5) {
      const nextInput = inputRefs.current[row][col + 1];
      nextInput?.focus();
    }

    const currentInput = inputRefs.current[row][col];
    if (currentInput) {
      currentInput.classList.add("pop");
      setTimeout(() => {
        currentInput.classList.remove("pop");
      }, 200);
    }
  };

  const handleKeyDown = ({ row, col, key }) => {
    if (key === "Backspace" && !equations[row][col] && col > 0) {
      const prevInput = inputRefs.current[row][col - 1];
      const newEquations = equations.map((r, rIndex) =>
        r.map((c, cIndex) => (rIndex === row && cIndex === col - 1 ? "" : c))
      );
      setEquations(newEquations);
      prevInput?.focus();
    }
  };

  const handleSubmit = async () => {
    console.log("Submitting...");
    const equation = equations[currentRow].join("").trim();
    const stringiFied = JSON.stringify({ equation });
    console.log(stringiFied);
    try {
      const response = await fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          stringiFied: equation,
        },
      });
      const result = await response.json();

      if (result.correct) {
        alert("You won the game!");
      } else {
        for (let i = 0; i < equation.length; i++) {
          const currentInput = inputRefs.current[currentRow][i];
          if (result.feedback[i] === "correct") {
            currentInput.style.backgroundColor = "green";
          } else if (result.feedback[i] === "wrong-position") {
            currentInput.style.backgroundColor = "orange";
          } else {
            currentInput.style.backgroundColor = "red";
          }
        }
      }

      if (currentRow < 4) {
        setCurrentRow(currentRow + 1);
      } else {
        alert("Game over! Try again.");
      }
    } catch (e) {
      alert("An error occurred while checking the equation");
    }
  };

  useEffect(() => {
    console.log(equations);
  }, [equations]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <h1 className="text-4xl font-bold mb-8">Marthel</h1>
      <div className="grid grid-rows-5 gap-2">
        {equations.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-6 gap-2">
            {row.map((guess, colIndex) => (
              <input
                key={colIndex}
                type="text"
                maxLength={1}
                value={guess}
                onChange={(e) => handleInputChange({ row: rowIndex, col: colIndex, value: e.target.value })}
                onKeyDown={(e) => handleKeyDown({ row: rowIndex, col: colIndex, key: e.key })}
                ref={(el) => {
                  inputRefs.current[rowIndex][colIndex] = el;
                }}
                className="text-black rounded-lg w-12 h-12 border-2 border-gray-300 text-center text-xl font-bold"
                disabled={rowIndex !== currentRow}
              />
            ))}
          </div>
        ))}
      </div>
      <button onClick={handleSubmit} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Submit
      </button>
    </div>
  );
}
