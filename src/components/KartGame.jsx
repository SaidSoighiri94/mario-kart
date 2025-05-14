import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './KartGame.css';
import spinSound from '/src/assets/sounds/spin.mp3';
import resultSound from '/src/assets/sounds/result.mp3';

const tracks = [
  { id: 1, name: 'Circuit Mario', image: '/src/assets/images/1.png' },
  { id: 2, name: 'Royaume Champignon', image: '/src/assets/images/2.png' },
  { id: 3, name: 'Plage Koopa', image: '/src/assets/images/3.png' },
  { id: 4, name: 'Circuit Arc-en-ciel', image: '/src/assets/images/4.png' }
];

const KartGame = () => {
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [diceRotation, setDiceRotation] = useState({ x: 0, y: 0, z: 0 });

  const getRandomRotation = () => {
    const faces = [
      { x: 0, y: 0 },    // front
      { x: 0, y: 180 },  // back
      { x: 0, y: 90 },   // right
      { x: 0, y: -90 },  // left
      { x: 90, y: 0 },   // top
      { x: -90, y: 0 }   // bottom
    ];
    return faces[Math.floor(Math.random() * faces.length)];
  };

  const spinWheel = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setShowParticles(false);
    setShowModal(false);
    
    const spinAudio = new Audio(spinSound);
    spinAudio.play();
    
    const finalRotation = getRandomRotation();
    const spins = 2; // Nombre de rotations complètes
    
    setDiceRotation({
      x: finalRotation.x + (360 * spins),
      y: finalRotation.y + (360 * spins),
      z: Math.random() * 360 * spins
    });

    // Sélection aléatoire d'un circuit
    setTimeout(() => {
      const finalIndex = Math.floor(Math.random() * tracks.length);
      setSelectedTrack(tracks[finalIndex]);
      setIsSpinning(false);
      setShowParticles(true);
      setShowModal(true);
      
      const resultAudio = new Audio(resultSound);
      resultAudio.play();
    }, 5000);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="kart-game">
      <h1>Mario Kart - Sélecteur de Circuit</h1>
      
      <div className="dice-container">
        <motion.div 
          className={`dice ${isSpinning ? 'spinning' : ''}`}
          animate={{
            rotateX: diceRotation.x,
            rotateY: diceRotation.y,
            rotateZ: diceRotation.z
          }}
          transition={{
            duration: isSpinning ? 5 : 0.5,
            ease: "easeInOut"
          }}
        >
          {tracks.map((track, index) => (
            <div 
              key={track.id} 
              className={`dice-face ${
                index === 0 ? 'front' :
                index === 1 ? 'back' :
                index === 2 ? 'right' :
                index === 3 ? 'left' :
                index === 4 ? 'top' : 'bottom'
              }`}
            >
              <img src={track.image} alt={track.name} />
              <h3>{track.name}</h3>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.button 
        className="spin-button" 
        onClick={spinWheel}
        disabled={isSpinning}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isSpinning ? 'Sélection...' : 'Lancer le dé !'}
      </motion.button>

      <AnimatePresence>
        {showModal && selectedTrack && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div 
              className="modal-content"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              onClick={e => e.stopPropagation()}
            >
              <motion.img 
                src={selectedTrack.image} 
                alt={selectedTrack.name}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              />
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {selectedTrack.name}
              </motion.h2>
              <motion.button 
                className="close-button"
                onClick={closeModal}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                Fermer
              </motion.button>
              {showParticles && (
                <motion.div className="modal-particles">
                  {[...Array(30)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="particle"
                      initial={{ scale: 0 }}
                      animate={{
                        scale: [0, 1, 0],
                        x: Math.random() * 400 - 200,
                        y: Math.random() * 400 - 200,
                        rotate: Math.random() * 360
                      }}
                      transition={{
                        duration: 2,
                        ease: "easeOut",
                        delay: i * 0.03,
                        repeat: Infinity,
                        repeatDelay: 0.5
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default KartGame;
