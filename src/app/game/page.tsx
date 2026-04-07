'use client'

import Questions from "@/src/components/generateQuestions/Questions";


export default function Game(){

    return <div className='flex flex-col justify-center items-center min-h-screen'>

        <p>timer</p>
        <Questions />

    </div>
    
}

