'use client';

import { createContext, useContext, useState } from "react";

const TrackContext = createContext({})

export const TrackContextProvider = ({ children }:{
  children: React.ReactNode;
}) => {
    const initValue={
        _id: "",
        title: "",
        description: "",
        category: "",
        imgUrl: "",
        trackUrl: "",
        countLike: 0,
        countPlay: 0,
        uploader: {
          _id: "",
          email: "",
          name: "",
          role: "",
          type: "",
        },
        isDeleted: false,
        isPlaying:false,
        createdAt: "",
        updatedAt: "",

    }
    const [currentTrack, setCurrentTrack] = useState<ITrackVjp>(initValue);

    return (
        <TrackContext.Provider value={{ currentTrack, setCurrentTrack }}>
            {children}
        </TrackContext.Provider>
    )
};

export const useTrackContext = () => useContext(TrackContext);