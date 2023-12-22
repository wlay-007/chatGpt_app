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

    const chatComplition = await openai.chat.completions.create({
      messages: [...chatHistory, {role: 'assistant', content: userInput}],
      model: "gpt-3.5-turbo",
    });

    setChatHistory((prevState) => [
      ...prevState,
      { role: 'assistant', content: chatComplition.choices[0].message.content || '' },
    ]);
    setIsLoading(false);
  };


  return (
      <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center">
        <div className="w-full h-screen max-w-screen-md p-4 flex-1 flex-col flex items-center justify-center">
          <div className="mb-4">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              Чатбот-помощник
            </div>
          </div>
          <div className="overflow-auto mb-4 py-4">
            {chatHistory.map((item: { role: 'assistant' | 'user'; content: string }, index: number) => (
                <div key={index} className={`${item.role === 'user' ? 'text-right' : 'text-left'} mb-4`}>
                  <div className={`rounded-full p-2 max-w-md mx-4 inline-block ${item.role === 'user' ? 'bg-blue-300 text-blue-600' : 'bg-green-300 text-green-600'}`}>
                    {item.role === 'user' ? 'H' : 'A'}
                  </div>
                  <div className={`p-2 max-w-md inline-block my-2 mx-4 ${item.role === 'user' ? 'bg-blue-300 text-blue-600' : 'bg-green-300 text-green-600'}`}>{item.content}</div>
                </div>
            ))}
          </div>
          <div className="flex">
            <input
                type="text"
                placeholder="Введите запрос"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className='flex-1 p-2 rounded-l-lg outline-none'
            />
            <button
                className={`p-2 px-6 flex items-center justify-center rounded-r-lg bg-blue-500 text-white ${!userInput ? 'pointer-events-none' : ""}`}
                onClick={handleUserInput}
            >
              {isLoading ? (<Spin indicator={<LoadingOutlined style={{ fontSize: 24, color: "white" }} spin />} />) : '>'}
            </button>
          </div>

        </div>
      </div>

  )
}
