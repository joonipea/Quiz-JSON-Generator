import React, { useRef, useState, useEffect } from "react";
import "./App.css";

const App = () => {
    const parent = useRef(null);
    const resContainer = useRef(null);
    const [resContainerHTML, setResContainerHTML] = useState([]);
    const jsonContainer = useRef(null);

    const [questions, setQuestions] = useState([]);
    const [responses, setResponses] = useState({});
    const [numberOfQuestions, setNumberOfQuestions] = useState(0);
    const [numberOfResponses, setNumberOfResponses] = useState(0);

    const [formated, setFormatted] = useState(false);
    const [step, setStep] = useState(0);

    function generateResponse() {
        setNumberOfResponses((oldnum) => oldnum + 1);
        const idx = numberOfResponses;
        const response = (
            <div className="response-holder">
                <input
                    type="text"
                    id={`response-${idx}`}
                    className="response-name"
                    placeholder="Response Name"></input>

                <textarea
                    id={`response-text-${idx}`}
                    className="responseText"
                    placeholder="Response HTML"></textarea>

                <button onClick={removeResponse} className="remove-button">
                    Remove
                </button>
            </div>
        );
        setResContainerHTML((oldhtml) => [...oldhtml, response]);
    }

    function removeResponse(e) {
        setNumberOfResponses((oldnum) => oldnum - 1);
        e.target.parentNode.remove();
    }

    async function handleResponseSubmission() {
        let responsesObj = {};
        for (let i = 0; i < numberOfResponses; i++) {
            responsesObj[document.getElementById(`response-${i}`).value] =
                document.getElementById(`response-text-${i}`).value;
        }
        setResponses(responsesObj);
        setStep(1);
        setResContainerHTML([]);
    }

    function generateQuestion() {
        setNumberOfQuestions((oldnum) => oldnum + 1);
        const idx = numberOfQuestions;
        const choices = [];
        for (let resKey of Object.keys(responses)) {
            choices.push({
                label: <label>Choice for {resKey}</label>,
                input: (
                    <input
                        type="text"
                        id={`choice-${idx}-${resKey}`}
                        className="choice"></input>
                ),
            });
        }

        const question = (
            <div className="question-holder">
                <input
                    type="text"
                    id={`question-${idx}`}
                    className="question-name"
                    placeholder="Question Name"></input>
                {choices.map((choice) => {
                    return (
                        <>
                            {choice.label}
                            {choice.input}
                        </>
                    );
                })}
            </div>
        );
        setResContainerHTML((oldhtml) => [...oldhtml, question]);
    }

    async function handleQuestionSubmission() {
        for (let i = 0; i < numberOfQuestions; i++) {
            const question = {
                question: document.getElementById(`question-${i}`).value,
                choices: [],
            };
            for (let resKey of Object.keys(responses)) {
                question.choices.push({
                    text: document.getElementById(`choice-${i}-${resKey}`)
                        .value,
                    value: resKey,
                });
            }
            setQuestions((oldQuestions) => [...oldQuestions, question]);
        }
        console.log(questions);
        setFormatted(true);
    }

    useEffect(() => {
        if (formated && numberOfQuestions === questions.length) {
            jsonContainer.current.innerText = populateHTML(
                questions,
                responses
            );
        }
    }, [formated, questions]);

    return (
        <div ref={parent}>
            <div ref={resContainer}>
                {resContainerHTML}
                {step === 0 ? (
                    <button
                        onClick={() => generateResponse()}
                        type="button"
                        class="add-question-button"
                        id="add-response">
                        Add Response
                    </button>
                ) : (
                    <button
                        onClick={() => generateQuestion()}
                        type="button"
                        class="add-question-button">
                        Add Question
                    </button>
                )}
                <button
                    class="submit-button"
                    onClick={
                        step === 0
                            ? handleResponseSubmission
                            : handleQuestionSubmission
                    }
                    type="submit">
                    Next Step
                </button>
            </div>
            <div ref={jsonContainer}></div>
        </div>
    );
};

function populateHTML(questions, responses) {
    return `<style>
    .question-holder {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 100%;
    }

    .choice-holder {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 3rem;
        border: 1px solid var(--color-text);
        margin: 0.5rem 0;
        cursor: pointer;
    }

    .choice-holder.selected {
        background-color: #e6e6e6;
        cursor: default;
    }

    .choice-holder:hover {
        background-color: #e6e6e6;
    }

    .back-button,
    .next-button {
        width: 50%;
        height: 3rem;
        margin: 0.5rem 0;
        cursor: pointer;
        border: 1px solid var(--color-text);
    }

    .back-button {
        float: left;
    }

    .next-button {
        float: right;
    }

    .back-button:hover,
    .next-button:hover {
        background-color: #e6e6e6;
    }

    .retry-button {
        width: 100%;
        height: 3rem;
        margin: 0.5rem 0;
        cursor: pointer;
        border: 1px solid var(--color-text);
    }

    .retry-button:hover {
        background-color: #e6e6e6;
    }
</style>

<div>
    <p>
        Gemstones have captivated humanity for centuries, not only for their
        exquisite beauty but also for the unique energies and symbolism they
        carry. Just like each gemstone holds its own story, you too have your
        own distinct personality and preferences. Our gemstone quiz will take
        you on a journey to uncover the gemstone that resonates most with your
        inner self. Based on your responses to a series of questions, you'll
        uncover the gemstone that mirrors your characteristics, desires, and
        energies. Whether you're drawn to the fiery passion of Ruby, the calming
        tranquility of Aquamarine, the lush allure of Emerald, the mystical
        energy of Moonstone, or the captivating play of colors in Opal, you're
        bound to find a gemstone that aligns with your essence. So, let's embark
        on this adventure and reveal the gemstone that truly defines you."
    </p>
    <h3>Which Stone Reflects Your Personality?</h3>
    <div class="quiz-holder"></div>
    <div class="response-holder"></div>
</div>

<script>
    const questions = ${JSON.stringify(questions)};
    const responses = ${JSON.stringify(responses)};

    const quizHolder = document.querySelector(".quiz-holder");
    const responseHolder = document.querySelector(".response-holder");
    let answers = [];
    let currentQuestion = 0;
    function Quiz(question, i) {
        const questionHolder = document.createElement("div");
        questionHolder.classList.add("question-holder");

        const questionText = document.createElement("p");
        questionText.classList.add("question-text");
        questionText.innerText =
            i + 1 + " / " + questions.length + " " + question.question;

        questionHolder.appendChild(questionText);

        for (let choice of shuffle(question.choices)) {
            const choiceHolder = document.createElement("div");
            choiceHolder.classList.add("choice-holder");
            choiceHolder.innerText = choice.text;
            if (answers[i] == choice.value) {
                choiceHolder.classList.add("selected");
            }
            choiceHolder.addEventListener("click", () => {
                answers[currentQuestion] = choice.value;
                currentQuestion++;
                if (currentQuestion < questions.length) {
                    quizHolder.innerHTML = "";
                    Quiz(questions[currentQuestion], currentQuestion);
                } else {
                    quizHolder.innerHTML = "";
                    Response(answers);
                }
            });
            questionHolder.appendChild(choiceHolder);
        }

        const backButton = document.createElement("button");
        backButton.classList.add("back-button");
        backButton.innerText = "Back";
        backButton.addEventListener("click", () => {
            Back();
        });
        if (currentQuestion != 0) {
            quizHolder.appendChild(backButton);
        }

        const nextButton = document.createElement("button");
        nextButton.classList.add("next-button");
        nextButton.innerText = "Next";
        nextButton.addEventListener("click", () => {
            Next();
        });
        if (answers[currentQuestion] == undefined) {
            nextButton.disabled = true;
        } else {
            nextButton.disabled = false;
        }
        if (currentQuestion != questions.length - 1) {
            quizHolder.appendChild(nextButton);
        }

        quizHolder.appendChild(questionHolder);
    }

    function Back() {
        currentQuestion--;
        quizHolder.innerHTML = "";
        Quiz(questions[currentQuestion], currentQuestion);
    }

    function Next() {
        currentQuestion++;
        quizHolder.innerHTML = "";
        Quiz(questions[currentQuestion], currentQuestion);
    }

    function Response(answers) {
        const retryButton = document.createElement("button");
        retryButton.classList.add("retry-button");
        retryButton.innerText = "Try Again?";
        retryButton.addEventListener("click", () => {
            retry();
        });
        responseHolder.appendChild(retryButton);

        const responseText = document.createElement("p");
        responseText.classList.add("response-text");
        const mostFrequentAnswer =
            responses[mostFrequent(answers, answers.length)];
        responseText.innerHTML = mostFrequentAnswer;
        responseHolder.appendChild(responseText);
    }

    function retry() {
        currentQuestion = 0;
        answers = [];
        responseHolder.innerHTML = "";
        Quiz(questions[currentQuestion], currentQuestion);
    }

    Quiz(questions[currentQuestion], currentQuestion);

    function mostFrequent(arr, n) {
        var hash = new Map();
        for (var i = 0; i < n; i++) {
            if (hash.has(arr[i])) hash.set(arr[i], hash.get(arr[i]) + 1);
            else hash.set(arr[i], 1);
        }
        var max_count = 0,
            res = -1;
        hash.forEach((value, key) => {
            if (max_count < value) {
                res = key;
                max_count = value;
            }
        });

        return res;
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
</script>`;
}

export default App;
