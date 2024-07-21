export const POST = async (req: Request, res: Response) => {
  const equation = req.headers.get("stringiFied");
  const chosenNumber = req.headers.get("chosenNumber");

  if (!equation || !chosenNumber) {
    return new Response(JSON.stringify({ correct: false, feedback: [] }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  // Hardcoded expected equations for specific chosen numbers
  const expectedEquations: { [key: string]: string[] } = {
    "100": ["5", "0", "+", "0", "5", "0"],
    "23": ["1", "+", "9", "+", "1", "3"],
    "194": ["1", "2", "0", "+", "7", "4"],
    "33": ["2", "4", "*", "1", "+", "9"],
    "27": ["9", "5", "/", "5", "+", "8"]
  };

  const expectedEquation = expectedEquations[chosenNumber] || [];
  const expectedEquationCopy = [...expectedEquation];

  // Function to check if the equation is complete, using regex
  const isEquationComplete = (equation: string) => {
    const numbersAndOperators = /^[0-9+\-*/]+$/;
    return numbersAndOperators.test(equation);
  };

  // Initialize feedback
  // TODO: add type for feedback
  const feedback = [];
  let correct = true;

  // Check each character against the expected equation
  for (let i = 0; i < equation.length; i++) {
    const char = equation[i];
    const indexOfSelected = expectedEquationCopy.indexOf(char);
    if (indexOfSelected !== -1) {
      if (char === expectedEquation[i]) {
        feedback.push("correct");
        expectedEquationCopy.splice(indexOfSelected, 1);
      } else {
        feedback.push("wrong-position");
        correct = false;
        expectedEquationCopy.splice(indexOfSelected, 1);
      }
    } else {
      feedback.push("incorrect");
      correct = false;
    }
  }

  if (expectedEquationCopy.length === 0 && isEquationComplete(equation)) {
    const evaluatedResult = evaluateEquation(equation);
    if (evaluatedResult !== parseInt(chosenNumber, 10)) {
      correct = false;
    } else {
      correct = true;
    }
  } else {
    correct = false;
  }

  return new Response(JSON.stringify({ correct, feedback }), {
    headers: { "Content-Type": "application/json" },
  });
};

// Function to evaluate the equation string
const evaluateEquation = (equation: string): number => {
  try {
    return new Function(`return ${equation}`)();
  } catch {
    return NaN;
  }
};