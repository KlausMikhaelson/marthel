import { useState, useRef, useEffect } from "react";

export const useEquationGame = (rows: number, cols: number) => {
  const [equations, setEquations] = useState<string[][]>(
    Array(rows).fill("").map(() => Array(cols).fill(""))
  );
  const [won, setWon] = useState(false);
  const [chosenNumber, setChosenNumber] = useState<number | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[][]>(
    Array(rows).fill(null).map(() => Array(cols).fill(null))
  );
  const [currentRow, setCurrentRow] = useState(0);
  const allowedCharacters = "0123456789+-*/";
  const possibleResults = [100, 23, 194, 33];

  useEffect(() => {
    // Chooses a random number when the component mounts
    const randomIndex = Math.floor(Math.random() * possibleResults.length);
    setChosenNumber(possibleResults[randomIndex]);
  }, []);

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

  const evaluateEquation = (equation: string): number => {
    try {
      // Using Function constructor to create a new function for evaluation
      return new Function(`return ${equation}`)();
    } catch {
      return NaN;
    }
  };

  const handleSubmit = async () => {
    const equation = equations[currentRow].join("").trim();
    if (!chosenNumber) {
      alert("Chosen number is not set.");
      return;
    }

    // Check if the equation evaluates to the chosen number
    const result = evaluateEquation(equation);
    if (result !== chosenNumber) {
      alert("The result of the equation does not match the chosen number. Please make changes in the current row.");
      return;
    }

    // Proceed with API request if the result matches
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("stringiFied", equation);
    headers.append("chosenNumber", chosenNumber.toString());

    try {
      const response = await fetch("/api", {
        method: "POST",
        headers: headers,
      });
      const result = await response.json();

      if (result.correct) {
        const currentInputs = inputRefs.current[currentRow];
        currentInputs.forEach((input) => {
          if (input) input.style.backgroundColor = "green";
        });
        setWon(true);
      } else {
        for (let i = 0; i < equation.length; i++) {
          const currentInput = inputRefs.current[currentRow][i];
          if (result.feedback[i] === "correct") {
            if (currentInput) currentInput.style.backgroundColor = "#4CAF50";
          } else if (result.feedback[i] === "wrong-position") {
            if (currentInput) currentInput.style.backgroundColor = "#E2B53F";
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
    won,
    chosenNumber,
  };
};
