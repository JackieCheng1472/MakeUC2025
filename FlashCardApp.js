import React, { useState } from 'react';
import { Upload, RotateCw, ChevronLeft, ChevronRight, Shuffle } from 'lucide-react';

export default function FlashcardApp() {
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError('');
    
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      const parsed = [];

      for (let line of lines) {
        // Support multiple formats: "Q: ... A: ...", "Question|Answer", or "Question,Answer"
        let question, answer;
        
        if (line.includes('|')) {
          [question, answer] = line.split('|').map(s => s.trim());
        } else if (line.toLowerCase().includes('q:') && line.toLowerCase().includes('a:')) {
          const qMatch = line.match(/q:\s*(.+?)\s*a:/i);
          const aMatch = line.match(/a:\s*(.+)/i);
          question = qMatch ? qMatch[1].trim() : '';
          answer = aMatch ? aMatch[1].trim() : '';
        } else if (line.includes(',')) {
          [question, answer] = line.split(',').map(s => s.trim());
        } else {
          continue;
        }

        if (question && answer) {
          parsed.push({ question, answer });
        }
      }

      if (parsed.length === 0) {
        setError('No valid question-answer pairs found. Use format: "Question|Answer" or "Q: Question A: Answer"');
        return;
      }

      setCards(parsed);
      setCurrentIndex(0);
      setIsFlipped(false);
    } catch (err) {
      setError('Error reading file. Please try again.');
    }
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const nextCard = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const shuffleCards = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const resetProgress = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-indigo-900 mb-8">
          Flashcard Study App
        </h1>

        {cards.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Upload className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Upload Your Flashcards
            </h2>
            <p className="text-gray-600 mb-6">
              Upload a text file with questions and answers. Supported formats:
            </p>
            <div className="text-left max-w-md mx-auto mb-6 bg-gray-50 p-4 rounded-lg">
              <p className="font-mono text-sm mb-2">Question|Answer</p>
              <p className="font-mono text-sm mb-2">Q: Question A: Answer</p>
              <p className="font-mono text-sm">Question,Answer</p>
            </div>
            <label className="inline-block cursor-pointer bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition">
              Choose File
              <input
                type="file"
                accept=".txt,.csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            {error && (
              <p className="mt-4 text-red-600">{error}</p>
            )}
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-600">
                  Card {currentIndex + 1} of {cards.length}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={shuffleCards}
                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                    title="Shuffle"
                  >
                    <Shuffle className="w-5 h-5" />
                  </button>
                  <button
                    onClick={resetProgress}
                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                    title="Reset"
                  >
                    <RotateCw className="w-5 h-5" />
                  </button>
                  <label className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition cursor-pointer" title="Load New File">
                    <Upload className="w-5 h-5" />
                    <input
                      type="file"
                      accept=".txt,.csv"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div
                onClick={flipCard}
                className="min-h-[300px] flex items-center justify-center cursor-pointer bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl p-8 transition-all hover:shadow-xl"
              >
                <div className="text-center">
                  <p className="text-sm uppercase tracking-wide mb-4 opacity-80">
                    {isFlipped ? 'Answer' : 'Question'}
                  </p>
                  <p className="text-2xl font-medium leading-relaxed">
                    {isFlipped ? cards[currentIndex].answer : cards[currentIndex].question}
                  </p>
                  <p className="text-sm mt-6 opacity-70">
                    Click to flip
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={prevCard}
                disabled={currentIndex === 0}
                className="flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-lg shadow hover:shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
                Previous
              </button>
              <button
                onClick={nextCard}
                disabled={currentIndex === cards.length - 1}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}