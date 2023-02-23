class MediaObj { //pour récup la data extend to ma class separé qui récup le JSON
    constructor(media, id) {
        this._medias = media.toto;
        this._image = media.image;
        this._video = media.video;
    }

    get mediaPath() {
        return `/assets/medias/${this.image}`
    }

    // ImageObj(media) {
    //     return this.image ;
    // }
}