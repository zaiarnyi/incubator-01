import {AvailableResolutionsEnum} from '../../types/video.type';

export interface VideoType {
  "id": number,
  "title": string,
  "author": string,
  "canBeDownloaded": boolean,
  "minAgeRestriction": null | number,
  "createdAt": string,
  "publicationDate": string,
  "availableResolutions": Array<AvailableResolutionsEnum> | null,
}
