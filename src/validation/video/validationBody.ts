import {isIsoDate, showError} from '../../utils/helpers';
import {AvailableResolutionsEnum} from '../../types/video.type';
import {Request, Response} from 'express';
import {VideoType} from '../../models/VideoModel';

export const validationBody = (req: Request, res: Response, fullValidation = false): boolean | undefined => {
 try {
   const body: Omit<VideoType, "createdAt" | "id">  = req.body;
   const errorsMessages = [];
   if(typeof body?.title !== 'string' || !body?.title?.trim()?.length){
     errorsMessages.push(showError('title', "Not specified"));
   }
   if(body?.title?.trim()?.length > 40){
     errorsMessages.push(showError('title', "Longer than 40 characters"));
   }
   if(typeof body?.author !== 'string' || !body?.author?.trim()?.length){
     errorsMessages.push(showError('author', "Not specified"));
   }
   if(body?.author?.trim()?.length > 20){
     errorsMessages.push(showError('author', "Longer than 40 characters"));
   }

   if(body?.availableResolutions?.length){
     const isHasAvailable = body?.availableResolutions.every(item => Object.keys(AvailableResolutionsEnum).includes(item));
     if(!isHasAvailable){
       errorsMessages.push(showError('availableResolutions', "Not listed correctly"));
     }
   }
   if(fullValidation){
     if(body.hasOwnProperty('minAgeRestriction') && (typeof body?.minAgeRestriction !== 'number' || (body.minAgeRestriction < 1 || body.minAgeRestriction > 18))){
       errorsMessages.push(showError('minAgeRestriction', "Not listed correctly"));
     }
     if(body.hasOwnProperty('publicationDate') && (typeof body?.publicationDate !== 'string' || !isIsoDate(body.publicationDate))){
       errorsMessages.push(showError('publicationDate', "Longer than 40 characters"));
     }
     if(body.hasOwnProperty('canBeDownloaded') && typeof body.canBeDownloaded !== 'boolean'){
       errorsMessages.push(showError('canBeDownloaded', "canBeDownloaded can be a boolean value"));
     }
   }
   if(errorsMessages?.length){
     res.status(400).json({errorsMessages});
     return true;
   }
 }catch (e) {
   console.log(e)
 }
}
