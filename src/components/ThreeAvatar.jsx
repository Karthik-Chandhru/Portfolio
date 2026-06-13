import { useState, useEffect, useRef } from 'react';
import boyAvatar from '../assets/Animation.jpg';

export default function ThreeAvatar({ isLightOn }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const isSpeakingRef = useRef(false);
  const [speechError, setSpeechError] = useState(null);

  useEffect(() => {
    isSpeakingRef.current = isSpeaking;
  }, [isSpeaking]);

  // Voice Speech Synthesis Handling
  const speakGreeting = () => {
    if (!('speechSynthesis' in window)) {
      setSpeechError('Web Speech API is not supported in this browser.');
      return;
    }

    window.speechSynthesis.cancel();

    const text = "Hi, I am Karthik Chandhru from Erode. I am a Full Stack Developer, and I am happy to see you!";
    const utterance = new SpeechSynthesisUtterance(text);

    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    // Prefer a clear English voice (male, natural, or google)
    const englishVoice = voices.find(voice => 
      voice.lang.startsWith('en-') && 
      (voice.name.toLowerCase().includes('male') || voice.name.toLowerCase().includes('google') || voice.name.toLowerCase().includes('natural'))
    ) || voices.find(voice => voice.lang.startsWith('en-')) || voices[0];
    
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = (e) => {
      console.error('Speech synthesis error:', e);
      setIsSpeaking(false);
      setSpeechError(`Speech synthesis error: ${e.error}`);
    };

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="three-avatar-container">
      {/* Scope Component Styling */}
      <style>{`
        .avatar-card-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          position: relative;
        }

        /* Ambient glowing background spotlight behind avatar */
        .avatar-spotlight {
          position: absolute;
          width: 250px;
          height: 250px;
          border-radius: 50%;
          filter: blur(60px);
          z-index: 1;
          pointer-events: none;
          transition: all 0.8s ease;
        }

        .light-on-glow {
          background: radial-gradient(circle, rgba(250, 204, 21, 0.4) 0%, rgba(0,0,0,0) 70%);
        }

        .light-off-glow {
          background: radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, rgba(0,0,0,0) 70%);
        }

        /* Interactive Boy Avatar Frame with breathing/bobbing animations */
        .avatar-interactive-frame {
          position: relative;
          width: 280px;
          height: 280px;
          border-radius: 50%;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: border-color 0.5s ease;
        }

        /* Idle breathing state */
        .avatar-interactive-frame.idle {
          animation: avatarBreath 6s infinite ease-in-out;
        }

        /* Active talking state */
        .avatar-interactive-frame.speaking {
          animation: avatarTalkBob 0.6s infinite ease-in-out;
        }

        /* Dual Concentric Glowing Rotating Borders */
        .border-ring {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }

        .border-outer {
          top: -10px;
          left: -10px;
          right: -10px;
          bottom: -10px;
          border: 2px dashed var(--primary);
          opacity: 0.6;
          animation: rotateClockwise 20s infinite linear;
          box-shadow: 0 0 15px var(--primary-glow);
        }

        .border-inner {
          top: -4px;
          left: -4px;
          right: -4px;
          bottom: -4px;
          border: 2px solid var(--secondary);
          opacity: 0.8;
          animation: rotateCounterClockwise 15s infinite linear;
          box-shadow: 0 0 10px var(--secondary-glow);
        }

        /* Main Image Styling */
        .avatar-img-content {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid rgba(255, 255, 255, 0.1);
          background-color: #0c152b;
          position: relative;
          overflow: hidden;
        }

        /* Precise Mouth Animation Overlay positioning */
        .boy-mouth-container {
          position: absolute;
          top: 48.2%;
          left: 50.5%;
          transform: translate(-50%, -50%);
          width: 14px;
          height: 8px;
          z-index: 5;
          pointer-events: none;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mouth-patch {
          width: 100%;
          height: 100%;
          position: relative;
        }

        /* Talking animation: rapidly scales open/close */
        .boy-mouth-container.speaking {
          animation: speakMouth 0.16s infinite alternate ease-in-out;
        }

        /* Animated Audio Visualizer below avatar */
        .speech-bars-container {
          display: flex;
          align-items: flex-end;
          justify-content: center;
          gap: 4px;
          height: 24px;
          margin-top: 15px;
          z-index: 2;
        }

        .speech-bar {
          width: 3px;
          background: linear-gradient(to top, var(--secondary), var(--primary));
          border-radius: 3px;
          height: 4px;
          transition: height 0.15s ease;
        }

        .speech-bar.animating {
          animation: bounceSpeechBar 0.5s infinite alternate ease-in-out;
        }

        .speech-bar.b1 { animation-delay: 0.1s; }
        .speech-bar.b2 { animation-delay: 0.25s; }
        .speech-bar.b3 { animation-delay: 0.05s; }
        .speech-bar.b4 { animation-delay: 0.35s; }
        .speech-bar.b5 { animation-delay: 0.15s; }

        /* KEYFRAMES KEYFRAMES KEYFRAMES */
        @keyframes avatarBreath {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-6px) scale(1.02);
          }
        }

        @keyframes avatarTalkBob {
          0%, 100% {
            transform: translateY(-6px) rotate(0deg);
          }
          25% {
            transform: translateY(-9px) rotate(-1deg);
          }
          75% {
            transform: translateY(-3px) rotate(1deg);
          }
        }

        @keyframes rotateClockwise {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes rotateCounterClockwise {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }

        @keyframes speakMouth {
          0% {
            transform: translate(-50%, -50%) scaleY(0.25);
          }
          100% {
            transform: translate(-50%, -50%) scaleY(1.3) scaleX(1.15);
          }
        }

        @keyframes bounceSpeechBar {
          0% { height: 4px; }
          100% { height: 20px; }
        }
      `}</style>

      <div className="avatar-card-wrapper">
        {/* Spotlight Blur behind Avatar */}
        <div className={`avatar-spotlight ${isLightOn ? 'light-on-glow' : 'light-off-glow'}`}></div>

        {/* Core Animated Avatar Frame */}
        <div className={`avatar-interactive-frame ${isSpeaking ? 'speaking' : 'idle'}`}>
          
          {/* Dual concentric neon rings */}
          <div className="border-ring border-outer"></div>
          <div className="border-ring border-inner"></div>

          {/* Boy Avatar Image */}
          <img src={boyAvatar} alt="Karthik Chandhru Avatar" className="avatar-img-content" />

          {/* Talking Mouth Overlay */}
          <div className={`boy-mouth-container ${isSpeaking ? 'speaking' : ''}`}>
            <div className="mouth-patch">
              <svg viewBox="0 0 20 10" width="100%" height="100%">
                {isSpeaking ? (
                  // Open mouth shape when speaking
                  <ellipse cx="10" cy="5" rx="7" ry="4.5" fill="#20110b" stroke="#0f0704" strokeWidth="0.8" />
                ) : (
                  // Neutral smile shape when idle (transparent, blends in)
                  <path d="M 3,3 Q 10,6 17,3" fill="none" stroke="#2a160d" strokeWidth="1.2" strokeLinecap="round" />
                )}
              </svg>
            </div>
          </div>
        </div>

        {/* Visualizer Wave Bars */}
        <div className="speech-bars-container">
          <span className={`speech-bar b1 ${isSpeaking ? 'animating' : ''}`}></span>
          <span className={`speech-bar b2 ${isSpeaking ? 'animating' : ''}`}></span>
          <span className={`speech-bar b3 ${isSpeaking ? 'animating' : ''}`}></span>
          <span className={`speech-bar b4 ${isSpeaking ? 'animating' : ''}`}></span>
          <span className={`speech-bar b5 ${isSpeaking ? 'animating' : ''}`}></span>
        </div>

        {/* Control Button Overlay */}
        <div className="avatar-control-overlay" style={{ marginTop: '10px' }}>
          <button 
            className={`btn-greet ${isSpeaking ? 'active' : ''}`}
            onClick={speakGreeting}
            disabled={isSpeaking}
          >
            {isSpeaking ? (
              <>
                <span className="speech-wave-bar bar-1"></span>
                <span className="speech-wave-bar bar-2"></span>
                <span className="speech-wave-bar bar-3"></span>
                Speaking...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                  <path d="M19 10v1a7 7 0 0 1-14 0v-1"/>
                  <line x1="12" x2="12" y1="19" y2="22"/>
                </svg>
                Greet Me!
              </>
            )}
          </button>

          {speechError && (
            <div className="speech-error-tag" style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '5px' }}>
              {speechError}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
