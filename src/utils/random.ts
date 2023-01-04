export const random = (min:number = 0, max: number):number => {
  return Math.floor(min + Math.random() * (max - min));
}
