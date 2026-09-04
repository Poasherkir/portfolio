"use client";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Application, SplineEvent } from "@splinetool/runtime";
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

gsap.registerPlugin(ScrollTrigger);

/**
 * How the board travels between sections. Longer and more decelerating than
 * the default, so it arrives rather than stops. Reduced-motion cuts it to a
 * near-instant move — the board still goes where it should, without the trip.
 */
const REDUCED =
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const MOVE = REDUCED
  ? { duration: 0.001, ease: "none" }
  : { duration: 1.5, ease: "power3.out" };

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
  const [activeSection, setActiveSection] = useState<Section>("hero");

  // The borrowed choreography moves and turns the board but never fades it,
  // so on a text-heavy section it sits at full strength over the copy.
  // Hero and skills are where it is meant to be looked at; everywhere else
  // it is background and gets out of the way.
  const boardOpacity =
    activeSection === "hero" ? 1 : activeSection === "skills" ? 0.42 : 0.3;

  // Animation controllers refs
  const bongoAnimationRef = useRef<{ start: () => void; stop: () => void } | undefined>(undefined);
  const keycapAnimationsRef = useRef<{ start: () => void; stop: () => void } | undefined>(undefined);

  const [keyboardRevealed, setKeyboardRevealed] = useState(false);

  // --- Event Handlers ---

  /**
   * Selects the cap under the pointer.
   *
   * Shared by hover and by mouseDown. A phone has no hover at all, so without
   * the second the keyboard is decoration there — every cap inert, the
   * read-out never shown.
   */
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

    // Touch has no hover. Spline maps a tap to mouseDown, so this is what
    // makes the board work at all on a phone.
    splineApp.addEventListener("mouseDown", (e) => {
      handleMouseHover(e);
      const skill = SKILLS[e.target.name as SkillNames];
      if (skill) {
        splineApp.setVariable("heading", skill.label);
        splineApp.setVariable("desc", skill.shortDescription);
      }
    });
  };

  // --- Animation Setup Helpers ---

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
        scrub: true,
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

    // Initial state
    const heroState = getKeyboardState({ section: "hero", isMobile });
    gsap.set(kbd.scale, heroState.scale);
    gsap.set(kbd.position, heroState.position);

    // Section transitions
    // In document order. These carry the section to fall back to when the
    // visitor scrolls back out of them, so the chain has to match the page:
    // hero, projects, stack, contact. It previously read hero, stack,
    // projects, which is the order of the site this choreography came from.
    // Here it meant scrolling up out of the stack handed the board back to
    // the hero pose — full size, dead centre, full opacity — directly on top
    // of the Projects heading.
    //
    // Projects starts at "top bottom" rather than part way up: there is a
    // block of copy between the hero and the grid, and the board has to be
    // clear of it before it is read, not while.
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

    let interval: NodeJS.Timeout;
    const start = () => {
      let i = 0;
      framesParent.visible = true;
      interval = setInterval(() => {
        if (i % 2) {
          frame1.visible = false;
          frame2.visible = true;
        } else {
          frame1.visible = true;
          frame2.visible = false;
        }
        i++;
      }, 100);
    };
    const stop = () => {
      clearInterval(interval);
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

    if (isMobile) {
      const mobileKeyCaps = allObjects.filter((obj) => obj.name === "keycap-mobile");
      mobileKeyCaps.forEach((keycap) => { keycap.visible = true; });
    } else {
      const desktopKeyCaps = allObjects.filter((obj) => obj.name === "keycap-desktop");
      desktopKeyCaps.forEach(async (keycap, idx) => {
        await sleep(idx * 70);
        keycap.visible = true;
      });
    }

    keycaps.forEach(async (keycap, idx) => {
      keycap.visible = false;
      await sleep(idx * 70);
      keycap.visible = true;
      gsap.fromTo(
        keycap.position,
        { y: 200 },
        { y: 50, duration: 0.5, delay: 0.1, ease: "bounce.out" }
      );
    });
  };

  // --- Effects ---

  // Initialize GSAP and Spline interactions
  useEffect(() => {
    if (!splineApp) return;
    handleSplineInteractions();
    setupScrollAnimations();
    bongoAnimationRef.current = getBongoAnimation();
    keycapAnimationsRef.current = getKeycapsAnimation();
    return () => {
      bongoAnimationRef.current?.stop()
      keycapAnimationsRef.current?.stop()
    }

  }, [splineApp, isMobile]);

  // Handle keyboard text visibility based on theme and section
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
    } else if (theme === "dark") {
      isMobile
        ? setVisibility(false, false, false, true)
        : setVisibility(false, true, false, false);
    } else {
      isMobile
        ? setVisibility(false, false, true, false)
        : setVisibility(true, false, false, false);
    }
  }, [theme, splineApp, isMobile, activeSection]);

  useEffect(() => {
    if (!selectedSkill || !splineApp) return;
    // console.log(selectedSkill)
    splineApp.setVariable("heading", selectedSkill.label);
    splineApp.setVariable("desc", selectedSkill.shortDescription);
  }, [selectedSkill]);

  // Handle rotation and teardown animations based on active section
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
        paused: true, // Start paused
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
      // Reset text if not in skills
      if (activeSection !== "skills") {
        splineApp.setVariable("heading", "");
        splineApp.setVariable("desc", "");
      }

      // Handle Rotate/Teardown Tweens
      if (activeSection === "hero") {
        rotateKeyboard?.restart();
        teardownKeyboard?.pause();
      } else if (activeSection === "contact") {
        rotateKeyboard?.pause();
      } else {
        rotateKeyboard?.pause();
        teardownKeyboard?.pause();
      }

      // Handle Bongo Cat
      if (activeSection === "projects") {
        await sleep(300);
        bongoAnimationRef.current?.start();
      } else {
        await sleep(200);
        bongoAnimationRef.current?.stop();
      }

      // Handle Contact Section Animations
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

  /**
   * Parallax on the container, not on the board's own rotation.
   *
   * The section timelines already tween kbd.rotation, and a second writer on
   * the same property fights them. Moving the element instead keeps the two
   * completely independent, and it is a compositor transform rather than a
   * scene-graph change, so it costs nothing per frame.
   */
  useEffect(() => {
    const el = splineContainer.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Coarse pointers have no hover to track.
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let frame = 0;
    const onMove = (e: PointerEvent) => {
      if (frame) return;
      const { clientX, clientY } = e;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const dx = (clientX / window.innerWidth - 0.5) * 2;
        const dy = (clientY / window.innerHeight - 0.5) * 2;
        // Small on purpose: enough that the board feels attached to the
        // cursor, not so much that it reads as a separate animation.
        el.style.transform = `translate3d(${(dx * 14).toFixed(2)}px, ${(dy * 10).toFixed(2)}px, 0)`;
      });
    };

    el.style.transition = "transform 600ms cubic-bezier(0.22, 1, 0.36, 1)";
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Reveal keyboard on load
  useEffect(() => {
    // replaceState, not router.push. Pushing added a history entry for every
    // section the visitor scrolled past, so Back walked them up the page one
    // section at a time instead of leaving the site. This keeps the address
    // bar honest without touching the stack.
    const hash = activeSection === "hero" ? "" : `#${activeSection}`;
    window.history.replaceState(null, "", "/" + hash);

    if (!splineApp || isLoading || keyboardRevealed) return;
    updateKeyboardTransform();
  }, [splineApp, isLoading, activeSection]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Spline
        className="pointer-events-auto w-full h-full fixed transition-opacity duration-700 ease-out"
        style={{ opacity: boardOpacity }}
        ref={splineContainer}
        onLoad={(app: Application) => {
          setSplineApp(app);
          bypassLoading();
          // Creates the AudioContext and arms it on the first real gesture.
          // Without this the play calls below are silent.
          initKeyboardAudio();
        }}
        scene="/assets/skills-keyboard.spline"
      />
    </Suspense>
  );
};

export default AnimatedBackground;
