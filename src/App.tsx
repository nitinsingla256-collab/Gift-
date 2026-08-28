import React, { useState } from 'react';
import { AmbientBackground } from './components/AmbientBackground';
import { MusicController } from './components/MusicController';
import { PageTransition } from './components/PageTransition';
import { OpeningScreen } from './components/OpeningScreen';
import { PasswordGate } from './components/PasswordGate';
import { SpecialIntro } from './components/SpecialIntro';
import { EditorialMemoryExperience } from './components/EditorialMemoryExperience';
import { ScreenState, PasswordType } from './types';

export default function App() {
  const [screenState, setScreenState] = useState<ScreenState>('opening');

  const handlePasswordSuccess = (type: PasswordType) => {
    if (type === 'special') {
      setScreenState('special_intro');
    } else {
      // Correct password unlocks the full-screen 3D spatial memory experience
      setScreenState('cinematic_film');
    }
  };

  const handleSpecialIntroComplete = () => {
    // Transition from special intro to the 3D spatial memory experience
    setScreenState('cinematic_film');
  };

  const handleReturnToOpening = () => {
    setScreenState('opening');
  };

  const handleOpenPassword = () => {
    setScreenState('password');
  };

  return (
    <main id="app-root" className="relative min-h-[100dvh] w-full bg-[#020202] text-[#e6e0d4] overflow-x-hidden flex justify-center items-center font-sans-clean">
      {/* Cinematic Ambient Canvas & Film Grain */}
      <AmbientBackground />

      {/* Viewport Container - Adapts seamlessly from mobile to wide desktop */}
      <div className="relative w-full min-h-[100dvh] flex flex-col justify-center items-center z-10">
        <PageTransition pageKey={screenState}>
          {screenState === 'opening' && (
            <OpeningScreen onEnter={handleOpenPassword} />
          )}

          {screenState === 'password' && (
            <PasswordGate
              onSuccess={handlePasswordSuccess}
              onBack={handleReturnToOpening}
            />
          )}

          {screenState === 'special_intro' && (
            <SpecialIntro onComplete={handleSpecialIntroComplete} />
          )}

          {screenState === 'cinematic_film' && (
            <EditorialMemoryExperience onLock={handleReturnToOpening} />
          )}
        </PageTransition>
      </div>
    </main>
  );
}

