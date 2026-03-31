import React, { useState, useRef, useEffect } from 'react';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hello! I'm your AI health assistant. How can I help you?", sender: "bot" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { text: input, sender: "user" };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            // Ensure this URL matches your backend port
            const response = await fetch('http://localhost:5000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input }),
            });

            const data = await response.json();
            setMessages((prev) => [...prev, { text: data.reply, sender: "bot" }]);
        } catch (error) {
            setMessages((prev) => [...prev, { text: "Connection error. Please try again.", sender: "bot" }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-5 right-5 z-[9999] font-sans">
            {/* Toggle Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    w-14 h-14 rounded-full shadow-lg flex items-center justify-center 
                    text-white text-2xl transition-transform hover:scale-110 focus:outline-none
                    ${isOpen ? 'bg-red-500 rotate-90' : 'bg-indigo-600'}
                `}
            >
                {isOpen ? '✕' : '💬'}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="absolute bottom-20 right-0 w-80 sm:w-96 h-[500px] max-h-[80vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 animate-fade-in-up">
                    
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <h3 className="font-semibold">Health Assistant</h3>
                        </div>
                    </div>
                    
                    {/* Messages Area */}
                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`
                                    max-w-[80%] p-3 rounded-2xl text-sm shadow-sm
                                    ${msg.sender === 'user' 
                                        ? 'bg-indigo-600 text-white rounded-br-none' 
                                        : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'}
                                `}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white text-gray-500 p-3 rounded-2xl rounded-bl-none border border-gray-100 text-sm flex gap-1 items-center">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about symptoms..."
                            className="flex-1 p-2 px-4 border border-gray-200 rounded-full focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition-all"
                        />
                        <button 
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="bg-indigo-600 text-white p-2 w-10 h-10 rounded-full flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            ➤
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Chatbot;