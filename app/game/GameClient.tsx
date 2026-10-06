'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';

import Questions from '../components/playerQuestions/Questions';
import Timer from '../components/questionTimer/Timer';
import type { Question, Answer } from './types';

/*
const basketballQuestions: Question[] = [
    {
        question: 'Who won the NBA Finals MVP in 2019?',
        answer: { name: 'Kawhi Leonard', position: 'left' },
        option: 'Klay Thompson',
        imageA: '/images/Kawhi-leonard.jpg',
        imageB: '/images/Klay.jpeg',
    },
    {
        question: 'Who scored 81 points in a single NBA game?',
        answer: { name: 'Kobe Bryant', position: 'right' },
        option: 'Devin Booker',
        imageA: '/images/kobe.jpg',
        imageB: '/images/devin-booker.webp',
    },
    {
        question: "Who is the NBA's all-time leading scorer?",
        answer: { name: 'LeBron James', position: 'left' },
        option: 'Kareem Abdul-Jabbar',
        imageA: '/images/lebron-James.avif',
        imageB: '/images/kareem.avif',
    },
    {
        question: "Who was nicknamed 'The Answer'?",
        answer: { name: 'Allen Iverson', position: 'right' },
        option: 'Tracy McGrady',
        imageA: '/images/Allen-Iverson.avif',
        imageB: '/images/Tracy-McGrady.jpg',
    },
    {
        question: 'Who won the NBA MVP award in 2023?',
        answer: { name: 'Joel Embiid', position: 'left' },
        option: 'Nikola Jokic',
        imageA: '/images/Joel-Embiid.avif',
        imageB: '/images/Nicola-Jokic.avif',
    },
    {
        question: "Who is known for the 'Skyhook' shot?",
        answer: { name: 'Kareem Abdul-Jabbar', position: 'right' },
        option: 'Wilt Chamberlain',
        imageA: '/images/kareem.avif',
        imageB: '/images/Wilt-Chamberlain.webp',
    },
    {
        question: 'Who was the first overall pick in the 2023 NBA Draft?',
        answer: { name: 'Victor Wembanyama', position: 'left' },
        option: 'Chet Holmgren',
        imageA: '/images/Victor-wemby.avif',
        imageB: '/images/chet-holmgren.jpg',
    },
    {
        question: 'Who won Defensive Player of the Year four times?',
        answer: { name: 'Ben Wallace', position: 'right' },
        option: 'Dikembe Mutombo',
        imageA: '/images/ben-wallace.jpg',
        imageB: '/images/Dikembe-Mutombo.jpg',
    },
    {
        question: "Who hit 'The Shot' over Craig Ehlo in 1989?",
        answer: { name: 'Michael Jordan', position: 'left' },
        option: 'Magic Johnson',
        imageA: '/images/michael-jordan.webp',
        imageB: '/images/magic-johnson-solo.avif',
    },
    {
        question: 'Who holds the NBA record for most career three-pointers made?',
        answer: { name: 'Stephen Curry', position: 'right' },
        option: 'Ray Allen',
        imageA: '/images/Stephen-curry.jpg',
        imageB: '/images/Ray-allen.jpg',
    },
    {
        question: 'Who won Finals MVP with three different franchises?',
        answer: { name: 'LeBron James', position: 'left' },
        option: 'Kawhi Leonard',
        imageA: '/images/lebron-James.avif',
        imageB: '/images/Kawhi-leonard.jpg',
    },
    {
        question: "Who is nicknamed 'The Greek Freak'?",
        answer: { name: 'Giannis Antetokounmpo', position: 'right' },
        option: 'Nikola Jokic',
        imageA: '/images/Giannis.avif',
        imageB: '/images/Nicola-Jokic.avif',
    },
    {
        question: 'Who averaged a triple-double for an entire season four times?',
        answer: { name: 'Russell Westbrook', position: 'left' },
        option: 'Oscar Robertson',
        imageA: '/images/Russell-westbrook.webp',
        imageB: '/images/Oscar-robertson.avif',
    },
    {
        question: 'Who led the Cavaliers to a championship after coming back from a 3-1 deficit in the 2016 Finals?',
        answer: { name: 'LeBron James', position: 'right' },
        option: 'Stephen Curry',
        imageA: '/images/lebron-James.avif',
        imageB: '/images/Stephen-curry.jpg',
    },
    {
        question: 'Who won MVP Defensive Player of the Year, and Finals MVP in the same season (1994)?',
        answer: { name: 'Hakeem Olajuwon', position: 'left' },
        option: 'David Robinson',
        imageA: '/images/Hakeem-Olajuwon.webp',
        imageB: '/images/David-Robinson.jpg',
    },
];
*/

export default function GameClient() {
    const router = useRouter();
    const [currentQuestion, setQuestions] = useState<Question[]>([]);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [currentQuestionIndex, setQuestionIndex] = useState(0);
    const [swipeCount, setSwipeCount] = useState(0);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const completedIndex = useRef(-1);
    const submitted = useRef(false);
    const question = currentQuestion[currentQuestionIndex];
    const [timer, setTimer] = useState<number>(5);

    //====USE EFFECT TO LOAD QUESTIONS ======
    useEffect(() => {
        async function loadQuestions() {
            const response = await fetch('/api/questions');

            if (!response.ok) {
                throw new Error(`Questions request failed; ${response.status}`);
            }
            const data = await response.json(); //what is this does not run, you need to handle the errors

            setQuestions(data.questions); //all the questions - set once
        }

        loadQuestions();
    }, []);

    // Swipes and timeouts complete the same turn. Guard against both firing together.
    //study and understand this chnage
    const completeTurn = useCallback(
        (direction: Answer['answerDir']) => {
            if (!question || swipeCount >= 5 || completedIndex.current === currentQuestionIndex) {
                return;
            }
            completedIndex.current = currentQuestionIndex;
            setAnswers((previous) => [...previous, { questionID: question.ID, answerDir: direction }]);
            setQuestionIndex((c) => c + 1);
            setSwipeCount((c) => c + 1);
            setTimer(5);
        },
        [question, swipeCount, currentQuestionIndex]
    );

    const handleTimeOut = useCallback(() => completeTurn(null), [completeTurn]);
    const handlers = (direction: Answer['answerDir']) => completeTurn(direction);

    //Score endpoint
    useEffect(() => {
        //store score
        if (swipeCount === 5 && !submitted.current) {
            submitted.current = true;
            async function storeScore() {
                try {
                    const response = await fetch('/api/postScore', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            userAns: answers, //send an array as the answer to be calculates at the back
                        }),
                    });

                    if (!response.ok) {
                        const error = await response.json();
                        throw new Error(error.error ?? 'Unable to submit your score'); //check this
                    }
                    const res = await response.json();
                    router.push(`/score?score=${res.score}`);
                } catch (error) {
                    setSubmitError(error instanceof Error ? error.message : 'Unable to submit your score');
                }
            }

            storeScore();
        }
    }, [swipeCount, answers, router]);

    if (swipeCount >= 5) {
        return submitError ? <p role="alert">{submitError}</p> : <p>Submitting your score...</p>;
    }

    if (!question) {
        return <p>Loading...</p>;
    }

    return (
        <div className="flex flex-col items-center min-h-screen bg-[#0C2340]">
            <Timer timer={timer} setTimer={setTimer} swipeCount={swipeCount} onTimeUp={handleTimeOut} />
            <Questions question={question} handleSwipe={handlers} />
        </div>
    );
}
