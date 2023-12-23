'use client'
import {useState} from "react";
import OpenAI from "openai";
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export default function Home() {
  const [userInput, setUserInput] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<{ role:'assistant' | 'user'; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleUserInput = async () => {
    setIsLoading(true);
    setChatHistory((prevState) => [
      ...prevState,
      { role: 'user', content: userInput },
    ]);
    setUserInput('')

    const chatCompletion = await openai.chat.completions.create({
      messages: [...chatHistory, {role: 'assistant', content: userInput}],
      model: "gpt-3.5-turbo",
    });

    setChatHistory((prevState) => [
      ...prevState,
      { role: 'assistant', content: chatCompletion.choices[0].message.content || '' },
    ]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>)=>{
    if (e.key === 'Enter' && userInput){
      handleUserInput();
    }
  }


  return (
      <div className="min-h-dvh bg-gray-100">
        <div className="grid grid-rows-[100px,1fr,100px] h-dvh md:w-[600px] m-auto sm:w-full">
          <div className=" flex justify-center items-center">
              <div className="md:text-4xl text-2xl font-bold text-blue-500 mb-2">
                Чатбот-помощник
              </div>
          </div>
          {chatHistory.length ? (<div className="overflow-auto py-4 max-h-[calc(100vh-200px)]">
            {chatHistory.map((item: { role: 'assistant' | 'user'; content: string }, index: number) => (
                <div key={index} className={`${item.role === 'user' ? 'w-full flex flex-row-reverse items-center justify-start' : 'flex flex-row items-center justify-start'} mb-2`}>
                  <div className={`rounded-full min-w-10 min-h-10 mx-1 flex justify-center items-center  ${item.role === 'user' ? 'bg-blue-300 text-blue-600' : 'bg-green-300 text-green-600'}`}>
                    {item.role === 'user' ? 'H' : 'A'}
                  </div>
                  <div className={`p-2 max-w-md rounded-md my-1 mx-2 ${item.role === 'user' ? 'bg-blue-300 text-blue-600' : 'bg-green-300 text-green-600'}`}>{item.content}</div>
                </div>
            ))}
          </div>): <h1 className="text-center text-gray-400 self-center">Начните диалог</h1>}
          <div className="flex items-center justify-center p-2">
            <input
                onKeyDown={handleKeyDown}
                type="text"
                placeholder="Введите запрос"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className='flex-1 p-2 rounded-l-lg outline-none h-10'
            />
            <button
                className={`p-2 px-4 h-10 w-10 flex items-center justify-center rounded-r-lg bg-blue-500 text-white ${!userInput ? 'pointer-events-none' : ""} ${isLoading ? 'pointer-events-none' : ""}`}
                onClick={handleUserInput}
            >
              {isLoading ? (<Spin indicator={<LoadingOutlined style={{ fontSize: "13px", color: "white"}} spin />} />) : '>'}
            </button>
          </div>
        </div>
      </div>
  )
}
