import { Toast } from 'uikit/widgets/Toast'

type ToastSignature = (title: Toast['title'], description?: Toast['description'], hash?: Toast['hash']) => void

export interface ToastContextApi {
	toasts: Toast[]
	clear: () => void
	remove: (id: string) => void
	toast: ({ title, description, hash, type }: Omit<Toast, 'id'>) => void
	toastError: ToastSignature
	toastInfo: ToastSignature
	toastSuccess: ToastSignature
	toastWarning: ToastSignature
}
