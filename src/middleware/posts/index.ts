import {Schema} from 'express-validator';
import {INVALID_VALUE, MAX_LENGTH_VALUE, REQUIRED_FIELD} from '../../constants';

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
      isInt: true,
      toInt: true,
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
        options: (value) => !(!value || !value?.length || typeof value !== 'string'),
      },
  }
})

