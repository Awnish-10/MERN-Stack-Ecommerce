import { Avatar, Button, Typography } from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import React from "react";
import "./about.css";

const About = () => {
    const visitLinkedIn = () => {
        window.location = "https://www.linkedin.com/in/awnish-negi-268b521b7";
    };
    return (
        <div className="aboutSection">
            <div></div>
            <div className="aboutSectionGradient"></div>
            <div className="aboutSectionContainer">
                <Typography component="h1">About Us</Typography>

                <div>
                    <div>
                        <Avatar
                            style={{
                                width: "10vmax",
                                height: "10vmax",
                                margin: "2vmax 0",
                            }}
                            src="https://res.cloudinary.com/dslf9xkxe/image/upload/v1644569223/avatar/IMG_20180829_111113_o7vaw1.jpg"
                            alt="Founder"
                        />
                        <Typography>Awnish Negi</Typography>
                        <Button onClick={visitLinkedIn} color="primary">
                            Visit LinkedIn
                        </Button>
                        <span>
                            This is a sample wesbite made by @awnishNegi. Only
                            with the purpose to learn MERN Stack.
                        </span>
                    </div>
                    <div className="aboutSectionContainer2">
                        <Typography component="h2">Know More</Typography>
                        <a
                            href="https://www.linkedin.com/in/awnish-negi-268b521b7"
                            target="blank"
                        >
                            <LinkedInIcon className="linkedInSvgIcon" />
                        </a>

                        <a
                            href="https://www.instagram.com/awnishnegi"
                            target="blank"
                        >
                            <InstagramIcon className="instagramSvgIcon" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
