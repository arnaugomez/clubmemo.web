import { FileIcon, Upload } from "lucide-react";
import type { PropsWithChildren, ReactNode} from "react";
import { useCallback } from "react";
import type { Accept} from "react-dropzone";
import { useDropzone } from "react-dropzone";
import { textStyles } from "../../styles/text-styles";
import { cn } from "../../utils/shadcn";

type Value = File | string | undefined;

interface FileInputProps {
  value: Value;
  onChange: (acceptedFile: File | undefined) => void;
  accept: Accept;
  /**
   * Maximum file size in bytes
   */
  maxSize: number;
  name: string;
  id?: string;
  fileIcon?: ReactNode;
  isImage?: boolean;
}
export function FileInput({
  value,
  onChange,
  accept,
  maxSize,
  name,
  id,
  fileIcon,
  isImage,
}: FileInputProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onChange(acceptedFiles[0]);
    },
    [onChange],
  );
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    acceptedFiles,
    fileRejections,
  } = useDropzone({
    onDropAccepted: onDrop,
    onDropRejected: () => onChange(undefined),
    accept,
    maxSize,
  });
  const acceptedFile = acceptedFiles[0];
  const rejectedFile = fileRejections[0];

  return (
    <>
      <div
        {...getRootProps({
          className: cn(
            "border-2 border-gray-300 border-dashed p-4 rounded-lg cursor-pointer flex flex-col justify-center items-center min-w-0",
            isImage ? "h-48" : "h-32",
            isDragActive && "bg-gray-100",
          ),
        })}
      >
        <input {...getInputProps({ name, id })} />
        <Result
          isImage={isImage}
          value={value}
          acceptedFile={acceptedFile}
          fileIcon={fileIcon}
          isDragActive={isDragActive}
        />
      </div>
      {rejectedFile &&
        rejectedFile.errors.map((value) => (
          <p
            key={value.code}
            className={"text-sm font-medium text-destructive"}
          >
            {value.message}
          </p>
        ))}
    </>
  );
}

interface ResultProps {
  value?: Value;
  isImage?: boolean;
  acceptedFile?: File;
  fileIcon?: ReactNode;
  isDragActive: boolean;
}

export function Result({
  value,
  isImage,
  acceptedFile,
  fileIcon,
  isDragActive,
}: ResultProps) {
  const file = acceptedFile ?? value;
  function getText() {
    if (isDragActive) {
      return "Suelta el archivo...";
    }
    if (typeof file === "string") {
      return isImage ? "Imagen subida" : "Archivo subido";
    }
    if (file) {
      return `${file.name} - ${file.size} bytes`;
    }
    return "Haz clic para seleccionar un archivo o déjalo caer aquí";
  }

  function getPreview() {
    if (file) {
      if (isImage) {
        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="h-20 min-w-0 max-w-full rounded-md object-contain"
            src={typeof file === "string" ? file : URL.createObjectURL(file)}
            alt=""
          />
        );
      }
      return <FileInputText>{fileIcon ?? <FileIcon />}</FileInputText>;
    }
    return (
      <FileInputText>
        <Upload />
      </FileInputText>
    );
  }

  return (
    <>
      {getPreview()}
      <div className="h-4"></div>
      <FileInputText>{getText()}</FileInputText>
    </>
  );
}

function FileInputText({ children }: PropsWithChildren) {
  return (
    <p className={cn(textStyles.muted, "max-w-full break-words text-center")}>
      {children}
    </p>
  );
}
