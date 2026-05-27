/* eslint-disable @typescript-eslint/no-explicit-any */
import { ILoader } from "./ILoader";

interface FontInfo {
  name: string;
  url: string;
}

export type IFontData = FontInfo[];
export class FontLoader implements ILoader<IFontData> {
  name: string = "font";
  register(
    name: string,
    data: IFontData,
    onLoaded?: (data: { name: string; data: any }) => void
  ): () => Promise<{ name: string; data: any }> {
    const callback = async () => {
      for (const info of data) {
        const fontFace = new FontFace(info.name, `url(${info.url})`);
        await fontFace.load();
        document.fonts.add(fontFace);
      }
      onLoaded?.({ name, data: undefined });
      return { name, data: undefined };
    };
    return callback;
  }
}
