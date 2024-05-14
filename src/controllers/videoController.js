/**
 * 
 * watch
 * getEdit
 * postEdit
 * deleteVideo
 * getUpload
 * postUpload
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */

import Video from "../models/Video";
import User from "../models/USer";

export const home = async (req, res) => {
    const videos = await Video.findById({}).sort({ createdAt: "desc" });
    return res.render("home", { pageTitle: "Home", videos });
};

export const watch = async(req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    const onwer = await User.findById(video.owner);

    if(!video) {
        return res.render("404", { pageTitle: "Video not found." });
    }

    return res.render("watch", { pageTitle: video.title, video, onwer });
};

export const getEdit = async(req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);

    if(!video) {
        return res.render("404", { pageTitle: "Video not found." });
    }

    return res.render("edit", { pageTitle: `Edit : ${video.title}`, video });
};

export const postEdit = async(req, res) => {
    const { id } = req.params;
    const { title, description, hashtags } = req.body;
    const video = await Video.exists({ _id: id });

    if(!video) {
        return res.render("404", { pageTitle: "Video not found." });
    }

    await Video.findByIdAndUpdate(id, {
        title, 
        description, 
        hashtags: Video.formatHashtags(hashtags),
    })

    return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
    return res.render("upload", { pageTitle: "Upload Video" });
};

export const deleteVideo = (req, res) => {
    res.end();
}
export const postUpload = async (req, res) => {
    const { 
        user: { _id },
    } = req.session;
    const { path: fileUrl } = req.file;
    const { title, description, hashtags } = req.body;
    try {
        await Video.create({
            title, 
            description, 
            fileUrl,
            owner: _id,
            hashtags: Video.formatHashtags(hashtags),
        });
        return res.redirect("/");
    } catch (e) {
        return res.status(400).render("upload", {
            pageTitle: "Upload Error",
            errorMessage: e.errorMessage,
        });
    }
}
