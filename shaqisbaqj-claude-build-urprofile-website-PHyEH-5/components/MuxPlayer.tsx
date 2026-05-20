"use client";

import MuxPlayerComponent from "@mux/mux-player-react";

interface MuxPlayerProps {
  playbackId: string;
  title?: string;
}

export default function MuxPlayer({ playbackId, title }: MuxPlayerProps) {
  return (
    <MuxPlayerComponent
      playbackId={playbackId}
      streamType="on-demand"
      title={title}
      autoPlay={false}
      muted={false}
      style={{ width: "100%", aspectRatio: "9/16" }}
      className="w-full"
    />
  );
}
