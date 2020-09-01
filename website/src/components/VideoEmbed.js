import React from "react";


export default ({youTubeVideo, title = "Embedded video", is_fullwidth}) => {
  let videoURL = null;
  if (!!youTubeVideo) {
    videoURL = `https://www.youtube.com/embed/${youTubeVideo}`;
  }

  if (videoURL === null) {
    return null;
  }

  return (
    <div className="videoContainer">
      <iframe
        className="video"
        src={videoURL}
        frameborder="0"
        title={title}
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen>
      </iframe>
    </div>
  );
};