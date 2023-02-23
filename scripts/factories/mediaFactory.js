class MediaFactory {
    constructor(data, type) {
        if (type === "image") {
            return new ImageObj(data)
        } else if (type === "video") {
            return new VideoObj(data)
        } else {
            throw "format inconnue"
        }
    }
}