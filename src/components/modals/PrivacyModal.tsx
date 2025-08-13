import React from 'react'
import { Modal } from '../ui/Modal'

interface PrivacyModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Privacy Policy">
      <div className="space-y-4 text-gray-600 max-h-[60vh] overflow-y-auto">
        <p>
          <strong>Last updated:</strong> {new Date().toLocaleDateString()}
        </p>
        <p>
          We are committed to protecting your privacy. This Privacy Policy
          explains how we collect, use, and share your personal information.
        </p>
        <h3 className="text-lg font-semibold text-gray-800 pt-2">
          1. Information We Collect
        </h3>
        <p>
          We may collect personal information from you, such as your name and
          email address, when you register for an account or contact us.
        </p>
        <h3 className="text-lg font-semibold text-gray-800 pt-2">
          2. How We Use Your Information
        </h3>
        <p>
          We may use your personal information to provide and improve our
          services, to communicate with you, and to personalize your
          experience.
        </p>
        <h3 className="text-lg font-semibold text-gray-800 pt-2">
          3. How We Share Your Information
        </h3>
        <p>
          We will not share your personal information with third parties
          without your consent, except as required by law.
        </p>
        <h3 className="text-lg font-semibold text-gray-800 pt-2">
          4. Data Security
        </h3>
        <p>
          We take reasonable measures to protect your personal information
          from unauthorized access, use, or disclosure.
        </p>
        <h3 className="text-lg font-semibold text-gray-800 pt-2">
          5. Changes to This Policy
        </h3>
        <p>
          We may update this Privacy Policy from time to time. We will notify
          you of any changes by posting the new Privacy Policy on this page.
        </p>
      </div>
    </Modal>
  )
}
