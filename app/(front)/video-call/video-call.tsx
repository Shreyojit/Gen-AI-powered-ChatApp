"use client"

import { useEffect, useRef } from "react";
import { randomID } from "@/lib/utils/random";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

export function getUrlParams(url = window.location.href) {
  const urlStr = url.split("?")[1];
  if (!urlStr) return { roomID: randomID(5), userID: '', user: null };

  const params = new URLSearchParams(urlStr);
  const roomID = params.get("roomID") || randomID(5);
  const userID = params.get("userID") || ''; // Default to empty string if null
  const userStr = params.get("user") || '';

  let user = null;
  if (userStr) {
    try {
      user = JSON.parse(decodeURIComponent(userStr));
    } catch (e) {
      console.error("Failed to parse user parameter:", e);
    }
  }
  
  return { roomID, userID, user };
}

export default function VideoCall() {
  const { roomID, userID, user } = getUrlParams();
  const callContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initMeeting = async () => {
      if (!userID || !user || !user._id) {
        console.error("userID or user information is missing in the URL");
        return;
      }

      const res = await fetch(`/api/zegocloud?userID=${userID}`);
      console.log("res--->",res);
      if (!res.ok) {
        console.error("Failed to fetch token");
        return;
      }

      const { token, appID } = await res.json();
      const username = user.name || user.email?.split("@")[0] || 'Guest'; // Default to 'Guest' if name or email is missing

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(appID, token, roomID, userID, username);

      const zp = ZegoUIKitPrebuilt.create(kitToken);
      zp.joinRoom({
        container: callContainerRef.current!,
        sharedLinks: [
          {
            name: "Personal link",
            url:
              window.location.protocol +
              "//" +
              window.location.host +
              window.location.pathname +
              "?roomID=" +
              roomID,
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.GroupCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
        },
      });
    };

    if (typeof window !== "undefined") {
      initMeeting();
    }
  }, [roomID, userID, user]);

  return <div className="myCallContainer" ref={callContainerRef} style={{ width: "100vw", height: "100vh" }}></div>;
}
