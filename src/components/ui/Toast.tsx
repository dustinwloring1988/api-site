import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertCircle, X } from 'lucide-react'
import { useToast, type Toast } from '../../hooks/useToast'
import { cn } from '../../lib/utils'

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastComponent key={toast.id} toast={toast} onDismiss={dismiss} />
        ))}
      </AnimatePresence>
    </div>
  )
}

function ToastComponent({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.3 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.5 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex items-start space-x-3 rounded-lg p-4 shadow-lg max-w-sm',
        {
          'bg-white border border-gray-200': toast.variant === 'default',
          'bg-red-50 border border-red-200': toast.variant === 'destructive',
        }
      )}
    >
      <div className="flex-shrink-0">
        {toast.variant === 'default' ? (
          <CheckCircle className="h-5 w-5 text-green-500" />
        ) : (
          <AlertCircle className="h-5 w-5 text-red-500" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn(
          'text-sm font-medium',
          toast.variant === 'default' ? 'text-gray-900' : 'text-red-800'
        )}>
          {toast.title}
        </p>
        {toast.description && (
          <p className={cn(
            'mt-1 text-sm',
            toast.variant === 'default' ? 'text-gray-500' : 'text-red-600'
          )}>
            {toast.description}
          </p>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className={cn(
          'flex-shrink-0 rounded-md p-1 transition-colors',
          toast.variant === 'default' 
            ? 'text-gray-400 hover:text-gray-600' 
            : 'text-red-400 hover:text-red-600'
        )}
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  )
}