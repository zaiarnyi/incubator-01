import {AvailableResolutionsEnum} from '../types/video.type';
import {random} from '../utils/random';
import {VideoType} from '../models/VideoModel';

let videosArray: Array<VideoType> = Array.from({length: 10}, (_, i)=> {
  const available = Object.keys(AvailableResolutionsEnum);
  return {
    "id": i,
    "title": 'title' + (i + 1),
    "author": 'author' + (i + 3),
    "canBeDownloaded":  i % 2 === 0,
    "minAgeRestriction": null,
    "createdAt": new Date().toISOString(),
    "publicationDate": new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
    "availableResolutions": [available[random(0, available?.length - 1)] as AvailableResolutionsEnum]
  }
})



export const videoRepository = {
  getAllVideos: (): Array<VideoType> => videosArray,
  getVideo: (id: number): VideoType | undefined => videosArray.find(item => item.id === id),
  deleteVideo: (id: number): void => {
    videosArray = videosArray.filter(item => item.id !== id);
  },
  createVideo: function (body: Pick<VideoType, "title" | "author" | "availableResolutions">): VideoType {
    const idFromLastVideo = videosArray[videosArray?.length - 1]?.id || 0;
    const newVideo: VideoType = {
      ...body,
      availableResolutions: body.availableResolutions?.length ? body.availableResolutions : null,
      id: idFromLastVideo + 1,
      "minAgeRestriction": null,
      "canBeDownloaded":  false,
      "createdAt": new Date().toISOString(),
      "publicationDate": new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
    }
    videosArray.push(newVideo)
    return newVideo;
  },
  updateVideo: function (body: Omit<VideoType, "createdAt" | "id">, id: number){
    videosArray = videosArray?.map(item=> {
      if(item.id === id){
        return {
          ...item,
          ...body
        }
      }
      return item;
    });
  },
  deleteAll: () => videosArray = [],
}
