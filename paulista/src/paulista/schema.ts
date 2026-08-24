import { z } from "zod";

// Schema for the cinematic still-to-video composition.
// Everything here is editable live in the Remotion Studio right-hand panel.
export const cinematicSchema = z.object({
  // File placed in /public. Replace public/paulista.jpg with your own frame
  // (keep the name) or point this at another file in /public.
  imageSrc: z.string(),

  // Camera push-in: the image scales from zoomStart to zoomEnd across the shot.
  zoomStart: z.number().min(1).max(2),
  zoomEnd: z.number().min(1).max(2),

  // Simulated tracking drift, expressed as a fraction of the frame.
  // Positive panX drifts the framing right-to-left over the shot.
  panX: z.number().min(-0.2).max(0.2),
  panY: z.number().min(-0.2).max(0.2),

  // Cinematic grade / atmosphere toggles.
  vignette: z.number().min(0).max(1),
  grade: z.boolean(),
  grain: z.boolean(),
  letterbox: z.boolean(),

  // Open on black, settle to black at the end (in seconds).
  fadeInSeconds: z.number().min(0).max(3),
  fadeOutSeconds: z.number().min(0).max(3),
});

export type CinematicProps = z.infer<typeof cinematicSchema>;

export const defaultCinematicProps: CinematicProps = {
  imageSrc: "paulista.jpg",
  zoomStart: 1.12,
  zoomEnd: 1.32,
  panX: 0.05,
  panY: 0.03,
  vignette: 0.55,
  grade: true,
  grain: true,
  letterbox: true,
  fadeInSeconds: 0.6,
  fadeOutSeconds: 0.7,
};
