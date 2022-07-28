import React, { useEffect, useState } from 'react'
import { noteSymbol } from 'utils'

interface Props {
    text : string
}
const CypherText = ({text} : Props) => {
    const placeholderChars = '______\\/[]{}—=+*^?#!<>'
    const [random, setRandom] = useState(initRandom())
    const [value,setValue] = useState(random)


    async function setText() {
        console.log(text)
        for(let i =0; i < text.length; i++){
            await timeout(100)
            setValue(text.substring(0,i+1)+random.substring(i+1,text.length))
        }
    }
    function initRandom(){
        let val = "";

        for(let i =0; i < text.length; i++){
            val+= placeholderChars[Math.floor(Math.random() * placeholderChars.length)]
        }
        return val;
    }
    useEffect(
        ()=>{
            setRandom(initRandom())

            setText()

        },[text]
    )
  return (
    <h1 className='balance'>{noteSymbol}{value}</h1>
  )

  function timeout(delay: number) {
    return new Promise( res => setTimeout(res, delay) );
}
}

export default CypherText