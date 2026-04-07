//'use client'

import { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";

import { getRandomIndex } from "@/src/utils/getRandomIndex";

interface Question {
    question : string,
    answer : any,
    option : any,
    imageA : string,
    imageB : string,
}

const basketballQuestions: Question[] = [
    { "question" : "who won the NBA playoffs final in 2019",
        'answer' : {'name' : "Kawhi Leonard", 'position': "Left"},
        'option' : "me",
        'imageA' : "images/Kawhi.jpeg",
        'imageB' : "images/klay.jpeg"
    },
    { "question" : "who won the NBA playoffs final in 2020",
        'answer' : {'name' : "Kawhi Leonard", 'position': "Left"},
        'option' : "me",
        'imageA' : "images/Kawhi.jpeg",
        'imageB' : "images/klay.jpeg"
    },
    { "question" : "who won the NBA playoffs final in 2016",
        'answer' : {'name' : "Klay", 'position': "Right"},
        'option' : "me",
        'imageB' : "images/Kawhi.jpeg",
        'imageA' : "images/klay.jpeg"
    }   
]

export default function Questions(){

    //const randomIndex = getRandomIndex();
    const [ index, setIndex ] = useState<number | null>(null);

    useEffect(() => {
        setIndex(getRandomIndex(basketballQuestions.length));
    }, []);



    //swipe function
    const handlers = useSwipeable({
        onSwiped: (eventData) => {

            if (index === null)return;

            const question = basketballQuestions[index];

            if (eventData.dir == 'Right' && question.answer.position == 'Right'){ //maybe use case
                //action like add score 
                console.log("right");
                
            }else if(eventData.dir == 'Left' && question.answer.position == 'Left'){
                console.log("left");
            }
            setIndex(getRandomIndex(basketballQuestions.length));
        }
    });
    
    if (index === null) {
        return <p>Loading...</p>;
    }

    const question = basketballQuestions[index];
    
    return <div>
            
        <div>
            <p>question : {question.question}</p>
        </div>
        
        <div {...handlers} className="flex justify-center gap-4">
            <div>
                <img src={question.imageA} alt={question.answer.name} className="w-32 h-32 object-cover"/>
                <p>{question.answer.name}</p>
            </div>
            
            <div>
                <img src={question.imageB} alt={question.option.name} className="w-32 h-32 object-cover"/>
                <p>{question.option}</p>
            </div>
            
        </div>

    </div>
}