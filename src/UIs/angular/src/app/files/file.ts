export interface IFile {
  id: string;

  name: string | null;

  description: string | null;

  size: number;

  uploadedTime: Date | null;

  fileName: string | null;

  formFile: File | null;

  encrypted: boolean;
}
