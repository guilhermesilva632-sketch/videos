import { Composition } from "remotion";
import { CinematicPaulista } from "./paulista/CinematicPaulista";
import { cinematicSchema, defaultCinematicProps } from "./paulista/schema";

export const MyComposition = () => {
  return (
    <Composition
      id="Paulista"
      component={CinematicPaulista}
      // 8 seconds at 30fps.
      durationInFrames={240}
      fps={30}
      // 4K vertical (9:16) — suits the portrait frame and social/ad delivery.
      width={2160}
      height={3840}
      schema={cinematicSchema}
      defaultProps={defaultCinematicProps}
    />
  );
};
