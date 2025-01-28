import React, { useState, useEffect } from 'react';
import { AlertCircle, Zap, Award, Star, Battery, Clock, Shield, Sword, Crown, Heart } from 'lucide-react';

const Game = () => {
  const [gameState, setGameState] = useState({
    energy: 0,
    multiplier: 1,
    autoClickers: 0,
    warriors: 0,
    mages: 0,
    criticalChance: 5,
    totalClicks: 0,
    goldCoins: 0,
    gems: 0,
    level: 1,
    experience: 0,
    experienceToLevel: 100,
    prestige: 0
  });

  const upgrades = [
    {
      id: 'autoClickers',
      name: 'Energy Generator',
      baseCost: 10,
      description: 'Automated energy production (+0.1/s)',
      icon: <Clock className="w-6 h-6 text-blue-400" />
    },
    {
      id: 'warriors',
      name: 'Elite Warriors',
      baseCost: 100,
      description: 'Combat units that generate gold (+0.1/s)',
      icon: <Sword className="w-6 h-6 text-red-400" />
    },
    {
      id: 'mages',
      name: 'Arcane Mages',
      baseCost: 150,
      description: 'Magical units that generate gems (+0.05/s)',
      icon: <Star className="w-6 h-6 text-purple-400" />
    },
    {
      id: 'criticalChance',
      name: 'Critical Systems',
      baseCost: 200,
      description: 'Improve critical hit chance by 2%',
      icon: <AlertCircle className="w-6 h-6 text-orange-400" />
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prev => {
        const energyGain = prev.autoClickers * 0.1;
        const goldGain = prev.warriors * 0.1;
        const gemGain = prev.mages * 0.05;
        
        return {
          ...prev,
          energy: prev.energy + (energyGain * prev.multiplier),
          goldCoins: prev.goldCoins + goldGain,
          gems: prev.gems + gemGain
        };
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleClick = (event) => {
    setGameState(prev => {
      const isCritical = Math.random() * 100 < prev.criticalChance;
      let gain = 1 * prev.multiplier;
      
      if (isCritical) {
        gain *= 2;
        showFloatingText(event, 'CRITICAL!', 'text-yellow-400');
      }

      return {
        ...prev,
        energy: prev.energy + gain,
        totalClicks: prev.totalClicks + 1
      };
    });
  };

  const showFloatingText = (event, text, colorClass) => {
    const floating = document.createElement('div');
    floating.className = `fixed ${colorClass} text-xl font-bold animate-bounce`;
    floating.style.left = `${event.clientX - 20}px`;
    floating.style.top = `${event.clientY - 20}px`;
    floating.textContent = text;
    document.body.appendChild(floating);
    setTimeout(() => floating.remove(), 1000);
  };

  const calculateUpgradeCost = (upgrade) => {
    const level = gameState[upgrade.id] || 0;
    return Math.floor(upgrade.baseCost * Math.pow(1.15, level));
  };

  const purchaseUpgrade = (upgrade) => {
    const cost = calculateUpgradeCost(upgrade);
    if (gameState.energy >= cost) {
      setGameState(prev => ({
        ...prev,
        energy: prev.energy - cost,
        [upgrade.id]: (prev[upgrade.id] || 0) + 1,
        multiplier: upgrade.id === 'multiplier' ? prev.multiplier * 1.5 : prev.multiplier,
        criticalChance: upgrade.id === 'criticalChance' ? prev.criticalChance + 2 : prev.criticalChance
      }));
    }
  };

  const handlePrestige = () => {
    if (gameState.energy >= 10000) {
      setGameState(prev => ({
        ...prev,
        prestige: prev.prestige + 1,
        multiplier: prev.multiplier * 2,
        energy: 0,
        autoClickers: 0,
        warriors: 0,
        mages: 0,
        criticalChance: 5
      }));
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8 bg-gray-800 rounded-lg p-6 border-2 border-red-500">
          <h1 className="text-4xl font-bold text-red-500 mb-2">⚡ Adrenaline Rush 4.0 ⚡</h1>
          <p className="text-gray-400 text-xl">Master the elements, harness the power!</p>
          <div className="mt-4 flex justify-center items-center space-x-4">
            <div className="bg-blue-900 px-4 py-2 rounded-lg">
              <p className="text-blue-300">Level {gameState.level}</p>
            </div>
            <div className="bg-purple-900 px-4 py-2 rounded-lg">
              <p className="text-purple-300">Prestige {gameState.prestige}</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gray-800 rounded-lg p-6 border-2 border-blue-500">
            <h2 className="text-2xl font-bold mb-4 flex items-center text-blue-400">
              <Battery className="mr-2" />
              Resources
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <Zap className="text-yellow-400" />
                  <span className="text-xl font-bold">{Math.floor(gameState.energy)}</span>
                </div>
                <p className="text-gray-400 mt-1">Energy</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <Crown className="text-yellow-500" />
                  <span className="text-xl font-bold">{Math.floor(gameState.goldCoins)}</span>
                </div>
                <p className="text-gray-400 mt-1">Gold</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <Star className="text-purple-400" />
                  <span className="text-xl font-bold">{gameState.gems.toFixed(1)}</span>
                </div>
                <p className="text-gray-400 mt-1">Gems</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <Shield className="text-green-400" />
                  <span className="text-xl font-bold">{gameState.multiplier.toFixed(1)}x</span>
                </div>
                <p className="text-gray-400 mt-1">Multiplier</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border-2 border-purple-500">
            <h2 className="text-2xl font-bold mb-4 flex items-center text-purple-400">
              <Award className="mr-2" />
              Army
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <Sword className="text-red-400" />
                  <span className="text-xl font-bold">{gameState.warriors}</span>
                </div>
                <p className="text-gray-400 mt-1">Warriors</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <Star className="text-purple-400" />
                  <span className="text-xl font-bold">{gameState.mages}</span>
                </div>
                <p className="text-gray-400 mt-1">Mages</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border-2 border-green-500">
            <h2 className="text-2xl font-bold mb-4 flex items-center text-green-400">
              <Heart className="mr-2" />
              Stats
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <AlertCircle className="text-orange-400" />
                  <span className="text-xl font-bold">{gameState.criticalChance}%</span>
                </div>
                <p className="text-gray-400 mt-1">Crit Chance</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <Zap className="text-yellow-400" />
                  <span className="text-xl font-bold">{gameState.totalClicks}</span>
                </div>
                <p className="text-gray-400 mt-1">Total Clicks</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <button
              onClick={handleClick}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-8 px-4 rounded-lg text-2xl transform hover:scale-105 transition-transform duration-200 active:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 mb-4"
            >
              <Zap className="inline-block mr-2" />
              GENERATE ENERGY
            </button>

            <button
              onClick={handlePrestige}
              disabled={gameState.energy < 10000}
              className={`w-full ${gameState.energy >= 10000 ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-700'} text-white font-bold py-4 px-4 rounded-lg text-xl mb-4`}
            >
              PRESTIGE (10,000 Energy)
            </button>
          </div>

          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {upgrades.map(upgrade => (
                <button
                  key={upgrade.id}
                  onClick={() => purchaseUpgrade(upgrade)}
                  className={`p-4 rounded-lg text-left transition-all duration-200 ${
                    gameState.energy >= calculateUpgradeCost(upgrade)
                      ? 'bg-purple-600 hover:bg-purple-700 transform hover:scale-105'
                      : 'bg-gray-700 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      {upgrade.icon}
                      <span className="ml-2 font-bold">{upgrade.name}</span>
                    </div>
                    <span className="text-sm">
                      Cost: {calculateUpgradeCost(upgrade)}
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
