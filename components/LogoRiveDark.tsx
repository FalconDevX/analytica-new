"use client";

import { useRive } from "@rive-app/react-canvas";

export default function LogoRiveDark() {
  const { RiveComponent } = useRive({
    src: "/analyticalogo-dark.riv",
    stateMachines: "State Machine 1",
    autoplay: true,
  });

  return <RiveComponent />;
}
