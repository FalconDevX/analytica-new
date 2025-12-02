"use client";

import { useRive } from "@rive-app/react-canvas";

export default function LogoRiveLight() {
  const { RiveComponent } = useRive({
    src: "/analyticalogo.riv",
    stateMachines: "State Machine 1",
    autoplay: true,
  });

  return <RiveComponent />;
}
