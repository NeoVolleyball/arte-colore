"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion, type MotionProps } from "motion/react"

import { cn } from "@/lib/utils"

/*
 * arte-colore edits (see DECISIONS.md):
 *  - renders inline <span>s instead of an <h1> per word, so it can sit inside a heading;
 *  - the first word is server-rendered visible (AnimatePresence initial={false});
 *  - `cycles` stops the rotation back on the first word after N rounds and
 *    `paused` disables it (used for prefers-reduced-motion).
 */
interface WordRotateProps {
  words: string[]
  duration?: number
  motionProps?: MotionProps
  className?: string
  cycles?: number
  paused?: boolean
}

export function WordRotate({
  words,
  duration = 2500,
  motionProps = {
    initial: { opacity: 0, y: -50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 },
    transition: { duration: 0.25, ease: "easeOut" },
  },
  className,
  cycles = Infinity,
  paused = false,
}: WordRotateProps) {
  const [step, setStep] = useState(0)
  const lastStep = cycles * words.length

  useEffect(() => {
    if (paused || step >= lastStep) return
    const timer = setTimeout(() => setStep((s) => s + 1), duration)
    return () => clearTimeout(timer)
  }, [step, lastStep, duration, paused])

  const word = words[step % words.length]

  return (
    <span className="inline-block overflow-hidden py-2 align-bottom">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={word} className={cn("inline-block", className)} {...motionProps}>
          {word}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
