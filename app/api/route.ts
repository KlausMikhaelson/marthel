export const POST = async(req: Request, res: Response) => {
    const equation = req.headers.get("stringiFied");
    // console.log(equation, req.body);
    const expectedEquation = ["1", "0", "+", "2", "x", "-"];

    if (!equation || equation.length !== expectedEquation.length) {
        return new Response(JSON.stringify({ correct: false, feedback: [] }), {
            headers: { "Content-Type": "application/json" },
        });
    }

    const feedback = [];
    let correct = true;

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

    // res.status(200).json({ correct: correct && equation.length === expectedEquation.length, feedback });
    return new Response(JSON.stringify({ correct: correct && equation.length === expectedEquation.length, feedback }), {
        headers: { "Content-Type": "application/json" },
    });
}
