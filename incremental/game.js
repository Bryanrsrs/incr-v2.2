import React, { useState, useEffect } from 'react';
import { AlertCircle, Zap, Award, Star, Battery, Clock, Shield, Sword, Crown, Heart } from 'lucide-react';

const Game = () => {
  const [gameState, setGameState] = useState({
    energy: 0,
    multiplier: 1,
    autoClickers: 0,
    warriors: 0,
    mages: 0,
    factories: 0,
    criticalChance: 5,
    totalClicks: 0,
    goldCoins: 0,
    gems: 0,
    crystals: 0,
    level: 1,
    experience: 0,
    experienceToLevel: 100,
    prestige: 0,
    bossDefeated: 0,
    challengesCompleted: 0,
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
      id: 'factories',
      name: 'Crystal Factory',
      baseCost: 500,
      description: 'Generates crystals (+0.05/s)',
      icon: <Battery className="w-6 h-6 text-green-400" />
    },
    {
      id: 'criticalChance',
      name: 'Critical Systems',
      baseCost: 200,
      description: 'Improve critical hit chance by 2%',
      icon: <AlertCircle className="w-6 h-6 text-orange-400" />
    }
  ];

  const achievements = [
    { id: '100Energy', name: 'Energy Novice', condition: (state) => state.energy >= 100 },
    { id: '1000Clicks', name: 'Click Master', condition: (state) => state.totalClicks >= 1000 },
    { id: '100Gold', name: 'Gold Hoarder', condition: (state) => state.goldCoins >= 100 },
    { id: '10Crystals', name: 'Crystal Collector', condition: (state) => state.crystals >= 10 },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setGameState((prev) => {
        const energyGain = prev.autoClickers * 0.1;
        const goldGain = prev.warriors * 0.1;
        const gemGain = prev.mages * 0.05;
        const crystalGain = prev.factories * 0.05;

        return {
          ...prev,
          energy: prev.energy + energyGain * prev.multiplier,
          goldCoins: prev.goldCoins + goldGain,
          gems: prev.gems + gemGain,
          crystals: prev.crystals + crystalGain,
        };
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleClick = (event) => {
    setGameState((prev) => {
      const isCritical = Math.random() * 100 < prev.criticalChance;
      let gain = 1 * prev.multiplier;

      if (isCritical) {
        gain *= 2;
        showFloatingText(event, 'CRITICAL!', 'text-yellow-400');
      }

      return {
        ...prev,
        energy: prev.energy + gain,
        totalClicks: prev.totalClicks + 1,
      };
    });
  };

  const showFloatingText = (event, text, colorClass) => {
    const floating = document.createElement('div');
    floating.className = `${colorClass} text-xl font-bold animate-bounce fixed`;
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
      setGameState((prev) => ({
        ...prev,
        energy: prev.energy - cost,
        [upgrade.id]: (prev[upgrade.id] || 0) + 1,
        multiplier: upgrade.id === 'multiplier' ? prev.multiplier * 1.5 : prev.multiplier,
        criticalChance: upgrade.id === 'criticalChance' ? prev.criticalChance + 2 : prev.criticalChance,
      }));
    }
  };

  const handlePrestige = () => {
    if (gameState.energy >= 10000) {
      setGameState((prev) => ({
        ...prev,
        prestige: prev.prestige + 1,
        multiplier: prev.multiplier * 2,
        energy: 0,
        autoClickers: 0,
        warriors: 0,
        mages: 0,
        factories: 0,
        criticalChance: 5,
        goldCoins: 0,
        gems: 0,
        crystals: 0,
      }));
    }
  };

  const unlockedAchievements = achievements.filter((a) => a.condition(gameState));

  return (
    <div className="bg-gray-900 min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8 bg-gray-800 rounded-lg p-6 border-2 border-red-500">
          <h1 className="text-4xl font-bold text-red-500 mb-2">⚡ Adrenaline Rush 4.0 ⚡</h1>
          <p className="text-gray-400 text-xl">Master the elements, harness the power!</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-blue-400">Resources</h2>
            <p>Energy: {Math.floor(gameState.energy)}</p>
            <p>Gold: {Math.floor(gameState.goldCoins)}</p>
            <p>Gems: {Math.floor(gameState.gems)}</p>
            <p>Crystals: {Math.floor(gameState.crystals)}</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-purple-400">Upgrades</h2>
            {upgrades.map((upgrade) => (
              <button
                key={upgrade.id}
                onClick={() => purchaseUpgrade(upgrade)}
                className="bg-gray-700 w-full rounded-lg p-4 my-2 hover:bg-purple-700"
              >
                {upgrade.name}: Cost {calculateUpgradeCost(upgrade)}
              </button>
            ))}
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-green-400">Achievements</h2>
            {unlockedAchievements.map((a) => (
              <p key={a.id}>{a.name}</p>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleClick}
            className="bg-red-600 w-full text-white font-bold py-4 rounded-lg hover:bg-red-700"
          >
            Generate Energy
          </button>
        </div>

        <div className="mt-6">
          <button
            onClick={handlePrestige}
            className="bg-purple-600 w-full text-white font-bold py-4 rounded-lg hover:bg-purple-700"
            disabled={gameState.energy < 10000}
          >
            Prestige (10,000 Energy)
          </button>
        </div>
      </div>
    </div>
  );
};

export default Game;
