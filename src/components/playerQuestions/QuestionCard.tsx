import { Question } from "@/src/app/game/page"

type QuestionCardProp = {
    question : Question
}
export default function QuestionCard( {question}: QuestionCardProp ){

    return <div>
        <div className="wolves-card flex flex-col rounded-xl p-4 
            text-[24px]
            font-semibold
            uppercase
            tracking-[1px]
            font-bebas
            
        " > 
            <p>{question.question}</p> 
        </div> 
    </div>
}