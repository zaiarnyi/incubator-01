import {valueResolutions, VideoType} from '../types/video.type';
import {random} from '../utils/random';

let videosArray: Array<VideoType> = Array.from({length: 10}, (_, i)=> ({
  "id": i,
  "title": 'title' + (i + 1),
  "author": 'author' + (i + 3),
  "canBeDownloaded":  i % 2 === 0,
  "minAgeRestriction": null,
  "createdAt": new Date().toISOString(),
  "publicationDate": new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
  "availableResolutions": [valueResolutions[random(0, valueResolutions?.length - 1)]]
}))



export const actions = {
  getAllVideos: (): Array<VideoType> => videosArray,
  getVideo: (id: number): VideoType | undefined => videosArray.find(item => item.id === id),
  deleteVideo: (id: number): void => {
    videosArray = videosArray.filter(item => item.id !== id);
  },
  createVideo: function (body: Pick<VideoType, "title" | "author" | "availableResolutions">): VideoType | undefined | void {
    const allVideo = this.getAllVideos();
    const idFromLastVideo = allVideo[allVideo?.length - 1].id;
    const newVideo: VideoType = {
      ...body,
      availableResolutions: body.availableResolutions?.length ? [body.availableResolutions as string] : null,
      id: idFromLastVideo + 1,
      "minAgeRestriction": null,
      "canBeDownloaded":  false,
      "createdAt": new Date().toISOString(),
      "publicationDate": new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
    }
    videosArray.push(newVideo)
    return newVideo;
  },
}
