import { useState, useRef } from "react"
import imageCompression from "browser-image-compression"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { makePublicClient } from "~/supa-clents";
import { getUserInitials, type UserProfile } from "~/feature/users/pages/profile-edit";
import { SquarePen } from "lucide-react";
import { useFetcher } from "react-router";

const supabase = makePublicClient

type AvatarUploaderProps = {
    userProfile: UserProfile
    loginUserId: string
}

export default function AvatarUploader({ loginUserId, userProfile }: AvatarUploaderProps) {
    const [avatarUrl, setAvatarUrl] = useState<string | null>(userProfile.profile_url)
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement | null>(null)

    const bucket = "avatars"
    const fetcher = useFetcher();

    // 🔹 정사각형 크롭 함수
    const cropToSquare = (file: File): Promise<File> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = (e) => {
                const img = new Image()
                img.onload = () => {
                    const side = Math.min(img.width, img.height)
                    const canvas = document.createElement("canvas")
                    canvas.width = side
                    canvas.height = side
                    const ctx = canvas.getContext("2d")
                    if (!ctx) return reject("Canvas context not available")

                    // 중앙 기준 크롭
                    const offsetX = (img.width - side) / 2
                    const offsetY = (img.height - side) / 2
                    ctx.drawImage(img, offsetX, offsetY, side, side, 0, 0, side, side)

                    canvas.toBlob((blob) => {
                        if (!blob) return reject("Blob 생성 실패")
                        resolve(new File([blob], file.name, { type: "image/jpeg" }))
                    }, "image/jpeg")
                }
                if (e.target?.result) img.src = e.target.result as string
            }
            reader.onerror = reject
            reader.readAsDataURL(file)
        })
    }

    const deleteProfileFetcher = useFetcher();
    const uploadAvatar = async (file: File) => {
        try {
            setUploading(true)

            // 1. 정사각형 크롭
            const croppedFile = await cropToSquare(file)

            // 2. 250kb 이하 압축
            const compressedFile = await imageCompression(croppedFile, {
                maxSizeMB: 0.25,
                maxWidthOrHeight: 512,
                useWebWorker: true,
            })

            const filePath = `${loginUserId}/${Date.now()}`

            // 기존 avatar 제거
            void deleteProfileFetcher.submit({},{
                method: "DELETE",
                action: "/api/users/delete-profile",
            })

            // Supabase Storage 업로드
            const { error } = await supabase.storage
                .from(bucket)
                .upload(filePath, compressedFile, {
                    contentType: compressedFile.type,
                    upsert: false
                })

            if (!error) {
                const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)
                setAvatarUrl(data.publicUrl)
                void fetcher.submit({
                        beforeUserName: userProfile.username,
                        nickname: userProfile.nickname,
                        username: userProfile.username,
                        profileUrl: data.publicUrl,
                    }, {
                        method: "POST",
                        action: "/api/users/update-profile",
                    }
                );
            } else {
                setAvatarUrl(userProfile.profile_url)
                console.log(error, "파일 업로드 실패")
            }


        } catch (err) {
            console.error("Upload error:", err)
        } finally {
            setUploading(false)
        }

    }

    const handleFileChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0]
        if (file) {
            await uploadAvatar(file)
        }
    }

    return (
        <div className="flex flex-col items-center gap-2">
            <div
                className={`relative cursor-pointer group ${
                    uploading ? "opacity-50" : "hover:opacity-80"
                }`}
                onClick={() => fileInputRef.current?.click()}>
                <SquarePen
                    className="opacity-0 group-hover:opacity-80 z-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white size-9"/>
                <Avatar className="h-20 w-20 md:h-30 md:w-30">
                    <AvatarImage src={avatarUrl || undefined} alt={userProfile.nickname}/>
                    <AvatarFallback className="bg-primary/10 text-lg font-semibold">
                        {getUserInitials(userProfile.username)}
                    </AvatarFallback>
                </Avatar>
                {uploading && (
                    <div
                        className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-sm rounded-full">
                        업로드 중...
                    </div>
                )}
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
            />
        </div>
    )
}
