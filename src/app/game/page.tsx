'use client'

import { useState } from "react";
import { useSwipeable } from "react-swipeable";

interface Question {
    question : string,
    answer : any,
    option : any,
    imageA : string,
    imageB : string,
}

const basketballQuestions: Question[] = [
    { "question" : "who won the NBA playoffs final in 2019",
        'answer' : "Kawhi Leonard",
        'option' : "me",
        'imageA' : "images/Kawhi.jpeg",
        'imageB' : "images/klay.jpeg"
    },
    { "question" : "who won the NBA playoffs final in 2020",
        'answer' : "Kawhi Leonard",
        'option' : "me",
        'imageA' : "images/Kawhi.jpeg",
        'imageB' : "images/klay.jpeg"
    },
    { "question" : "who won the NBA playoffs final in 2016",
        'answer' : "Kawhi Leonard",
        'option' : "me",
        'imageA' : "images/Kawhi.jpeg",
        'imageB' : "images/klay.jpeg"
    }   
]

export default function Game(){
    function getRandomIndex() : number {
        return Math.floor(Math.random() * basketballQuestions.length)
    }

    const randomIndex = getRandomIndex();
    const question = basketballQuestions[randomIndex];

    const [ swipe, setSwipe ] = useState(false);

    return <div className='flex flex-col justify-center items-center min-h-screen'>

            <p>timer</p>

            <div>
                <div>
                    <p>question : {question.question}</p>
                </div>
                
                <div className="flex justify-center gap-4">
                    <div>
                        <img src={question.imageA} alt={question.answer} className="w-32 h-32 object-cover"/>
                        <p>{question.answer}</p>
                    </div>
                    
                    <div>
                        <img src={question.imageB} alt={question.option} className="w-32 h-32 object-cover"/>
                        <p>{question.option}</p>
                    </div>
                    
                </div>

            </div>
        
        </div>
    
}