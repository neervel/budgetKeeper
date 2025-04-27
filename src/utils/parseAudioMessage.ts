import path from 'node:path';
import axios from 'axios';
import fs from 'node:fs';
import { log } from './logger';
import { convertAudioToText } from '../clients/openAi.client';


const saveAudio = async (fileLink: URL, fileId: string): Promise<string> => {
  const pathToSave = `audio/${fileId}.ogg`;

  const voicePath = path.resolve(pathToSave);
  const response = await axios.get(fileLink.href, { responseType: "stream" })
  response.data.pipe(fs.createWriteStream(voicePath))

  await new Promise((resolve) => response.data.on("end", resolve));

  log.info(`Audio saved to ${pathToSave}`);

  return pathToSave;
};

export const parseAudioMessage = async (ctx: any): Promise<string> => {
  const fileId = ctx.message.voice.file_id
  const fileLink = await ctx.telegram.getFileLink(fileId)

  const audioPath = await saveAudio(fileLink, fileId);

  const text = await convertAudioToText(audioPath);

  fs.rm(audioPath, () => log.info(`Audio ${audioPath} deleted`));

  return text;
}
