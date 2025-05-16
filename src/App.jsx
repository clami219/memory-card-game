import { useEffect, useState } from 'react'
import useLocalStorageState from 'use-local-storage-state';
import './App.css'
import Card from './Card';
import FireworksComponent from './FireworksComponent';
import { AnimatePresence } from "framer-motion";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

const imageSources = {
  'cats': {
    url:'https://api.thecatapi.com/v1/images/search?limit=10',
    getImages: ((json) => json )
  },
  'boring': {
    url:'https://boringapi.com/api/v1/photos/random?num=10',
    getImages: ((json) => json.photos )
  }
}

function App() {
  const [pics, setPics] = useState([]);
  const [imageSource, setImageSource] = useState('boring');
  const [clickedPics, setClickedPics] = useState([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useLocalStorageState("bestScore",{defaultValue:0});
  const [fireworks,setFireworks] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  
  useEffect(() => {
    let ignore = false;

    fetch(imageSources[imageSource].url)
      .then(result => result.json())
      .then(json => {
        if(!ignore){
          let newPics = [];
          imageSources[imageSource].getImages(json).map((pic) => {
            newPics.push(pic.url);
          })
          setPics(newPics);
          setScore(0);
          setClickedPics([]);
        }
      });
    
    return (() => {
      ignore = true;
      setPics([]);
    })
  },[imageSource]);

  const launchFireworks = () =>
  {
    setFireworks(!fireworks);
  }

  return (
    <>
    <AnimatePresence>
      <FireworksComponent trigger={fireworks} />
      {showInfo && (
        // Overlay semi-trasparente
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          {/* Contenuto modale */}
          <div className="bg-white dark:bg-black text-left rounded-lg shadow-lg p-6 max-w-md w-full relative">
            <button
              onClick={() => setShowInfo(false)}
              className="absolute top-3 right-3 text-gray-600 dark:hover:text-gray-300 hover:text-gray-900"
              aria-label="Chiudi modale"
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-4">Instructions:</h2>
            <p>The game shows 10 different cards.</p>
            <p>The aim is to click each only once.</p>
            <p>At every click the cards will shuffle randomly, so you will have to remember which cards you clicked on already.</p>
            <p>If you make a mistake, the Score will go down to 0 and you will have to start all over again.</p>
            <p>If you can reach a Score of 10 there will be a little surprise!</p>
            <p>Pick the card style that you like best and try to reach the highest Score!</p>
            <p>Good luck!</p>
            <button
              onClick={() => setShowInfo(false)}
              className="mt-6 px-4 py-2 bg-gray-900 dark:text-white dark:bg-gray-500 rounded hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
      <div className="flex flex-col w-full">
        <div className='flex flex-col md:flex-row justify-between w-1g'>
          <div className="h-10 md:h-15 text-3xl sm:text-3xl md:text-7xl md:h-20 text-transparent font-extrabold bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 drop-shadow-l">
            Memory card game
          </div>
          <div className="flex flex-col md:mt-10 text-right float-right">
            <span>Score: {score}</span>
            <span>Best score: {bestScore}</span>
          </div>
        </div>
        <div className="flex pb-5 md:pb-10 items-center">
          <InformationCircleIcon className="h-6 w-6 text-gray-500 hover:text-indigo-500 cursor-pointer md:mr-5 mr-2" onClick={()=> setShowInfo(true) }/>
          <span className="md:text-2xl">Pick a style:</span>
          <select className="md:text-2xl" onChange={(e)=>{setImageSource(e.target.value)}}>
            <option value="boring">Boring</option>
            <option value="cats">Cats</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-5">
        {pics.length > 0 ? pics.map((pic) => (
          <Card 
            url={pic} 
            key={pic} 
            onClick={()=>{
              const mixedPics = shuffleArray([...pics]);
              setPics(mixedPics);
              if(clickedPics.indexOf(pic) !== -1)
              {//Mistake - game reset
                setClickedPics([]);
                setScore(0);
              }
              else
              {//New pic found - score updated
                setClickedPics([...clickedPics,pic]);
                if(bestScore < score + 1)
                {
                  if(score + 1 === 10)
                  {
                    alert('Congratulations! You reached the best score!');
                    launchFireworks();
                  }
                  setBestScore(score + 1)
                }
                setScore(score + 1);
              }
            }}
          />
        )) : (
          <span className="h-180 w-85 md:h-69 md:w-180 lg:h-133 lg:w-340 col-span-2 row-span-5 md:col-span-5 md:row-span-2">Loading...</span>
        )}
      </div>
      </AnimatePresence>
    </>
  );
  
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export default App
