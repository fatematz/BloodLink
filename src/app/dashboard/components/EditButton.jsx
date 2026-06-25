// components/EditButton.jsx
"use client";
import { useState } from "react";
import { Edit2 } from "lucide-react";
import EditRequestModal from "./EditRequestModal";


export default function EditButton({ request }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="inline-flex p-1.5 text-gray-400 hover:text-blue-600 rounded-md hover:bg-blue-50 transition"
      >
        <Edit2 size={16} />
      </button>

      {isModalOpen && (
        <EditRequestModal 
          request={request} 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </>
  );
}