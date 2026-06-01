'use client'

import { useEffect, useState } from "react";

import { getRandomIndex } from "@/src/utils/getRandomIndex";
import Questions from "@/src/components/playerQuestions/Questions";
import Timer from "@/src/components/questionTimer/Timer";

export interface Question {
    question : string,
    answer : any,
    option : any,
    imageA : string,
    imageB : string,
}

const basketballQuestions: Question[] = [
    { "question" : "who won the NBA playoffs final in 2019",
        'answer' : {'name' : "Kawhi Leonard", 'position': "left"},
        'option' : "me",
        'imageA' : "images/Kawhi.jpeg",
        'imageB' : "images/Klay.jpeg"
    },
    { "question" : "who won the NBA playoffs final in 2020",
        'answer' : {'name' : "Kawhi Leonard", 'position': "left"},
        'option' : "me",
        'imageA' : "images/Kawhi.jpeg",
        'imageB' : "images/Klay.jpeg"
    },
    { "question" : "who won the NBA playoffs final in 2016",
        'answer' : {'name' : "Klay", 'position': "right"},
        'option' : "me",
        'imageB' : "images/Kawhi.jpeg",
        'imageA' : "images/Klay.jpeg"
    }   
]

export default function Game(){

    //const randomIndex = getRandomIndex();
    const [ index, setIndex ] = useState<number | null>(null);
    const [ swipeCount, setSwipeCount ] = useState(0);

    useEffect(() => {
        setIndex(getRandomIndex(basketballQuestions.length));
    }, []);


    //this function generates a random question when the timer is out
    const handleTimeOut = () => {
        setIndex(getRandomIndex(basketballQuestions.length));
        setSwipeCount((c) => c + 1);
    }


    //swipe function - check that answer is correct
    const handlers = (direction: string) => {

        if (index === null)return; //index is state

        const question = basketballQuestions[index]; //take question from the array

        if (question.answer.position === direction){ //maybe use case
            //action like add score 
            console.log("right");
        }
        setIndex(getRandomIndex(basketballQuestions.length));
        setSwipeCount((c) => c + 1);

    }
    
    if (index === null) {
        return <p>Loading...</p>;
    }
    const question = basketballQuestions[index];

    return <div className='flex flex-col items-center min-h-screen bg-[#0C2340]'>

        <Timer swipCount={swipeCount} onTimeUp={handleTimeOut}/>
        <Questions question={question} handleSwipe={handlers}/>

    </div>
    
}

