import React from "react";
import PropTypes from "prop-types";

const YoutubeEmbed = ({url}) => {
    // Extract the video ID from the URL
    const videoId = url.split("=")[1];

    // Create the embed code using the video ID
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;

    return (
        <div className="video-responsive">
            <iframe
                width="560px"
                height="360px"
                src={embedUrl}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Embedded youtube"
            />
        </div>
    );
};

YoutubeEmbed.propTypes = {
    videoId: PropTypes.string.isRequired,
};

export default YoutubeEmbed;
