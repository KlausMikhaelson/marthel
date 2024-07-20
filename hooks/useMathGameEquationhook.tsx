import { useState, useRef, useEffect } from "react";

export const useEquationGame = (rows: number, cols: number) => {
  const [equations, setEquations] = useState<string[][]>(
    Array(rows).fill("").map(() => Array(cols).fill(""))
  );
  const inputRefs = useRef<(HTMLInputElement | null)[][]>(
    Array(rows).fill(null).map(() => Array(cols).fill(null))
  );
  const [currentRow, setCurrentRow] = useState(0);
  const allowedCharacters = "0123456789+-*/";

  const handleInputChange = ({ row, col, value }: { row: number; col: number; value: string }) => {
    if (!allowedCharacters.includes(value)) return;

    const newEquations = equations.map((r, rIndex) =>
      r.map((c, cIndex) => (rIndex === row && cIndex === col ? value : c))
    );
    setEquations(newEquations);

    if (value && col < cols - 1) {
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

  const handleKeyDown = ({ row, col, key }: { row: number; col: number; key: string }) => {
    if (key === "Enter") {
      handleSubmit();
    } else if (key === "Backspace") {
      const newEquations = equations.map((r, rIndex) =>
        r.map((c, cIndex) => (rIndex === row && cIndex === col ? "" : c))
      );
      setEquations(newEquations);

      if (col > 0 && !equations[row][col]) {
        const prevInput = inputRefs.current[row][col - 1];
        prevInput?.focus();
      }
    }
  };

  const handleButtonClick = (char: string) => {
    const row = currentRow;
    const col = equations[currentRow].findIndex((val) => val === "");
    if (col === -1) return; // All columns are filled

    handleInputChange({ row, col, value: char });
  };

  const handleSubmit = async () => {
    const equation = equations[currentRow].join("").trim();
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
        const currentInputs = inputRefs.current[currentRow];
        currentInputs.forEach((input) => {
          if (input) input.style.backgroundColor = "green";
        });
        alert("You won the game!");
      } else {
        for (let i = 0; i < equation.length; i++) {
          const currentInput = inputRefs.current[currentRow][i];
          if (result.feedback[i] === "correct") {
            if (currentInput) currentInput.style.backgroundColor = "green";
          } else if (result.feedback[i] === "wrong-position") {
            if (currentInput) currentInput.style.backgroundColor = "orange";
          } else {
            if (currentInput) currentInput.style.backgroundColor = "red";
          }
        }
      }

      if (currentRow < rows - 1) {
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

  useEffect(() => {
    // Focus the first input box when the component mounts
    if (inputRefs.current[0][0]) {
      inputRefs.current[0][0].focus();
    }
  }, []);

  return {
    equations,
    inputRefs,
    currentRow,
    handleInputChange,
    handleKeyDown,
    handleButtonClick,
    handleSubmit,
  };
};
