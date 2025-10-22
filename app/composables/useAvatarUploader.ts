export function useAvatarUploader() {
  const { execute: performAction } = useGameAction()
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function upload(file: File) {
    isLoading.value = true
    error.value = null

    try {
      // 1. Lấy Pre-signed URL từ server
      const { uploadUrl, publicUrl } = await $fetch('/api/upload/presigned-url', {
        method: 'POST',
        body: {
          fileName: file.name,
          fileType: file.type
        }
      })

      // 2. Upload file trực tiếp lên R2/S3 bằng URL đã ký
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type
        }
      })

      if (!uploadResponse.ok) {
        throw new Error('Upload file thất bại.')
      }

      // 3. Cập nhật URL avatar mới vào nhân vật
      await performAction('character/updateAvatar', { avatarUrl: publicUrl })

      return { publicUrl }
    } catch (e: any) {
      error.value = e.message || 'Có lỗi xảy ra trong quá trình upload.'
      return { error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  return {
    upload,
    isLoading,
    error
  }
}
