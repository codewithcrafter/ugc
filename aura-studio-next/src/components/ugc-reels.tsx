'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { productConfig } from '../config/product';
import { ReelItem } from '../types';
import { 
  Heart, 
  Volume2, 
  VolumeX, 
  Share2, 
  ChevronUp, 
  ChevronDown, 
  Play, 
  Pause, 
  ExternalLink, 
  Check,
  Sparkles
} from 'lucide-react';

export function UgcReels() {
  const { reels } = productConfig;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [showPlayPauseFeedback, setShowPlayPauseFeedback] = useState<'play' | 'pause' | null>(null);
  const [copiedToast, setCopiedToast] = useState(false);
  const [showHeartBurst, setShowHeartBurst] = useState(false);

  const feedRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const lastTapRef = useRef<number>(0);

  // Play/pause the active video
  useEffect(() => {
    videoRefs.current.forEach((vid, idx) => {
      if (!vid) return;
      if (idx === activeIndex) {
        vid.muted = isMuted;
        if (isPlaying) {
          vid.play().catch(() => {
            // Autoplay policy or video not available; poster shows gracefully
          });
        } else {
          vid.pause();
        }
      } else {
        vid.pause();
        vid.currentTime = 0;
      }
    });
  }, [activeIndex, isPlaying, isMuted]);

  // Handle scroll snap detection
  const handleScroll = useCallback(() => {
    if (!feedRef.current) return;
    const container = feedRef.current;
    const height = container.clientHeight;
    if (height === 0) return;
    const scrollPos = container.scrollTop;
    const newIdx = Math.round(scrollPos / height);
    if (newIdx >= 0 && newIdx < reels.length && newIdx !== activeIndex) {
      setActiveIndex(newIdx);
      setIsPlaying(true);
    }
  }, [activeIndex, reels.length]);

  const scrollToIndex = (index: number) => {
    if (!feedRef.current) return;
    const targetIdx = Math.max(0, Math.min(reels.length - 1, index));
    const height = feedRef.current.clientHeight;
    feedRef.current.scrollTo({
      top: targetIdx * height,
      behavior: 'smooth'
    });
    setActiveIndex(targetIdx);
  };

  const togglePlayPause = () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    setShowPlayPauseFeedback(nextState ? 'play' : 'pause');
    setTimeout(() => setShowPlayPauseFeedback(null), 600);
  };

  const handleDoubleTap = (reelId: string) => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      // Double tap detected
      setLikedMap(prev => ({ ...prev, [reelId]: true }));
      setShowHeartBurst(true);
      setTimeout(() => setShowHeartBurst(false), 800);
    } else {
      togglePlayPause();
    }
    lastTapRef.current = now;
  };

  const toggleLike = (reelId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedMap(prev => ({ ...prev, [reelId]: !prev[reelId] }));
  };

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(prev => !prev);
  };

  const handleShare = (reel: ReelItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = typeof window !== 'undefined' ? `${window.location.origin}#product-slider` : '';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopiedToast(true);
        setTimeout(() => setCopiedToast(false), 2000);
      }).catch(() => {});
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if user is typing in form
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        scrollToIndex(activeIndex + 1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        scrollToIndex(activeIndex - 1);
      } else if (e.key === ' ' && e.target === document.body) {
        e.preventDefault();
        togglePlayPause();
      } else if (e.key.toLowerCase() === 'm') {
        setIsMuted(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex]);

  const currentReel = reels[activeIndex] || reels[0];

  return (
    <section 
      className="py-20 md:py-28 relative overflow-hidden bg-gradient-to-b from-[#FFFCF8] via-[#F8F5FF] to-[#FFFCF8]" 
      id="product-slider"
      aria-label="Community in Motion Smartphone Reels"
    >
      {/* Background Studio Lights */}
      <div className="absolute inset-0 pointer-events-none -z-10" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#E9DFFF]/40 blur-[120px]" />
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-[#FFB8CB]/30 blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7545F5]/10 text-[#7545F5] text-xs font-semibold tracking-wider uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>[SCENE 02] 24FPS // 9:16 VERTICAL MOTION REELS</span>
          </div>
          <span className="block text-xs font-bold tracking-widest text-[#7545F5] uppercase mb-2">
            COMMUNITY IN MOTION
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1A1918] mb-4">
            Real Spaces. Unfiltered Acoustics.
          </h2>
          <p className="text-base sm:text-lg text-[#1A1918]/70 leading-relaxed font-light">
            Watch how architects, interior creators, and morning ritualists experience AURA in their private sanctuaries. Scroll inside the smartphone to explore vertical reels, tap to play or pause, and toggle audio.
          </p>
        </div>

        {/* Smartphone Stage Wrapper with Desktop Flanking Controls */}
        <div className="relative flex items-center justify-center gap-6 lg:gap-12 max-w-4xl mx-auto">
          
          {/* Left Desktop Control (Previous Reel) */}
          <div className="hidden md:flex flex-col items-center gap-4">
            <button
              type="button"
              onClick={() => scrollToIndex(activeIndex - 1)}
              disabled={activeIndex === 0}
              aria-label="Previous reel"
              className="w-12 h-12 rounded-full bg-white border border-[#7545F5]/20 shadow-md flex items-center justify-center text-[#1A1918] hover:bg-[#7545F5] hover:text-white hover:border-[#7545F5] disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-[#1A1918] transition-all duration-200 active:scale-95"
            >
              <ChevronUp className="w-6 h-6" />
            </button>
            <span className="text-xs font-mono font-semibold text-slate-400">
              0{activeIndex + 1} / 0{reels.length}
            </span>
          </div>

          {/* REALISTIC CERAMIC SMARTPHONE CHASSIS */}
          <div className="relative w-full max-w-[340px] sm:max-w-[380px] aspect-[9/19] rounded-[48px] p-3.5 bg-gradient-to-b from-stone-200 via-stone-100 to-stone-300 shadow-[0_25px_60px_-15px_rgba(117,69,245,0.25),0_0_0_1px_rgba(255,255,255,0.8)_inset,0_12px_24px_-6px_rgba(0,0,0,0.15)] ring-1 ring-black/10 select-none">
            
            {/* Inner Bezel Screen */}
            <div className="relative w-full h-full rounded-[38px] bg-black overflow-hidden shadow-inner">
              
              {/* Dynamic Island Header */}
              <div className="absolute top-0 inset-x-0 h-11 z-30 flex items-center justify-between px-6 pointer-events-none text-white/90 text-xs font-medium">
                <span>9:41</span>
                
                {/* Dynamic Island Capsule */}
                <div className="w-24 h-6 rounded-full bg-black border border-white/10 flex items-center justify-center gap-2 px-2 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-[#7545F5] animate-pulse" />
                  <div className="flex items-center gap-0.5">
                    <span className="w-0.5 h-2 bg-[#E4FF83] rounded-full animate-bounce" />
                    <span className="w-0.5 h-3 bg-[#E4FF83] rounded-full animate-bounce delay-75" />
                    <span className="w-0.5 h-1.5 bg-[#E4FF83] rounded-full animate-bounce delay-150" />
                  </div>
                </div>

                {/* Battery & Signal icons */}
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-2.5 rounded-[2px] border border-white/80 p-0.5 flex items-center">
                    <div className="w-full h-full bg-white rounded-[1px]" />
                  </div>
                </div>
              </div>

              {/* Segmented Story Progress Bars */}
              <div className="absolute top-12 inset-x-4 z-30 flex items-center gap-1.5 pointer-events-none">
                {reels.map((_, idx) => (
                  <div 
                    key={idx} 
                    className="h-1 flex-1 rounded-full bg-white/30 overflow-hidden backdrop-blur-xs"
                  >
                    <div 
                      className={`h-full bg-white transition-all duration-300 ${
                        idx === activeIndex ? 'w-full' : idx < activeIndex ? 'w-full bg-white/70' : 'w-0'
                      }`}
                    />
                  </div>
                ))}
              </div>

              {/* VERTICAL SCROLL-SNAP REELS FEED */}
              <div 
                ref={feedRef}
                onScroll={handleScroll}
                className="w-full h-full overflow-y-scroll snap-y snap-mandatory no-scrollbar"
                style={{ scrollSnapType: 'y mandatory', WebkitOverflowScrolling: 'touch' }}
                onClick={() => handleDoubleTap(currentReel.id)}
              >
                {reels.map((reel, index) => {
                  const isCurrent = index === activeIndex;
                  const isLiked = Boolean(likedMap[reel.id]);

                  return (
                    <div 
                      key={reel.id}
                      className="relative w-full h-full snap-start snap-always shrink-0 overflow-hidden"
                    >
                      {/* Media Video / Poster */}
                      {reel.videoSrc && (
                        <video
                          ref={el => { videoRefs.current[index] = el; }}
                          src={reel.videoSrc}
                          poster={reel.poster}
                          playsInline
                          loop
                          muted={isMuted}
                          preload={index === 0 ? 'auto' : 'metadata'}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      )}
                      {/* Graceful image fallback if video cannot play */}
                      <Image
                        src={reel.poster}
                        alt={reel.alt || reel.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 380px"
                        priority={index === 0}
                        className={`absolute inset-0 w-full h-full object-cover -z-10 ${reel.videoSrc ? 'hidden' : 'block'}`}
                      />

                      {/* Subtle Top & Bottom Scrims for Text Readability */}
                      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
                      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />

                      {/* Right-Side Action Bar */}
                      <div className="absolute right-3.5 bottom-16 z-20 flex flex-col items-center gap-4">
                        
                        {/* Like Button */}
                        <button
                          type="button"
                          onClick={(e) => toggleLike(reel.id, e)}
                          aria-label={isLiked ? 'Unlike reel' : 'Like reel'}
                          className="group flex flex-col items-center gap-1 text-white active:scale-75 transition-transform"
                        >
                          <div className={`w-11 h-11 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${
                            isLiked ? 'bg-[#FF385C] text-white shadow-lg' : 'bg-black/40 text-white/90 hover:bg-black/60'
                          }`}>
                            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                          </div>
                          <span className="text-[11px] font-semibold text-white/90 drop-shadow-md">
                            {isLiked ? (parseInt(reel.likes) + 1).toLocaleString() : reel.likes}
                          </span>
                        </button>

                        {/* Sound Toggle */}
                        <button
                          type="button"
                          onClick={toggleSound}
                          aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
                          className="flex flex-col items-center gap-1 text-white active:scale-75 transition-transform"
                        >
                          <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/90 hover:bg-black/60 transition-all">
                            {isMuted ? <VolumeX className="w-5 h-5 text-rose-300" /> : <Volume2 className="w-5 h-5 text-[#E4FF83]" />}
                          </div>
                          <span className="text-[10px] font-semibold text-white/80 drop-shadow-md">
                            {isMuted ? 'Muted' : 'Sound'}
                          </span>
                        </button>

                        {/* Share Button */}
                        <button
                          type="button"
                          onClick={(e) => handleShare(reel, e)}
                          aria-label="Share reel link"
                          className="flex flex-col items-center gap-1 text-white active:scale-75 transition-transform"
                        >
                          <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/90 hover:bg-black/60 transition-all">
                            <Share2 className="w-5 h-5" />
                          </div>
                          <span className="text-[10px] font-semibold text-white/80 drop-shadow-md">Share</span>
                        </button>

                        {/* Inquire / Details Link */}
                        <a
                          href="#lead-form"
                          onClick={(e) => e.stopPropagation()}
                          aria-label="Inquire about this edition"
                          className="flex flex-col items-center gap-1 text-white active:scale-75 transition-transform"
                        >
                          <div className="w-11 h-11 rounded-full bg-[#7545F5] flex items-center justify-center text-white shadow-md hover:bg-[#6232e0] transition-all">
                            <ExternalLink className="w-4 h-4" />
                          </div>
                          <span className="text-[10px] font-semibold text-[#E4FF83] drop-shadow-md">Details</span>
                        </a>

                      </div>

                      {/* Bottom Caption & Creator Info */}
                      <div className="absolute left-4 right-16 bottom-7 z-20 text-white">
                        <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#7545F5]/80 text-[#E4FF83] text-[10px] font-bold tracking-wider uppercase mb-2 backdrop-blur-xs">
                          {reel.tag}
                        </div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#7545F5] to-[#FFB8CB] text-white flex items-center justify-center font-bold text-xs ring-1 ring-white/50">
                            {reel.creator.charAt(0)}
                          </span>
                          <div>
                            <span className="block font-semibold text-sm leading-tight text-white drop-shadow-sm">
                              {reel.creator}
                            </span>
                            <span className="block text-[11px] text-white/70">
                              {reel.handle}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-white/90 line-clamp-2 leading-relaxed font-light drop-shadow-sm">
                          {reel.quote}
                        </p>
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Centered Play / Pause Micro-Feedback */}
              {showPlayPauseFeedback && (
                <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none animate-scale-fade">
                  <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white shadow-2xl">
                    {showPlayPauseFeedback === 'play' ? (
                      <Play className="w-8 h-8 fill-current ml-1" />
                    ) : (
                      <Pause className="w-8 h-8 fill-current" />
                    )}
                  </div>
                </div>
              )}

              {/* Double-Tap Heart Burst */}
              {showHeartBurst && (
                <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none animate-heart-burst">
                  <Heart className="w-24 h-24 text-[#FF385C] fill-current drop-shadow-2xl" />
                </div>
              )}

              {/* Copied to Clipboard Toast */}
              {copiedToast && (
                <div className="absolute top-20 inset-x-8 z-40 flex items-center justify-center pointer-events-none">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/80 backdrop-blur-md text-white text-xs font-semibold shadow-lg">
                    <Check className="w-3.5 h-3.5 text-[#E4FF83]" />
                    <span>Reel link copied to clipboard</span>
                  </div>
                </div>
              )}

              {/* Phone Home Indicator Bar */}
              <div className="absolute bottom-2 inset-x-0 h-1 flex justify-center pointer-events-none z-30">
                <div className="w-28 h-1 rounded-full bg-white/70" />
              </div>

            </div>
          </div>

          {/* Right Desktop Control (Next Reel) */}
          <div className="hidden md:flex flex-col items-center gap-4">
            <button
              type="button"
              onClick={() => scrollToIndex(activeIndex + 1)}
              disabled={activeIndex === reels.length - 1}
              aria-label="Next reel"
              className="w-12 h-12 rounded-full bg-white border border-[#7545F5]/20 shadow-md flex items-center justify-center text-[#1A1918] hover:bg-[#7545F5] hover:text-white hover:border-[#7545F5] disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-[#1A1918] transition-all duration-200 active:scale-95"
            >
              <ChevronDown className="w-6 h-6" />
            </button>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              SCROLL FEED
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}
