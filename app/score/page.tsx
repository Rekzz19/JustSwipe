'use client'//why do i do this?

import { useSearchParams } from "next/navigation";

export default function Score(){
    const param = useSearchParams();
    const score = param.get('score')
    return <div className='flex flex-col items-center justify-center min-h-screen bg-[#0C2340]'>
        
        <div>
            <h1>You scored {score}</h1>
        </div>
      
    </div>

}