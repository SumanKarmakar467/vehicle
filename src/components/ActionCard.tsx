"use client"
import React from 'react'

function ActionCard({icon, title, button, onClick}:any){
  return (
    <div className="bg-white rounded-2xl md:rounded-3xl p-5 sm:p-6 md:p- shadow-lg border flex flex-col sm:flex-row justify-between items-center sm:items-center gap-5">
      <div className="flex items-center gap-4">
        <div className="bg-black text-white p-3 md:p-4 rounded-xl shrink-0">{icon}</div>
        <div className="text-base sm:text-lg md:text-sl font-semibold">{title}</div>
      </div>
      <button className="w-full sm:w-auto bg-black text-white px-6 py-2.5 rounded-xl text-sm sm:text-base font-medium transition hover:bg-gray-800" onClick={onClick}>{button}</button>
    </div>
  )
}

export default ActionCard
