import React, { useState, useEffect } from 'react';
import { AlertCircle, Zap, Award, Star, Battery, Clock, Fire } from 'lucide-react';

const Game = () => {
  const [gameState, setGameState] = useState({
    energy: 0,
    multiplier: 1,
    autoClickers: 0,
    multiplierLevel: 0,
    prestige: 0,
    powerLevel: 0,
    criticalChance: 5,
    achievements: new Set(),
    totalClicks: 0,
    energyCore: 0,
    startTime: Date.now(),
    elementalPower: 0,
    rebirthLevel: 0,
    comboMultiplier: 1,
    comboTimer: 0,
    maxCombo: 1,
    questProgress: 0,
    currentQuest: '',
    artifactPower: 0,
    relicBonus: 1
  });

  const [sounds] = useState({
    click: new Audio('data:audio/wav;base64,UklGRngGAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQwGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiKQwUcaLvt559mGRBQp+PusH0tDjiR1/LGikAGJHG/7OahZBwRUqXh67WCMxE2iNPxz5RJCS1yv+jp').play(),
    purchase: new Audio('data:audio/wav;base64,UklGRpAGAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YUwGAACpsbupbF1feKS2s41hNjVkoN3kq2EcBj+b4PXDciUFLILP89iKQwUcaL7x559mGRBQq+fusH0tDjiU2/LGikAGJHHC8OahZBwRU').play(),
    achievement: new Audio('data:audio/wav;base64,UklGRqgGAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YWQGAACtubupbF1feKS6t41hNjVkoOLnq2EcBj+b5fjDciUFLILT99iKQwUcaMP155').play()
  });

  const playSound = (type) => {
    try {
      sounds[type]?.play();
    } catch (e) {
      console.log('Sound not loaded yet');
    }
  };

  const upgrades = [
    {
      id: 'autoClicker',
      name: 'Auto Clicker',
      baseCost: 10,
      description: 'Generates energy automatically',
      icon: <Clock className="w-6 h-6" />
    },
    {
      id: 'multiplier',
      name: 'Energy Multiplier',
      baseCost: 50,
      description: 'Increases energy generation',
      icon: <Zap className="w-6 h-6" />
    },
    {
      id: 'criticalChance',
      name: 'Critical Strike',
      baseCost: 100,
      description: 'Increases critical hit chance',
      icon: <Star className="w-6 h-6" />
    },
    {
      id: 'energyCore',
      name: 'Energy Core',
      baseCost: 500,
      description: 'Boosts auto clicker efficiency',
      icon: <Battery className="w-6 h-6" />
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (gameState.autoClickers > 0) {
        setGameState(prev => {
          const autoClickerBonus = 1 + (prev.energyCore * 0.2);
          const gain = 0.1 * prev.autoClickers * prev.multiplier * 
                      (1 + prev.prestige * 0.1) * autoClickerBonus * 
                      prev.relicBonus * prev.comboMultiplier;
          return {
            ...prev,
            energy: prev.energy + gain
          };
        });
      }
    }, 100);

    return () => clearInterval(interval);
  }, [gameState.autoClickers]);

  const handleClick = (event) => {
    playSound('click');
    setGameState(prev => {
      const isCritical = Math.random() * 100 < prev.criticalChance;
      let gain = prev.multiplier * (1 + prev.prestige * 0.1) * 
                prev.relicBonus * prev.comboMultiplier;
      
      if (isCritical) {
        gain *= 3;
        showCriticalHit(event);
      }

      return {
        ...prev,
        energy: prev.energy + gain,
        totalClicks: prev.totalClicks + 1
      };
    });
  };

  const showCriticalHit = (event) => {
    const crit = document.createElement('div');
    crit.className = 'fixed text-yellow-400 text-xl font-bold animate-bounce';
    crit.style.left = (event.clientX - 20) + 'px';
    crit.style.top = (event.clientY - 20) + 'px';
    crit.textContent = 'CRITICAL!';
    document.body.appendChild(crit);
    setTimeout(() => crit.remove(), 1000);
  };

  const calculateUpgradeCost = (upgrade) => {
    const level = gameState[upgrade.id] || 0;
    return Math.floor(upgrade.baseCost * Math.pow(1.15, level));
  };

  const purchaseUpgrade = (upgrade) => {
    const cost = calculateUpgradeCost(upgrade);
    if (gameState.energy >= cost) {
      playSound('purchase');
      setGameState(prev => ({
        ...prev,
        energy: prev.energy - cost,
        [upgrade.id]: (prev[upgrade.id] || 0) + 1,
        multiplier: upgrade.id === 'multiplier' ? prev.multiplier * 1.5 : prev.multiplier,
        criticalChance: upgrade.id === 'criticalChance' ? prev.criticalChance + 2 : prev.criticalChance
      }));
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-red-500 mb-4 animate-pulse">⚡ Adrenaline Rush 4.0 ⚡</h1>
          <p className="text-gray-400 text-xl">Master the elements, harness the power, achieve immortality!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg border-2 border-red-500">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Fire className="mr-2 text-red-500" />
              Resources & Power
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700 p-4 rounded-lg transform hover:scale-105 transition-transform">
                <div className="flex items-center justify-between">
                  <Zap className="text-yellow-400 w-6 h-6" />
                  <span className="text-xl font-bold">{Math.floor(gameState.energy)}</span>
                </div>
                <p className="text-gray-400 mt-2">Energy</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg transform hover:scale-105 transition-transform">
                <div className="flex items-center justify-between">
                  <Star className="text-purple-400 w-6 h-6" />
                  <span className="text-xl font-bold">{gameState.multiplier.toFixed(1)}x</span>
                </div>
                <p className="text-gray-400 mt-2">Multiplier</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg border-2 border-purple-500">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Award className="mr-2 text-purple-500" />
              Statistics
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-400">Total Clicks</p>
                <p className="text-xl font-bold">{gameState.totalClicks}</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-400">Critical Chance</p>
                <p className="text-xl font-bold">{gameState.criticalChance}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <button
              onClick={handleClick}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-8 px-8 rounded-lg text-2xl transform hover:scale-105 transition-transform duration-200 active:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              <Zap className="inline-block mr-2" />
              GENERATE ENERGY
            </button>
          </div>

          <div className="md:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {upgrades.map(upgrade => (
                <button
                  key={upgrade.id}
                  onClick={() => purchaseUpgrade(upgrade)}
                  className={`p-4 rounded-lg text-left transition-all duration-200 ${
                    gameState.energy >= calculateUpgradeCost(upgrade)
                      ? 'bg-purple-600 hover:bg-purple-700'
                      : 'bg-gray-700 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      {upgrade.icon}
                      <span className="ml-2 font-bold">{upgrade.name}</span>
                    </div>
                    <span className="text-sm">
                      Cost: {calculateUpgradeCost(upgrade)} Energy
                    </span>
                  </div>
                  <p className="text-sm text-gray-300">{upgrade.description}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Level: {gameState[upgrade.id] || 0}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;