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

    const text = "Hi, I am Karthik Chandhru from Erode. I am a MERN Stack, Dot net Developer and AIML Engineer, and I am happy to see you!";
    const utterance = new SpeechSynthesisUtterance(text);

    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
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
          border-radius: 50%;
          filter: blur(60px);
          z-index: 1;
          pointer-events: none;
          transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* LIGHTS ON: Warm bright golden sunlight glow */
        .avatar-spotlight.sunlight-on {
          width: 380px;
          height: 380px;
          background: radial-gradient(circle, rgba(250, 204, 21, 0.65) 0%, rgba(245, 158, 11, 0.25) 45%, rgba(0,0,0,0) 70%);
          box-shadow: 0 0 80px rgba(250, 204, 21, 0.2);
        }

        /* LIGHTS OFF: Dim cool electric blue ambient glow */
        .avatar-spotlight.sunlight-off {
          width: 250px;
          height: 250px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.22) 0%, rgba(0,0,0,0) 70%);
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
          transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Profile Shadows depending on Light switch status */
        .avatar-interactive-frame.glow-on {
          border: 3px solid rgba(250, 204, 21, 0.95);
          box-shadow: 
            0 0 35px rgba(250, 204, 21, 0.85), 
            0 0 75px rgba(245, 158, 11, 0.45),
            inset 0 0 20px rgba(255, 255, 255, 0.2);
        }

        .avatar-interactive-frame.glow-off {
          border: 3px solid rgba(255, 255, 255, 0.1);
          box-shadow: 
            0 0 15px rgba(59, 130, 246, 0.15),
            inset 0 0 10px rgba(0, 0, 0, 0.5);
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
          transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .border-outer {
          top: -10px;
          left: -10px;
          right: -10px;
          bottom: -10px;
          border: 2px dashed var(--secondary);
          opacity: 0.4;
          animation: rotateClockwise 20s infinite linear;
        }

        .border-outer.glow-on {
          border-color: #facc15;
          opacity: 0.85;
          box-shadow: 0 0 20px rgba(250, 204, 21, 0.65);
        }

        .border-inner {
          top: -4px;
          left: -4px;
          right: -4px;
          bottom: -4px;
          border: 2px solid var(--border-color);
          opacity: 0.5;
          animation: rotateCounterClockwise 15s infinite linear;
        }

        .border-inner.glow-on {
          border-color: #fbbf24;
          opacity: 0.9;
          box-shadow: 0 0 15px rgba(251, 191, 36, 0.65);
        }

        /* Main Image Styling with Sunlight filters */
        .avatar-img-content {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          background-color: #040814;
          position: relative;
          overflow: hidden;
          transition: filter 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* LIGHTS ON: Sunlight filter (boost brightness, contrast, saturation) */
        .avatar-img-content.lit-on {
          filter: brightness(1.1) saturate(1.18) contrast(1.05);
        }

        /* LIGHTS OFF: Dimmed down to look dark */
        .avatar-img-content.lit-off {
          filter: brightness(0.8) saturate(0.88) contrast(0.98);
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

        /* Talking mouth animation */
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
          margin-top: 25px;
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

        /* KEYFRAMES */
        @keyframes avatarBreath {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-6px) scale(1.025);
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
        {/* Spotlight Sunlight Glow behind Avatar */}
        <div className={`avatar-spotlight ${isLightOn ? 'sunlight-on' : 'sunlight-off'}`}></div>

        {/* Core Animated Avatar Frame with Sunlight Glows */}
        <div className={`avatar-interactive-frame ${isLightOn ? 'glow-on' : 'glow-off'} ${isSpeaking ? 'speaking' : 'idle'}`}>
          
          {/* Dual concentric neon rings that shift on light state */}
          <div className={`border-ring border-outer ${isLightOn ? 'glow-on' : ''}`}></div>
          <div className={`border-ring border-inner ${isLightOn ? 'glow-on' : ''}`}></div>

          {/* Boy Avatar Image with sunlight brightness/contrast filters */}
          <img 
            src={boyAvatar} 
            alt="Karthik Chandhru Avatar" 
            className={`avatar-img-content ${isLightOn ? 'lit-on' : 'lit-off'}`} 
          />

          {/* Talking Mouth Overlay */}
          <div className={`boy-mouth-container ${isSpeaking ? 'speaking' : ''}`}>
            <div className="mouth-patch">
              <svg viewBox="0 0 20 10" width="100%" height="100%">
                {isSpeaking ? (
                  // Open mouth shape when speaking
                  <ellipse cx="10" cy="5" rx="7" ry="4.5" fill="#20110b" stroke="#0f0704" strokeWidth="0.8" />
                ) : (
                  // Neutral smile shape when idle
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
