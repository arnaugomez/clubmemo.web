import { File, Upload } from "lucide-react";
import { PropsWithChildren, ReactNode, useCallback } from "react";
import { Accept, useDropzone } from "react-dropzone";
import { textStyles } from "../../styles/text-styles";
import { cn } from "../../utils/shadcn";

interface FileInputProps {
  onChange: (acceptedFile: File | undefined) => void;
  accept: Accept;
  /**
   * Maximum file size in bytes
   */
  maxSize: number;
  name: string;
  id?: string;
  fileIcon?: ReactNode;
}
export function FileInput({
  onChange,
  accept,
  maxSize,
  name,
  id,
  fileIcon,
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
    onDrop,
    accept,
    maxSize,
  });
  const acceptedFile = acceptedFiles[0];
  const rejectedFile = fileRejections[0];

  function getText() {
    if (isDragActive) {
      return "Suelta el archivo...";
    }
    if (acceptedFile) {
      return `${acceptedFile.name} - ${acceptedFile.size} bytes`;
    }
    return "Haz clic para seleccionar un archivo o déjalo caer aquí";
  }

  return (
    <>
      <div
        {...getRootProps({
          className: cn(
            "border-2 border-gray-300 border-dashed p-4 rounded-md cursor-pointer h-32 flex flex-col justify-center items-center",
            isDragActive && "bg-gray-100",
          ),
        })}
      >
        <input {...getInputProps({ name, id })} />
        <FileInputText>
          {acceptedFile ? fileIcon ?? <File /> : <Upload />}
        </FileInputText>
        <div className="h-4"></div>
        <FileInputText>{getText()}</FileInputText>
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

function FileInputText({ children }: PropsWithChildren) {
  return <p className={textStyles.muted}>{children}</p>;
}
