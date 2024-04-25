export interface PresignedUrlModelData {
  url: string;
  fields: Record<string, string>;
}

export class PresignedUrlModel {
  constructor(readonly data: PresignedUrlModelData) {}

  get url(): string {
    return this.data.url;
  }

  get fields(): Record<string, string> {
    return this.data.fields;
  }
}
