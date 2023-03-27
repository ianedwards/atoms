import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react"
import { api } from "@/utils/api"
import axios from "axios"
import { FolderPlus } from "lucide-react"
import { useSession } from "next-auth/react"
import { useDropzone } from "react-dropzone"

import { Spinner } from "../ui"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"

function UploadAvatar({
  showUploadAvatarModal,
  setShowUploadAvatarModal,
}: {
  showUploadAvatarModal: boolean
  setShowUploadAvatarModal: Dispatch<SetStateAction<boolean>>
}) {
  const ctx = api.useContext()
  const { data } = useSession()

  const [currentFile, setCurrentFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [uploadError, setUploadError] = useState<boolean>(false)

  const createUrlsMutation = api.upload.urls.useMutation()
  const updateAvatarMutation = api.user.changeAvatar.useMutation()

  const selectFiles = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target
    if (files?.[0]) {
      setCurrentFile(files[0])
    }
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles?.[0]) {
      setCurrentFile(acceptedFiles[0])
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    multiple: false,
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
  })

  const onClose = useCallback(() => {
    setShowUploadAvatarModal(false)
    setUploadError(false)
    setCurrentFile(null)
  }, [setShowUploadAvatarModal])

  const uploadAvatar = useCallback(async () => {
    try {
      if (!data) {
        return
      }

      setIsUploading(true)
      if (currentFile) {
        const urls = await createUrlsMutation.mutateAsync()

        const { PUT, key } = urls

        await axios.put(PUT, currentFile, {
          headers: {
            "Content-Type": currentFile.type,
          },
        })

        await updateAvatarMutation.mutateAsync({
          key,
        })

        ctx.user.getById.invalidate({ id: data.user.id })
        ctx.user.list.invalidate()
        onClose()
      }

      setIsUploading(false)
    } catch (err) {
      setUploadError(true)
      setIsUploading(false)
    }
  }, [
    createUrlsMutation,
    ctx.user.getById,
    ctx.user.list,
    currentFile,
    data,
    onClose,
    updateAvatarMutation,
  ])

  const renderModalState = () => {
    if (isUploading) {
      return (
        <div className="mt-2 flex items-center justify-center">
          <div className="h-12 w-12 text-neutral-600">
            <Spinner />
          </div>
        </div>
      )
    }

    if (currentFile) {
      return (
        <>
          {uploadError && (
            <div className="mt-4 text-red-500 ">Something went wrong!</div>
          )}
          <div className="truncate whitespace-nowrap py-4 text-sm text-gray-500">
            {currentFile.name}
          </div>
        </>
      )
    }

    return (
      <label
        className="relative mt-2 block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
        htmlFor="fileUpload"
        {...getRootProps()}
      >
        <input
          {...getInputProps()}
          id="fileUpload"
          type="file"
          onChange={(e) => selectFiles(e)}
          hidden
        />
        <FolderPlus className="mx-auto h-12 w-12 text-gray-400" />
        <span className="mt-2 block text-sm font-medium text-gray-900">
          {isDragActive ? "Drop files here!" : "Select Files"}
        </span>
      </label>
    )
  }

  return (
    <Dialog
      open={showUploadAvatarModal}
      onOpenChange={setShowUploadAvatarModal}
    >
      <DialogTrigger asChild>
        <div className="hover:text-underline cursor-pointer text-blue-500 hover:text-blue-600">
          <p>Change Avatar</p>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Upload Avatar</DialogTitle>
          <DialogDescription>
            Your new avatar will be shown on your profile
          </DialogDescription>
        </DialogHeader>
        {renderModalState()}
        <DialogFooter>
          <Button onClick={uploadAvatar} disabled={!currentFile}>
            <>
              {isUploading ? (
                <div className="h-5 w-5 text-white">
                  <Spinner />
                </div>
              ) : (
                "Upload!"
              )}
            </>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function useUploadAvatarModal() {
  const [showUploadAvatarModal, setShowUploadAvatarModal] = useState(false)

  const UploadAvatarModal = useCallback(() => {
    return (
      <UploadAvatar
        showUploadAvatarModal={showUploadAvatarModal}
        setShowUploadAvatarModal={setShowUploadAvatarModal}
      />
    )
  }, [showUploadAvatarModal, setShowUploadAvatarModal])
  setShowUploadAvatarModal
  return useMemo(
    () => ({
      showUploadAvatarModal,
      setShowUploadAvatarModal,
      UploadAvatarModal,
    }),
    [UploadAvatarModal, showUploadAvatarModal, setShowUploadAvatarModal]
  )
}
