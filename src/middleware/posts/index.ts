import {Schema} from 'express-validator';
import {DB_NAME_COLLECTION_BLOG, INVALID_VALUE, MAX_LENGTH_VALUE, REQUIRED_FIELD} from '../../constants';
import {DB} from '../../DB';
import {BlogModel} from '../../models/blog.model';

const arrayToSchema: Array<{name: string, lengthItem: number}> = [
  {
    name: "title",
    lengthItem: 30,
  },
  {
    name: "shortDescription",
    lengthItem: 100,
  },
  {
    name: "content",
    lengthItem: 1000,
  }
]

export const schemaPost = (withId = false): Schema=> ({
  ...(withId && {id: {
      in: ['params'],
      errorMessage: INVALID_VALUE,
    }}),
  ...(arrayToSchema.reduce((acc, item)=> {
    // @ts-ignore
    acc[item.name] = {
        exists:  {
          bail: true,
          errorMessage: REQUIRED_FIELD,
        },
        isString: {
          bail: true,
          errorMessage: INVALID_VALUE,
        },
        trim: true,
        notEmpty: {
          bail: true,
          errorMessage: REQUIRED_FIELD,
        },
        isLength: {
          errorMessage: MAX_LENGTH_VALUE(item.lengthItem),
          options: { max: item.lengthItem },
        },
      }
    return acc;
  }, {})),
  blogId: {
      custom: {
        options: async (value) => {
          if(!value?.length || typeof value !== 'string' || /\D/g.test(value)){
            throw new Error(`${value} is not correct value`);
          }
          const checkRealId = await DB<BlogModel>(DB_NAME_COLLECTION_BLOG).findOne({id: value});
          if(!checkRealId){
            throw new Error(`blog with "${value}" not found`);
          }
        },
      },
  }
})

