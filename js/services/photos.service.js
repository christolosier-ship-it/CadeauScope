import { repositories } from '../db/repositories.js';
import { createPhoto } from '../models/photos.model.js';
export async function savePhoto(data){ const photo=createPhoto(data); await repositories.photos.put(photo); return photo; }
export const getPhoto = id => repositories.photos.get(id);
