import React, { useState } from 'react';
import { PageTransition } from './components/PageTransition';
import { OpeningScreen } from './components/OpeningScreen';
import { PasswordGate } from './components/PasswordGate';
import { SpecialIntro } from './components/SpecialIntro';
import { DreamyScrapbookExperience } from './components/DreamyScrapbookExperience';
import { ScreenState, PasswordType } from './types';

export default function App() {
  const [screenState, setScreenState] = useState<ScreenState>('opening');

  const handlePasswordSuccess = (type: PasswordType) => {
    if (type === 'special') {
      setScreenState('special_intro');
    } else {
      // Correct password unlocks the dreamy scrapbook experience
      setScreenState('cinematic_film');
    }
  };

  const handleSpecialIntroComplete = () => {
    // Transition from special intro to the dreamy scrapbook experience
    setScreenState('cinematic_film');
  };

  const handleReturnToOpening = () => {
    setScreenState('opening');
  };

  const handleOpenPassword = () => {
    setScreenState('password');
  };

  return (
    <main
      id="app-root"
      className="relative min-h-[100dvh] w-full bg-[#fdfbf6] text-[#222222] overflow-x-hidden flex justify-center items-center font-poppins"
    >
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
            <DreamyScrapbookExperience onLock={handleReturnToOpening} />
          )}
        </PageTransition>
      </div>
    </main>
  );
}
