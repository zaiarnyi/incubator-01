export const valueResolutions = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160']

export interface VideoType {
  "id": number,
  "title": string,
  "author": string,
  "canBeDownloaded": boolean,
  "minAgeRestriction": null | number,
  "createdAt": string,
  "publicationDate": string,
  "availableResolutions"?: string[] | string | null,
}
