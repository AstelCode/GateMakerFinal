interface FontInfo {
  name: string;
  url: string;
}

export class FontLoader {
  constructor() {}

  private fontsRecord: FontInfo[] = [];

  addFont(name: string, url: string) {
    this.fontsRecord.push({ name, url });
  }

  registerFonts(fonts: FontInfo[]) {
    this.fontsRecord.push(...fonts);
  }

  async load() {
    await Promise.all(
      this.fontsRecord.map(async ({ name, url }) => {
        const fontFace = new FontFace(name, `url(${url})`);
        await fontFace.load();
        document.fonts.add(fontFace);
      }),
    );
  }
}
