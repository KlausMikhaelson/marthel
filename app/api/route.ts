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
      "23": ["1", "2", "+", "1", "2", "0"],     
      "194": ["1", "2", "0", "+", "1", "7", "4"], 
      "33": ["2", "4", "*", "1", "+", "9"]
    };
    
    const expectedEquation = expectedEquations[chosenNumber] || [];
  
    // Function to check if the equation is complete, IK REGEXXX
    const isEquationComplete = (equation: string) => {
      const numbersAndOperators = /^[0-9+\-*/]+$/;
      return numbersAndOperators.test(equation);
    };
  
    // Initialize feedback
    const feedback = [];
    let correct = true;
  
    // Check each character against the expected equation
    for (let i = 0; i < expectedEquation.length; i++) {
      if (equation[i] === expectedEquation[i]) {
        feedback.push("correct");
      } else if (expectedEquation.includes(equation[i])) {
        feedback.push("wrong-position");
        correct = false;
      } else {
        feedback.push("incorrect");
        correct = false;
      }
    }
  
    // Only evaluate the equation if it is complete so that we can actually show those orange and green colors
    if (isEquationComplete(equation)) {
      const evaluatedResult = evaluateEquation(equation);
  
      // Check if the evaluated result matches the chosen number
      if (evaluatedResult !== parseInt(chosenNumber)) {
        correct = false;
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
  