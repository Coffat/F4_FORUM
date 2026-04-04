'use client'

/**
 * TimeColumn - Cột hiển thị mốc giờ (07:00 - 21:00).
 * Mỗi khung giờ tương ứng với 1 hàng trong Grid.
 */
export const TimeColumn = () => {
    const hours = Array.from({ length: 15 }).map((_, i) => i + 7) // 07:00 - 21:00

    return (
        <div className="flex flex-col text-right pr-4 text-xs font-black text-slate-400 select-none">
            {hours.map((hour) => (
                <div 
                    key={hour} 
                    className="h-24 flex items-start justify-end -mt-2 first:mt-0 transition-opacity hover:opacity-100 opacity-60"
                >
                    {hour < 10 ? `0${hour}` : hour}:00
                </div>
            ))}
        </div>
    )
}
