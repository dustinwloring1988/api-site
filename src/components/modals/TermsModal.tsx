import React from 'react'
import { Modal } from '../ui/Modal'

interface TermsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function TermsModal({ isOpen, onClose }: TermsModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Terms of Service">
      <div className="space-y-4 text-gray-600 max-h-[60vh] overflow-y-auto">
        <p>
          <strong>Last updated:</strong> {new Date().toLocaleDateString()}
        </p>
        <p>
          Please read these Terms of Service ("Terms", "Terms of Service")
          carefully before using the website (the "Service") operated by us.
        </p>
        <h3 className="text-lg font-semibold text-gray-800 pt-2">
          1. Acceptance of Terms
        </h3>
        <p>
          By accessing or using the Service, you agree to be bound by these
          Terms. If you disagree with any part of the terms, then you may not
          access the Service.
        </p>
        <h3 className="text-lg font-semibold text-gray-800 pt-2">
          2. Changes to Terms
        </h3>
        <p>
          We reserve the right, at our sole discretion, to modify or replace
          these Terms at any time. If a revision is material we will try to
          provide at least 30 days' notice prior to any new terms taking
          effect. What constitutes a material change will be determined at our
          sole discretion.
        </p>
        <h3 className="text-lg font-semibold text-gray-800 pt-2">
          3. Use of Service
        </h3>
        <p>
          You agree not to use the Service for any unlawful purpose or in any
          way that interrupts, damages, or impairs the service.
        </p>
        <h3 className="text-lg font-semibold text-gray-800 pt-2">
          4. Intellectual Property
        </h3>
        <p>
          The Service and its original content, features and functionality are
          and will remain the exclusive property of us and its licensors.
        </p>
        <h3 className="text-lg font-semibold text-gray-800 pt-2">
          5. Termination
        </h3>
        <p>
          We may terminate or suspend access to our Service immediately,
          without prior notice or liability, for any reason whatsoever,
          including without limitation if you breach the Terms.
        </p>
      </div>
    </Modal>
  )
}
