"use client";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Application, SplineEvent } from "@splinetool/runtime";
import { useLenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
const Spline = React.lazy(() => import("@splinetool/react-spline"));
import { Skill, SkillNames, SKILLS } from "@/data/skills-3d";
import { sleep } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { usePreloader } from "./preloader";
import { useTheme } from "next-themes";
import { Section, getKeyboardState } from "./animated-background-config";
import { initKeyboardAudio, playPress, playRelease } from "./keyboard/keyboard-audio";
import BoardPlaceholder from "./keyboard/board-placeholder";
import SceneBoundary from "./keyboard/scene-boundary";

gsap.registerPlugin(ScrollTrigger);

// Tween used to move the board between sections; near-instant under reduced motion.
const REDUCED =
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const MOVE = REDUCED
  ? { duration: 0.001, ease: "none" }
  : { duration: 1.5, ease: "power3.out" };

/**
 * Lowers the renderer's pixel ratio to 1.5 on mobile and 2 on desktop. A
 * "native" ratio on a 3x phone renders nine times the pixels every frame.
 * The renderer is private runtime API, so every access is guarded.
 */
function capPixelRatio(app: Application, mobile: boolean) {
  type Renderer = {
    getPixelRatio?: () => number;
    setPixelRatio?: (ratio: number) => void;
    setSize?: (w: number, h: number, updateStyle?: boolean) => void;
  };
  const renderer = (app as unknown as { _renderer?: Renderer })._renderer;
  if (!renderer?.getPixelRatio || !renderer.setPixelRatio || !renderer.setSize) return;

  const cap = mobile ? 1.5 : 2;
  const current = renderer.getPixelRatio();
  if (!(current > cap)) return;

  renderer.setPixelRatio(cap);
  // Resize the backing store without touching the CSS size.
  const { clientWidth, clientHeight } = app.canvas;
  if (clientWidth && clientHeight) renderer.setSize(clientWidth, clientHeight, false);
}

const AnimatedBackground = () => {
  const { isLoading, bypassLoading } = usePreloader();
  const { theme } = useTheme();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const splineContainer = useRef<HTMLDivElement>(null);
  const [splineApp, setSplineApp] = useState<Application>();
  const selectedSkillRef = useRef<Skill | null>(null);

  const playPressSound = playPress;
  const playReleaseSound = playRelease;

  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  // Drive ScrollTrigger from Lenis so both run on the same frame clock.
  useLenis(ScrollTrigger.update);

  const [activeSection, setActiveSection] = useState<Section>("hero");

  // Full strength where the board is the subject, dimmed behind text. On phones
  // the hero copy scrolls over the board, so it is dimmed there too.
  const boardOpacity =
    activeSection === "hero"
      ? isMobile
        ? 0.55
        : 1
      : activeSection === "skills"
        ? 0.42
        : 0.3;

  const bongoAnimationRef = useRef<{ start: () => void; stop: () => void } | undefined>(undefined);
  const keycapAnimationsRef = useRef<{ start: () => void; stop: () => void } | undefined>(undefined);
  const revealTimeline = useRef<gsap.core.Timeline | undefined>(undefined);

  const [keyboardRevealed, setKeyboardRevealed] = useState(false);

  /** Selects the cap under the pointer. Used for hover and for taps. */
  const handleMouseHover = (e: SplineEvent) => {
    if (!splineApp || selectedSkillRef.current?.name === e.target.name) return;

    if (e.target.name === "body" || e.target.name === "platform") {
      if (selectedSkillRef.current) playReleaseSound();
      setSelectedSkill(null);
      selectedSkillRef.current = null;
      if (splineApp.getVariable("heading") && splineApp.getVariable("desc")) {
        splineApp.setVariable("heading", "");
        splineApp.setVariable("desc", "");
      }
    } else {
      if (!selectedSkillRef.current || selectedSkillRef.current.name !== e.target.name) {
        const skill = SKILLS[e.target.name as SkillNames];
        if (skill) {
          if (selectedSkillRef.current) playReleaseSound();
          playPressSound();
          setSelectedSkill(skill);
          selectedSkillRef.current = skill;
        }
      }
    }
  };

  const handleSplineInteractions = () => {
    if (!splineApp) return;

    const isInputFocused = () => {
      const activeElement = document.activeElement;
      return (
        activeElement &&
        (activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA" ||
          (activeElement as HTMLElement).isContentEditable)
      );
    };

    splineApp.addEventListener("keyUp", () => {
      if (!splineApp || isInputFocused()) return;
      playReleaseSound();
      splineApp.setVariable("heading", "");
      splineApp.setVariable("desc", "");
    });
    splineApp.addEventListener("keyDown", (e) => {
      if (!splineApp || isInputFocused()) return;
      const skill = SKILLS[e.target.name as SkillNames];
      if (skill) {
        playPressSound();
        setSelectedSkill(skill);
        selectedSkillRef.current = skill;
        splineApp.setVariable("heading", skill.label);
        splineApp.setVariable("desc", skill.shortDescription);
      }
    });
    splineApp.addEventListener("mouseHover", handleMouseHover);

    // Touch has no hover; Spline reports a tap as mouseDown.
    splineApp.addEventListener("mouseDown", (e) => {
      handleMouseHover(e);
      const skill = SKILLS[e.target.name as SkillNames];
      if (skill) {
        splineApp.setVariable("heading", skill.label);
        splineApp.setVariable("desc", skill.shortDescription);
      }
    });
  };

  const createSectionTimeline = (
    triggerId: string,
    targetSection: Section,
    prevSection: Section,
    start: string = "top 50%",
    end: string = "bottom bottom"
  ) => {
    if (!splineApp) return;
    const kbd = splineApp.findObjectByName("keyboard");
    if (!kbd) return;

    gsap.timeline({
      scrollTrigger: {
        trigger: triggerId,
        start,
        end,
        onEnter: () => {
          setActiveSection(targetSection);
          const state = getKeyboardState({ section: targetSection, isMobile });
          gsap.to(kbd.scale, { ...state.scale, duration: MOVE.duration, ease: MOVE.ease });
          gsap.to(kbd.position, { ...state.position, duration: MOVE.duration, ease: MOVE.ease });
          gsap.to(kbd.rotation, { ...state.rotation, duration: MOVE.duration, ease: MOVE.ease });
        },
        onLeaveBack: () => {
          setActiveSection(prevSection);
          const state = getKeyboardState({ section: prevSection, isMobile, });
          gsap.to(kbd.scale, { ...state.scale, duration: MOVE.duration, ease: MOVE.ease });
          gsap.to(kbd.position, { ...state.position, duration: MOVE.duration, ease: MOVE.ease });
          gsap.to(kbd.rotation, { ...state.rotation, duration: MOVE.duration, ease: MOVE.ease });
        },
      },
    });
  };

  const setupScrollAnimations = () => {
    if (!splineApp || !splineContainer.current) return;
    const kbd = splineApp.findObjectByName("keyboard");
    if (!kbd) return;

    const heroState = getKeyboardState({ section: "hero", isMobile });
    gsap.set(kbd.scale, heroState.scale);
    gsap.set(kbd.position, heroState.position);

    // Each section falls back to the previous one in page order when scrolling
    // up, so this chain must follow the page: hero, projects, skills, contact.
    // Projects triggers early so the board clears the copy above the grid.
    createSectionTimeline("#projects", "projects", "hero", "top bottom");
    createSectionTimeline("#skills", "skills", "projects");
    createSectionTimeline("#contact", "contact", "skills", "top 30%");
  };

  const getBongoAnimation = () => {
    const framesParent = splineApp?.findObjectByName("bongo-cat");
    const frame1 = splineApp?.findObjectByName("frame-1");
    const frame2 = splineApp?.findObjectByName("frame-2");

    if (!frame1 || !frame2 || !framesParent) {
      return { start: () => { }, stop: () => { } };
    }

    // Two-frame flipbook at 10 Hz, on rAF so it pauses in background tabs.
    const FRAME_MS = 100;
    let raf = 0;
    let last = 0;
    let odd = false;

    const step = (now: number) => {
      if (now - last >= FRAME_MS) {
        last = now;
        odd = !odd;
        frame1.visible = !odd;
        frame2.visible = odd;
      }
      raf = requestAnimationFrame(step);
    };

    const start = () => {
      if (raf) return;
      last = 0;
      odd = false;
      framesParent.visible = true;
      raf = requestAnimationFrame(step);
    };

    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      framesParent.visible = false;
      frame1.visible = false;
      frame2.visible = false;
    };

    return { start, stop };
  };

  const getKeycapsAnimation = () => {
    if (!splineApp) return { start: () => { }, stop: () => { } };

    const tweens: gsap.core.Tween[] = [];
    const removePrevTweens = () => tweens.forEach((t) => t.kill());

    const start = () => {
      removePrevTweens();
      (Object.values(SKILLS) as Skill[])
        .sort(() => Math.random() - 0.5)
        .forEach((skill, idx) => {
          const keycap = splineApp.findObjectByName(skill.name);
          if (!keycap) return;
          const t = gsap.to(keycap.position, {
            y: Math.random() * 200 + 200,
            duration: Math.random() * 2 + 2,
            delay: idx * 0.6,
            repeat: -1,
            yoyo: true,
            yoyoEase: "none",
            ease: "elastic.out(1,0.3)",
          });
          tweens.push(t);
        });
    };

    const stop = () => {
      removePrevTweens();
      (Object.values(SKILLS) as Skill[]).forEach((skill) => {
        const keycap = splineApp.findObjectByName(skill.name);
        if (!keycap) return;
        const t = gsap.to(keycap.position, {
          y: 0,
          duration: 4,
          repeat: 1,
          ease: "elastic.out(1,0.7)",
        });
        tweens.push(t);
      });
      setTimeout(removePrevTweens, 1000);
    };

    return { start, stop };
  };

  const updateKeyboardTransform = async () => {
    if (!splineApp) return;
    const kbd = splineApp.findObjectByName("keyboard");
    if (!kbd) return;

    kbd.visible = false;
    await sleep(400);
    kbd.visible = true;
    setKeyboardRevealed(true);

    const currentState = getKeyboardState({ section: activeSection, isMobile });
    gsap.fromTo(
      kbd.scale,
      { x: 0.01, y: 0.01, z: 0.01 },
      {
        ...currentState.scale,
        duration: 1.5,
        ease: "elastic.out(1, 0.6)",
      }
    );

    const allObjects = splineApp.getAllObjects();
    const keycaps = allObjects.filter((obj) => obj.name === "keycap");

    await sleep(900);

    // One timeline for the staggered reveal, so it can be killed part way.
    revealTimeline.current?.kill();
    const tl = gsap.timeline();
    revealTimeline.current = tl;

    const STAGGER = 0.07;

    if (isMobile) {
      allObjects
        .filter((obj) => obj.name === "keycap-mobile")
        .forEach((keycap) => {
          keycap.visible = true;
        });
    } else {
      allObjects
        .filter((obj) => obj.name === "keycap-desktop")
        .forEach((keycap, idx) => {
          tl.call(
            () => {
              keycap.visible = true;
            },
            undefined,
            idx * STAGGER
          );
        });
    }

    keycaps.forEach((keycap, idx) => {
      keycap.visible = false;
      tl.call(
        () => {
          keycap.visible = true;
        },
        undefined,
        idx * STAGGER
      );
    });

    if (keycaps.length) {
      tl.fromTo(
        keycaps.map((k) => k.position),
        { y: 200 },
        { y: 50, duration: 0.5, ease: "bounce.out", stagger: STAGGER },
        0.1
      );
    }
  };

  useEffect(() => {
    if (!splineApp) return;
    handleSplineInteractions();
    setupScrollAnimations();
    // Trigger positions were measured before the scene and fonts loaded.
    ScrollTrigger.refresh();
    bongoAnimationRef.current = getBongoAnimation();
    keycapAnimationsRef.current = getKeycapsAnimation();
    return () => {
      bongoAnimationRef.current?.stop();
      keycapAnimationsRef.current?.stop();
      revealTimeline.current?.kill();
    };
    // Re-wire only when the scene loads or the breakpoint changes; the helper
    // functions are recreated every render and must not be dependencies.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [splineApp, isMobile]);

  // The skills label variants are named by ink colour: dark ink for the light theme.
  useEffect(() => {
    if (!splineApp) return;
    const textDesktopDark = splineApp.findObjectByName("text-desktop-dark");
    const textDesktopLight = splineApp.findObjectByName("text-desktop");
    const textMobileDark = splineApp.findObjectByName("text-mobile-dark");
    const textMobileLight = splineApp.findObjectByName("text-mobile");

    if (!textDesktopDark || !textDesktopLight || !textMobileDark || !textMobileLight) return;

    const setVisibility = (
      dDark: boolean,
      dLight: boolean,
      mDark: boolean,
      mLight: boolean
    ) => {
      textDesktopDark.visible = dDark;
      textDesktopLight.visible = dLight;
      textMobileDark.visible = mDark;
      textMobileLight.visible = mLight;
    };

    if (activeSection !== "skills") {
      setVisibility(false, false, false, false);
      return;
    }

    const lightInk = theme === "dark";
    setVisibility(
      !isMobile && !lightInk,
      !isMobile && lightInk,
      isMobile && !lightInk,
      isMobile && lightInk
    );
  }, [theme, splineApp, isMobile, activeSection]);

  useEffect(() => {
    if (!selectedSkill || !splineApp) return;
    splineApp.setVariable("heading", selectedSkill.label);
    splineApp.setVariable("desc", selectedSkill.shortDescription);
  }, [selectedSkill, splineApp]);

  useEffect(() => {
    if (!splineApp) return;

    let rotateKeyboard: gsap.core.Tween | undefined;
    let teardownKeyboard: gsap.core.Tween | undefined;

    const kbd = splineApp.findObjectByName("keyboard");

    if (kbd) {
      rotateKeyboard = gsap.to(kbd.rotation, {
        y: Math.PI * 2 + kbd.rotation.y,
        duration: 10,
        repeat: -1,
        yoyo: true,
        yoyoEase: true,
        ease: "back.inOut",
        delay: 2.5,
        paused: true,
      });

      teardownKeyboard = gsap.fromTo(
        kbd.rotation,
        { y: 0, x: -Math.PI, z: 0 },
        {
          y: -Math.PI / 2,
          duration: 5,
          repeat: -1,
          yoyo: true,
          yoyoEase: true,
          delay: 2.5,
          immediateRender: false,
          paused: true,
        }
      );
    }

    const manageAnimations = async () => {
      if (activeSection !== "skills") {
        splineApp.setVariable("heading", "");
        splineApp.setVariable("desc", "");
      }

      if (activeSection === "hero") {
        rotateKeyboard?.restart();
        teardownKeyboard?.pause();
      } else if (activeSection === "contact") {
        rotateKeyboard?.pause();
      } else {
        rotateKeyboard?.pause();
        teardownKeyboard?.pause();
      }

      if (activeSection === "projects") {
        await sleep(300);
        bongoAnimationRef.current?.start();
      } else {
        await sleep(200);
        bongoAnimationRef.current?.stop();
      }

      if (activeSection === "contact") {
        await sleep(600);
        teardownKeyboard?.restart();
        keycapAnimationsRef.current?.start();
      } else {
        await sleep(600);
        teardownKeyboard?.pause();
        keycapAnimationsRef.current?.stop();
      }
    };

    manageAnimations();

    return () => {
      rotateKeyboard?.kill();
      teardownKeyboard?.kill();
    };
  }, [activeSection, splineApp]);

  // Pointer parallax on the container element, so it never competes with the
  // section tweens on kbd.rotation. Eased in a rAF loop that stops when settled.
  useEffect(() => {
    const el = splineContainer.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let targetX = 0, targetY = 0, curX = 0, curY = 0;
    let frame = 0;

    const AMOUNT_X = 14;
    const AMOUNT_Y = 10;
    // Fraction of the remaining distance covered per frame.
    const EASE = 0.075;

    const tick = () => {
      curX += (targetX - curX) * EASE;
      curY += (targetY - curY) * EASE;

      if (Math.abs(targetX - curX) < 0.05 && Math.abs(targetY - curY) < 0.05) {
        curX = targetX;
        curY = targetY;
        el.style.transform = `translate3d(${curX.toFixed(2)}px, ${curY.toFixed(2)}px, 0)`;
        frame = 0;
        return;
      }

      el.style.transform = `translate3d(${curX.toFixed(2)}px, ${curY.toFixed(2)}px, 0)`;
      frame = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 2 * AMOUNT_X;
      targetY = (e.clientY / window.innerHeight - 0.5) * 2 * AMOUNT_Y;
      if (!frame) frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Mirror the section in the URL without adding history entries.
  useEffect(() => {
    const hash = activeSection === "hero" ? "" : `#${activeSection}`;
    window.history.replaceState(null, "", "/" + hash);
  }, [activeSection]);

  // Opening reveal, once the scene has loaded.
  useEffect(() => {
    if (!splineApp || isLoading || keyboardRevealed) return;
    updateKeyboardTransform();
    // keyboardRevealed makes this run once; the helper is recreated every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [splineApp, isLoading, keyboardRevealed]);

  return (
    // Silhouette in the same position while the runtime downloads. If the
    // runtime cannot load, the page carries on without the keyboard.
    <SceneBoundary fallback={null}>
      <Suspense fallback={<BoardPlaceholder />}>
        <Spline
          className="pointer-events-auto w-full h-full fixed transition-opacity duration-700 ease-out print:hidden"
          style={{ opacity: boardOpacity }}
          ref={splineContainer}
          onLoad={(app: Application) => {
            setSplineApp(app);
            bypassLoading();
            // The AudioContext can only start after a user gesture.
            initKeyboardAudio();
            capPixelRatio(app, isMobile);
          }}
          scene="/assets/skills-keyboard.spline"
        />
      </Suspense>
    </SceneBoundary>
  );
};

export default AnimatedBackground;
